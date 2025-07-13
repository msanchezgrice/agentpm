'use client'

import { useState } from 'react'
import { Brain, Search, Plus, X, Info, Check } from 'lucide-react'
import { AgentConfig } from '@/app/dashboard/agents/create/page'

interface StrategyConfigStepProps {
  config: AgentConfig
  updateConfig: (updates: Partial<AgentConfig>) => void
}

export default function StrategyConfigStep({ config, updateConfig }: StrategyConfigStepProps) {
  const [symbolSearch, setSymbolSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])

  const availableIndicators = [
    { id: 'RSI', name: 'RSI', description: 'Relative Strength Index' },
    { id: 'MACD', name: 'MACD', description: 'Moving Average Convergence Divergence' },
    { id: 'MA_20', name: '20-Day MA', description: '20-day Moving Average' },
    { id: 'MA_50', name: '50-Day MA', description: '50-day Moving Average' },
    { id: 'MA_200', name: '200-Day MA', description: '200-day Moving Average' },
    { id: 'BB', name: 'Bollinger Bands', description: 'Volatility indicator' },
    { id: 'STOCH', name: 'Stochastic', description: 'Momentum indicator' },
    { id: 'ATR', name: 'ATR', description: 'Average True Range' },
    { id: 'OBV', name: 'OBV', description: 'On-Balance Volume' },
    { id: 'VWAP', name: 'VWAP', description: 'Volume Weighted Average Price' }
  ]

  const timeframes = [
    { id: '1min', name: '1 Minute', description: 'High-frequency trading' },
    { id: '5min', name: '5 Minutes', description: 'Scalping' },
    { id: '15min', name: '15 Minutes', description: 'Day trading' },
    { id: '1hour', name: '1 Hour', description: 'Intraday trading' },
    { id: '1day', name: '1 Day', description: 'Swing trading' }
  ]

  const positionSizingMethods = [
    { id: 'fixed', name: 'Fixed Size', description: 'Same dollar amount per trade' },
    { id: 'kelly', name: 'Kelly Criterion', description: 'Optimal sizing based on edge' },
    { id: 'risk_parity', name: 'Risk Parity', description: 'Equal risk allocation' },
    { id: 'volatility_adjusted', name: 'Volatility Adjusted', description: 'Size based on volatility' }
  ]

  const searchSymbols = async () => {
    if (!symbolSearch.trim()) return
    
    setSearching(true)
    try {
      const response = await fetch(`/api/market/search?q=${encodeURIComponent(symbolSearch)}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.results || [])
      }
    } catch (error) {
      console.error('Error searching symbols:', error)
    } finally {
      setSearching(false)
    }
  }

  const addSymbol = (symbol: string) => {
    if (!config.symbols.includes(symbol)) {
      updateConfig({ symbols: [...config.symbols, symbol] })
    }
    setSymbolSearch('')
    setSearchResults([])
  }

  const removeSymbol = (symbol: string) => {
    updateConfig({ symbols: config.symbols.filter(s => s !== symbol) })
  }

  const toggleIndicator = (indicatorId: string) => {
    if (config.indicators.includes(indicatorId)) {
      updateConfig({ indicators: config.indicators.filter(i => i !== indicatorId) })
    } else {
      updateConfig({ indicators: [...config.indicators, indicatorId] })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Strategy Configuration</h2>
        <p className="text-gray-600">
          Configure the technical aspects of your trading strategy.
        </p>
      </div>

      {/* Symbols */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Trading Symbols *
        </label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={symbolSearch}
                onChange={(e) => setSymbolSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchSymbols()}
                placeholder="Search for stocks (e.g., AAPL, GOOGL)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {searchResults.map((result) => (
                    <button
                      key={result.symbol}
                      onClick={() => addSymbol(result.symbol)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex justify-between items-center"
                    >
                      <div>
                        <span className="font-medium">{result.symbol}</span>
                        <span className="text-gray-500 text-sm ml-2">{result.name}</span>
                      </div>
                      <Plus className="h-4 w-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={searchSymbols}
              disabled={searching}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {searching ? <Search className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
            </button>
          </div>
          
          {/* Selected Symbols */}
          {config.symbols.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {config.symbols.map(symbol => (
                <div
                  key={symbol}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                >
                  <span className="font-medium">{symbol}</span>
                  <button
                    onClick={() => removeSymbol(symbol)}
                    className="hover:text-blue-900"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Add stocks your agent will monitor and trade
        </p>
      </div>

      {/* Technical Indicators */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Technical Indicators *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableIndicators.map(indicator => (
            <div
              key={indicator.id}
              onClick={() => toggleIndicator(indicator.id)}
              className={`
                p-3 border-2 rounded-lg cursor-pointer transition-all
                ${config.indicators.includes(indicator.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{indicator.name}</h4>
                  <p className="text-xs text-gray-600">{indicator.description}</p>
                </div>
                {config.indicators.includes(indicator.id) && (
                  <Check className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeframe */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Trading Timeframe *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {timeframes.map(timeframe => (
            <div
              key={timeframe.id}
              onClick={() => updateConfig({ timeframe: timeframe.id as any })}
              className={`
                p-3 border-2 rounded-lg cursor-pointer transition-all
                ${config.timeframe === timeframe.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <h4 className="font-medium text-gray-900">{timeframe.name}</h4>
              <p className="text-xs text-gray-600">{timeframe.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Max Positions */}
      <div>
        <label htmlFor="max-positions" className="block text-sm font-medium text-gray-700 mb-2">
          Maximum Positions *
        </label>
        <input
          id="max-positions"
          type="number"
          min="1"
          max="50"
          value={config.max_positions}
          onChange={(e) => updateConfig({ max_positions: parseInt(e.target.value) || 1 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Maximum number of positions the agent can hold simultaneously (1-50)
        </p>
      </div>

      {/* Position Sizing */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Position Sizing Method *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {positionSizingMethods.map(method => (
            <div
              key={method.id}
              onClick={() => updateConfig({ position_sizing: method.id as any })}
              className={`
                p-4 border-2 rounded-lg cursor-pointer transition-all
                ${config.position_sizing === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <h4 className="font-medium text-gray-900">{method.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{method.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Strategy Best Practices</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Start with 3-5 symbols to maintain focus</li>
            <li>Combine trend and momentum indicators for confirmation</li>
            <li>Match timeframe to your risk tolerance</li>
            <li>Use position sizing to manage risk effectively</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
