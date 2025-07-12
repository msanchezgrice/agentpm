import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Trigger the trading engine
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/trading/run-agents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Trading engine failed: ${response.status}`)
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: 'Trading simulation executed',
      result
    })
  } catch (error) {
    console.error('Test trading error:', error)
    return NextResponse.json(
      { error: 'Failed to run trading simulation' },
      { status: 500 }
    )
  }
}
