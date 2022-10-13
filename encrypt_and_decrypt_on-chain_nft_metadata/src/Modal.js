import React, { useState } from 'react'
import './Modal.css';

export default function Modal() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [imageUrl, setImageUrl] = useState("");

  return (
    <div className='modal hidden'>
			<h2>Enter NFT Details</h2>
			<input className='modal__input' type="text" placeholder="Name" onChange={e => setName(e.target.value)} />
			<textarea className='modal__description' type="text" onChange={e => setDescription(e.target.value)} placeholder="Description" />
			<input className='modal__input' type="text" placeholder="Image URL" onChange={e => setImageUrl(e.target.value)} />
    </div>
  )
}
