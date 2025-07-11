'use client'

import { useState } from 'react'
import { TrendingUp, Bot, Users, Star, Clock, DollarSign, BarChart3, Zap } from 'lucide-react'

// Mock data for strategies
const mockStrategies = [
  {
    id: 1,
    name: 'Value Investing Master',
    category: 'Value Investing',
    description: 'Warren Buffett-inspired strategy focusing on undervalued stocks with strong fundamentals and long-term growth potential.',
    avgReturn: 12.3,
    winRate: 68.5,
    users: 1247,
    rating: 4.8,
    risk: 'Low',
    timeframe: 'Long-term',
    minCapital: 1000,
    tags: ['Fundamentals', 'Long-term', 'Blue-chip']
  },
  {
    id: 2,
    name: 'Momentum Beast',
    category: 'Momentum Trading',
    description: 'Rides market trends using advanced technical indicators and volume analysis for optimized short-term gains.',
    avgReturn: 18.7,
    winRate: 72.3,
    users: 892,
    rating: 4.6,
    risk: 'Medium',
    timeframe: 'Short-term',
    minCapital: 2500,
    tags: ['Technical Analysis', 'Trends', 'High-frequency']
  },
  {
    id: 3,
    name: 'News Sentiment Pro',
    category: 'Sentiment Analysis',
    description: 'AI analyzes news sentiment, social media trends, and market data to predict price movements and optimize entry points.',
    avgReturn: 15.2,
    winRate: 65.8,
    users: 623,
    rating: 4.4,
    risk: 'Medium',
    timeframe: 'Medium-term',
    minCapital: 1500,
    tags: ['AI', 'Sentiment', 'News']
  },
  {
    id: 4,
    name: 'Crypto Swing Master',
    category: 'Crypto Trading',
    description: 'Specialized cryptocurrency trading strategy using advanced volatility patterns and market microstructure analysis.',
    avgReturn: 24.1,
    winRate: 78.9,
    users: 456,
    rating: 4.9,
    risk: 'High',
    timeframe: 'Short-term',
    minCapital: 5000,
    tags: ['Crypto', 'Volatility', 'High-return']
  },
  {
    id: 5,
    name: 'Options Scalper',
    category: 'Options Trading',
    description: 'High-frequency options trading with sophisticated Greeks analysis and risk management protocols.',
    avgReturn: 31.5,
    winRate: 58.3,
    users: 234,
    rating: 4.2,
    risk: 'High',
    timeframe: 'Intraday',
    minCapital: 10000,
    tags: ['Options', 'Greeks', 'Scalping']
  },
  {
    id: 6,
    name: 'Dividend Growth',
    category: 'Dividend Investing',
    description: 'Focus on dividend-paying stocks with consistent growth history and sustainable payout ratios.',
    avgReturn: 9.8,
    winRate: 82.1,
    users: 1891,
    rating: 4.7,
    risk: 'Low',
    timeframe: 'Long-term',
    minCapital: 500,
    tags: ['Dividends', 'Income', 'Conservative']
  }
]

export default function StrategiesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedRisk, setSelectedRisk] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(mockStrategies.map(s => s.category)))]
  const risks = ['all', 'Low', 'Medium', 'High']

  const filteredStrategies = mockStrategies.filter(strategy => {
    if (selectedCategory !== 'all' && strategy.category !== selectedCategory) return false
    if (selectedRisk !== 'all' && strategy.risk !== selectedRisk) return false
    return true
  })

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-emerald-600 bg-emerald-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'High': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trading Strategies</h1>
          <p className="text-gray-600 mt-1">Discover and deploy proven trading strategies</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Bot className="h-4 w-4" />
          Create Custom Strategy
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Strategies</p>
              <p className="text-2xl font-bold text-gray-900">{mockStrategies.length}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Return</p>
              <p className="text-2xl font-bold text-emerald-600">
                +{(mockStrategies.reduce((sum, s) => sum + s.avgReturn, 0) / mockStrategies.length).toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-purple-600">
                {mockStrategies.reduce((sum, s) => sum + s.users, 0).toLocaleString()}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-600">
                {(mockStrategies.reduce((sum, s) => sum + s.rating, 0) / mockStrategies.length).toFixed(1)}
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          <span className="text-sm font-medium text-gray-700 py-2">Category:</span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <span className="text-sm font-medium text-gray-700 py-2">Risk:</span>
          {risks.map((risk) => (
            <button
              key={risk}
              onClick={() => setSelectedRisk(risk)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedRisk === risk
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {risk === 'all' ? 'All Risk Levels' : risk}
            </button>
          ))}
        </div>
      </div>

      {/* Strategies Grid */}
      <div className="grid gap-6">
        {filteredStrategies.map((strategy) => (
          <div key={strategy.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">{strategy.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {strategy.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(strategy.risk)}`}>
                    {strategy.risk} Risk
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">{strategy.description}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="font-medium text-gray-900">{strategy.rating}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Avg Return</p>
                <p className="font-bold text-emerald-600">+{strategy.avgReturn}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Win Rate</p>
                <p className="font-bold text-gray-900">{strategy.winRate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Users</p>
                <p className="font-bold text-gray-900">{strategy.users.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Timeframe</p>
                <p className="font-bold text-gray-900">{strategy.timeframe}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Min Capital</p>
                <p className="font-bold text-gray-900">${strategy.minCapital.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {strategy.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary">View Details</button>
                <button className="btn-primary">Deploy Strategy</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStrategies.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No strategies found</h3>
          <p className="text-gray-600">Try adjusting your filters or create a custom strategy.</p>
        </div>
      )}
    </div>
  )
}
