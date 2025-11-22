import './InventoryStatus.css';

function InventoryStatus({ inventory, onUpdateInventory }) {
  const getStockStatus = (stock) => {
    if (stock === 0) return { text: '품절', color: '#FF6B6B' };
    if (stock < 5) return { text: '주의', color: '#FFD700' };
    return { text: '정상', color: '#50C878' };
  };

  const handleStockChange = (id, change) => {
    const item = inventory.find(i => i.id === id);
    if (item) {
      const newStock = Math.max(0, item.stock + change);
      onUpdateInventory(id, newStock);
    }
  };

  return (
    <div className="inventory-status">
      <div className="inventory-grid">
        {inventory.map(item => {
          const status = getStockStatus(item.stock);
          return (
            <div key={item.id} className="inventory-card">
              <div className="inventory-header">
                <h3 className="inventory-name">{item.name}</h3>
                <span 
                  className="inventory-status-badge"
                  style={{ backgroundColor: status.color }}
                >
                  {status.text}
                </span>
              </div>
              <div className="inventory-stock">
                <span className="inventory-stock-label">현재 재고:</span>
                <span className="inventory-stock-value">{item.stock}개</span>
              </div>
              <div className="inventory-controls">
                <button
                  className="inventory-btn decrease"
                  onClick={() => handleStockChange(item.id, -1)}
                  disabled={item.stock === 0}
                >
                  -
                </button>
                <span className="inventory-stock-display">{item.stock}</span>
                <button
                  className="inventory-btn increase"
                  onClick={() => handleStockChange(item.id, 1)}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default InventoryStatus;

