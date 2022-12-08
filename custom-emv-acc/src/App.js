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

  const defaultAccList = {
    "evm-basic": [
      {
        contractAddress: '',
        standardContractType: '',
        chain: 'ethereum',
        method: 'eth_getBalance',
        parameters: [
          ':userAddress',
          'latest'
        ],
        returnValueTest: {
          comparator: '>=',
          value: '0' // at least 0 ETH
        }
      }
    ],
    "evm-contract": [{
      contractAddress: "0x115b90187d38dC0A9A9d6BdC8EC9b1f492964894",
      chain: "ethereum",
      functionName: "balanceOf",
      // functionParams: ["0x5a94f1491044953d3874fabfac75df21bf31893b"],
      functionParams: [":userAddress"],
      functionAbi: {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        returnValueTest: {
          key: "",
          comparator: ">=",
          value: "0",
        },
    }],
    "solana": [
      {
        method: "getBalance",
        params: [":userAddress"],
        pdaParams: [],
        pdaInterface: { offset: 0, fields: {} },
        pdaKey: "",
        chain: "solana",
        returnValueTest: {
          key: "",
          comparator: ">=",
          value: "0", // equals 0 SOL
        },
      },
    ]
  };
  
  const updateAccType = (newAccType) => {
      console.log(newAccType);
      setAccType(newAccType);
      const defaultAcc = JSON.stringify(defaultAccList[newAccType]) || "";
      setAccText(defaultAcc);
  }

  const getAccObject = () => {
    const accObject = {
      accessControlConditions: undefined,
      evmContractConditions: undefined,
      solRpcConditions: undefined,
      unifiedAccessControlConditions: undefined
    };

    const formattedAccObj = JSON.parse(JSON.stringify(eval(accText)));
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
    return [accObject, formattedAccObj[0].chain];
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

    const [accObject, chain] = getAccObject();
    try {
      const { encryptedString, encryptedSymmetricKey } = await lit.encryptText(text, chain, accObject);
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
      const [accObject, chain] = getAccObject();
      const decryptedString = await lit.decryptText(encryptedText, encryptedSymmetricKey, chain, accObject);
      setDecryptedText(decryptedString);
    } catch (error) {
      alert(mismatchError);
    }
  }

  return (
    <div className="App">
      <h1>Custom Access Control Conditions with Lit SDK</h1>
      <div className="accInput">
        <textarea value={accText} type="text" onChange={e => setAccText(e.target.value)} placeholder="Select an ACC type" />
        <div className="accDisplay">
          <select value={accType} onChange={(e) => updateAccType(e.target.value)}>
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
      <h3>Verify your condition on:{" "}
        <a href="https://lit-accs-debugger.vercel.app/" target="_blank">
          https://lit-accs-debugger.vercel.app/
        </a>
      </h3>
    </div>
  );
}

export default App;
