import { query } from '../src/config/database.js';

async function checkAllMenus() {
  try {
    const result = await query(
      `SELECT id, name, image FROM menus ORDER BY id`
    );
    
    console.log('전체 메뉴 목록:');
    result.rows.forEach(menu => {
      console.log(`  - ID: ${menu.id}, 이름: ${menu.name}, 이미지: ${menu.image || '없음'}`);
    });
    
    // 이름별로 그룹화
    const menuGroups = {};
    result.rows.forEach(menu => {
      if (!menuGroups[menu.name]) {
        menuGroups[menu.name] = [];
      }
      menuGroups[menu.name].push(menu);
    });
    
    console.log('\n이름별 그룹:');
    for (const [name, menus] of Object.entries(menuGroups)) {
      if (menus.length > 1) {
        console.log(`  ⚠️  ${name}: ${menus.length}개 (중복!)`);
        menus.forEach(m => console.log(`     - ID: ${m.id}`));
      } else {
        console.log(`  ✓ ${name}: 1개`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('오류:', error.message);
    process.exit(1);
  }
}

checkAllMenus();

