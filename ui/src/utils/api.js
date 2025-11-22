const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// API 요청 헬퍼 함수
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API 요청 실패');
    }

    return data;
  } catch (error) {
    console.error('API 요청 오류:', error);
    throw error;
  }
};

// 메뉴 관련 API
export const menuAPI = {
  // 메뉴 목록 조회 (일반 사용자용)
  getMenus: () => apiRequest('/menus'),

  // 메뉴 목록 조회 (관리자용, 재고 포함)
  getMenusForAdmin: () => apiRequest('/menus/admin'),

  // 메뉴 상세 조회
  getMenuById: (id) => apiRequest(`/menus/${id}`),

  // 재고 수정
  updateStock: (id, stock) =>
    apiRequest(`/menus/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    }),
};

// 주문 관련 API
export const orderAPI = {
  // 주문 생성
  createOrder: (orderData) =>
    apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  // 주문 목록 조회
  getOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/orders${queryString ? `?${queryString}` : ''}`);
  },

  // 주문 상세 조회
  getOrderById: (id) => apiRequest(`/orders/${id}`),

  // 주문 상태 변경
  updateOrderStatus: (id, status) =>
    apiRequest(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

