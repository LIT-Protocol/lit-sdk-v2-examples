import './App.css';
import Nft from './Nft';
import { ethers } from 'ethers';
import Web3Modal from "web3modal";
import LitNft from "./artifacts/contracts/LitNft.sol/LitNft.json";
import { useEffect, useState } from 'react';
import lit from './lit';

function App() {
  const litNFTContractAddress = "0xBb6fd36bf6E45FBd29321c8f915E456ED42fDc13";

  const web3Modal = new Web3Modal({ network: "mumbai", cacheProvider: true });
  const sampleNft = { name: "Test NFT", imageUrl: "https://picsum.photos/id/237/200/300", description: "Test" };

  const [litNftContract, setLitNftContract] = useState(null);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    const fetchNfts = async () => {
      console.log("a");
      const fetchedNfts = await litNftContract.fetchNfts();
      console.log(fetchedNfts);
      getDisplayNfts(fetchedNfts);
    }
    if (litNftContract !== null) {
      fetchNfts();
    }
  }, [litNftContract]);

  const connectWallet = async () => {
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const _litNftContract = new ethers.Contract(litNFTContractAddress, LitNft.abi, signer);
    setLitNftContract(_litNftContract);
  }

  const mintLitNft = async () => {
    console.log("c");
    const { encryptedString, encryptedSymmetricKey } = await lit.encryptText(sampleNft.description);
    console.log(encryptedString);
    console.log(encryptedSymmetricKey);

    console.log("d");
    const encryptedDescriptionString = await encryptedString.text();
    console.log(encryptedDescriptionString);

    console.log("e");
		let transaction = await litNftContract.mintLitNft(sampleNft.name, sampleNft.imageUrl, encryptedDescriptionString, encryptedSymmetricKey);
    await transaction.wait();

    console.log("f");
    const _nfts = await litNftContract.fetchNfts();
    console.log(_nfts);
    await getDisplayNfts(_nfts);
  }

  const getDisplayNfts = (fetchedNfts) => {
    const _nfts = [];
    let nft = {};
    for (let idx = fetchedNfts.length - 1; idx > -1; idx--) {
      const { name, imageUrl, encryptedDescription, encryptedSymmetricKey } = fetchedNfts[idx];
      nft = { name, imageUrl, encryptedDescription, encryptedSymmetricKey }
      _nfts.push(nft);
    }

    console.log("b");
    console.log(_nfts);
    setNfts(_nfts);
  }

  return (
    <div className="App">
      <h1>Encrypt & Decrypt an On-Chain NFT Metadata using Lit SDK</h1>
      <div className='nfts'>
        {nfts.map((nft, idx) => {
          return (
            <Nft nft={nft} key={idx} />
          )
        })}
      </div>
      <button onClick={mintLitNft}>Mint Lit NFT</button>
    </div>
  );
}

export default App;
