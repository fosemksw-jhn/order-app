import { query } from '../src/config/database.js';

async function deleteMenusWithoutImages() {
  try {
    console.log('이미지가 없는 메뉴 삭제 중...\n');

    // 먼저 이미지가 있는 메뉴 확인
    const menusWithImages = await query(
      `SELECT id, name, image FROM menus WHERE image IS NOT NULL`
    );
    
    console.log('이미지가 있는 메뉴:');
    menusWithImages.rows.forEach(menu => {
      console.log(`  - ${menu.name} (ID: ${menu.id}): ${menu.image}`);
    });

    // 이미지가 없는 메뉴 ID 목록 가져오기
    const menusWithoutImages = await query(
      `SELECT id, name FROM menus WHERE image IS NULL`
    );

    if (menusWithoutImages.rows.length === 0) {
      console.log('\n삭제할 메뉴가 없습니다.');
      process.exit(0);
    }

    console.log('\n삭제할 메뉴:');
    menusWithoutImages.rows.forEach(menu => {
      console.log(`  - ${menu.name} (ID: ${menu.id})`);
    });

    // 먼저 order_items에서 해당 메뉴를 참조하는 항목 삭제
    const menuIds = menusWithoutImages.rows.map(m => m.id);
    const deleteOrderItemsResult = await query(
      `DELETE FROM order_items WHERE menu_id = ANY($1::int[])`,
      [menuIds]
    );
    console.log(`\norder_items에서 삭제된 항목: ${deleteOrderItemsResult.rowCount}개`);

    // 이제 메뉴 삭제
    const deleteResult = await query(
      `DELETE FROM menus WHERE image IS NULL`
    );

    console.log(`삭제된 메뉴 개수: ${deleteResult.rowCount}개`);

    // 남은 메뉴 확인
    const remainingMenus = await query(
      `SELECT id, name, image FROM menus ORDER BY id`
    );

    console.log('\n남은 메뉴 목록:');
    remainingMenus.rows.forEach(menu => {
      console.log(`  - ${menu.name} (ID: ${menu.id}): ${menu.image}`);
    });

    console.log(`\n✅ 총 ${remainingMenus.rows.length}개의 메뉴가 남았습니다.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

deleteMenusWithoutImages();

