import { AnchorProvider } from '@coral-xyz/anchor'
import { useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react'
import { AnchorWallet } from '@solana/wallet-adapter-react'
import { Connection, clusterApiUrl } from '@solana/web3.js'

const NETWORK = {
  'Solana Mainnet': 'mainnet-beta',
  'Solana Testnet': 'testnet',
  'Solana Devnet': 'devnet',
}

export function useAnchorProvider() {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
  const { walletProvider } = useAppKitProvider<any>('solana')

  const { caipNetwork } = useAppKitNetwork()
  const cluster = NETWORK[caipNetwork?.name as keyof typeof NETWORK]

  const provider = new AnchorProvider(
    connection,
    walletProvider as AnchorWallet,
    {
      commitment: 'confirmed',
    },
  )
  return { provider, cluster }
}