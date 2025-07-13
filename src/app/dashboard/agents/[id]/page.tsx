'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertCircle, 
  Loader2,
  DollarSign,
  Target,
  Clock,
  BarChart3,
  PieChart,
  List,
  Brain,
  Eye,
  EyeOff,
  RefreshCw,
  Calendar
} from 'lucide-react'
import { PerformanceChart, DrawdownChart } from '@/components/charts/PerformanceChart'

// Configuration Tab Component
function ConfigurationTab({ agentId }: { agentId: string }) {
  const [configuration, setConfiguration] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConfiguration = async () => {
      try {
        const response = await fetch(`/api/agents/${agentId}/configuration`)
        if (response.ok) {
          const data = await response.json()
          setConfiguration(data.configuration)
        }
      } catch (error) {
        console.error('Error fetching configuration:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchConfiguration()
  }, [agentId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <p className="ml-4 text-gray-600">Loading configuration...</p>
      </div>
    )
  }

  if (!configuration) {
    return (
      <div className="card p-6">
        <p className="text-gray-600">Configuration not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Agent Configuration</h3>
          <button className="btn-primary flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Edit Configuration
          </button>
        </div>
        
        <div className="space-y-8">
          {/* Strategy Configuration */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Strategy Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Traded Symbols</p>
                <p className="font-medium">{configuration.symbols?.join(', ') || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Indicators</p>
                <p className="font-medium">{configuration.indicators?.map((i: string) => i.toUpperCase().replace('_', ' ')).join(', ') || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Timeframe</p>
                <p className="font-medium">{configuration.timeframe || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Max Positions</p>
                <p className="font-medium">{configuration.max_positions || 5}</p>
              </div>
            </div>
          </div>

          {/* AI Configuration */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">AI Model Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">LLM Provider</p>
                <p className="font-medium capitalize">{configuration.llm_provider || 'OpenAI'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Model</p>
                <p className="font-medium">{configuration.llm_model || 'GPT-4'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Temperature</p>
                <p className="font-medium">{configuration.temperature || 0.7}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Position Sizing</p>
                <p className="font-medium capitalize">{configuration.position_sizing?.replace('_', ' ') || 'Equal Weight'}</p>
              </div>
            </div>
          </div>

          {/* Risk Management */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Risk Management</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Stop Loss</p>
                <p className="font-medium">{(configuration.exit_rules?.stop_loss * 100 || 5).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Take Profit</p>
                <p className="font-medium">{(configuration.exit_rules?.take_profit * 100 || 15).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Max Drawdown</p>
                <p className="font-medium">{(configuration.risk_management?.max_drawdown * 100 || 10).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Position Limit</p>
                <p className="font-medium">{configuration.risk_management?.position_limit || 5}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Backtest Tab Component
function BacktestTab({ agentId, formatCurrency, formatPercent }: { agentId: string, formatCurrency: (amount: number) => string, formatPercent: (percent: number) => string }) {
  const [backtest, setBacktest] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBacktest = async () => {
      try {
        const response = await fetch(`/api/agents/${agentId}/backtest`)
        if (response.ok) {
          const data = await response.json()
          setBacktest(data.backtest)
        }
      } catch (error) {
        console.error('Error fetching backtest:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBacktest()
  }, [agentId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <p className="ml-4 text-gray-600">Loading backtest results...</p>
      </div>
    )
  }

  if (!backtest) {
    return (
      <div className="card p-6">
        <p className="text-gray-600">No backtest results available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Backtest Results</h3>
          <button className="btn-secondary flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Run New Backtest
          </button>
        </div>

        {/* Backtest Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Final Capital</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(backtest.final_capital)}</p>
            <p className="text-sm text-emerald-600">{formatPercent(backtest.total_return_pct)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Trades</p>
            <p className="text-xl font-bold text-gray-900">{backtest.total_trades}</p>
            <p className="text-sm text-gray-600">{backtest.winning_trades}W / {backtest.losing_trades}L</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Sharpe Ratio</p>
            <p className="text-xl font-bold text-gray-900">{backtest.sharpe_ratio?.toFixed(2) || 'N/A'}</p>
            <p className="text-sm text-gray-600">Risk-adjusted</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Max Drawdown</p>
            <p className="text-xl font-bold text-red-600">{formatPercent(backtest.max_drawdown || 0)}</p>
            <p className="text-sm text-gray-600">Peak to trough</p>
          </div>
        </div>

        {/* Backtest Performance Chart */}
        {backtest.performance_data && backtest.performance_data.length > 0 && (
          <div className="mb-8">
            <h4 className="font-medium text-gray-900 mb-4">Backtest Performance</h4>
            <PerformanceChart 
              data={backtest.performance_data} 
              title=""
              showIndices={false}
              height={300}
            />
          </div>
        )}

        {/* Performance by Symbol */}
        {backtest.metrics_by_symbol && (
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Performance by Symbol</h4>
            <div className="overflow-hidden rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trades</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Win Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Return</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(backtest.metrics_by_symbol).map(([symbol, metrics]: [string, any]) => (
                    <tr key={symbol}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{symbol}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{metrics.trades}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{metrics.win_rate.toFixed(1)}%</td>
                      <td className="px-6 py-4 text-sm text-emerald-600">{formatCurrency(metrics.total_return)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

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
  total_return: number
  total_return_pct: number
  total_trades: number
  winning_trades: number
  losing_trades: number
  win_rate: number
  max_drawdown: number
  sharpe_ratio: number
  created_at: string
}

interface Position {
  id: string
  symbol: string
  quantity: number
  entry_price: number
  current_price: number
  market_value: number
  unrealized_pnl: number
  unrealized_pnl_percent: number
  entry_date: string
  last_updated: string
}

interface Trade {
  id: string
  symbol: string
  side: string
  quantity: number
  price: number
  timestamp: string
  reasoning: string
  confidence_score: number
  strategy_signals: any
  trade_outcome: number
}

type TabType = 'overview' | 'positions' | 'trades' | 'strategy' | 'analytics' | 'configuration' | 'backtest'

export default function AgentDetailPage() {
  const params = useParams()
  const agentId = params.id as string
  
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [agent, setAgent] = useState<Agent | null>(null)
  const [positions, setPositions] = useState<Position[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [positionsLoading, setPositionsLoading] = useState(false)
  const [expandedTrade, setExpandedTrade] = useState<string | null>(null)
  const [performanceData, setPerformanceData] = useState<any[]>([])
  const [performancePeriod, setPerformancePeriod] = useState('6months')
  const [performanceLoading, setPerformanceLoading] = useState(false)

  // Fetch agent details
  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/agents/${agentId}`)
        if (!response.ok) throw new Error('Failed to fetch agent details')
        
        const data = await response.json()
        setAgent(data.agent)
        setPositions(data.positions || [])
      } catch (err) {
        console.error('Error fetching agent details:', err)
        setError('Failed to load agent details')
      } finally {
        setLoading(false)
      }
    }

    if (agentId) {
      fetchAgentDetails()
    }
  }, [agentId])

  // Fetch trades when trades tab is active
  useEffect(() => {
    const fetchTrades = async () => {
      if (activeTab !== 'trades') return
      
      try {
        const response = await fetch(`/api/agents/${agentId}/trades`)
        if (!response.ok) throw new Error('Failed to fetch trades')
        
        const data = await response.json()
        setTrades(data.trades || [])
      } catch (err) {
        console.error('Error fetching trades:', err)
      }
    }

    fetchTrades()
  }, [activeTab, agentId])

  // Fetch performance data when overview tab is active
  useEffect(() => {
    const fetchPerformance = async () => {
      if (activeTab !== 'overview') return
      
      try {
        setPerformanceLoading(true)
        const response = await fetch(`/api/agents/${agentId}/performance?period=${performancePeriod}`)
        if (!response.ok) throw new Error('Failed to fetch performance data')
        
        const data = await response.json()
        setPerformanceData(data.performance || [])
      } catch (err) {
        console.error('Error fetching performance data:', err)
      } finally {
        setPerformanceLoading(false)
      }
    }

    fetchPerformance()
  }, [activeTab, agentId, performancePeriod])

  // Refresh positions with real-time prices
  const refreshPositions = async () => {
    setPositionsLoading(true)
    try {
      const response = await fetch(`/api/agents/${agentId}/positions`)
      if (!response.ok) throw new Error('Failed to refresh positions')
      
      const data = await response.json()
      setPositions(data.positions || [])
    } catch (err) {
      console.error('Error refreshing positions:', err)
    } finally {
      setPositionsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'stopped': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4" />
      case 'paused': return <Pause className="h-4 w-4" />
      default: return <Bot className="h-4 w-4" />
    }
  }

  const formatStrategyType = (strategy: string) => {
    return strategy?.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || 'Custom Strategy'
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading agent details...</p>
      </div>
    )
  }

  if (error || !agent) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Agent Not Found</h3>
        <p className="text-gray-600 mb-4">{error || 'The requested agent could not be found.'}</p>
        <Link href="/dashboard/agents" className="btn-primary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Agents
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/agents" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{agent.name}</h1>
            <p className="text-gray-600">{formatStrategyType(agent.strategy_type)}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(agent.status)}`}>
            {getStatusIcon(agent.status)}
            {agent.status}
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">
            <Settings className="h-4 w-4" />
          </button>
          <button className="btn-primary">
            {agent.status === 'active' ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </button>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Capital</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(agent.current_capital)}</p>
              <p className="text-sm text-gray-500">Initial: {formatCurrency(agent.initial_capital)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Return</p>
              <p className={`text-2xl font-bold ${agent.total_return >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatPercent(agent.total_return_pct)}
              </p>
              <p className="text-sm text-gray-500">{formatCurrency(agent.total_return)}</p>
            </div>
            {agent.total_return >= 0 ? (
              <TrendingUp className="h-8 w-8 text-emerald-600" />
            ) : (
              <TrendingDown className="h-8 w-8 text-red-600" />
            )}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-blue-600">{formatPercent(agent.win_rate)}</p>
              <p className="text-sm text-gray-500">{agent.winning_trades}W / {agent.losing_trades}L</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trades</p>
              <p className="text-2xl font-bold text-gray-900">{agent.total_trades}</p>
              <p className="text-sm text-gray-500 capitalize">{agent.trading_frequency}</p>
            </div>
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'positions', label: 'Positions', icon: PieChart },
            { id: 'trades', label: 'Trade History', icon: List },
            { id: 'strategy', label: 'Strategy', icon: Brain },
            { id: 'configuration', label: 'Configuration', icon: Settings },
            { id: 'backtest', label: 'Backtest', icon: Clock },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Performance Chart */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Performance vs Market Indices</h3>
                <div className="flex gap-2">
                  {['1month', '3months', '6months', '1year'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setPerformancePeriod(period)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        performancePeriod === period
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {period === '1month' ? '1M' : period === '3months' ? '3M' : period === '6months' ? '6M' : '1Y'}
                    </button>
                  ))}
                </div>
              </div>
              
              {performanceLoading ? (
                <div className="flex items-center justify-center h-96">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
              ) : performanceData.length > 0 ? (
                <>
                  <PerformanceChart 
                    data={performanceData} 
                    title="" 
                    showIndices={true}
                    height={400}
                  />
                  <div className="mt-8">
                    <DrawdownChart data={performanceData} />
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No performance data available</p>
                </div>
              )}
            </div>

            {/* Risk Metrics */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Risk Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Sharpe Ratio</p>
                  <p className="text-xl font-bold">{agent.sharpe_ratio?.toFixed(2) || 'N/A'}</p>
                  <p className="text-xs text-gray-500 mt-1">Risk-adjusted returns</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Max Drawdown</p>
                  <p className="text-xl font-bold text-red-600">{formatPercent(agent.max_drawdown || 0)}</p>
                  <p className="text-xs text-gray-500 mt-1">Largest peak-to-trough</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Risk Tolerance</p>
                  <p className="text-xl font-bold capitalize">{agent.risk_tolerance}</p>
                  <p className="text-xs text-gray-500 mt-1">Strategy risk level</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trading Frequency</p>
                  <p className="text-xl font-bold capitalize">{agent.trading_frequency}</p>
                  <p className="text-xs text-gray-500 mt-1">Trade execution rate</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'positions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Current Positions</h3>
              <button
                onClick={refreshPositions}
                disabled={positionsLoading}
                className="btn-secondary flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${positionsLoading ? 'animate-spin' : ''}`} />
                Refresh Prices
              </button>
            </div>
            
            {positions.length === 0 ? (
              <div className="card p-8 text-center">
                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Positions</h3>
                <p className="text-gray-600">This agent doesn't have any current positions.</p>
              </div>
            ) : (
              <div className="card overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unrealized P&L</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Held</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {positions.map((position) => (
                      <tr key={position.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {position.symbol}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {position.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(position.entry_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(position.current_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(position.market_value)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className={position.unrealized_pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                            <div className="font-medium">{formatCurrency(position.unrealized_pnl)}</div>
                            <div className="text-xs">{formatPercent(position.unrealized_pnl_percent)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {Math.floor((new Date().getTime() - new Date(position.entry_date).getTime()) / (1000 * 60 * 60 * 24))} days
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'trades' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Trade History</h3>
            
            {trades.length === 0 ? (
              <div className="card p-8 text-center">
                <List className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Trades Yet</h3>
                <p className="text-gray-600">This agent hasn't executed any trades.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trades.map((trade) => (
                  <div key={trade.id} className="card p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="font-bold text-lg">{trade.symbol}</span>
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            trade.side === 'buy' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {trade.side.toUpperCase()}
                          </span>
                          <span className="text-gray-600">{trade.quantity} shares @ {formatCurrency(trade.price)}</span>
                          {trade.trade_outcome !== null && (
                            <span className={`font-medium ${trade.trade_outcome >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {formatCurrency(trade.trade_outcome)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{new Date(trade.timestamp).toLocaleString()}</span>
                          {trade.confidence_score && (
                            <span>Confidence: {Math.round(trade.confidence_score * 100)}%</span>
                          )}
                        </div>

                        {trade.reasoning && (
                          <div className="mt-3">
                            <button
                              onClick={() => setExpandedTrade(expandedTrade === trade.id ? null : trade.id)}
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <Brain className="h-4 w-4" />
                              AI Reasoning
                              {expandedTrade === trade.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                            
                            {expandedTrade === trade.id && (
                              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-700">{trade.reasoning}</p>
                                {trade.strategy_signals && (
                                  <div className="mt-2">
                                    <p className="text-xs font-medium text-gray-600 mb-1">Strategy Signals:</p>
                                    <pre className="text-xs text-gray-600 bg-white p-2 rounded border">
                                      {JSON.stringify(trade.strategy_signals, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Strategy Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Strategy Type</h4>
                  <p className="text-gray-600">{formatStrategyType(agent.strategy_type)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Risk Tolerance</h4>
                  <p className="text-gray-600 capitalize">{agent.risk_tolerance}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Trading Frequency</h4>
                  <p className="text-gray-600 capitalize">{agent.trading_frequency}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Initial Capital</h4>
                  <p className="text-gray-600">{formatCurrency(agent.initial_capital)}</p>
                </div>
              </div>
              
              {agent.description && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{agent.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'configuration' && (
          <ConfigurationTab agentId={agentId} />
        )}

        {activeTab === 'backtest' && (
          <BacktestTab agentId={agentId} formatCurrency={formatCurrency} formatPercent={formatPercent} />
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Analytics</h3>
              <p className="text-gray-600">Advanced analytics coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
