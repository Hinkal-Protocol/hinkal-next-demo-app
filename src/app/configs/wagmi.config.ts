import { http, createConfig } from "wagmi";
import { metaMask, coinbaseWallet, walletConnect } from "wagmi/connectors";
import { mainnet, polygon, arbitrum, optimism, base } from "wagmi/chains";

const chains = [mainnet, polygon, arbitrum, optimism, base] as const;

const PUBLIC_RPC_URLS: Record<number, string> = {
  [mainnet.id]: "https://ethereum-rpc.publicnode.com",
  [polygon.id]: "https://polygon-bor-rpc.publicnode.com",
  [arbitrum.id]: "https://arb1.arbitrum.io/rpc",
  [optimism.id]: "https://mainnet.optimism.io",
  [base.id]: "https://mainnet.base.org",
};

/*
wagmi.config.ts runs on the server when imported. createConfig immediately
calls WalletConnect's setup(), which tries to use indexedDB — a browser-only
API that doesn't exist in Node.js.

The guard typeof window === "undefined" ? null simply says: "if we're on the
server, don't even create the config."
*/

export const wagmiConfig = typeof window === "undefined" ? null : (() => {
  const transports = chains.reduce((acc, chain) => {
    acc[chain.id] = http(PUBLIC_RPC_URLS[chain.id]);
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
