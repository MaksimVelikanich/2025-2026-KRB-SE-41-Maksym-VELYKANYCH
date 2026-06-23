#!/bin/bash
# =============================================================
# Fraud Detection API — Test Suite
# Запуск: bash test_api.sh
# Передумови: uvicorn запущений на порту 8000
# =============================================================

BASE="http://localhost:8000"
PASS=0
FAIL=0

green='\033[0;32m'
red='\033[0;31m'
nc='\033[0m'

check() {
  local desc=$1 expected=$2 actual=$3
  if echo "$actual" | grep -q "$expected"; then
    echo -e "${green}✅ PASS${nc} — $desc"
    ((PASS++))
  else
    echo -e "${red}❌ FAIL${nc} — $desc"
    echo "   Expected to contain: $expected"
    echo "   Got: $actual"
    ((FAIL++))
  fi
}

echo ""
echo "================================================"
echo " Fraud Detection API — Test Suite"
echo "================================================"
echo ""

# ── 1. Health check ───────────────────────────────
echo "[ Health ]"
R=$(curl -s "$BASE/health")
check "GET /health returns healthy" "healthy" "$R"
echo ""

# ── 2. Root ───────────────────────────────────────
echo "[ Root ]"
R=$(curl -s "$BASE/")
check "GET / returns status ok" "ok" "$R"
echo ""

# ── 3. Auth: register ─────────────────────────────
echo "[ Auth ]"
R=$(curl -s -X POST "$BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"testpass123"}')
check "POST /auth/register creates user" "testuser@example.com" "$R"

# Повторна реєстрація — має бути помилка
R=$(curl -s -X POST "$BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"testpass123"}')
check "POST /auth/register duplicate returns error" "already registered" "$R"

# ── 4. Auth: login ────────────────────────────────
R=$(curl -s -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"testpass123"}')
check "POST /auth/login returns token" "access_token" "$R"

TOKEN=$(echo $R | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)

# Невірний пароль
R=$(curl -s -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"wrongpass"}')
check "POST /auth/login wrong password returns 401" "Invalid email or password" "$R"
echo ""

# ── 5. Predict: без токена ─────────────────────────
echo "[ Predict — Auth Guard ]"
R=$(curl -s -X POST "$BASE/predict/" \
  -H "Content-Type: application/json" \
  -d '{"V1":0,"V2":0,"V3":0,"V4":0,"V5":0,"V6":0,"V7":0,"V8":0,"V9":0,"V10":0,"V11":0,"V12":0,"V13":0,"V14":0,"V15":0,"V16":0,"V17":0,"V18":0,"V19":0,"V20":0,"V21":0,"V22":0,"V23":0,"V24":0,"V25":0,"V26":0,"V27":0,"V28":0,"Amount":100,"Time":3600}')
check "POST /predict/ without token returns 401" "Not authenticated" "$R"
echo ""

# ── 6. Predict: single з токеном ──────────────────
echo "[ Predict — Single ]"
if [ -n "$TOKEN" ]; then
  # Нормальна транзакція (нульові V-фічі, невелика сума)
  R=$(curl -s -X POST "$BASE/predict/" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "V1":0,"V2":0,"V3":0,"V4":0,"V5":0,"V6":0,"V7":0,"V8":0,
      "V9":0,"V10":0,"V11":0,"V12":0,"V13":0,"V14":0,"V15":0,"V16":0,
      "V17":0,"V18":0,"V19":0,"V20":0,"V21":0,"V22":0,"V23":0,"V24":0,
      "V25":0,"V26":0,"V27":0,"V28":0,
      "Amount":10.0,"Time":36000
    }')
  check "POST /predict/ returns is_fraud field" "is_fraud" "$R"
  check "POST /predict/ returns probability field" "probability" "$R"
  check "POST /predict/ returns risk_level field" "risk_level" "$R"

  # Підозріла транзакція (екстремальні значення)
  R=$(curl -s -X POST "$BASE/predict/" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "V1":-10,"V2":5,"V3":-12,"V4":8,"V5":-3,"V6":2,"V7":-9,"V8":1,
      "V9":-4,"V10":-10,"V11":3,"V12":-12,"V13":1,"V14":-15,"V15":0,"V16":-8,
      "V17":-13,"V18":-3,"V19":1,"V20":0,"V21":0.5,"V22":-0.5,"V23":0,"V24":0,
      "V25":0,"V26":0,"V27":0.5,"V28":0.2,
      "Amount":1.0,"Time":7200
    }')
  check "POST /predict/ suspicious transaction returns response" "is_fraud" "$R"
  echo "   Suspicious result: $R"
else
  echo -e "${red}❌ SKIP${nc} — No token available, skipping predict tests"
  ((FAIL+=3))
fi
echo ""

# ── 7. History ────────────────────────────────────
echo "[ History ]"
if [ -n "$TOKEN" ]; then
  R=$(curl -s "$BASE/predict/history" \
    -H "Authorization: Bearer $TOKEN")
  check "GET /predict/history returns array" "\[" "$R"
  check "GET /predict/history contains predictions" "is_fraud" "$R"
else
  echo -e "${red}❌ SKIP${nc} — No token"
  ((FAIL+=2))
fi
echo ""

# ── 8. Docs ───────────────────────────────────────
echo "[ Swagger Docs ]"
R=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/docs")
check "GET /docs returns 200" "200" "$R"
echo ""

# ── Summary ───────────────────────────────────────
echo "================================================"
echo " Results: ${PASS} passed, ${FAIL} failed"
echo "================================================"
echo ""