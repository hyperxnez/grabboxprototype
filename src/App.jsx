import { useState } from 'react';
import SenderApp from './components/SenderApp';
import ReceiverMachine from './components/ReceiverMachine';
import './App.css';

function App() {
  const [transaction, setTransaction] = useState(null);
  /* 
    transaction = {
      code: string,
      type: 'locker' | 'gift',
      itemCategory: 'cold' | 'hot' | 'ambient' | null,
      message: string
    }
  */

  const handleGenerateCode = (data) => {
    // Generate a random 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setTransaction({ ...data, code });
  };

  const handleReset = () => {
    setTransaction(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>GrabBox Prototype</h1>
        <p>Interactive demonstration of Sender App & Receiver Machine</p>
      </header>
      
      <main className="split-view">
        <section className="view-pane pane-left">
          <div className="pane-header">
            <h2>Sender App</h2>
            <span className="badge">Mobile Interface</span>
          </div>
          <div className="device-mockup mobile">
            <SenderApp 
              onGenerateCode={handleGenerateCode} 
              currentTransaction={transaction}
              onReset={handleReset}
            />
          </div>
        </section>

        <section className="view-pane pane-right">
          <div className="pane-header">
            <h2>GrabBox Machine</h2>
            <span className="badge">Physical Kiosk</span>
          </div>
          <div className="device-mockup machine">
            <ReceiverMachine currentTransaction={transaction} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
