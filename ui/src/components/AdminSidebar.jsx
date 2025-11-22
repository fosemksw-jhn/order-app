import './AdminSidebar.css';

function AdminSidebar({ onNavigateToOrder, onNavigateToInventory, onNavigateToOrders }) {
  return (
    <div className="admin-sidebar">
      <button 
        className="admin-sidebar-button"
        onClick={onNavigateToOrder}
      >
        주문하기 화면
      </button>
      <button 
        className="admin-sidebar-button"
        onClick={onNavigateToInventory}
      >
        전체 재고 현황
      </button>
      <button 
        className="admin-sidebar-button"
        onClick={onNavigateToOrders}
      >
        전체 주문 현황
      </button>
    </div>
  );
}

export default AdminSidebar;

