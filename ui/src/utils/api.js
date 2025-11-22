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
    // 네트워크 오류인 경우 더 명확한 메시지 제공
    let errorMessage = error.message;
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      errorMessage = `API 서버에 연결할 수 없습니다. 
      
가능한 원인:
1. 백엔드 서버가 실행되지 않았습니다
2. 환경 변수 VITE_API_BASE_URL이 설정되지 않았거나 잘못되었습니다
3. CORS 설정 문제가 있습니다

현재 API URL: ${url}
환경 변수 VITE_API_BASE_URL: ${import.meta.env.VITE_API_BASE_URL || '설정되지 않음'}

해결 방법:
1. Render 대시보드에서 백엔드 서비스가 "Live" 상태인지 확인하세요
2. 프론트엔드 Static Site의 Environment에서 VITE_API_BASE_URL을 확인하세요
3. 백엔드 URL 형식: https://your-api.onrender.com/api`;
    } else if (error.message.includes('404')) {
      errorMessage = `API 엔드포인트를 찾을 수 없습니다: ${url}
      
백엔드 서버의 라우트 설정을 확인하세요.`;
    } else if (error.message.includes('500')) {
      errorMessage = `서버 내부 오류가 발생했습니다: ${url}
      
백엔드 서버의 Logs를 확인하세요.`;
    }
    
    console.error('API 요청 오류:', {
      url,
      error: errorMessage,
      originalError: error.message,
      stack: error.stack,
      apiBaseUrl: API_BASE_URL,
      envVar: import.meta.env.VITE_API_BASE_URL
    });
    
    // 에러 객체에 더 많은 정보 추가
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.url = url;
    enhancedError.apiBaseUrl = API_BASE_URL;
    throw enhancedError;
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

