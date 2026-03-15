'use client'

import { ModelMetrics } from '@/lib/types'
import { CheckCircle, AlertCircle, Activity } from 'lucide-react'

interface ModelMetricsProps {
  metrics: {
    lstm: ModelMetrics
    arima: ModelMetrics
  }
}

export function ModelMetricsDisplay({ metrics }: ModelMetricsProps) {
  const getPerformanceColor = (r2: number) => {
    if (r2 > 0.9) return 'text-green-700 bg-green-50'
    if (r2 > 0.7) return 'text-orange-700 bg-orange-50'
    return 'text-red-700 bg-red-50'
  }

  const MetricCard = ({
    model,
    data,
  }: {
    model: 'LSTM' | 'ARIMA'
    data: ModelMetrics
  }) => (
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">{model} Model</h3>
        <Activity className="w-5 h-5 text-blue-600" />
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-neutral-700 mb-1">Mean Absolute Error (MAE)</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-neutral-900">{data.mae.toFixed(2)}</p>
            <p className="text-xs text-neutral-500">Lower is better</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-neutral-700 mb-1">Root Mean Squared Error (RMSE)</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-neutral-900">{data.rmse.toFixed(2)}</p>
            <p className="text-xs text-neutral-500">Lower is better</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-neutral-700 mb-1">R² Score</p>
          <div className={`p-3 rounded-lg ${getPerformanceColor(data.r_squared)}`}>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{(data.r_squared * 100).toFixed(2)}%</p>
              {data.r_squared > 0.9 ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
            </div>
            <p className="text-xs mt-1">Model explains {(data.r_squared * 100).toFixed(1)}% of variance</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-200">
        <p className="text-xs text-neutral-500">
          Last updated: {new Date(data.updated_at).toLocaleString()}
        </p>
      </div>
    </div>
  )

  return (
    <div>
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Real Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard model="LSTM" data={metrics.lstm} />
        <MetricCard model="ARIMA" data={metrics.arima} />
      </div>
    </div>
  )
}
