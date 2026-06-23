from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, Any


class UserRegister(BaseModel):
    email:    EmailStr
    password: str

class UserLogin(BaseModel):
    email:    EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"

class UserOut(BaseModel):
    id:         int
    email:      str
    created_at: datetime

    class Config:
        from_attributes = True


class TransactionInput(BaseModel):
    V1:  float; V2:  float; V3:  float; V4:  float
    V5:  float; V6:  float; V7:  float; V8:  float
    V9:  float; V10: float; V11: float; V12: float
    V13: float; V14: float; V15: float; V16: float
    V17: float; V18: float; V19: float; V20: float
    V21: float; V22: float; V23: float; V24: float
    V25: float; V26: float; V27: float; V28: float
    Amount: float
    Time:   float

class PredictResponse(BaseModel):
    is_fraud:    bool
    probability: float           
    risk_level:  str            


class BatchPredictResponse(BaseModel):
    total:       int
    fraud_count: int
    fraud_rate:  float           
    results:     list[dict]     


class PredictionOut(BaseModel):
    id:         int
    type:       str
    result:     Any
    created_at: datetime

    class Config:
        from_attributes = True