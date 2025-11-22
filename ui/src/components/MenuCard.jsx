import CoffeeImage from './CoffeeImage';
import './MenuCard.css';

function MenuCard({ menu, onAddToCart }) {
  return (
    <div className="menu-card">
      <div className="menu-image-wrapper">
        <CoffeeImage name={menu.name} />
      </div>
      <div className="menu-card-content">
        <h3 className="menu-name">{menu.name}</h3>
        <p className="menu-description">{menu.description}</p>
        <div className="menu-footer">
          <span className="menu-price">{menu.price.toLocaleString()}원</span>
          <button 
            className="add-to-cart-btn"
            onClick={() => onAddToCart(menu)}
          >
            장바구니에 담기
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;

