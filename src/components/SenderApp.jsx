import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './SenderApp.css';

function SenderApp({ onGenerateCode, currentTransaction, onReset }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: '',
    itemCategory: null,
    message: ''
  });

  const handleSelectType = (type) => {
    setFormData({ ...formData, type });
    if (type === 'locker') {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const handleSelectCategory = (category) => {
    setFormData({ ...formData, itemCategory: category });
    setStep(3);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerateCode(formData);
    setStep(4);
  };

  const resetFlow = () => {
    setFormData({ type: '', itemCategory: null, message: '' });
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
            <button className="back-btn" onClick={() => setStep(step - 1)}>
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
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h3>Gửi Lời Nhắn</h3>
              <p className="subtitle">Lời nhắn sẽ được phát qua loa Bluetooth</p>
              
              <form onSubmit={handleSubmit} className="message-form">
                <div className="form-group">
                  <label>Nội dung lời nhắn thoại (Mô phỏng)</label>
                  <textarea 
                    className="input-field" 
                    rows="4" 
                    placeholder="Nhập lời nhắn của bạn ở đây..."
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
                    currentTransaction.itemCategory === 'hot' ? 'Nóng' : 
                    currentTransaction.itemCategory === 'cold' ? 'Lạnh' : 'Thường'
                  }</p>
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
