// API 기본 URL 설정
// 개발 환경: http://localhost:3000/api
// 프로덕션 환경: Render에서 설정한 VITE_API_BASE_URL 사용
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api');

// 디버깅을 위한 API URL 로그 (프로덕션에서도 확인 가능)
console.log('API_BASE_URL:', API_BASE_URL);
console.log('VITE_API_BASE_URL env:', import.meta.env.VITE_API_BASE_URL);
console.log('DEV mode:', import.meta.env.DEV);

// API 요청 헬퍼 함수
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('API 요청:', url, options);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('API 응답 상태:', response.status, response.statusText);

    // 응답이 JSON이 아닐 수 있으므로 확인
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('JSON이 아닌 응답:', text);
      throw new Error(`서버 응답 오류: ${response.status} ${response.statusText}`);
    }

    if (!response.ok) {
      throw new Error(data.message || `API 요청 실패: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('API 요청 오류:', {
      url,
      error: error.message,
      stack: error.stack
    });
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

