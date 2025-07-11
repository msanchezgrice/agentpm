'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target, AlertCircle } from 'lucide-react'

// Mock data
const portfolioData = [
  { date: '2025-01-01', value: 10000, benchmark: 10000 },
  { date: '2025-01-02', value: 10234, benchmark: 10120 },
  { date: '2025-01-03', value: 10456, benchmark: 10180 },
  { date: '2025-01-04', value: 10123, benchmark: 10050 },
  { date: '2025-01-05', value: 10789, benchmark: 10220 },
  { date: '2025-01-06', value: 11234, benchmark: 10340 },
  { date: '2025-01-07', value: 11567, benchmark: 10420 },
]

const holdings = [
  { symbol: 'AAPL', name: 'Apple Inc.', quantity: 25, avgPrice: 150.00, currentPrice: 155.25, value: 3881.25, agent: 'Value Hunter' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', quantity: 15, avgPrice: 2400.00, currentPrice: 2456.78, value: 36851.70, agent: 'Momentum Rider' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', quantity: 20, avgPrice: 380.00, currentPrice: 378.90, value: 7578.00, agent: 'Value Hunter' },
  { symbol: 'TSLA', name: 'Tesla Inc.', quantity: 12, avgPrice: 220.00, currentPrice: 235.50, value: 2826.00, agent: 'News Sentiment AI' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', quantity: 8, avgPrice: 450.00, currentPrice: 478.25, value: 3826.00, agent: 'Crypto Hunter' },
]

const allocation = [
  { name: 'Technology', value: 45.2, color: '#3B82F6' },
  { name: 'Healthcare', value: 18.7, color: '#10B981' },
  { name: 'Finance', value: 15.3, color: '#8B5CF6' },
  { name: 'Consumer', value: 12.8, color: '#F59E0B' },
  { name: 'Energy', value: 8.0, color: '#EF4444' },
]

export default function PortfolioPage() {
  const [timeframe, setTimeframe] = useState('7d')
  
  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0)
  const totalGainLoss = holdings.reduce((sum, holding) => 
    sum + (holding.currentPrice - holding.avgPrice) * holding.quantity, 0
  )
  const totalGainLossPercent = (totalGainLoss / (totalValue - totalGainLoss)) * 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Overview</h1>
        <p className="text-gray-600 mt-1">Track your investment performance and holdings</p>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-3xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
              <p className={`text-sm font-medium mt-1 flex items-center ${totalGainLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {totalGainLoss >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)} ({totalGainLossPercent.toFixed(2)}%)
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Day's Change</p>
              <p className="text-2xl font-bold text-emerald-600">+$234.56</p>
              <p className="text-sm text-emerald-600 font-medium">+2.08%</p>
            </div>
            <TrendingUp className="h-10 w-10 text-emerald-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Holdings</p>
              <p className="text-2xl font-bold text-gray-900">{holdings.length}</p>
              <p className="text-sm text-gray-600">Across 4 agents</p>
            </div>
            <BarChart3 className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Diversification</p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
              <p className="text-sm text-emerald-600 font-medium">Well balanced</p>
            </div>
            <Target className="h-10 w-10 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Performance vs Benchmark</h2>
            <p className="text-gray-600">Compare your portfolio against market benchmark</p>
          </div>
          <div className="flex gap-2">
            {['7d', '1m', '3m', '6m', '1y'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  timeframe === period
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={portfolioData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                stroke="#64748b"
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                stroke="#64748b"
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `$${value.toLocaleString()}`, 
                  name === 'value' ? 'Portfolio' : 'Benchmark'
                ]}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#2563EB" 
                strokeWidth={3}
                dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="benchmark" 
                stroke="#9CA3AF" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#9CA3AF', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Holdings and Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Holdings */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Holdings</h3>
          <div className="space-y-4">
            {holdings.map((holding) => (
              <div key={holding.symbol} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{holding.symbol.slice(0, 2)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{holding.symbol}</p>
                    <p className="text-sm text-gray-600">{holding.name}</p>
                    <p className="text-xs text-blue-600">{holding.agent}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${holding.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{holding.quantity} shares</p>
                  <p className={`text-sm font-medium ${
                    holding.currentPrice >= holding.avgPrice ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {holding.currentPrice >= holding.avgPrice ? '+' : ''}
                    {(((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Allocation */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Sector Allocation</h3>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {allocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {allocation.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
