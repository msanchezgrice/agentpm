-- Combined SQL file to run all enhancements in order
-- Run this file in Supabase SQL editor to set up demo data and enhanced features

-- 1. First run the market indices table creation
-- This is needed for the performance comparison charts
\i add-market-indices-table.sql

-- 2. Then run the agent detail enhancements
-- This adds positions table, AI reasoning fields, performance metrics, etc.
\i enhance-agent-details.sql

-- 3. Finally, run the Growth Rocket demo data
-- This populates comprehensive demo data including 6 months of performance
\i growth-rocket-demo-data.sql

-- You should now have:
-- ✅ Positions table for real-time portfolio tracking
-- ✅ Enhanced trades table with AI reasoning and confidence scores  
-- ✅ Market indices performance data for comparisons
-- ✅ Growth Rocket demo agent with 6 months of data
-- ✅ 142 trades with detailed AI reasoning
-- ✅ 8 current positions with realistic P&L
-- ✅ Daily performance metrics for charting

-- To test:
-- 1. Go to /dashboard/agents
-- 2. Click on "Growth Rocket" agent
-- 3. Explore the Overview tab to see performance charts
-- 4. Check Positions tab for live portfolio
-- 5. View Trade History tab to see AI reasoning
