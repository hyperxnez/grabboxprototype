import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './SenderApp.css';

function SenderApp({ onGenerateCode, currentTransaction, onReset }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: '',
    itemCategory: null,
    itemIcon: null,
    itemName: '',
    message: ''
  });

  const categoryOptions = {
    hot: [
      { id: 'hot_food', icon: '🍱', name: 'Cơm hộp Nóng' },
      { id: 'hot_soup', icon: '🍲', name: 'Súp/Canh Nóng' }
    ],
    cold: [
      { id: 'cold_drink', icon: '🥤', name: 'Trà sữa/Nước lạnh' },
      { id: 'cold_cake', icon: '🍰', name: 'Bánh ngọt/Kem' }
    ],
    ambient: [
      { id: 'amb_doc', icon: '📚', name: 'Tài liệu/Sách' },
      { id: 'amb_clothes', icon: '👕', name: 'Quần áo/Đồ khô' }
    ]
  };

  const handleSelectType = (type) => {
    setFormData({ ...formData, type });
    if (type === 'locker') {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const handleSelectCategory = (category) => {
    setFormData({ ...formData, itemCategory: category, itemIcon: null, itemName: '' });
  };

  const handleSelectItem = (icon, name) => {
    setFormData({ ...formData, itemIcon: icon, itemName: name });
    setStep(3);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerateCode(formData);
    setStep(4);
  };

  const resetFlow = () => {
    setFormData({ type: '', itemCategory: null, itemIcon: null, itemName: '', message: '' });
    setStep(1);
    onReset();
  };

  if (currentTransaction && step !== 4) {
     setStep(4);
  }

  return (
    <div className="mobile-app-wrapper">
      <div className="mobile-status-bar">
        <span>9:41</span>
        <div className="status-icons">
          <div className="icon signal"></div>
          <div className="icon wifi"></div>
          <div className="icon battery"></div>
        </div>
      </div>
      
      <div className="mobile-content">
        <div className="app-header-mobile">
          <h2>GrabBox App</h2>
          {step > 1 && step < 4 && (
            <button className="back-btn" onClick={() => {
              if (step === 2 && formData.itemCategory) {
                 // go back to category selection
                 setFormData({...formData, itemCategory: null});
              } else {
                 setStep(step - 1);
              }
            }}>
              ← Back
            </button>
          )}
        </div>

        <div className="step-container animate-fade-in">
          {step === 1 && (
            <div className="step-content">
              <h3>Chọn Dịch Vụ</h3>
              <p className="subtitle">Bạn muốn sử dụng dịch vụ nào?</p>
              
              <button 
                className="service-card"
                onClick={() => handleSelectType('locker')}
              >
                <div className="service-icon locker">📦</div>
                <div className="service-info">
                  <h4>Gửi đồ vào Locker</h4>
                  <p>Lưu trữ an toàn đa nhiệt độ</p>
                </div>
              </button>

              <button 
                className="service-card"
                onClick={() => handleSelectType('gift')}
              >
                <div className="service-icon gift">🎁</div>
                <div className="service-info">
                  <h4>Mua quà tặng</h4>
                  <p>Từ máy bán hàng tự động</p>
                </div>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              {!formData.itemCategory ? (
                <>
                  <h3>Phân Loại Đồ</h3>
                  <p className="subtitle">Chọn khu vực bảo quản phù hợp</p>
                  
                  <div className="category-grid">
                    <button 
                      className={`category-card ${formData.itemCategory === 'hot' ? 'selected' : ''}`}
                      onClick={() => handleSelectCategory('hot')}
                    >
                      <span className="icon hot">♨️</span>
                      <span>Khu Vực Nóng</span>
                    </button>
                    <button 
                      className={`category-card ${formData.itemCategory === 'cold' ? 'selected' : ''}`}
                      onClick={() => handleSelectCategory('cold')}
                    >
                      <span className="icon cold">❄️</span>
                      <span>Khu Vực Lạnh</span>
                    </button>
                    <button 
                      className={`category-card ${formData.itemCategory === 'ambient' ? 'selected' : ''}`}
                      onClick={() => handleSelectCategory('ambient')}
                    >
                      <span className="icon ambient">📦</span>
                      <span>Khu Vực Thường</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3>Chọn Vật Phẩm</h3>
                  <p className="subtitle">Mô phỏng vật phẩm gửi trong {
                    formData.itemCategory === 'hot' ? 'Khu Nóng' : 
                    formData.itemCategory === 'cold' ? 'Khu Lạnh' : 'Khu Thường'
                  }</p>

                  <div className="category-grid animate-fade-in">
                    {categoryOptions[formData.itemCategory].map(item => (
                      <button 
                        key={item.id}
                        className="category-card item-select"
                        onClick={() => handleSelectItem(item.icon, item.name)}
                      >
                        <span className="icon item-emoji">{item.icon}</span>
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h3>Gửi Lời Nhắn</h3>
              <p className="subtitle">Lời nhắn sẽ được phát qua loa Bluetooth</p>
              
              <div className="selected-item-preview">
                {formData.type === 'locker' && formData.itemIcon && (
                  <div className="preview-badge">
                    <span>Đang gửi:</span> {formData.itemIcon} {formData.itemName}
                  </div>
                )}
                {formData.type === 'gift' && (
                  <div className="preview-badge">
                    <span>Đang mua:</span> 🎁 Quà tặng bí mật
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="message-form">
                <div className="form-group">
                  <label>Nội dung lời nhắn thoại</label>
                  <textarea 
                    className="input-field" 
                    rows="4" 
                    placeholder="Ví dụ: Chúc em ngon miệng nha..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary w-full">
                  Hoàn Tất & Lấy Mã
                </button>
              </form>
            </div>
          )}

          {step === 4 && currentTransaction && (
            <div className="step-content success-state">
              <div className="success-icon animate-pulse-glow">✓</div>
              <h3>Tạo mã thành công!</h3>
              <p className="subtitle">Sử dụng mã dưới đây tại máy GrabBox</p>
              
              <div className="code-display">
                <span className="label">MÃ PIN</span>
                <span className="code">{currentTransaction.code}</span>
              </div>
              
              <div className="qr-placeholder">
                <QRCodeSVG value={currentTransaction.code} size={130} />
              </div>

              <div className="transaction-details">
                <p><strong>Loại:</strong> {currentTransaction.type === 'locker' ? 'Gửi Locker' : 'Mua Quà'}</p>
                {currentTransaction.itemCategory && (
                  <p><strong>Bảo quản:</strong> {
                    currentTransaction.itemCategory === 'hot' ? 'Khu Vực Nóng' : 
                    currentTransaction.itemCategory === 'cold' ? 'Khu Vực Lạnh' : 'Khu Vực Thường'
                  }</p>
                )}
                {currentTransaction.itemName && (
                  <p><strong>Vật phẩm:</strong> {currentTransaction.itemIcon} {currentTransaction.itemName}</p>
                )}
              </div>

              <button className="btn btn-outline w-full" onClick={resetFlow} style={{marginTop: '1.5rem'}}>
                Tạo Đơn Khác
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SenderApp;
