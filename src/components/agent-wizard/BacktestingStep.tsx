'use client'

import { LineChart, Calendar, DollarSign, Percent, Info, Clock } from 'lucide-react'
import { AgentConfig } from '@/app/dashboard/agents/create/page'

interface BacktestingStepProps {
  config: AgentConfig
  updateConfig: (updates: Partial<AgentConfig>) => void
}

export default function BacktestingStep({ config, updateConfig }: BacktestingStepProps) {
  const backtestPeriods = [
    { id: '1month', name: '1 Month', description: 'Quick validation' },
    { id: '3months', name: '3 Months', description: 'Short-term test' },
    { id: '6months', name: '6 Months', description: 'Recommended' },
    { id: '1year', name: '1 Year', description: 'Full market cycle' },
    { id: '3years', name: '3 Years', description: 'Comprehensive test' }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Backtesting Configuration</h2>
        <p className="text-gray-600">
          Test your strategy on historical data to validate performance before going live.
        </p>
      </div>

      {/* Backtest Period */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Backtest Period *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {backtestPeriods.map(period => (
            <div
              key={period.id}
              onClick={() => updateConfig({ backtest_period: period.id as any })}
              className={`
                p-4 border-2 rounded-lg cursor-pointer transition-all
                ${config.backtest_period === period.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <h4 className="font-medium text-gray-900">{period.name}</h4>
              <p className="text-sm text-gray-600">{period.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Initial Capital */}
      <div>
        <label htmlFor="initial-capital" className="block text-sm font-medium text-gray-700 mb-2">
          Initial Capital *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <input
            id="initial-capital"
            type="number"
            min="1000"
            max="10000000"
            step="1000"
            value={config.initial_capital}
            onChange={(e) => updateConfig({ initial_capital: parseInt(e.target.value) || 100000 })}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Starting capital for backtesting simulation
        </p>
      </div>

      {/* Trading Costs */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Trading Costs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Commission Rate */}
          <div>
            <label htmlFor="commission" className="block text-sm font-medium text-gray-700 mb-2">
              Commission Rate (%) *
            </label>
            <div className="space-y-2">
              <input
                id="commission"
                type="range"
                min="0"
                max="0.005"
                step="0.0001"
                value={config.commission_rate}
                onChange={(e) => updateConfig({ commission_rate: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">0%</span>
                <span className="font-medium text-gray-900">{(config.commission_rate * 100).toFixed(2)}%</span>
                <span className="text-gray-600">0.5%</span>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Per-trade commission (typical: 0.1%)
            </p>
          </div>

          {/* Slippage Rate */}
          <div>
            <label htmlFor="slippage" className="block text-sm font-medium text-gray-700 mb-2">
              Slippage Rate (%) *
            </label>
            <div className="space-y-2">
              <input
                id="slippage"
                type="range"
                min="0"
                max="0.005"
                step="0.0001"
                value={config.slippage_rate}
                onChange={(e) => updateConfig({ slippage_rate: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">0%</span>
                <span className="font-medium text-gray-900">{(config.slippage_rate * 100).toFixed(2)}%</span>
                <span className="text-gray-600">0.5%</span>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Price impact of market orders (typical: 0.1%)
            </p>
          </div>
        </div>
      </div>

      {/* Estimated Metrics */}
      <div className="card bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <LineChart className="h-5 w-5 text-blue-600" />
          Backtest Preview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Strategy Type:</span>
              <span className="font-medium capitalize">{config.strategy_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Risk Level:</span>
              <span className="font-medium capitalize">{config.risk_tolerance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Symbols:</span>
              <span className="font-medium">{config.symbols.length || 0} selected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Timeframe:</span>
              <span className="font-medium">{config.timeframe}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Max Positions:</span>
              <span className="font-medium">{config.max_positions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Stop Loss:</span>
              <span className="font-medium">{config.exit_rules.stop_loss}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Take Profit:</span>
              <span className="font-medium">{config.exit_rules.take_profit}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Est. Trades/Month:</span>
              <span className="font-medium">
                {config.timeframe === '1day' ? '5-10' : 
                 config.timeframe === '1hour' ? '20-50' : 
                 config.timeframe === '15min' ? '100-200' : '200+'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Estimated Backtest Duration</span>
            <Clock className="h-4 w-4 text-gray-500" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: config.backtest_period === '1month' ? '20%' : 
                         config.backtest_period === '3months' ? '40%' :
                         config.backtest_period === '6months' ? '60%' :
                         config.backtest_period === '1year' ? '80%' : '100%'
                }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {config.backtest_period === '1month' ? '~1 min' : 
               config.backtest_period === '3months' ? '~2 min' :
               config.backtest_period === '6months' ? '~3 min' :
               config.backtest_period === '1year' ? '~5 min' : '~10 min'}
            </span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Backtesting Tips</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Use at least 6 months of data for reliable results</li>
            <li>Include realistic commission and slippage costs</li>
            <li>Test across different market conditions</li>
            <li>Remember: Past performance doesn't guarantee future results</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
