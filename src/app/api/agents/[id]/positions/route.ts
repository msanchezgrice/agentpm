import { NextRequest, NextResponse } from 'next/server'
import { useSupabaseClient } from '@/lib/supabase/client'
import { getPolygonClient } from '@/lib/polygon/client'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const agentId = params.id
    const supabase = useSupabaseClient()
    const polygon = getPolygonClient()
    
    // Get current positions
    const { data: positions, error: positionsError } = await supabase
      .from('positions')
      .select('*')
      .eq('agent_id', agentId)

    if (positionsError) {
      console.error('Error fetching positions:', positionsError)
      return NextResponse.json(
        { error: 'Failed to fetch positions' },
        { status: 500 }
      )
    }

    if (!positions || positions.length === 0) {
      return NextResponse.json({
        positions: [],
        totalValue: 0,
        totalUnrealizedPnL: 0,
        totalUnrealizedPnLPercent: 0
      })
    }

    // Get real-time prices for all positions
    const updatedPositions = await Promise.all(
      positions.map(async (position) => {
        try {
          // Get current market price
          const quote = await polygon.getRealTimeQuote(position.symbol).catch(() => null)
          const currentPrice = quote?.last?.price || position.current_price || position.entry_price
          
          // Calculate updated values
          const marketValue = position.quantity * currentPrice
          const unrealizedPnL = marketValue - (position.quantity * position.entry_price)
          const unrealizedPnLPercent = (unrealizedPnL / (position.quantity * position.entry_price)) * 100
          
          // Update position in database with new price
          await supabase
            .from('positions')
            .update({
              current_price: currentPrice,
              market_value: marketValue,
              unrealized_pnl: unrealizedPnL,
              unrealized_pnl_percent: unrealizedPnLPercent,
              last_updated: new Date().toISOString()
            })
            .eq('id', position.id)

          return {
            ...position,
            current_price: currentPrice,
            market_value: marketValue,
            unrealized_pnl: unrealizedPnL,
            unrealized_pnl_percent: unrealizedPnLPercent,
            last_updated: new Date().toISOString()
          }
        } catch (error) {
          console.error(`Error updating price for ${position.symbol}:`, error)
          return position // Return original position if price update fails
        }
      })
    )

    // Calculate totals
    const totalValue = updatedPositions.reduce((sum, pos) => sum + (pos.market_value || 0), 0)
    const totalUnrealizedPnL = updatedPositions.reduce((sum, pos) => sum + (pos.unrealized_pnl || 0), 0)
    const totalInvested = updatedPositions.reduce((sum, pos) => sum + (pos.quantity * pos.entry_price), 0)
    const totalUnrealizedPnLPercent = totalInvested > 0 ? (totalUnrealizedPnL / totalInvested) * 100 : 0

    return NextResponse.json({
      positions: updatedPositions,
      summary: {
        totalValue,
        totalUnrealizedPnL,
        totalUnrealizedPnLPercent,
        totalInvested,
        positionCount: updatedPositions.length
      }
    })

  } catch (error) {
    console.error('Error in positions API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
