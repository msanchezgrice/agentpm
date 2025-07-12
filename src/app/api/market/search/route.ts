import { NextRequest, NextResponse } from 'next/server'
import { getPolygonClient } from '@/lib/polygon/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      )
    }

    const polygon = getPolygonClient()
    const results = await polygon.searchTickers(query, limit)

    return NextResponse.json({
      results: results.results.map(ticker => ({
        symbol: ticker.ticker,
        name: ticker.name,
        market: ticker.market,
        exchange: ticker.primary_exchange,
        type: ticker.type,
        currency: ticker.currency_name
      }))
    })
  } catch (error) {
    console.error('Error searching tickers:', error)
    return NextResponse.json(
      { error: 'Failed to search tickers' },
      { status: 500 }
    )
  }
}
