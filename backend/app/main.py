from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import auth, predict

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title = "Fraud Detection API",
    description = "ML-based credit card fraud detection system",
    version = "1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173", "http://localhost:3000"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(auth.router)
app.include_router(predict.router)


@app.get("/")
def root():
    return {"status": "ok", "message": "Fraud Detection API is running"}

@app.get("/health")
def health():
    return {"status": "healthy"}