-- Comprehensive Demo Data for Growth Rocket Agent
-- This creates 6 months of realistic trading data with AI reasoning

-- First, create a demo user in the public schema if needed
-- (Skip the auth.users insert as it may cause issues)

-- Create the Growth Rocket demo agent
INSERT INTO agents (
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
    is_public,
    avg_rating,
    review_count,
    follower_count
) VALUES (
    'growth-rocket-001',
    'demo-user-001',  -- This can be any string since we're not enforcing auth
    'Growth Rocket',
    'AI-powered growth stock trader focusing on tech momentum plays. Analyzes market sentiment, technical indicators, and company fundamentals to identify high-growth opportunities.',
    'momentum',
    'high',
    'daily',
    'active',
    100000.00,  -- Started with $100k
    128453.67,  -- Current value after 6 months
    28453.67,   -- Total profit
    28.45,      -- 28.45% return
    142,        -- Total trades
    89,         -- Winning trades
    53,         -- Losing trades
    62.68,      -- Win rate
    -8.34,      -- Max drawdown
    1.82,       -- Sharpe ratio
    NOW() - INTERVAL '6 months',
    true,       -- Public agent
    4.7,        -- Rating
    234,        -- Reviews
    1847        -- Followers
) ON CONFLICT (id) DO UPDATE SET
    current_capital = EXCLUDED.current_capital,
    total_return = EXCLUDED.total_return,
    total_return_pct = EXCLUDED.total_return_pct;

-- Generate 6 months of daily performance data
WITH RECURSIVE daily_performance AS (
    -- Starting point
    SELECT 
        'growth-rocket-001'::uuid as agent_id,
        (NOW() - INTERVAL '6 months')::date as date,
        100000.00 as portfolio_value,
        0.00 as daily_return,
        0.00 as total_return_pct,
        0 as day_number
    
    UNION ALL
    
    -- Recursive generation
    SELECT 
        agent_id,
        date + INTERVAL '1 day',
        -- Add some realistic daily volatility
        portfolio_value * (1 + daily_change),
        daily_change * 100,
        ((portfolio_value * (1 + daily_change) - 100000) / 100000) * 100,
        day_number + 1
    FROM (
        SELECT 
            dp.*,
            -- Generate realistic daily returns with momentum bias
            CASE 
                -- Trending up periods
                WHEN dp.day_number % 20 < 12 THEN (RANDOM() * 0.04 - 0.01) -- -1% to +3% (bullish bias)
                -- Consolidation/pullback periods  
                ELSE (RANDOM() * 0.03 - 0.02) -- -2% to +1% (bearish bias)
            END + 
            -- Add some momentum factor
            CASE 
                WHEN dp.day_number > 100 THEN 0.001 -- Slight positive drift
                ELSE 0
            END as daily_change
        FROM daily_performance dp
        WHERE dp.day_number < 180 -- 6 months of data
    ) t
)
INSERT INTO performance_metrics (
    agent_id,
    date,
    portfolio_value,
    daily_return,
    total_return_pct,
    trades_count,
    volatility,
    sharpe_ratio,
    max_drawdown
)
SELECT 
    agent_id,
    date,
    portfolio_value,
    daily_return,
    total_return_pct,
    FLOOR(RANDOM() * 3)::INTEGER, -- 0-2 trades per day
    ABS(daily_return * 1.5), -- Volatility approximation
    1.82, -- Consistent Sharpe ratio
    CASE 
        WHEN total_return_pct < -8 THEN total_return_pct
        ELSE -8.34
    END
FROM daily_performance
ON CONFLICT (agent_id, date) DO UPDATE SET
    portfolio_value = EXCLUDED.portfolio_value,
    daily_return = EXCLUDED.daily_return,
    total_return_pct = EXCLUDED.total_return_pct;

-- Create current positions for Growth Rocket
INSERT INTO positions (agent_id, symbol, quantity, entry_price, current_price, entry_date) VALUES
    ('growth-rocket-001', 'NVDA', 150, 425.50, 487.20, NOW() - INTERVAL '15 days'),
    ('growth-rocket-001', 'TSLA', 200, 178.30, 195.45, NOW() - INTERVAL '8 days'),
    ('growth-rocket-001', 'META', 100, 385.20, 412.80, NOW() - INTERVAL '22 days'),
    ('growth-rocket-001', 'GOOGL', 80, 142.50, 148.90, NOW() - INTERVAL '5 days'),
    ('growth-rocket-001', 'MSFT', 120, 378.90, 395.60, NOW() - INTERVAL '12 days'),
    ('growth-rocket-001', 'AMZN', 150, 152.40, 168.70, NOW() - INTERVAL '18 days'),
    ('growth-rocket-001', 'AMD', 200, 115.60, 128.30, NOW() - INTERVAL '10 days'),
    ('growth-rocket-001', 'CRM', 100, 265.80, 278.90, NOW() - INTERVAL '7 days')
ON CONFLICT (agent_id, symbol) DO UPDATE SET
    current_price = EXCLUDED.current_price;

-- Generate realistic trade history with AI reasoning
INSERT INTO trades (
    id,
    agent_id,
    symbol,
    side,
    quantity,
    price,
    timestamp,
    reasoning,
    confidence_score,
    strategy_signals,
    trade_outcome
) VALUES
    -- Recent winning trades
    (gen_random_uuid(), 'growth-rocket-001', 'NVDA', 'buy', 150, 425.50, NOW() - INTERVAL '15 days',
     'Strong momentum detected in NVDA following AI chip demand surge. Technical indicators show breakout above 50-day MA with increasing volume. RSI at 65 indicates room for growth without being overbought. Analyst upgrades and positive earnings guidance support bullish thesis.',
     0.85,
     '{"rsi": 65, "macd": "bullish_crossover", "volume": "above_average", "support": 420, "resistance": 450, "trend": "strong_uptrend", "sentiment": "very_positive"}'::jsonb,
     9330.00), -- Profit from this position
     
    (gen_random_uuid(), 'growth-rocket-001', 'TSLA', 'buy', 200, 178.30, NOW() - INTERVAL '8 days',
     'Tesla showing reversal pattern after recent pullback. Delivery numbers exceeded expectations and new Gigafactory announcements driving positive sentiment. Technical setup shows double bottom formation with strong support at $175.',
     0.78,
     '{"pattern": "double_bottom", "rsi": 42, "volume": "increasing", "news_sentiment": 0.72, "analyst_rating": "buy", "price_target": 210}'::jsonb,
     3430.00),
     
    (gen_random_uuid(), 'growth-rocket-001', 'META', 'buy', 100, 385.20, NOW() - INTERVAL '22 days',
     'Meta breaking out on AI monetization potential. Reality Labs losses decreasing while ad revenue growing. Stock forming cup-and-handle pattern. Instagram Reels engagement metrics showing strong growth.',
     0.82,
     '{"pattern": "cup_and_handle", "earnings_surprise": "+12%", "revenue_growth": "23%", "pe_ratio": 28.5, "institutional_buying": "heavy"}'::jsonb,
     2760.00),
     
    -- Some losing trades for realism
    (gen_random_uuid(), 'growth-rocket-001', 'SNAP', 'buy', 500, 15.80, NOW() - INTERVAL '30 days',
     'Attempting contrarian play on oversold conditions. RSI below 30 and approaching historical support. Risk-reward favorable for a bounce play.',
     0.62,
     '{"rsi": 28, "oversold": true, "support_level": 15.50, "risk_reward": 3.2, "sentiment": "bearish"}'::jsonb,
     -1250.00), -- Loss
     
    (gen_random_uuid(), 'growth-rocket-001', 'SNAP', 'sell', 500, 13.30, NOW() - INTERVAL '25 days',
     'Exiting position as stock breaks below support. Preservation of capital takes priority. Technical breakdown confirmed.',
     0.88,
     '{"stop_loss_triggered": true, "support_broken": 15.50, "volume": "high", "next_support": 12.80}'::jsonb,
     -1250.00), -- Realized loss
     
    -- More winning trades
    (gen_random_uuid(), 'growth-rocket-001', 'GOOGL', 'buy', 80, 142.50, NOW() - INTERVAL '5 days',
     'Google showing strength after Gemini AI announcements. Cloud revenue accelerating. Stock bouncing off 200-day moving average with increasing volume.',
     0.79,
     '{"ai_catalyst": "gemini_launch", "cloud_growth": "28%", "technical_setup": "bounce_200ma", "volume_confirmation": true}'::jsonb,
     512.00),
     
    (gen_random_uuid(), 'growth-rocket-001', 'AAPL', 'buy', 100, 189.50, NOW() - INTERVAL '45 days',
     'Apple breaking out of consolidation range. iPhone 15 pre-orders strong. Services revenue continuing double-digit growth. Chart showing bullish flag pattern.',
     0.81,
     '{"pattern": "bull_flag", "iphone_demand": "strong", "services_growth": "16%", "target_price": 200}'::jsonb,
     850.00),
     
    (gen_random_uuid(), 'growth-rocket-001', 'AAPL', 'sell', 100, 198.00, NOW() - INTERVAL '35 days',
     'Taking profits near psychological resistance at $200. RSI showing overbought conditions. Rotation into other opportunities with better risk-reward.',
     0.76,
     '{"rsi": 78, "resistance": 200, "profit_target_hit": true, "days_held": 10}'::jsonb,
     850.00);

-- Add more trades to reach 142 total (mixing wins and losses)
-- This is a sample; in production you'd generate all 142
INSERT INTO trades (
    id, agent_id, symbol, side, quantity, price, timestamp, reasoning, confidence_score, strategy_signals, trade_outcome
)
SELECT 
    gen_random_uuid(),
    'growth-rocket-001',
    (ARRAY['MSFT', 'AMZN', 'AMD', 'CRM', 'NFLX', 'ADBE', 'PYPL', 'SQ', 'SHOP', 'UBER'])[FLOOR(RANDOM() * 10 + 1)],
    CASE WHEN RANDOM() > 0.5 THEN 'buy' ELSE 'sell' END,
    FLOOR(RANDOM() * 200 + 50)::integer,
    RANDOM() * 200 + 100,
    NOW() - (RANDOM() * 180 || ' days')::interval,
    'AI-driven trade based on momentum indicators and market conditions. [Auto-generated for demo]',
    0.6 + RANDOM() * 0.35,
    ('{"rsi": ' || FLOOR(RANDOM() * 50 + 30) || ', "trend": "' || 
     CASE WHEN RANDOM() > 0.5 THEN 'bullish' ELSE 'bearish' END || 
     '", "volume": "' || 
     CASE WHEN RANDOM() > 0.5 THEN 'above_average' ELSE 'average' END || '"}')::jsonb,
    CASE 
        WHEN RANDOM() > 0.38 THEN FLOOR(RANDOM() * 3000 - 500) -- 62% win rate
        ELSE -FLOOR(RANDOM() * 2000)
    END
FROM generate_series(1, 120); -- Generate 120 more trades

-- Update agent stats based on actual trades
UPDATE agents 
SET 
    total_trades = (SELECT COUNT(*) FROM trades WHERE agent_id = 'growth-rocket-001'),
    winning_trades = (SELECT COUNT(*) FROM trades WHERE agent_id = 'growth-rocket-001' AND trade_outcome > 0),
    losing_trades = (SELECT COUNT(*) FROM trades WHERE agent_id = 'growth-rocket-001' AND trade_outcome <= 0),
    win_rate = (
        SELECT COUNT(*) FILTER (WHERE trade_outcome > 0) * 100.0 / NULLIF(COUNT(*), 0)
        FROM trades WHERE agent_id = 'growth-rocket-001'
    )
WHERE id = 'growth-rocket-001';

-- Add some sample agent reviews for social proof (skip if agent_reviews table doesn't exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agent_reviews') THEN
        INSERT INTO agent_reviews (agent_id, user_id, rating, comment, created_at) VALUES
            ('growth-rocket-001', 'demo-user-001', 5, 'Incredible returns! The AI reasoning is transparent and the risk management is solid.', NOW() - INTERVAL '5 days'),
            ('growth-rocket-001', 'demo-user-001', 4, 'Good performance overall. Had a rough patch in month 3 but recovered nicely.', NOW() - INTERVAL '15 days'),
            ('growth-rocket-001', 'demo-user-001', 5, 'Love the detailed explanations for each trade. Learning a lot from this agent!', NOW() - INTERVAL '25 days')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Create performance comparison data (for charts)
-- This will be used to show Growth Rocket vs S&P 500 and NASDAQ
INSERT INTO market_indices_performance (date, sp500_value, nasdaq_value) 
SELECT 
    date::date,
    4200 * (1 + (date - (NOW() - INTERVAL '6 months')::date)::integer * 0.0007), -- ~12% growth over 6 months
    13500 * (1 + (date - (NOW() - INTERVAL '6 months')::date)::integer * 0.0009) -- ~15% growth over 6 months  
FROM generate_series(
    (NOW() - INTERVAL '6 months')::date,
    NOW()::date,
    '1 day'::interval
) AS date
ON CONFLICT (date) DO NOTHING;

-- Set up for other demo agents (for landing page comparison)
INSERT INTO agents (id, user_id, name, strategy_type, initial_capital, current_capital, total_return_pct, created_at, is_public) VALUES
    ('momentum-master-001', 'demo-user-001', 'Momentum Master', 'momentum', 100000, 132000, 32.0, NOW() - INTERVAL '6 months', true),
    ('value-hunter-001', 'demo-user-001', 'Value Hunter', 'value', 100000, 118000, 18.0, NOW() - INTERVAL '6 months', true)
ON CONFLICT (id) DO NOTHING;
