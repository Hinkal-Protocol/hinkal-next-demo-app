"use client";
import {
  ERC20Token,
  EthereumNetwork,
  Hinkal,
  getERC20Registry,
  networkRegistry,
  preProcessing,
} from "@sabaaa1/common";
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Connector, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { getWagmiConfig } from "../../configs/wagmi.config";

type AppContextArgumnets = {
  hinkal: Hinkal<Connector>;
  chainId?: number;
  setChainId: (num: number) => void;
  selectedNetwork: EthereumNetwork | undefined;
  setSelectedNetwork: (net: EthereumNetwork) => void;
  erc20List: ERC20Token[];
};
type AppContextProps = { children: ReactNode };

preProcessing();

const queryClient = new QueryClient();
const hinkalInstance = new Hinkal<Connector>();

const AppContext = createContext<AppContextArgumnets>({
  hinkal: hinkalInstance,
  chainId: undefined,
  setChainId: (num: number) => num,
  selectedNetwork: undefined,
  setSelectedNetwork: (net: EthereumNetwork) => net,
  erc20List: [],
});

export const AppContextProvider: FC<AppContextProps> = ({
  children,
}: AppContextProps) => {
  const [hinkal] = useState<Hinkal<Connector>>(hinkalInstance);
  const [chainId, setChainId] = useState<number | undefined>();

  const [selectedNetwork, setSelectedNetwork] = useState<
    EthereumNetwork | undefined
  >(undefined);

  const networkList = useMemo(() => Object.values(networkRegistry), []);

  useEffect(() => {
    const network = networkList.find((net) => net.chainId === chainId);
    setSelectedNetwork(network);
  }, [chainId, networkList]);

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
      <WagmiProvider config={getWagmiConfig()}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
