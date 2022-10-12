import './App.css';
import Nft from './Nft';
import { ethers } from 'ethers';
import Web3Modal from "web3modal";
import LitNft from "./artifacts/contracts/LitNft.sol/LitNft.json";
import { useEffect, useState } from 'react';

function App() {
  const litNFTContractAddress = "0x4989960bD1Bcd3184125B93a3cC26fb2D5bDf149";

  const web3Modal = new Web3Modal({ network: "mumbai", cacheProvider: true });
  const sampleNft = { name: "Sample NFT", imageUrl: "https://www.w3schools.com/images/w3schools_green.jpg", description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, odio!" };

  const [litNftContract, setLitNftContract] = useState(null);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    const fetchNfts = async () => {
      const _nfts = await litNftContract.fetchNfts();
      console.log(_nfts);
      setNfts(_nfts);
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
		let transaction = await litNftContract.mintLitNft(sampleNft.name, sampleNft.description, sampleNft.imageUrl);
    await transaction.wait();

    const _nfts = await litNftContract.fetchNfts();
    console.log(_nfts);
    setNfts(_nfts);
  }

  const getAllNfts = () => {
    const _nfts = [];
    for (let idx = nfts.length - 1; idx > -1; idx--) {
      _nfts.push(<Nft nft={nfts[idx]} key={idx} />);
    }
    return _nfts;
  }

  return (
    <div className="App">
      <h1>Encrypt & Decrypt an On-Chain NFT Metadata using Lit SDK</h1>
      <div className='nfts'>
        {getAllNfts()}
      </div>
      <button onClick={mintLitNft}>Mint Lit NFT</button>
    </div>
  );
}

export default App;
