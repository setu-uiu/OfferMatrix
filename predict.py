"""
predict.py
==========
Loads the trained model bundles (models/*.pkl) and produces a live forecast
in the same JSON-schema shape the rule engine (pricingPredictionEngine.js)
uses, so either system can back the same API endpoint. This calls a fitted
RandomForest's .predict()/.predict_proba() — it is not a lookup table.

Fuel-hike and Eid/campaign timing are read from common.py's calendar (the
same one the model was trained against) purely from the timestamp you pass
in — you don't need to re-supply "is there a fuel hike right now" yourself.
"""

import json

import pandas as pd
import joblib

from common import add_calendar_features


def _confidence_bucket(max_proba: float) -> str:
    if max_proba >= 0.65:
        return "HIGH"
    if max_proba >= 0.45:
        return "MEDIUM"
    return "LOW"


def _recommendation(direction: str, pct_change: float) -> str:
    if direction == "PRICE_INCREASE":
        return "URGENT" if abs(pct_change) >= 10 else "BUY_NOW"
    if direction == "PRICE_DECREASE":
        return "WAIT"
    return "HOLD"


def _predict(model_path, item, category, current_price, currency, feature_row):
    bundle = joblib.load(model_path)
    reg, clf, feature_cols = bundle["regressor"], bundle["classifier"], bundle["features"]

    X = pd.DataFrame([feature_row])[feature_cols]
    pred_pct = float(reg.predict(X)[0])
    predicted_price = current_price * (1 + pred_pct / 100)

    proba = clf.predict_proba(X)[0]
    classes = clf.classes_
    direction = str(classes[proba.argmax()])
    confidence = _confidence_bucket(float(proba.max()))
    recommendation = _recommendation(direction, pred_pct)

    return {
        "item": item,
        "category": category,
        "currentPrice": current_price,
        "currency": currency,
        "directionForecast": direction,
        "recommendation": recommendation,
        "confidence": confidence,
        "predictedPctChange": round(pred_pct, 2),
        "predictedPrice": round(predicted_price, 0),
        "method": "ml_model",
        "modelClassProbabilities": {str(c): round(float(p), 3) for c, p in zip(classes, proba)},
    }


def predict_rideshare(item, current_fare, timestamp, fare_lag_24h=None, fare_lag_168h=None):
    ts = pd.Timestamp(timestamp)
    row = add_calendar_features(pd.DataFrame({"timestamp": [ts]}))
    feature_row = {
        "hour_of_day": ts.hour,
        "day_of_week": int(row["day_of_week"].iloc[0]),
        "is_weekend_bd": bool(row["is_weekend_bd"].iloc[0]),
        "days_to_nearest_eid": float(row["days_to_nearest_eid"].iloc[0]),
        "days_since_fuel_hike": float(row["days_since_fuel_hike"].iloc[0]),
        "last_fuel_hike_pct": float(row["last_fuel_hike_pct"].iloc[0]),
        "fare": current_fare,
        # If you have the actual fare from 24h/168h ago, pass it — it's a
        # real feature the model was trained on. Falling back to current
        # fare is a reasonable default when you don't have it handy.
        "fare_lag_24h": fare_lag_24h if fare_lag_24h is not None else current_fare,
        "fare_lag_168h": fare_lag_168h if fare_lag_168h is not None else current_fare,
    }
    return _predict("models/rideshare_model.pkl", item, "rideshare", current_fare, "BDT", feature_row)


def predict_cosmetics(item, current_list_price, current_discount_pct, timestamp, discount_pct_roll7=None):
    ts = pd.Timestamp(timestamp)
    row = add_calendar_features(pd.DataFrame({"timestamp": [ts]}))
    effective_price = current_list_price * (1 - current_discount_pct / 100)
    feature_row = {
        "day_of_week": int(row["day_of_week"].iloc[0]),
        "day_of_month": int(row["day_of_month"].iloc[0]),
        "is_salary_week": bool(row["is_salary_week"].iloc[0]),
        "is_mid_month": bool(row["is_mid_month"].iloc[0]),
        "days_to_nearest_eid": float(row["days_to_nearest_eid"].iloc[0]),
        "days_to_nearest_campaign": float(row["days_to_nearest_campaign"].iloc[0]),
        "list_price": current_list_price,
        "discount_pct": current_discount_pct,
        "effective_price": effective_price,
        "discount_pct_roll7": discount_pct_roll7 if discount_pct_roll7 is not None else current_discount_pct,
    }
    return _predict("models/cosmetics_model.pkl", item, "cosmetics", effective_price, "BDT", feature_row)


if __name__ == "__main__":
    # Same Test Case 1 scenario from the spec conversation (fuel hike +
    # approaching peak), now scored by the trained ML model instead of the
    # rule engine — a useful side-by-side.
    result1 = predict_rideshare(
        item="Pathao Moto — Dhanmondi 27 to Banani",
        current_fare=240,
        timestamp="2026-09-24 17:00:00",
    )
    print(json.dumps(result1, indent=2))

    result2 = predict_cosmetics(
        item="Maybelline Lash Sensational Mascara",
        current_list_price=1055,
        current_discount_pct=10.0,
        timestamp="2026-09-24",
    )
    print(json.dumps(result2, indent=2))
