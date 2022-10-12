import React, { useState } from 'react'
import './Nft.css'
import lit from './lit';

export default function Nft({ nft }) {

  const noAuthError = "You should have at least 0.1 MATIC to decrypt the description! Try again.";
  const [description, setDescription] = useState("Click the Decrypt button below to decrypt the NFT description.");

  const decryptDescription = async (encryptedDescriptionString, encryptedSymmetricKeyString) => {
    const encryptedDescriptionBlob = await (await fetch(encryptedDescriptionString)).blob();

    let decryptedDescription;
    try {
      decryptedDescription = await lit.decryptText(encryptedDescriptionBlob, encryptedSymmetricKeyString);
    } catch (error) {
      decryptedDescription = noAuthError;
    }
    setDescription(decryptedDescription);
  }

  return (
    <div className='nft'>
        <h2>{ nft.name }</h2>
        <div className='nft__divider'></div>
        <div className='nft__details'>
            <img src={nft.imageUrl} />
            <div className='nft__description'>
              { description }
              <button className='nft__decrypt' onClick={() => decryptDescription(nft.encryptedDescription, nft.encryptedSymmetricKey)}>Decrypt</button>
            </div>
        </div>
    </div>
  )
}
