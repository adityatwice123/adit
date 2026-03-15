'use client'

import { useState } from 'react'
import { ModelType, HorizonType } from '@/lib/types'
import { Calendar, Zap } from 'lucide-react'

interface ForecastControlsProps {
  onForecast: (date: string, horizon: HorizonType, models: ModelType) => Promise<void>
  isLoading: boolean
}

export function ForecastControls({ onForecast, isLoading }: ForecastControlsProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [horizon, setHorizon] = useState<HorizonType>('24h')
  const [models, setModels] = useState<ModelType>('Both')

  const handleForecast = async () => {
    await onForecast(date, horizon, models)
  }

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Forecast Controls</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Picker */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-neutral-700 mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Forecast Date
            </div>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isLoading}
            className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>

        {/* Horizon Selector */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-neutral-700 mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Horizon
            </div>
          </label>
          <select
            value={horizon}
            onChange={(e) => setHorizon(e.target.value as HorizonType)}
            disabled={isLoading}
            className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="1h">1 Hour</option>
            <option value="6h">6 Hours</option>
            <option value="12h">12 Hours</option>
            <option value="24h">24 Hours</option>
          </select>
        </div>

        {/* Model Selector */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-neutral-700 mb-2">
            <div className="flex items-center gap-2">
              Model Selection
            </div>
          </label>
          <select
            value={models}
            onChange={(e) => setModels(e.target.value as ModelType)}
            disabled={isLoading}
            className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="LSTM">LSTM</option>
            <option value="ARIMA">ARIMA</option>
            <option value="Both">Both Models</option>
          </select>
        </div>

        {/* Run Forecast Button */}
        <div className="flex flex-col justify-end">
          <button
            onClick={handleForecast}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Generating...' : 'Run Forecast'}
          </button>
        </div>
      </div>
    </div>
  )
}
