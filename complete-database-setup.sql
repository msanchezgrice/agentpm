-- Complete Database Setup for Agent Investment Platform
-- Run this file to create all necessary tables from scratch

-- 1. Create strategies table (referenced by agents)
CREATE TABLE IF NOT EXISTS strategies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  type text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  name text NOT NULL,
  description text,
  strategy_type text NOT NULL,
  risk_tolerance text NOT NULL,
  trading_frequency text NOT NULL,
  status text DEFAULT 'pending',
  initial_capital decimal NOT NULL,
  current_capital decimal NOT NULL,
  total_return decimal DEFAULT 0,
  total_return_pct decimal DEFAULT 0,
  total_trades integer DEFAULT 0,
  winning_trades integer DEFAULT 0,
  losing_trades integer DEFAULT 0,
  win_rate decimal DEFAULT 0,
  max_drawdown decimal DEFAULT 0,
  sharpe_ratio decimal DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  last_trade_at timestamp with time zone,
  is_public boolean DEFAULT false
);

-- 3. Create agent_configurations table
CREATE TABLE IF NOT EXISTS agent_configurations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  
  -- Strategy Configuration
  indicators text[],
  timeframe text,
  symbols text[],
  max_positions integer,
  position_sizing text,
  
  -- LLM Configuration
  llm_provider text,
  llm_model text,
  temperature decimal,
  system_prompt text,
  analysis_prompt text,
  
  -- Trading Rules (stored as JSONB for flexibility)
  entry_rules jsonb,
  exit_rules jsonb,
  risk_management jsonb,
  
  -- Backtesting Configuration
  backtest_period text,
  commission_rate decimal,
  slippage_rate decimal,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  UNIQUE(agent_id)
);

-- 4. Create positions table
CREATE TABLE IF NOT EXISTS positions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  symbol text NOT NULL,
  quantity integer NOT NULL,
  entry_price decimal NOT NULL,
  current_price decimal NOT NULL,
  entry_date timestamp with time zone DEFAULT now(),
  exit_date timestamp with time zone,
  exit_price decimal,
  profit_loss decimal,
  profit_loss_pct decimal,
  status text DEFAULT 'open',
  UNIQUE(agent_id, symbol)
);

-- 5. Create trades table
CREATE TABLE IF NOT EXISTS trades (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  symbol text NOT NULL,
  side text NOT NULL CHECK (side IN ('buy', 'sell')),
  quantity integer NOT NULL,
  price decimal NOT NULL,
  timestamp timestamp with time zone DEFAULT now(),
  reasoning text,
  confidence_score decimal,
  strategy_signals jsonb,
  trade_outcome decimal DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 6. Create performance_metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  date date NOT NULL,
  portfolio_value decimal NOT NULL,
  daily_return decimal DEFAULT 0,
  total_return_pct decimal DEFAULT 0,
  trades_count integer DEFAULT 0,
  volatility decimal DEFAULT 0,
  sharpe_ratio decimal DEFAULT 0,
  max_drawdown decimal DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(agent_id, date)
);

-- 7. Create market_indices_performance table
CREATE TABLE IF NOT EXISTS market_indices_performance (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date date NOT NULL UNIQUE,
  sp500_value decimal NOT NULL,
  nasdaq_value decimal NOT NULL,
  dow_value decimal,
  russell2000_value decimal,
  created_at timestamp with time zone DEFAULT now()
);

-- 8. Create backtest_jobs table
CREATE TABLE IF NOT EXISTS backtest_jobs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  status text DEFAULT 'pending', -- pending, running, completed, failed
  period text,
  initial_capital decimal,
  commission_rate decimal,
  slippage_rate decimal,
  
  -- Results
  total_return decimal,
  total_return_pct decimal,
  total_trades integer,
  winning_trades integer,
  losing_trades integer,
  win_rate decimal,
  max_drawdown decimal,
  sharpe_ratio decimal,
  volatility decimal,
  
  -- Metadata
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  error_message text,
  created_at timestamp with time zone DEFAULT now()
);

-- 9. Create public_agents view (for marketplace features)
CREATE OR REPLACE VIEW public_agents AS
SELECT 
  id,
  user_id,
  name,
  description,
  strategy_type,
  risk_tolerance,
  trading_frequency,
  status,
  initial_capital,
  current_capital,
  total_return,
  total_return_pct,
  total_trades,
  winning_trades,
  losing_trades,
  win_rate,
  max_drawdown,
  sharpe_ratio,
  created_at,
  last_trade_at
FROM agents
WHERE is_public = true;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_is_public ON agents(is_public);
CREATE INDEX IF NOT EXISTS idx_positions_agent_id ON positions(agent_id);
CREATE INDEX IF NOT EXISTS idx_positions_status ON positions(status);
CREATE INDEX IF NOT EXISTS idx_trades_agent_id ON trades(agent_id);
CREATE INDEX IF NOT EXISTS idx_trades_timestamp ON trades(timestamp);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_agent_id ON performance_metrics(agent_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_date ON performance_metrics(date);
CREATE INDEX IF NOT EXISTS idx_agent_configurations_agent_id ON agent_configurations(agent_id);
CREATE INDEX IF NOT EXISTS idx_backtest_jobs_agent_id ON backtest_jobs(agent_id);
CREATE INDEX IF NOT EXISTS idx_backtest_jobs_status ON backtest_jobs(status);

-- Grant permissions (adjust based on your RLS policies)
GRANT ALL ON agents TO authenticated;
GRANT ALL ON agent_configurations TO authenticated;
GRANT ALL ON positions TO authenticated;
GRANT ALL ON trades TO authenticated;
GRANT ALL ON performance_metrics TO authenticated;
GRANT ALL ON market_indices_performance TO authenticated;
GRANT ALL ON backtest_jobs TO authenticated;
GRANT ALL ON strategies TO authenticated;
GRANT SELECT ON public_agents TO authenticated;
