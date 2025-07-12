-- Add marketplace features to support global agent sharing

-- Add is_public column to agents table
ALTER TABLE agents ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;

-- Add performance tracking columns if they don't exist
ALTER TABLE agents ADD COLUMN IF NOT EXISTS total_return_pct DECIMAL(10,4) DEFAULT 0;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS sharpe_ratio DECIMAL(10,4) DEFAULT 0;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS max_drawdown_pct DECIMAL(10,4) DEFAULT 0;

-- Add agent cloning/copying functionality
CREATE TABLE IF NOT EXISTS agent_clones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    cloned_agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    cloned_by_user_id TEXT NOT NULL,
    cloned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(original_agent_id, cloned_by_user_id)
);

-- Add agent ratings and reviews
CREATE TABLE IF NOT EXISTS agent_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agent_id, user_id)
);

-- Add agent followers/subscribers
CREATE TABLE IF NOT EXISTS agent_followers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    follower_user_id TEXT NOT NULL,
    followed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notifications_enabled BOOLEAN DEFAULT TRUE,
    UNIQUE(agent_id, follower_user_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_agents_public ON agents(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_agents_performance ON agents(total_return_pct DESC, sharpe_ratio DESC);
CREATE INDEX IF NOT EXISTS idx_agent_reviews_rating ON agent_reviews(agent_id, rating);
CREATE INDEX IF NOT EXISTS idx_agent_followers_user ON agent_followers(follower_user_id);

-- Create view for public agent marketplace
CREATE OR REPLACE VIEW public_agents AS
SELECT 
    a.*,
    pm.total_trades,
    pm.winning_trades,
    pm.total_pnl,
    pm.win_rate,
    pm.total_volume,
    COALESCE(ar.avg_rating, 0) as avg_rating,
    COALESCE(ar.review_count, 0) as review_count,
    COALESCE(af.follower_count, 0) as follower_count
FROM agents a
LEFT JOIN performance_metrics pm ON a.id = pm.agent_id
LEFT JOIN (
    SELECT 
        agent_id,
        AVG(rating::DECIMAL) as avg_rating,
        COUNT(*) as review_count
    FROM agent_reviews
    GROUP BY agent_id
) ar ON a.id = ar.agent_id
LEFT JOIN (
    SELECT 
        agent_id,
        COUNT(*) as follower_count
    FROM agent_followers
    GROUP BY agent_id
) af ON a.id = af.agent_id
WHERE a.is_public = TRUE
ORDER BY a.total_return_pct DESC, pm.total_pnl DESC;

-- Function to clone an agent
CREATE OR REPLACE FUNCTION clone_agent(
    original_agent_id_param UUID,
    new_user_id_param TEXT,
    new_name_param TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    new_agent_id UUID;
    original_agent agents%ROWTYPE;
BEGIN
    -- Get original agent details
    SELECT * INTO original_agent FROM agents WHERE id = original_agent_id_param AND is_public = TRUE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Agent not found or not public';
    END IF;
    
    -- Insert cloned agent
    INSERT INTO agents (
        user_id,
        name,
        description,
        strategy_type,
        risk_tolerance,
        trading_frequency,
        initial_capital,
        current_capital,
        parameters,
        is_public
    ) VALUES (
        new_user_id_param,
        COALESCE(new_name_param, 'Copy of ' || original_agent.name),
        'Cloned from: ' || original_agent.description,
        original_agent.strategy_type,
        original_agent.risk_tolerance,
        original_agent.trading_frequency,
        original_agent.initial_capital,
        original_agent.initial_capital, -- Reset capital
        original_agent.parameters,
        FALSE -- Clones start as private
    ) RETURNING id INTO new_agent_id;
    
    -- Record the cloning relationship
    INSERT INTO agent_clones (original_agent_id, cloned_agent_id, cloned_by_user_id)
    VALUES (original_agent_id_param, new_agent_id, new_user_id_param);
    
    RETURN new_agent_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update agent performance metrics
CREATE OR REPLACE FUNCTION update_agent_performance_summary() RETURNS TRIGGER AS $$
BEGIN
    UPDATE agents SET
        total_return_pct = CASE 
            WHEN initial_capital > 0 THEN ((current_capital - initial_capital) / initial_capital) * 100
            ELSE 0
        END,
        sharpe_ratio = CASE
            WHEN total_return_pct > 0 THEN total_return_pct / GREATEST(abs(max_drawdown_pct), 1)
            ELSE 0
        END
    WHERE id = COALESCE(NEW.agent_id, OLD.agent_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update performance metrics
DROP TRIGGER IF EXISTS trigger_update_agent_performance ON performance_metrics;
CREATE TRIGGER trigger_update_agent_performance
    AFTER INSERT OR UPDATE OR DELETE ON performance_metrics
    FOR EACH ROW EXECUTE FUNCTION update_agent_performance_summary();

-- Sample data for testing marketplace
INSERT INTO agents (user_id, name, description, strategy_type, risk_tolerance, trading_frequency, initial_capital, current_capital, is_public, total_return_pct) VALUES
('demo-user-1', 'Momentum Master', 'High-performance momentum trading agent with 87% win rate', 'momentum', 'high', 'hourly', 10000, 12450, TRUE, 24.5),
('demo-user-2', 'Value Hunter', 'Conservative value investing strategy focusing on undervalued stocks', 'value_investing', 'low', 'weekly', 25000, 28750, TRUE, 15.0),
('demo-user-3', 'Growth Rocket', 'Aggressive growth strategy targeting high-growth tech stocks', 'growth_investing', 'high', 'daily', 15000, 19200, TRUE, 28.0)
ON CONFLICT (user_id, name) DO NOTHING;

-- Add sample performance metrics
INSERT INTO performance_metrics (agent_id, total_trades, winning_trades, total_pnl, win_rate, total_volume) 
SELECT 
    a.id,
    FLOOR(RANDOM() * 100 + 50)::INTEGER,
    FLOOR(RANDOM() * 70 + 30)::INTEGER,
    (a.current_capital - a.initial_capital),
    FLOOR(RANDOM() * 40 + 60),
    FLOOR(RANDOM() * 500000 + 100000)
FROM agents a 
WHERE a.is_public = TRUE
ON CONFLICT (agent_id) DO NOTHING;

-- Add sample reviews
INSERT INTO agent_reviews (agent_id, user_id, rating, review_text)
SELECT 
    a.id,
    'reviewer-' || generate_random_uuid()::TEXT,
    FLOOR(RANDOM() * 2 + 4)::INTEGER, -- 4-5 star ratings
    CASE FLOOR(RANDOM() * 3)
        WHEN 0 THEN 'Great performance and consistent returns!'
        WHEN 1 THEN 'Solid strategy, would recommend to others.'
        ELSE 'Impressive results, following this agent closely.'
    END
FROM agents a 
WHERE a.is_public = TRUE
CROSS JOIN generate_series(1, 3) -- 3 reviews per public agent
ON CONFLICT (agent_id, user_id) DO NOTHING;
