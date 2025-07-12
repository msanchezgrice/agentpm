import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

interface TradeRequest {
  agentId: string
  ticker: string
  action: 'buy' | 'sell' | 'buy_to_cover' | 'sell_short'
  quantity: number
  price: number
  strategy: string
  reasoning?: string
}

export async function POST(request: NextRequest) {
  try {
    const tradeData: TradeRequest = await request.json()
    const supabase = createClient()

    // Validate required fields
    if (!tradeData.agentId || !tradeData.ticker || !tradeData.action || !tradeData.quantity || !tradeData.price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get agent details
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*, user_id')
      .eq('id', tradeData.agentId)
      .single()

    if (agentError || !agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Calculate trade value
    const tradeValue = tradeData.quantity * tradeData.price

    // Check if agent has enough capital for buy orders
    if (tradeData.action === 'buy' || tradeData.action === 'buy_to_cover') {
      if (agent.current_capital < tradeValue) {
        return NextResponse.json(
          { error: 'Insufficient capital for trade' },
          { status: 400 }
        )
      }
    }

    // Execute paper trade - insert into trades table
    const { data: trade, error: tradeError } = await supabase
      .from('trades')
      .insert({
        agent_id: tradeData.agentId,
        user_id: agent.user_id,
        ticker: tradeData.ticker.toUpperCase(),
        action: tradeData.action,
        quantity: tradeData.quantity,
        price: tradeData.price,
        total_value: tradeValue,
        status: 'executed',
        executed_at: new Date().toISOString(),
        strategy_reason: tradeData.reasoning || `${tradeData.strategy} strategy signal`,
        trade_type: 'paper'
      })
      .select()
      .single()

    if (tradeError) {
      console.error('Trade execution error:', tradeError)
      return NextResponse.json(
        { error: 'Failed to execute trade' },
        { status: 500 }
      )
    }

    // Update agent's capital based on trade
    let newCapital = agent.current_capital
    if (tradeData.action === 'buy' || tradeData.action === 'buy_to_cover') {
      newCapital -= tradeValue
    } else if (tradeData.action === 'sell' || tradeData.action === 'sell_short') {
      newCapital += tradeValue
    }

    // Update agent capital
    const { error: updateError } = await supabase
      .from('agents')
      .update({ 
        current_capital: newCapital,
        last_trade_at: new Date().toISOString()
      })
      .eq('id', tradeData.agentId)

    if (updateError) {
      console.error('Error updating agent capital:', updateError)
    }

    // Calculate and store performance metrics
    await updateAgentPerformance(tradeData.agentId)

    return NextResponse.json({
      success: true,
      trade: {
        id: trade.id,
        ticker: trade.ticker,
        action: trade.action,
        quantity: trade.quantity,
        price: trade.price,
        totalValue: trade.total_value,
        executedAt: trade.executed_at
      },
      newCapital
    })

  } catch (error) {
    console.error('Trading API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function updateAgentPerformance(agentId: string) {
  const supabase = createClient()

  try {
    // Get all trades for this agent
    const { data: trades } = await supabase
      .from('trades')
      .select('*')
      .eq('agent_id', agentId)
      .eq('status', 'executed')
      .order('executed_at', { ascending: true })

    if (!trades || trades.length === 0) return

    // Calculate total profit/loss
    let totalPnL = 0
    let totalTrades = trades.length
    let winningTrades = 0
    let totalVolume = 0

    // Simple P&L calculation (more sophisticated logic needed for real trading)
    for (const trade of trades) {
      totalVolume += trade.total_value
      
      // For demo purposes, simulate some profit/loss
      if (trade.action === 'sell' || trade.action === 'sell_short') {
        // Assume 1-3% profit on sells (random for demo)
        const profitMargin = 0.01 + Math.random() * 0.02
        totalPnL += trade.total_value * profitMargin
        winningTrades++
      } else {
        // Buying positions - no immediate P&L
        totalPnL -= trade.total_value * 0.001 // Small transaction cost
      }
    }

    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0

    // Update or insert performance metrics
    const { error } = await supabase
      .from('performance_metrics')
      .upsert({
        agent_id: agentId,
        total_trades: totalTrades,
        winning_trades: winningTrades,
        total_pnl: totalPnL,
        win_rate: winRate,
        total_volume: totalVolume,
        calculated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error updating performance metrics:', error)
    }
  } catch (error) {
    console.error('Error calculating performance:', error)
  }
}
