import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import AdminHeader from '../components/AdminHeader';
import Dashboard from '../components/Dashboard';
import InventoryStatus from '../components/InventoryStatus';
import OrderStatus from '../components/OrderStatus';
import AdminSidebar from '../components/AdminSidebar';
import Toast from '../components/Toast';
import './Admin.css';

function Admin() {
  const navigate = useNavigate();
  const { inventory, orders, updateInventory, updateOrderStatus } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
    setIsToastVisible(true);
  };

  const handleUpdateInventory = async (id, newStock) => {
    const result = await updateInventory(id, newStock);
    if (result.success) {
      showToast('재고가 수정되었습니다.');
    } else {
      showToast(result.message || '재고 수정에 실패했습니다.');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      showToast('주문 상태가 변경되었습니다.');
    } else {
      showToast(result.message || '주문 상태 변경에 실패했습니다.');
    }
  };

  // 대시보드 통계 계산 (메모이제이션)
  const dashboardStats = useMemo(() => ({
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === '주문 접수').length,
    inProgressOrders: orders.filter(o => o.status === '제조 중').length,
    completedOrders: orders.filter(o => o.status === '완료').length,
    lowStockItems: inventory.filter(i => i.stock < 5 && i.stock > 0).length
  }), [orders, inventory]);

  // 주문 목록 정렬 (최신순)
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB - dateA;
    });
  }, [orders]);

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
                orders={sortedOrders}
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

