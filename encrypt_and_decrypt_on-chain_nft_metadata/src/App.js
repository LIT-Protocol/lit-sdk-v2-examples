import './App.css';
import Nft from './Nft';
import { ethers } from 'ethers';
import Web3Modal from "web3modal";
import LitNft from "./artifacts/contracts/LitNft.sol/LitNft.json";
import { useEffect, useState } from 'react';
import lit from './lit';
import Modal from './Modal';

function App() {
  const litNFTContractAddress = "0xBb6fd36bf6E45FBd29321c8f915E456ED42fDc13";

  const web3Modal = new Web3Modal({ network: "mumbai", cacheProvider: true });
  const sampleNft = { name: "Test NFT-2", imageUrl: "https://picsum.photos/seed/picsum/200/300", description: "Akash" };

  const [litNftContract, setLitNftContract] = useState(null);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    const fetchNfts = async () => {
      const fetchedNfts = await litNftContract.fetchNfts();
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
    const { encryptedString, encryptedSymmetricKey } = await lit.encryptText(sampleNft.description);

    // Convert blob to base64 to pass as a string to Solidity
    const blobToBase64 = blob => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise(resolve => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    };
    const encryptedDescriptionString = await blobToBase64(encryptedString);

		let transaction = await litNftContract.mintLitNft(sampleNft.name, sampleNft.imageUrl, encryptedDescriptionString, encryptedSymmetricKey);
    await transaction.wait();

    const _nfts = await litNftContract.fetchNfts();
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

    setNfts(_nfts);
  }

  const showModal = () => {
    const mintNftButton = document.getElementById('modal');
    mintNftButton.classList.add('show');
  }

  return (
    <div className="App">
      <h1>Encrypt & Decrypt an On-Chain NFT Metadata using Lit SDK</h1>
      <div id='modal' className='hidden'>
        <Modal />
      </div>
      <div className='nfts'>
        {nfts.map((nft, idx) => {
          return (
            <Nft nft={nft} key={idx} />
          )
        })}
      </div>
      {/* <button className='mintNft' onClick={mintLitNft}>Mint Lit NFT</button> */}
      <button className='mintNft' onClick={showModal}>Mint Lit NFT</button>
    </div>
  );
}

export default App;
