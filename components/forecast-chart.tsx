'use client'

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { HourlyPrediction, ModelType } from '@/lib/types'
import { BarChart3 } from 'lucide-react'

interface ForecastChartProps {
  lstmPredictions: HourlyPrediction[]
  arimaPredictions: HourlyPrediction[]
  selectedModel: ModelType
}

interface ChartData {
  hour: string
  lstm: number
  arima: number
  average: number
  category: 'normal' | 'high' | 'peak'
}

export function ForecastChart({
  lstmPredictions,
  arimaPredictions,
  selectedModel,
}: ForecastChartProps) {
  const showLSTM = selectedModel === 'LSTM' || selectedModel === 'Both'
  const showARIMA = selectedModel === 'ARIMA' || selectedModel === 'Both'

  // Prepare data for chart
  const chartData: ChartData[] = lstmPredictions.map((lstm, idx) => {
    const arima = arimaPredictions[idx]
    const average = (lstm.demand_mw + arima.demand_mw) / 2

    return {
      hour: `${String(lstm.hour).padStart(2, '0')}:00`,
      lstm: Math.round(lstm.demand_mw * 100) / 100,
      arima: Math.round(arima.demand_mw * 100) / 100,
      average: Math.round(average * 100) / 100,
      category: lstm.demand_category,
    }
  })

  // Calculate peak demand for reference line
  const peakDemand = Math.max(...lstmPredictions.map(p => p.demand_mw))
  const avgDemand =
    lstmPredictions.reduce((sum, p) => sum + p.demand_mw, 0) / lstmPredictions.length

  const getBarColor = (category: string) => {
    switch (category) {
      case 'peak':
        return '#dc2626'
      case 'high':
        return '#ea580c'
      default:
        return '#16a34a'
    }
  }

  const CustomTooltip = (props: any) => {
    const { active, payload } = props

    if (active && payload && payload.length) {
      const data = payload[0]?.payload

      return (
        <div className="bg-white p-3 rounded-lg border border-neutral-200 shadow-lg">
          <p className="font-semibold text-neutral-900">{data.hour}</p>
          {showLSTM && (
            <p className="text-sm text-blue-600">LSTM: {data.lstm.toFixed(2)} MW</p>
          )}
          {showARIMA && (
            <p className="text-sm text-purple-600">ARIMA: {data.arima.toFixed(2)} MW</p>
          )}
          {showLSTM && showARIMA && (
            <p className="text-sm text-neutral-600">Avg: {data.average.toFixed(2)} MW</p>
          )}
          <p className="text-xs text-neutral-500 mt-1 capitalize">{data.category} Demand</p>
        </div>
      )
    }

    return null
  }

  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Hourly Forecast Chart
      </h2>

      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="hour"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{ value: 'Predicted Electricity Demand (MW)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />

            {/* Reference lines */}
            <ReferenceLine
              y={avgDemand}
              stroke="#9ca3af"
              strokeDasharray="5 5"
              label={{ value: `Average: ${avgDemand.toFixed(0)} MW`, position: 'right' }}
            />
            <ReferenceLine
              y={1400}
              stroke="#dc2626"
              strokeDasharray="5 5"
              label={{ value: 'Peak Threshold', position: 'right' }}
            />

            {/* LSTM Bar Chart */}
            {showLSTM && (
              <Bar dataKey="lstm" fill="#3b82f6" name="LSTM Forecast" radius={[4, 4, 0, 0]} />
            )}

            {/* ARIMA Line Chart */}
            {showARIMA && (
              <Line
                type="monotone"
                dataKey="arima"
                stroke="#a855f7"
                name="ARIMA Forecast"
                strokeWidth={2}
                dot={false}
              />
            )}

            {/* Average line when both models shown */}
            {showLSTM && showARIMA && (
              <Line
                type="monotone"
                dataKey="average"
                stroke="#6b7280"
                name="Average Forecast"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-blue-700 font-medium">Peak Demand</p>
          <p className="text-2xl font-bold text-blue-900">{peakDemand.toFixed(0)} MW</p>
        </div>
        <div className="p-3 bg-neutral-50 rounded-lg">
          <p className="text-neutral-700 font-medium">Average Demand</p>
          <p className="text-2xl font-bold text-neutral-900">{avgDemand.toFixed(0)} MW</p>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg">
          <p className="text-orange-700 font-medium">Demand Range</p>
          <p className="text-2xl font-bold text-orange-900">
            {(peakDemand - Math.min(...lstmPredictions.map(p => p.demand_mw))).toFixed(0)} MW
          </p>
        </div>
      </div>
    </div>
  )
}
