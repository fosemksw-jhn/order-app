# Render 프론트엔드 배포 가이드

이 문서는 UI 폴더의 프론트엔드 코드를 Render.com에 배포하는 방법을 설명합니다.

## 📋 배포 전 확인사항

### 1. 코드 수정 완료 확인
- [x] `ui/index.html` - 제목 및 메타 정보 수정 완료
- [x] `ui/src/utils/api.js` - 환경 변수 설정 확인 완료
- [x] `ui/.env.example` - 환경 변수 예시 파일 생성 완료

### 2. GitHub 저장소 확인
- [ ] 프로젝트가 GitHub에 푸시되어 있는지 확인
- [ ] `ui` 폴더가 루트에 있는지 확인

---

## 🚀 Render 배포 과정

### 1단계: Render 대시보드 접속

1. [Render.com](https://render.com)에 로그인
2. 대시보드에서 **"New +"** 버튼 클릭

### 2단계: Static Site 생성

1. **"Static Site"** 선택
2. GitHub 저장소 연결
   - GitHub 계정 연결 (처음인 경우)
   - 저장소 선택: `order-app` (또는 프로젝트 이름)

### 3단계: 배포 설정

다음 설정을 입력하세요:

#### 기본 설정
- **Name**: `coffee-order-app` (원하는 이름)
- **Branch**: `main` (또는 기본 브랜치)
- **Root Directory**: `ui` ⚠️ **중요!**

#### 빌드 설정
- **Build Command**: 
  ```bash
  npm install && npm run build
  ```
- **Publish Directory**: `dist`

#### 환경 변수 설정
**"Environment"** 섹션에서 다음 환경 변수 추가:

```
VITE_API_BASE_URL=https://your-api.onrender.com/api
```

**⚠️ 중요**: 
- `your-api.onrender.com`을 실제 백엔드 서비스 URL로 변경하세요
- 백엔드 서비스가 아직 배포되지 않았다면, 배포 후 URL을 확인하여 설정하세요
- 예시: `https://coffee-order-api.onrender.com/api`

### 4단계: 배포 시작

1. **"Create Static Site"** 버튼 클릭
2. 배포가 자동으로 시작됩니다
3. **"Logs"** 탭에서 빌드 진행 상황 확인

### 5단계: 배포 확인

배포 완료 후:

1. **"Logs"** 탭에서 빌드 성공 여부 확인
   - ✅ "Build successful" 메시지 확인
   - ❌ 에러가 있다면 에러 메시지 확인

2. 프론트엔드 URL로 접속
   - Render가 제공하는 URL: `https://coffee-order-app.onrender.com`
   - 또는 대시보드에서 확인 가능한 URL

3. 기능 테스트
   - [ ] 메인 페이지 로드 확인
   - [ ] 브라우저 개발자 도구(F12) → Console 탭에서 에러 확인
   - [ ] Network 탭에서 API 호출 확인
   - [ ] 주문 화면 동작 확인
   - [ ] 관리자 화면(`/admin`) 동작 확인

---

## 🔧 환경 변수 설정 방법

### Render 대시보드에서 설정

1. Static Site 서비스 선택
2. **"Environment"** 탭 클릭
3. **"Add Environment Variable"** 클릭
4. 다음 입력:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-api.onrender.com/api`
5. **"Save Changes"** 클릭
6. 자동으로 재배포됩니다

### 환경 변수 값 확인

백엔드 API 서비스 URL 확인 방법:
1. Render 대시보드에서 백엔드 Web Service 선택
2. 상단에 표시된 URL 확인
3. 예: `https://coffee-order-api.onrender.com`
4. 환경 변수 값: `https://coffee-order-api.onrender.com/api`

---

## 🐛 문제 해결

### 빌드 실패

**증상**: Build failed

**해결 방법**:
1. **Root Directory 확인**
   - `ui`로 설정되어 있는지 확인
   
2. **Build Command 확인**
   - `npm install && npm run build`로 설정되어 있는지 확인
   
3. **Logs 확인**
   - Logs 탭에서 구체적인 에러 메시지 확인
   - Node 버전 문제일 수 있음

4. **로컬에서 빌드 테스트**
   ```bash
   cd ui
   npm install
   npm run build
   ```
   - 로컬에서 빌드가 성공하는지 확인

### API 호출 실패

**증상**: 브라우저 콘솔에서 CORS 에러 또는 404 에러

**해결 방법**:
1. **환경 변수 확인**
   - `VITE_API_BASE_URL`이 올바르게 설정되었는지 확인
   - 백엔드 URL이 정확한지 확인
   - URL 끝에 `/api`가 포함되어 있는지 확인

2. **백엔드 서비스 확인**
   - 백엔드 서비스가 실행 중인지 확인
   - 백엔드 API 엔드포인트가 정상 작동하는지 확인
   - 예: `https://your-api.onrender.com/api/menus`

3. **CORS 설정 확인**
   - 백엔드에서 CORS가 올바르게 설정되어 있는지 확인
   - `server/src/app.js`에서 `app.use(cors())` 확인

### 페이지 새로고침 시 404 에러

**증상**: 직접 URL 접속 또는 새로고침 시 404 에러

**원인**: React Router의 클라이언트 사이드 라우팅 문제

**해결 방법**:
1. `vite.config.js`에 base 설정 추가 (필요시)
2. Render의 Static Site는 자동으로 `index.html`로 리다이렉트하므로 일반적으로 문제 없음
3. 문제가 지속되면 Render 지원팀에 문의

---

## 📝 배포 후 체크리스트

- [ ] 빌드가 성공적으로 완료되었는지 확인
- [ ] 환경 변수 `VITE_API_BASE_URL`이 올바르게 설정되었는지 확인
- [ ] 프론트엔드 URL로 접속하여 페이지가 정상적으로 로드되는지 확인
- [ ] 브라우저 개발자 도구에서 에러가 없는지 확인
- [ ] API 호출이 정상적으로 작동하는지 확인 (Network 탭)
- [ ] 주문 화면(`/`)이 정상적으로 작동하는지 확인
- [ ] 관리자 화면(`/admin`)이 정상적으로 작동하는지 확인
- [ ] 메뉴 목록이 정상적으로 표시되는지 확인
- [ ] 주문 기능이 정상적으로 작동하는지 확인

---

## 🔄 자동 배포 설정

기본적으로 Render는 GitHub에 푸시할 때마다 자동으로 재배포됩니다.

### 자동 배포 비활성화 (선택사항)

1. Static Site 서비스 선택
2. **"Settings"** 탭 클릭
3. **"Auto-Deploy"** 섹션에서 설정 변경

---

## 📚 참고 자료

- [Render Static Sites 문서](https://render.com/docs/static-sites)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)
- [React Router 배포 가이드](https://reactrouter.com/en/main/start/overview#deploying)

---

## 💡 팁

1. **환경 변수 변경 후**: 자동으로 재배포되므로 수동 작업 불필요
2. **빌드 시간**: 첫 빌드는 약 2-3분 소요, 이후는 더 빠름
3. **무료 플랜**: Static Site는 무료이며 항상 실행 상태 유지
4. **커스텀 도메인**: Settings → Custom Domains에서 설정 가능

