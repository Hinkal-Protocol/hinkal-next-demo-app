import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { isMobile } from "react-device-detect";
import { useConfig, useConnectors } from "wagmi";
import type { Connector } from "wagmi";
import coinbaseLogo from "../../assets/coinbaseWalletLogo.png";
import metamaskLogo from "../../assets/metamaskWalletLogo.png";
import walletconnectLogo from "../../assets/walletconnectWalletLogo.png";
import { Modal } from "./Modal";
import { Spinner } from "./Spinner";
import { prepareWagmiHinkal } from "@gurg/hi-test/functions/providers/prepareWagmiHinkal";
import toast from "react-hot-toast";
import Image from "next/image";
import { useAppContext } from "../layouts/app";

interface ChooseWalletProps {
  isOpen: boolean;
  onHide: () => void;
  setShieldedAddress: Dispatch<SetStateAction<string | undefined>>;
  setIsConnecting?: Dispatch<SetStateAction<boolean>>;
}

export const ChooseWallet = ({
  isOpen,
  onHide,
  setShieldedAddress,
  setIsConnecting,
}: ChooseWalletProps) => {
  const connectors = useConnectors();
  const config = useConfig();

  const { setHinkal, setChainId, setDataLoaded } = useAppContext();

  const [connectingId, setConnectingId] = useState<string | null>(null);

  const handleSelectConnector = useCallback(
    async (connector: Connector) => {
      try {
        setIsConnecting?.(true);
        setConnectingId(connector.id);
        const hinkal = await prepareWagmiHinkal(connector, config);
        setHinkal(hinkal);
        setShieldedAddress(hinkal.getShieldedPublicKey());
        const providerAdapter = hinkal.getProviderAdapter();
        const chainId = providerAdapter.getChainId();
        if (!chainId) throw new Error("Chain id not found");
        setChainId(chainId);
        setDataLoaded(true);
        onHide();
      } catch (err) {
        toast.error(`Wallet connection failed: ${err || "Unknown error"}`);
      } finally {
        setConnectingId(null);
        setIsConnecting?.(false);
      }
    },
    [
      setIsConnecting,
      config,
      setHinkal,
      setShieldedAddress,
      setChainId,
      setDataLoaded,
      onHide,
    ],
  );

  const getConnectorLogo = (connectorName: string) => {
    switch (connectorName) {
      case "Coinbase Wallet":
        return coinbaseLogo;
      case "MetaMask":
        return metamaskLogo;
      case "WalletConnect":
        return walletconnectLogo;
      default:
        return null;
    }
  };

  return (
    <Modal
      xBtn
      xBtnAction={onHide}
      isOpen={isOpen}
      styleProps="md:w-[30%] md:ml-[5%] !bg-white rounded-[10px] mt-[-5%]"
      stylePropsBg="bg-[#000000b2]"
      xBtnStyleProps="text-black font-black"
    >
      <h1 className="font-[500] text-2xl p-5 text-black">Select Wallet</h1>
      <div className="p-5 pb-10 flex flex-col items-center gap-y-5">
        {connectors
          .filter((connector) =>
            isMobile ? connector.name === "WalletConnect" : true,
          )
          .map((connector) => {
            const logo = getConnectorLogo(connector.name);
            return (
              <button
                className="bg-modal px-4 py-2 min-w-[180px] w-[80%] rounded-lg border-[2.5px] border-[#f0f0f0] hover:border-[#9c9c9c] font-bold duration-150 flex items-center justify-center gap-x-3 text-black"
                type="button"
                disabled={!!connectingId}
                key={connector.id}
                onClick={() => handleSelectConnector(connector)}
              >
                {logo && (
                  <Image
                    src={logo}
                    alt={`${connector.name} logo`}
                    width={26}
                    height={26}
                  />
                )}
                <span className="text-black">{connector.name}</span>
                {connectingId === connector.id && <Spinner />}
              </button>
            );
          })}
      </div>
    </Modal>
  );
};
