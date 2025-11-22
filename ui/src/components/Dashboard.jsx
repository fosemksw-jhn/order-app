import './Dashboard.css';

function Dashboard({ stats }) {
  const dashboardItems = [
    {
      id: 1,
      title: '전체 주문',
      count: stats.totalOrders,
      icon: '📋',
      color: '#2563eb'
    },
    {
      id: 2,
      title: '주문 접수',
      count: stats.pendingOrders,
      icon: '⏳',
      color: '#FFD700'
    },
    {
      id: 3,
      title: '제조 중',
      count: stats.inProgressOrders,
      icon: '☕',
      color: '#4A90E2'
    },
    {
      id: 4,
      title: '제조 완료',
      count: stats.completedOrders,
      icon: '✅',
      color: '#50C878'
    },
    {
      id: 5,
      title: '재고 부족',
      count: stats.lowStockItems,
      icon: '⚠️',
      color: '#FF6B6B'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        {dashboardItems.map(item => (
          <div key={item.id} className="dashboard-card">
            <div className="dashboard-card-icon" style={{ backgroundColor: `${item.color}20` }}>
              <span className="dashboard-icon">{item.icon}</span>
            </div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">{item.title}</h3>
              <p className="dashboard-card-count" style={{ color: item.color }}>
                {item.count}개
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;

