import { useState } from 'react';
import CoffeeImage from './CoffeeImage';
import './MenuCard.css';

const OPTIONS = [
  { id: 'shot', name: '샷 추가', price: 500 },
  { id: 'syrup', name: '시럽 추가', price: 0 }
];

function MenuCard({ menu, onAddToCart, isAvailable = true, stock = 0 }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionToggle = (optionId) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const handleAddToCartClick = () => {
    if (!isAvailable) return;
    
    const options = OPTIONS.filter(opt => selectedOptions.includes(opt.id));
    onAddToCart(menu, options);
    // 옵션 초기화
    setSelectedOptions([]);
  };

  const optionPrice = OPTIONS
    .filter(opt => selectedOptions.includes(opt.id))
    .reduce((sum, opt) => sum + opt.price, 0);
  
  const totalPrice = menu.price + optionPrice;

  return (
    <div className={`menu-card ${!isAvailable ? 'out-of-stock' : ''}`}>
      <div className="menu-image-wrapper">
        <CoffeeImage name={menu.name} image={menu.image} />
        {!isAvailable && (
          <div className="out-of-stock-overlay">
            <span className="out-of-stock-text">품절</span>
          </div>
        )}
      </div>
      <div className="menu-card-content">
        <h3 className="menu-name">{menu.name}</h3>
        <p className="menu-description">{menu.description}</p>
        {isAvailable && stock < 5 && stock > 0 && (
          <p className="stock-warning">재고: {stock}개 남음</p>
        )}
        
        {/* 옵션 선택 영역 */}
        {isAvailable && (
          <div className="menu-options">
            {OPTIONS.map(option => (
              <label key={option.id} className="option-checkbox">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => handleOptionToggle(option.id)}
                  disabled={!isAvailable}
                />
                <span className="option-label">
                  {option.name}
                  {option.price > 0 && (
                    <span className="option-price">+{option.price.toLocaleString()}원</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        )}

        <div className="menu-footer">
          <div className="price-info">
            {optionPrice > 0 && (
              <span className="base-price">{menu.price.toLocaleString()}원</span>
            )}
            <span className={`menu-price ${optionPrice > 0 ? 'with-options' : ''}`}>
              {totalPrice.toLocaleString()}원
            </span>
          </div>
          <button 
            className={`add-to-cart-btn ${!isAvailable ? 'disabled' : ''}`}
            onClick={handleAddToCartClick}
            disabled={!isAvailable}
          >
            {isAvailable ? '장바구니에 담기' : '품절'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;

