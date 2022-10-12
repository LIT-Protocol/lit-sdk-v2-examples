import React, { useState } from 'react'
import './Nft.css'
import lit from './lit';

export default function Nft({ nft }) {

  const noAuthError = "You should have at least 0.1 MATIC to decrypt the description! Try again.";
  const [description, setDescription] = useState("Click the Decrypt button below to decrypt the NFT description.");

  const decryptDescription = async (encryptedDescriptionString, encryptedSymmetricKeyString) => {
    console.log("0");
    console.log(encryptedDescriptionString);

    // const encryptedDescriptionBlob = new Blob([encryptedDescriptionString], {
    //   type: 'text/plain'
    // });
    const encryptedDescriptionBlob = await (await fetch(encryptedDescriptionString)).blob();
    console.log("1");
    console.log(encryptedDescriptionBlob);
    // const encryptedSymmetricKeyUintArray = new TextEncoder().encode(encryptedSymmetricKeyString);
    // console.log(encryptedSymmetricKeyUintArray);

    let decryptedDescription;
    try {
      console.log("2");
      decryptedDescription = await lit.decryptText(encryptedDescriptionBlob, encryptedSymmetricKeyString);
    } catch (error) {
      console.log("3: error");
      console.log(error);
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
