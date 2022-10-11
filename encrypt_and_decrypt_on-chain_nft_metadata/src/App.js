import './App.css';
import Nft from './Nft';
import { ethers } from 'ethers';
import Web3Modal from "web3modal";
import LitNft from "./artifacts/contracts/LitNft.sol/LitNft.json";

function App() {
  const litNFTContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const sampleNft = { name: "Sample NFT", imageUrl: "https://www.w3schools.com/images/w3schools_green.jpg", description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, odio!" };

  const mintLitNft = async () => {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();

		const litNftContract = new ethers.Contract(litNFTContractAddress, LitNft.abi, signer);
		let transaction = await litNftContract.mintLitNft(sampleNft.name, sampleNft.description, sampleNft.imageUrl);
    await transaction.wait();

    const nfts = await litNftContract.fetchNfts();
    console.log(nfts);
  }

  return (
    <div className="App">
      <h1>Encrypt & Decrypt an On-Chain NFT Metadata using Lit SDK</h1>
      <div className='nfts'>
        <Nft nft={sampleNft} />
      </div>
      <button onClick={mintLitNft}>Mint Lit NFT</button>
    </div>
  );
}

export default App;
