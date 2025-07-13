'use client'

import { Shield, AlertTriangle, Info, DollarSign, Percent, Calendar, Clock } from 'lucide-react'
import { AgentConfig } from '@/app/dashboard/agents/create/page'

interface TradingRulesStepProps {
  config: AgentConfig
  updateConfig: (updates: Partial<AgentConfig>) => void
}

export default function TradingRulesStep({ config, updateConfig }: TradingRulesStepProps) {
  const forbiddenHours = [
    { id: '0-6', label: '12 AM - 6 AM', description: 'Overnight/Pre-market' },
    { id: '6-9:30', label: '6 AM - 9:30 AM', description: 'Pre-market' },
    { id: '16-24', label: '4 PM - 12 AM', description: 'After-hours' }
  ]

  const toggleForbiddenHour = (hourId: string) => {
    const currentHours = config.entry_rules.forbidden_hours
    if (currentHours.includes(hourId)) {
      updateConfig({
        entry_rules: {
          ...config.entry_rules,
          forbidden_hours: currentHours.filter(h => h !== hourId)
        }
      })
    } else {
      updateConfig({
        entry_rules: {
          ...config.entry_rules,
          forbidden_hours: [...currentHours, hourId]
        }
      })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Trading Rules</h2>
        <p className="text-gray-600">
          Define strict rules to manage risk and optimize your agent's trading behavior.
        </p>
      </div>

      {/* Entry Rules */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Entry Rules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Minimum Confidence */}
          <div>
            <label htmlFor="min-confidence" className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Confidence Score *
            </label>
            <div className="space-y-2">
              <input
                id="min-confidence"
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={config.entry_rules.min_confidence}
                onChange={(e) => updateConfig({
                  entry_rules: {
                    ...config.entry_rules,
                    min_confidence: parseFloat(e.target.value)
                  }
                })}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">50%</span>
                <span className="font-medium text-gray-900">{(config.entry_rules.min_confidence * 100).toFixed(0)}%</span>
                <span className="text-gray-600">95%</span>
              </div>
            </div>
          </div>

          {/* Max Position Size */}
          <div>
            <label htmlFor="max-position" className="block text-sm font-medium text-gray-700 mb-2">
              Max Position Size (% of Capital) *
            </label>
            <div className="space-y-2">
              <input
                id="max-position"
                type="range"
                min="0.01"
                max="0.25"
                step="0.01"
                value={config.entry_rules.max_position_size}
                onChange={(e) => updateConfig({
                  entry_rules: {
                    ...config.entry_rules,
                    max_position_size: parseFloat(e.target.value)
                  }
                })}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">1%</span>
                <span className="font-medium text-gray-900">{(config.entry_rules.max_position_size * 100).toFixed(0)}%</span>
                <span className="text-gray-600">25%</span>
              </div>
            </div>
          </div>

          {/* Required Confirmations */}
          <div>
            <label htmlFor="confirmations" className="block text-sm font-medium text-gray-700 mb-2">
              Required Confirmations *
            </label>
            <input
              id="confirmations"
              type="number"
              min="1"
              max="5"
              value={config.entry_rules.require_confirmations}
              onChange={(e) => updateConfig({
                entry_rules: {
                  ...config.entry_rules,
                  require_confirmations: parseInt(e.target.value) || 1
                }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Number of indicators that must align
            </p>
          </div>

          {/* Trading Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forbidden Trading Hours
            </label>
            <div className="space-y-2">
              {forbiddenHours.map(hour => (
                <label key={hour.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.entry_rules.forbidden_hours.includes(hour.id)}
                    onChange={() => toggleForbiddenHour(hour.id)}
                    className="rounded text-blue-600"
                  />
                  <div>
                    <span className="font-medium text-gray-900">{hour.label}</span>
                    <span className="text-sm text-gray-500 ml-2">{hour.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Exit Rules */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          Exit Rules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stop Loss */}
          <div>
            <label htmlFor="stop-loss" className="block text-sm font-medium text-gray-700 mb-2">
              Stop Loss (%) *
            </label>
            <input
              id="stop-loss"
              type="number"
              min="1"
              max="20"
              step="0.5"
              value={config.exit_rules.stop_loss}
              onChange={(e) => updateConfig({
                exit_rules: {
                  ...config.exit_rules,
                  stop_loss: parseFloat(e.target.value) || 5
                }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Take Profit */}
          <div>
            <label htmlFor="take-profit" className="block text-sm font-medium text-gray-700 mb-2">
              Take Profit (%) *
            </label>
            <input
              id="take-profit"
              type="number"
              min="1"
              max="50"
              step="0.5"
              value={config.exit_rules.take_profit}
              onChange={(e) => updateConfig({
                exit_rules: {
                  ...config.exit_rules,
                  take_profit: parseFloat(e.target.value) || 10
                }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Trailing Stop */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Trailing Stop</h4>
              <p className="text-sm text-gray-500">Lock in profits as price moves up</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.exit_rules.trailing_stop}
                onChange={(e) => updateConfig({
                  exit_rules: {
                    ...config.exit_rules,
                    trailing_stop: e.target.checked
                  }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Time-Based Exit */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Time-Based Exit</h4>
              <p className="text-sm text-gray-500">Exit after max hold period</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.exit_rules.time_based_exit}
                onChange={(e) => updateConfig({
                  exit_rules: {
                    ...config.exit_rules,
                    time_based_exit: e.target.checked
                  }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Max Hold Days */}
          {config.exit_rules.time_based_exit && (
            <div className="md:col-span-2">
              <label htmlFor="max-hold" className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Hold Period (Days) *
              </label>
              <input
                id="max-hold"
                type="number"
                min="1"
                max="365"
                value={config.exit_rules.max_hold_days}
                onChange={(e) => updateConfig({
                  exit_rules: {
                    ...config.exit_rules,
                    max_hold_days: parseInt(e.target.value) || 30
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Risk Management */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Risk Management
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Max Daily Loss */}
          <div>
            <label htmlFor="daily-loss" className="block text-sm font-medium text-gray-700 mb-2">
              Max Daily Loss (%) *
            </label>
            <input
              id="daily-loss"
              type="number"
              min="0.5"
              max="10"
              step="0.5"
              value={config.risk_management.max_daily_loss}
              onChange={(e) => updateConfig({
                risk_management: {
                  ...config.risk_management,
                  max_daily_loss: parseFloat(e.target.value) || 2
                }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Max Drawdown */}
          <div>
            <label htmlFor="max-drawdown" className="block text-sm font-medium text-gray-700 mb-2">
              Max Drawdown (%) *
            </label>
            <input
              id="max-drawdown"
              type="number"
              min="5"
              max="30"
              step="1"
              value={config.risk_management.max_drawdown}
              onChange={(e) => updateConfig({
                risk_management: {
                  ...config.risk_management,
                  max_drawdown: parseFloat(e.target.value) || 10
                }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Position Correlation */}
          <div>
            <label htmlFor="correlation" className="block text-sm font-medium text-gray-700 mb-2">
              Position Correlation Limit *
            </label>
            <div className="space-y-2">
              <input
                id="correlation"
                type="range"
                min="0.3"
                max="1"
                step="0.1"
                value={config.risk_management.position_correlation_limit}
                onChange={(e) => updateConfig({
                  risk_management: {
                    ...config.risk_management,
                    position_correlation_limit: parseFloat(e.target.value)
                  }
                })}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">0.3</span>
                <span className="font-medium text-gray-900">{config.risk_management.position_correlation_limit.toFixed(1)}</span>
                <span className="text-gray-600">1.0</span>
              </div>
            </div>
          </div>

          {/* Sector Concentration */}
          <div>
            <label htmlFor="sector-limit" className="block text-sm font-medium text-gray-700 mb-2">
              Sector Concentration Limit *
            </label>
            <div className="space-y-2">
              <input
                id="sector-limit"
                type="range"
                min="0.1"
                max="0.5"
                step="0.05"
                value={config.risk_management.sector_concentration_limit}
                onChange={(e) => updateConfig({
                  risk_management: {
                    ...config.risk_management,
                    sector_concentration_limit: parseFloat(e.target.value)
                  }
                })}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">10%</span>
                <span className="font-medium text-gray-900">{(config.risk_management.sector_concentration_limit * 100).toFixed(0)}%</span>
                <span className="text-gray-600">50%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Risk Management Best Practices</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Never risk more than 2% of capital on a single trade</li>
            <li>Use stop losses on every position</li>
            <li>Diversify across uncorrelated assets</li>
            <li>Monitor drawdown limits strictly</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
