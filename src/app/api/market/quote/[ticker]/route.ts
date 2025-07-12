import { NextRequest, NextResponse } from 'next/server'
import { getPolygonClient } from '@/lib/polygon/client'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ ticker: string }> }
) {
  const params = await context.params
  try {
    const ticker = params.ticker.toUpperCase()
    const polygon = getPolygonClient()
    
    // Get both real-time quote and previous day data
    const [quote, prevDay] = await Promise.all([
      polygon.getRealTimeQuote(ticker).catch(() => null),
      polygon.getPreviousDay(ticker).catch(() => null)
    ])

    // If real-time quote fails, try to get recent aggregates
    let currentPrice = 0
    let change = 0
    let changePercent = 0

    if (prevDay?.results?.[0]) {
      const prevClose = prevDay.results[0].c
      currentPrice = quote?.last?.price || prevClose
      change = currentPrice - prevClose
      changePercent = (change / prevClose) * 100
    }

    return NextResponse.json({
      ticker,
      price: currentPrice,
      change,
      changePercent,
      volume: prevDay?.results?.[0]?.v || 0,
      high: prevDay?.results?.[0]?.h || currentPrice,
      low: prevDay?.results?.[0]?.l || currentPrice,
      open: prevDay?.results?.[0]?.o || currentPrice,
      previousClose: prevDay?.results?.[0]?.c || currentPrice,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 500 }
    )
  }
}
