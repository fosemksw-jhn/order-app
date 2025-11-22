import CoffeeImage from './CoffeeImage';
import './MenuCard.css';

function MenuCard({ menu, onAddToCart, isAvailable = true, stock = 0 }) {
  return (
    <div className={`menu-card ${!isAvailable ? 'out-of-stock' : ''}`}>
      <div className="menu-image-wrapper">
        <CoffeeImage name={menu.name} />
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
        <div className="menu-footer">
          <span className="menu-price">{menu.price.toLocaleString()}원</span>
          <button 
            className={`add-to-cart-btn ${!isAvailable ? 'disabled' : ''}`}
            onClick={() => onAddToCart(menu)}
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

