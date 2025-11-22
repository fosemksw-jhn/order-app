import pg from 'pg';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 관리자 권한으로 데이터베이스 생성용 연결
const adminPoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  database: 'postgres', // 기본 데이터베이스에 연결
};

if (process.env.DB_PASSWORD) {
  adminPoolConfig.password = process.env.DB_PASSWORD;
}

const adminPool = new Pool(adminPoolConfig);

// 애플리케이션용 데이터베이스 연결
const appPoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  database: process.env.DB_NAME || 'coffee_order_db',
};

if (process.env.DB_PASSWORD) {
  appPoolConfig.password = process.env.DB_PASSWORD;
}

const appPool = new Pool(appPoolConfig);

async function setupDatabase() {
  const client = await adminPool.connect();
  
  try {
    console.log('데이터베이스 설정을 시작합니다...');
    
    // 1. 데이터베이스 존재 여부 확인 및 생성
    const dbName = process.env.DB_NAME || 'coffee_order_db';
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

