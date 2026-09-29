"""
generate_synthetic_data.py
===========================
Builds two SYNTHETIC historical datasets to train real forecasting models
on, since no real historical price/fare time series is available:

  1. data/rideshare_hourly.csv   — hourly Pathao/Uber fare on a fixed route
  2. data/cosmetics_daily.csv    — daily list price + discount depth for
                                    an imported cosmetics SKU

Both are generated from a known ground-truth process (inflation trend +
Eid cycle + fuel-hike shocks + peak-hour/campaign effects + noise), so the
ML models trained on them in train_forecasting_models.py have to discover
those patterns statistically from the data — nothing about the model
training step hardcodes the rules. This mirrors the domain knowledge in
pricingPredictionEngine.js but is NOT copied from it: the generator injects
noise and interacting effects the rule engine never modeled, so a model
that merely re-implemented the rules would score worse than one that
actually fits the data.

THIS DATA IS FAKE. It is shaped for a believable class-project demo, not
sourced from any real fare or pricing feed.
"""

import numpy as np
import pandas as pd

from common import add_calendar_features, EID_DATES

RNG = np.random.default_rng(42)

START = "2024-01-01"
END = "2026-09-24 23:00"


# ---------------------------------------------------------------------
# 1. Rideshare — hourly fare, Dhanmondi 27 -> Banani (fixed reference route)
# ---------------------------------------------------------------------

def eid_multiplier(days_to_eid: np.ndarray) -> np.ndarray:
    mult = np.ones_like(days_to_eid, dtype=float)

    pre = (days_to_eid >= 10) & (days_to_eid <= 20)
    mult[pre] = 1.0 + 0.20 * (20 - days_to_eid[pre]) / 10.0  # ramps 1.0 -> 1.20

    chand_raat = (days_to_eid >= 0) & (days_to_eid <= 2)
    mult[chand_raat] = 1.45

    post = (days_to_eid < 0) & (days_to_eid >= -7)
    days_after = -days_to_eid[post]
    mult[post] = 0.80 + 0.20 * (days_after / 7.0)  # 0.80 right after Eid -> back to ~1.0 by day 7

    return mult


def peak_multiplier(hour_of_day: np.ndarray, day_of_week: np.ndarray) -> np.ndarray:
    mult = np.ones(hour_of_day.shape, dtype=float)
    is_peak_day = np.isin(day_of_week, [6, 0, 1, 2, 3])  # Sun(6)-Thu(3), pandas Mon=0 convention

    approach_hours = [7, 17]                  # hour just before each window opens
    peak_hours = [8, 9, 10, 18, 19, 20]        # 08:00-10:30 & 17:30-20:30, hour-resolution approx

    mult = np.where(is_peak_day & np.isin(hour_of_day, approach_hours), 1.12, mult)
    mult = np.where(is_peak_day & np.isin(hour_of_day, peak_hours), 1.28, mult)
    return mult


def generate_rideshare():
    ts = pd.date_range(START, END, freq="h")
    df = pd.DataFrame({"timestamp": ts})
    df = add_calendar_features(df)

    days_since_start = (ts - ts[0]).days.values.astype(float) + (ts.hour.values / 24.0)
    trend = (1.0 + 0.06) ** (days_since_start / 365.25)  # ~6%/yr background inflation

    # Fuel-hike step function: each hike is a PERMANENT bump, so chain them
    # cumulatively over time rather than using only the most recent one.
    fuel_sensitivity = 0.5  # fare rises at ~50% of the fuel price % change
    fuel_step = np.ones(len(df))
    cum = 1.0
    from common import FUEL_HIKE_EVENTS
    hike_times = pd.to_datetime([d for d, _ in FUEL_HIKE_EVENTS])
    hike_mags = [m for _, m in FUEL_HIKE_EVENTS]
    for hike_time, mag in zip(hike_times, hike_mags):
        cum *= 1.0 + fuel_sensitivity * (mag / 100.0)
        fuel_step = np.where(ts >= hike_time, cum, fuel_step)
        # (loop runs once per hike event, not per row — cheap)

    p_mult = peak_multiplier(ts.hour.values, ts.dayofweek.values)
    e_mult = eid_multiplier(df["days_to_nearest_eid"].values)
    noise = RNG.normal(1.0, 0.03, size=len(df))

    base_fare = 240.0
    fare = base_fare * trend * fuel_step * p_mult * e_mult * noise
    df["fare"] = np.round(fare, 0)

    df.to_csv("data/rideshare_hourly.csv", index=False)
    print(f"rideshare_hourly.csv: {len(df):,} rows, fare range {df['fare'].min():.0f}-{df['fare'].max():.0f} BDT")
    return df


# ---------------------------------------------------------------------
# 2. Cosmetics/FMCG — daily list price + discount depth
# ---------------------------------------------------------------------

def generate_cosmetics():
    ts = pd.date_range(START, END, freq="D")
    df = pd.DataFrame({"timestamp": ts})
    df = add_calendar_features(df)

    days_since_start = (ts - ts[0]).days.values.astype(float)
    list_trend = (1.0 + 0.09) ** (days_since_start / 365.25)  # ~9%/yr for imported cosmetics
    list_noise = RNG.normal(1.0, 0.01, size=len(df))
    base_list_price = 1055.0
    list_price = base_list_price * list_trend * list_noise

    base_discount = RNG.normal(8.0, 1.5, size=len(df))  # baseline ~8% off, noisy

    days_to_eid = df["days_to_nearest_eid"].values
    days_to_camp = df["days_to_nearest_campaign"].values

    # Pre-Eid: sellers pull discounts back (aggressive demand, low markdowns)
    pre_eid = (days_to_eid >= 10) & (days_to_eid <= 20)
    pre_eid_adjustment = np.where(pre_eid, -5.0 * (20 - days_to_eid) / 10.0, 0.0)

    # Post-Eid clearance: discounts deepen for about a week
    post_eid = (days_to_eid < 0) & (days_to_eid >= -7)
    days_after = np.where(post_eid, -days_to_eid, 0.0)
    post_eid_adjustment = np.where(post_eid, 20.0 * (1.0 - days_after / 7.0), 0.0)

    # Mega campaigns: discount ramps up in the 3 days before, peaks on the day, fades over 2 days after
    camp_before = (days_to_camp >= 0) & (days_to_camp <= 3)
    camp_after = (days_to_camp < 0) & (days_to_camp >= -2)
    camp_adjustment = np.zeros(len(df))
    camp_adjustment[camp_before] = 24.0 * (1.0 - days_to_camp[camp_before] / 3.0)
    camp_adjustment[camp_after] = 24.0 * (1.0 + days_to_camp[camp_after] / 2.0)

    # Mid-month micro-campaigns: small bump
    mid_month_adjustment = np.where(df["is_mid_month"], 5.0, 0.0)

    # Salary week: discounts stay shallow
    salary_week_adjustment = np.where(df["is_salary_week"], -3.0, 0.0)

    discount_noise = RNG.normal(0.0, 1.2, size=len(df))

    discount_pct = (
        base_discount
        + pre_eid_adjustment
        + post_eid_adjustment
        + camp_adjustment
        + mid_month_adjustment
        + salary_week_adjustment
        + discount_noise
    )
    discount_pct = np.clip(discount_pct, 0.0, 45.0)

    df["list_price"] = np.round(list_price, 0)
    df["discount_pct"] = np.round(discount_pct, 1)
    df["effective_price"] = np.round(df["list_price"] * (1 - df["discount_pct"] / 100.0), 0)

    df.to_csv("data/cosmetics_daily.csv", index=False)
    print(f"cosmetics_daily.csv: {len(df):,} rows, effective price range "
          f"{df['effective_price'].min():.0f}-{df['effective_price'].max():.0f} BDT")
    return df


if __name__ == "__main__":
    generate_rideshare()
    generate_cosmetics()
    print("\nDone. Eid dates used:", [d for _, d in EID_DATES])
