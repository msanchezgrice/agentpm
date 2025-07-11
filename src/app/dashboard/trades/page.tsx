'use client'

import { useState } from 'react'
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle, Filter, Search } from 'lucide-react'

// Mock data for trades
const mockTrades = [
  {
    id: 1,
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'BUY',
    quantity: 25,
    price: 155.25,
    value: 3881.25,
    timestamp: '2025-01-07 09:30:15',
    status: 'filled',
    agent: 'Value Hunter',
    reason: 'Undervalued based on P/E ratio'
  },
  {
    id: 2,
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    type: 'SELL',
    quantity: 5,
    price: 2456.78,
    value: 12283.90,
    timestamp: '2025-01-07 09:15:42',
    status: 'filled',
    agent: 'Momentum Rider',
    reason: 'Profit taking after 15% gain'
  },
  {
    id: 3,
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    type: 'BUY',
    quantity: 12,
    price: 235.50,
    value: 2826.00,
    timestamp: '2025-01-07 08:45:23',
    status: 'pending',
    agent: 'News Sentiment AI',
    reason: 'Positive earnings sentiment'
  },
  {
    id: 4,
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    type: 'SELL',
    quantity: 3,
    price: 478.25,
    value: 1434.75,
    timestamp: '2025-01-07 08:30:11',
    status: 'cancelled',
    agent: 'Crypto Hunter',
    reason: 'Risk management trigger'
  },
  {
    id: 5,
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    type: 'BUY',
    quantity: 20,
    price: 378.90,
    value: 7578.00,
    timestamp: '2025-01-06 15:45:33',
    status: 'filled',
    agent: 'Value Hunter',
    reason: 'Strong quarterly results'
  },
  {
    id: 6,
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    type: 'SELL',
    quantity: 8,
    price: 142.75,
    value: 1142.00,
    timestamp: '2025-01-06 14:20:18',
    status: 'filled',
    agent: 'Momentum Rider',
    reason: 'Technical breakdown below support'
  },
  {
    id: 7,
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    type: 'BUY',
    quantity: 15,
    price: 285.60,
    value: 4284.00,
    timestamp: '2025-01-06 13:10:45',
    status: 'filled',
    agent: 'News Sentiment AI',
    reason: 'Positive social media engagement data'
  },
  {
    id: 8,
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    type: 'SELL',
    quantity: 6,
    price: 425.30,
    value: 2551.80,
    timestamp: '2025-01-06 11:25:12',
    status: 'filled',
    agent: 'Crypto Hunter',
    reason: 'Overvalued after recent run-up'
  }
]

export default function TradesPage() {
  const [filter, setFilter] = useState<'all' | 'filled' | 'pending' | 'cancelled'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'BUY' | 'SELL'>('all')

  const filteredTrades = mockTrades.filter(trade => {
    if (filter !== 'all' && trade.status !== filter) return false
    if (typeFilter !== 'all' && trade.type !== typeFilter) return false
    if (searchTerm && !trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !trade.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'filled': return 'text-emerald-600 bg-emerald-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'filled': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return null
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'BUY' ? 
      <ArrowUpRight className="h-4 w-4 text-emerald-600" /> : 
      <ArrowDownRight className="h-4 w-4 text-red-600" />
  }

  const stats = {
    total: mockTrades.length,
    filled: mockTrades.filter(t => t.status === 'filled').length,
    pending: mockTrades.filter(t => t.status === 'pending').length,
    cancelled: mockTrades.filter(t => t.status === 'cancelled').length,
    totalValue: mockTrades.filter(t => t.status === 'filled').reduce((sum, t) => sum + t.value, 0),
    buys: mockTrades.filter(t => t.type === 'BUY' && t.status === 'filled').length,
    sells: mockTrades.filter(t => t.type === 'SELL' && t.status === 'filled').length
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Trading Activity</h1>
        <p className="text-gray-600 mt-1">Monitor all your AI agent trades in real-time</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trades</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">All time</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Filled Orders</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.filled}</p>
              <p className="text-sm text-emerald-600">
                {((stats.filled / stats.total) * 100).toFixed(1)}% success rate
              </p>
            </div>
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-gray-600">Awaiting execution</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Trade Volume</p>
              <p className="text-2xl font-bold text-purple-600">${stats.totalValue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Executed trades</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ArrowDownRight className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search symbols or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <span className="text-sm font-medium text-gray-700 py-2">Status:</span>
            {['all', 'filled', 'pending', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <span className="text-sm font-medium text-gray-700 py-2">Type:</span>
            {['all', 'BUY', 'SELL'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  typeFilter === type
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'All Types' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trades Table */}
      <div className="card p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Symbol</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Quantity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Value</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Agent</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((trade) => (
                <tr key={trade.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{trade.symbol}</p>
                      <p className="text-sm text-gray-600">{trade.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(trade.type)}
                      <span className={`font-medium ${trade.type === 'BUY' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {trade.type}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900">{trade.quantity}</td>
                  <td className="py-4 px-4 font-medium text-gray-900">${trade.price.toFixed(2)}</td>
                  <td className="py-4 px-4 font-medium text-gray-900">${trade.value.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trade.status)}`}>
                      {getStatusIcon(trade.status)}
                      {trade.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-blue-600 font-medium">{trade.agent}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">
                      <div>{new Date(trade.timestamp).toLocaleDateString()}</div>
                      <div>{new Date(trade.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTrades.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ArrowUpRight className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trades found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  )
}
