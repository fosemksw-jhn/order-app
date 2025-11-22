import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import MenuCard from '../components/MenuCard';
import Sidebar from '../components/Sidebar';
import Cart from '../components/Cart';
import Toast from '../components/Toast';
import '../App.css';

function Order() {
  const { menus, addOrder, checkStock, inventory, loading, error, loadMenus, loadInventory } = useAppContext();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  // 재고 정보를 포함한 메뉴 목록
  const availableMenuItems = useMemo(() => {
    return menus.map(menu => {
      const inventoryItem = inventory.find(inv => inv.id === menu.id);
      return {
        ...menu,
        stock: inventoryItem ? inventoryItem.stock : 0,
        isAvailable: inventoryItem ? inventoryItem.stock > 0 : false
      };
    });
  }, [menus, inventory]);

  const showToast = (message) => {
    setToastMessage(message);
    setIsToastVisible(true);
  };

  const handleAddToCart = (menu, options = []) => {
    // 재고 확인
    const inventoryItem = inventory.find(inv => inv.id === menu.id);
    if (!inventoryItem || inventoryItem.stock === 0) {
      showToast(`${menu.name}은(는) 현재 품절입니다.`);
      return;
    }

    // 옵션 가격 계산
    const optionPrice = options.reduce((sum, opt) => sum + opt.price, 0);
    const totalPrice = menu.price + optionPrice;

    // 옵션을 문자열로 변환하여 비교 (같은 옵션 조합인지 확인)
    const optionsKey = JSON.stringify(options.map(opt => opt.id).sort());

    // 같은 메뉴와 같은 옵션 조합이 있는지 확인
    const existingItem = cartItems.find(item => {
      if (item.id !== menu.id) return false;
      const itemOptionsKey = JSON.stringify((item.options || []).map(opt => opt.id).sort());
      return itemOptionsKey === optionsKey;
    });
    
    if (existingItem) {
      // 재고 확인 (장바구니에 있는 수량 + 1이 재고보다 많으면 안됨)
      if (existingItem.quantity + 1 > inventoryItem.stock) {
        showToast(`${menu.name}의 재고가 부족합니다. (현재 재고: ${inventoryItem.stock}개)`);
        return;
      }
      
      setCartItems(cartItems.map(item =>
        item.cartId === existingItem.cartId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // 새로운 항목 추가 (고유한 cartId 생성)
      const cartId = `${menu.id}-${Date.now()}-${Math.random()}`;
      setCartItems([...cartItems, { 
        ...menu, 
        cartId,
        quantity: 1,
        options: options,
        price: totalPrice, // 옵션 포함 가격
        basePrice: menu.price // 기본 가격 저장
      }]);
    }
    
    const optionText = options.length > 0 
      ? ` (${options.map(opt => opt.name).join(', ')})`
      : '';
    showToast(`${menu.name}${optionText}이(가) 장바구니에 추가되었습니다.`);
  };

  const handleUpdateQuantity = (cartId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartId);
      return;
    }

    const cartItem = cartItems.find(item => item.cartId === cartId);
    if (cartItem) {
      const inventoryItem = inventory.find(inv => inv.id === cartItem.id);
      if (inventoryItem && newQuantity > inventoryItem.stock) {
        showToast(`${cartItem.name}의 재고가 부족합니다. (현재 재고: ${inventoryItem.stock}개)`);
        return;
      }
    }
    
    setCartItems(cartItems.map(item =>
      item.cartId === cartId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const handleRemoveItem = (cartId) => {
    setCartItems(cartItems.filter(item => item.cartId !== cartId));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      showToast('장바구니가 비어있습니다.');
      return;
    }

    // 재고 확인
    const stockCheck = checkStock(cartItems);
    if (!stockCheck.isValid) {
      showToast(stockCheck.issues.join(', '));
      return;
    }

    // 주문 추가
    const result = await addOrder(cartItems);
    
    if (result.success) {
      showToast(`주문이 완료되었습니다! 주문번호: ${result.orderNumber}`);
      setCartItems([]);
      setIsCartOpen(false);
    } else {
      showToast(result.message);
    }
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
            {loading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                메뉴를 불러오는 중...
              </div>
            ) : error ? (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '2rem',
                backgroundColor: '#ff4444',
                color: 'white',
                borderRadius: '8px',
                margin: '1rem 0'
              }}>
                <h3 style={{ marginBottom: '1rem' }}>⚠️ 메뉴를 불러올 수 없습니다</h3>
                <p style={{ marginBottom: '0.5rem' }}>{error}</p>
                <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1rem' }}>
                  브라우저 개발자 도구(F12) → Console 탭에서 자세한 오류를 확인하세요.
                </p>
                <button
                  onClick={async () => {
                    try {
                      await loadInventory();
                      await loadMenus();
                    } catch (err) {
                      console.error('재시도 실패:', err);
                    }
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'white',
                    color: '#ff4444',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  다시 시도
                </button>
              </div>
            ) : availableMenuItems.length === 0 ? (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '2rem',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
                margin: '1rem 0'
              }}>
                <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>메뉴가 없습니다.</p>
                <button
                  onClick={async () => {
                    try {
                      await loadInventory();
                      await loadMenus();
                    } catch (err) {
                      console.error('재시도 실패:', err);
                    }
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#ff6b9d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  메뉴 다시 불러오기
                </button>
              </div>
            ) : (
              availableMenuItems.map(menu => (
                <MenuCard
                  key={menu.id}
                  menu={menu}
                  onAddToCart={handleAddToCart}
                  isAvailable={menu.isAvailable}
                  stock={menu.stock}
                />
              ))
            )}
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

