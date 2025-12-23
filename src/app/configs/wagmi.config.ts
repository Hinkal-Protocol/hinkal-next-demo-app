import { http, createConfig } from "wagmi";
import { metaMask, coinbaseWallet, walletConnect } from "wagmi/connectors";
import { networkRegistry } from "@sabaaa1/common";
import {
  mainnet,
  polygon,
  bsc,
  arbitrum,
  optimism,
  avalanche,
} from "wagmi/chains";

const chains = [mainnet, polygon, bsc, arbitrum, optimism, avalanche] as const;

export const wagmiConfig = (() => {
  const transports = chains.reduce((acc, chain) => {
    const networkData = networkRegistry[chain.id];
    acc[chain.id] = http(networkData?.fetchRpcUrl || undefined);
    return acc;
  }, {} as Record<number, ReturnType<typeof http>>);

  return createConfig({
    chains: chains,
    connectors: [
      metaMask(),
      coinbaseWallet({ appName: "Your App Name" }),
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
      }),
    ],
    transports,
  });
})();
