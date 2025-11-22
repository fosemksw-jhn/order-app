import { query } from '../src/config/database.js';

async function removeDuplicateMenus() {
  try {
    console.log('중복된 메뉴 확인 및 삭제 중...\n');

    // 모든 메뉴 조회
    const allMenus = await query(
      `SELECT id, name, image FROM menus ORDER BY name, id`
    );

    console.log('현재 메뉴 목록:');
    allMenus.rows.forEach(menu => {
      console.log(`  - ${menu.name} (ID: ${menu.id}): ${menu.image}`);
    });

    // 이름별로 그룹화하여 중복 확인
    const menuGroups = {};
    allMenus.rows.forEach(menu => {
      if (!menuGroups[menu.name]) {
        menuGroups[menu.name] = [];
      }
      menuGroups[menu.name].push(menu);
    });

    // 중복된 메뉴 찾기
    const duplicatesToDelete = [];
    for (const [name, menus] of Object.entries(menuGroups)) {
      if (menus.length > 1) {
        console.log(`\n중복 발견: ${name} (${menus.length}개)`);
        // 첫 번째 항목은 유지하고 나머지는 삭제 대상에 추가
        const toKeep = menus[0];
        const toDelete = menus.slice(1);
        console.log(`  유지: ID ${toKeep.id}`);
        toDelete.forEach(menu => {
          console.log(`  삭제: ID ${menu.id}`);
          duplicatesToDelete.push(menu.id);
        });
      }
    }

    if (duplicatesToDelete.length === 0) {
      console.log('\n중복된 메뉴가 없습니다.');
      process.exit(0);
    }

    // order_items에서 해당 메뉴를 참조하는 항목 삭제
    const deleteOrderItemsResult = await query(
      `DELETE FROM order_items WHERE menu_id = ANY($1::int[])`,
      [duplicatesToDelete]
    );
    console.log(`\norder_items에서 삭제된 항목: ${deleteOrderItemsResult.rowCount}개`);

    // 중복된 메뉴 삭제
    const deleteResult = await query(
      `DELETE FROM menus WHERE id = ANY($1::int[])`,
      [duplicatesToDelete]
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

removeDuplicateMenus();

