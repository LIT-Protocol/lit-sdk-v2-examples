import React from 'react'
import './Nft.css'

export default function Nft({ nft }) {
  return (
    <div className='nft'>
        <h2>{ nft.name }</h2>
        <div className='nft__divider'></div>
        <div className='nft__details'>
            <img src={nft.imageUrl} />
            { nft.encryptedDescription }
        </div>
    </div>
  )
}
