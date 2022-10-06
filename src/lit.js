import LitJsSdk from "@lit-protocol/sdk-browser";

const client = new LitJsSdk.LitNodeClient();
const chain = "ethereum";

// const accessControlConditions = [
//   {
//     contractAddress: '',
//     standardContractType: '',
//     chain,
//     method: '',
//     parameters: [
//       ':userAddress',
//     ],
//     returnValueTest: {
//       comparator: '=',
//       value: '0x0b1C5E9E82393AD5d1d1e9a498BF7bAAC13b31Ee'
//     }
//   }
// ];

const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain,
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "1000000000000", // 0.000001 ETH
    },
  },
];

class Lit {
  litNodeClient;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async encryptFile(file) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({ file });

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    });

    return {
      encryptedFile: encryptedFile,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
    };
  }

  async decryptFile(encryptedFile, encryptedSymmetricKey) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    console.log("a");
    console.log(encryptedFile);
    console.log(encryptedSymmetricKey);
    console.log("b");
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    console.log("c");
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
        accessControlConditions: accessControlConditions,
        toDecrypt: encryptedSymmetricKey,
        chain,
        authSig
    });
    console.log("d");
    const decryptedFile = await LitJsSdk.decryptFile({
        file: encryptedFile,
        symmetricKey
    });
    console.log("e");
    console.log(decryptedFile);
    return decryptedFile;
  }
}

export default new Lit();
