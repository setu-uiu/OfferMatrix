"""
common.py — shared calendar knowledge + feature engineering for the
OfferMatrix statistical/ML pricing-forecast models.

Historical Eid/mega-campaign dates below (2024-2025) are real, checked
against multiple sources. 2026-2027 dates are the same estimates used in
the rule-engine (pricingPredictionEngine.js) for consistency between the
two systems; Eid dates are moon-sighting dependent and shift +/-1 day.
"""

import numpy as np
import pandas as pd

EID_DATES = [
    ("eid_ul_fitr_2024", "2024-04-10"),
    ("eid_ul_adha_2024", "2024-06-17"),
    ("eid_ul_fitr_2025", "2025-03-31"),
    ("eid_ul_adha_2025", "2025-06-07"),
    ("eid_ul_fitr_2026", "2026-03-24"),
    ("eid_ul_adha_2026", "2026-05-27"),
    ("eid_ul_fitr_2027", "2027-03-11"),
]

MEGA_CAMPAIGN_DATES = [
    ("pohela_boishakh_2024", "2024-04-14"),
    ("black_friday_2024", "2024-11-22"),
    ("11.11_2024", "2024-11-11"),
    ("12.12_2024", "2024-12-12"),
    ("pohela_boishakh_2025", "2025-04-14"),
    ("black_friday_2025", "2025-11-28"),
    ("11.11_2025", "2025-11-11"),
    ("12.12_2025", "2025-12-12"),
    ("pohela_boishakh_2026", "2026-04-14"),
    ("black_friday_2026", "2026-11-27"),
    ("11.11_2026", "2026-11-11"),
    ("12.12_2026", "2026-12-12"),
]

# Synthetic fuel-hike history (government retail fuel price adjustments).
# FAKE DATA for model-training purposes — does not reflect the real BD
# fuel price record. Each tuple: (date, magnitude_pct).
FUEL_HIKE_EVENTS = [
    ("2024-03-01", 8.0),
    ("2024-08-15", 12.0),
    ("2025-01-10", 6.0),
    ("2025-07-01", 10.0),
    ("2026-02-01", 9.0),
    ("2026-05-31", 7.0),
    ("2026-09-21", 17.0),
]

# NOTE: dates are normalized to an explicit datetime64[ns] dtype before any
# subtraction. pandas has changed the *default* storage resolution of
# DatetimeIndex/Timestamp across versions (e.g. date_range may yield
# datetime64[us] while Timestamp.value is always nanoseconds) — mixing raw
# int64 views of two different resolutions silently corrupts day-difference
# math instead of raising an error. Casting both sides the same way avoids
# that regardless of which pandas version this runs under.
EID_TS = pd.DatetimeIndex([d for _, d in EID_DATES]).astype("datetime64[ns]")
CAMPAIGN_TS = pd.DatetimeIndex([d for _, d in MEGA_CAMPAIGN_DATES]).astype("datetime64[ns]")
FUEL_TS = pd.DatetimeIndex([d for d, _ in FUEL_HIKE_EVENTS]).astype("datetime64[ns]")
FUEL_MAG = np.array([m for _, m in FUEL_HIKE_EVENTS], dtype="float64")

ONE_DAY = np.timedelta64(1, "D")


def days_to_nearest(timestamps: pd.DatetimeIndex, events: pd.DatetimeIndex) -> np.ndarray:
    """Signed days to the nearest event (+ = event is in the future)."""
    t = pd.DatetimeIndex(timestamps).astype("datetime64[ns]").values[:, None]
    ev = events.values[None, :]
    diffs_days = (ev - t) / ONE_DAY
    idx = np.argmin(np.abs(diffs_days), axis=1)
    return diffs_days[np.arange(len(t)), idx].astype(float)


def days_since_last_fuel_hike(timestamps: pd.DatetimeIndex):
    """Returns (days_since, magnitude_pct) for the most recent fuel hike
    at or before each timestamp. Before the first recorded hike, returns
    (9999, 0.0) — i.e. "no recent hike"."""
    t = pd.DatetimeIndex(timestamps).astype("datetime64[ns]").values[:, None]
    ev = FUEL_TS.values[None, :]
    diffs_days = (t - ev) / ONE_DAY  # positive = hike was in the past
    diffs_days = np.where(diffs_days < 0, np.inf, diffs_days)
    idx = np.argmin(diffs_days, axis=1)
    since = diffs_days[np.arange(len(t)), idx]
    mag = FUEL_MAG[idx]
    since = np.where(np.isinf(since), 9999.0, since)
    mag = np.where(since == 9999.0, 0.0, mag)
    return since, mag


def add_calendar_features(df: pd.DataFrame, ts_col: str = "timestamp") -> pd.DataFrame:
    """Adds the shared calendar features every model uses. `df` must have a
    datetime column named `ts_col`."""
    ts = pd.DatetimeIndex(df[ts_col])
    df = df.copy()
    df["day_of_week"] = ts.dayofweek  # Mon=0 ... Sun=6
    df["day_of_month"] = ts.day
    df["is_weekend_bd"] = ts.dayofweek.isin([4, 5])  # Fri, Sat
    df["is_salary_week"] = (ts.day >= 25) | (ts.day <= 5)
    df["is_mid_month"] = (ts.day >= 10) & (ts.day <= 20)
    df["days_to_nearest_eid"] = days_to_nearest(ts, EID_TS)
    df["days_to_nearest_campaign"] = days_to_nearest(ts, CAMPAIGN_TS)
    since, mag = days_since_last_fuel_hike(ts)
    df["days_since_fuel_hike"] = since
    df["last_fuel_hike_pct"] = mag
    return df


def direction_label(pct_change: np.ndarray, up_thresh: float, down_thresh: float) -> np.ndarray:
    """Maps a % change series to PRICE_INCREASE / PRICE_DECREASE / STABLE."""
    labels = np.full(pct_change.shape, "STABLE", dtype=object)
    labels[pct_change >= up_thresh] = "PRICE_INCREASE"
    labels[pct_change <= -down_thresh] = "PRICE_DECREASE"
    return labels
