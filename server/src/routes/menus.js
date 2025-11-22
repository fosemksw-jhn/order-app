import express from 'express';
import { getMenus, getMenusForAdmin, getMenuById, updateMenuStock } from '../controllers/menuController.js';

const router = express.Router();

// GET /api/menus - 메뉴 목록 조회 (일반 사용자용)
router.get('/', getMenus);

// GET /api/menus/admin - 메뉴 목록 조회 (관리자용, 재고 포함)
router.get('/admin', getMenusForAdmin);

// GET /api/menus/:id - 메뉴 상세 조회
router.get('/:id', getMenuById);

// PATCH /api/menus/:id/stock - 재고 수정
router.patch('/:id/stock', updateMenuStock);

export default router;


