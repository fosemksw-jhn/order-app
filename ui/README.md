# 커피 주문 앱 프런트엔드

React + Vite를 사용한 커피 주문 앱 프런트엔드입니다.

## 설치

```bash
npm install
```

## 환경 변수 설정

`ui` 폴더에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
VITE_API_BASE_URL=메메http://localhost:3000/api
```

**참고**: 백엔드 서버가 다른 포트에서 실행되는 경우 URL을 변경하세요.

## 실행

### 개발 모드
```bash
npm run dev
```

프런트엔드는 기본적으로 `http://localhost:5173`에서 실행됩니다.

### 프로덕션 빌드
```bash
npm run build
```

## 백엔드 서버 실행

프런트엔드를 사용하기 전에 백엔드 서버가 실행 중이어야 합니다.

```bash
cd ../server
npm run dev
```

백엔드 서버는 `http://localhost:3000`에서 실행됩니다.

## 주요 기능

- 메뉴 목록 조회 (API 연동)
- 장바구니 기능
- 주문 생성 (API 연동)
- 관리자 대시보드
- 재고 관리
- 주문 상태 관리
