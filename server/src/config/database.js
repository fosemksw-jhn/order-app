import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Render.com의 DATABASE_URL 지원
let poolConfig;

if (process.env.DATABASE_URL) {
  // DATABASE_URL 검증 및 수정
  let databaseUrl = process.env.DATABASE_URL.trim();
  
  // DATABASE_URL이 올바른 형식인지 확인
  if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
    console.error('❌ DATABASE_URL 형식 오류: postgresql:// 또는 postgres://로 시작해야 합니다.');
    console.error('현재 DATABASE_URL:', databaseUrl.substring(0, 50) + '...');
    throw new Error('DATABASE_URL 형식이 올바르지 않습니다.');
  }
  
  // URL 파싱하여 검증
  try {
    const url = new URL(databaseUrl);
    console.log('✅ DATABASE_URL 파싱 성공');
    console.log('호스트:', url.hostname);
    console.log('포트:', url.port || '5432 (기본값)');
    console.log('데이터베이스:', url.pathname.slice(1));
  } catch (urlError) {
    console.error('❌ DATABASE_URL 파싱 실패:', urlError.message);
    console.error('DATABASE_URL:', databaseUrl.substring(0, 100) + '...');
    throw new Error(`DATABASE_URL 파싱 오류: ${urlError.message}`);
  }
  
  // Render.com에서 제공하는 DATABASE_URL 사용
  poolConfig = {
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
  
  console.log('데이터베이스 연결 설정 완료 (DATABASE_URL 사용)');
} else {
  // 개별 환경 변수 사용 (로컬 개발)
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'coffee_order_db',
    user: process.env.DB_USER || 'postgres',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };

  // 비밀번호가 설정되어 있는 경우에만 추가
  if (process.env.DB_PASSWORD) {
    poolConfig.password = process.env.DB_PASSWORD;
  }
}

const pool = new Pool(poolConfig);

// 연결 테스트
pool.on('connect', () => {
  console.log('데이터베이스에 연결되었습니다.');
});

pool.on('error', (err) => {
  console.error('❌ 데이터베이스 연결 오류:', err.message);
  console.error('오류 코드:', err.code);
  if (err.code === 'ENOTFOUND') {
    console.error('⚠️ DNS 조회 실패 - DATABASE_URL의 호스트명을 확인하세요.');
    console.error('DATABASE_URL 형식: postgresql://user:password@host:port/database');
  }
});

// 쿼리 실행 헬퍼 함수
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('쿼리 실행:', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('쿼리 오류:', error);
    throw error;
  }
};

// 트랜잭션 헬퍼 함수
export const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export default pool;

