-- Run this script in your Supabase SQL editor to set up the investment platform database
-- Go to: https://supabase.com/dashboard/project/ohtlcngzfijkkihwgbhs/sql/new

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (be careful with this in production!)
DROP TABLE IF EXISTS public.trades CASCADE;
DROP TABLE IF EXISTS public.performance_metrics CASCADE;
DROP TABLE IF EXISTS public.agents CASCADE;
DROP TABLE IF EXISTS public.strategies CASCADE;
DROP TABLE IF EXISTS public.investment_users CASCADE;

-- Create investment_users table
CREATE TABLE public.investment_users (
    id TEXT PRIMARY KEY, -- Clerk user ID
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create strategies table (predefined strategies)
CREATE TABLE public.strategies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    risk_level TEXT,
    timeframe TEXT,
    avg_return DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Insert predefined strategies
INSERT INTO public.strategies (id, name, description, risk_level, timeframe, avg_return) VALUES
('value-investing', 'Value Investing', 'Warren Buffett-inspired strategy focusing on undervalued stocks with strong fundamentals', 'Low', 'Long-term', 12.3),
('momentum-trading', 'Momentum Trading', 'Rides market trends using advanced technical indicators and volume analysis', 'Medium', 'Short-term', 18.7),
('sentiment-analysis', 'Sentiment Analysis', 'AI analyzes news sentiment and social media trends to predict movements', 'Medium', 'Medium-term', 15.2),
('crypto-trading', 'Crypto Trading', 'Specialized cryptocurrency trading using volatility patterns', 'High', 'Short-term', 24.1),
('options-trading', 'Options Trading', 'High-frequency options trading with sophisticated Greeks analysis', 'High', 'Intraday', 31.5),
('dividend-growth', 'Dividend Growth', 'Focus on dividend-paying stocks with consistent growth history', 'Low', 'Long-term', 9.8);

-- Create agents table
CREATE TABLE public.agents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT REFERENCES public.investment_users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    strategy_id TEXT REFERENCES public.strategies(id),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'stopped')),
    initial_capital DECIMAL DEFAULT 1000,
    current_capital DECIMAL,
    risk_tolerance TEXT DEFAULT 'moderate',
    trading_frequency TEXT DEFAULT 'daily',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    last_trade_at TIMESTAMP WITH TIME ZONE,
    total_trades INTEGER DEFAULT 0,
    win_rate DECIMAL DEFAULT 0,
    total_return DECIMAL DEFAULT 0
);

-- Create trades table
CREATE TABLE public.trades (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
    quantity DECIMAL NOT NULL,
    price DECIMAL NOT NULL,
    total_value DECIMAL NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    reasoning TEXT
);

-- Create performance_metrics table
CREATE TABLE public.performance_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    portfolio_value DECIMAL NOT NULL,
    daily_return DECIMAL,
    total_return DECIMAL,
    trades_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(agent_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.investment_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for investment_users
CREATE POLICY "Users can insert their own record" ON public.investment_users
    FOR INSERT WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can view their own record" ON public.investment_users
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own record" ON public.investment_users
    FOR UPDATE USING (auth.uid()::text = id);

-- Create policies for agents
CREATE POLICY "Users can view their own agents" ON public.agents
    FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create agents" ON public.agents
    FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own agents" ON public.agents
    FOR UPDATE USING (user_id = auth.uid()::text);

CREATE POLICY "Users can delete their own agents" ON public.agents
    FOR DELETE USING (user_id = auth.uid()::text);

-- Create policies for trades
CREATE POLICY "Users can view trades from their agents" ON public.trades
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM agents 
            WHERE agents.id = trades.agent_id 
            AND agents.user_id = auth.uid()::text
        )
    );

-- Create policies for performance_metrics
CREATE POLICY "Users can view metrics from their agents" ON public.performance_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM agents 
            WHERE agents.id = performance_metrics.agent_id 
            AND agents.user_id = auth.uid()::text
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_agents_user_id ON public.agents(user_id);
CREATE INDEX idx_trades_agent_id ON public.trades(agent_id);
CREATE INDEX idx_trades_timestamp ON public.trades(timestamp);
CREATE INDEX idx_performance_metrics_agent_id ON public.performance_metrics(agent_id);
CREATE INDEX idx_performance_metrics_date ON public.performance_metrics(date);

-- Create a function to automatically create user record on first sign in
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.investment_users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: Since we're using Clerk, we'll handle user creation in the app instead of with a trigger
