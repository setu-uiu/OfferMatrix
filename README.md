# OfferMatrix Statistical/ML Pricing Forecast — Methodology & Results

This is a real, trained statistical/ML forecasting layer — RandomForest
regression + classification from scikit-learn — sitting alongside (not
replacing) `pricingPredictionEngine.js`, the deterministic rule engine
built earlier in this project. No historical price/fare data exists for
OfferMatrix yet, so this uses **synthetic data generated from a known
ground-truth process**, which is exactly what makes it possible to check
whether the models actually learn anything real.

## Files

| File | Purpose |
|---|---|
| `common.py` | Shared Eid/mega-campaign/fuel-hike calendar + feature engineering, used by both the generator and the trainer |
| `generate_synthetic_data.py` | Builds the two fake historical datasets |
| `train_forecasting_models.py` | Trains, evaluates, and saves both models |
| `predict.py` | Loads a saved model and scores a new item/route |
| `data/rideshare_hourly.csv` | ~2,300 days × hourly Pathao/Uber fare, Jan 2024–Sep 2026 |
| `data/cosmetics_daily.csv` | Daily list price/discount for one cosmetics SKU, same range |
| `models/*.pkl` | Trained RandomForest regressor + classifier bundles (joblib) |
| `charts/*.png` | Actual-vs-predicted plots, full test period and a zoomed-in window |

## Why synthetic data, and why it's a fair test

The generator (`generate_synthetic_data.py`) encodes the same domain
knowledge as the rule engine — Eid demand cycles, fuel-hike step
increases, peak-hour surges, salary-week/mega-campaign discount cycles —
as a **generative process with noise**, not as training labels. The model
never sees the rules; it only sees noisy historical numbers and has to
recover the patterns statistically. It also isn't graded against the
rules — it's graded against **held-out future data it never trained on**
and, more importantly, against a **naive baseline** (see below). This is
still a toy exercise (the "ground truth" is itself invented), but the
evaluation methodology — chronological split, naive baseline, no target
leakage — is the same one you'd use on real data.

## What's being predicted

- **Rideshare**: fare 3 hours ahead, from hourly data (Dhanmondi 27 →
  Banani reference route)
- **Cosmetics**: effective price 14 days ahead, from daily data
  (Maybelline Lash Sensational Mascara as the reference SKU)

Both produce two outputs: a **regression** (the actual predicted
price/fare) and a **classification** (`PRICE_INCREASE` / `PRICE_DECREASE`
/ `STABLE`, matching the rule engine's schema).

## A real bug worth documenting

The first version of the regressor predicted the **raw future price
level** and scored *worse than doing nothing* (predicting "no change"):
rideshare MAE 60 vs. a naive baseline of 44. Root cause: this data has a
genuine inflation trend, and a chronological train/test split puts the
test period at a permanently higher price level than anything the model
saw in training. Tree ensembles (RandomForest, gradient boosting, etc.)
**cannot extrapolate beyond the range of target values seen in
training** — they can only average leaves learned from training examples,
so asked to predict values above every price they've ever seen, they bias
toward the training-era level and lose badly to a baseline that just
carries the current (already-trended) value forward.

**Fix**: retarget the regressor on **% change** instead of the absolute
level (`pct_change_target` in the code) — a peak-hour surge or an Eid
discount is the same relative size whether the base fare is ৳240 or ৳400,
so this target's distribution doesn't shift between train and test.
Absolute BDT values are reconstructed only for reporting
(`current_price * (1 + predicted_pct / 100)`). This is the standard fix
for tree-based models on trending series, and it's worth keeping in mind
for any future model trained on OfferMatrix's real data too, once it
exists — a real inflation trend will cause the exact same failure.

## Results (chronological 85/15 train/test split — never shuffled)

| | Rideshare (3h ahead) | Cosmetics (14d ahead) |
|---|---|---|
| Regression MAE — model | ৳33.2 | ৳39.8 |
| Regression MAE — naive baseline | ৳43.8 | ৳79.8 |
| **Improvement over naive** | **24%** | **50%** |
| Direction accuracy — model | 55% | 76% |
| Direction accuracy — majority-class baseline | 38% | 53% |

Both models beat their baselines by a clear margin, so they're learning
real signal — but neither is spectacular, and that's honest: an hourly
fare 3 hours out is genuinely noisy (R²≈0.02), and this is a fake dataset
with injected randomness on top of injected rules. Report these numbers
as "beats a naive baseline by X%," not as "N% accurate" — the second
framing overstates what a direction-classification accuracy figure means.

**Feature importance** confirms the models found the right signal without
being told the rules: `hour_of_day` dominates the rideshare classifier
(the peak-hour cycle is the strongest short-term driver); `discount_pct`,
`is_mid_month`, and `is_salary_week` dominate cosmetics (matching the
"salary week suppresses discounts / mid-month campaigns deepen them"
pattern from the rule engine — recovered from data, not hardcoded).

**One limitation visible in the zoomed rideshare chart**
(`rideshare_actual_vs_predicted_zoomed.png`): the model under-predicts
fares in the days right after the Sept 21, 2026 fuel hike. That hike
(17%) is the largest in the synthetic history and sits at the very end of
the timeline — the model has few comparable "large, fresh hike" examples
to learn from, a classic cold-start problem for rare events. Worth
knowing before trusting this model's output immediately after any new,
unusually large fuel-price change.

## Cross-check against the rule engine

`predict.py`'s `__main__` block reruns Test Case 1 and Test Case 2 from
the spec conversation through the trained ML model instead of the rule
engine:

- **Case 1** (fuel hike + approaching peak): rule engine said
  `PRICE_INCREASE` / `URGENT`. ML model: `PRICE_INCREASE` / `URGENT`,
  78.5% confidence. ✅ agree
- **Case 2** (10% discount, no hard window in 14 days): rule engine said
  `STABLE` / `HOLD`. ML model: `STABLE` / `HOLD`, 74.9% confidence. ✅ agree

Two independently-built systems reaching the same call on the same inputs
is a reasonable sanity check — not proof either is "correct" against real
market behavior, since both were shaped by the same underlying domain
assumptions.

## Honest limitations (say these in the report/defense, don't bury them)

1. **The data is fake.** Every pattern here — Eid multipliers, discount
   depths, fuel sensitivity — is an assumed number, not measured. A real
   deployment needs real historical logs before any of these metrics mean
   anything for actual OfferMatrix users.
2. **No real cross-validation across multiple Eid cycles is possible**
   with only ~6 Eid events in the synthetic range — the model is not
   tested on how it generalizes to an Eid whose demand shape differs from
   the training years.
3. **food_delivery has no ML model yet** — same gap flagged for the rule
   engine. The stacking logic (cart-vs-cashback-threshold) is arithmetic,
   not a learned pattern, and there wasn't an obvious continuous target to
   forecast for it the way there is for fare/price.
4. Confidence buckets (`LOW`/`MEDIUM`/`HIGH`) are `predict_proba` max-class
   probability run through arbitrary thresholds (0.45/0.65) — reasonable
   defaults, not calibrated against real outcomes.

## Requirements

```
pandas
numpy
scikit-learn
joblib
matplotlib
```

## Regenerating everything

```bash
python3 generate_synthetic_data.py   # rebuilds data/*.csv
python3 train_forecasting_models.py  # rebuilds models/*.pkl and charts/*.png
python3 predict.py                   # example inference run
```

---

# Part 2: 7-Day-Ahead Weekly Forecast (`weekly_forecast.py`)

The first model above answered "what's the signal right now" (3h/14d
single-horizon). This one answers the actual follow-up question: **for
each of the next 7 days, how much will price move, trained on how much
history, and does an upcoming festival fall inside that window.**

## Design: direct multi-horizon, horizon-as-a-feature

Rather than 7 separate models (one per day-ahead) or a recursive forecast
(day+1's prediction feeds day+2, compounding errors), every historical
base day is paired with every horizon h=1..7 into one expanded training
set, with `horizon_days` itself as a feature. Critically, the **target
day's own calendar features** (is it near Eid? mid-month? a mega
campaign?) are included too — fully knowable in advance regardless of
horizon. This is what makes the model "cover the next festival": if day+5
of a forecast lands on Chand Raat, the model sees
`target_days_to_nearest_eid≈0` specifically for that (base_day, h=5) row,
not just for "today."

Rideshare is resampled from hourly to **daily max fare** (the peak you'd
actually pay that day) rather than a daily mean, which would dilute the
signal with ~20 flat off-peak hours.

## The actual question: does 1 year of data beat 1 month?

Tested empirically via **walk-forward backtesting** (retrain at 8 past
cutoff dates, one week apart, using only data that would genuinely have
existed at that time, then score against the real next 7 days — not a
single train/test split):

| | Rideshare — 1yr window | Rideshare — 1mo window | Cosmetics — 1yr window | Cosmetics — 1mo window |
|---|---|---|---|---|
| 7-day MAE (model) | 10.3 | 12.0 | 33.5 | 59.4 |
| 7-day MAE (naive) | 35.1 | 35.1 | 51.1 | 51.1 |
| vs. naive | **+70.6%** | +65.7% | **+34.5%** | **-16.3% (worse!)** |
| Direction accuracy | 94.6% | 96.4% | 91.1% | 76.8% (= naive) |

**1 year wins for both**, and cosmetics shows why starkly: the 1-month
window trained a model that's *worse than doing nothing*. A 30-day slice
of history is very unlikely to contain an Eid or a mega-campaign, so the
model never sees what a real discount swing looks like and has nothing to
generalize from when one is 45 days out — it just adds noise on top of
the current price. Rideshare is more forgiving because peak-hour and
weekend effects repeat every single week, so even 30 days holds several
full cycles; Eid/campaign effects don't. **Both production models
(`models/{name}_weekly_model.pkl`) are trained on the 1-year window** as a
result — this was decided by the backtest, not assumed going in.

## Live forecast, as of the last available date (2026-09-24)

Running `python3 weekly_forecast.py` also prints/saves a real forecast
from today (`charts/{name}_7day_forecast.png`):

- **Rideshare**: predicts a sharp drop for Sep 25–26 (Fri/Sat — Bangladesh's
  weekend, so the peak-hour rule the model learned simply doesn't apply
  those two days) and a recovery to roughly today's level by Sunday. This
  is the model correctly discovering the Sun–Thu work-week pattern from
  data, not a hardcoded rule.
- **Cosmetics**: mild +1.5–2.9% drift, no big swing — correctly, since the
  nearest festival/campaign (11.11, Nov 11) is 48 days out, outside this
  7-day window. The forecast output explicitly reports this
  (`nearest_festival` + `festival_within_forecast_window: false`), so a
  UI can show "no major event this week" instead of guessing.

## Honest caveats specific to this model

- 8 backtest folds is a small sample for the window-size comparison —
  enough to see a clear, consistent pattern here, not enough to call the
  margin precise.
- The "1 year wins" result is somewhat circular by construction: the
  synthetic data's Eid/campaign effects were deliberately made large
  relative to noise, which is exactly the situation where more history
  helps most. On a real, noisier series the crossover point between "too
  little data" and "enough" would need to be found the same way (backtest
  it), not assumed to be 1 year.
- Daily max fare for rideshare is a deliberate choice (see above) — it
  will read as more volatile than a mean-fare series would, which is
  correct for "what will I actually pay at peak" but worth stating if this
  gets compared against a different aggregation later.

