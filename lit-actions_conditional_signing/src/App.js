import { useRef, useState } from 'react';
import LitJsSdk from "lit-js-sdk";
import './App.css';

function App() {
  const [returnedJson, setReturnedJson] = useState("");
  const [signature, setSignature] = useState("");

  const minBalanceRef = useRef();
  const nameRef = useRef();

  const runLitActions = async (e) => {
    e.preventDefault();
    const litActionCode = `
      const go = async () => {
        const satisfyConditions = await LitActions.checkConditions({ conditions, authSig, chain });
        const currentTimestamp = (new Date()).getTime();
        const afterOneMinute = (currentTimestamp - signedTimestamp) >= 10 * 1000;
        if (!satisfyConditions || afterOneMinute) {
          return;
        }

        toSign = { minBalance, fullName, signedTimestamp, currentTimestamp };
        const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });
        LitActions.setResponse({ response: JSON.stringify(toSign) });
      };

      go();
    `;

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
    const litNodeClient = new LitJsSdk.LitNodeClient({ litNetwork: "serrano" });
    await litNodeClient.connect();
    const { signatures, response } = await litNodeClient.executeJs({
      code: litActionCode,
      authSig,
      jsParams: {
        conditions: [
          {
            conditionType: "evmBasic",
            contractAddress: "",
            standardContractType: "",
            chain: "ethereum",
            method: "eth_getBalance",
            parameters: [":userAddress", "latest"],
            returnValueTest: {
              comparator: ">=",
              value: `${minBalanceRef.current.value}`,
            },
          },
        ],
        minBalance: minBalanceRef.current.value,
        fullName: nameRef.current.value,
        signedTimestamp: (new Date()).getTime(),
        authSig,
        chain: "ethereum",
        publicKey: "0x032d68a742f4bfb0b2c4948ddc0dd69881b5292ef709fa64d9c37da88f1ac0aad5",
        sigName: "sig1",
      },
    });

    setReturnedJson(response !== "" ? JSON.stringify(response, null, 4) : "Doesn't satisfy Access Conditions");
    setSignature(response !== "" ? JSON.stringify(signatures?.sig1?.signature, null, 4): "Doesn't satisfy Access Conditions");
  }

  return (
    <div className="App">
      <h1>Conditionally Signed Response using Lit Actions</h1>
      <h2 className="info">Displays the returned JSON if your Ether balance {'>'}= Min balance you entered & if you signed the transaction within 10 seconds</h2>
      <div className="container">
        <div className="response">
          <h2>Returned JSON</h2>
          <div className="responseText__container">
            <textarea readOnly value={returnedJson} className="jsonResponse" />
            <div className="copy">Copy to Clipboard</div>
          </div>
          <h2>Signature</h2>
          <div className="responseText__container">
            <textarea readOnly value={signature} />
            <div className="copy">Copy to Clipboard</div>
          </div>
        </div>
        <div>
          <form onSubmit={runLitActions} className="userInputs">
            <h2>Minimum Balance</h2>
            <input ref={minBalanceRef} type="number" min="0" step="0.001" required placeholder="Min balance for signing" />
            <h2>Full Name</h2>
            <input ref={nameRef} type="text" required placeholder="Enter your full name" />
            <button type="submit">Run Lit Actions</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
