'use client'

import { useState, useCallback } from 'react'
import { ForecastControls } from '@/components/forecast-controls'
import { PredictionTable } from '@/components/prediction-table'
import { ForecastChart } from '@/components/forecast-chart'
import { ModelMetricsDisplay } from '@/components/model-metrics'
import { InsightsPanel } from '@/components/insights-panel'
import { HourlyPrediction, ModelType, HorizonType, ModelMetrics } from '@/lib/types'
import { AlertCircle, Zap } from 'lucide-react'

export default function Dashboard() {
  const [lstmPredictions, setLstmPredictions] = useState<HourlyPrediction[]>([])
  const [arimaPredictions, setArimaPredictions] = useState<HourlyPrediction[]>([])
  const [metrics, setMetrics] = useState<{
    lstm: ModelMetrics
    arima: ModelMetrics
  }>({
    lstm: {
      model_name: 'LSTM',
      mae: 34.05,
      rmse: 47.37,
      r_squared: 0.9352,
      updated_at: new Date().toISOString(),
    },
    arima: {
      model_name: 'ARIMA',
      mae: 43.01,
      rmse: 48.70,
      r_squared: 0.5683,
      updated_at: new Date().toISOString(),
    },
  })
  const [insights, setInsights] = useState({
    peak_demand: 1482,
    peak_hour: 18,
    load_hour_correlation: 0.453,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<ModelType>('Both')

  const handleForecast = useCallback(
    async (date: string, horizon: HorizonType, models: ModelType) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/forecast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date, models }),
        })

        if (!response.ok) {
          throw new Error('Failed to generate forecast')
        }

        const data = await response.json()

        if (data.forecasts.lstm) {
          setLstmPredictions(data.forecasts.lstm)
        }
        if (data.forecasts.arima) {
          setArimaPredictions(data.forecasts.arima)
        }

        setInsights(data.insights)
        setSelectedModel(models)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred'
        setError(message)
        console.error('[v0] Forecast error:', err)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const hasForecasts = lstmPredictions.length > 0 || arimaPredictions.length > 0

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  Electricity Demand Forecast
                </h1>
                <p className="text-sm text-neutral-600">
                  Advanced LSTM &amp; ARIMA forecasting dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Controls */}
          <ForecastControls onForecast={handleForecast} isLoading={isLoading} />

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!hasForecasts && !isLoading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Ready to Generate Forecast
              </h3>
              <p className="text-blue-700 max-w-md mx-auto">
                Select your forecast parameters above and click "Run Forecast" to generate
                hourly electricity demand predictions for the next 24 hours.
              </p>
            </div>
          )}

          {/* Results */}
          {hasForecasts && (
            <>
              {/* Chart */}
              <ForecastChart
                lstmPredictions={lstmPredictions}
                arimaPredictions={arimaPredictions}
                selectedModel={selectedModel}
              />

              {/* Table */}
              <PredictionTable
                lstmPredictions={lstmPredictions}
                arimaPredictions={arimaPredictions}
                selectedModel={selectedModel}
              />

              {/* Metrics and Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ModelMetricsDisplay metrics={metrics} />
                </div>
                <div>
                  <InsightsPanel insights={insights} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
