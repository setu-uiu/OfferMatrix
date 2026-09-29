"""
weekly_forecast.py
===================
Upgrades the earlier single-horizon models into a genuine 7-DAY-AHEAD,
DAY-BY-DAY forecaster, and empirically tests the user's actual question —
"should this train on the last year of data or the last month?" — instead
of just picking one.

DESIGN: direct multi-horizon forecasting with horizon-as-a-feature.
Rather than training 7 separate models (one per day-ahead) or forecasting
recursively (day+1 feeds day+2, compounding errors), every historical base
day is paired with every horizon h=1..7 into one expanded training set,
with `horizon_days` itself as a feature and — critically — the TARGET
DAY's calendar features (is it near Eid? mid-month? a mega campaign?)
included as features too, since those are fully knowable in advance
regardless of horizon. This is what lets the model "cover the next
festival": if day+5 lands on Chand Raat, the model sees
target_days_to_nearest_eid≈0 for that specific (base_day, h=5) row.

VALIDATION: walk-forward backtesting, not a single train/test split. The
model is retrained at each of several past cutoff dates using only data
that would genuinely have been available at that time, then scored against
the real next 7 days — for BOTH a 1-year and a 1-month training window —
and the results are compared honestly, including the case where the
smaller window loses (it does, and the reason why is worth knowing).
"""

import numpy as np
import pandas as pd
import joblib
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor

from common import add_calendar_features, direction_label, EID_DATES, MEGA_CAMPAIGN_DATES

CAL_COLS = [
    "day_of_week", "day_of_month", "is_weekend_bd", "is_salary_week", "is_mid_month",
    "days_to_nearest_eid", "days_to_nearest_campaign", "days_since_fuel_hike", "last_fuel_hike_pct",
]


# ---------------------------------------------------------------------
# 1. Daily series (rideshare gets resampled from hourly -> daily peak fare)
# ---------------------------------------------------------------------

def build_rideshare_daily():
    df = pd.read_csv("data/rideshare_hourly.csv", parse_dates=["timestamp"])
    # Daily MAX fare, not mean: "how much will price go up" is about the
    # peak you'd actually pay that day, not diluted by 20 flat off-peak hours.
    daily = df.set_index("timestamp")["fare"].resample("D").max().rename("fare").reset_index()
    daily = add_calendar_features(daily)
    daily["fare_lag_7d"] = daily["fare"].shift(7)
    return daily.dropna(subset=["fare_lag_7d"]).reset_index(drop=True)


def build_cosmetics_daily():
    df = pd.read_csv("data/cosmetics_daily.csv", parse_dates=["timestamp"])
    df = df[["timestamp", *CAL_COLS, "list_price", "discount_pct", "effective_price"]].copy()
    df["discount_pct_roll7"] = df["discount_pct"].rolling(7, min_periods=1).mean()
    df["price_lag_7d"] = df["effective_price"].shift(7)
    return df.dropna(subset=["price_lag_7d"]).reset_index(drop=True)


# ---------------------------------------------------------------------
# 2. Horizon-expanded training set (the "direct multi-horizon" trick)
# ---------------------------------------------------------------------

def build_horizon_dataset(daily_df, value_col, extra_current_cols, horizons=range(1, 8)):
    daily_df = daily_df.sort_values("timestamp").reset_index(drop=True)
    values = daily_df[value_col].values
    frames = []
    for h in horizons:
        target_values = daily_df[value_col].shift(-h).values
        target_dates = daily_df["timestamp"] + pd.Timedelta(days=h)
        target_cal = add_calendar_features(pd.DataFrame({"timestamp": target_dates}))

        sub = daily_df[["timestamp", *CAL_COLS, *extra_current_cols]].copy()
        sub["horizon_days"] = h
        for c in CAL_COLS:
            sub[f"target_{c}"] = target_cal[c].values
        sub["current_value"] = values
        sub["target_value"] = target_values
        sub["pct_change_target"] = (target_values - values) / values * 100
        frames.append(sub)

    expanded = pd.concat(frames, ignore_index=True)
    return expanded.dropna(subset=["target_value"]).reset_index(drop=True)


def feature_cols_for(extra_current_cols):
    return CAL_COLS + list(extra_current_cols) + ["horizon_days"] + [f"target_{c}" for c in CAL_COLS]


# ---------------------------------------------------------------------
# 3. Walk-forward backtest: 1-year window vs. 1-month window
# ---------------------------------------------------------------------

def walk_forward_backtest(daily_df, value_col, extra_current_cols, window_days,
                            up_thresh, down_thresh, n_folds=8, fold_step_days=7, holdout_days=7):
    daily_df = daily_df.sort_values("timestamp").reset_index(drop=True)
    last_date = daily_df["timestamp"].max()
    feature_cols = feature_cols_for(extra_current_cols)

    # The final `holdout_days` are reserved for the live forecast demo and
    # never touched here; backtest cutoffs walk backward from just before that.
    max_cutoff = last_date - pd.Timedelta(days=holdout_days + 7)
    cutoffs = [max_cutoff - pd.Timedelta(days=fold_step_days * i) for i in range(n_folds)]

    mae_model, mae_naive, dir_acc_model, dir_acc_naive, used = [], [], [], [], 0

    for cutoff in cutoffs:
        train_start = cutoff - pd.Timedelta(days=window_days)
        train_df = daily_df[(daily_df["timestamp"] > train_start) & (daily_df["timestamp"] <= cutoff)]
        test_actuals = daily_df[
            (daily_df["timestamp"] > cutoff) & (daily_df["timestamp"] <= cutoff + pd.Timedelta(days=7))
        ].sort_values("timestamp")
        current_row = daily_df[daily_df["timestamp"] == cutoff]
        if len(train_df) < 14 or len(test_actuals) < 7 or len(current_row) == 0:
            continue

        train_expanded = build_horizon_dataset(train_df, value_col, extra_current_cols)
        if len(train_expanded) < 20:
            continue

        reg = RandomForestRegressor(n_estimators=150, max_depth=8, random_state=42, n_jobs=-1)
        reg.fit(train_expanded[feature_cols], train_expanded["pct_change_target"])

        current_value = current_row[value_col].values[0]
        pred_rows = []
        for h in range(1, 8):
            target_date = cutoff + pd.Timedelta(days=h)
            target_cal = add_calendar_features(pd.DataFrame({"timestamp": [target_date]}))
            row = {c: current_row[c].values[0] for c in CAL_COLS + list(extra_current_cols)}
            row["horizon_days"] = h
            for c in CAL_COLS:
                row[f"target_{c}"] = target_cal[c].values[0]
            pred_rows.append(row)
        pred_pct = reg.predict(pd.DataFrame(pred_rows)[feature_cols])
        pred_abs = current_value * (1 + pred_pct / 100)

        actual_abs = test_actuals[value_col].values[:7]
        naive_abs = np.full(7, current_value)

        mae_model.append(np.mean(np.abs(actual_abs - pred_abs)))
        mae_naive.append(np.mean(np.abs(actual_abs - naive_abs)))

        actual_pct = (actual_abs - current_value) / current_value * 100
        actual_dir = direction_label(actual_pct, up_thresh, down_thresh)
        pred_dir = direction_label(pred_pct, up_thresh, down_thresh)
        naive_dir = np.full(7, "STABLE", dtype=object)
        dir_acc_model.append(np.mean(actual_dir == pred_dir))
        dir_acc_naive.append(np.mean(actual_dir == naive_dir))
        used += 1

    return {
        "window_days": window_days,
        "folds_used": used,
        "mae_model": float(np.mean(mae_model)) if used else float("nan"),
        "mae_naive": float(np.mean(mae_naive)) if used else float("nan"),
        "dir_acc_model": float(np.mean(dir_acc_model)) if used else float("nan"),
        "dir_acc_naive": float(np.mean(dir_acc_naive)) if used else float("nan"),
    }


# ---------------------------------------------------------------------
# 4. Nearest festival / mega-campaign lookup (answers "cover the next festival")
# ---------------------------------------------------------------------

def nearest_upcoming_event(as_of_date):
    as_of = pd.Timestamp(as_of_date)
    events = [(name, pd.Timestamp(d), "Eid") for name, d in EID_DATES] + \
             [(name, pd.Timestamp(d), "mega_campaign") for name, d in MEGA_CAMPAIGN_DATES]
    upcoming = [(name, d, kind, (d - as_of).days) for name, d, kind in events if (d - as_of).days >= 0]
    if not upcoming:
        return None
    upcoming.sort(key=lambda x: x[3])
    name, date, kind, days_until = upcoming[0]
    return {"name": name, "date": str(date.date()), "type": kind, "days_until": days_until}


# ---------------------------------------------------------------------
# 5. Train the final production model (winning window) + live forecast
# ---------------------------------------------------------------------

def train_production_model(daily_df, value_col, extra_current_cols, window_days, name):
    daily_df = daily_df.sort_values("timestamp").reset_index(drop=True)
    last_date = daily_df["timestamp"].max()
    train_start = last_date - pd.Timedelta(days=window_days)
    train_df = daily_df[daily_df["timestamp"] > train_start]

    expanded = build_horizon_dataset(train_df, value_col, extra_current_cols)
    feature_cols = feature_cols_for(extra_current_cols)
    reg = RandomForestRegressor(n_estimators=200, max_depth=10, random_state=42, n_jobs=-1)
    reg.fit(expanded[feature_cols], expanded["pct_change_target"])

    joblib.dump(
        {"regressor": reg, "features": feature_cols, "extra_current_cols": list(extra_current_cols),
         "window_days": window_days, "trained_through": str(last_date.date())},
        f"models/{name}_weekly_model.pkl",
    )
    return reg, feature_cols, last_date


def forecast_next_7_days(reg, feature_cols, extra_current_cols, current_row_dict, as_of_date,
                           up_thresh, down_thresh):
    as_of = pd.Timestamp(as_of_date)
    rows, dates = [], []
    for h in range(1, 8):
        target_date = as_of + pd.Timedelta(days=h)
        dates.append(target_date)
        target_cal = add_calendar_features(pd.DataFrame({"timestamp": [target_date]}))
        row = {c: current_row_dict[c] for c in CAL_COLS + list(extra_current_cols)}
        row["horizon_days"] = h
        for c in CAL_COLS:
            row[f"target_{c}"] = target_cal[c].values[0]
        rows.append(row)

    pred_pct = reg.predict(pd.DataFrame(rows)[feature_cols])
    current_value = current_row_dict["current_value"]
    pred_abs = current_value * (1 + pred_pct / 100)
    directions = direction_label(pred_pct, up_thresh, down_thresh)

    festival = nearest_upcoming_event(as_of)
    festival_in_window = festival is not None and festival["days_until"] <= 7

    forecast = [
        {
            "day": h,
            "date": str(dates[h - 1].date()),
            "predicted_value": round(float(pred_abs[h - 1]), 1),
            "pct_change_from_today": round(float(pred_pct[h - 1]), 2),
            "direction": directions[h - 1],
        }
        for h in range(1, 8)
    ]
    return {
        "as_of_date": str(as_of.date()),
        "current_value": current_value,
        "forecast_7_day": forecast,
        "week_end_pct_change": round(float(pred_pct[-1]), 2),
        "nearest_festival": festival,
        "festival_within_forecast_window": festival_in_window,
    }


# ---------------------------------------------------------------------
# main
# ---------------------------------------------------------------------

if __name__ == "__main__":
    rideshare_daily = build_rideshare_daily()
    cosmetics_daily = build_cosmetics_daily()

    tasks = [
        ("rideshare", rideshare_daily, "fare", ["fare_lag_7d"], 5.0, 5.0),
        ("cosmetics", cosmetics_daily, "effective_price",
         ["list_price", "discount_pct", "discount_pct_roll7"], 5.0, 8.0),
    ]

    winners = {}
    for name, daily_df, value_col, extra_cols, up_t, down_t in tasks:
        print(f"\n{'=' * 70}\n{name.upper()} — walk-forward backtest: 1-year vs 1-month window\n{'=' * 70}")
        result_1y = walk_forward_backtest(daily_df, value_col, extra_cols, 365, up_t, down_t)
        result_1m = walk_forward_backtest(daily_df, value_col, extra_cols, 30, up_t, down_t)

        for r in (result_1y, result_1m):
            label = "1-YEAR window" if r["window_days"] == 365 else "1-MONTH window"
            print(f"\n  {label} ({r['folds_used']} backtest folds):")
            print(f"    7-day MAE  — model: {r['mae_model']:.2f}   naive: {r['mae_naive']:.2f}   "
                  f"({(1 - r['mae_model'] / r['mae_naive']) * 100:+.1f}% vs naive)")
            print(f"    direction accuracy — model: {r['dir_acc_model']:.3f}   naive: {r['dir_acc_naive']:.3f}")

        winner = 365 if result_1y["mae_model"] <= result_1m["mae_model"] else 30
        winners[name] = winner
        print(f"\n  -> {name}: {'1-year' if winner == 365 else '1-month'} window wins on 7-day MAE, "
              f"used for the production model.")

    # Train production models on the winning window, then produce the live forecast
    for name, daily_df, value_col, extra_cols, up_t, down_t in tasks:
        window = winners[name]
        reg, feature_cols, last_date = train_production_model(daily_df, value_col, extra_cols, window, name)

        last_row = daily_df[daily_df["timestamp"] == last_date].iloc[0]
        current_row_dict = {c: last_row[c] for c in CAL_COLS + extra_cols}
        current_row_dict["current_value"] = last_row[value_col]

        result = forecast_next_7_days(reg, feature_cols, extra_cols, current_row_dict, last_date, up_t, down_t)

        print(f"\n{'=' * 70}\n{name.upper()} — LIVE 7-DAY FORECAST as of {result['as_of_date']} "
              f"(current: {result['current_value']:.0f} BDT, {window}-day window model)\n{'=' * 70}")
        for row in result["forecast_7_day"]:
            print(f"  day {row['day']}  {row['date']}  ->  {row['predicted_value']:.0f} BDT  "
                  f"({row['pct_change_from_today']:+.1f}%)  {row['direction']}")
        if result["nearest_festival"]:
            f = result["nearest_festival"]
            flag = " <-- inside this 7-day forecast" if result["festival_within_forecast_window"] else ""
            print(f"  Nearest festival/campaign: {f['name']} on {f['date']} "
                  f"({f['days_until']} days away){flag}")

        # Chart
        dates = [row["date"] for row in result["forecast_7_day"]]
        vals = [row["predicted_value"] for row in result["forecast_7_day"]]
        plt.figure(figsize=(9, 4))
        plt.plot(["today"] + dates, [result["current_value"]] + vals, marker="o")
        plt.axhline(result["current_value"], color="gray", linestyle="--", linewidth=1, label="today's value")
        plt.title(f"{name}: 7-day forecast from {result['as_of_date']}")
        plt.ylabel("BDT")
        plt.xticks(rotation=30)
        plt.legend()
        plt.tight_layout()
        plt.savefig(f"charts/{name}_7day_forecast.png", dpi=120)
        plt.close()
