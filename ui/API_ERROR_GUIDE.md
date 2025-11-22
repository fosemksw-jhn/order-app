# API 연결 오류 해결 가이드

## 🔍 문제 진단

브라우저 콘솔에서 다음 오류가 발생하는 경우:

### 오류 1: "Failed to fetch" 또는 "NetworkError"
**원인**: API 서버에 연결할 수 없음

### 오류 2: "404 Not Found"
**원인**: API 엔드포인트를 찾을 수 없음

### 오류 3: "500 Internal Server Error"
**원인**: 서버 내부 오류

---

## ✅ 해결 방법

### 1단계: 환경 변수 확인

#### Render 대시보드에서 확인:

1. **프론트엔드 Static Site** 선택
2. **"Environment"** 탭 클릭
3. `VITE_API_BASE_URL` 환경 변수 확인

**올바른 형식:**
```
VITE_API_BASE_URL=https://your-api.onrender.com/api
```

**잘못된 형식:**
- ❌ `https://your-api.onrender.com` (끝에 `/api` 없음)
- ❌ `https://your-api.onrender.com/api/` (끝에 슬래시)
- ❌ 빈 값 또는 설정되지 않음

#### 환경 변수 수정 방법:

1. Render 대시보드 → Static Site → Environment
2. `VITE_API_BASE_URL` 수정 또는 추가
3. **"Save Changes"** 클릭
4. 자동 재배포 대기 (약 2-3분)

---

### 2단계: 백엔드 서버 상태 확인

#### Render 대시보드에서 확인:

1. **백엔드 Web Service** 선택
2. 서비스 상태 확인:
   - ✅ **"Live"**: 정상 실행 중
   - ⏸️ **"Sleep"**: 첫 요청 시 깨어나는데 시간이 걸림 (약 30초)
   - ❌ **"Failed"**: 서비스 오류

#### 백엔드 서버가 Sleep 상태인 경우:

- 첫 요청이 느릴 수 있음 (약 30초)
- Free Plan의 정상 동작
- Paid Plan으로 업그레이드하면 항상 실행 상태 유지

#### 백엔드 서버가 Failed 상태인 경우:

1. **"Logs"** 탭에서 에러 확인
2. 일반적인 원인:
   - 데이터베이스 연결 실패
   - 환경 변수 `DATABASE_URL` 미설정
   - 포트 설정 오류

---

### 3단계: API 엔드포인트 직접 테스트

브라우저 주소창에서 직접 접속하여 확인:

```
https://your-api.onrender.com/api/menus
```

**정상 응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "아메리카노",
      ...
    }
  ]
}
```

**오류 응답:**
- 404: 엔드포인트를 찾을 수 없음
- 500: 서버 내부 오류
- 연결 실패: 서버가 실행되지 않음

---

### 4단계: 브라우저 콘솔 확인

1. **F12** 키를 눌러 개발자 도구 열기
2. **Console** 탭 확인
3. 다음 정보 확인:
   - `API_BASE_URL:` 값
   - `VITE_API_BASE_URL env:` 값
   - 에러 메시지

**예상 출력:**
```
API_BASE_URL: https://your-api.onrender.com/api
VITE_API_BASE_URL env: https://your-api.onrender.com/api
DEV mode: false
```

**문제가 있는 경우:**
```
API_BASE_URL: /api
VITE_API_BASE_URL env: undefined
```

→ 환경 변수가 설정되지 않았습니다!

---

## 🔧 빠른 해결 체크리스트

- [ ] Render 대시보드에서 백엔드 서비스가 "Live" 상태인지 확인
- [ ] 프론트엔드 Static Site의 Environment에서 `VITE_API_BASE_URL` 확인
- [ ] `VITE_API_BASE_URL` 값이 `https://your-api.onrender.com/api` 형식인지 확인
- [ ] 백엔드 URL을 브라우저에서 직접 접속하여 테스트
- [ ] 브라우저 콘솔에서 `API_BASE_URL` 값 확인
- [ ] 백엔드 Logs 탭에서 에러 확인

---

## 📝 환경 변수 설정 예시

### 프론트엔드 (Static Site)

```
Key: VITE_API_BASE_URL
Value: https://coffee-order-api.onrender.com/api
```

**주의:**
- `https://`로 시작해야 함
- 끝에 `/api` 포함
- 백엔드 서비스의 실제 URL 사용

### 백엔드 (Web Service)

```
Key: NODE_ENV
Value: production

Key: PORT
Value: 10000

Key: DATABASE_URL
Value: postgresql://user:password@host:port/database
```

---

## 🆘 여전히 문제가 있는 경우

1. **브라우저 콘솔의 전체 에러 메시지 복사**
2. **Render Logs의 에러 메시지 확인**
3. **Network 탭에서 실패한 요청 확인**
4. 위 정보를 바탕으로 문제 진단

---

## 💡 추가 팁

### CORS 오류가 발생하는 경우:

백엔드 `server/src/app.js`에서 CORS 설정 확인:

```javascript
app.use(cors()); // 모든 origin 허용
```

### Free Plan Sleep 문제:

- 첫 요청은 약 30초 정도 걸릴 수 있음 (정상)
- Paid Plan으로 업그레이드하면 항상 실행 상태 유지

### 환경 변수 변경 후:

- 자동으로 재배포됨 (약 2-3분 소요)
- 재배포 완료 후 브라우저 새로고침

