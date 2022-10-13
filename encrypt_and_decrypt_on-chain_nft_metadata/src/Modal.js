import React, { useState } from 'react'
import './Modal.css';

export default function Modal({ mintLitNft, closeModal }) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [imageUrl, setImageUrl] = useState("");

	const submitMintLitNft = async () => {
		mintLitNft(name, imageUrl, description);
		closeModalAndRemoveContents();
	}

	const closeModalAndRemoveContents = () => {
		setName("");
		setDescription("");
		setImageUrl("");
		closeModal();
	}

  return (
    <div className='modal'>
			<span className='modal__close' onClick={closeModalAndRemoveContents}>&times;</span>
			<h2>Enter NFT Details</h2>
			<input value={name} className='modal__input' type="text" required placeholder="Name" onChange={e => setName(e.target.value)} />
			<textarea value={description} className='modal__description' type="text" required onChange={e => setDescription(e.target.value)} placeholder="Description" />
			<input value={imageUrl} className='modal__input' type="text" required placeholder="Image URL" onChange={e => setImageUrl(e.target.value)} />
			<button disabled={!name || !description || !imageUrl} onClick={submitMintLitNft} className='modal__button'>Mint</button>
    </div>
  )
}
