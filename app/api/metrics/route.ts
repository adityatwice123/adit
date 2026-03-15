import { NextResponse } from 'next/server'
import { ModelMetrics } from '@/lib/types'

export async function GET() {
  try {
    const metrics: Record<string, ModelMetrics> = {
      LSTM: {
        model_name: 'LSTM',
        mae: 34.05,
        rmse: 47.37,
        r_squared: 0.9352,
        updated_at: new Date().toISOString(),
      },
      ARIMA: {
        model_name: 'ARIMA',
        mae: 43.01,
        rmse: 48.70,
        r_squared: 0.5683,
        updated_at: new Date().toISOString(),
      },
    }

    return NextResponse.json({
      success: true,
      metrics,
    })
  } catch (error) {
    console.error('Metrics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}
