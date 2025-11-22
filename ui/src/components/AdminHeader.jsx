import { useNavigate } from 'react-router-dom';
import './AdminHeader.css';

function AdminHeader() {
  const navigate = useNavigate();

  return (
    <header className="admin-header">
      <div className="admin-header-container">
        <div className="admin-logo">
          <div className="admin-logo-main">
            <span className="admin-logo-text">HANNA</span>
            <div className="admin-logo-cat">
              <svg width="50" height="50" viewBox="0 0 100 100" className="admin-cat-svg">
                <ellipse cx="50" cy="55" rx="35" ry="30" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2"/>
                <path d="M 30 25 L 40 15 L 45 30 Z" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2"/>
                <path d="M 32 25 L 40 18 L 43 28 Z" fill="#FFC0CB"/>
                <path d="M 70 25 L 60 15 L 55 30 Z" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2"/>
                <path d="M 68 25 L 60 18 L 57 28 Z" fill="#FFC0CB"/>
                <ellipse cx="40" cy="50" rx="6" ry="8" fill="#000000"/>
                <circle cx="40" cy="48" r="2" fill="#FFFFFF"/>
                <ellipse cx="60" cy="50" rx="6" ry="8" fill="#000000"/>
                <circle cx="60" cy="48" r="2" fill="#FFFFFF"/>
                <path d="M 50 58 L 47 63 L 53 63 Z" fill="#FF69B4"/>
                <path d="M 50 63 Q 45 68 40 66" stroke="#000000" strokeWidth="2" fill="none"/>
                <path d="M 50 63 Q 55 68 60 66" stroke="#000000" strokeWidth="2" fill="none"/>
                <circle cx="30" cy="60" r="5" fill="#FFB6C1" opacity="0.6"/>
                <circle cx="70" cy="60" r="5" fill="#FFB6C1" opacity="0.6"/>
                <line x1="20" y1="58" x2="30" y2="60" stroke="#000000" strokeWidth="1.5"/>
                <line x1="20" y1="65" x2="30" y2="65" stroke="#000000" strokeWidth="1.5"/>
                <line x1="20" y1="72" x2="30" y2="70" stroke="#000000" strokeWidth="1.5"/>
                <line x1="80" y1="58" x2="70" y2="60" stroke="#000000" strokeWidth="1.5"/>
                <line x1="80" y1="65" x2="70" y2="65" stroke="#000000" strokeWidth="1.5"/>
                <line x1="80" y1="72" x2="70" y2="70" stroke="#000000" strokeWidth="1.5"/>
              </svg>
            </div>
            <span className="admin-logo-text">ADMIN</span>
          </div>
        </div>
        
        <div className="admin-header-right">
          <button className="admin-nav-button" onClick={() => navigate('/')}>
            주문하기 화면으로 이동
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;

