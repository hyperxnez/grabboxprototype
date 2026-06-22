import { useState, useEffect } from 'react';
import './ReceiverMachine.css';

function ReceiverMachine({ currentTransaction }) {
  const [machineState, setMachineState] = useState('idle'); // idle, input, processing, dispense
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');

  const handleKeypadClick = (num) => {
    if (pinInput.length < 4) {
      setPinInput(prev => prev + num);
      setError('');
    }
  };

  const handleClear = () => {
    setPinInput('');
    setError('');
  };

  const handleSubmit = () => {
    if (pinInput.length !== 4) return;
    
    if (currentTransaction && pinInput === currentTransaction.code) {
      setMachineState('processing');
    } else {
      setError('Mã PIN không hợp lệ!');
      setPinInput('');
    }
  };

  useEffect(() => {
    if (machineState === 'processing') {
      // Simulate processing & playing message
      const timer = setTimeout(() => {
        setMachineState('dispense');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [machineState]);

  const resetMachine = () => {
    setMachineState('idle');
    setPinInput('');
    setError('');
  };

  return (
    <div className="machine-wrapper">
      {/* Machine physical body structure */}
      <div className="machine-header">GrabBox</div>
      
      <div className="machine-body">
        {/* Left Side: Lockers */}
        <div className="lockers-panel">
          <div className="locker-row">
            <div className="locker ambient"></div>
            <div className="locker ambient"></div>
          </div>
          <div className="locker-row">
            <div className={`locker hot ${machineState === 'dispense' && currentTransaction?.itemCategory === 'hot' ? 'open' : ''}`}>
               {machineState === 'dispense' && currentTransaction?.itemCategory === 'hot' && <div className="glow"></div>}
            </div>
            <div className={`locker cold ${machineState === 'dispense' && currentTransaction?.itemCategory === 'cold' ? 'open' : ''}`}>
               {machineState === 'dispense' && currentTransaction?.itemCategory === 'cold' && <div className="glow"></div>}
            </div>
          </div>
          <div className="locker-row">
            <div className={`locker ambient ${machineState === 'dispense' && currentTransaction?.itemCategory === 'ambient' ? 'open' : ''}`}>
               {machineState === 'dispense' && currentTransaction?.itemCategory === 'ambient' && <div className="glow"></div>}
            </div>
            <div className="locker ambient"></div>
          </div>
        </div>

        {/* Center: Interaction Interface */}
        <div className="center-panel">
          <div className="screen-bezel">
            <div className="screen">
              {machineState === 'idle' && (
                <div className="screen-content idle-screen animate-fade-in">
                  <h3>Xin Chào!</h3>
                  <p>Vui lòng nhập mã hoặc quét QR để nhận đồ</p>
                  <button className="btn btn-primary" onClick={() => setMachineState('input')}>
                    Nhập Mã PIN
                  </button>
                  <div className="qr-scan-area">
                    [Khu vực quét QR]
                  </div>
                </div>
              )}

              {machineState === 'input' && (
                <div className="screen-content input-screen animate-fade-in">
                  <h3>Nhập Mã PIN</h3>
                  <div className="pin-display">
                    {pinInput.padEnd(4, '•').split('').map((char, i) => (
                      <span key={i} className="pin-dot">{char}</span>
                    ))}
                  </div>
                  {error && <div className="error-text">{error}</div>}
                  
                  <div className="keypad">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <button key={num} className="key" onClick={() => handleKeypadClick(num.toString())}>
                        {num}
                      </button>
                    ))}
                    <button className="key action" onClick={handleClear}>C</button>
                    <button className="key" onClick={() => handleKeypadClick('0')}>0</button>
                    <button className="key action primary" onClick={handleSubmit}>OK</button>
                  </div>
                  <button className="btn-text" onClick={() => setMachineState('idle')}>Quay lại</button>
                </div>
              )}

              {machineState === 'processing' && (
                <div className="screen-content processing-screen animate-fade-in">
                  <div className="speaker-icon">
                    🔊
                    <div className="wave"></div>
                    <div className="wave"></div>
                  </div>
                  <h3>Đang phát lời nhắn...</h3>
                  <p className="message-text">"{currentTransaction?.message}"</p>
                </div>
              )}

              {machineState === 'dispense' && (
                <div className="screen-content dispense-screen animate-fade-in">
                  <div className="success-icon">✓</div>
                  <h3>Thành Công!</h3>
                  <p>
                    {currentTransaction?.type === 'locker' 
                      ? 'Tủ của bạn đã được mở.' 
                      : 'Hệ thống đang giao quà tặng cho bạn.'}
                  </p>
                  <button className="btn btn-outline" onClick={resetMachine} style={{marginTop: '1rem'}}>
                    Đóng
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="physical-speaker">
            <div className="speaker-grill"></div>
            <div className="speaker-label">Bluetooth Speaker</div>
          </div>
        </div>

        {/* Right Side: Vending System */}
        <div className="vending-panel">
          <div className="glass-window">
             <div className="shelves">
               <div className="shelf">
                 <div className="item gift-box">🎁</div>
                 <div className="item cup">🥤</div>
               </div>
               <div className="shelf"></div>
             </div>
             
             {/* Anti-drop system animation */}
             <div className={`anti-drop-system ${machineState === 'dispense' && currentTransaction?.type === 'gift' ? 'active' : ''}`}>
               <div className="platform">
                  {machineState === 'dispense' && currentTransaction?.type === 'gift' && (
                    <div className="item gift-box dropping">🎁</div>
                  )}
               </div>
               <div className="scissor-lift"></div>
             </div>
          </div>
          
          <div className="dispense-slot">
            <div className="slot-opening">
               {machineState === 'dispense' && currentTransaction?.type === 'gift' && (
                  <div className="item gift-box arrived animate-drop">🎁</div>
               )}
            </div>
            <div className="slot-label">Cửa Nhận Đồ</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceiverMachine;
