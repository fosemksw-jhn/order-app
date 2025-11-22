import { query, transaction } from '../config/database.js';

// 주문 번호 생성 함수
const generateOrderNumber = () => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${dateStr}-${timeStr}-${random}`;
};

// POST /api/orders - 주문 생성
export const createOrder = async (req, res, next) => {
  try {
    const { items, total_amount } = req.body;
    
    // 유효성 검사
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: '주문 항목이 필요합니다.'
      });
    }
    
    if (!total_amount || total_amount < 0) {
      return res.status(400).json({
        success: false,
        message: '총 주문 금액이 필요합니다.'
      });
    }
    
    // 트랜잭션으로 주문 생성 및 재고 차감
    const orderData = await transaction(async (client) => {
      // 1. 재고 확인 및 차감
      for (const item of items) {
        const menuResult = await client.query(
          'SELECT id, name, stock, price FROM menus WHERE id = $1',
          [item.menu_id]
        );
        
        if (menuResult.rows.length === 0) {
          throw new Error(`메뉴 ID ${item.menu_id}를 찾을 수 없습니다.`);
        }
        
        const menu = menuResult.rows[0];
        
        if (menu.stock < item.quantity) {
          throw new Error(
            `${menu.name}의 재고가 부족합니다. (현재 재고: ${menu.stock}개, 주문 수량: ${item.quantity}개)`
          );
        }
        
        // 재고 차감
        await client.query(
          'UPDATE menus SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [item.quantity, item.menu_id]
        );
      }
      
      // 2. 주문 생성
      const orderNumber = generateOrderNumber();
      const orderResult = await client.query(
        `INSERT INTO orders (order_number, order_date, status, total_amount)
         VALUES ($1, CURRENT_TIMESTAMP, '주문 접수', $2)
         RETURNING id, order_number, order_date, status, total_amount`,
        [orderNumber, total_amount]
      );
      
      const order = orderResult.rows[0];
      
      // 3. 주문 항목 생성
      const orderItems = [];
      for (const item of items) {
        const itemResult = await client.query(
          `INSERT INTO order_items (order_id, menu_id, quantity, unit_price, total_price, options)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, menu_id, quantity, unit_price, total_price, options`,
          [
            order.id,
            item.menu_id,
            item.quantity,
            item.unit_price,
            item.total_price,
            JSON.stringify(item.options || [])
          ]
        );
        
        // 메뉴 이름 조회
        const menuResult = await client.query(
          'SELECT name FROM menus WHERE id = $1',
          [item.menu_id]
        );
        
        orderItems.push({
          id: itemResult.rows[0].id,
          menu_id: item.menu_id,
          menu_name: menuResult.rows[0].name,
          quantity: itemResult.rows[0].quantity,
          unit_price: itemResult.rows[0].unit_price,
          total_price: itemResult.rows[0].total_price,
          options: itemResult.rows[0].options ? JSON.parse(itemResult.rows[0].options) : []
        });
      }
      
      return {
        ...order,
        items: orderItems
      };
    });
    
    res.status(201).json({
      success: true,
      message: '주문이 완료되었습니다.',
      data: orderData
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders - 주문 목록 조회
export const getOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    let queryText = `
      SELECT 
        o.id,
        o.order_number,
        o.order_date,
        o.status,
        o.total_amount
      FROM orders o
    `;
    
    const params = [];
    
    if (status) {
      queryText += ' WHERE o.status = $1';
      params.push(status);
    }
    
    queryText += ' ORDER BY o.order_date DESC';
    
    const result = await query(queryText, params);
    
    // 각 주문의 항목 조회
    const ordersWithItems = await Promise.all(
      result.rows.map(async (order) => {
        const itemsResult = await query(
          `SELECT 
            oi.id,
            oi.menu_id,
            m.name as menu_name,
            oi.quantity,
            oi.unit_price,
            oi.total_price,
            oi.options
          FROM order_items oi
          JOIN menus m ON oi.menu_id = m.id
          WHERE oi.order_id = $1`,
          [order.id]
        );
        
        return {
          ...order,
          items: itemsResult.rows.map(item => ({
            ...item,
            options: item.options ? JSON.parse(item.options) : []
          }))
        };
      })
    );
    
    res.json({
      success: true,
      data: ordersWithItems,
      total: ordersWithItems.length
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id - 주문 상세 조회
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const orderResult = await query(
      'SELECT id, order_number, order_date, status, total_amount FROM orders WHERE id = $1',
      [id]
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '주문을 찾을 수 없습니다.'
      });
    }
    
    const order = orderResult.rows[0];
    
    // 주문 항목 조회
    const itemsResult = await query(
      `SELECT 
        oi.id,
        oi.menu_id,
        m.name as menu_name,
        oi.quantity,
        oi.unit_price,
        oi.total_price,
        oi.options
      FROM order_items oi
      JOIN menus m ON oi.menu_id = m.id
      WHERE oi.order_id = $1`,
      [id]
    );
    
    order.items = itemsResult.rows.map(item => ({
      ...item,
      options: item.options ? JSON.parse(item.options) : []
    }));
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/orders/:id/status - 주문 상태 변경
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // 유효성 검사
    const validStatuses = ['주문 접수', '제조 중', '완료', '취소'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `유효하지 않은 주문 상태입니다. (가능한 값: ${validStatuses.join(', ')})`
      });
    }
    
    // 주문 존재 확인
    const orderCheck = await query(
      'SELECT id, order_number, status FROM orders WHERE id = $1',
      [id]
    );
    
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '주문을 찾을 수 없습니다.'
      });
    }
    
    // 상태 변경
    const result = await query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, order_number, status',
      [status, id]
    );
    
    res.json({
      success: true,
      message: '주문 상태가 변경되었습니다.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

