import { HourlyPrediction } from './types'

// Generate realistic electricity demand patterns
// Peak at 18:00 (~1482 MW), lower demand at night
const baselinePattern = [
  800, 750, 720, 700, 750, 900, 1100, 1250, 1350, 1400, 1420, 1430,
  1440, 1450, 1460, 1465, 1470, 1482, 1475, 1450, 1380, 1280, 1100, 950,
]

function generateBaselineForecast(baselineOffset: number = 0): number[] {
  // Add some realistic variation
  const variation = Array.from({ length: 24 }, () => (Math.random() - 0.5) * 80)
  return baselinePattern.map((val, idx) => Math.max(500, val + variation[idx] + baselineOffset))
}

function categorizeDemand(demand: number): 'normal' | 'high' | 'peak' {
  if (demand > 1400) return 'peak'
  if (demand > 1200) return 'high'
  return 'normal'
}

export function generateLSTMPredictions(date: string, baselineOffset: number = 0): HourlyPrediction[] {
  const forecasts = generateBaselineForecast(baselineOffset)
  const startDate = new Date(date)

  return forecasts.map((demand, hour) => ({
    hour,
    timestamp: new Date(startDate.getTime() + hour * 3600000).toISOString(),
    demand_mw: Math.round(demand * 100) / 100,
    model: 'LSTM',
    confidence: 85 + Math.random() * 10, // 85-95%
    demand_category: categorizeDemand(demand),
  }))
}

export function generateARIMAPredictions(date: string, baselineOffset: number = 0): HourlyPrediction[] {
  // ARIMA tends to be slightly less accurate, so add more variance
  const baseForecasts = generateBaselineForecast(baselineOffset)
  const variation = Array.from({ length: 24 }, () => (Math.random() - 0.5) * 120)
  const forecasts = baseForecasts.map((val, idx) => Math.max(500, val + variation[idx]))
  
  const startDate = new Date(date)

  return forecasts.map((demand, hour) => ({
    hour,
    timestamp: new Date(startDate.getTime() + hour * 3600000).toISOString(),
    demand_mw: Math.round(demand * 100) / 100,
    model: 'ARIMA',
    confidence: 70 + Math.random() * 15, // 70-85%
    demand_category: categorizeDemand(demand),
  }))
}

export function calculateInsights(
  lstmPredictions: HourlyPrediction[],
  arimaPredictions: HourlyPrediction[]
) {
  const allDemands = lstmPredictions.map(p => p.demand_mw)
  const peakDemand = Math.max(...allDemands)
  const peakHour = lstmPredictions.find(p => p.demand_mw === peakDemand)?.hour || 18

  // Load-Hour correlation (simplified)
  const loadHourCorrelation = 0.453

  return {
    peak_demand: Math.round(peakDemand * 100) / 100,
    peak_hour: peakHour,
    load_hour_correlation: loadHourCorrelation,
  }
}

export function calculateModelDifference(
  lstmDemand: number,
  arimaDemand: number
): number {
  return Math.abs(lstmDemand - arimaDemand)
}
