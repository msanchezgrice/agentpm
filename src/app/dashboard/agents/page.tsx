'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bot, Plus, Play, Pause, Settings, TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react'

// Mock data for agents
const mockAgents = [
  {
    id: 1,
    name: 'Value Hunter',
    strategy: 'Value Investing',
    status: 'active',
    return: 12.3,
    trades: 45,
    lastTrade: '2 hours ago',
    capital: 5000,
    winRate: 68.5
  },
  {
    id: 2,
    name: 'Momentum Rider',
    strategy: 'Momentum Trading',
    status: 'active',
    return: 18.7,
    trades: 123,
    lastTrade: '15 minutes ago',
    capital: 7500,
    winRate: 72.3
  },
  {
    id: 3,
    name: 'News Sentiment AI',
    strategy: 'Sentiment Analysis',
    status: 'paused',
    return: -2.4,
    trades: 67,
    lastTrade: '1 day ago',
    capital: 3000,
    winRate: 45.2
  },
  {
    id: 4,
    name: 'Crypto Hunter',
    strategy: 'Crypto Trading',
    status: 'active',
    return: 24.1,
    trades: 89,
    lastTrade: '30 minutes ago',
    capital: 10000,
    winRate: 78.9
  },
  {
    id: 5,
    name: 'Options Master',
    strategy: 'Options Trading',
    status: 'error',
    return: 8.5,
    trades: 32,
    lastTrade: '3 hours ago',
    capital: 2500,
    winRate: 62.1
  },
]

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'error'>('all')

  const filteredAgents = mockAgents.filter(agent => {
    if (filter === 'all') return true
    return agent.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4" />
      case 'paused': return <Pause className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
      default: return <Bot className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Agents</h1>
          <p className="text-gray-600 mt-1">Manage your AI trading agents</p>
        </div>
        <Link href="/dashboard/agents/new" className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Agent
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Agents</p>
              <p className="text-2xl font-bold text-gray-900">{mockAgents.length}</p>
            </div>
            <Bot className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-emerald-600">
                {mockAgents.filter(a => a.status === 'active').length}
              </p>
            </div>
            <Activity className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Return</p>
              <p className="text-2xl font-bold text-blue-600">
                +{(mockAgents.reduce((sum, a) => sum + a.return, 0) / mockAgents.length).toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Capital</p>
              <p className="text-2xl font-bold text-gray-900">
                ${mockAgents.reduce((sum, a) => sum + a.capital, 0).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'active', 'paused', 'error'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <span className="ml-2 bg-white px-2 py-1 rounded-full text-xs">
                {mockAgents.filter(a => a.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Agents Grid */}
      <div className="grid gap-6">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{agent.name}</h3>
                  <p className="text-gray-600">{agent.strategy}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(agent.status)}`}>
                  {getStatusIcon(agent.status)}
                  {agent.status}
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Settings className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-gray-600">Return</p>
                <p className={`font-bold ${agent.return >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {agent.return >= 0 ? '+' : ''}{agent.return}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Capital</p>
                <p className="font-bold text-gray-900">${agent.capital.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Trades</p>
                <p className="font-bold text-gray-900">{agent.trades}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Win Rate</p>
                <p className="font-bold text-gray-900">{agent.winRate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Trade</p>
                <p className="font-bold text-gray-900">{agent.lastTrade}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
          <p className="text-gray-600">Try adjusting your filters or create a new agent.</p>
        </div>
      )}
    </div>
  )
}
