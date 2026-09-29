"""
train_forecasting_models.py
============================
Trains and evaluates the actual statistical/ML forecasting models:

  - rideshare: RandomForest regressor + classifier forecasting fare
               3 hours ahead, from data/rideshare_hourly.csv
  - cosmetics: RandomForest regressor + classifier forecasting effective
               price 14 days ahead, from data/cosmetics_daily.csv

Both are evaluated against a NAIVE PERSISTENCE BASELINE (predict "no
change") and a majority-class baseline for the direction classifier — a
model that doesn't beat these isn't actually learning anything. Train/test
split is chronological (last 15% of the timeline held out), never random,
since shuffling a time series before splitting leaks the future into
training.

Outputs: models/{name}_model.pkl, charts/{name}_actual_vs_predicted.png
"""

import joblib
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)

from common import direction_label

RIDESHARE_FEATURES = [
    "hour_of_day", "day_of_week", "is_weekend_bd",
    "days_to_nearest_eid", "days_since_fuel_hike", "last_fuel_hike_pct",
    "fare", "fare_lag_24h", "fare_lag_168h",
]

COSMETICS_FEATURES = [
    "day_of_week", "day_of_month", "is_salary_week", "is_mid_month",
    "days_to_nearest_eid", "days_to_nearest_campaign",
    "list_price", "discount_pct", "effective_price", "discount_pct_roll7",
]


def time_split(df: pd.DataFrame, test_frac: float = 0.15):
    """Chronological split — NEVER shuffle a time series before splitting."""
    split_idx = int(len(df) * (1 - test_frac))
    return df.iloc[:split_idx].copy(), df.iloc[split_idx:].copy()


def prep_rideshare() -> pd.DataFrame:
    df = pd.read_csv("data/rideshare_hourly.csv", parse_dates=["timestamp"])
    df["hour_of_day"] = df["timestamp"].dt.hour
    df["fare_lag_24h"] = df["fare"].shift(24)
    df["fare_lag_168h"] = df["fare"].shift(168)  # same hour, 1 week ago

    horizon = 3  # hours
    df["fare_target"] = df["fare"].shift(-horizon)
    df["pct_change_target"] = (df["fare_target"] - df["fare"]) / df["fare"] * 100
    df["direction_target"] = direction_label(df["pct_change_target"].values, up_thresh=3.0, down_thresh=3.0)

    return df.dropna(subset=["fare_lag_24h", "fare_lag_168h", "fare_target"]).reset_index(drop=True)


def prep_cosmetics() -> pd.DataFrame:
    df = pd.read_csv("data/cosmetics_daily.csv", parse_dates=["timestamp"])
    df["discount_pct_roll7"] = df["discount_pct"].rolling(7, min_periods=1).mean()

    horizon = 14  # days
    df["price_target"] = df["effective_price"].shift(-horizon)
    df["pct_change_target"] = (df["price_target"] - df["effective_price"]) / df["effective_price"] * 100
    df["direction_target"] = direction_label(df["pct_change_target"].values, up_thresh=5.0, down_thresh=8.0)

    return df.dropna(subset=["price_target"]).reset_index(drop=True)


def train_and_eval(df, feature_cols, current_value_col, reg_target_col, class_target_col, name,
                    n_estimators=150, max_depth=10):
    train_df, test_df = time_split(df)
    X_train, X_test = train_df[feature_cols], test_df[feature_cols]

    # ---- Regression: predict % CHANGE, not the raw future level ----
    # Tree ensembles cannot extrapolate beyond the target range seen in
    # training. This series has a real inflation trend, so a chronological
    # split puts the test period at a persistently higher price/fare level
    # than any training example — a model trained on absolute levels
    # (fare_target / price_target) predicts as if that trend didn't exist
    # and loses badly to the naive baseline (verified: MAE ~60 vs naive ~44
    # on this data). % change is trend-invariant — a 28% peak-hour surge or
    # an Eid discount is the same relative size whether the base price is
    # 240 or 400 — so the model is trained and evaluated on that instead,
    # and absolute values are reconstructed only for reporting.
    y_train_reg = train_df["pct_change_target"]
    y_test_pct = test_df["pct_change_target"]
    reg = RandomForestRegressor(n_estimators=n_estimators, max_depth=max_depth, random_state=42, n_jobs=-1)
    reg.fit(X_train, y_train_reg)
    pred_pct = reg.predict(X_test)

    current_test = test_df[current_value_col].values
    pred_reg = current_test * (1 + pred_pct / 100)          # reconstructed absolute prediction
    y_test_reg = test_df[reg_target_col].values               # actual absolute future value
    naive_reg = current_test                                  # naive: 0% change assumed

    mae_model = mean_absolute_error(y_test_reg, pred_reg)
    rmse_model = mean_squared_error(y_test_reg, pred_reg) ** 0.5
    r2_model = r2_score(y_test_reg, pred_reg)
    mae_naive = mean_absolute_error(y_test_reg, naive_reg)
    rmse_naive = mean_squared_error(y_test_reg, naive_reg) ** 0.5

    print(f"\n{'=' * 60}\n{name.upper()} — REGRESSION (predict {reg_target_col})\n{'=' * 60}")
    print(f"  Model  : MAE={mae_model:7.2f}  RMSE={rmse_model:7.2f}  R2={r2_model:.3f}")
    print(f"  Naive  : MAE={mae_naive:7.2f}  RMSE={rmse_naive:7.2f}   (persistence: predicts no change)")
    print(f"  Model reduces MAE vs. naive by {(1 - mae_model / mae_naive) * 100:.1f}%")

    # ---- Classification: predict direction (UP/DOWN/STABLE) ----
    y_train_cls, y_test_cls = train_df[class_target_col], test_df[class_target_col]
    clf = RandomForestClassifier(
        n_estimators=n_estimators, max_depth=max_depth, random_state=42, n_jobs=-1, class_weight="balanced"
    )
    clf.fit(X_train, y_train_cls)
    pred_cls = clf.predict(X_test)

    baseline = DummyClassifier(strategy="most_frequent")
    baseline.fit(X_train, y_train_cls)
    pred_baseline = baseline.predict(X_test)

    print(f"\n{name.upper()} — CLASSIFICATION (predict {class_target_col})")
    print(classification_report(y_test_cls, pred_cls, zero_division=0))
    print(f"  Model accuracy            : {accuracy_score(y_test_cls, pred_cls):.3f}")
    print(f"  Majority-class baseline   : {accuracy_score(y_test_cls, pred_baseline):.3f}")

    importances = pd.Series(clf.feature_importances_, index=feature_cols).sort_values(ascending=False)
    print(f"\n  Feature importances (direction classifier):")
    for feat, imp in importances.items():
        print(f"    {feat:<28s} {imp:.3f}")

    joblib.dump(
        {
            "regressor": reg,  # predicts PCT CHANGE, not the absolute level — see comment above
            "classifier": clf,
            "features": feature_cols,
            "class_labels": list(clf.classes_),
            "current_value_col": current_value_col,
        },
        f"models/{name}_model.pkl",
    )

    plt.figure(figsize=(11, 4))
    plt.plot(test_df["timestamp"].values, y_test_reg, label="Actual", linewidth=1)
    plt.plot(test_df["timestamp"].values, pred_reg, label="Model prediction", linewidth=1, alpha=0.85)
    plt.plot(test_df["timestamp"].values, naive_reg, label="Naive (persistence)",
              linewidth=1, alpha=0.5, linestyle="--")
    plt.title(f"{name}: actual vs. predicted on held-out test period")
    plt.legend()
    plt.tight_layout()
    plt.savefig(f"charts/{name}_actual_vs_predicted.png", dpi=120)
    plt.close()

    # Zoomed-in window — the full test period is too dense to read daily/
    # weekly cycles in (especially hourly rideshare data), so also save the
    # most recent ~7-days'-worth of points.
    zoom_n = min(len(test_df), 168)  # ~7 days for hourly data, or the whole test set if shorter
    zoom = test_df.iloc[-zoom_n:]
    plt.figure(figsize=(11, 4))
    plt.plot(zoom["timestamp"].values, y_test_reg[-zoom_n:], label="Actual", marker="o", markersize=2, linewidth=1)
    plt.plot(zoom["timestamp"].values, pred_reg[-zoom_n:], label="Model prediction", marker="o", markersize=2, linewidth=1)
    plt.plot(zoom["timestamp"].values, naive_reg[-zoom_n:], label="Naive (persistence)",
              linewidth=1, alpha=0.6, linestyle="--")
    plt.title(f"{name}: actual vs. predicted — most recent {zoom_n} points (zoomed in)")
    plt.legend()
    plt.tight_layout()
    plt.savefig(f"charts/{name}_actual_vs_predicted_zoomed.png", dpi=120)
    plt.close()

    return {
        "mae_model": mae_model, "mae_naive": mae_naive,
        "accuracy_model": accuracy_score(y_test_cls, pred_cls),
        "accuracy_baseline": accuracy_score(y_test_cls, pred_baseline),
    }


if __name__ == "__main__":
    rideshare_df = prep_rideshare()
    cosmetics_df = prep_cosmetics()

    print(f"Rideshare dataset: {len(rideshare_df):,} rows "
          f"({rideshare_df['timestamp'].min()} to {rideshare_df['timestamp'].max()})")
    print(f"Cosmetics dataset: {len(cosmetics_df):,} rows "
          f"({cosmetics_df['timestamp'].min()} to {cosmetics_df['timestamp'].max()})")

    train_and_eval(
        rideshare_df, RIDESHARE_FEATURES, current_value_col="fare",
        reg_target_col="fare_target", class_target_col="direction_target", name="rideshare",
        n_estimators=150, max_depth=10,
    )
    train_and_eval(
        cosmetics_df, COSMETICS_FEATURES, current_value_col="effective_price",
        reg_target_col="price_target", class_target_col="direction_target", name="cosmetics",
        n_estimators=150, max_depth=6,
    )
