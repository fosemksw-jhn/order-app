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
      console.log('메뉴 로드 시작...');
      const response = await menuAPI.getMenus();
      console.log('메뉴 로드 성공:', response);
      setMenus(response.data || []);
      setError(null);
    } catch (err) {
      console.error('메뉴 로드 실패:', err);
      console.log('관리자용 API로 대체 시도...');
      
      // 사용자용 API가 실패하면 관리자용 API로 대체 시도
      try {
        const adminResponse = await menuAPI.getMenusForAdmin();
        console.log('관리자용 API로 메뉴 로드 성공:', adminResponse);
        // 재고 정보를 제외하고 메뉴 정보만 사용
        const menuData = (adminResponse.data || []).map(menu => ({
          id: menu.id,
          name: menu.name,
          description: menu.description,
          price: menu.price,
          image: menu.image
        }));
        setMenus(menuData);
        setError(null);
        console.log('관리자용 API로 메뉴 복구 완료');
      } catch (adminErr) {
        console.error('관리자용 API도 실패:', adminErr);
        // 더 명확한 에러 메시지 제공
        let errorMessage = err.message || '메뉴를 불러올 수 없습니다.';
        
        // 네트워크 오류인 경우 추가 안내
        if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
          errorMessage = `API 서버에 연결할 수 없습니다.

확인 사항:
1. Render 대시보드에서 백엔드 서비스가 "Live" 상태인지 확인
2. 프론트엔드 환경 변수 VITE_API_BASE_URL 설정 확인
3. 백엔드 URL이 올바른지 확인

현재 API URL: ${err.url || '알 수 없음'}`;
        }
        
        setError(errorMessage);
        setMenus([]);
      }
    }
  }, []);

  // 재고 데이터 로드 (관리자용)
  // 이 함수는 관리자용 API를 호출하므로 메뉴 정보도 포함됨
  // 메뉴 데이터가 비어있으면 자동으로 복구함
  const loadInventory = useCallback(async () => {
    try {
      console.log('재고 데이터 로드 시작 (관리자용 API)...');
      const response = await menuAPI.getMenusForAdmin();
      console.log('재고 데이터 로드 성공:', response);
      
      const inventoryData = (response.data || []).map(menu => ({
        id: menu.id,
        name: menu.name,
        stock: menu.stock || 0
      }));
      setInventoryState(inventoryData);
      
      // 관리자용 API가 성공했다면 메뉴 데이터도 항상 설정 (복구 보장)
      if (response.data && response.data.length > 0) {
        setMenus(prevMenus => {
          // 메뉴가 비어있거나, 관리자용 API 데이터가 더 최신인 경우 업데이트
          if (prevMenus.length === 0 || prevMenus.length !== response.data.length) {
            console.log('메뉴 데이터 복구/업데이트 (관리자용 API 데이터 사용)');
            return response.data.map(menu => ({
              id: menu.id,
              name: menu.name,
              description: menu.description,
              price: menu.price,
              image: menu.image
            }));
          }
          return prevMenus;
        });
      }
      
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
      setError(null);
      
      try {
        // 1. 먼저 관리자용 API로 재고 데이터 로드 (이것이 성공하면 메뉴도 함께 복구됨)
        await loadInventory();
        
        // 2. 사용자용 메뉴 API 시도 (실패해도 이미 loadInventory에서 복구됨)
        try {
          await loadMenus();
        } catch (menuErr) {
          console.log('사용자용 메뉴 API 실패, 관리자용 API 데이터 사용:', menuErr);
        }
        
        // 3. 주문 목록 로드
        await loadOrders();
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

