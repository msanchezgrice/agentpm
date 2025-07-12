-- Database enhancements for comprehensive agent detail view

-- 1. Create positions table (critical - missing!)
CREATE TABLE IF NOT EXISTS positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    symbol TEXT NOT NULL,
    quantity DECIMAL NOT NULL,
    entry_price DECIMAL NOT NULL,
    entry_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_price DECIMAL,
    market_value DECIMAL,
    unrealized_pnl DECIMAL,
    unrealized_pnl_percent DECIMAL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agent_id, symbol)
);

-- 2. Enhance trades table with AI reasoning fields
ALTER TABLE trades ADD COLUMN IF NOT EXISTS confidence_score DECIMAL(3,2);
ALTER TABLE trades ADD COLUMN IF NOT EXISTS strategy_signals JSONB;
ALTER TABLE trades ADD COLUMN IF NOT EXISTS trade_outcome DECIMAL; -- P&L for this trade
ALTER TABLE trades ADD COLUMN IF NOT EXISTS market_data_snapshot JSONB; -- Store market data at time of trade

-- 3. Enhanced performance tracking
ALTER TABLE performance_metrics ADD COLUMN IF NOT EXISTS portfolio_value DECIMAL;
ALTER TABLE performance_metrics ADD COLUMN IF NOT EXISTS volatility DECIMAL(10,4);
ALTER TABLE performance_metrics ADD COLUMN IF NOT EXISTS beta DECIMAL(10,4);
ALTER TABLE performance_metrics ADD COLUMN IF NOT EXISTS daily_return DECIMAL(10,4);

-- 4. Add agent configuration and strategy details
ALTER TABLE agents ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS strategy_config JSONB;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS risk_tolerance TEXT DEFAULT 'medium' CHECK (risk_tolerance IN ('low', 'medium', 'high'));
ALTER TABLE agents ADD COLUMN IF NOT EXISTS trading_frequency TEXT DEFAULT 'daily' CHECK (trading_frequency IN ('realtime', 'hourly', 'daily', 'weekly'));
ALTER TABLE agents ADD COLUMN IF NOT EXISTS initial_capital DECIMAL DEFAULT 10000;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS current_capital DECIMAL DEFAULT 10000;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS total_return DECIMAL DEFAULT 0;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS total_return_pct DECIMAL DEFAULT 0;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS total_trades INTEGER DEFAULT 0;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS winning_trades INTEGER DEFAULT 0;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS losing_trades INTEGER DEFAULT 0;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS win_rate DECIMAL DEFAULT 0;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS max_drawdown DECIMAL DEFAULT 0;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS sharpe_ratio DECIMAL DEFAULT 0;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS strategy_type TEXT DEFAULT 'momentum';

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_positions_agent_id ON positions(agent_id);
CREATE INDEX IF NOT EXISTS idx_positions_symbol ON positions(symbol);
CREATE INDEX IF NOT EXISTS idx_trades_agent_timestamp ON trades(agent_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_performance_agent_date ON performance_metrics(agent_id, date DESC);

-- 6. Create function to update position values
CREATE OR REPLACE FUNCTION update_position_values()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate market value and unrealized P&L
    NEW.market_value = NEW.quantity * NEW.current_price;
    NEW.unrealized_pnl = NEW.market_value - (NEW.quantity * NEW.entry_price);
    NEW.unrealized_pnl_percent = CASE 
        WHEN NEW.entry_price > 0 THEN (NEW.unrealized_pnl / (NEW.quantity * NEW.entry_price)) * 100
        ELSE 0
    END;
    NEW.last_updated = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger to auto-calculate position values
DROP TRIGGER IF EXISTS trigger_update_position_values ON positions;
CREATE TRIGGER trigger_update_position_values
    BEFORE INSERT OR UPDATE ON positions
    FOR EACH ROW EXECUTE FUNCTION update_position_values();

-- 8. Create function to update agent performance summary
CREATE OR REPLACE FUNCTION update_agent_performance()
RETURNS TRIGGER AS $$
BEGIN
    -- Update agent performance metrics when trades are added
    UPDATE agents SET
        total_trades = (SELECT COUNT(*) FROM trades WHERE agent_id = COALESCE(NEW.agent_id, OLD.agent_id)),
        current_capital = initial_capital + COALESCE((SELECT SUM(trade_outcome) FROM trades WHERE agent_id = COALESCE(NEW.agent_id, OLD.agent_id)), 0),
        total_return = COALESCE((SELECT SUM(trade_outcome) FROM trades WHERE agent_id = COALESCE(NEW.agent_id, OLD.agent_id)), 0),
        total_return_pct = CASE 
            WHEN initial_capital > 0 THEN (COALESCE((SELECT SUM(trade_outcome) FROM trades WHERE agent_id = COALESCE(NEW.agent_id, OLD.agent_id)), 0) / initial_capital) * 100
            ELSE 0
        END,
        winning_trades = (SELECT COUNT(*) FROM trades WHERE agent_id = COALESCE(NEW.agent_id, OLD.agent_id) AND trade_outcome > 0),
        losing_trades = (SELECT COUNT(*) FROM trades WHERE agent_id = COALESCE(NEW.agent_id, OLD.agent_id) AND trade_outcome < 0),
        win_rate = CASE 
            WHEN (SELECT COUNT(*) FROM trades WHERE agent_id = COALESCE(NEW.agent_id, OLD.agent_id)) > 0 
            THEN (SELECT COUNT(*) FROM trades WHERE agent_id = COALESCE(NEW.agent_id, OLD.agent_id) AND trade_outcome > 0)::DECIMAL / (SELECT COUNT(*) FROM trades WHERE agent_id = COALESCE(NEW.agent_id, OLD.agent_id))::DECIMAL * 100
            ELSE 0
        END
    WHERE id = COALESCE(NEW.agent_id, OLD.agent_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 9. Create trigger to auto-update agent performance
DROP TRIGGER IF EXISTS trigger_update_agent_performance ON trades;
CREATE TRIGGER trigger_update_agent_performance
    AFTER INSERT OR UPDATE OR DELETE ON trades
    FOR EACH ROW EXECUTE FUNCTION update_agent_performance();

-- 10. Sample data for testing (optional)
-- Insert sample positions for existing agents
INSERT INTO positions (agent_id, symbol, quantity, entry_price, current_price) 
SELECT 
    a.id,
    'AAPL' as symbol,
    10 as quantity,
    150.00 as entry_price,
    155.00 as current_price
FROM agents a 
WHERE a.user_id IS NOT NULL
ON CONFLICT (agent_id, symbol) DO NOTHING;

INSERT INTO positions (agent_id, symbol, quantity, entry_price, current_price) 
SELECT 
    a.id,
    'MSFT' as symbol,
    5 as quantity,
    300.00 as entry_price,
    310.00 as current_price
FROM agents a 
WHERE a.user_id IS NOT NULL
ON CONFLICT (agent_id, symbol) DO NOTHING;

-- Add sample trade outcomes to existing trades
UPDATE trades SET 
    confidence_score = 0.75,
    strategy_signals = '{"momentum": "bullish", "volume": "high", "signal_strength": 0.8}'::jsonb,
    trade_outcome = CASE 
        WHEN side = 'buy' THEN RANDOM() * 100 - 50  -- Random P&L between -50 and +50
        WHEN side = 'sell' THEN RANDOM() * 100 - 50
        ELSE 0
    END
WHERE confidence_score IS NULL;

-- Note: Agent performance will be updated automatically when trades are added via the trigger
