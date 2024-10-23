"use client";
import {
  ERC20Token,
  EthereumNetwork,
  Hinkal,
  getERC20Registry,
  networkRegistry,
} from "@hinkal/common";
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Connector, WagmiConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getWagmiConfig } from "../../data-structures/wagmi.config";
import { preProcessing } from "@hinkal/common";

preProcessing();

const queryClient = new QueryClient()

type AppContextArgumnets = {
  hinkal: Hinkal<Connector>;
  chainId?: number;
  setChainId: (num: number) => void;
  selectedNetwork: EthereumNetwork | undefined;
  setSelectedNetwork: (net: EthereumNetwork) => void;
  erc20List: ERC20Token[];
};

const hinkalInstance = new Hinkal<Connector>();

const AppContext = createContext<AppContextArgumnets>({
  hinkal: hinkalInstance,
  chainId: undefined,
  setChainId: (num: number) => { },
  selectedNetwork: undefined,
  setSelectedNetwork: (net: EthereumNetwork) => { },
  erc20List: [],
});

type AppContextProps = { children: ReactNode };

export const AppContextProvider: FC<AppContextProps> = ({
  children,
}: AppContextProps) => {
  const [hinkal, setHinkal] = useState<Hinkal<Connector>>(hinkalInstance);
  const [chainId, setChainId] = useState<number | undefined>();

  const [selectedNetwork, setSelectedNetwork] = useState<
    EthereumNetwork | undefined
  >(undefined);

  const networkList = useMemo(() => Object.values(networkRegistry), []);

  useEffect(() => {
    const network = networkList.find((net) => net.chainId === chainId);
    setSelectedNetwork(network);
  }, [chainId]);

  const erc20List = useMemo(
    () => (chainId ? getERC20Registry(chainId) : []),
    [chainId]
  );

  return (
    <AppContext.Provider
      value={{
        hinkal,
        chainId,
        setChainId,
        selectedNetwork,
        setSelectedNetwork,
        erc20List,
      }}
    >
      <WagmiConfig config={getWagmiConfig()}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiConfig>
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
