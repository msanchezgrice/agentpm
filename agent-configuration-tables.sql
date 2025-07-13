-- Create agent_configurations table for storing detailed agent settings
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

-- Create backtest_jobs table for tracking backtesting tasks
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agent_configurations_agent_id ON agent_configurations(agent_id);
CREATE INDEX IF NOT EXISTS idx_backtest_jobs_agent_id ON backtest_jobs(agent_id);
CREATE INDEX IF NOT EXISTS idx_backtest_jobs_status ON backtest_jobs(status);

-- Grant permissions (adjust based on your RLS policies)
GRANT ALL ON agent_configurations TO authenticated;
GRANT ALL ON backtest_jobs TO authenticated;
