'use client'

import { useState } from 'react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Bot, Activity, BarChart3, Calendar, Download } from 'lucide-react'

// Mock data for analytics
const performanceData = [
  { date: 'Jan 1', portfolio: 10000, agents: 10000, benchmark: 10000 },
  { date: 'Jan 7', portfolio: 10456, agents: 10234, benchmark: 10120 },
  { date: 'Jan 14', portfolio: 10890, agents: 10567, benchmark: 10180 },
  { date: 'Jan 21', portfolio: 11234, agents: 10789, benchmark: 10250 },
  { date: 'Jan 28', portfolio: 11678, agents: 11123, benchmark: 10340 },
  { date: 'Feb 4', portfolio: 12234, agents: 11567, benchmark: 10420 },
  { date: 'Feb 11', portfolio: 12890, agents: 12123, benchmark: 10510 },
]

const agentPerformance = [
  { name: 'Value Hunter', return: 12.3, trades: 45, winRate: 68.5, capital: 5000 },
  { name: 'Momentum Rider', return: 18.7, trades: 123, winRate: 72.3, capital: 7500 },
  { name: 'News Sentiment AI', return: -2.4, trades: 67, winRate: 45.2, capital: 3000 },
  { name: 'Crypto Hunter', return: 24.1, trades: 89, winRate: 78.9, capital: 10000 },
  { name: 'Options Master', return: 8.5, trades: 32, winRate: 62.1, capital: 2500 },
]

const tradingActivity = [
  { hour: '00:00', trades: 12 },
  { hour: '04:00', trades: 8 },
  { hour: '08:00', trades: 24 },
  { hour: '12:00', trades: 45 },
  { hour: '16:00', trades: 38 },
  { hour: '20:00', trades: 22 },
]

const assetAllocation = [
  { name: 'Stocks', value: 45.2, color: '#3B82F6' },
  { name: 'ETFs', value: 22.8, color: '#8B5CF6' },
  { name: 'Crypto', value: 18.5, color: '#F59E0B' },
  { name: 'Options', value: 8.5, color: '#10B981' },
  { name: 'Cash', value: 5.0, color: '#6B7280' },
]

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('portfolio')

  const totalReturn = 28.9
  const totalTrades = 356
  const avgWinRate = 65.4
  const activeAgents = 5

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your AI trading performance</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Last 30 days
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Return</p>
              <p className="text-3xl font-bold text-emerald-600">+{totalReturn}%</p>
              <p className="text-sm text-emerald-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.3% this week
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trades</p>
              <p className="text-3xl font-bold text-gray-900">{totalTrades}</p>
              <p className="text-sm text-gray-600 mt-1">
                Across all agents
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Win Rate</p>
              <p className="text-3xl font-bold text-purple-600">{avgWinRate}%</p>
              <p className="text-sm text-purple-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +1.2% improvement
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Agents</p>
              <p className="text-3xl font-bold text-gray-900">{activeAgents}</p>
              <p className="text-sm text-gray-600 mt-1">
                Currently trading
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Bot className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Performance Overview</h2>
            <p className="text-gray-600">Compare portfolio performance against agents and benchmark</p>
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
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAgents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} stroke="#64748b" />
              <Tooltip 
                formatter={(value: number) => `$${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area type="monotone" dataKey="portfolio" stroke="#3B82F6" fillOpacity={1} fill="url(#colorPortfolio)" strokeWidth={3} />
              <Area type="monotone" dataKey="agents" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorAgents)" strokeWidth={2} />
              <Line type="monotone" dataKey="benchmark" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-8 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Total Portfolio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-700">AI Agents</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-gray-400"></div>
            <span className="text-sm text-gray-700">S&P 500</span>
          </div>
        </div>
      </div>

      {/* Agent Performance & Asset Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Agent Performance */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Agent Performance</h3>
          <div className="space-y-4">
            {agentPerformance.map((agent) => (
              <div key={agent.name} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{agent.name}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span>{agent.trades} trades</span>
                    <span>{agent.winRate}% win rate</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${agent.return >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {agent.return >= 0 ? '+' : ''}{agent.return}%
                  </p>
                  <p className="text-sm text-gray-600">${agent.capital.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Asset Allocation</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {assetAllocation.map((item) => (
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

      {/* Trading Activity */}
      <div className="card p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Trading Activity by Hour</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tradingActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                formatter={(value: number) => [`${value} trades`, 'Trades']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="trades" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
