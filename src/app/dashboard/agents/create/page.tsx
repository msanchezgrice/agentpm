'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  ArrowRight, 
  Bot, 
  Brain,
  Sparkles,
  TrendingUp,
  Shield,
  Settings,
  Zap,
  AlertCircle,
  Check,
  ChevronRight,
  Code,
  LineChart,
  DollarSign,
  Calendar,
  Target,
  Loader2,
  Info,
  FileText,
  PieChart,
  BarChart3
} from 'lucide-react'

// Step components
import BasicInfoStep from '@/components/agent-wizard/BasicInfoStep'
import StrategyConfigStep from '@/components/agent-wizard/StrategyConfigStep'
import LLMConfigStep from '@/components/agent-wizard/LLMConfigStep'
import TradingRulesStep from '@/components/agent-wizard/TradingRulesStep'
import BacktestingStep from '@/components/agent-wizard/BacktestingStep'
import ReviewStep from '@/components/agent-wizard/ReviewStep'

export interface AgentConfig {
  // Basic Info
  name: string
  description: string
  strategy_type: 'momentum' | 'value' | 'mean_reversion' | 'sentiment' | 'arbitrage' | 'custom'
  risk_tolerance: 'low' | 'medium' | 'high'
  
  // Strategy Config
  indicators: string[]
  timeframe: '1min' | '5min' | '15min' | '1hour' | '1day'
  symbols: string[]
  max_positions: number
  position_sizing: 'fixed' | 'kelly' | 'risk_parity' | 'volatility_adjusted'
  
  // LLM Config
  llm_provider: 'openai' | 'anthropic' | 'google' | 'custom'
  llm_model: string
  temperature: number
  system_prompt: string
  analysis_prompt: string
  
  // Trading Rules
  entry_rules: {
    min_confidence: number
    max_position_size: number
    require_confirmations: number
    forbidden_hours: string[]
  }
  exit_rules: {
    stop_loss: number
    take_profit: number
    trailing_stop: boolean
    time_based_exit: boolean
    max_hold_days: number
  }
  risk_management: {
    max_daily_loss: number
    max_drawdown: number
    position_correlation_limit: number
    sector_concentration_limit: number
  }
  
  // Backtesting
  backtest_period: '1month' | '3months' | '6months' | '1year' | '3years'
  initial_capital: number
  commission_rate: number
  slippage_rate: number
}

const steps = [
  { id: 'basic', title: 'Basic Information', icon: Bot },
  { id: 'strategy', title: 'Strategy Configuration', icon: Brain },
  { id: 'llm', title: 'AI Model Setup', icon: Sparkles },
  { id: 'rules', title: 'Trading Rules', icon: Shield },
  { id: 'backtest', title: 'Backtesting', icon: LineChart },
  { id: 'review', title: 'Review & Launch', icon: Check }
]

export default function CreateAgentPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')
  
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    // Basic Info
    name: '',
    description: '',
    strategy_type: 'momentum',
    risk_tolerance: 'medium',
    
    // Strategy Config
    indicators: ['RSI', 'MACD', 'MA_50'],
    timeframe: '1day',
    symbols: [],
    max_positions: 10,
    position_sizing: 'fixed',
    
    // LLM Config
    llm_provider: 'openai',
    llm_model: 'gpt-4-turbo',
    temperature: 0.7,
    system_prompt: '',
    analysis_prompt: '',
    
    // Trading Rules
    entry_rules: {
      min_confidence: 0.7,
      max_position_size: 0.1,
      require_confirmations: 2,
      forbidden_hours: []
    },
    exit_rules: {
      stop_loss: 5,
      take_profit: 10,
      trailing_stop: true,
      time_based_exit: false,
      max_hold_days: 30
    },
    risk_management: {
      max_daily_loss: 2,
      max_drawdown: 10,
      position_correlation_limit: 0.7,
      sector_concentration_limit: 0.3
    },
    
    // Backtesting
    backtest_period: '6months',
    initial_capital: 100000,
    commission_rate: 0.001,
    slippage_rate: 0.001
  })

  const updateConfig = (updates: Partial<AgentConfig>) => {
    setAgentConfig(prev => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCreate = async () => {
    setIsCreating(true)
    setError('')
    
    try {
      // Create the agent
      const response = await fetch('/api/agents/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agentConfig)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create agent')
      }
      
      const { agent } = await response.json()
      
      // Redirect to the new agent's page
      router.push(`/dashboard/agents/${agent.id}`)
    } catch (err) {
      console.error('Error creating agent:', err)
      setError('Failed to create agent. Please try again.')
      setIsCreating(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep config={agentConfig} updateConfig={updateConfig} />
      case 1:
        return <StrategyConfigStep config={agentConfig} updateConfig={updateConfig} />
      case 2:
        return <LLMConfigStep config={agentConfig} updateConfig={updateConfig} />
      case 3:
        return <TradingRulesStep config={agentConfig} updateConfig={updateConfig} />
      case 4:
        return <BacktestingStep config={agentConfig} updateConfig={updateConfig} />
      case 5:
        return <ReviewStep config={agentConfig} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/dashboard/agents" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create AI Agent</h1>
        </div>
        <p className="text-gray-600">
          Configure your custom AI trading agent with advanced strategies and risk management.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center transition-colors
                      ${isActive ? 'bg-blue-600 text-white' : 
                        isCompleted ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                      Step {index + 1}
                    </p>
                    <p className={`text-sm ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 ml-4">
                    <div className={`h-1 rounded ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="card p-8 mb-8">
        {renderStep()}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        
        {currentStep < steps.length - 1 ? (
          <button
            onClick={handleNext}
            className="btn-primary"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        ) : (
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Agent...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Create Agent
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
