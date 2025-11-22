import { useState } from 'react';
import './OptionModal.css';

const OPTIONS = [
  { id: 'shot', name: '샷 추가', price: 500 },
  { id: 'syrup', name: '시럽 추가', price: 0 }
];

function OptionModal({ isOpen, onClose, menu, onConfirm }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  if (!isOpen) return null;

  const handleOptionToggle = (optionId) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const handleConfirm = () => {
    const options = OPTIONS.filter(opt => selectedOptions.includes(opt.id));
    onConfirm(options);
    setSelectedOptions([]);
    onClose();
  };

  const totalOptionPrice = OPTIONS
    .filter(opt => selectedOptions.includes(opt.id))
    .reduce((sum, opt) => sum + opt.price, 0);

  const totalPrice = menu.price + totalOptionPrice;

  return (
    <>
      <div 
        className="option-modal-overlay" 
        onClick={onClose}
        aria-label="옵션 선택 닫기"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Escape' || e.key === 'Enter') {
            onClose();
          }
        }}
      ></div>
      <div className="option-modal" role="dialog" aria-modal="true" aria-labelledby="option-modal-title">
        <div className="option-modal-header">
          <h2 id="option-modal-title">{menu.name}</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="옵션 선택 닫기"
          >
            ×
          </button>
        </div>
        <div className="option-modal-body">
          <div className="option-list">
            {OPTIONS.map(option => (
              <label key={option.id} className="option-item">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => handleOptionToggle(option.id)}
                />
                <span className="option-name">{option.name}</span>
                {option.price > 0 && (
                  <span className="option-price">+{option.price.toLocaleString()}원</span>
                )}
              </label>
            ))}
          </div>
          <div className="option-modal-footer">
            <div className="price-summary">
              <span className="base-price">기본 가격: {menu.price.toLocaleString()}원</span>
              {totalOptionPrice > 0 && (
                <span className="option-price-total">옵션: +{totalOptionPrice.toLocaleString()}원</span>
              )}
              <span className="total-price">총 가격: {totalPrice.toLocaleString()}원</span>
            </div>
            <button className="confirm-btn" onClick={handleConfirm}>
              장바구니에 담기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default OptionModal;

