import pg from 'pg';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Render.com의 DATABASE_URL 지원
let adminPoolConfig, appPoolConfig;

if (process.env.DATABASE_URL) {
  // Render.com에서 제공하는 DATABASE_URL 사용
  // DATABASE_URL에서 데이터베이스 이름 추출
  const dbUrl = new URL(process.env.DATABASE_URL);
  const dbName = dbUrl.pathname.slice(1); // 첫 번째 '/' 제거
  
  // 관리자 연결 (postgres 데이터베이스에 연결)
  const adminUrl = process.env.DATABASE_URL.replace(`/${dbName}`, '/postgres');
  adminPoolConfig = {
    connectionString: adminUrl,
    ssl: { rejectUnauthorized: false },
  };
  
  // 애플리케이션 연결
  appPoolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  };
} else {
  // 개별 환경 변수 사용 (로컬 개발)
  adminPoolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    database: 'postgres',
  };

  if (process.env.DB_PASSWORD) {
    adminPoolConfig.password = process.env.DB_PASSWORD;
  }

  appPoolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    database: process.env.DB_NAME || 'coffee_order_db',
  };

  if (process.env.DB_PASSWORD) {
    appPoolConfig.password = process.env.DB_PASSWORD;
  }
}

const adminPool = new Pool(adminPoolConfig);
const appPool = new Pool(appPoolConfig);

async function setupDatabase() {
  const client = await adminPool.connect();
  
  try {
    console.log('데이터베이스 설정을 시작합니다...');
    
    // 1. 데이터베이스 존재 여부 확인 및 생성
    // Render.com에서는 데이터베이스가 이미 생성되어 있으므로 스킵
    let dbName;
    if (process.env.DATABASE_URL) {
      const dbUrl = new URL(process.env.DATABASE_URL);
      dbName = dbUrl.pathname.slice(1);
      console.log(`Render.com 데이터베이스 사용: ${dbName}`);
      console.log('데이터베이스는 이미 생성되어 있습니다.');
    } else {
      dbName = process.env.DB_NAME || 'coffee_order_db';
      const checkDbResult = await client.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [dbName]
      );
      
      if (checkDbResult.rows.length === 0) {
        console.log(`데이터베이스 '${dbName}' 생성 중...`);
        await client.query(`CREATE DATABASE ${dbName}`);
        console.log(`데이터베이스 '${dbName}' 생성 완료!`);
      } else {
        console.log(`데이터베이스 '${dbName}'가 이미 존재합니다.`);
      }
    }
    
    client.release();
    
    // 2. 애플리케이션 데이터베이스에 연결하여 테이블 생성
    const appClient = await appPool.connect();
    
    try {
      // 마이그레이션 파일 읽기 및 실행
      console.log('테이블 생성 중...');
      const migrationPath = join(__dirname, '../migrations/001_create_tables.sql');
      const migrationSQL = readFileSync(migrationPath, 'utf8');
      
      await appClient.query(migrationSQL);
      console.log('테이블 생성 완료!');
      
      // 시드 데이터 삽입
      console.log('초기 데이터 삽입 중...');
      const seedPath = join(__dirname, '../seeds/001_insert_initial_data.sql');
      const seedSQL = readFileSync(seedPath, 'utf8');
      
      await appClient.query(seedSQL);
      console.log('초기 데이터 삽입 완료!');
      
      // 연결 테스트
      const testResult = await appClient.query('SELECT COUNT(*) FROM menus');
      console.log(`메뉴 개수: ${testResult.rows[0].count}개`);
      
      console.log('\n✅ 데이터베이스 설정이 완료되었습니다!');
      
    } catch (error) {
      if (error.code === '42P07') {
        // 테이블이 이미 존재하는 경우
        console.log('테이블이 이미 존재합니다. 초기 데이터만 삽입합니다...');
        try {
          const seedPath = join(__dirname, '../seeds/001_insert_initial_data.sql');
          const seedSQL = readFileSync(seedPath, 'utf8');
          await appClient.query(seedSQL);
          console.log('초기 데이터 삽입 완료!');
        } catch (seedError) {
          if (seedError.code === '23505') {
            console.log('초기 데이터가 이미 존재합니다.');
          } else {
            throw seedError;
          }
        }
      } else {
        throw error;
      }
    } finally {
      appClient.release();
    }
    
  } catch (error) {
    console.error('❌ 데이터베이스 설정 중 오류 발생:', error.message);
    if (error.code === '28P01') {
      console.error('데이터베이스 인증 실패. .env 파일의 DB_USER와 DB_PASSWORD를 확인하세요.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('데이터베이스 서버에 연결할 수 없습니다. PostgreSQL이 실행 중인지 확인하세요.');
    } else {
      console.error('오류 상세:', error);
    }
    process.exit(1);
  } finally {
    await adminPool.end();
    await appPool.end();
  }
}

setupDatabase();

