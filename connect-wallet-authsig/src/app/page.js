'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useNetwork, useSigner } from 'wagmi'
import { ethConnect, disconnectWeb3 } from '@lit-protocol/lit-node-client'
import { LOCAL_STORAGE_KEYS } from '@lit-protocol/constants'
import { useEffect, useState } from 'react'

export default function Home() {
  const [authSig, setAuthSig] = useState(null)
  const [error, setError] = useState(null)

  const { address, isConnected, isDisconnected } = useAccount()
  const { data: signer } = useSigner()
  const { chain } = useNetwork()

  async function generateAuthSig(signer, address, chainId) {
    setAuthSig(null);
    setError(null);
    try {
      const newAuthSig = await ethConnect.signAndSaveAuthMessage({
        web3: signer.provider,
        account: address.toLowerCase(),
        chainId: chainId,
      });
      setAuthSig(newAuthSig);
    } catch (err) {
      console.error(err);
      setError(`Failed to sign auth message: ${err.message}`);
    }
  }

  // Fetch auth sig from local storage
  useEffect(() => {
    if (!authSig) {
      const storedAuthSig = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_SIGNATURE);
      if (storedAuthSig) {
        const parsedAuthSig = JSON.parse(storedAuthSig);
        setAuthSig(parsedAuthSig);
      }
    }
  }, [authSig])
  
  // Generate auth sig if not already generated and if wallet is connected
  useEffect(() => {
    if (!authSig && isConnected && signer) {
      generateAuthSig(signer, address, chain.id);
    }
  }, [authSig, isConnected, signer, address, chain])

  // Clear auth sig if wallet is disconnected
  useEffect(() => {
    if (isDisconnected) {
      disconnectWeb3();
      setAuthSig(null);
    }
  }, [isDisconnected])

  return (
    <main className="main">
      {error && 
        <div className='alert alert--error'>
          <p>❗️ {error}</p>
          <button className='alert__btn' onClick={() => generateAuthSig(signer, address, chain.id)}>
            Try again
          </button>
        </div>
      }
      {authSig && 
        <p className='alert alert--success'>🔐 Auth sig has been generated and stored in local storage under {' '}
          <code>{LOCAL_STORAGE_KEYS.AUTH_SIGNATURE}</code>
          !
        </p>
      }
      <ConnectButton />
    </main>
  )
}
