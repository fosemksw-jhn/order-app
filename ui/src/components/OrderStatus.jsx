import './OrderStatus.css';

function OrderStatus({ orders, onUpdateOrderStatus }) {
  const getStatusColor = (status) => {
    const colors = {
      '주문 접수': '#FFD700',
      '제조 중': '#4A90E2',
      '완료': '#50C878',
      '취소': '#FF6B6B'
    };
    return colors[status] || '#666666';
  };

  const handleStatusChange = (orderId, newStatus) => {
    onUpdateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="order-status">
      <div className="order-list">
        {orders.length === 0 ? (
          <div className="order-empty">
            <p>주문이 없습니다.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3 className="order-number">{order.orderNumber}</h3>
                  <p className="order-date">{order.date} {order.time}</p>
                </div>
                <span
                  className="order-status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
              </div>
              
              <div className="order-items">
                <h4 className="order-items-title">주문 메뉴</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span className="order-item-name">{item.name}</span>
                    <span className="order-item-quantity">× {item.quantity}</span>
                    <span className="order-item-price">{(item.price * item.quantity).toLocaleString()}원</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span className="order-total-label">총 금액:</span>
                  <span className="order-total-value">{order.total.toLocaleString()}원</span>
                </div>
                {order.status === '주문 접수' && (
                  <button
                    className="order-action-btn"
                    onClick={() => handleStatusChange(order.id, '제조 중')}
                  >
                    제조 시작
                  </button>
                )}
                {order.status === '제조 중' && (
                  <button
                    className="order-action-btn complete"
                    onClick={() => handleStatusChange(order.id, '완료')}
                  >
                    제조 완료
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OrderStatus;

