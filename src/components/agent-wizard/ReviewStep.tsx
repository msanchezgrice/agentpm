'use client'

import { 
  Check, 
  Bot, 
  Brain, 
  Sparkles, 
  Shield, 
  LineChart, 
  DollarSign,
  Info,
  AlertCircle
} from 'lucide-react'
import { AgentConfig } from '@/app/dashboard/agents/create/page'

interface ReviewStepProps {
  config: AgentConfig
}

export default function ReviewStep({ config }: ReviewStepProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(value < 0.01 ? 2 : 0)}%`
  }

  const getReadablePeriod = (period: string) => {
    switch (period) {
      case '1month': return '1 Month'
      case '3months': return '3 Months'
      case '6months': return '6 Months'
      case '1year': return '1 Year'
      case '3years': return '3 Years'
      default: return period
    }
  }

  const getReadableTimeframe = (timeframe: string) => {
    switch (timeframe) {
      case '1min': return '1 Minute'
      case '5min': return '5 Minutes'
      case '15min': return '15 Minutes'
      case '1hour': return '1 Hour'
      case '1day': return '1 Day'
      default: return timeframe
    }
  }

  const sections = [
    {
      title: 'Basic Information',
      icon: Bot,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      items: [
        { label: 'Name', value: config.name || 'Not set' },
        { label: 'Strategy Type', value: config.strategy_type, capitalize: true },
        { label: 'Risk Tolerance', value: config.risk_tolerance, capitalize: true },
        { label: 'Description', value: config.description || 'No description' }
      ]
    },
    {
      title: 'Strategy Configuration',
      icon: Brain,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      items: [
        { label: 'Trading Symbols', value: config.symbols.join(', ') || 'None selected' },
        { label: 'Indicators', value: config.indicators.join(', ') || 'None selected' },
        { label: 'Timeframe', value: getReadableTimeframe(config.timeframe) },
        { label: 'Max Positions', value: config.max_positions.toString() },
        { label: 'Position Sizing', value: config.position_sizing.replace('_', ' '), capitalize: true }
      ]
    },
    {
      title: 'AI Model',
      icon: Sparkles,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      items: [
        { label: 'Provider', value: config.llm_provider, capitalize: true },
        { label: 'Model', value: config.llm_model },
        { label: 'Temperature', value: config.temperature.toString() },
        { label: 'System Prompt', value: config.system_prompt ? 'Configured' : 'Not set' },
        { label: 'Analysis Prompt', value: config.analysis_prompt ? 'Configured' : 'Not set' }
      ]
    },
    {
      title: 'Trading Rules',
      icon: Shield,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      items: [
        { label: 'Min Confidence', value: formatPercent(config.entry_rules.min_confidence) },
        { label: 'Max Position Size', value: formatPercent(config.entry_rules.max_position_size) },
        { label: 'Stop Loss', value: `${config.exit_rules.stop_loss}%` },
        { label: 'Take Profit', value: `${config.exit_rules.take_profit}%` },
        { label: 'Trailing Stop', value: config.exit_rules.trailing_stop ? 'Enabled' : 'Disabled' },
        { label: 'Max Daily Loss', value: `${config.risk_management.max_daily_loss}%` },
        { label: 'Max Drawdown', value: `${config.risk_management.max_drawdown}%` }
      ]
    },
    {
      title: 'Backtesting',
      icon: LineChart,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      items: [
        { label: 'Period', value: getReadablePeriod(config.backtest_period) },
        { label: 'Initial Capital', value: formatCurrency(config.initial_capital) },
        { label: 'Commission Rate', value: formatPercent(config.commission_rate) },
        { label: 'Slippage Rate', value: formatPercent(config.slippage_rate) }
      ]
    }
  ]

  // Validation checks
  const validationErrors = []
  if (!config.name) validationErrors.push('Agent name is required')
  if (config.symbols.length === 0) validationErrors.push('At least one trading symbol is required')
  if (config.indicators.length === 0) validationErrors.push('At least one indicator is required')
  if (!config.system_prompt) validationErrors.push('System prompt is required')
  if (!config.analysis_prompt) validationErrors.push('Analysis prompt is required')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Launch</h2>
        <p className="text-gray-600">
          Review your agent configuration before creating. You can go back to any step to make changes.
        </p>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900 mb-2">Please fix the following issues:</h4>
              <ul className="space-y-1 text-sm text-red-700">
                {validationErrors.map((error, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span>•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Summary */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 ${section.bgColor} rounded-lg flex items-center justify-center`}>
                <section.icon className={`h-5 w-5 ${section.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">{item.label}:</span>
                  <span className={`text-sm font-medium text-gray-900 text-right ${item.capitalize ? 'capitalize' : ''}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="card bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Configuration Summary
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{config.symbols.length}</p>
            <p className="text-sm text-gray-600">Symbols</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{config.indicators.length}</p>
            <p className="text-sm text-gray-600">Indicators</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{config.max_positions}</p>
            <p className="text-sm text-gray-600">Max Positions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 capitalize">{config.risk_tolerance}</p>
            <p className="text-sm text-gray-600">Risk Level</p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Ready to backtest with</p>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(config.initial_capital)}</p>
          <p className="text-sm text-gray-600 mt-1">over {getReadablePeriod(config.backtest_period).toLowerCase()}</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">What happens next?</p>
          <ol className="space-y-1 list-decimal list-inside">
            <li>Your agent will be created with a "pending" status</li>
            <li>Backtesting will begin automatically using historical data</li>
            <li>You'll receive results within {config.backtest_period === '1month' ? '1-2' : config.backtest_period === '3months' ? '2-3' : config.backtest_period === '6months' ? '3-5' : '5-10'} minutes</li>
            <li>Review performance metrics before activating live trading</li>
          </ol>
        </div>
      </div>

      {/* Success Icon */}
      {validationErrors.length === 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-lg font-medium text-gray-900">Everything looks good!</p>
          <p className="text-gray-600 mt-1">Your agent is ready to be created and backtested.</p>
        </div>
      )}
    </div>
  )
}
