-- Create forecasts table
CREATE TABLE IF NOT EXISTS forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forecast_date DATE NOT NULL,
  model_type TEXT NOT NULL,
  predictions JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(forecast_date, model_type)
);

-- Create historical_data table
CREATE TABLE IF NOT EXISTS historical_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP NOT NULL,
  demand_mw FLOAT NOT NULL,
  hour INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(timestamp)
);

-- Create model_metrics table
CREATE TABLE IF NOT EXISTS model_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name TEXT NOT NULL,
  mae FLOAT NOT NULL,
  rmse FLOAT NOT NULL,
  r_squared FLOAT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (model_name)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_forecasts_date ON forecasts(forecast_date);
CREATE INDEX IF NOT EXISTS idx_historical_timestamp ON historical_data(timestamp);

-- Insert initial model metrics
INSERT INTO model_metrics (model_name, mae, rmse, r_squared)
VALUES 
  ('LSTM', 34.05, 47.37, 0.9352),
  ('ARIMA', 43.01, 48.70, 0.5683)
ON CONFLICT (model_name) DO UPDATE SET
  mae = EXCLUDED.mae,
  rmse = EXCLUDED.rmse,
  r_squared = EXCLUDED.r_squared,
  updated_at = NOW();
