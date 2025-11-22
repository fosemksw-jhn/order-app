# 커피 주문 앱 백엔드 서버

Express.js를 사용한 RESTful API 서버입니다.

## 설치

```bash
npm install
```

## 환경 변수 설정

`server` 폴더에 `.env` 파일을 생성하고 다음 변수들을 설정하세요:

**방법 1**: `ENV_EXAMPLE.txt` 파일을 복사하여 `.env` 파일로 이름 변경
```bash
# Windows PowerShell
Copy-Item ENV_EXAMPLE.txt .env

# 또는 수동으로 .env 파일 생성
```

**방법 2**: 직접 `.env` 파일을 생성하고 다음 내용을 입력:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=your_password
NODE_ENV=development
```

**중요**: 
- `DB_PASSWORD`는 PostgreSQL 설치 시 설정한 비밀번호를 입력하세요
- 비밀번호가 없는 경우 `DB_PASSWORD=` 줄을 삭제하거나 주석 처리하세요

## 데이터베이스 설정

### 1. PostgreSQL 설치 확인

PostgreSQL이 설치되어 있지 않은 경우:
- Windows: https://www.postgresql.org/download/windows/ 에서 다운로드
- 또는 Chocolatey 사용: `choco install postgresql`

### 2. 데이터베이스 자동 설정

다음 명령어를 실행하면 데이터베이스와 테이블이 자동으로 생성됩니다:

```bash
npm run setup-db
```

이 명령어는:
- 데이터베이스 생성 (없는 경우)
- 테이블 생성 (migrations 실행)
- 초기 데이터 삽입 (seeds 실행)

### 3. 수동 설정 (선택적)

PostgreSQL에 직접 접속하여 수동으로 설정할 수도 있습니다:

```bash
# PostgreSQL에 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE coffee_order_db;

# 데이터베이스 선택
\c coffee_order_db

# 마이그레이션 실행
\i migrations/001_create_tables.sql

# 시드 데이터 삽입 (선택적)
\i seeds/001_insert_initial_data.sql
```

### 4. 연결 테스트

데이터베이스 연결을 테스트하려면:

```bash
npm run test-connection
```

## 실행

### 개발 모드 (nodemon 사용)
```bash
npm run dev
```

### 프로덕션 모드
```bash
npm start
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## API 엔드포인트

### 메뉴 관련
- `GET /api/menus` - 메뉴 목록 조회 (일반 사용자용)
- `GET /api/menus/admin` - 메뉴 목록 조회 (관리자용, 재고 포함)
- `GET /api/menus/:id` - 메뉴 상세 조회
- `PATCH /api/menus/:id/stock` - 재고 수정

### 주문 관련
- `POST /api/orders` - 주문 생성
- `GET /api/orders` - 주문 목록 조회
- `GET /api/orders/:id` - 주문 상세 조회
- `PATCH /api/orders/:id/status` - 주문 상태 변경

자세한 API 문서는 `docs/PRD.md`의 5.3 섹션을 참고하세요.

## 문제 해결

### 데이터베이스 연결 오류

1. **"SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string"**
   - `.env` 파일의 `DB_PASSWORD`를 확인하세요
   - 비밀번호가 없는 경우 해당 줄을 삭제하거나 빈 문자열로 두세요

2. **"ECONNREFUSED"**
   - PostgreSQL 서비스가 실행 중인지 확인하세요
   - Windows: 서비스 관리자에서 "postgresql-x64-XX" 서비스 확인

3. **"3D000: database does not exist"**
   - `npm run setup-db`를 실행하여 데이터베이스를 생성하세요
