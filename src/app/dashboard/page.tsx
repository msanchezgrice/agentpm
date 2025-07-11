'use client'

import { useUser } from '@clerk/nextjs'
import { TrendingUp, TrendingDown, Bot, DollarSign, Activity } from 'lucide-react'
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
  { id: 1, name: 'Value Hunter', status: 'active', return: 12.3, trades: 45 },
  { id: 2, name: 'Momentum Rider', status: 'active', return: 18.7, trades: 123 },
  { id: 3, name: 'News Sentiment AI', status: 'paused', return: -2.4, trades: 67 },
]

export default function DashboardPage() {
  const { user } = useUser()

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName || 'Investor'}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's an overview of your AI investment agents
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Portfolio Value</p>
              <p className="text-2xl font-bold mt-1">$11,567</p>
              <p className="text-sm text-success mt-1 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +15.67%
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Agents</p>
              <p className="text-2xl font-bold mt-1">2 / 5</p>
              <p className="text-sm text-gray-500 mt-1">3 available</p>
            </div>
            <Bot className="h-10 w-10 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's P&L</p>
              <p className="text-2xl font-bold mt-1">+$234</p>
              <p className="text-sm text-success mt-1 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +2.08%
              </p>
            </div>
            <Activity className="h-10 w-10 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Trades Today</p>
              <p className="text-2xl font-bold mt-1">23</p>
              <p className="text-sm text-gray-500 mt-1">Across all agents</p>
            </div>
            <Activity className="h-10 w-10 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Portfolio Performance Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Portfolio Performance</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `$${value.toLocaleString()}`}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#0066FF" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Agents */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Active Agents</h2>
          <a href="/dashboard/agents" className="text-brand-primary hover:underline text-sm">
            View all agents →
          </a>
        </div>
        <div className="space-y-4">
          {mockAgents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-success animate-pulse' : 'bg-gray-400'}`} />
                <div>
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-sm text-gray-600">{agent.trades} trades today</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${agent.return >= 0 ? 'text-success' : 'text-danger'}`}>
                  {agent.return >= 0 ? '+' : ''}{agent.return}%
                </p>
                <p className="text-sm text-gray-600">All time</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/dashboard/agents/new" className="bg-brand-primary text-white p-4 rounded-lg text-center hover:bg-blue-700 transition-colors">
          <Bot className="h-8 w-8 mx-auto mb-2" />
          <p className="font-semibold">Create New Agent</p>
        </a>
        <a href="/dashboard/strategies" className="bg-white border border-gray-200 p-4 rounded-lg text-center hover:bg-gray-50 transition-colors">
          <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-700" />
          <p className="font-semibold text-gray-700">Browse Strategies</p>
        </a>
        <a href="/dashboard/settings" className="bg-white border border-gray-200 p-4 rounded-lg text-center hover:bg-gray-50 transition-colors">
          <DollarSign className="h-8 w-8 mx-auto mb-2 text-gray-700" />
          <p className="font-semibold text-gray-700">Upgrade to Live Trading</p>
        </a>
      </div>
    </div>
  )
}
