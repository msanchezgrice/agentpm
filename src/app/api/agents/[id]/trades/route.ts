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
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    const supabase = useSupabaseClient()
    
    // Get trades with AI reasoning
    const { data: trades, error: tradesError } = await supabase
      .from('trades')
      .select('*')
      .eq('agent_id', agentId)
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1)

    if (tradesError) {
      console.error('Error fetching trades:', tradesError)
      return NextResponse.json(
        { error: 'Failed to fetch trades' },
        { status: 500 }
      )
    }

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('trades')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', agentId)

    if (countError) {
      console.error('Error fetching trades count:', countError)
    }

    // Calculate some quick stats
    const stats = {
      totalTrades: totalCount || 0,
      profitableTrades: trades?.filter(t => (t.trade_outcome || 0) > 0).length || 0,
      totalPnL: trades?.reduce((sum, t) => sum + (t.trade_outcome || 0), 0) || 0,
      avgConfidence: trades?.length ? 
        trades.reduce((sum, t) => sum + (t.confidence_score || 0), 0) / trades.length : 0
    }

    return NextResponse.json({
      trades: trades || [],
      stats,
      pagination: {
        total: totalCount || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (totalCount || 0)
      }
    })

  } catch (error) {
    console.error('Error in trades API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
