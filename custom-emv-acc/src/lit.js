import LitJsSdk from "@lit-protocol/sdk-browser";

const client = new LitJsSdk.LitNodeClient();

class Lit {
  litNodeClient;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async encryptText(text, chain, { accessControlConditions, evmContractConditions, solRpcConditions, unifiedAccessControlConditions }) {
    if (!this.litNodeClient) {
        await this.connect();
    }
    console.log("chain- ", chain);
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(text);

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
        accessControlConditions,
        evmContractConditions,
        solRpcConditions,
        unifiedAccessControlConditions,
        symmetricKey,
        authSig,
        chain,
    });

    return {
        encryptedString,
        encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
    };
  }

  async decryptText(encryptedString, encryptedSymmetricKey, chain, { accessControlConditions, evmContractConditions, solRpcConditions, unifiedAccessControlConditions }) {
    if (!this.litNodeClient) {
        await this.connect();
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
        accessControlConditions,
        evmContractConditions,
        solRpcConditions,
        unifiedAccessControlConditions,
        toDecrypt: encryptedSymmetricKey,
        chain,
        authSig
    });

    const decryptedString = await LitJsSdk.decryptString(
        encryptedString,
        symmetricKey
    );
    return decryptedString;
  }
}

export default new Lit();
