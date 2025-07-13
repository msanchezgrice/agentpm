import { NextRequest, NextResponse } from 'next/server'

const POLYGON_API_KEY = process.env.POLYGON_API_KEY

export async function GET(request: NextRequest) {
  try {
    // Mock data for top gainers and losers
    const mockGainers = [
      {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        price: 487.20,
        change: 24.30,
        changePercent: 5.25,
        volume: 45789231
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc',
        price: 195.45,
        change: 8.92,
        changePercent: 4.78,
        volume: 38234567
      },
      {
        symbol: 'AMD',
        name: 'Advanced Micro Devices',
        price: 128.30,
        change: 5.12,
        changePercent: 4.16,
        volume: 28456789
      },
      {
        symbol: 'META',
        name: 'Meta Platforms',
        price: 412.80,
        change: 15.67,
        changePercent: 3.95,
        volume: 25678901
      },
      {
        symbol: 'AMZN',
        name: 'Amazon.com Inc',
        price: 168.70,
        change: 5.89,
        changePercent: 3.62,
        volume: 42567890
      }
    ]

    const mockLosers = [
      {
        symbol: 'SNAP',
        name: 'Snap Inc',
        price: 13.30,
        change: -0.92,
        changePercent: -6.47,
        volume: 18234567
      },
      {
        symbol: 'PYPL',
        name: 'PayPal Holdings',
        price: 58.90,
        change: -3.45,
        changePercent: -5.53,
        volume: 15678901
      },
      {
        symbol: 'NFLX',
        name: 'Netflix Inc',
        price: 425.60,
        change: -18.90,
        changePercent: -4.25,
        volume: 12345678
      },
      {
        symbol: 'DIS',
        name: 'Walt Disney Co',
        price: 98.45,
        change: -3.67,
        changePercent: -3.59,
        volume: 14567890
      },
      {
        symbol: 'BA',
        name: 'Boeing Company',
        price: 215.30,
        change: -7.12,
        changePercent: -3.20,
        volume: 8901234
      }
    ]

    // If we have a Polygon API key, try to fetch real data
    if (POLYGON_API_KEY) {
      try {
        // Fetch top gainers/losers from Polygon
        const response = await fetch(
          `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?apiKey=${POLYGON_API_KEY}`
        )
        
        console.log('Gainers API response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Gainers data:', data?.tickers?.length, 'tickers found')
          
          if (data.tickers?.length > 0) {
            // Map the first 5 gainers
            const realGainers = data.tickers.slice(0, 5).map((ticker: any) => ({
              symbol: ticker.ticker,
              name: ticker.ticker, // Polygon doesn't always provide names
              price: ticker.day.c,
              change: ticker.day.c - ticker.day.o,
              changePercent: ((ticker.day.c - ticker.day.o) / ticker.day.o) * 100,
              volume: ticker.day.v
            }))
            
            if (realGainers.length > 0) {
              console.log('Returning real gainers data')
              return NextResponse.json({ 
                gainers: realGainers,
                losers: mockLosers
              })
            }
          }
        } else {
          const errorText = await response.text()
          console.error('Polygon API error:', response.status, errorText)
        }

        // Try to fetch losers
        const losersResponse = await fetch(
          `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/losers?apiKey=${POLYGON_API_KEY}`
        )
        
        if (losersResponse.ok) {
          const losersData = await losersResponse.json()
          if (losersData.tickers?.length > 0) {
            const realLosers = losersData.tickers.slice(0, 5).map((ticker: any) => ({
              symbol: ticker.ticker,
              name: ticker.name || ticker.ticker,
              price: ticker.day.c,
              change: ticker.day.c - ticker.day.o,
              changePercent: ((ticker.day.c - ticker.day.o) / ticker.day.o) * 100,
              volume: ticker.day.v
            }))
            
            return NextResponse.json({ 
              gainers: mockGainers,
              losers: realLosers
            })
          }
        }
      } catch (error) {
        console.error('Error fetching real movers data:', error)
        // Fall back to mock data
      }
    }

    return NextResponse.json({ 
      gainers: mockGainers,
      losers: mockLosers
    })
  } catch (error) {
    console.error('Error in market movers API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market movers' },
      { status: 500 }
    )
  }
}
