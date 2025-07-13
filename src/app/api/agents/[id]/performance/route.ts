import { NextRequest, NextResponse } from 'next/server'
import { useSupabaseClient } from '@/lib/supabase/client'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const agentId = params.id
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '6months' // 1month, 3months, 6months, 1year
    
    const supabase = useSupabaseClient()
    
    // Calculate date range based on period
    const endDate = new Date()
    const startDate = new Date()
    switch (period) {
      case '1month':
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case '3months':
        startDate.setMonth(startDate.getMonth() - 3)
        break
      case '1year':
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      case '6months':
      default:
        startDate.setMonth(startDate.getMonth() - 6)
        break
    }
    
    // Get agent performance data
    const { data: performanceData, error: perfError } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('agent_id', agentId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true })

    if (perfError) {
      console.error('Error fetching performance data:', perfError)
      return NextResponse.json(
        { error: 'Failed to fetch performance data' },
        { status: 500 }
      )
    }

    // Get market indices data for the same period
    const { data: marketData, error: marketError } = await supabase
      .from('market_indices_performance')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true })

    if (marketError) {
      console.error('Error fetching market data:', marketError)
      // Continue without market data rather than failing
    }

    // Merge the data
    const mergedData = performanceData?.map(perf => {
      const marketDay = marketData?.find(m => m.date === perf.date)
      return {
        date: perf.date,
        portfolioValue: perf.portfolio_value,
        dailyReturn: perf.daily_return,
        totalReturnPct: perf.total_return_pct,
        volatility: perf.volatility,
        sharpeRatio: perf.sharpe_ratio,
        maxDrawdown: perf.max_drawdown,
        tradesCount: perf.trades_count,
        sp500Value: marketDay?.sp500_value || 0,
        sp500ReturnPct: marketDay?.sp500_return_pct || 0,
        nasdaqValue: marketDay?.nasdaq_value || 0,
        nasdaqReturnPct: marketDay?.nasdaq_return_pct || 0
      }
    }) || []

    // Calculate summary statistics
    const latestData = mergedData[mergedData.length - 1]
    const startingValue = mergedData[0]?.portfolioValue || 100000
    
    const summary = {
      currentValue: latestData?.portfolioValue || 0,
      totalReturn: latestData?.portfolioValue - startingValue,
      totalReturnPct: latestData?.totalReturnPct || 0,
      avgDailyReturn: mergedData.reduce((sum, d) => sum + (d.dailyReturn || 0), 0) / mergedData.length,
      volatility: latestData?.volatility || 0,
      sharpeRatio: latestData?.sharpeRatio || 0,
      maxDrawdown: Math.min(...mergedData.map(d => d.maxDrawdown || 0)),
      totalTrades: mergedData.reduce((sum, d) => sum + (d.tradesCount || 0), 0),
      outperformanceSP500: (latestData?.totalReturnPct || 0) - (latestData?.sp500ReturnPct || 0),
      outperformanceNasdaq: (latestData?.totalReturnPct || 0) - (latestData?.nasdaqReturnPct || 0)
    }

    return NextResponse.json({
      performance: mergedData,
      summary,
      period
    })

  } catch (error) {
    console.error('Error in performance API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
