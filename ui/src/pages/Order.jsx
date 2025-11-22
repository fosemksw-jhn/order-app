import { useState } from 'react';
import Header from '../components/Header';
import MenuCard from '../components/MenuCard';
import Sidebar from '../components/Sidebar';
import Cart from '../components/Cart';
import Toast from '../components/Toast';
import { menuItems } from '../data/menuData';
import '../App.css';

function Order() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
    setIsToastVisible(true);
  };

  const handleAddToCart = (menu) => {
    const existingItem = cartItems.find(item => item.id === menu.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === menu.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...menu, quantity: 1 }]);
    }
    
    showToast(`${menu.name}이(가) 장바구니에 추가되었습니다.`);
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    
    setCartItems(cartItems.map(item =>
      item.id === id
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast('장바구니가 비어있습니다.');
      return;
    }
    
    showToast('주문이 완료되었습니다!');
    setCartItems([]);
    setIsCartOpen(false);
  };

  return (
    <div className="app">
      <Header 
        cartItems={cartItems}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <main className="main-content">
        <div className="content-wrapper">
          <div className="title-section">
            <h1 className="main-title">HANNA MENU</h1>
            <h2 className="sub-title">ALL MENU</h2>
            <div className="breadcrumb">
              <span>홈</span>
              <span className="separator"> &gt; </span>
              <span>메뉴소개</span>
              <span className="separator"> &gt; </span>
              <span>전체메뉴</span>
            </div>
          </div>

          <div className="menu-grid">
            {menuItems.map(menu => (
              <MenuCard
                key={menu.id}
                menu={menu}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </main>

      <Sidebar />
      
      <div className="bottom-section">
        <p className="bottom-text">행복을 선사하는 다양한 음료</p>
        <p className="bottom-text">음료와 잘 어울리는 다양한 디저트</p>
        <div className="bottom-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />
    </div>
  );
}

export default Order;

