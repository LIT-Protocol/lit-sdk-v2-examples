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
  const [authSig, setAuthSig] = useState("");
  const [decryptedText, setDecryptedText] = useState("");

  const encryptText = async () => {
    if (encryptString.current.value.length === 0) {
      alert("Please enter a non-empty string!");
      return;
    }

    if (address.current.value.length === 0) {
      alert("Please enter a non-empty address!");
      return;
    }

    setEncryptedText("");
    setAuthSig("");
    setDecryptedText("");

    try {
      const encryptedResult = await lit.encryptText(
        encryptString.current.value,
        chain.current.value,
        hashString.current.value,
        address.current.value
      );
      setEncryptedText(encryptedResult.encryptedString);
      setAuthSig(encryptedResult.authSig);
      encryptedSymmetricKey.current = encryptedResult.encryptedSymmetricKey;
    } catch(e) {
      alert("Smart Contract not authorized or Invalid params passed! Please check the console for a more detailed error");
    }
  }

  const decryptText = async () => {
    if (encryptedText === "") {
      alert("Please encrypt your string first!");
      return;
    }

    try {
      const { decryptedString, authSig} = await lit.decryptText(
        encryptedText,
        encryptedSymmetricKey.current,
        chain.current.value,
        hashString.current.value,
        address.current.value
      );
      setDecryptedText(decryptedString);
      setAuthSig(authSig);
    } catch (error) {
      // alert(noAuthError);
    }
  }

  return (
    <div className="App">
      <h1>Smart Contract Authsig using EIP1271</h1>
      <h3>To understand the EIP1271 Authsig please check out our{" "}
        <a href="https://developer.litprotocol.com/toolsandexamples/sdkexamples/smartcontractauthsig/" target="_blank">
          tutorial
        </a>
      </h3>
      <div className="container">
        <div className="inputContainer">
          <h2>String to encrypt</h2>
          <input type="text" defaultValue={"Lit is 🔥"} ref={encryptString} />
          <h2>Unhashed _hash parameter for isValidSignature</h2>
          <input type="text" defaultValue={"_hash"} ref={hashString} />
          <h2>Address of the Smart Contract</h2>
          <input type="text" defaultValue={"0x6FdF5aD7f256D9677eC1d6B7e633Ff1E7FA5Ac14"} ref={address} />
          <h2>Above Contract's Chain</h2>
          <input type="text" defaultValue={"mumbai"} ref={chain} />
        </div>
        <div className="authSig">
          <h2>Authsig Generated</h2>
          <textArea>{authSig}</textArea>
        </div>
      </div>
      <div className="buttonsContainer">
        <button onClick={encryptText}>Encrypt</button>
        <button onClick={decryptText}>Decrypt</button>
      </div>
      {(encryptedText !== "" && decryptedText.length === 0) && (
        <h2>String Encrypted: {encryptedText.size} bytes. Thanks for using Lit!</h2>
      )}
      {decryptedText.length > 0 && (
        <h2>String Decrypted: {decryptedText}</h2>
      )}
    </div>
  );
}

export default App;
