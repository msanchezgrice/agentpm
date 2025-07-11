'use client'

import { useUser } from '@clerk/nextjs'
import { TrendingUp, TrendingDown, Bot, DollarSign, Activity, Plus, BarChart3, Settings, Zap } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data for demonstration
const performanceData = [
  { date: '2025-01-01', value: 10000 },
  { date: '2025-01-02', value: 10234 },
  { date: '2025-01-03', value: 10456 },
  { date: '2025-01-04', value: 10123 },
  { date: '2025-01-05', value: 10789 },
  { date: '2025-01-06', value: 11234 },
  { date: '2025-01-07', value: 11567 },
]

const mockAgents = [
  { id: 1, name: 'Value Hunter', status: 'active', return: 12.3, trades: 45, strategy: 'Value Investing' },
  { id: 2, name: 'Momentum Rider', status: 'active', return: 18.7, trades: 123, strategy: 'Momentum Trading' },
  { id: 3, name: 'News Sentiment AI', status: 'paused', return: -2.4, trades: 67, strategy: 'Sentiment Analysis' },
  { id: 4, name: 'Crypto Hunter', status: 'active', return: 24.1, trades: 89, strategy: 'Crypto Trading' },
]

export default function DashboardPage() {
  const { user } = useUser()

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user?.firstName || 'Investor'}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Your AI agents are working hard to optimize your portfolio
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Bot className="h-12 w-12 text-white animate-float" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
              <p className="text-3xl font-bold mt-2 text-gray-900">$11,567</p>
              <p className="text-sm text-emerald-600 mt-2 flex items-center font-medium">
                <TrendingUp className="h-4 w-4 mr-1" />
                +15.67% this month
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card p-6 group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Agents</p>
              <p className="text-3xl font-bold mt-2 text-gray-900">3 <span className="text-lg text-gray-500">/ 50</span></p>
              <p className="text-sm text-blue-600 mt-2 font-medium">47 slots available</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-6 group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's P&L</p>
              <p className="text-3xl font-bold mt-2 text-gray-900">+$234</p>
              <p className="text-sm text-emerald-600 mt-2 flex items-center font-medium">
                <TrendingUp className="h-4 w-4 mr-1" />
                +2.08% today
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card p-6 group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trades Today</p>
              <p className="text-3xl font-bold mt-2 text-gray-900">257</p>
              <p className="text-sm text-gray-500 mt-2 font-medium">Across all agents</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Performance Chart */}
      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Portfolio Performance</h2>
            <p className="text-gray-600">Track your investment growth over time</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              +15.67% ↗
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
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
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
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
                stroke="url(#colorGradient)" 
                strokeWidth={3}
                dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#2563EB', strokeWidth: 2 }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Agents */}
      <div className="card p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Active Agents</h2>
            <p className="text-gray-600">Monitor your AI trading agents in real-time</p>
          </div>
          <a href="/dashboard/agents" className="text-brand-primary hover:text-brand-accent font-medium flex items-center group">
            View all agents 
            <TrendingUp className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        <div className="grid gap-4">
          {mockAgents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between p-6 border border-gray-100 rounded-xl hover:border-gray-200 hover:bg-gray-50 transition-all duration-200 group">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full ${agent.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                  {agent.status === 'active' && (
                    <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-900">{agent.name}</p>
                    <p className="text-sm text-gray-600">{agent.strategy} • {agent.trades} trades today</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-xl ${agent.return >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {agent.return >= 0 ? '+' : ''}{agent.return}%
                </p>
                <p className="text-sm text-gray-500 font-medium">All time return</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="/dashboard/agents/new" className="group card p-8 text-center hover:scale-105 transition-all duration-300 border-2 border-dashed border-gray-200 hover:border-brand-primary">
          <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Plus className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-bold text-xl text-gray-900 mb-2">Create New Agent</h3>
          <p className="text-gray-600">Deploy a new AI trading agent with custom strategies</p>
        </a>
        
        <a href="/dashboard/strategies" className="group card p-8 text-center hover:scale-105 transition-all duration-300">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="font-bold text-xl text-gray-900 mb-2">Browse Strategies</h3>
          <p className="text-gray-600">Explore proven trading strategies and templates</p>
        </a>
        
        <a href="/dashboard/settings" className="group card p-8 text-center hover:scale-105 transition-all duration-300 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-bold text-xl text-gray-900 mb-2">Upgrade to Live Trading</h3>
          <p className="text-gray-600">Connect real brokers and start live trading</p>
        </a>
      </div>
    </div>
  )
}
