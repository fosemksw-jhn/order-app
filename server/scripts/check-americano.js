import { query } from '../src/config/database.js';

async function checkAmericano() {
  try {
    const result = await query(
      `SELECT id, name, image FROM menus WHERE name LIKE '%아메리카노%' ORDER BY id`
    );
    
    console.log('아메리카노 메뉴:');
    result.rows.forEach(menu => {
      console.log(`  - ID: ${menu.id}, 이름: ${menu.name}, 이미지: ${menu.image}`);
    });
    
    if (result.rows.length > 1) {
      console.log(`\n중복 발견! ${result.rows.length}개의 아메리카노가 있습니다.`);
      console.log(`첫 번째 항목(ID: ${result.rows[0].id})을 유지하고 나머지를 삭제합니다.`);
      
      const idsToDelete = result.rows.slice(1).map(m => m.id);
      
      // order_items에서 참조 삭제
      await query(
        `DELETE FROM order_items WHERE menu_id = ANY($1::int[])`,
        [idsToDelete]
      );
      
      // 메뉴 삭제
      const deleteResult = await query(
        `DELETE FROM menus WHERE id = ANY($1::int[])`,
        [idsToDelete]
      );
      
      console.log(`삭제 완료: ${deleteResult.rowCount}개`);
    } else {
      console.log('\n중복이 없습니다.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('오류:', error.message);
    process.exit(1);
  }
}

checkAmericano();

