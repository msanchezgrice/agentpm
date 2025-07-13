'use client'

import React, { useState } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine
} from 'recharts'
import { format } from 'date-fns'

interface PerformanceData {
  date: string
  portfolioValue: number
  sp500Value: number
  nasdaqValue: number
  dailyReturn: number
}

interface PerformanceChartProps {
  data: PerformanceData[]
  title?: string
  showIndices?: boolean
  height?: number
}

export function PerformanceChart({ 
  data, 
  title = "Portfolio Performance", 
  showIndices = true,
  height = 400 
}: PerformanceChartProps) {
  const [selectedLines, setSelectedLines] = useState({
    portfolio: true,
    sp500: showIndices,
    nasdaq: showIndices
  })

  // Calculate percentage changes from start
  const startPortfolioValue = data[0]?.portfolioValue || 100000
  const startSp500Value = data[0]?.sp500Value || 4200
  const startNasdaqValue = data[0]?.nasdaqValue || 13500

  const normalizedData = data.map(item => ({
    date: item.date,
    portfolio: ((item.portfolioValue - startPortfolioValue) / startPortfolioValue) * 100,
    sp500: ((item.sp500Value - startSp500Value) / startSp500Value) * 100,
    nasdaq: ((item.nasdaqValue - startNasdaqValue) / startNasdaqValue) * 100,
    portfolioValue: item.portfolioValue,
    dailyReturn: item.dailyReturn
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-medium text-gray-900">{format(new Date(label), 'MMM d, yyyy')}</p>
          <div className="mt-2 space-y-1">
            {selectedLines.portfolio && (
              <p className="text-sm">
                <span className="font-medium text-blue-600">Portfolio:</span>{' '}
                <span className={data.portfolio >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                  {data.portfolio >= 0 ? '+' : ''}{data.portfolio.toFixed(2)}%
                </span>
                <span className="text-gray-500 ml-2">(${data.portfolioValue.toLocaleString()})</span>
              </p>
            )}
            {selectedLines.sp500 && (
              <p className="text-sm">
                <span className="font-medium text-orange-600">S&P 500:</span>{' '}
                <span className={data.sp500 >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                  {data.sp500 >= 0 ? '+' : ''}{data.sp500.toFixed(2)}%
                </span>
              </p>
            )}
            {selectedLines.nasdaq && (
              <p className="text-sm">
                <span className="font-medium text-purple-600">NASDAQ:</span>{' '}
                <span className={data.nasdaq >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                  {data.nasdaq >= 0 ? '+' : ''}{data.nasdaq.toFixed(2)}%
                </span>
              </p>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  const formatXAxis = (tickItem: string) => {
    return format(new Date(tickItem), 'MMM')
  }

  const formatYAxis = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value}%`
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {showIndices && (
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLines.portfolio}
                onChange={(e) => setSelectedLines({ ...selectedLines, portfolio: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">Portfolio</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLines.sp500}
                onChange={(e) => setSelectedLines({ ...selectedLines, sp500: e.target.checked })}
                className="rounded text-orange-600"
              />
              <span className="text-sm font-medium text-gray-700">S&P 500</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLines.nasdaq}
                onChange={(e) => setSelectedLines({ ...selectedLines, nasdaq: e.target.checked })}
                className="rounded text-purple-600"
              />
              <span className="text-sm font-medium text-gray-700">NASDAQ</span>
            </label>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={normalizedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxis}
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            tickFormatter={formatYAxis}
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="3 3" />
          
          {selectedLines.portfolio && (
            <Line 
              type="monotone" 
              dataKey="portfolio" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
              name="Portfolio"
            />
          )}
          {selectedLines.sp500 && showIndices && (
            <Line 
              type="monotone" 
              dataKey="sp500" 
              stroke="#f97316" 
              strokeWidth={2}
              dot={false}
              name="S&P 500"
              strokeDasharray="5 5"
            />
          )}
          {selectedLines.nasdaq && showIndices && (
            <Line 
              type="monotone" 
              dataKey="nasdaq" 
              stroke="#a855f7" 
              strokeWidth={2}
              dot={false}
              name="NASDAQ"
              strokeDasharray="5 5"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// Drawdown Chart Component
export function DrawdownChart({ data }: { data: any[] }) {
  const drawdownData = data.map(item => ({
    date: item.date,
    drawdown: item.maxDrawdown || 0
  }))

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Maximum Drawdown</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={drawdownData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => format(new Date(value), 'MMM')}
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            tickFormatter={(value) => `${value}%`}
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={['dataMin', 0]}
          />
          <Tooltip 
            formatter={(value: any) => `${value.toFixed(2)}%`}
            labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
          />
          <Area 
            type="monotone" 
            dataKey="drawdown" 
            stroke="#ef4444" 
            fill="#fee2e2"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
