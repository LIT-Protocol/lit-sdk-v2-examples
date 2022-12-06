import { useState } from 'react';
import lit from './lit';
import './App.css';

function App() {
  const noAuthError = "The access control condition check failed! You should have at least 1 Zora Custom Drop NFT to decrypt this string.";

  const [text, setText] = useState("");
  const [encryptedText, setEncryptedText] = useState(null);
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState("");
  const [decryptedText, setDecryptedText] = useState("");

  const encryptText = async () => {
    if (text.length === 0) {
      alert("Please enter a non-empty string!");
      return;
    }

    setDecryptedText("");

    const { encryptedString, encryptedSymmetricKey } = await lit.encryptText(text);
    setEncryptedText(encryptedString);
    setEncryptedSymmetricKey(encryptedSymmetricKey);
  }

  const decryptText = async () => {
    if (encryptedText === null) {
      alert("Please encrypt your string first!");
      return;
    }

    try {
      const decryptedString = await lit.decryptText(encryptedText, encryptedSymmetricKey);
      setDecryptedText(decryptedString);
    } catch (error) {
      alert(noAuthError);
    }
  }

  return (
    <div className="App">
      <h1>Encrypt & Decrypt a string using Lit SDK</h1>
      <div className="textAreas">
        <textarea type="text" onChange={e => setText(e.target.value)} placeholder="Type here..." />
        <textarea readOnly value={decryptedText} className="readOnly" />
      </div>
      <div>
        <button onClick={encryptText}>Encrypt</button>
        <button onClick={decryptText}>Decrypt</button>
      </div>
      {(encryptedText !== null && decryptedText.length === 0) && (
        <h3>String Encrypted: {encryptedText.size} bytes. Thanks for using Lit!</h3>
      )}
      {decryptedText.length > 0 && (
        <h3>String Decrypted: See the right text area</h3>
      )}
    </div>
  );
}

export default App;
