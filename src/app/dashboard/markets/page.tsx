'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  RefreshCw, 
  ArrowUp,
  ArrowDown,
  Minus,
  Clock,
  Trophy,
  Zap
} from 'lucide-react'

interface MarketIndex {
  symbol: string
  name: string
  value: number
  change: number
  changePercent: number
  lastUpdated: string
}

interface StockMover {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
}

interface TopAgent {
  id: string
  name: string
  strategy_type: string
  total_return_pct: number
  current_capital: number
  win_rate: number
  total_trades: number
  last_trade_at: string
}

export default function MarketsPage() {
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([])
  const [topGainers, setTopGainers] = useState<StockMover[]>([])
  const [topLosers, setTopLosers] = useState<StockMover[]>([])
  const [topAgents, setTopAgents] = useState<TopAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Fetch market data
  const fetchMarketData = async () => {
    try {
      // Fetch market indices
      const indicesRes = await fetch('/api/market/indices')
      if (indicesRes.ok) {
        const data = await indicesRes.json()
        setMarketIndices(data.indices || [])
      }

      // Fetch top movers
      const moversRes = await fetch('/api/market/movers')
      if (moversRes.ok) {
        const data = await moversRes.json()
        setTopGainers(data.gainers || [])
        setTopLosers(data.losers || [])
      }

      // Fetch top agents
      const agentsRes = await fetch('/api/agents/leaderboard')
      if (agentsRes.ok) {
        const data = await agentsRes.json()
        setTopAgents(data.agents || [])
      }

      setLastRefresh(new Date())
    } catch (error) {
      console.error('Error fetching market data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMarketData()

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (autoRefresh) {
        fetchMarketData()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
    return num.toFixed(2)
  }

  const formatPercent = (percent: number) => {
    const prefix = percent >= 0 ? '+' : ''
    return `${prefix}${percent.toFixed(2)}%`
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4" />
    if (change < 0) return <ArrowDown className="h-4 w-4" />
    return <Minus className="h-4 w-4" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-emerald-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Activity className="h-12 w-12 text-blue-500 animate-pulse" />
        <p className="ml-4 text-gray-600">Loading market data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Markets Overview</h1>
          <p className="text-gray-600">Real-time market data and top performing agents</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Auto-refresh</span>
          </label>
          <button
            onClick={fetchMarketData}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Market Indices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {marketIndices.map((index) => (
          <div key={index.symbol} className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{index.name}</h3>
                <p className="text-sm text-gray-600">{index.symbol}</p>
              </div>
              <div className={`p-2 rounded-lg ${index.change >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                {index.change >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">{formatNumber(index.value)}</p>
              <div className={`flex items-center gap-2 ${getChangeColor(index.change)}`}>
                {getChangeIcon(index.change)}
                <span className="font-medium">{formatNumber(Math.abs(index.change))}</span>
                <span className="text-sm">({formatPercent(index.changePercent)})</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div className="card">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Top Gainers
            </h3>
          </div>
          <div className="divide-y">
            {topGainers.map((stock) => (
              <div key={stock.symbol} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{stock.symbol}</p>
                    <p className="text-sm text-gray-600">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(stock.price)}</p>
                    <p className="text-sm text-emerald-600 flex items-center justify-end gap-1">
                      <ArrowUp className="h-3 w-3" />
                      {formatPercent(stock.changePercent)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Volume: {formatNumber(stock.volume)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="card">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Top Losers
            </h3>
          </div>
          <div className="divide-y">
            {topLosers.map((stock) => (
              <div key={stock.symbol} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{stock.symbol}</p>
                    <p className="text-sm text-gray-600">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(stock.price)}</p>
                    <p className="text-sm text-red-600 flex items-center justify-end gap-1">
                      <ArrowDown className="h-3 w-3" />
                      {formatPercent(stock.changePercent)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Volume: {formatNumber(stock.volume)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Agents */}
      <div className="card">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Top Performing Agents
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strategy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Return</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Win Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Portfolio Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Trade</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topAgents.map((agent, index) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index === 0 && <span className="text-yellow-600">🥇</span>}
                      {index === 1 && <span className="text-gray-400">🥈</span>}
                      {index === 2 && <span className="text-orange-600">🥉</span>}
                      {index > 2 && <span className="text-gray-500 ml-2">{index + 1}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{agent.name}</p>
                        <p className="text-xs text-gray-500">{agent.total_trades} trades</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                      {agent.strategy_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className={`font-medium ${agent.total_return_pct >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatPercent(agent.total_return_pct)}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-gray-900">{formatPercent(agent.win_rate)}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-medium text-gray-900">{formatCurrency(agent.current_capital)}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agent.last_trade_at ? new Date(agent.last_trade_at).toLocaleString() : 'No trades yet'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
