'use client'

import { Sparkles, Info, Code } from 'lucide-react'
import { AgentConfig } from '@/app/dashboard/agents/create/page'

interface LLMConfigStepProps {
  config: AgentConfig
  updateConfig: (updates: Partial<AgentConfig>) => void
}

export default function LLMConfigStep({ config, updateConfig }: LLMConfigStepProps) {
  const llmProviders = [
    {
      id: 'openai',
      name: 'OpenAI',
      models: [
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Most capable, fastest GPT-4' },
        { id: 'gpt-4', name: 'GPT-4', description: 'Advanced reasoning' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and cost-effective' }
      ],
      color: 'text-green-600 bg-green-50 border-green-200'
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      models: [
        { id: 'claude-3-opus', name: 'Claude 3 Opus', description: 'Most capable Claude model' },
        { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Balanced performance' },
        { id: 'claude-3-haiku', name: 'Claude 3 Haiku', description: 'Fast and efficient' }
      ],
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    {
      id: 'google',
      name: 'Google',
      models: [
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Advanced multimodal model' },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Fast and efficient' }
      ],
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    }
  ]

  const defaultPrompts = {
    momentum: {
      system: `You are an expert momentum trader with deep knowledge of technical analysis and market psychology. Your goal is to identify and capitalize on strong market trends using a combination of price action, volume, and momentum indicators.

Key principles:
- Focus on stocks showing strong relative strength
- Use multiple timeframe analysis for confirmation
- Consider market sentiment and sector rotation
- Implement strict risk management with stop losses

Always provide clear reasoning for your trading decisions and confidence scores.`,
      analysis: `Analyze {symbol} for momentum trading opportunities.

Current data:
- Price: ${'{price}'}
- Volume: ${'{volume}'} (Avg: ${'{avg_volume}'})
- RSI: ${'{rsi}'}
- MACD: ${'{macd}'}
- 50-day MA: ${'{ma_50}'}
- Price vs 50-day MA: ${'{price_vs_ma50}'}%

Recent news: ${'{news_summary}'}

Provide:
1. Trend analysis (primary, secondary)
2. Momentum strength (1-10)
3. Entry/exit recommendations
4. Risk factors
5. Confidence score (0-1)`
    },
    value: {
      system: `You are a value investing expert following Warren Buffett's principles. Focus on finding undervalued companies with strong fundamentals, competitive advantages, and long-term growth potential.

Key principles:
- Look for companies trading below intrinsic value
- Analyze financial statements and ratios
- Consider management quality and moat
- Think long-term (months to years)
- Margin of safety is paramount`,
      analysis: `Analyze {symbol} for value investing opportunity.

Fundamentals:
- P/E Ratio: ${'{pe_ratio}'} (Industry avg: ${'{industry_pe}'})
- P/B Ratio: ${'{pb_ratio}'}
- Debt/Equity: ${'{debt_equity}'}
- ROE: ${'{roe}'}%
- Revenue Growth: ${'{revenue_growth}'}%
- Free Cash Flow: ${'{fcf}'}

Provide:
1. Intrinsic value estimate
2. Margin of safety analysis
3. Competitive advantage assessment
4. Investment recommendation
5. Confidence score (0-1)`
    }
  }

  const selectedProvider = llmProviders.find(p => p.id === config.llm_provider)
  const promptTemplate = defaultPrompts[config.strategy_type as keyof typeof defaultPrompts] || defaultPrompts.momentum

  const handleProviderChange = (providerId: string) => {
    const provider = llmProviders.find(p => p.id === providerId)
    if (provider && provider.models.length > 0) {
      updateConfig({
        llm_provider: providerId as any,
        llm_model: provider.models[0].id
      })
    }
  }

  const loadDefaultPrompts = () => {
    updateConfig({
      system_prompt: promptTemplate.system,
      analysis_prompt: promptTemplate.analysis
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Model Setup</h2>
        <p className="text-gray-600">
          Configure the AI model that will power your agent's trading decisions.
        </p>
      </div>

      {/* LLM Provider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          AI Provider *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {llmProviders.map(provider => (
            <div
              key={provider.id}
              onClick={() => handleProviderChange(provider.id)}
              className={`
                p-4 border-2 rounded-lg cursor-pointer transition-all
                ${config.llm_provider === provider.id 
                  ? provider.color 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <h4 className="font-medium text-gray-900">{provider.name}</h4>
              <p className="text-sm mt-1">{provider.models.length} models available</p>
            </div>
          ))}
        </div>
      </div>

      {/* Model Selection */}
      {selectedProvider && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Model *
          </label>
          <div className="space-y-3">
            {selectedProvider.models.map(model => (
              <div
                key={model.id}
                onClick={() => updateConfig({ llm_model: model.id })}
                className={`
                  p-4 border-2 rounded-lg cursor-pointer transition-all flex justify-between items-center
                  ${config.llm_model === model.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div>
                  <h4 className="font-medium text-gray-900">{model.name}</h4>
                  <p className="text-sm text-gray-600">{model.description}</p>
                </div>
                {config.llm_model === model.id && (
                  <Sparkles className="h-5 w-5 text-blue-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Temperature */}
      <div>
        <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-2">
          Temperature (Creativity) *
        </label>
        <div className="space-y-2">
          <input
            id="temperature"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.temperature}
            onChange={(e) => updateConfig({ temperature: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Conservative (0)</span>
            <span className="font-medium text-gray-900">{config.temperature}</span>
            <span>Creative (1)</span>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Lower values make decisions more consistent, higher values allow more exploration
        </p>
      </div>

      {/* Prompts */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">AI Prompts</h3>
          <button
            onClick={loadDefaultPrompts}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Load defaults for {config.strategy_type}
          </button>
        </div>

        {/* System Prompt */}
        <div>
          <label htmlFor="system-prompt" className="block text-sm font-medium text-gray-700 mb-2">
            System Prompt *
          </label>
          <textarea
            id="system-prompt"
            value={config.system_prompt}
            onChange={(e) => updateConfig({ system_prompt: e.target.value })}
            placeholder="Define the AI's role, expertise, and decision-making framework..."
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          />
          <p className="mt-1 text-sm text-gray-500">
            Sets the AI's personality and expertise
          </p>
        </div>

        {/* Analysis Prompt */}
        <div>
          <label htmlFor="analysis-prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Analysis Prompt Template *
          </label>
          <textarea
            id="analysis-prompt"
            value={config.analysis_prompt}
            onChange={(e) => updateConfig({ analysis_prompt: e.target.value })}
            placeholder="Template for analyzing trading opportunities. Use {variable} for dynamic data..."
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          />
          <p className="mt-1 text-sm text-gray-500">
            Template used for each trading decision. Variables like {'{symbol}'} will be replaced with real data
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Prompt Engineering Tips</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Be specific about your strategy and risk parameters</li>
            <li>Include clear output format requirements</li>
            <li>Use variables like {'{price}'}, {'{rsi}'} for dynamic data</li>
            <li>Test prompts thoroughly during backtesting</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
