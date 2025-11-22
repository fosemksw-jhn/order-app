import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ cartItems, onCartClick }) {
  const navigate = useNavigate();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <div className="logo-main">
            <span className="logo-text">HANNA</span>
            <div className="logo-cat">
              <svg width="50" height="50" viewBox="0 0 100 100" className="cat-svg">
                {/* 고양이 얼굴 */}
                <ellipse cx="50" cy="55" rx="35" ry="30" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2"/>
                
                {/* 왼쪽 귀 */}
                <path d="M 30 25 L 40 15 L 45 30 Z" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2"/>
                <path d="M 32 25 L 40 18 L 43 28 Z" fill="#FFC0CB"/>
                
                {/* 오른쪽 귀 */}
                <path d="M 70 25 L 60 15 L 55 30 Z" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2"/>
                <path d="M 68 25 L 60 18 L 57 28 Z" fill="#FFC0CB"/>
                
                {/* 왼쪽 눈 */}
                <ellipse cx="40" cy="50" rx="6" ry="8" fill="#000000"/>
                <circle cx="40" cy="48" r="2" fill="#FFFFFF"/>
                
                {/* 오른쪽 눈 */}
                <ellipse cx="60" cy="50" rx="6" ry="8" fill="#000000"/>
                <circle cx="60" cy="48" r="2" fill="#FFFFFF"/>
                
                {/* 코 */}
                <path d="M 50 58 L 47 63 L 53 63 Z" fill="#FF69B4"/>
                
                {/* 입 */}
                <path d="M 50 63 Q 45 68 40 66" stroke="#000000" strokeWidth="2" fill="none"/>
                <path d="M 50 63 Q 55 68 60 66" stroke="#000000" strokeWidth="2" fill="none"/>
                
                {/* 볼 홍조 */}
                <circle cx="30" cy="60" r="5" fill="#FFB6C1" opacity="0.6"/>
                <circle cx="70" cy="60" r="5" fill="#FFB6C1" opacity="0.6"/>
                
                {/* 수염 */}
                <line x1="20" y1="58" x2="30" y2="60" stroke="#000000" strokeWidth="1.5"/>
                <line x1="20" y1="65" x2="30" y2="65" stroke="#000000" strokeWidth="1.5"/>
                <line x1="20" y1="72" x2="30" y2="70" stroke="#000000" strokeWidth="1.5"/>
                <line x1="80" y1="58" x2="70" y2="60" stroke="#000000" strokeWidth="1.5"/>
                <line x1="80" y1="65" x2="70" y2="65" stroke="#000000" strokeWidth="1.5"/>
                <line x1="80" y1="72" x2="70" y2="70" stroke="#000000" strokeWidth="1.5"/>
              </svg>
            </div>
            <span className="logo-text">COFFEE</span>
          </div>
          <p className="logo-subtitle">BIG SIZE · 2 SHOT</p>
        </div>
        
        <nav className="header-nav">
          <a href="#" className="nav-link">HANNA 스토리</a>
          <a href="#" className="nav-link">메뉴소개</a>
          <a href="#" className="nav-link">매장</a>
          <a href="#" className="nav-link">창업안내</a>
          <a href="#" className="nav-link">HANNA소식</a>
          <a href="#" className="nav-link">채용</a>
        </nav>

        <div className="header-right">
          <div className="social-icons">
            <a href="#" className="social-icon" title="블로그">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </a>
            <a href="#" className="social-icon" title="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="#" className="social-icon" title="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>
          <button 
            className="admin-button" 
            onClick={() => navigate('/admin')}
            title="관리자 화면"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span className="admin-button-text">관리자</span>
          </button>
          <button className="cart-button" onClick={onCartClick}>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

