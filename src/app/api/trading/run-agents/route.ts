import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'
import { TradingStrategies } from '@/lib/trading/strategies'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get all active agents
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('*')
      .eq('status', 'active')

    if (agentsError) {
      console.error('Error fetching agents:', agentsError)
      return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
    }

    if (!agents || agents.length === 0) {
      return NextResponse.json({ message: 'No active agents found' })
    }

    const results = []

    for (const agent of agents) {
      try {
        // Get recommended tickers for this agent's strategy
        const tickers = TradingStrategies.getRecommendedTickers(agent.strategy_type)
        
        // Pick a random ticker for this run (in production, you'd have more sophisticated logic)
        const ticker = tickers[Math.floor(Math.random() * tickers.length)]

        // Fetch market data
        const marketResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/market/quote/${ticker}`)
        if (!marketResponse.ok) continue

        const marketData = await marketResponse.json()

        // Generate trading signal
        const signal = await TradingStrategies.generateSignal(agent, marketData)

        // Only execute if signal is not 'hold' and confidence is above threshold
        const confidenceThreshold = agent.risk_tolerance === 'high' ? 0.3 : agent.risk_tolerance === 'medium' ? 0.5 : 0.7

        if (signal.action !== 'hold' && signal.confidence >= confidenceThreshold) {
          // Execute trade
          const tradeResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/trading/execute`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              agentId: agent.id,
              ticker: ticker,
              action: signal.action,
              quantity: signal.suggestedQuantity || 1,
              price: marketData.price,
              strategy: agent.strategy_type,
              reasoning: signal.reasoning
            })
          })

          if (tradeResponse.ok) {
            const tradeResult = await tradeResponse.json()
            results.push({
              agentId: agent.id,
              agentName: agent.name,
              ticker,
              action: signal.action,
              quantity: signal.suggestedQuantity,
              price: marketData.price,
              confidence: signal.confidence,
              reasoning: signal.reasoning,
              success: true
            })
          }
        } else {
          results.push({
            agentId: agent.id,
            agentName: agent.name,
            ticker,
            action: 'hold',
            reasoning: signal.reasoning,
            confidence: signal.confidence,
            success: true
          })
        }
      } catch (error) {
        console.error(`Error processing agent ${agent.id}:`, error)
        results.push({
          agentId: agent.id,
          agentName: agent.name,
          error: 'Processing failed',
          success: false
        })
      }
    }

    return NextResponse.json({
      message: `Processed ${agents.length} agents`,
      results
    })
  } catch (error) {
    console.error('Run agents error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
