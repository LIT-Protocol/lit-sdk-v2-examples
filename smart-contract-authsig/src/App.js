import { useRef, useState } from 'react';
import lit from './lit';
import "./App.css";

function App() {

  // let encryptedString;
  let encryptedSymmetricKey;

  const encryptString = useRef();
  const hashString = useRef();
  const address = useRef();
  const chain = useRef();

  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");

  const encryptText = async () => {
    if (encryptString.length === 0) {
      alert("Please enter a non-empty string!");
      return;
    }

    setDecryptedText("");

    const encryptedResult = await lit.encryptText(encryptString.current.value);
    setEncryptedText(encryptedResult.encryptedString);
    // encryptedString = encryptedResult.encryptedString;
    encryptedSymmetricKey = encryptedResult.encryptedSymmetricKey;
  }

  const decryptText = async () => {
    if (encryptedText === null) {
      alert("Please encrypt your string first!");
      return;
    }

    try {
      const _decryptedString = await lit.decryptText(encryptedText, encryptedSymmetricKey);
      setDecryptedText(_decryptedString);
    } catch (error) {
      // alert(noAuthError);
    }
  }

  return (
    <div className="App">
      <h1>Smart Contract Authsig</h1>
      <div className="container">
        <div className="inputContainer">
          <h2>String to encrypt</h2>
          <input type="text" ref={encryptString} />
          <h2>Unhashed _hash parameter for isValidSugnature</h2>
          <input type="text" ref={hashString} />
          <h2>Address of the Smart Contract</h2>
          <input type="text" ref={address} />
          <h2>Chain</h2>
          <input type="text" ref={chain} />
        </div>
        <div className="authSig">
          <h2>Authsig Generated</h2>
        </div>
      </div>
      <div className="buttonsContainer">
        <button onClick={encryptText}>Encrypt</button>
        <button onClick={decryptText}>Decrypt</button>
      </div>
      {(encryptedText.size > 0 && decryptedText.length === 0) && (
        <h3>String Encrypted: {encryptedText.size} bytes. Thanks for using Lit!</h3>
      )}
      {decryptedText.length > 0 && (
        <h3>String Decrypted: {decryptedText}</h3>
      )}
    </div>
  );
}

export default App;
