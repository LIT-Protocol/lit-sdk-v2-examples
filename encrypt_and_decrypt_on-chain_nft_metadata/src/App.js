import './App.css';
import Nft from './Nft';

function App() {

  const sampleNft = { name: "Sample NFT", image: "https://www.w3schools.com/images/w3schools_green.jpg", description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, odio!" };

  return (
    <div className="App">
      <h1>Encrypt & Decrypt an On-Chain NFT Metadata using Lit SDK</h1>
      <div className='nfts'>
        <Nft nft={sampleNft} />
      </div>
    </div>
  );
}

export default App;
