export type ModelType = 'LSTM' | 'ARIMA' | 'Both'
export type HorizonType = '1h' | '6h' | '12h' | '24h'

export interface HourlyPrediction {
  hour: number
  timestamp: string
  demand_mw: number
  model: ModelType
  confidence: number
  demand_category: 'normal' | 'high' | 'peak'
}

export interface ForecastResult {
  forecast_date: string
  model_type: ModelType
  predictions: HourlyPrediction[]
  generated_at: string
}

export interface ModelMetrics {
  model_name: string
  mae: number
  rmse: number
  r_squared: number
  updated_at: string
}

export interface HistoricalData {
  timestamp: string
  demand_mw: number
  hour: number
}

export interface DashboardData {
  forecasts: {
    lstm: HourlyPrediction[]
    arima: HourlyPrediction[]
  }
  metrics: {
    lstm: ModelMetrics
    arima: ModelMetrics
  }
  insights: {
    peak_demand: number
    peak_hour: number
    load_hour_correlation: number
  }
}
