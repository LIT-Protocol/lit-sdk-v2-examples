import { useRef, useState } from 'react';
import lit from './lit';
import "./App.css";

function App() {
  const encryptedSymmetricKey = useRef(null);
  const encryptString = useRef(null);
  const hashString = useRef(null);
  const address = useRef(null);
  const chain = useRef(null);

  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");

  const encryptText = async () => {
    if (encryptString.current.value.length === 0) {
      alert("Please enter a non-empty string!");
      return;
    }

    setDecryptedText("");

    const encryptedResult = await lit.encryptText(encryptString.current.value, chain.current.value);
    setEncryptedText(encryptedResult.encryptedString);
    encryptedSymmetricKey.current = encryptedResult.encryptedSymmetricKey;
  }

  const decryptText = async () => {
    if (encryptedText === "") {
      alert("Please encrypt your string first!");
      return;
    }

    try {
      const _decryptedString = await lit.decryptText(encryptedText, encryptedSymmetricKey.current, chain.current.value);
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
      {(encryptedText !== "" && decryptedText.length === 0) && (
        <h3>String Encrypted: {encryptedText.size} bytes. Thanks for using Lit!</h3>
      )}
      {decryptedText.length > 0 && (
        <h3>String Decrypted: {decryptedText}</h3>
      )}
    </div>
  );
}

export default App;
