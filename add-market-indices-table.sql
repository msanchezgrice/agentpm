-- Create table for storing market indices data for comparison charts
CREATE TABLE IF NOT EXISTS market_indices_performance (
    date DATE PRIMARY KEY,
    sp500_value DECIMAL,
    sp500_return_pct DECIMAL,
    nasdaq_value DECIMAL,
    nasdaq_return_pct DECIMAL,
    dow_value DECIMAL,
    dow_return_pct DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for agent reviews (for social proof)
CREATE TABLE IF NOT EXISTS agent_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    user_id TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agent_id, user_id, created_at)
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_market_indices_date ON market_indices_performance(date);
CREATE INDEX IF NOT EXISTS idx_agent_reviews_agent ON agent_reviews(agent_id);
