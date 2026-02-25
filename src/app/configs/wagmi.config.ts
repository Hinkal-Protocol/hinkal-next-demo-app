import { http, createConfig } from "wagmi";
import { metaMask, coinbaseWallet, walletConnect } from "wagmi/connectors";
import { networkRegistry } from "@hinkal/common";
import { mainnet, polygon, arbitrum, optimism, base } from "wagmi/chains";

const chains = [mainnet, polygon, arbitrum, optimism, base] as const;

/*
wagmi.config.ts runs on the server when imported. createConfig immediately
calls WalletConnect's setup(), which tries to use indexedDB — a browser-only
API that doesn't exist in Node.js.

The guard typeof window === "undefined" ? null simply says: "if we're on the
server, don't even create the config."
*/

export const wagmiConfig = typeof window === "undefined" ? null : (() => {
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
