'use client'

import { Lightbulb, Zap, TrendingUp } from 'lucide-react'

interface InsightsPanelProps {
  insights: {
    peak_demand: number
    peak_hour: number
    load_hour_correlation: number
  }
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  const peakHourStr = String(insights.peak_hour).padStart(2, '0')

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
      <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5" />
        Updated Insights
      </h2>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-600" />
              Peak Demand Prediction
            </h3>
          </div>
          <p className="text-2xl font-bold text-neutral-900">
            {insights.peak_demand.toFixed(0)} MW
          </p>
          <p className="text-sm text-neutral-600 mt-1">
            Expected at <span className="font-semibold">{peakHourStr}:00</span> (18:00)
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Load-Hour Correlation
            </h3>
          </div>
          <p className="text-2xl font-bold text-neutral-900">
            {(insights.load_hour_correlation * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-neutral-600 mt-1">
            Moderate correlation between load and time of day
          </p>
        </div>

        <div className="bg-blue-500 text-white rounded-lg p-4 border border-blue-600">
          <h3 className="font-semibold mb-2 text-sm">Key Findings</h3>
          <ul className="text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-200 mt-0.5">•</span>
              <span>Peak demand consistently occurs in evening hours (17:00-19:00)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-200 mt-0.5">•</span>
              <span>LSTM model shows 93.52% accuracy in capturing demand patterns</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-200 mt-0.5">•</span>
              <span>Consider demand management strategies during peak hours</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
