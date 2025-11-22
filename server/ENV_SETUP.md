# 환경 변수 설정 가이드

## .env 파일 생성

`server` 폴더에 `.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=여기에_비밀번호_입력
NODE_ENV=development
```

## PostgreSQL 비밀번호 확인 방법

PostgreSQL 설치 시 설정한 비밀번호를 입력하세요. 비밀번호를 잊어버린 경우:

1. **Windows 서비스 관리자**에서 PostgreSQL 서비스 확인
2. **pgAdmin**을 사용하여 비밀번호 재설정
3. 또는 PostgreSQL 설정 파일(`pg_hba.conf`)을 수정하여 로컬 연결을 trust 모드로 변경

## 비밀번호가 없는 경우

PostgreSQL이 비밀번호 없이 로컬 연결을 허용하도록 설정되어 있다면, `.env` 파일에서 `DB_PASSWORD` 줄을 삭제하거나 빈 값으로 두세요:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
# DB_PASSWORD=
NODE_ENV=development
```

## 데이터베이스 설정

`.env` 파일을 생성한 후 다음 명령어를 실행하세요:

```bash
npm run setup-db
```

이 명령어는 데이터베이스와 테이블을 자동으로 생성합니다.


