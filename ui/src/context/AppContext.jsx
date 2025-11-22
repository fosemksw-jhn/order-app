import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { menuAPI, orderAPI } from '../utils/api';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // 메뉴 데이터
  const [menus, setMenus] = useState([]);
  
  // 재고 데이터 (관리자용)
  const [inventory, setInventoryState] = useState([]);

  // 주문 데이터
  const [orders, setOrdersState] = useState([]);
  
  // 로딩 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 메뉴 목록 로드 (일반 사용자용)
  const loadMenus = useCallback(async () => {
    try {
      const response = await menuAPI.getMenus();
      setMenus(response.data || []);
      setError(null);
    } catch (err) {
      console.error('메뉴 로드 실패:', err);
      setError(err.message);
      // 에러가 발생해도 빈 배열로 설정하여 앱이 계속 작동하도록 함
      setMenus([]);
    }
  }, []);

  // 재고 데이터 로드 (관리자용)
  const loadInventory = useCallback(async () => {
    try {
      const response = await menuAPI.getMenusForAdmin();
      const inventoryData = (response.data || []).map(menu => ({
        id: menu.id,
        name: menu.name,
        stock: menu.stock || 0
      }));
      setInventoryState(inventoryData);
      setError(null);
    } catch (err) {
      console.error('재고 데이터 로드 실패:', err);
      setError(err.message);
      // 에러가 발생해도 빈 배열로 설정하여 앱이 계속 작동하도록 함
      setInventoryState([]);
    }
  }, []);

  // 주문 목록 로드
  const loadOrders = useCallback(async () => {
    try {
      const response = await orderAPI.getOrders();
      const ordersData = (response.data || []).map(order => {
        const orderDate = new Date(order.order_date);
        return {
          id: order.id,
          orderNumber: order.order_number,
          date: orderDate.toISOString().slice(0, 10),
          time: orderDate.toTimeString().slice(0, 5),
          items: (order.items || []).map(item => ({
            name: item.menu_name,
            quantity: item.quantity,
            price: item.unit_price
          })),
          total: order.total_amount,
          status: order.status
        };
      });
      setOrdersState(ordersData);
      setError(null);
    } catch (err) {
      console.error('주문 목록 로드 실패:', err);
      setError(err.message);
      // 에러가 발생해도 빈 배열로 설정하여 앱이 계속 작동하도록 함
      setOrdersState([]);
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadMenus(),
          loadInventory(),
          loadOrders()
        ]);
      } catch (err) {
        console.error('초기 데이터 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    
    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 재고 확인 함수
  const checkStock = useCallback((cartItems) => {
    const stockIssues = [];
    
    cartItems.forEach(cartItem => {
      const menuItem = menus.find(m => m.id === cartItem.id);
      if (!menuItem) {
        stockIssues.push(`${cartItem.name}: 메뉴를 찾을 수 없습니다.`);
      } else {
        // 재고는 서버에서 확인하므로 여기서는 기본 검증만 수행
        // 실제 재고 확인은 서버에서 수행됨
      }
    });

    return {
      isValid: stockIssues.length === 0,
      issues: stockIssues
    };
  }, [menus]);

  // 주문 추가 함수
  const addOrder = useCallback(async (cartItems) => {
    try {
      // 주문 데이터 준비
      const items = cartItems.map(item => ({
        menu_id: item.id,
        quantity: item.quantity,
        options: item.options || [],
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      const total_amount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // API 호출
      const response = await orderAPI.createOrder({
        items,
        total_amount
      });

      // 주문 목록 새로고침
      await loadOrders();
      // 재고 목록 새로고침
      await loadInventory();

      return {
        success: true,
        message: '주문이 완료되었습니다!',
        orderNumber: response.data?.order_number
      };
    } catch (err) {
      console.error('주문 생성 실패:', err);
      return {
        success: false,
        message: err.message || '주문 생성에 실패했습니다.'
      };
    }
  }, [loadOrders, loadInventory]);

  // 재고 업데이트 함수
  const updateInventory = useCallback(async (id, newStock) => {
    try {
      await menuAPI.updateStock(id, newStock);
      // 재고 목록 새로고침
      await loadInventory();
      return { success: true };
    } catch (err) {
      console.error('재고 업데이트 실패:', err);
      return { success: false, message: err.message };
    }
  }, [loadInventory]);

  // 주문 상태 업데이트 함수
  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      // 주문 목록 새로고침
      await loadOrders();
      return { success: true };
    } catch (err) {
      console.error('주문 상태 업데이트 실패:', err);
      return { success: false, message: err.message };
    }
  }, [loadOrders]);

  const value = {
    menus,
    inventory,
    orders,
    loading,
    error,
    updateInventory,
    updateOrderStatus,
    addOrder,
    checkStock,
    loadMenus,
    loadInventory,
    loadOrders
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

