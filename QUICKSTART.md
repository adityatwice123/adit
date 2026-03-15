# Quick Start Guide - 5 Minutes to Running Forecasts

## Step 1: Install & Run (2 minutes)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Your dashboard is now running at `http://localhost:3000`

## Step 2: Configure Supabase (Optional - for data persistence)

Skip this if you just want to test the UI. The app works without Supabase.

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor → Copy & paste from `scripts/setup-db.sql` → Run
4. Copy your credentials to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   ```
5. Restart dev server

## Step 3: Generate Your First Forecast (1 minute)

1. Go to `http://localhost:3000`
2. Select a date (today is default)
3. Select horizon: **24h** (recommended)
4. Select models: **Both** (to see both LSTM & ARIMA)
5. Click **"Run Forecast"**
6. Watch the chart and table populate with 24-hour predictions!

## What You'll See

### Chart Section
- Blue bars = LSTM predictions
- Purple line = ARIMA predictions
- Color coding: Green (normal) → Orange (high) → Red (peak demand)
- Peak at 18:00 (~1,482 MW)

### Prediction Table
- All 24 hours listed
- Confidence percentages
- Demand categories
- Model differences

### Metrics Panel
- LSTM accuracy: 93.52% (R²)
- ARIMA accuracy: 56.83% (R²)
- MAE and RMSE values

### Insights
- Peak demand: 1,482 MW at 18:00
- Load-Hour correlation: 0.453
- Key findings and recommendations

## Key Features

✅ Always generates 24-hour predictions (no more, no less)
✅ Hourly intervals (24 predictions total)
✅ Compare two AI models side-by-side
✅ Color-coded demand levels
✅ Confidence percentages
✅ Real model metrics from notebook
✅ Mobile responsive design
✅ No page refresh needed

## Pro Tips

1. **Compare Models**: Use "Both" to see where LSTM and ARIMA differ
2. **Horizon Selector**: 
   - 1h = 1 hour ahead
   - 6h = 6 hours ahead
   - 12h = 12 hours ahead
   - 24h = Full day ahead (recommended)
3. **Peak Thresholds**:
   - Normal: < 1,200 MW (green)
   - High: 1,200-1,400 MW (orange)
   - Peak: > 1,400 MW (red)

## Troubleshooting

**"npm not found"**
→ Install Node.js from nodejs.org

**"Port 3000 in use"**
→ Run `npm run dev -- -p 3001` to use port 3001

**No data appearing**
→ Check browser console (F12) for errors, refresh page

**Supabase connection error**
→ Supabase is optional - app works without it. Just ignore the error.

## Next: Customize It

See `SETUP.md` for:
- Integrating real LSTM/ARIMA models
- Adjusting peak thresholds
- Modifying baseline patterns
- Custom colors and styling

## Need More?

- **Full Setup Guide**: Read `SETUP.md`
- **Project Overview**: Read `PROJECT_SUMMARY.md`
- **Component Details**: Check comments in each component file

---

**Enjoy your forecasting dashboard!** 📊
