-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY, -- Clerk user ID
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'premium')),
    permissions JSONB DEFAULT '{"paper_trading": true, "live_trading": false}'::jsonb,
    alpaca_paper_key_encrypted TEXT,
    alpaca_live_key_encrypted TEXT,
    alpaca_paper_secret_encrypted TEXT,
    alpaca_live_secret_encrypted TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
    agent_limit INTEGER DEFAULT 5
);

-- Create strategies table
CREATE TABLE IF NOT EXISTS public.strategies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'predefined' CHECK (type IN ('predefined', 'custom', 'marketplace')),
    visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public', 'marketplace')),
    config JSONB NOT NULL,
    performance_stats JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create agents table (removed problematic CHECK constraint with subquery)
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    strategy_id UUID REFERENCES public.strategies(id),
    llm_model TEXT NOT NULL,
    status TEXT DEFAULT 'stopped' CHECK (status IN ('active', 'paused', 'stopped')),
    mode TEXT DEFAULT 'paper' CHECK (mode IN ('paper', 'live')),
    max_position_size DECIMAL DEFAULT 1000,
    daily_loss_limit DECIMAL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create trading_sessions table
CREATE TABLE IF NOT EXISTS public.trading_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    end_time TIMESTAMP WITH TIME ZONE,
    initial_balance DECIMAL,
    final_balance DECIMAL
);

-- Create trades table
CREATE TABLE IF NOT EXISTS public.trades (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.trading_sessions(id),
    symbol TEXT NOT NULL,
    side TEXT NOT NULL CHECK (side IN ('buy', 'sell', 'buy_to_cover', 'sell_short')),
    quantity DECIMAL NOT NULL,
    price DECIMAL NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    reasoning TEXT,
    sentiment_score DECIMAL
);

-- Create performance_metrics table
CREATE TABLE IF NOT EXISTS public.performance_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_return DECIMAL NOT NULL,
    sharpe_ratio DECIMAL,
    max_drawdown DECIMAL,
    win_rate DECIMAL,
    trades_count INTEGER DEFAULT 0,
    UNIQUE(agent_id, date)
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id),
    action TEXT NOT NULL,
    details JSONB,
    ip_address TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create subscription_tiers table
CREATE TABLE IF NOT EXISTS public.subscription_tiers (
    tier TEXT PRIMARY KEY,
    agent_limit INTEGER NOT NULL,
    paper_trading BOOLEAN NOT NULL,
    live_trading BOOLEAN NOT NULL,
    api_calls_per_month INTEGER NOT NULL,
    advanced_strategies BOOLEAN NOT NULL,
    custom_strategies BOOLEAN NOT NULL,
    price_monthly DECIMAL NOT NULL
);

-- Insert default subscription tiers
INSERT INTO public.subscription_tiers (tier, agent_limit, paper_trading, live_trading, api_calls_per_month, advanced_strategies, custom_strategies, price_monthly) VALUES
('free', 5, true, false, 10000, false, false, 0),
('pro', 25, true, true, 100000, true, true, 49),
('enterprise', 999, true, true, 9999999, true, true, 299)
ON CONFLICT (tier) DO NOTHING;

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid()::text = id);

-- Strategies policies
CREATE POLICY "Users can view own strategies" ON public.strategies
    FOR SELECT USING (auth.uid()::text = user_id OR visibility IN ('public', 'marketplace'));

CREATE POLICY "Users can create strategies" ON public.strategies
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own strategies" ON public.strategies
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own strategies" ON public.strategies
    FOR DELETE USING (auth.uid()::text = user_id);

-- Agents policies
CREATE POLICY "Users can view own agents" ON public.agents
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create agents" ON public.agents
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own agents" ON public.agents
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own agents" ON public.agents
    FOR DELETE USING (auth.uid()::text = user_id);

-- Trades policies
CREATE POLICY "Users can view own trades" ON public.trades
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM agents 
            WHERE agents.id = trades.agent_id 
            AND agents.user_id = auth.uid()::text
        )
    );

-- Performance metrics policies
CREATE POLICY "Users can view own metrics" ON public.performance_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM agents 
            WHERE agents.id = performance_metrics.agent_id 
            AND agents.user_id = auth.uid()::text
        )
    );

-- Audit logs policies (users can only see their own logs)
CREATE POLICY "Users can view own audit logs" ON public.audit_logs
    FOR SELECT USING (auth.uid()::text = user_id);

-- Create indexes for better performance
CREATE INDEX idx_strategies_user_id ON public.strategies(user_id);
CREATE INDEX idx_agents_user_id ON public.agents(user_id);
CREATE INDEX idx_agents_strategy_id ON public.agents(strategy_id);
CREATE INDEX idx_trades_agent_id ON public.trades(agent_id);
CREATE INDEX idx_performance_metrics_agent_id ON public.performance_metrics(agent_id);
CREATE INDEX idx_performance_metrics_date ON public.performance_metrics(date);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_trades_timestamp ON public.trades(timestamp);

-- Function to validate live trading permissions
CREATE OR REPLACE FUNCTION validate_live_trading()
RETURNS TRIGGER AS $$
BEGIN
    -- If mode is 'live', check if user has live trading permissions
    IF NEW.mode = 'live' THEN
        IF NOT EXISTS (
            SELECT 1 FROM users 
            WHERE id = NEW.user_id 
            AND (permissions->>'live_trading')::boolean = true
        ) THEN
            RAISE EXCEPTION 'User does not have live trading permissions';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce live trading validation
CREATE TRIGGER trigger_validate_live_trading
    BEFORE INSERT OR UPDATE ON public.agents
    FOR EACH ROW
    EXECUTE FUNCTION validate_live_trading();

-- Function to enforce agent limits
CREATE OR REPLACE FUNCTION enforce_agent_limit()
RETURNS TRIGGER AS $$
DECLARE
    user_agent_count INTEGER;
    user_agent_limit INTEGER;
BEGIN
    -- Get current agent count and limit for the user
    SELECT COUNT(*), u.agent_limit 
    INTO user_agent_count, user_agent_limit
    FROM agents a
    JOIN users u ON u.id = NEW.user_id
    WHERE a.user_id = NEW.user_id
    GROUP BY u.agent_limit;
    
    -- If this is an INSERT and would exceed the limit
    IF TG_OP = 'INSERT' AND user_agent_count >= user_agent_limit THEN
        RAISE EXCEPTION 'Agent limit exceeded. Current limit: %', user_agent_limit;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce agent limits
CREATE TRIGGER trigger_enforce_agent_limit
    BEFORE INSERT ON public.agents
    FOR EACH ROW
    EXECUTE FUNCTION enforce_agent_limit();
