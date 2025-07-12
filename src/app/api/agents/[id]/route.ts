import { NextRequest, NextResponse } from 'next/server'
import { useSupabaseClient } from '@/lib/supabase/client'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const agentId = params.id
    const supabase = useSupabaseClient()
    
    // Get agent details with all performance metrics
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select(`
        *,
        strategies(*)
      `)
      .eq('id', agentId)
      .single()

    if (agentError) {
      console.error('Error fetching agent:', agentError)
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Get recent performance metrics
    const { data: performanceData, error: perfError } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('agent_id', agentId)
      .order('date', { ascending: false })
      .limit(30)

    if (perfError) {
      console.error('Error fetching performance data:', perfError)
    }

    // Get current positions
    const { data: positions, error: posError } = await supabase
      .from('positions')
      .select('*')
      .eq('agent_id', agentId)

    if (posError) {
      console.error('Error fetching positions:', posError)
    }

    // Get recent trades count
    const { count: tradesCount, error: tradesError } = await supabase
      .from('trades')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', agentId)

    if (tradesError) {
      console.error('Error fetching trades count:', tradesError)
    }

    return NextResponse.json({
      agent: {
        ...agent,
        total_trades: tradesCount || 0
      },
      performance: performanceData || [],
      positions: positions || []
    })

  } catch (error) {
    console.error('Error in agent details API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
