import express from 'express';
import { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus 
} from '../controllers/orderController.js';

const router = express.Router();

// POST /api/orders - 주문 생성
router.post('/', createOrder);

// GET /api/orders - 주문 목록 조회
router.get('/', getOrders);

// GET /api/orders/:id - 주문 상세 조회
router.get('/:id', getOrderById);

// PATCH /api/orders/:id/status - 주문 상태 변경
router.patch('/:id/status', updateOrderStatus);

export default router;


