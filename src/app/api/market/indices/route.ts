import { NextRequest, NextResponse } from 'next/server'

const POLYGON_API_KEY = process.env.POLYGON_API_KEY

export async function GET(request: NextRequest) {
  try {
    // For demo purposes, return mock data
    // In production, you would fetch real data from Polygon API
    const mockIndices = [
      {
        symbol: 'SPX',
        name: 'S&P 500',
        value: 4783.45,
        change: 23.17,
        changePercent: 0.49,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: 'IXIC',
        name: 'NASDAQ',
        value: 15243.76,
        change: -45.23,
        changePercent: -0.30,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: 'DJI',
        name: 'Dow Jones',
        value: 37892.34,
        change: 156.89,
        changePercent: 0.42,
        lastUpdated: new Date().toISOString()
      }
    ]

    // If we have a Polygon API key, try to fetch real data
    if (POLYGON_API_KEY) {
      try {
        // Fetch S&P 500
        const spxResponse = await fetch(
          `https://api.polygon.io/v2/aggs/ticker/SPY/prev?apiKey=${POLYGON_API_KEY}`
        )
        if (spxResponse.ok) {
          const spxData = await spxResponse.json()
          if (spxData.results?.[0]) {
            const result = spxData.results[0]
            mockIndices[0] = {
              symbol: 'SPX',
              name: 'S&P 500',
              value: result.c,
              change: result.c - result.o,
              changePercent: ((result.c - result.o) / result.o) * 100,
              lastUpdated: new Date(result.t).toISOString()
            }
          }
        }

        // Fetch NASDAQ
        const qqqResponse = await fetch(
          `https://api.polygon.io/v2/aggs/ticker/QQQ/prev?apiKey=${POLYGON_API_KEY}`
        )
        if (qqqResponse.ok) {
          const qqqData = await qqqResponse.json()
          if (qqqData.results?.[0]) {
            const result = qqqData.results[0]
            mockIndices[1] = {
              symbol: 'IXIC',
              name: 'NASDAQ',
              value: result.c * 100, // Approximate conversion
              change: (result.c - result.o) * 100,
              changePercent: ((result.c - result.o) / result.o) * 100,
              lastUpdated: new Date(result.t).toISOString()
            }
          }
        }

        // Fetch Dow Jones
        const diaResponse = await fetch(
          `https://api.polygon.io/v2/aggs/ticker/DIA/prev?apiKey=${POLYGON_API_KEY}`
        )
        if (diaResponse.ok) {
          const diaData = await diaResponse.json()
          if (diaData.results?.[0]) {
            const result = diaData.results[0]
            mockIndices[2] = {
              symbol: 'DJI',
              name: 'Dow Jones',
              value: result.c * 100, // Approximate conversion
              change: (result.c - result.o) * 100,
              changePercent: ((result.c - result.o) / result.o) * 100,
              lastUpdated: new Date(result.t).toISOString()
            }
          }
        }
      } catch (error) {
        console.error('Error fetching real market data:', error)
        // Fall back to mock data
      }
    }

    return NextResponse.json({ indices: mockIndices })
  } catch (error) {
    console.error('Error in market indices API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market indices' },
      { status: 500 }
    )
  }
}
