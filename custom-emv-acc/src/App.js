import { useState } from 'react';
import lit from './lit';
import './App.css';

function App() {
  const text = "Encrypt with Lit!";
  const mismatchError = "Ensure that the ACC type corresponds to your input condition!";

  const [accText, setAccText] = useState("");
  const [accType, setAccType] = useState("");
  const [encryptedText, setEncryptedText] = useState(null);
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState("");
  const [decryptedText, setDecryptedText] = useState("");

  const getFormattedString = () => {
    let formattedAcc = accText.replace((/  |\r\n|\n|\r/gm),"");
    // formattedAcc = formattedAcc.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'').trim();
    return formattedAcc;
  }

  const getChain = () => {
    const formattedAcc = getFormattedString();
    const index = formattedAcc.search("chain");
    const endIndex = formattedAcc.indexOf('"', index + 8);
    const res = formattedAcc.slice(index + 8, endIndex);
    console.log("chain- ", res);
    return res;
  }

  const getAccObject = () => {
    const accObject = {
      accessControlConditions: undefined,
      evmContractConditions: undefined,
      solRpcConditions: undefined,
      unifiedAccessControlConditions: undefined
    };

    const formattedAcc = getFormattedString();
    console.log("formattedAcc- ", formattedAcc);
    const formattedAccObj = JSON.parse(JSON.stringify(eval(formattedAcc)));
    console.log("formattedAccObj- ", formattedAccObj);
    switch (accType) {
      case "evm-basic":
        accObject.accessControlConditions = formattedAccObj;
        break;
      case "evm-contract":
        accObject.evmContractConditions = formattedAccObj;
        break;
      case "solana":
        accObject.solRpcConditions = formattedAccObj;
        break;
      default:
        break;
    }
    return accObject;
  };

  const encryptText = async () => {
    if (accText.length === 0) {
      alert("Please enter a non-empty ACC!");
      return;
    }

    if (accType === "") {
      alert("Please select an ACC type");
      return;
    }

    setDecryptedText("");

    const accObject = getAccObject();
    console.log("accObject");
    console.log(accObject);
    try {
      const { encryptedString, encryptedSymmetricKey } = await lit.encryptText(text, getChain(), accObject);
      setEncryptedText(encryptedString);
      setEncryptedSymmetricKey(encryptedSymmetricKey);
    } catch (error) {
      alert(mismatchError);
    }
  }

  const decryptText = async () => {
    if (encryptedText === null) {
      alert("Please encrypt your string first!");
      return;
    }

    try {
      const accObject = getAccObject();
      const decryptedString = await lit.decryptText(encryptedText, encryptedSymmetricKey, getChain(), accObject);
      setDecryptedText(decryptedString);
    } catch (error) {
      alert(mismatchError);
    }
  }

  return (
    <div className="App">
      <h1>Custom Access Control Conditions with Lit SDK</h1>
      <div className="accInput">
        <textarea type="text" onChange={e => setAccText(e.target.value)} placeholder="Access Control Conditions..." />
        <div className="accDisplay">
          <select value={accType} onChange={(e) => setAccType(e.target.value)}>
            <option value="">--Please choose an ACC type--</option>
            <option value="evm-basic">Standard EVM</option>
            <option value="evm-contract">Custom EVM</option>
            <option value="solana">Solana</option>
          </select>
          {(encryptedText !== null && decryptedText.length === 0) && (
            <h3>String Encrypted: {encryptedText.size} bytes.</h3>
          )}
          {decryptedText.length > 0 && (
            <h3>String Decrypted: {decryptedText}</h3>
          )}
        </div>
      </div>
      <div>
        <button onClick={encryptText}>Encrypt</button>
        <button onClick={decryptText}>Decrypt</button>
      </div>
    </div>
  );
}

export default App;
