'use client'

import { Bot, Info } from 'lucide-react'
import { AgentConfig } from '@/app/dashboard/agents/create/page'

interface BasicInfoStepProps {
  config: AgentConfig
  updateConfig: (updates: Partial<AgentConfig>) => void
}

export default function BasicInfoStep({ config, updateConfig }: BasicInfoStepProps) {
  const strategies = [
    {
      id: 'momentum',
      name: 'Momentum Trading',
      description: 'Ride market trends using technical indicators and volume analysis',
      icon: '📈'
    },
    {
      id: 'value',
      name: 'Value Investing',
      description: 'Find undervalued stocks with strong fundamentals',
      icon: '💎'
    },
    {
      id: 'mean_reversion',
      name: 'Mean Reversion',
      description: 'Trade on the principle that prices return to their average',
      icon: '↔️'
    },
    {
      id: 'sentiment',
      name: 'Sentiment Analysis',
      description: 'Trade based on news sentiment and social media trends',
      icon: '🧠'
    },
    {
      id: 'arbitrage',
      name: 'Arbitrage',
      description: 'Exploit price differences across markets or assets',
      icon: '⚡'
    },
    {
      id: 'custom',
      name: 'Custom Strategy',
      description: 'Define your own unique trading strategy',
      icon: '🔧'
    }
  ]

  const riskLevels = [
    {
      id: 'low',
      name: 'Low Risk',
      description: 'Conservative approach with capital preservation focus',
      color: 'text-green-600 bg-green-50 border-green-200'
    },
    {
      id: 'medium',
      name: 'Medium Risk',
      description: 'Balanced approach with moderate growth targets',
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
    },
    {
      id: 'high',
      name: 'High Risk',
      description: 'Aggressive approach for maximum returns',
      color: 'text-red-600 bg-red-50 border-red-200'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600">
          Let's start with the basics. Give your agent a name and choose its primary strategy.
        </p>
      </div>

      {/* Agent Name */}
      <div>
        <label htmlFor="agent-name" className="block text-sm font-medium text-gray-700 mb-2">
          Agent Name *
        </label>
        <input
          id="agent-name"
          type="text"
          value={config.name}
          onChange={(e) => updateConfig({ name: e.target.value })}
          placeholder="e.g., Tech Momentum Master"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Choose a memorable name for your AI agent
        </p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={config.description}
          onChange={(e) => updateConfig({ description: e.target.value })}
          placeholder="Describe your agent's strategy and goals..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Optional: Add a brief description of your agent's approach
        </p>
      </div>

      {/* Strategy Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Trading Strategy *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map(strategy => (
            <div
              key={strategy.id}
              onClick={() => updateConfig({ strategy_type: strategy.id as any })}
              className={`
                p-4 border-2 rounded-lg cursor-pointer transition-all
                ${config.strategy_type === strategy.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{strategy.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{strategy.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Tolerance */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Risk Tolerance *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {riskLevels.map(level => (
            <div
              key={level.id}
              onClick={() => updateConfig({ risk_tolerance: level.id as any })}
              className={`
                p-4 border-2 rounded-lg cursor-pointer transition-all
                ${config.risk_tolerance === level.id 
                  ? level.color 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <h4 className="font-medium text-gray-900">{level.name}</h4>
              <p className="text-sm mt-1">{level.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Quick Tip</p>
          <p>
            Your strategy type and risk tolerance will determine the default parameters for your agent.
            You can fine-tune these settings in the next steps.
          </p>
        </div>
      </div>
    </div>
  )
}
