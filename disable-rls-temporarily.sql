-- Temporarily disable RLS on all tables for testing
-- Run this in Supabase SQL editor to allow agent creation

ALTER TABLE agents DISABLE ROW LEVEL SECURITY;
ALTER TABLE strategies DISABLE ROW LEVEL SECURITY;
ALTER TABLE investment_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE trades DISABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics DISABLE ROW LEVEL SECURITY;

-- This will allow all operations to work without authentication
-- We can re-enable RLS later once JWT integration is working
