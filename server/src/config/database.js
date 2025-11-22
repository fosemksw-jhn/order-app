import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// 데이터베이스 연결 풀 생성
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'coffee_order_db',
  user: process.env.DB_USER || 'postgres',
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// 비밀번호가 설정되어 있는 경우에만 추가
if (process.env.DB_PASSWORD) {
  poolConfig.password = process.env.DB_PASSWORD;
}

const pool = new Pool(poolConfig);

// 연결 테스트
pool.on('connect', () => {
  console.log('데이터베이스에 연결되었습니다.');
});

pool.on('error', (err) => {
  console.error('데이터베이스 연결 오류:', err);
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

