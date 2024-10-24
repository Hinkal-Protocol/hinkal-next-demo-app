'use client';
import { arbitrum, avalanche, bsc, hardhat, mainnet, optimism, polygon } from 'wagmi/chains';
import { http, createConfig } from 'wagmi';
import { metaMask } from '@wagmi/connectors'


export const getWagmiConfig = () => {
  return createConfig({
    ssr: true,
    chains: [mainnet, polygon, bsc, arbitrum, optimism, avalanche, hardhat],
    connectors: [metaMask()],
    transports: {
      [mainnet.id]: http(),
      [polygon.id]: http(),
      [bsc.id]: http(),
      [arbitrum.id]: http(),
      [optimism.id]: http(),
      [avalanche.id]: http(),
      [hardhat.id]: http(),
    },
  });
};
