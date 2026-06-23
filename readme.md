# Fraud Detection System

Дипломна робота: **«Розробка програмної системи для виявлення аномальних транзакцій у задачах банківського моніторингу з використанням машинного навчання»**

## Стек технологій

| Шар | Технологія |
|-----|-----------|
| ML | Python, scikit-learn, XGBoost, pandas |
| Backend | FastAPI, SQLAlchemy, PostgreSQL |
| Frontend | React, Vite |
| Infrastructure | Docker, Docker Compose |

## Структура проекту

```
project/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application
│   │   ├── database.py      # PostgreSQL connection
│   │   ├── models.py        # ORM: User, Prediction
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── auth.py          # JWT authentication
│   │   ├── ml_service.py    # Model inference
│   │   └── routers/
│   │       ├── auth.py      # /auth/register, /auth/login
│   │       └── predict.py   # /predict, /predict/batch
│   ├── notebooks/
│   │   ├── 01_eda.ipynb         # Exploratory Data Analysis
│   │   └── 02_Model_Training.ipynb  # Model training & evaluation
│   ├── saved_models/
│   │   ├── best_fraud_model.joblib
│   │   └── scaler.joblib
│   ├── data/raw/            # creditcard.csv (не в репо)
│   ├── docker-compose.yml
│   ├── requirements.txt
│   └── .env
└── frontend/
    └── ...                  # React + Vite
```

## Швидкий старт

### 1. Клонування репозиторію

```bash
git clone <repo-url>
cd project
```

### 2. Backend

#### 2.1 PostgreSQL через Docker

```bash
cd backend
docker compose up -d
```

Перевірка:
```bash
docker ps
# має бути fraud_db зі статусом Up
```

#### 2.2 Налаштування середовища

```bash
cp .env.example .env
# відредагуй .env якщо потрібно змінити паролі
```

Вміст `.env`:
```
DATABASE_URL=postgresql://fraud_user:fraud_pass@localhost:5432/fraud_db
SECRET_KEY=super-secret-key-change-in-production-please
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
MODEL_PATH=saved_models/best_fraud_model.joblib
SCALER_PATH=saved_models/scaler.joblib
```

#### 2.3 Встановлення залежностей

```bash
pip install -r requirements.txt
```

#### 2.4 Запуск сервера

```bash
uvicorn app.main:app --reload --port 8000
```

API доступне на: `http://localhost:8000`  
Swagger документація: `http://localhost:8000/docs`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Додаток доступний на: `http://localhost:5173`

---

## API Endpoints

### Auth
| Method | Endpoint | Опис |
|--------|----------|------|
| POST | `/auth/register` | Реєстрація нового користувача |
| POST | `/auth/login` | Логін, повертає JWT токен |

### Predict
| Method | Endpoint | Опис | Auth |
|--------|----------|------|------|
| POST | `/predict/` | Перевірка однієї транзакції | ✅ |
| POST | `/predict/batch` | Перевірка CSV файлу | ✅ |
| GET | `/predict/history` | Історія запитів користувача | ✅ |

### Приклад запиту — одинична транзакція

```bash
# 1. Логін
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# 2. Predict (підстав свій токен)
curl -X POST http://localhost:8000/predict/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "V1": -1.36, "V2": -0.07, "V3": 2.54, "V4": 1.38,
    "V5": -0.34, "V6": 0.46, "V7": 0.24, "V8": 0.10,
    "V9": 0.36, "V10": 0.09, "V11": -0.55, "V12": -0.62,
    "V13": -0.99, "V14": -0.31, "V15": 1.47, "V16": -0.47,
    "V17": 0.21, "V18": 0.03, "V19": 0.40, "V20": 0.25,
    "V21": -0.02, "V22": 0.28, "V23": -0.11, "V24": 0.07,
    "V25": 0.13, "V26": -0.19, "V27": 0.13, "V28": -0.02,
    "Amount": 149.62, "Time": 0
  }'
```

Відповідь:
```json
{
  "is_fraud": false,
  "probability": 0.0234,
  "risk_level": "LOW"
}
```

---

## ML Модель

**Датасет:** [Credit Card Fraud Detection (Kaggle)](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud)  
284 807 транзакцій, 492 шахрайські (~0.17%)

**Порівняння моделей:**

| Model | ROC-AUC | PR-AUC | F1 |
|-------|---------|--------|----|
| Logistic Regression | 0.967 | 0.711 | 0.10 |
| Random Forest (tuned) | 0.950 | 0.824 | 0.83 |
| **XGBoost (tuned)** | **0.984** | **0.771** | **0.83** |

**Фінальна модель:** Random Forest (найвищий PR-AUC) або XGBoost (найвищий ROC-AUC)

---

## Зупинка сервісів

```bash
# Зупинити PostgreSQL
docker compose down

# Зупинити і видалити дані
docker compose down -v
```