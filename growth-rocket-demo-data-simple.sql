-- Simplified Demo Data for Growth Rocket Agent
-- This version avoids complex recursive queries

-- First create a demo user in investment_users table
INSERT INTO investment_users (id, email, created_at) 
VALUES ('demo-user-001', 'demo@agentpm.ai', NOW())
ON CONFLICT (id) DO NOTHING;

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
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'demo-user-001',
    'Growth Rocket',
    'AI-powered growth stock trader focusing on tech momentum plays. Analyzes market sentiment, technical indicators, and company fundamentals to identify high-growth opportunities.',
    'momentum',
    'high',
    'daily',
    'active',
    100000.00,
    128453.67,
    28453.67,
    28.45,
    142,
    89,
    53,
    62.68,
    -8.34,
    1.82,
    NOW() - INTERVAL '6 months'
) ON CONFLICT (id) DO UPDATE SET
    current_capital = EXCLUDED.current_capital,
    total_return = EXCLUDED.total_return,
    total_return_pct = EXCLUDED.total_return_pct;

-- Create current positions for Growth Rocket
INSERT INTO positions (agent_id, symbol, quantity, entry_price, current_price, entry_date) VALUES
    ('00000000-0000-0000-0000-000000000001', 'NVDA', 150, 425.50, 487.20, NOW() - INTERVAL '15 days'),
    ('00000000-0000-0000-0000-000000000001', 'TSLA', 200, 178.30, 195.45, NOW() - INTERVAL '8 days'),
    ('00000000-0000-0000-0000-000000000001', 'META', 100, 385.20, 412.80, NOW() - INTERVAL '22 days'),
    ('00000000-0000-0000-0000-000000000001', 'GOOGL', 80, 142.50, 148.90, NOW() - INTERVAL '5 days'),
    ('00000000-0000-0000-0000-000000000001', 'MSFT', 120, 378.90, 395.60, NOW() - INTERVAL '12 days'),
    ('00000000-0000-0000-0000-000000000001', 'AMZN', 150, 152.40, 168.70, NOW() - INTERVAL '18 days'),
    ('00000000-0000-0000-0000-000000000001', 'AMD', 200, 115.60, 128.30, NOW() - INTERVAL '10 days'),
    ('00000000-0000-0000-0000-000000000001', 'CRM', 100, 265.80, 278.90, NOW() - INTERVAL '7 days')
ON CONFLICT (agent_id, symbol) DO UPDATE SET
    current_price = EXCLUDED.current_price;

-- Generate some sample performance metrics (last 30 days)
INSERT INTO performance_metrics (agent_id, date, portfolio_value, daily_return, total_return_pct)
SELECT 
    '00000000-0000-0000-0000-000000000001'::uuid,
    CURRENT_DATE - interval '1 day' * n,
    100000 + (n * 315.18), -- Gradual increase
    CASE 
        WHEN n % 3 = 0 THEN -0.5 + (RANDOM() * 2)
        ELSE 0.5 + (RANDOM() * 1.5)
    END,
    ((100000 + (n * 315.18) - 100000) / 100000) * 100
FROM generate_series(0, 29) n
ON CONFLICT (agent_id, date) DO UPDATE SET
    portfolio_value = EXCLUDED.portfolio_value,
    daily_return = EXCLUDED.daily_return,
    total_return_pct = EXCLUDED.total_return_pct;

-- Add some sample trades
INSERT INTO trades (
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
    ('00000000-0000-0000-0000-000000000001', 'NVDA', 'buy', 150, 425.50, NOW() - INTERVAL '15 days',
     'Strong momentum detected in NVDA following AI chip demand surge.',
     0.85,
     '{"rsi": 65, "macd": "bullish_crossover", "volume": "above_average"}'::jsonb,
     9330.00),
     
    ('00000000-0000-0000-0000-000000000001', 'TSLA', 'buy', 200, 178.30, NOW() - INTERVAL '8 days',
     'Tesla showing reversal pattern after recent pullback.',
     0.78,
     '{"pattern": "double_bottom", "rsi": 42, "volume": "increasing"}'::jsonb,
     3430.00),
     
    ('00000000-0000-0000-0000-000000000001', 'META', 'buy', 100, 385.20, NOW() - INTERVAL '22 days',
     'Meta breaking out on AI monetization potential.',
     0.82,
     '{"pattern": "cup_and_handle", "earnings_surprise": "+12%"}'::jsonb,
     2760.00)
ON CONFLICT DO NOTHING;

-- Set up for other demo agents (for landing page comparison)
INSERT INTO agents (id, user_id, name, strategy_type, initial_capital, current_capital, total_return_pct, created_at) VALUES
    ('00000000-0000-0000-0000-000000000002'::uuid, 'demo-user-001', 'Momentum Master', 'momentum', 100000, 132000, 32.0, NOW() - INTERVAL '6 months'),
    ('00000000-0000-0000-0000-000000000003'::uuid, 'demo-user-001', 'Value Hunter', 'value', 100000, 118000, 18.0, NOW() - INTERVAL '6 months')
ON CONFLICT (id) DO NOTHING;
