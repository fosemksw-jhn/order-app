import { query } from '../config/database.js';

// GET /api/menus - 메뉴 목록 조회 (일반 사용자용)
export const getMenus = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, name, description, price, image FROM menus ORDER BY id'
    );
    
    // 이미지 경로 처리 (상대 경로를 절대 경로로 변환)
    const menus = result.rows.map(menu => ({
      ...menu,
      // 이미지가 있고 절대 URL이 아니면 그대로 반환 (프론트엔드에서 처리)
      image: menu.image || null
    }));
    
    res.json({
      success: true,
      data: menus
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/menus/admin - 메뉴 목록 조회 (관리자용, 재고 포함)
export const getMenusForAdmin = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, name, description, price, image, stock FROM menus ORDER BY id'
    );
    
    // 이미지 경로 처리 (상대 경로를 절대 경로로 변환)
    const menus = result.rows.map(menu => ({
      ...menu,
      // 이미지가 있고 절대 URL이 아니면 그대로 반환 (프론트엔드에서 처리)
      image: menu.image || null
    }));
    
    res.json({
      success: true,
      data: menus
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/menus/:id - 메뉴 상세 조회
export const getMenuById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      'SELECT id, name, description, price, image, stock FROM menus WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '메뉴를 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/menus/:id/stock - 재고 수정
export const updateMenuStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    
    // 유효성 검사
    if (stock === undefined || stock === null) {
      return res.status(400).json({
        success: false,
        message: '재고 수량을 입력해주세요.'
      });
    }
    
    if (!Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({
        success: false,
        message: '재고 수량은 0 이상의 정수여야 합니다.'
      });
    }
    
    // 메뉴 존재 확인
    const menuCheck = await query(
      'SELECT id, name FROM menus WHERE id = $1',
      [id]
    );
    
    if (menuCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '메뉴를 찾을 수 없습니다.'
      });
    }
    
    // 재고 업데이트
    const result = await query(
      'UPDATE menus SET stock = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, stock',
      [stock, id]
    );
    
    res.json({
      success: true,
      message: '재고가 수정되었습니다.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};


