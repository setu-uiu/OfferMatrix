"""
export_ai_insights.py
======================
Runs the ACTUAL trained models (models/rideshare_weekly_model.pkl,
models/cosmetics_weekly_model.pkl) and exports their live 7-day forecast
as ai_insights.json, in the shape the Node backend's import script expects.

This is real inference, not hand-written numbers: it loads the joblib
bundles produced by weekly_forecast.py and calls the same
forecast_next_7_days() function used there.

Only the two categories that actually have a trained model are exported
(rideshare, cosmetics) — food_delivery has no model yet (same gap noted
throughout this project) and is deliberately left out rather than faked.

Run: python3 export_ai_insights.py
Output: ai_insights.json (copy into server/data/ for the Node import script)
"""

import json

import joblib
import pandas as pd

from weekly_forecast import (
    build_cosmetics_daily,
    build_rideshare_daily,
    forecast_next_7_days,
    CAL_COLS,
)


def load_and_forecast(name, daily_df, value_col, extra_cols, up_thresh, down_thresh, item_label):
    bundle = joblib.load(f"models/{name}_weekly_model.pkl")
    reg, feature_cols = bundle["regressor"], bundle["features"]

    daily_df = daily_df.sort_values("timestamp").reset_index(drop=True)
    last_date = daily_df["timestamp"].max()
    last_row = daily_df[daily_df["timestamp"] == last_date].iloc[0]

    current_row_dict = {c: last_row[c] for c in CAL_COLS + extra_cols}
    current_row_dict["current_value"] = last_row[value_col]

    result = forecast_next_7_days(reg, feature_cols, extra_cols, current_row_dict, last_date, up_thresh, down_thresh)
    result["category"] = name
    result["item"] = item_label
    result["currency"] = "BDT"
    result["model_version"] = "rf-weekly-v1"
    result["training_window_days"] = bundle["window_days"]
    result["trained_through"] = bundle["trained_through"]
    return result


if __name__ == "__main__":
    rideshare_daily = build_rideshare_daily()
    cosmetics_daily = build_cosmetics_daily()

    insights = [
        load_and_forecast(
            "rideshare", rideshare_daily, "fare", ["fare_lag_7d"], 5.0, 5.0,
            item_label="Pathao Moto — Dhanmondi 27 to Banani",
        ),
        load_and_forecast(
            "cosmetics", cosmetics_daily, "effective_price",
            ["list_price", "discount_pct", "discount_pct_roll7"], 5.0, 8.0,
            item_label="Maybelline Lash Sensational Mascara",
        ),
    ]

    with open("ai_insights.json", "w") as f:
        json.dump(insights, f, indent=2, default=str)

    print(f"Wrote ai_insights.json with {len(insights)} categories:")
    for ins in insights:
        print(f"  - {ins['category']}: {ins['item']} — week-end change {ins['week_end_pct_change']:+.1f}%, "
              f"nearest festival: {ins['nearest_festival']['name'] if ins['nearest_festival'] else 'none'}")
