import './Sidebar.css';

function Sidebar() {
  const handlePhoneClick = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="sidebar">
      <button 
        className="sidebar-button"
        onClick={() => handlePhoneClick('4850-4850')}
      >
        4850-4850
      </button>
      <button className="sidebar-button">
        가맹점 인수 상담
      </button>
      <button className="sidebar-button">
        고객센터 문의/접수
      </button>
      <button 
        className="sidebar-button"
        onClick={() => handlePhoneClick('4850-4850')}
      >
        고객센터 4850-4850
      </button>
      <div className="sidebar-info">
        (25.11.20) 누적 3,998호 오픈
      </div>
    </div>
  );
}

export default Sidebar;

