import LitJsSdk from "@lit-protocol/sdk-browser";

const client = new LitJsSdk.LitNodeClient();
const chain = "solana"; // TODO: get from the user

// Checks if the user has at least 1 Zora Custom Drop NFT
// const evmContractConditions = [{
//     contractAddress: "0x115b90187d38dC0A9A9d6BdC8EC9b1f492964894",
//     chain: "ethereum",
//     functionName: "balanceOf",
//     // functionParams: ["0x7028956e9dBF459775Cc2E071BE4331B711E56Fa"],
//     functionParams: [":userAddress"],
//     functionAbi: {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         }
//       ],
//       "name": "balanceOf",
//       "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     returnValueTest: {
//       key: "",
//       comparator: ">=",
//       value: "0",
//     },
// }];

class Lit {
  litNodeClient;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async encryptText(text, { accessControlConditions, evmContractConditions, solRpcConditions, unifiedAccessControlConditions }) {
    if (!this.litNodeClient) {
        await this.connect();
    }
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

  async decryptText(encryptedString, encryptedSymmetricKey, { accessControlConditions, evmContractConditions, solRpcConditions, unifiedAccessControlConditions }) {
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
