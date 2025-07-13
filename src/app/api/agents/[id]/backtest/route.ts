import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  
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
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get backtest job
    const { data: backtestJob, error: jobError } = await supabase
      .from('backtest_jobs')
      .select('*')
      .eq('agent_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (jobError && jobError.code !== 'PGRST116') {
      console.error('Error fetching backtest job:', jobError)
      return NextResponse.json({ error: 'Failed to fetch backtest job' }, { status: 500 })
    }

    if (!backtestJob) {
      // Create mock backtest results for demo
      const mockResults = {
        agent_id: id,
        status: 'completed',
        period: '6months',
        initial_capital: 100000,
        final_capital: 128453.67,
        total_return_pct: 28.45,
        sharpe_ratio: 1.82,
        max_drawdown: -8.34,
        win_rate: 62.68,
        total_trades: 142,
        winning_trades: 89,
        losing_trades: 53,
        avg_win: 1250.45,
        avg_loss: -680.30,
        profit_factor: 2.18,
        performance_data: generateMockPerformanceData(),
        trade_history: generateMockTradeHistory(),
        metrics_by_symbol: {
          'NVDA': { trades: 15, win_rate: 73.3, total_return: 9330 },
          'TSLA': { trades: 18, win_rate: 61.1, total_return: 3430 },
          'META': { trades: 12, win_rate: 66.7, total_return: 2760 },
          'GOOGL': { trades: 10, win_rate: 70.0, total_return: 1512 }
        },
        completed_at: new Date().toISOString()
      }
      
      return NextResponse.json({ backtest: mockResults })
    }

    // In a real system, fetch actual backtest results
    const backtestResults = {
      ...backtestJob,
      performance_data: backtestJob.results?.performance_data || generateMockPerformanceData(),
      trade_history: backtestJob.results?.trade_history || generateMockTradeHistory()
    }

    return NextResponse.json({ backtest: backtestResults })

  } catch (error) {
    console.error('Error in backtest API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateMockPerformanceData() {
  const data = []
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 6)
  
  let value = 100000
  for (let i = 0; i < 180; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    
    // Add some volatility
    const change = (Math.random() - 0.45) * 0.02 // Slight positive bias
    value = value * (1 + change)
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100,
      benchmark: 100000 * (1 + (i * 0.0006)) // ~11% over 6 months
    })
  }
  
  return data
}

function generateMockTradeHistory() {
  const symbols = ['NVDA', 'TSLA', 'META', 'GOOGL', 'MSFT', 'AMZN', 'AMD', 'CRM']
  const trades = []
  
  for (let i = 0; i < 20; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)]
    const side = Math.random() > 0.5 ? 'buy' : 'sell'
    const quantity = Math.floor(Math.random() * 200) + 50
    const price = Math.random() * 300 + 100
    const outcome = Math.random() > 0.38 ? Math.random() * 2000 : -Math.random() * 1000
    
    trades.push({
      symbol,
      side,
      quantity,
      price: Math.round(price * 100) / 100,
      timestamp: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      outcome: Math.round(outcome * 100) / 100
    })
  }
  
  return trades.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}
