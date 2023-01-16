import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Smart Contract Authsig</h1>
      <div className="container">
        <div className="inputContainer">
          <h2>String to encrypt</h2>
          <input type="text" />
          <h2>Unhashed _hash parameter for isValidSugnature</h2>
          <input type="text" />
          <h2>Address of the Smart Contract</h2>
          <input type="text" />
          <h2>Chain</h2>
          <input type="text" />
        </div>
        <div className="authSig">
          <h2>Authsig Generated</h2>
        </div>
      </div>
      <div className="buttonsContainer">
        <button>Encrypt</button>
        <button>Decrypt</button>
      </div>
    </div>
  );
}

export default App;
