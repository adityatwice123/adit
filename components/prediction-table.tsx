'use client'

import { HourlyPrediction, ModelType } from '@/lib/types'
import { calculateModelDifference } from '@/lib/forecast-utils'
import { TrendingUp } from 'lucide-react'

interface PredictionTableProps {
  lstmPredictions: HourlyPrediction[]
  arimaPredictions: HourlyPrediction[]
  selectedModel: ModelType
}

export function PredictionTable({
  lstmPredictions,
  arimaPredictions,
  selectedModel,
}: PredictionTableProps) {
  const showLSTM = selectedModel === 'LSTM' || selectedModel === 'Both'
  const showARIMA = selectedModel === 'ARIMA' || selectedModel === 'Both'

  const getDemandColor = (category: string) => {
    switch (category) {
      case 'peak':
        return 'bg-red-50 text-red-900'
      case 'high':
        return 'bg-orange-50 text-orange-900'
      default:
        return 'bg-green-50 text-green-900'
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'peak':
        return 'bg-red-200 text-red-800'
      case 'high':
        return 'bg-orange-200 text-orange-800'
      default:
        return 'bg-green-200 text-green-800'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Hourly Prediction Table
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-neutral-700">Hour</th>
              <th className="px-6 py-3 text-left font-semibold text-neutral-700">Time</th>
              <th className="px-6 py-3 text-left font-semibold text-neutral-700">Category</th>
              {showLSTM && (
                <>
                  <th className="px-6 py-3 text-right font-semibold text-neutral-700">LSTM (MW)</th>
                  <th className="px-6 py-3 text-right font-semibold text-neutral-700">LSTM Conf.</th>
                </>
              )}
              {showARIMA && (
                <>
                  <th className="px-6 py-3 text-right font-semibold text-neutral-700">ARIMA (MW)</th>
                  <th className="px-6 py-3 text-right font-semibold text-neutral-700">ARIMA Conf.</th>
                </>
              )}
              {showLSTM && showARIMA && (
                <th className="px-6 py-3 text-right font-semibold text-neutral-700">Model Diff</th>
              )}
            </tr>
          </thead>
          <tbody>
            {lstmPredictions.map((lstm, idx) => {
              const arima = arimaPredictions[idx]
              const hour = String(lstm.hour).padStart(2, '0')
              const modelDiff = showLSTM && showARIMA ? calculateModelDifference(lstm.demand_mw, arima.demand_mw) : 0

              return (
                <tr
                  key={lstm.hour}
                  className={`border-b border-neutral-100 hover:bg-neutral-50 transition-colors ${
                    getDemandColor(lstm.demand_category)
                  }`}
                >
                  <td className="px-6 py-3 font-medium text-neutral-900">{hour}:00</td>
                  <td className="px-6 py-3 text-neutral-600">
                    {new Date(lstm.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadge(lstm.demand_category)}`}>
                      {lstm.demand_category.charAt(0).toUpperCase() + lstm.demand_category.slice(1)}
                    </span>
                  </td>
                  {showLSTM && (
                    <>
                      <td className="px-6 py-3 text-right font-semibold text-neutral-900">
                        {lstm.demand_mw.toFixed(2)}
                      </td>
                      <td className="px-6 py-3 text-right text-neutral-600">
                        {lstm.confidence.toFixed(1)}%
                      </td>
                    </>
                  )}
                  {showARIMA && (
                    <>
                      <td className="px-6 py-3 text-right font-semibold text-neutral-900">
                        {arima.demand_mw.toFixed(2)}
                      </td>
                      <td className="px-6 py-3 text-right text-neutral-600">
                        {arima.confidence.toFixed(1)}%
                      </td>
                    </>
                  )}
                  {showLSTM && showARIMA && (
                    <td className="px-6 py-3 text-right text-neutral-600 font-medium">
                      {modelDiff.toFixed(2)} MW
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
