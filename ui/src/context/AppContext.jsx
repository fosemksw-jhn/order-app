import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// localStorage에서 데이터 로드
const loadFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// localStorage에 데이터 저장
const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

const defaultInventory = [
  { id: 1, name: '아메리카노', stock: 10 },
  { id: 2, name: '카페라떼', stock: 3 },
  { id: 3, name: '카푸치노', stock: 0 }
];

const defaultOrders = [
  {
    id: 1,
    orderNumber: 'ORD-001',
    date: '2025-01-20',
    time: '14:30',
    items: [
      { name: '아메리카노', quantity: 2, price: 4000 },
      { name: '카페라떼', quantity: 1, price: 4500 }
    ],
    total: 12500,
    status: '주문 접수'
  },
  {
    id: 2,
    orderNumber: 'ORD-002',
    date: '2025-01-20',
    time: '14:25',
    items: [
      { name: '카푸치노', quantity: 1, price: 4500 }
    ],
    total: 4500,
    status: '제조 중'
  }
];

export const AppProvider = ({ children }) => {
  // 재고 데이터 (localStorage에서 로드)
  const [inventory, setInventoryState] = useState(() => 
    loadFromStorage('hanna_coffee_inventory', defaultInventory)
  );

  // 주문 데이터 (localStorage에서 로드)
  const [orders, setOrdersState] = useState(() => 
    loadFromStorage('hanna_coffee_orders', defaultOrders)
  );

  // inventory가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    saveToStorage('hanna_coffee_inventory', inventory);
  }, [inventory]);

  // orders가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    saveToStorage('hanna_coffee_orders', orders);
  }, [orders]);

  // setInventory 래퍼 (추가 로직이 필요할 경우)
  const setInventory = useCallback((newInventory) => {
    setInventoryState(newInventory);
  }, []);

  // setOrders 래퍼
  const setOrders = useCallback((newOrders) => {
    setOrdersState(newOrders);
  }, []);

  // 주문 번호 생성 함수
  const generateOrderNumber = useCallback(() => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${dateStr}-${timeStr}-${random}`;
  }, []);

  // 날짜/시간 포맷 함수
  const formatDateTime = useCallback(() => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 5);
    return { date, time };
  }, []);

  // 재고 확인 함수
  const checkStock = useCallback((cartItems) => {
    const stockIssues = [];
    
    cartItems.forEach(cartItem => {
      const inventoryItem = inventory.find(inv => inv.name === cartItem.name);
      if (!inventoryItem) {
        stockIssues.push(`${cartItem.name}: 메뉴를 찾을 수 없습니다.`);
      } else if (inventoryItem.stock < cartItem.quantity) {
        stockIssues.push(`${cartItem.name}: 재고 부족 (현재 재고: ${inventoryItem.stock}개, 주문 수량: ${cartItem.quantity}개)`);
      }
    });

    return {
      isValid: stockIssues.length === 0,
      issues: stockIssues
    };
  }, [inventory]);

  // 주문 추가 함수
  const addOrder = useCallback((cartItems) => {
    const stockCheck = checkStock(cartItems);
    if (!stockCheck.isValid) {
      return {
        success: false,
        message: stockCheck.issues.join('\n')
      };
    }

    // 재고 차감
    const updatedInventory = inventory.map(invItem => {
      const cartItem = cartItems.find(ci => ci.name === invItem.name);
      if (cartItem) {
        return { ...invItem, stock: invItem.stock - cartItem.quantity };
      }
      return invItem;
    });

    // 주문 생성
    const { date, time } = formatDateTime();
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder = {
      id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
      orderNumber: generateOrderNumber(),
      date,
      time,
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total,
      status: '주문 접수'
    };

    setInventory(updatedInventory);
    setOrders(prevOrders => [newOrder, ...prevOrders]);

    return {
      success: true,
      message: '주문이 완료되었습니다!',
      orderNumber: newOrder.orderNumber
    };
  }, [inventory, orders, checkStock, formatDateTime, generateOrderNumber]);

  // 재고 업데이트 함수
  const updateInventory = useCallback((id, newStock) => {
    setInventory(prevInventory =>
      prevInventory.map(item =>
        item.id === id ? { ...item, stock: newStock } : item
      )
    );
  }, []);

  // 주문 상태 업데이트 함수
  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  }, []);

  const value = {
    inventory,
    orders,
    updateInventory,
    updateOrderStatus,
    addOrder,
    checkStock
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

