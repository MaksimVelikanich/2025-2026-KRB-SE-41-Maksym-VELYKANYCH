import numpy as np
import pandas as pd
import joblib
import os
from dotenv import load_dotenv

load_dotenv()

MODEL_PATH  = os.getenv("MODEL_PATH",  "saved_models/best_fraud_model.joblib")
SCALER_PATH = os.getenv("SCALER_PATH", "saved_models/scaler.joblib")

model  = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

FEATURE_ORDER = [
    'V1','V2','V3','V4','V5','V6','V7','V8','V9','V10',
    'V11','V12','V13','V14','V15','V16','V17','V18','V19','V20',
    'V21','V22','V23','V24','V25','V26','V27','V28',
    'Amount_log', 'Hour'
]

THRESHOLD = 0.5


def _prepare_features(amount: float, time: float, v_features: dict) -> np.ndarray:
    amount_log = np.log1p(amount)
    hour = (time / 3600) % 24

    row = {**v_features, 'Amount_log': amount_log, 'Hour': hour}
    df  = pd.DataFrame([row])[FEATURE_ORDER]
    return scaler.transform(df)


def get_prediction(transaction) -> tuple[float, int]:
    """Single transaction → (probability, label)."""
    v_features = {
        f'V{i}': getattr(transaction, f'V{i}') for i in range(1, 29)
    }
    X = _prepare_features(transaction.Amount, transaction.Time, v_features)
    prob = float(model.predict_proba(X)[0][1])
    label = int(prob >= THRESHOLD)
    return prob, label


def get_batch_prediction(df: pd.DataFrame) -> tuple[list[dict], int]:
    """DataFrame → (list of results, fraud_count)."""
    df = df.copy()
    df['Amount_log'] = np.log1p(df['Amount'])
    df['Hour'] = (df['Time'] / 3600) % 24

    missing = set(FEATURE_ORDER) - set(df.columns)
    if missing:
        raise ValueError(f"Missing columns in CSV: {missing}")

    X = scaler.transform(df[FEATURE_ORDER])
    probas = model.predict_proba(X)[:, 1]
    labels = (probas >= THRESHOLD).astype(int)

    results = [
        {
            "row": i,
            "is_fraud": bool(labels[i]),
            "probability":round(float(probas[i]), 4)
        }
        for i in range(len(df))
    ]

    return results, int(labels.sum())