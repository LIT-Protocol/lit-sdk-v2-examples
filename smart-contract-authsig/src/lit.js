import LitJsSdk from "@lit-protocol/sdk-browser";

const client = new LitJsSdk.LitNodeClient();

const getAccessControlConditions = (chain) => {
    // Checks if the user has at least 0 ETH
    return [
        {
          contractAddress: "",
          standardContractType: "",
          chain,
          method: "eth_getBalance",
          parameters: [":userAddress", "latest"],
          returnValueTest: {
            comparator: ">=",
            value: "0",
          },
        },
    ];
}

const constructAuthSig = (sig, hashString, address) => {
    return {
        sig,
        derivedVia: "EIP1271",
        address,
        signedMessage: hashString,
    }
}

class Lit {
  litNodeClient;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async encryptText(text, chain, hashString, address) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const { sig } = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const authSig = constructAuthSig(sig, hashString, address);
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(text);

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: getAccessControlConditions(chain),
      symmetricKey,
      authSig,
      chain: chain,
    });

    return {
        encryptedString,
        encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16"),
        authSig: JSON.stringify(authSig, null, "  ")
    };
  }

  async decryptText(encryptedString, encryptedSymmetricKey, chain, hashString, address) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const { sig } = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const authSig = constructAuthSig(sig, hashString, address);
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
        accessControlConditions: getAccessControlConditions(chain),
        toDecrypt: encryptedSymmetricKey,
        chain: chain,
        authSig,
    });
    
    const decryptedString = await LitJsSdk.decryptString(
        encryptedString,
        symmetricKey
    );
    return { decryptedString, authSig: JSON.stringify(authSig, null, "  ") };
  }
}

export default new Lit();
