import { query } from '../src/config/database.js';

async function checkSchema() {
  try {
    console.log('데이터베이스 스키마 확인 중...\n');
    
    // 테이블 목록 조회
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('생성된 테이블:');
    for (const row of tablesResult.rows) {
      console.log(`\n📋 ${row.table_name}`);
      
      // 각 테이블의 컬럼 정보 조회
      const columnsResult = await query(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' 
          AND table_name = $1
        ORDER BY ordinal_position
      `, [row.table_name]);
      
      columnsResult.rows.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        console.log(`  - ${col.column_name}: ${col.data_type} ${nullable}${defaultVal}`);
      });
      
      // 외래 키 정보 조회
      const fkResult = await query(`
        SELECT
          tc.constraint_name,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = $1
      `, [row.table_name]);
      
      if (fkResult.rows.length > 0) {
        console.log('  외래 키:');
        fkResult.rows.forEach(fk => {
          console.log(`    - ${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`);
        });
      }
    }
    
    // 인덱스 정보 조회
    console.log('\n\n인덱스:');
    const indexResult = await query(`
      SELECT
        tablename,
        indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexname NOT LIKE 'pg_%'
      ORDER BY tablename, indexname
    `);
    
    indexResult.rows.forEach(idx => {
      console.log(`  - ${idx.indexname} (${idx.tablename})`);
    });
    
    console.log('\n✅ 스키마 확인 완료!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

checkSchema();

