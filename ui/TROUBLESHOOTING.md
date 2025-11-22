# 🔧 프론트엔드 문제 해결 가이드

## 문제: 메뉴가 표시되지 않음

### 증상
- 웹사이트 접속 시 모든 메뉴가 사라짐
- 빈 화면 또는 "메뉴가 없습니다" 메시지 표시

### 원인 진단

#### 1단계: 브라우저 개발자 도구 확인

1. **브라우저에서 F12 키를 눌러 개발자 도구 열기**
2. **Console 탭 확인**
   - 빨간색 에러 메시지가 있는지 확인
   - `API_BASE_URL` 값 확인
   - `API 요청 오류` 메시지 확인

3. **Network 탭 확인**
   - 페이지 로드 후 Network 탭 새로고침
   - `/api/menus` 요청이 있는지 확인
   - 요청 상태 코드 확인:
     - ✅ 200: 성공
     - ❌ 404: API 엔드포인트를 찾을 수 없음
     - ❌ 500: 서버 오류
     - ❌ CORS 에러: CORS 설정 문제

### 해결 방법

#### 문제 1: 환경 변수 `VITE_API_BASE_URL`이 설정되지 않음

**증상:**
- Console에 `API_BASE_URL: /api` 또는 `undefined` 표시
- Network 탭에서 잘못된 URL로 요청

**해결:**
1. Render 대시보드 접속
2. Static Site 서비스 선택
3. **"Environment"** 탭 클릭
4. `VITE_API_BASE_URL` 환경 변수 확인/추가:
   ```
   Key: VITE_API_BASE_URL
   Value: https://your-api.onrender.com/api
   ```
5. **"Save Changes"** 클릭
6. 자동 재배포 대기 (약 2-3분)

---

#### 문제 2: 백엔드 API 서버가 실행되지 않음

**증상:**
- Network 탭에서 요청이 실패 (404, 500, 또는 연결 실패)
- Console에 "Failed to fetch" 또는 "Network error" 메시지

**해결:**
1. Render 대시보드에서 백엔드 Web Service 확인
2. 서비스 상태 확인:
   - ✅ "Live": 정상 실행 중
   - ❌ "Sleep": 첫 요청 시 깨어나는데 시간이 걸림 (약 30초)
   - ❌ "Failed": 서비스 오류
3. **"Logs"** 탭에서 에러 확인
4. 백엔드 서비스가 정상 실행 중인지 확인

**백엔드 URL 테스트:**
브라우저에서 직접 접속하여 확인:
```
https://your-api.onrender.com/api/menus
```
정상 응답 예시:
```json
{
  "success": true,
  "data": [...]
}
```

---

#### 문제 3: CORS 오류

**증상:**
- Console에 "CORS policy" 또는 "Access-Control-Allow-Origin" 에러
- Network 탭에서 요청이 빨간색으로 표시

**해결:**
1. 백엔드 `server/src/app.js` 확인:
   ```javascript
   app.use(cors()); // 모든 origin 허용
   ```
2. 백엔드 서버 재시작
3. 프론트엔드 재배포

---

#### 문제 4: API URL 형식 오류

**증상:**
- Console에 `API_BASE_URL`이 잘못된 형식
- 예: `https://your-api.onrender.com/api/api/menus` (중복)

**해결:**
환경 변수 `VITE_API_BASE_URL` 값 확인:
- ✅ 올바른 형식: `https://your-api.onrender.com/api`
- ❌ 잘못된 형식: `https://your-api.onrender.com/api/` (끝에 슬래시)
- ❌ 잘못된 형식: `https://your-api.onrender.com` (`/api` 누락)

---

#### 문제 5: 데이터베이스에 메뉴 데이터가 없음

**증상:**
- API 호출은 성공 (200 OK)
- 응답 데이터가 빈 배열: `{"success": true, "data": []}`

**해결:**
1. Render 대시보드에서 백엔드 서비스 선택
2. **"Shell"** 탭 클릭
3. 다음 명령어 실행:
   ```bash
   npm run setup-db
   ```
4. 데이터베이스에 메뉴 데이터가 삽입되었는지 확인

---

### 디버깅 체크리스트

배포 후 문제가 발생하면 다음을 확인하세요:

- [ ] 브라우저 개발자 도구(F12) → Console 탭 확인
- [ ] Console에 `API_BASE_URL` 값이 올바른지 확인
- [ ] Network 탭에서 `/api/menus` 요청 확인
- [ ] 요청 URL이 올바른지 확인
- [ ] 요청 상태 코드 확인 (200, 404, 500 등)
- [ ] Render 대시보드에서 환경 변수 `VITE_API_BASE_URL` 확인
- [ ] 백엔드 서비스가 실행 중인지 확인
- [ ] 백엔드 API 엔드포인트가 정상 작동하는지 확인
- [ ] 데이터베이스에 메뉴 데이터가 있는지 확인

---

### 빠른 확인 방법

#### 1. API URL 확인
브라우저 Console에서:
```javascript
console.log('API URL:', import.meta.env.VITE_API_BASE_URL);
```

#### 2. API 직접 테스트
브라우저 주소창에서:
```
https://your-api.onrender.com/api/menus
```

#### 3. 환경 변수 확인
Render 대시보드:
- Static Site → Environment → `VITE_API_BASE_URL` 확인

---

### 추가 도움말

문제가 계속되면:
1. Render Logs 탭에서 상세한 에러 메시지 확인
2. 브라우저 Console의 전체 에러 메시지 복사
3. Network 탭의 실패한 요청 상세 정보 확인
4. 위 정보를 바탕으로 문제 진단

---

## 일반적인 오류 메시지

### "Failed to fetch"
- **원인**: 네트워크 연결 실패 또는 CORS 문제
- **해결**: 백엔드 서비스 상태 확인, CORS 설정 확인

### "404 Not Found"
- **원인**: API 엔드포인트를 찾을 수 없음
- **해결**: API URL 확인, 백엔드 라우트 확인

### "500 Internal Server Error"
- **원인**: 서버 내부 오류
- **해결**: 백엔드 Logs 확인, 데이터베이스 연결 확인

### "CORS policy"
- **원인**: CORS 설정 문제
- **해결**: 백엔드에서 `cors()` 미들웨어 확인

