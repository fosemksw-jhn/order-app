# 데이터베이스 연결 오류 해결 가이드

## 🔍 오류: `getaddrinfo ENOTFOUND`

이 오류는 `DATABASE_URL` 환경 변수가 잘못된 형식으로 설정되어 있을 때 발생합니다.

---

## ✅ 해결 방법

### 1단계: Render에서 올바른 DATABASE_URL 확인

1. **Render 대시보드** 접속
2. **PostgreSQL 데이터베이스** 서비스 선택
3. **"Connections"** 탭 클릭
4. **"Internal Database URL"** 복사 ⚠️ **중요!**

**올바른 형식 예시:**
```
postgresql://user:password@dpg-xxxxx-a.oregon-postgres.render.com:5432/database_name
```

**잘못된 형식:**
- `postgresql://user:password@postgresql://host...` (프로토콜 중복)
- `user:password@host` (프로토콜 없음)
- 호스트명에 프로토콜이 포함된 경우

---

### 2단계: 백엔드 환경 변수 수정

1. **Render 대시보드** → **백엔드 Web Service** 선택
2. **"Environment"** 탭 클릭
3. `DATABASE_URL` 환경 변수 확인/수정

**올바른 형식:**
```
postgresql://order_app_db_v2qo_user:password@dpg-d4gpcfili9vc73dp1nsg-a.oregon-postgres.render.com:5432/order_app_db_v2qo
```

**주의사항:**
- `postgresql://` 또는 `postgres://`로 시작해야 함
- `user:password@host:port/database` 형식
- 공백이나 줄바꿈이 없어야 함
- Internal Database URL 사용 (External URL 아님!)

4. **"Save Changes"** 클릭
5. 서비스 재시작 (자동으로 재배포됨)

---

### 3단계: DATABASE_URL 형식 확인

올바른 DATABASE_URL 형식:
```
postgresql://[사용자명]:[비밀번호]@[호스트]:[포트]/[데이터베이스명]
```

**예시:**
```
postgresql://order_app_db_v2qo_user:abc123xyz@dpg-d4gpcfili9vc73dp1nsg-a.oregon-postgres.render.com:5432/order_app_db_v2qo
```

**구성 요소:**
- 프로토콜: `postgresql://` 또는 `postgres://`
- 사용자명: `order_app_db_v2qo_user`
- 비밀번호: `abc123xyz` (실제 비밀번호)
- 호스트: `dpg-d4gpcfili9vc73dp1nsg-a.oregon-postgres.render.com`
- 포트: `5432` (기본값, 생략 가능)
- 데이터베이스명: `order_app_db_v2qo`

---

## 🔧 문제 진단

### 오류 메시지 분석

**오류:**
```
getaddrinfo ENOTFOUND postgresql://order_app_db_v2qo_user:b@dpg-d4gpcfili9vc73dp1nsg-a.oregon-postgres.render.com
```

**문제:**
- 호스트명이 `postgresql://order_app_db_v2qo_user:b@dpg-...`로 시작함
- 이것은 잘못된 형식입니다
- 올바른 호스트명: `dpg-d4gpcfili9vc73dp1nsg-a.oregon-postgres.render.com`

**원인:**
- DATABASE_URL에 프로토콜이 두 번 포함되어 있거나
- 잘못된 형식으로 설정되어 있음

---

## 📝 체크리스트

- [ ] Render 대시보드에서 PostgreSQL 서비스 선택
- [ ] "Connections" 탭에서 Internal Database URL 확인
- [ ] Internal Database URL 복사 (External URL 아님!)
- [ ] 백엔드 Web Service의 Environment에서 DATABASE_URL 확인
- [ ] DATABASE_URL이 `postgresql://`로 시작하는지 확인
- [ ] DATABASE_URL 형식이 올바른지 확인
- [ ] 환경 변수 저장 후 서비스 재시작
- [ ] Logs 탭에서 연결 성공 메시지 확인

---

## 🆘 여전히 문제가 있는 경우

1. **Render Logs 확인:**
   - 백엔드 서비스 → Logs 탭
   - 데이터베이스 연결 오류 메시지 확인

2. **DATABASE_URL 검증:**
   - Render에서 제공하는 Internal Database URL을 그대로 복사
   - 수동으로 수정하지 말고 복사한 값 그대로 사용

3. **서비스 재시작:**
   - 환경 변수 변경 후 자동으로 재배포됨
   - 수동으로 재시작하려면: Settings → Manual Deploy → Clear build cache & deploy

---

## 💡 팁

1. **Internal vs External URL:**
   - ✅ **Internal Database URL**: 백엔드에서 사용 (같은 네트워크 내)
   - ❌ External Database URL: 외부에서 접속할 때만 사용

2. **비밀번호 특수문자:**
   - 비밀번호에 특수문자가 있으면 URL 인코딩 필요
   - 예: `@` → `%40`, `#` → `%23`

3. **환경 변수 확인:**
   - Render 대시보드에서 환경 변수 값 확인
   - 값에 공백이나 줄바꿈이 없는지 확인

