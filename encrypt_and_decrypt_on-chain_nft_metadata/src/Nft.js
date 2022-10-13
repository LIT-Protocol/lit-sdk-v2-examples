import React, { useEffect, useState } from 'react'
import './Nft.css'
import lit from './lit';

export default function Nft({ nft }) {
  const decryptInfo = "Click the Decrypt button below to decrypt the NFT description.";
  const noAuthError = "You should have at least 0.1 MATIC to decrypt the description! Try again.";
  const otherError = "Some unexpected error occurred. Please try again!";

  const [description, setDescription] = useState(decryptInfo);
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    setDescription(decryptInfo);
    setShowButton(true);
  }, [nft]);

  const decryptDescription = async (encryptedDescriptionString, encryptedSymmetricKeyString) => {
    // Convert base64 to blob to pass in the litSDK decrypt function
    const encryptedDescriptionBlob = await (await fetch(encryptedDescriptionString)).blob();

    let decryptedDescription;
    try {
      decryptedDescription = await lit.decryptText(encryptedDescriptionBlob, encryptedSymmetricKeyString);
      setShowButton(false);
    } catch (error) {
      if (error.errorCode === "incorrect_access_control_conditions") {
        decryptedDescription = noAuthError;
      } else {
        decryptedDescription = otherError;
      }
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
              <textarea value={description} className='nft__description__text' type="text" readOnly />
              {showButton && (
                <button className='nft__decrypt' onClick={() => decryptDescription(nft.encryptedDescription, nft.encryptedSymmetricKey)}>Decrypt</button>
              )}
            </div>
        </div>
    </div>
  )
}
