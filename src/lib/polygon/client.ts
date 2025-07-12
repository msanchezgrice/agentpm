interface PolygonTicker {
  ticker: string
  name: string
  market: string
  locale: string
  primary_exchange: string
  type: string
  active: boolean
  currency_name: string
  cik?: string
  composite_figi?: string
  share_class_figi?: string
  last_updated_utc: string
}

interface PolygonQuote {
  ticker: string
  last: {
    price: number
    size: number
    exchange: number
    timestamp: number
  }
  min: {
    av: number
    c: number
    h: number
    l: number
    o: number
    t: number
    v: number
    vw: number
  }
  prevDay: {
    c: number
    h: number
    l: number
    o: number
    v: number
    vw: number
  }
}

interface PolygonAggregates {
  ticker: string
  adjusted: boolean
  queryCount: number
  request_id: string
  resultsCount: number
  status: string
  results: Array<{
    c: number  // close
    h: number  // high
    l: number  // low
    o: number  // open
    t: number  // timestamp
    v: number  // volume
    vw: number // volume weighted average
  }>
}

class PolygonClient {
  private apiKey: string
  private baseUrl = 'https://api.polygon.io'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}apikey=${this.apiKey}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Get real-time quote for a ticker
  async getRealTimeQuote(ticker: string): Promise<PolygonQuote> {
    return this.makeRequest<PolygonQuote>(`/v2/last/trade/${ticker}`)
  }

  // Get previous day's data
  async getPreviousDay(ticker: string): Promise<PolygonAggregates> {
    return this.makeRequest<PolygonAggregates>(`/v2/aggs/ticker/${ticker}/prev`)
  }

  // Get aggregates (OHLCV) for a time period
  async getAggregates(
    ticker: string,
    timespan: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' = 'day',
    multiplier = 1,
    from: string,
    to: string
  ): Promise<PolygonAggregates> {
    return this.makeRequest<PolygonAggregates>(
      `/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}`
    )
  }

  // Get market status
  async getMarketStatus(): Promise<{
    market: string
    serverTime: string
    exchanges: {
      nasdaq: string
      nyse: string
      otc: string
    }
    currencies: {
      fx: string
      crypto: string
    }
  }> {
    return this.makeRequest('/v1/marketstatus/now')
  }

  // Search for tickers
  async searchTickers(search: string, limit = 10): Promise<{
    results: PolygonTicker[]
    status: string
    request_id: string
    count: number
    next_url?: string
  }> {
    return this.makeRequest(`/v3/reference/tickers?search=${encodeURIComponent(search)}&limit=${limit}&active=true`)
  }

  // Get ticker details
  async getTickerDetails(ticker: string): Promise<{
    results: PolygonTicker
    status: string
    request_id: string
  }> {
    return this.makeRequest(`/v3/reference/tickers/${ticker}`)
  }

  // Get popular tickers (most active)
  async getPopularTickers(limit = 50): Promise<{
    results: Array<{
      ticker: string
      name: string
      market: string
      locale: string
      primary_exchange: string
      type: string
      active: boolean
      currency_name: string
      last_updated_utc: string
    }>
    status: string
    request_id: string
    count: number
  }> {
    return this.makeRequest(`/v3/reference/tickers?active=true&limit=${limit}&sort=ticker`)
  }
}

// Export singleton instance
let polygonClient: PolygonClient | null = null

export function getPolygonClient(): PolygonClient {
  if (!polygonClient) {
    const apiKey = process.env.POLYGON_API_KEY
    if (!apiKey) {
      throw new Error('POLYGON_API_KEY environment variable is required')
    }
    polygonClient = new PolygonClient(apiKey)
  }
  return polygonClient
}

export { PolygonClient }
export type { PolygonTicker, PolygonQuote, PolygonAggregates }
