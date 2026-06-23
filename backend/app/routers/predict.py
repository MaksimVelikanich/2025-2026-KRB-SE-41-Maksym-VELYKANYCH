from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import numpy as np
import pandas as pd
import joblib
import io

from app.database import get_db
from app import models, schemas
from app.auth import get_current_user
from app.ml_service import get_prediction, get_batch_prediction

router = APIRouter(prefix="/predict", tags=["predict"])

FEATURE_ORDER = [
    'V1','V2','V3','V4','V5','V6','V7','V8','V9','V10',
    'V11','V12','V13','V14','V15','V16','V17','V18','V19','V20',
    'V21','V22','V23','V24','V25','V26','V27','V28',
    'Amount_log', 'Hour'
]

def risk_level(prob: float) -> str:
    if prob < 0.3:  return "LOW"
    if prob < 0.7:  return "MEDIUM"
    return "HIGH"


@router.post("/", response_model=schemas.PredictResponse)
def predict_single(
    body: schemas.TransactionInput,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    prob, label = get_prediction(body)

    prediction = models.Prediction(
        user_id = current_user.id,
        type = "single",
        input_data = body.model_dump(),
        result = {"is_fraud": bool(label), "probability": round(prob, 4)}
    )
    db.add(prediction)
    db.commit()

    return schemas.PredictResponse(
        is_fraud = bool(label),
        probability = round(prob, 4),
        risk_level = risk_level(prob)
    )


@router.post("/batch", response_model=schemas.BatchPredictResponse)
def predict_batch(
    file:         UploadFile    = File(...),
    db:           Session       = Depends(get_db),
    current_user: models.User   = Depends(get_current_user)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files allowed")

    contents = file.file.read()
    df = pd.read_csv(io.BytesIO(contents))

    results, fraud_count = get_batch_prediction(df)

    prediction = models.Prediction(
        user_id = current_user.id,
        type = "batch",
        input_data = {"filename": file.filename, "row_count": len(df)},
        result = {
            "total":       len(df),
            "fraud_count": fraud_count,
            "fraud_rate":  round(fraud_count / len(df), 4)
        }
    )
    db.add(prediction)
    db.commit()

    return schemas.BatchPredictResponse(
        total = len(df),
        fraud_count = fraud_count,
        fraud_rate = round(fraud_count / len(df), 4),
        results = results
    )


@router.get("/history", response_model=list[schemas.PredictionOut])
def get_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return (
        db.query(models.Prediction)
        .filter(models.Prediction.user_id == current_user.id)
        .order_by(models.Prediction.created_at.desc())
        .limit(50)
        .all()
    )