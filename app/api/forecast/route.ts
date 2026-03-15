import { NextRequest, NextResponse } from 'next/server'
import { generateLSTMPredictions, generateARIMAPredictions, calculateInsights } from '@/lib/forecast-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, models } = body

    if (!date || !models) {
      return NextResponse.json(
        { error: 'Missing date or models parameter' },
        { status: 400 }
      )
    }

    const forecasts: any = {}
    const modelsArray = Array.isArray(models) ? models : [models]

    // Generate LSTM predictions if requested
    if (modelsArray.includes('LSTM') || modelsArray.includes('Both')) {
      forecasts.lstm = generateLSTMPredictions(date)
    }

    // Generate ARIMA predictions if requested
    if (modelsArray.includes('ARIMA') || modelsArray.includes('Both')) {
      forecasts.arima = generateARIMAPredictions(date)
    }

    // Calculate insights
    const insights = calculateInsights(
      forecasts.lstm || [],
      forecasts.arima || []
    )

    return NextResponse.json({
      success: true,
      forecast_date: date,
      models: modelsArray,
      forecasts,
      insights,
      generated_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Forecast API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate forecast' },
      { status: 500 }
    )
  }
}
