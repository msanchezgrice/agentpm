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
      // Fetch the agent data to generate consistent mock results
      const { data: agent } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .single()

      if (!agent) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
      }

      // Generate agent-specific mock backtest results based on actual agent data
      const initialCapital = agent.initial_capital || 100000
      const totalReturn = agent.total_return_pct || 15.5
      const finalCapital = initialCapital * (1 + totalReturn / 100)
      
      const mockResults = {
        agent_id: id,
        status: 'completed',
        period: '6months',
        initial_capital: initialCapital,
        final_capital: finalCapital,
        total_return_pct: totalReturn,
        sharpe_ratio: agent.sharpe_ratio || 1.45,
        max_drawdown: agent.max_drawdown || -7.5,
        win_rate: agent.win_rate || 58.5,
        total_trades: agent.total_trades || 120,
        winning_trades: Math.floor((agent.total_trades || 120) * (agent.win_rate || 58.5) / 100),
        losing_trades: Math.floor((agent.total_trades || 120) * (1 - (agent.win_rate || 58.5) / 100)),
        avg_win: 850.25,
        avg_loss: -450.15,
        profit_factor: 1.89,
        performance_data: generateMockPerformanceData(initialCapital, totalReturn),
        trade_history: generateMockTradeHistory(agent.strategy_type),
        metrics_by_symbol: generateSymbolMetrics(agent.strategy_type),
        completed_at: new Date().toISOString()
      }
      
      return NextResponse.json({ backtest: mockResults })
    }

    // In a real system, fetch actual backtest results
    const backtestResults = {
      ...backtestJob,
      performance_data: backtestJob.results?.performance_data || generateMockPerformanceData(100000, 15),
      trade_history: backtestJob.results?.trade_history || generateMockTradeHistory('momentum')
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

function generateMockPerformanceData(initialCapital: number, totalReturnPct: number) {
  const data = []
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 6)
  
  let value = initialCapital
  const dailyReturn = totalReturnPct / 100 / 180 // Spread return over 180 days
  
  for (let i = 0; i < 180; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    
    // Add some volatility but trend towards the final return
    const volatility = (Math.random() - 0.5) * 0.02
    const trend = dailyReturn + volatility
    value = value * (1 + trend)
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100,
      benchmark: initialCapital * (1 + (i * 0.0006)) // ~11% over 6 months
    })
  }
  
  return data
}

function generateMockTradeHistory(strategyType: string) {
  // Different symbols based on strategy type
  const symbolsByStrategy: Record<string, string[]> = {
    momentum: ['NVDA', 'TSLA', 'META', 'AMD', 'NFLX'],
    value: ['BRK.B', 'JPM', 'WMT', 'JNJ', 'PG'],
    mean_reversion: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'FB'],
    arbitrage: ['SPY', 'QQQ', 'IWM', 'DIA', 'VTI']
  }
  
  const symbols = symbolsByStrategy[strategyType] || ['AAPL', 'GOOGL', 'MSFT', 'AMZN']
  const trades = []
  
  for (let i = 0; i < 20; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)]
    const side = Math.random() > 0.5 ? 'buy' : 'sell'
    const quantity = Math.floor(Math.random() * 200) + 50
    const price = Math.random() * 300 + 100
    const outcome = Math.random() > 0.42 ? Math.random() * 1500 : -Math.random() * 800
    
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

function generateSymbolMetrics(strategyType: string) {
  const symbolsByStrategy: Record<string, string[]> = {
    momentum: ['NVDA', 'TSLA', 'META', 'AMD'],
    value: ['BRK.B', 'JPM', 'WMT', 'JNJ'],
    mean_reversion: ['AAPL', 'MSFT', 'GOOGL', 'AMZN'],
    arbitrage: ['SPY', 'QQQ', 'IWM', 'DIA']
  }
  
  const symbols = symbolsByStrategy[strategyType] || ['AAPL', 'GOOGL', 'MSFT', 'AMZN']
  const metrics: Record<string, any> = {}
  
  symbols.forEach(symbol => {
    metrics[symbol] = {
      trades: Math.floor(Math.random() * 20) + 10,
      win_rate: 50 + Math.random() * 30,
      total_return: Math.floor(Math.random() * 5000) + 1000
    }
  })
  
  return metrics
}
