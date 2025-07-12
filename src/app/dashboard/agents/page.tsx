'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { useSupabaseClient } from '@/lib/supabase/client'
import { 
  Bot, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertCircle, 
  Loader2,
  Star,
  Heart,
  Copy,
  Globe,
  Users
} from 'lucide-react'

interface Agent {
  id: string
  name: string
  description: string
  strategy_type: string
  risk_tolerance: string
  trading_frequency: string
  status: string
  current_capital: number
  initial_capital: number
  created_at: string
  last_trade_at?: string
  user_id?: string
  is_public?: boolean
  total_return_pct?: number
  avg_rating?: number
  review_count?: number
  follower_count?: number
  total_trades?: number
  win_rate?: number
}

export default function AgentsPage() {
  const { userId } = useAuth()
  const [activeTab, setActiveTab] = useState<'my-agents' | 'global-agents'>('my-agents')
  const [loading, setLoading] = useState(true)
  const [myAgents, setMyAgents] = useState<Agent[]>([])
  const [globalAgents, setGlobalAgents] = useState<Agent[]>([])
  const [strategies, setStrategies] = useState<{[key: string]: any}>({})
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'error'>('all')
  const [error, setError] = useState('')

  const supabase = useSupabaseClient()

  // Fetch agent data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // First, fetch strategies
        const { data: strategyData, error: strategyError } = await supabase
          .from('strategies')
          .select('*')
        
        if (strategyError) throw strategyError
        
        // Convert to object map for easy lookup
        const strategyMap = strategyData?.reduce((acc: {[key: string]: any}, strategy: any) => {
          acc[strategy.id] = strategy
          return acc
        }, {}) || {}
        
        setStrategies(strategyMap)
        
        // Fetch user's agents
        const { data: myAgentsData, error: myAgentsError } = await supabase
          .from('agents')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
        
        if (myAgentsError) throw myAgentsError
        setMyAgents(myAgentsData || [])

        // Fetch global public agents
        const { data: globalAgentsData, error: globalAgentsError } = await supabase
          .from('public_agents')
          .select('*')
          .limit(20)
        
        if (globalAgentsError) {
          console.error('Error fetching global agents:', globalAgentsError)
        } else {
          setGlobalAgents(globalAgentsData || [])
        }
        
      } catch (err) {
        console.error('Error fetching agent data:', err)
        setError('Failed to load agents. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [userId])

  const toggleAgentStatus = async (agentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active'
    
    try {
      const { error } = await supabase
        .from('agents')
        .update({ status: newStatus })
        .eq('id', agentId)

      if (error) {
        console.error('Error updating agent status:', error)
      } else {
        setMyAgents(myAgents.map(agent => 
          agent.id === agentId ? { ...agent, status: newStatus } : agent
        ))
      }
    } catch (err) {
      console.error('Error updating agent status:', err)
    }
  }

  const togglePublicStatus = async (agentId: string, currentPublic: boolean) => {
    try {
      const { error } = await supabase
        .from('agents')
        .update({ is_public: !currentPublic })
        .eq('id', agentId)

      if (error) {
        console.error('Error updating public status:', error)
      } else {
        setMyAgents(myAgents.map(agent => 
          agent.id === agentId ? { ...agent, is_public: !currentPublic } : agent
        ))
      }
    } catch (err) {
      console.error('Error updating public status:', err)
    }
  }

  const cloneAgent = async (originalAgentId: string, originalName: string) => {
    try {
      const { data, error } = await supabase.rpc('clone_agent', {
        original_agent_id_param: originalAgentId,
        new_user_id_param: userId,
        new_name_param: `My ${originalName}`
      })

      if (error) {
        console.error('Error cloning agent:', error)
        alert('Failed to clone agent')
      } else {
        alert('Agent cloned successfully!')
        // Refresh the data
        window.location.reload()
      }
    } catch (err) {
      console.error('Error cloning agent:', err)
      alert('Failed to clone agent')
    }
  }

  // Filter agents by status (only for my agents)
  const currentAgents = activeTab === 'my-agents' ? myAgents : globalAgents
  const filteredAgents = activeTab === 'my-agents' 
    ? currentAgents.filter(agent => filter === 'all' || agent.status === filter)
    : currentAgents

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

  const formatStrategyType = (strategy: string) => {
    return strategy?.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || 'Custom Strategy'
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Agents</h1>
          <p className="text-gray-600 mt-1">
            {activeTab === 'my-agents' 
              ? 'Manage your AI trading agents' 
              : 'Discover and clone top-performing agents from the community'
            }
          </p>
        </div>
        {activeTab === 'my-agents' && (
          <Link href="/dashboard/agents/new" className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Agent
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('my-agents')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'my-agents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Bot className="h-4 w-4" />
            My Agents ({myAgents.length})
          </button>
          <button
            onClick={() => setActiveTab('global-agents')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'global-agents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Globe className="h-4 w-4" />
            Global Marketplace ({globalAgents.length})
          </button>
        </nav>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading AI agents...</p>
        </div>
      ) : (
        <>
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </p>
            </div>
          )}
          
          {/* Stats Overview - Only show for My Agents */}
          {activeTab === 'my-agents' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Agents</p>
                    <p className="text-2xl font-bold text-gray-900">{myAgents.length}</p>
                  </div>
                  <Bot className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {myAgents.filter(a => a.status === 'active').length}
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
                      {myAgents.length > 0 ? 
                        `+${(myAgents.reduce((sum, a) => sum + (a.total_return_pct || 0), 0) / myAgents.length).toFixed(1)}%` :
                        '0.0%'
                      }
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
                      ${myAgents.reduce((sum, a) => sum + (a.initial_capital || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>
          )}

          {/* Filters - Only show for My Agents */}
          {activeTab === 'my-agents' && (
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
                      {myAgents.filter(a => a.status === status).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Agents Grid */}
          <div className="grid gap-6">
            {filteredAgents.map((agent) => (
              <Link key={agent.id} href={`/dashboard/agents/${agent.id}`} className="block">
                <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{agent.name}</h3>
                      <p className="text-gray-600">
                        {formatStrategyType(agent.strategy_type)}
                      </p>
                      {/* Global agents: show rating */}
                      {activeTab === 'global-agents' && agent.avg_rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex">
                            {renderStars(agent.avg_rating)}
                          </div>
                          <span className="text-xs text-gray-500">
                            ({agent.review_count} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {activeTab === 'my-agents' ? (
                      <>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(agent.status)}`}>
                          {getStatusIcon(agent.status)}
                          {agent.status}
                        </div>
                        {agent.is_public && (
                          <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            Public
                          </div>
                        )}
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Settings className="h-5 w-5 text-gray-600" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">{agent.follower_count || 0}</span>
                        </div>
                        <button
                          onClick={() => cloneAgent(agent.id, agent.name)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-blue-700"
                        >
                          <Copy className="h-3 w-3" />
                          Clone
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Return</p>
                    <p className={`font-bold ${(agent.total_return_pct || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {(agent.total_return_pct || 0) >= 0 ? '+' : ''}{(agent.total_return_pct || 0).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{activeTab === 'my-agents' ? 'Capital' : 'Initial Capital'}</p>
                    <p className="font-bold text-gray-900">${(agent.initial_capital || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trades</p>
                    <p className="font-bold text-gray-900">{agent.total_trades || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Win Rate</p>
                    <p className="font-bold text-gray-900">{(agent.win_rate || 0).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Frequency</p>
                    <p className="font-bold text-gray-900 capitalize">{agent.trading_frequency || 'Daily'}</p>
                  </div>
                </div>

                {/* My Agents: Additional controls */}
                {activeTab === 'my-agents' && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => toggleAgentStatus(agent.id, agent.status)}
                      className={`px-3 py-1 rounded text-sm font-medium flex items-center gap-1 ${
                        agent.status === 'active'
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {agent.status === 'active' ? (
                        <>
                          <Pause className="h-3 w-3" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3" />
                          Start
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => togglePublicStatus(agent.id, agent.is_public || false)}
                      className={`px-3 py-1 rounded text-sm font-medium flex items-center gap-1 ${
                        agent.is_public
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {agent.is_public ? (
                        <>
                          <Users className="h-3 w-3" />
                          Make Private
                        </>
                      ) : (
                        <>
                          <Globe className="h-3 w-3" />
                          Share Public
                        </>
                      )}
                    </button>
                  </div>
                )}
                </div>
              </Link>
            ))}
          </div>

          {filteredAgents.length === 0 && (
            <div className="text-center py-12">
              <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'my-agents' ? 'No agents found' : 'No public agents available'}
              </h3>
              <p className="text-gray-600">
                {activeTab === 'my-agents' 
                  ? 'Try adjusting your filters or create a new agent.' 
                  : 'Check back later for community agents to clone.'
                }
              </p>
              {activeTab === 'my-agents' && (
                <Link href="/dashboard/agents/new" className="inline-block mt-4 btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Agent
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
