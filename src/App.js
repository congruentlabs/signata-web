import { useEthers, useEtherBalance } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import logo from './logo.svg';
import './App.css';

function App() {

  const { activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Signata
        </p>
        <button onClick={() => activateBrowserWallet()}>
          Connect
        </button>
        {account && <p>Account: {account}</p>}
        {etherBalance && <p>Balance: {formatEther(etherBalance)}</p>}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
