import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './ReceiverMachine.css';

function ReceiverMachine({ currentTransaction }) {
  const [machineState, setMachineState] = useState('idle'); // idle, input, scanning, processing, dispense
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');
  const html5QrCodeRef = useRef(null);

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
      setError('Invalid PIN code!');
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

  useEffect(() => {
    if (machineState === 'scanning') {
      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;
      
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      
      html5QrCode.start(
        { facingMode: "environment" }, 
        config,
        (decodedText) => {
          if (currentTransaction && decodedText === currentTransaction.code) {
            html5QrCode.stop().then(() => {
              setMachineState('processing');
            }).catch(err => console.error("Error stopping scanner", err));
          } else {
            setError('Invalid QR code!');
          }
        },
        (errorMessage) => {
          // Failure callback, ignore to avoid spamming logs
        }
      ).catch((err) => {
        setError('Cannot access Camera: ' + err.message);
      });

      return () => {
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
          html5QrCodeRef.current.stop().catch(err => console.error("Error stopping scanner on unmount", err));
        }
      };
    }
  }, [machineState, currentTransaction]);

  const stopScanning = () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      html5QrCodeRef.current.stop().then(() => {
        setMachineState('idle');
        setError('');
      }).catch(err => {
        console.error(err);
        setMachineState('idle');
      });
    } else {
      setMachineState('idle');
    }
  };

  const resetMachine = () => {
    setMachineState('idle');
    setPinInput('');
    setError('');
  };

  const renderLocker = (type, isTarget) => {
    const isOpen = machineState === 'dispense' && isTarget;
    return (
      <div className={`locker ${type} ${isOpen ? 'open' : ''}`}>
        <div className="locker-interior">
          {isOpen && (
            <>
              <div className="glow"></div>
              {currentTransaction.itemIcon && <div className="item-inside-locker animate-fade-in">{currentTransaction.itemIcon}</div>}
            </>
          )}
        </div>
        <div className="locker-door">
          <div className="locker-handle"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="machine-wrapper">
      <div className="machine-header">GrabBox</div>
      
      <div className="machine-body">
        {/* Left Side: Lockers */}
        <div className="lockers-panel">
          {/* Row 1: Ambient */}
          <div className="locker-row">
            {renderLocker('ambient', false)}
            {renderLocker('ambient', false)}
            {renderLocker('ambient', false)}
          </div>
          {/* Row 2: Hot */}
          <div className="locker-row">
            {renderLocker('hot', false)}
            {renderLocker('hot', currentTransaction?.itemCategory === 'hot')}
            {renderLocker('hot', false)}
          </div>
          {/* Row 3: Cold */}
          <div className="locker-row">
            {renderLocker('cold', false)}
            {renderLocker('cold', currentTransaction?.itemCategory === 'cold')}
            {renderLocker('cold', false)}
          </div>
          {/* Row 4: Ambient */}
          <div className="locker-row">
            {renderLocker('ambient', false)}
            {renderLocker('ambient', currentTransaction?.itemCategory === 'ambient')}
            {renderLocker('ambient', false)}
          </div>
        </div>

        {/* Center: Interaction Interface */}
        <div className="center-panel">
          <div className="screen-bezel">
            <div className="screen">
              {machineState === 'idle' && (
                <div className="screen-content idle-screen animate-fade-in">
                  <h3>Welcome!</h3>
                  <p>Please enter PIN or scan QR to receive your item</p>
                  <button className="btn btn-primary w-full" style={{marginBottom: '0.5rem'}} onClick={() => setMachineState('input')}>
                    Enter PIN Code
                  </button>
                  <button className="btn btn-outline w-full" onClick={() => { setMachineState('scanning'); setError(''); }}>
                    📷 Scan QR Code
                  </button>
                </div>
              )}

              {machineState === 'input' && (
                <div className="screen-content input-screen animate-fade-in">
                  <h3>Enter PIN Code</h3>
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
                  <button className="btn-text" onClick={() => setMachineState('idle')}>Go Back</button>
                </div>
              )}

              {machineState === 'scanning' && (
                <div className="screen-content scanning-screen animate-fade-in">
                  <h3>Scan QR Code</h3>
                  <p style={{fontSize: '0.8rem', margin: '0.5rem 0'}}>Place QR code inside the camera frame</p>
                  {error && <div className="error-text">{error}</div>}
                  <div id="qr-reader" style={{ width: '100%', height: '250px', background: 'black', borderRadius: '8px', overflow: 'hidden' }}></div>
                  <button className="btn-text" onClick={stopScanning} style={{marginTop: '1rem'}}>Cancel</button>
                </div>
              )}

              {machineState === 'processing' && (
                <div className="screen-content processing-screen animate-fade-in">
                  <div className="speaker-icon">
                    🔊
                    <div className="wave"></div>
                    <div className="wave"></div>
                  </div>
                  <h3>Playing message...</h3>
                  <p className="message-text">"{currentTransaction?.message}"</p>
                </div>
              )}

              {machineState === 'dispense' && (
                <div className="screen-content dispense-screen animate-fade-in">
                  <div className="success-icon">✓</div>
                  <h3>Success!</h3>
                  <p>
                    {currentTransaction?.type === 'locker' 
                      ? 'Your locker has been opened.' 
                      : 'The system is dispensing your gift.'}
                  </p>
                  <button className="btn btn-outline" onClick={resetMachine} style={{marginTop: '1rem'}}>
                    Close
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
            <div className="slot-label">Dispense Slot</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceiverMachine;
