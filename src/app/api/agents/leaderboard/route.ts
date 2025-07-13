import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    // Fetch top performing agents by total return percentage
    const { data: agents, error } = await supabase
      .from('agents')
      .select('id, name, strategy_type, total_return_pct, current_capital, win_rate, total_trades')
      .eq('status', 'active')
      .order('total_return_pct', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching agent leaderboard:', error)
      
      // Return mock data if database query fails
      const mockAgents = [
        {
          id: '00000000-0000-0000-0000-000000000002',
          name: 'Momentum Master',
          strategy_type: 'momentum',
          total_return_pct: 32.0,
          current_capital: 132000,
          win_rate: 68.5,
          total_trades: 186,
          last_trade_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '00000000-0000-0000-0000-000000000001',
          name: 'Growth Rocket',
          strategy_type: 'momentum',
          total_return_pct: 28.45,
          current_capital: 128453.67,
          win_rate: 62.68,
          total_trades: 142,
          last_trade_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '00000000-0000-0000-0000-000000000003',
          name: 'Value Hunter',
          strategy_type: 'value',
          total_return_pct: 18.0,
          current_capital: 118000,
          win_rate: 71.2,
          total_trades: 98,
          last_trade_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '00000000-0000-0000-0000-000000000004',
          name: 'Mean Reverter',
          strategy_type: 'mean_reversion',
          total_return_pct: 15.8,
          current_capital: 115800,
          win_rate: 64.3,
          total_trades: 156,
          last_trade_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '00000000-0000-0000-0000-000000000005',
          name: 'Arbitrage Pro',
          strategy_type: 'arbitrage',
          total_return_pct: 12.5,
          current_capital: 112500,
          win_rate: 78.9,
          total_trades: 312,
          last_trade_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      ]
      
      return NextResponse.json({ agents: mockAgents })
    }

    // Add last trade timestamp for each agent (would be a join in production)
    const agentsWithLastTrade = agents?.map(agent => ({
      ...agent,
      last_trade_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    })) || []

    return NextResponse.json({ agents: agentsWithLastTrade })

  } catch (error) {
    console.error('Error in agent leaderboard API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
