import { query } from '../src/config/database.js';

async function updateMenuImages() {
  try {
    console.log('메뉴 이미지 경로 업데이트 중...\n');

    // 카라멜마끼아또 이미지 업데이트
    const caramelResult = await query(
      `UPDATE menus 
       SET image = '/카라멜마끼아또.jpg', updated_at = CURRENT_TIMESTAMP 
       WHERE name LIKE '%카라멜%마끼아또%' OR name LIKE '%카라멜%마키아토%'`
    );
    console.log(`카라멜마끼아또 이미지 업데이트: ${caramelResult.rowCount}개`);

    // 아메리카노(HOT) 이미지 업데이트 - '아메리카노'만 (HOT 버전이 없으면 일반 아메리카노)
    const americanoResult = await query(
      `UPDATE menus 
       SET image = '/americano-hot.jpg', updated_at = CURRENT_TIMESTAMP 
       WHERE name = '아메리카노'`
    );
    console.log(`아메리카노 이미지 업데이트: ${americanoResult.rowCount}개`);

    // 카페라떼 이미지 업데이트
    const latteResult = await query(
      `UPDATE menus 
       SET image = '/caffe-latte.jpg', updated_at = CURRENT_TIMESTAMP 
       WHERE name = '카페라떼'`
    );
    console.log(`카페라떼 이미지 업데이트: ${latteResult.rowCount}개`);

    // 업데이트된 메뉴 확인
    const updatedMenus = await query(
      `SELECT id, name, image FROM menus WHERE image IS NOT NULL ORDER BY id`
    );

    console.log('\n업데이트된 메뉴 목록:');
    updatedMenus.rows.forEach(menu => {
      console.log(`  - ${menu.name}: ${menu.image}`);
    });

    console.log('\n✅ 메뉴 이미지 경로 업데이트 완료!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

updateMenuImages();

