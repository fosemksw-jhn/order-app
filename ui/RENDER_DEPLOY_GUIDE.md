# 🚀 Render 프론트엔드 배포 가이드

UI 폴더의 프론트엔드 코드를 Render.com에 배포하는 완전한 가이드입니다.

---

## 📝 배포 전 코드 확인

### ✅ 이미 완료된 수정사항

1. **`ui/index.html`** ✅
   - 제목: "커피 주문 앱"
   - 언어: 한국어(ko)
   - 메타 설명 추가

2. **`ui/src/utils/api.js`** ✅
   - 환경 변수 `VITE_API_BASE_URL` 사용
   - 개발/프로덕션 환경 자동 감지

### 🔍 추가 확인사항

현재 코드는 Render 배포에 준비되어 있습니다. 추가 수정이 필요하지 않습니다.

---

## 🎯 Render 배포 과정 (단계별)

### **1단계: GitHub 저장소 확인**

배포 전에 프로젝트가 GitHub에 푸시되어 있어야 합니다.

```bash
# 현재 상태 확인
git status

# 변경사항이 있다면 커밋 및 푸시
git add .
git commit -m "프론트엔드 배포 준비"
git push origin main
```

---

### **2단계: Render 대시보드 접속**

1. [Render.com](https://render.com) 접속
2. 로그인 (GitHub 계정으로 로그인 가능)
3. 대시보드에서 **"New +"** 버튼 클릭

---

### **3단계: Static Site 생성**

1. **"Static Site"** 선택
2. **"Connect GitHub"** 클릭하여 저장소 연결
   - GitHub 계정 권한 허용
   - 저장소 선택: `order-app` (또는 프로젝트 이름)
   - 저장소 연결 확인

---

### **4단계: 배포 설정 입력**

#### **기본 정보**

| 항목 | 값 |
|------|-----|
| **Name** | `coffee-order-app` (원하는 이름) |
| **Branch** | `main` (또는 기본 브랜치) |
| **Root Directory** | `ui` ⚠️ **매우 중요!** |

#### **빌드 설정**

| 항목 | 값 |
|------|-----|
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

#### **환경 변수 설정** ⚠️ **중요!**

**"Environment"** 섹션에서 다음 환경 변수를 추가하세요:

```
Key: VITE_API_BASE_URL
Value: https://your-api.onrender.com/api
```

**⚠️ 주의사항:**
- `your-api.onrender.com`을 **실제 백엔드 서비스 URL**로 변경해야 합니다
- 백엔드가 아직 배포되지 않았다면, 배포 후 URL을 확인하여 설정하세요
- 예시: `https://coffee-order-api.onrender.com/api`

**백엔드 URL 확인 방법:**
1. Render 대시보드에서 백엔드 Web Service 선택
2. 상단에 표시된 URL 확인
3. 예: `https://coffee-order-api.onrender.com`
4. 환경 변수 값: `https://coffee-order-api.onrender.com/api`

---

### **5단계: 배포 시작**

1. 모든 설정을 확인한 후 **"Create Static Site"** 버튼 클릭
2. 배포가 자동으로 시작됩니다
3. **"Logs"** 탭에서 빌드 진행 상황을 실시간으로 확인할 수 있습니다

**예상 빌드 시간:** 약 2-3분 (첫 배포)

---

### **6단계: 배포 확인**

#### **빌드 성공 확인**

1. **"Logs"** 탭에서 확인:
   - ✅ `Build successful` 메시지 확인
   - ✅ `Published` 메시지 확인
   - ❌ 에러가 있다면 에러 메시지 확인

#### **프론트엔드 접속 테스트**

1. Render가 제공하는 URL로 접속
   - 예: `https://coffee-order-app.onrender.com`
   - 또는 대시보드에서 확인 가능한 URL

2. **기능 테스트 체크리스트:**
   - [ ] 메인 페이지가 정상적으로 로드되는가?
   - [ ] 브라우저 개발자 도구(F12) → **Console** 탭에서 에러가 없는가?
   - [ ] **Network** 탭에서 API 호출이 정상적으로 이루어지는가?
   - [ ] 주문 화면(`/`)이 정상적으로 작동하는가?
   - [ ] 관리자 화면(`/admin`)이 정상적으로 작동하는가?
   - [ ] 메뉴 목록이 정상적으로 표시되는가?

---

## 🔧 환경 변수 수정 방법

배포 후 환경 변수를 수정해야 하는 경우:

1. Render 대시보드에서 Static Site 서비스 선택
2. **"Environment"** 탭 클릭
3. 기존 환경 변수 수정 또는 새로 추가
4. **"Save Changes"** 클릭
5. 자동으로 재배포됩니다 (약 2-3분 소요)

---

## 🐛 문제 해결

### **문제 1: 빌드 실패**

**증상:** Logs에 "Build failed" 메시지

**해결 방법:**
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

---

### **문제 2: API 호출 실패**

**증상:** 브라우저 콘솔에서 CORS 에러 또는 404 에러

**해결 방법:**

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

---

### **문제 3: 페이지 새로고침 시 404 에러**

**증상:** 직접 URL 접속 또는 새로고침 시 404 에러

**원인:** React Router의 클라이언트 사이드 라우팅 문제

**해결 방법:**
- Render의 Static Site는 자동으로 `index.html`로 리다이렉트하므로 일반적으로 문제 없음
- 문제가 지속되면 Render 지원팀에 문의

---

## 📋 배포 체크리스트

### 배포 전
- [ ] GitHub에 코드 푸시 완료
- [ ] 백엔드 API 서비스가 배포되어 있고 URL을 알고 있음
- [ ] 로컬에서 `npm run build`가 성공하는지 확인

### 배포 중
- [ ] Root Directory: `ui` 설정
- [ ] Build Command: `npm install && npm run build` 설정
- [ ] Publish Directory: `dist` 설정
- [ ] 환경 변수 `VITE_API_BASE_URL` 설정

### 배포 후
- [ ] 빌드가 성공적으로 완료되었는지 확인
- [ ] 프론트엔드 URL로 접속하여 페이지가 정상적으로 로드되는지 확인
- [ ] 브라우저 개발자 도구에서 에러가 없는지 확인
- [ ] API 호출이 정상적으로 작동하는지 확인
- [ ] 주문 화면이 정상적으로 작동하는지 확인
- [ ] 관리자 화면이 정상적으로 작동하는지 확인

---

## 🔄 자동 배포

기본적으로 Render는 GitHub에 푸시할 때마다 자동으로 재배포됩니다.

### 자동 배포 비활성화 (선택사항)

1. Static Site 서비스 선택
2. **"Settings"** 탭 클릭
3. **"Auto-Deploy"** 섹션에서 설정 변경

---

## 💡 유용한 팁

1. **환경 변수 변경 후**: 자동으로 재배포되므로 수동 작업 불필요
2. **빌드 시간**: 첫 빌드는 약 2-3분 소요, 이후는 더 빠름
3. **무료 플랜**: Static Site는 무료이며 항상 실행 상태 유지
4. **커스텀 도메인**: Settings → Custom Domains에서 설정 가능
5. **빌드 로그**: 문제 발생 시 Logs 탭에서 상세한 에러 메시지 확인

---

## 📚 참고 자료

- [Render Static Sites 문서](https://render.com/docs/static-sites)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)
- [React Router 배포 가이드](https://reactrouter.com/en/main/start/overview#deploying)

---

## 🎉 배포 완료!

배포가 성공적으로 완료되면 프론트엔드 애플리케이션을 전 세계 어디서나 접속할 수 있습니다!

문제가 발생하면 Render의 Logs 탭에서 에러 메시지를 확인하거나, 위의 문제 해결 섹션을 참고하세요.

