# 404 오류 해결 가이드

## 🔍 문제: "API 엔드포인트를 찾을 수 없습니다"

**오류 메시지:**
```
API 엔드포인트를 찾을 수 없습니다: https://your-api.onrender.com/api/menus
```

이 오류는 **환경 변수에 실제 백엔드 URL이 아닌 예시 URL이 설정되어 있을 때** 발생합니다.

---

## ✅ 해결 방법

### 1단계: Render에서 실제 백엔드 URL 확인

1. **Render.com 대시보드** 접속
2. **백엔드 Web Service** 선택 (예: `coffee-order-api`)
3. 상단에 표시된 **URL 확인**
   - 예: `https://coffee-order-api.onrender.com`
   - 또는 `https://coffee-order-api-xxxx.onrender.com`

**⚠️ 중요:** `your-api.onrender.com`은 예시일 뿐입니다. 실제 URL을 사용해야 합니다!

---

### 2단계: 프론트엔드 환경 변수 수정

1. **Render 대시보드** → **프론트엔드 Static Site** 선택
2. **"Environment"** 탭 클릭
3. `VITE_API_BASE_URL` 환경 변수 확인/수정:

   **현재 (잘못된 값):**
   ```
   VITE_API_BASE_URL=https://your-api.onrender.com/api
   ```

   **수정 (올바른 값):**
   ```
   VITE_API_BASE_URL=https://실제-백엔드-URL.onrender.com/api
   ```

   **예시:**
   ```
   VITE_API_BASE_URL=https://coffee-order-api.onrender.com/api
   ```

4. **"Save Changes"** 클릭
5. 자동 재배포 대기 (약 2-3분)

---

### 3단계: 백엔드 서버 상태 확인

1. **Render 대시보드** → **백엔드 Web Service** 선택
2. 서비스 상태 확인:
   - ✅ **"Live"**: 정상 실행 중
   - ⏸️ **"Sleep"**: 첫 요청 시 깨어나는데 시간이 걸림
   - ❌ **"Failed"**: 서비스 오류 (Logs 확인 필요)

---

### 4단계: API 엔드포인트 직접 테스트

브라우저 주소창에서 직접 접속하여 확인:

```
https://실제-백엔드-URL.onrender.com/api/menus
```

**정상 응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "아메리카노",
      "description": "진한 에스프레소에 물을 더한 클래식 커피",
      "price": 4000,
      "image": null
    },
    ...
  ]
}
```

**404 오류가 발생하면:**
- 백엔드 서버가 실행되지 않았을 수 있음
- 백엔드 Logs 확인 필요

---

## 🔧 단계별 체크리스트

### ✅ 환경 변수 확인
- [ ] Render 대시보드에서 백엔드 실제 URL 확인
- [ ] 프론트엔드 Static Site의 Environment에서 `VITE_API_BASE_URL` 확인
- [ ] `VITE_API_BASE_URL` 값이 실제 백엔드 URL인지 확인
- [ ] URL 끝에 `/api`가 포함되어 있는지 확인

### ✅ 백엔드 서버 확인
- [ ] 백엔드 서비스가 "Live" 상태인지 확인
- [ ] 브라우저에서 백엔드 URL 직접 접속 테스트
- [ ] `/api/menus` 엔드포인트가 정상 작동하는지 확인

### ✅ 프론트엔드 확인
- [ ] 환경 변수 수정 후 재배포 완료 대기
- [ ] 브라우저 새로고침 (Ctrl + F5 또는 Cmd + Shift + R)
- [ ] 브라우저 개발자 도구(F12) → Console에서 `API_BASE_URL` 값 확인

---

## 📝 환경 변수 설정 예시

### 올바른 설정:

**프론트엔드 (Static Site):**
```
Key: VITE_API_BASE_URL
Value: https://coffee-order-api.onrender.com/api
```

**백엔드 (Web Service):**
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

### 1. 백엔드 Logs 확인
- Render 대시보드 → 백엔드 서비스 → Logs 탭
- 에러 메시지 확인

### 2. 브라우저 콘솔 확인
- F12 → Console 탭
- 전체 에러 메시지 확인
- `API_BASE_URL` 값 확인

### 3. Network 탭 확인
- F12 → Network 탭
- 페이지 새로고침
- `/api/menus` 요청 찾기
- Status 코드 및 Response 확인

---

## 💡 빠른 확인 방법

### 브라우저 주소창에서 테스트:

1. **백엔드 기본 URL 테스트:**
   ```
   https://your-actual-backend-url.onrender.com/
   ```
   → `{"message":"커피 주문 앱 API 서버","version":"1.0.0"}` 응답이 와야 함

2. **메뉴 API 테스트:**
   ```
   https://your-actual-backend-url.onrender.com/api/menus
   ```
   → 메뉴 목록 JSON 응답이 와야 함

3. **관리자 API 테스트:**
   ```
   https://your-actual-backend-url.onrender.com/api/menus/admin
   ```
   → 재고 정보 포함 메뉴 목록 JSON 응답이 와야 함

---

## ⚠️ 주의사항

1. **URL 형식:**
   - ✅ 올바름: `https://coffee-order-api.onrender.com/api`
   - ❌ 잘못됨: `https://coffee-order-api.onrender.com` (끝에 `/api` 없음)
   - ❌ 잘못됨: `https://coffee-order-api.onrender.com/api/` (끝에 슬래시)

2. **환경 변수 이름:**
   - 프론트엔드: `VITE_API_BASE_URL` (VITE_ 접두사 필수!)
   - 백엔드: `DATABASE_URL`, `PORT`, `NODE_ENV`

3. **재배포:**
   - 환경 변수 변경 후 자동으로 재배포됨 (약 2-3분)
   - 재배포 완료 후 브라우저 새로고침 필요

