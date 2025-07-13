-- Create backtest_jobs table if it doesn't exist
CREATE TABLE IF NOT EXISTS backtest_jobs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  period text,
  start_date timestamptz,
  end_date timestamptz,
  results jsonb,
  error text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create agent_configurations table if it doesn't exist
CREATE TABLE IF NOT EXISTS agent_configurations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE UNIQUE,
  
  -- Strategy Configuration
  indicators text[],
  timeframe text,
  symbols text[],
  max_positions int DEFAULT 5,
  position_sizing text DEFAULT 'equal_weight',
  
  -- LLM Configuration
  llm_provider text DEFAULT 'openai',
  llm_model text DEFAULT 'gpt-4',
  temperature float DEFAULT 0.7,
  system_prompt text,
  analysis_prompt text,
  
  -- Trading Rules
  entry_rules jsonb,
  exit_rules jsonb,
  risk_management jsonb,
  
  -- Backtesting
  backtest_period text DEFAULT '6months',
  commission_rate float DEFAULT 0.001,
  slippage_rate float DEFAULT 0.0005,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_backtest_jobs_agent_id ON backtest_jobs(agent_id);
CREATE INDEX IF NOT EXISTS idx_backtest_jobs_status ON backtest_jobs(status);
CREATE INDEX IF NOT EXISTS idx_agent_configurations_agent_id ON agent_configurations(agent_id);
