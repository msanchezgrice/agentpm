'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { useSupabaseClient } from '@/lib/supabase/client'
import { Bot, ArrowLeft, Zap, TrendingUp, Shield, BarChart3, Brain, Target } from 'lucide-react'

const strategies = [
  {
    id: 'value-investing',
    name: 'Value Investing',
    description: 'Warren Buffett-inspired strategy focusing on undervalued stocks with strong fundamentals',
    risk: 'Low',
    timeframe: 'Long-term',
    avgReturn: '12.3%',
    icon: Shield,
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 'momentum-trading',
    name: 'Momentum Trading', 
    description: 'Rides market trends using advanced technical indicators and volume analysis',
    risk: 'Medium',
    timeframe: 'Short-term',
    avgReturn: '18.7%',
    icon: TrendingUp,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'sentiment-analysis',
    name: 'Sentiment Analysis',
    description: 'AI analyzes news sentiment and social media trends to predict movements',
    risk: 'Medium', 
    timeframe: 'Medium-term',
    avgReturn: '15.2%',
    icon: Brain,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'crypto-trading',
    name: 'Crypto Trading',
    description: 'Specialized cryptocurrency trading using volatility patterns',
    risk: 'High',
    timeframe: 'Short-term', 
    avgReturn: '24.1%',
    icon: Zap,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'options-trading',
    name: 'Options Trading',
    description: 'High-frequency options trading with sophisticated Greeks analysis',
    risk: 'High',
    timeframe: 'Intraday',
    avgReturn: '31.5%',
    icon: BarChart3,
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'dividend-growth',
    name: 'Dividend Growth',
    description: 'Focus on dividend-paying stocks with consistent growth history',
    risk: 'Low',
    timeframe: 'Long-term',
    avgReturn: '9.8%',
    icon: Target,
    color: 'from-green-500 to-green-600'
  }
]

export default function NewAgentPage() {
  const router = useRouter()
  const { userId } = useAuth()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [agentData, setAgentData] = useState({
    name: '',
    strategy: '',
    initialCapital: 1000,
    riskTolerance: 'moderate',
    tradingFrequency: 'daily',
    description: ''
  })

  // Save agent to Supabase
  const handleCreateAgent = async () => {
    if (!userId) {
      setError('You must be logged in to create an agent')
      return
    }

    setIsSubmitting(true)
    setError('')
    
    try {
      // First, ensure the user exists in our investment_users table
      const supabase = useSupabaseClient()
      
      // Insert user if not exists
      await supabase.from('investment_users').upsert({
        id: userId,
        email: '', // We'll get this from Clerk in a production app
        name: '' // We'll get this from Clerk in a production app
      }).select()
      
      // Insert agent
      const { data, error } = await supabase.from('agents').insert({
        user_id: userId,
        name: agentData.name,
        strategy_id: agentData.strategy,
        initial_capital: agentData.initialCapital,
        current_capital: agentData.initialCapital, // Start with same as initial
        risk_tolerance: agentData.riskTolerance,
        trading_frequency: agentData.tradingFrequency,
        description: agentData.description,
        status: 'active',
        total_trades: 0,
        win_rate: 0,
        total_return: 0
      }).select()
      
      if (error) throw error
      
      console.log('Agent created successfully:', data)
      
      // Redirect to agents list
      router.push('/dashboard/agents')
    } catch (err) {
      console.error('Error creating agent:', err)
      setError('Failed to create agent. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New AI Agent</h1>
          <p className="text-gray-600 mt-1">Set up your AI trading agent with custom parameters</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`w-16 h-1 ${step > stepNum ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <div className="card p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Agent Name</label>
              <input
                type="text"
                value={agentData.name}
                onChange={(e) => setAgentData({...agentData, name: e.target.value})}
                placeholder="e.g., My Value Hunter"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                value={agentData.description}
                onChange={(e) => setAgentData({...agentData, description: e.target.value})}
                placeholder="Describe what this agent should focus on..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Initial Capital</label>
              <select
                value={agentData.initialCapital}
                onChange={(e) => setAgentData({...agentData, initialCapital: parseInt(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1000}>$1,000</option>
                <option value={2500}>$2,500</option>
                <option value={5000}>$5,000</option>
                <option value={10000}>$10,000</option>
                <option value={25000}>$25,000</option>
                <option value={50000}>$50,000</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setStep(2)}
                disabled={!agentData.name}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Choose Strategy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Strategy Selection */}
      {step === 2 && (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose Trading Strategy</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategies.map((strategy) => {
              const IconComponent = strategy.icon
              return (
                <div
                  key={strategy.id}
                  onClick={() => setAgentData({...agentData, strategy: strategy.id})}
                  className={`card p-6 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    agentData.strategy === strategy.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${strategy.color} flex items-center justify-center mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{strategy.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{strategy.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Risk Level</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(strategy.risk)}`}>
                        {strategy.risk}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Timeframe</span>
                      <span className="text-sm font-medium">{strategy.timeframe}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg Return</span>
                      <span className="text-sm font-bold text-emerald-600">+{strategy.avgReturn}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="flex justify-between mt-8">
            <button onClick={() => setStep(1)} className="btn-secondary">
              Back
            </button>
            <button 
              onClick={() => setStep(3)}
              disabled={!agentData.strategy}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Configure Settings
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Configuration */}
      {step === 3 && (
        <div className="card p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Agent Configuration</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tolerance</label>
              <select
                value={agentData.riskTolerance}
                onChange={(e) => setAgentData({...agentData, riskTolerance: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="conservative">Conservative (1-3% per trade)</option>
                <option value="moderate">Moderate (3-5% per trade)</option>
                <option value="aggressive">Aggressive (5-10% per trade)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trading Frequency</label>
              <select
                value={agentData.tradingFrequency}
                onChange={(e) => setAgentData({...agentData, tradingFrequency: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="realtime">Real-time (High frequency)</option>
                <option value="hourly">Hourly checks</option>
                <option value="daily">Daily analysis</option>
                <option value="weekly">Weekly review</option>
              </select>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Agent Summary</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Name:</strong> {agentData.name}</p>
                <p><strong>Strategy:</strong> {strategies.find(s => s.id === agentData.strategy)?.name}</p>
                <p><strong>Initial Capital:</strong> ${agentData.initialCapital.toLocaleString()}</p>
                <p><strong>Risk Level:</strong> {agentData.riskTolerance}</p>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="btn-secondary">
                Back
              </button>
              <button onClick={handleCreateAgent} className="btn-primary">
                Create Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
