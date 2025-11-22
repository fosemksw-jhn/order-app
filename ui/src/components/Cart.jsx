import './Cart.css';

function Cart({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) {
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>장바구니</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>장바구니가 비어있습니다.</p>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-items-section">
                <h3 className="section-title">주문 내역</h3>
                <div className="cart-items">
                  {cartItems.map((item) => {
                    const itemTotal = item.price * item.quantity;
                    return (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-main">
                          <div className="cart-item-info">
                            <h4 className="cart-item-name">{item.name}</h4>
                            <div className="cart-item-price-info">
                              <span className="cart-item-unit-price">{item.price.toLocaleString()}원</span>
                              <span className="cart-item-quantity">× {item.quantity}</span>
                              <span className="cart-item-total">= {itemTotal.toLocaleString()}원</span>
                            </div>
                          </div>
                          <div className="cart-item-controls">
                            <button 
                              className="quantity-btn"
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button 
                              className="quantity-btn"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                            <button 
                              className="remove-btn"
                              onClick={() => onRemoveItem(item.id)}
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="cart-summary-section">
                <h3 className="section-title">결제 정보</h3>
                <div className="cart-summary">
                  <div className="cart-total">
                    <span className="total-label">총 주문 금액</span>
                    <span className="total-price">{totalPrice.toLocaleString()}원</span>
                  </div>
                  <button className="checkout-btn" onClick={onCheckout}>
                    주문하기
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;

