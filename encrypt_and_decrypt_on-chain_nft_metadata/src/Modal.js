import React, { useState } from 'react'
import './Modal.css';

export default function Modal({ mintLitNft }) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [imageUrl, setImageUrl] = useState("");

  return (
    <div className='modal hidden'>
			<h2>Enter NFT Details</h2>
			<input value={name} className='modal__input' type="text" required placeholder="Name" onChange={e => setName(e.target.value)} />
			<textarea value={description} className='modal__description' type="text" required onChange={e => setDescription(e.target.value)} placeholder="Description" />
			<input value={imageUrl} className='modal__input' type="text" required placeholder="Image URL" onChange={e => setImageUrl(e.target.value)} />
			<button disabled={!name || !description || !imageUrl} onClick={() => mintLitNft(name, imageUrl, description)} className='modal__button'>Decrypt</button>
    </div>
  )
}
