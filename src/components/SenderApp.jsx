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
      { id: 'hot_food', icon: '🍱', name: 'Hot Bento' },
      { id: 'hot_soup', icon: '🍲', name: 'Hot Soup' }
    ],
    cold: [
      { id: 'cold_drink', icon: '🥤', name: 'Cold Drink' },
      { id: 'cold_cake', icon: '🍰', name: 'Cake / Ice Cream' }
    ],
    ambient: [
      { id: 'amb_doc', icon: '📚', name: 'Books / Docs' },
      { id: 'amb_clothes', icon: '👕', name: 'Clothes' }
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
              <h3>Select Service</h3>
              <p className="subtitle">Which service would you like to use?</p>
              
              <button 
                className="service-card"
                onClick={() => handleSelectType('locker')}
              >
                <div className="service-icon locker">📦</div>
                <div className="service-info">
                  <h4>Send to Locker</h4>
                  <p>Multi-temperature secure storage</p>
                </div>
              </button>

              <button 
                className="service-card"
                onClick={() => handleSelectType('gift')}
              >
                <div className="service-icon gift">🎁</div>
                <div className="service-info">
                  <h4>Buy a Gift</h4>
                  <p>From the vending machine</p>
                </div>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              {!formData.itemCategory ? (
                <>
                  <h3>Item Category</h3>
                  <p className="subtitle">Select the appropriate storage zone</p>
                  
                  <div className="category-grid">
                    <button 
                      className={`category-card ${formData.itemCategory === 'hot' ? 'selected' : ''}`}
                      onClick={() => handleSelectCategory('hot')}
                    >
                      <span className="icon hot">♨️</span>
                      <span>Hot Zone</span>
                    </button>
                    <button 
                      className={`category-card ${formData.itemCategory === 'cold' ? 'selected' : ''}`}
                      onClick={() => handleSelectCategory('cold')}
                    >
                      <span className="icon cold">❄️</span>
                      <span>Cold Zone</span>
                    </button>
                    <button 
                      className={`category-card ${formData.itemCategory === 'ambient' ? 'selected' : ''}`}
                      onClick={() => handleSelectCategory('ambient')}
                    >
                      <span className="icon ambient">📦</span>
                      <span>Ambient Zone</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3>Select Item</h3>
                  <p className="subtitle">Simulate item to store in {
                    formData.itemCategory === 'hot' ? 'Hot Zone' : 
                    formData.itemCategory === 'cold' ? 'Cold Zone' : 'Ambient Zone'
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
              <h3>Add a Message</h3>
              <p className="subtitle">Message will be played via Bluetooth speaker</p>
              
              <div className="selected-item-preview">
                {formData.type === 'locker' && formData.itemIcon && (
                  <div className="preview-badge">
                    <span>Sending:</span> {formData.itemIcon} {formData.itemName}
                  </div>
                )}
                {formData.type === 'gift' && (
                  <div className="preview-badge">
                    <span>Buying:</span> 🎁 Mystery Gift
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="message-form">
                <div className="form-group">
                  <label>Voice message content</label>
                  <textarea 
                    className="input-field" 
                    rows="4" 
                    placeholder="e.g., Enjoy your meal!"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary w-full">
                  Complete & Get Code
                </button>
              </form>
            </div>
          )}

          {step === 4 && currentTransaction && (
            <div className="step-content success-state">
              <div className="success-icon animate-pulse-glow">✓</div>
              <h3>Success!</h3>
              <p className="subtitle">Use the code below at the GrabBox machine</p>
              
              <div className="code-display">
                <span className="label">PIN CODE</span>
                <span className="code">{currentTransaction.code}</span>
              </div>
              
              <div className="qr-placeholder">
                <QRCodeSVG value={currentTransaction.code} size={130} />
              </div>

              <div className="transaction-details">
                <p><strong>Type:</strong> {currentTransaction.type === 'locker' ? 'Locker Deposit' : 'Gift Purchase'}</p>
                {currentTransaction.itemCategory && (
                  <p><strong>Storage:</strong> {
                    currentTransaction.itemCategory === 'hot' ? 'Hot Zone' : 
                    currentTransaction.itemCategory === 'cold' ? 'Cold Zone' : 'Ambient Zone'
                  }</p>
                )}
                {currentTransaction.itemName && (
                  <p><strong>Item:</strong> {currentTransaction.itemIcon} {currentTransaction.itemName}</p>
                )}
              </div>

              <button className="btn btn-outline w-full" onClick={resetFlow} style={{marginTop: '1.5rem'}}>
                Create Another Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SenderApp;
