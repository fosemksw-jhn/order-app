# Render.com 배포 가이드

이 문서는 커피 주문 앱을 Render.com에 배포하는 방법을 설명합니다.

## 배포 순서

1. **PostgreSQL 데이터베이스 생성**
2. **백엔드 서버 배포**
3. **프런트엔드 배포**

---

## 1단계: PostgreSQL 데이터베이스 생성

### 1.1 Render 대시보드에서 데이터베이스 생성

1. [Render.com](https://render.com)에 로그인
2. **"New +"** 버튼 클릭 → **"PostgreSQL"** 선택
3. 설정:
   - **Name**: `coffee-order-db` (원하는 이름)
   - **Database**: `coffee_order_db`
   - **User**: `coffee_order_user` (자동 생성됨)
   - **Region**: 가장 가까운 지역 선택
   - **PostgreSQL Version**: 최신 버전
   - **Plan**: Free (또는 원하는 플랜)
4. **"Create Database"** 클릭

### 1.2 데이터베이스 연결 정보 확인

생성 후 **"Connections"** 탭에서 다음 정보를 확인:
- **Internal Database URL**: 백엔드에서 사용 (이것을 복사하세요!)

**중요**: Render의 PostgreSQL은 내부 네트워크를 통해 연결해야 하므로 **Internal Database URL**을 사용해야 합니다.

---

## 2단계: 백엔드 서버 배포

### 2.1 GitHub 저장소 준비

1. 프로젝트를 GitHub에 푸시 (아직 안 했다면)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. `server` 폴더가 루트에 있는지 확인

### 2.2 Render에서 Web Service 생성

1. Render 대시보드에서 **"New +"** → **"Web Service"** 선택
2. GitHub 저장소 연결
3. 설정:
   - **Name**: `coffee-order-api` (원하는 이름)
   - **Region**: 데이터베이스와 같은 지역 선택
   - **Branch**: `main` (또는 기본 브랜치)
   - **Root Directory**: `server` ⚠️ **중요!**
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (또는 원하는 플랜)

### 2.3 환경 변수 설정

**"Environment"** 섹션에서 다음 환경 변수 추가:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=<PostgreSQL의 Internal Database URL>
```

**DATABASE_URL 설정 방법**:
1. Render 대시보드에서 PostgreSQL 서비스로 이동
2. **"Connections"** 탭 클릭
3. **"Internal Database URL"** 복사
4. 백엔드 서비스의 환경 변수에 `DATABASE_URL`로 붙여넣기

### 2.4 데이터베이스 초기화

배포 후 **"Shell"** 탭에서 다음 명령어 실행:

```bash
npm run setup-db
```

또는 배포 시 자동으로 실행되도록 **"Build Command"**를 수정:

```bash
npm install && npm run setup-db
```

**주의**: Free Plan에서는 첫 배포 후 수동으로 실행하는 것이 더 안전합니다.

### 2.5 배포 확인

배포 완료 후:
- **"Logs"** 탭에서 에러 확인
- API 엔드포인트 테스트: `https://your-api.onrender.com/api/menus`
- 응답이 정상적으로 오는지 확인

---

## 3단계: 프런트엔드 배포

### 3.1 Static Site 생성

1. Render 대시보드에서 **"New +"** → **"Static Site"** 선택
2. GitHub 저장소 연결
3. 설정:
   - **Name**: `coffee-order-app` (원하는 이름)
   - **Branch**: `main` (또는 기본 브랜치)
   - **Root Directory**: `ui` ⚠️ **중요!**
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### 3.2 환경 변수 설정

**"Environment"** 섹션에서:

```
VITE_API_BASE_URL=https://your-api.onrender.com/api
```

**중요**: 
- `your-api.onrender.com`을 실제 백엔드 서비스 URL로 변경하세요
- 백엔드 서비스의 URL은 Render 대시보드에서 확인할 수 있습니다
- 예: `https://coffee-order-api.onrender.com/api`

### 3.3 배포 확인

배포 완료 후:
- 프런트엔드 URL로 접속하여 동작 확인
- 브라우저 개발자 도구(F12) → Network 탭에서 API 호출 확인
- 콘솔에서 에러 확인

---

## 배포 후 확인 사항

### ✅ 데이터베이스
- [ ] 데이터베이스가 생성되었는지 확인
- [ ] Shell에서 `npm run setup-db` 실행하여 테이블 생성
- [ ] 초기 데이터가 삽입되었는지 확인

### ✅ 백엔드
- [ ] API 서버가 정상적으로 시작되었는지 확인 (Logs 탭)
- [ ] 환경 변수 `DATABASE_URL`이 올바르게 설정되었는지 확인
- [ ] 데이터베이스 연결이 성공했는지 확인 (Logs에서 확인)
- [ ] API 엔드포인트가 정상 작동하는지 확인
  - `https://your-api.onrender.com/api/menus`
  - `https://your-api.onrender.com/api/orders`

### ✅ 프런트엔드
- [ ] 빌드가 성공했는지 확인 (Logs 탭)
- [ ] 환경 변수 `VITE_API_BASE_URL`이 올바르게 설정되었는지 확인
- [ ] 브라우저에서 API 호출이 정상 작동하는지 확인 (개발자 도구)
- [ ] 모든 페이지가 정상적으로 로드되는지 확인
  - 주문 화면: `/`
  - 관리자 화면: `/admin`

---

## 문제 해결

### 데이터베이스 연결 오류

**증상**: `connection refused` 또는 `ECONNREFUSED`

**해결 방법**:
1. **Internal Database URL 사용 확인**
   - Render의 PostgreSQL은 내부 네트워크를 통해 연결해야 합니다
   - `Internal Database URL`을 사용하세요 (External URL이 아님!)
   - 환경 변수 이름은 `DATABASE_URL`이어야 합니다

2. **SSL 설정 확인**
   - 코드에서 이미 `ssl: { rejectUnauthorized: false }`로 설정되어 있습니다
   - 추가 설정이 필요 없습니다

3. **환경 변수 확인**
   - Render 대시보드 → 서비스 → Environment 탭
   - `DATABASE_URL`이 올바르게 설정되었는지 확인
   - 값에 공백이나 따옴표가 없는지 확인

### API 호출 오류 (CORS)

**증상**: 브라우저 콘솔에서 CORS 에러

**해결 방법**:
백엔드의 `cors` 설정 확인:

```javascript
// server/src/app.js
app.use(cors()); // 이미 모든 origin 허용으로 설정됨
```

프로덕션에서 특정 도메인만 허용하려면:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend.onrender.com',
    'http://localhost:5173' // 개발용
  ]
}));
```

### 빌드 오류

**증상**: Build failed

**해결 방법**:
1. **Node 버전 확인**
   - Render는 기본적으로 Node 18을 사용
   - 필요시 `server/.nvmrc` 파일 생성:
     ```
     18
     ```

2. **의존성 설치 오류**
   - `package.json`의 의존성 확인
   - `package-lock.json`이 있는지 확인
   - Build Command에 `npm ci` 사용 (더 안정적):
     ```
     npm ci && npm run setup-db
     ```

3. **Root Directory 확인**
   - 백엔드: `server`
   - 프런트엔드: `ui`

### Free Plan Sleep 문제

**증상**: 첫 요청이 느림

**원인**: Free Plan은 15분 비활성 시 sleep 상태가 됩니다.

**해결 방법**:
- 첫 요청은 약 30초 정도 걸릴 수 있습니다 (정상)
- Paid Plan으로 업그레이드하면 항상 실행 상태 유지

---

## 추가 설정 (선택사항)

### 자동 배포

GitHub에 푸시할 때마다 자동으로 배포:
- Render 대시보드에서 서비스 선택
- **"Settings"** → **"Auto-Deploy"** 활성화
- 기본적으로 활성화되어 있습니다

### 커스텀 도메인

1. Render 대시보드에서 서비스 선택
2. **"Settings"** → **"Custom Domains"**
3. 도메인 추가 및 DNS 설정

### 환경별 설정

프로덕션과 개발 환경 구분:

**프런트엔드** (`ui/src/utils/api.js`):
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? 'http://localhost:3000/api' : 'https://your-api.onrender.com/api');
```

---

## 비용

### Free Plan
- **Web Service**: 
  - 15분 비활성 시 sleep
  - 512MB RAM
  - 무료
  
- **PostgreSQL**: 
  - 90일 후 삭제 가능 (경고 메일 발송)
  - 1GB 저장공간
  - 무료

- **Static Site**: 
  - 항상 실행
  - 무료

### Paid Plan
- **Web Service**: $7/월부터
  - 항상 실행
  - 더 많은 RAM
  - 백업 포함

- **PostgreSQL**: $7/월부터
  - 백업 포함
  - 더 많은 저장공간

---

## 배포 체크리스트

배포 전:
- [ ] GitHub에 코드 푸시 완료
- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] 민감한 정보가 코드에 하드코딩되지 않았는지 확인

배포 중:
- [ ] PostgreSQL 데이터베이스 생성
- [ ] 백엔드 Web Service 생성 및 환경 변수 설정
- [ ] 프런트엔드 Static Site 생성 및 환경 변수 설정
- [ ] 데이터베이스 초기화 (`npm run setup-db`)

배포 후:
- [ ] 백엔드 API 테스트
- [ ] 프런트엔드 접속 테스트
- [ ] 주문 기능 테스트
- [ ] 관리자 화면 테스트

---

## 참고 링크

- [Render.com 문서](https://render.com/docs)
- [PostgreSQL on Render](https://render.com/docs/databases)
- [Node.js on Render](https://render.com/docs/node)
- [Static Sites on Render](https://render.com/docs/static-sites)

---

## 빠른 참조

### 환경 변수 요약

**백엔드**:
```
NODE_ENV=production
PORT=10000
DATABASE_URL=<PostgreSQL Internal Database URL>
```

**프런트엔드**:
```
VITE_API_BASE_URL=https://your-api.onrender.com/api
```

### 주요 명령어

```bash
# 데이터베이스 초기화 (Render Shell에서)
npm run setup-db

# 로그 확인
# Render 대시보드 → 서비스 → Logs 탭
```
