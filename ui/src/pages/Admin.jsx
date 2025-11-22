import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import Dashboard from '../components/Dashboard';
import InventoryStatus from '../components/InventoryStatus';
import OrderStatus from '../components/OrderStatus';
import AdminSidebar from '../components/AdminSidebar';
import Toast from '../components/Toast';
import './Admin.css';

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  
  // 재고 데이터 (초기값)
  const [inventory, setInventory] = useState([
    { id: 1, name: '아메리카노', stock: 10 },
    { id: 2, name: '카페라떼', stock: 3 },
    { id: 3, name: '카푸치노', stock: 0 }
  ]);

  // 주문 데이터 (초기값)
  const [orders, setOrders] = useState([
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
  ]);

  const showToast = (message) => {
    setToastMessage(message);
    setIsToastVisible(true);
  };

  const handleUpdateInventory = (id, newStock) => {
    setInventory(inventory.map(item =>
      item.id === id ? { ...item, stock: newStock } : item
    ));
    showToast('재고가 수정되었습니다.');
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    showToast('주문 상태가 변경되었습니다.');
  };

  // 대시보드 통계 계산
  const dashboardStats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === '주문 접수').length,
    inProgressOrders: orders.filter(o => o.status === '제조 중').length,
    completedOrders: orders.filter(o => o.status === '완료').length,
    lowStockItems: inventory.filter(i => i.stock < 5 && i.stock > 0).length
  };

  return (
    <div className="admin-app">
      <AdminHeader />
      
      <main className="admin-main-content">
        <div className="admin-content-wrapper">
          <div className="admin-title-section">
            <h1 className="admin-main-title">HANNA ADMIN</h1>
            <h2 className="admin-sub-title">관리자 대시보드</h2>
            <div className="admin-breadcrumb">
              <span>홈</span>
              <span className="separator"> &gt; </span>
              <span>관리자</span>
            </div>
          </div>

          <div className="admin-tabs">
            <button
              className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              대시보드
            </button>
            <button
              className={`admin-tab ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              재고 현황
            </button>
            <button
              className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              주문 현황
            </button>
          </div>

          <div className="admin-content">
            {activeTab === 'dashboard' && (
              <Dashboard stats={dashboardStats} />
            )}
            {activeTab === 'inventory' && (
              <InventoryStatus
                inventory={inventory}
                onUpdateInventory={handleUpdateInventory}
              />
            )}
            {activeTab === 'orders' && (
              <OrderStatus
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            )}
          </div>
        </div>
      </main>

      <AdminSidebar
        onNavigateToOrder={() => navigate('/')}
        onNavigateToInventory={() => setActiveTab('inventory')}
        onNavigateToOrders={() => setActiveTab('orders')}
      />

      <div className="admin-bottom-section">
        <p className="admin-bottom-text">효율적인 재고 관리로 신선한 커피를 제공합니다</p>
        <p className="admin-bottom-text">실시간 주문 현황을 확인하고 관리하세요</p>
      </div>

      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />
    </div>
  );
}

export default Admin;

