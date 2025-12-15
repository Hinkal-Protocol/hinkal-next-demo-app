import { TransactionRequest } from "@ethersproject/providers";
import {
  ChainEventListener,
  chainIds,
  ContractMetadata,
  contractMetadataMapping,
  ContractType,
  EthereumNetwork,
  IProviderAdapter,
  localhostNetwork,
  networkRegistry,
  transactionErrorCodes,
} from "@sabaaa1/common";
import { ethers, providers, Signer, utils } from "ethers";
import { Config, Connector } from "wagmi";
import {
  connect,
  disconnect,
  getAccount,
  signMessage,
  switchChain,
  watchAccount,
  watchChainId,
} from "wagmi/actions";

export class ProviderAdapter implements IProviderAdapter<Connector> {
  private connector: Connector;

  public chainId: number | undefined;

  private originalProvider: providers.Provider | undefined;

  private fetchProvider: providers.Provider | undefined;

  private signer: Signer | undefined;

  private chainEventListener?: ChainEventListener;

  private config: Config;

  private unsubscribeFns: Array<() => unknown> = [];

  constructor(connector: Connector, config: Config) {
    this.connector = connector;
    this.config = config;
  }

  initConnector(connector: Connector): void {
    this.connector = connector;
  }

  getSigner(): Signer {
    if (!this.signer) {
      throw new Error("IllegalState: signer not initialized");
    }
    return this.signer;
  }

  async switchAccount(signer: ethers.Signer): Promise<void> {
    await this.disconnectFromConnector();
    const chainId = await this.connectAndPatchProvider(this.connector);
    await this.init(chainId);
  }

  async init(chainId?: number) {
    // init chainId
    if (chainId) this.chainId = chainId;
    // init providers
    this.originalProvider = (await this.connector.getProvider()) as
      | providers.Provider
      | undefined;
    this.fetchProvider = this.createFetchProvider() ?? this.originalProvider;
    if (this.fetchProvider === this.originalProvider)
      console.warn("fetchProvider not available");
    // init signer
    const provider = await this.connector.getProvider();
    const account = await this.connector.getAccounts();

    this.signer = await this.walletClientToSigner(
      { transport: provider, account: account[0] },
      this.chainId!
    );
  }

  async disconnectFromConnector() {
    this.release();
    await disconnect(this.config); // metamask does not support programmic disconnect
  }

  async connectToConnector(connector: Connector): Promise<number> {
    const { isConnected } = getAccount(this.config);
    if (isConnected) await this.disconnectFromConnector();
    try {
      const connectResult = await connect(this.config, { connector });
      return connectResult.chainId;
    } catch (err) {
      console.log(err);
      throw new Error(transactionErrorCodes.CONNECTION_FAILED); // for a consistent error message
    }
  }

  async waitForTransaction(
    transactionHash: string,
    confirmations: number
  ): Promise<boolean> {
    const txReceipt = await this.fetchProvider?.waitForTransaction(
      transactionHash,
      confirmations
    );
    if (txReceipt?.status) return true;
    throw Error(transactionErrorCodes.TRANSACTION_NOT_CONFIRMED);
  }

  async signMessage(message: string): Promise<string> {
    const signature = await signMessage(this.config, { message });
    if (!signature) throw new Error(transactionErrorCodes.SIGNING_FAILED); // coinbase wallet returns undefined in some cases.
    if (signature.includes("error"))
      throw new Error(
        transactionErrorCodes.SIGNATURE_UNSUPPORTED_PERSONAL_SIGN
      );
    return signature;
  }

  async signTypedData(
    domain: ethers.TypedDataDomain,
    types: Record<string, ethers.TypedDataField[]>,
    value: Record<string, unknown>
  ): Promise<string> {
    return (this.signer as providers.JsonRpcSigner)._signTypedData(
      domain,
      types,
      value
    );
  }

  getSelectedNetwork = (): EthereumNetwork | undefined => {
    if (!this.chainId) throw new Error("Illegal state: no chaindId");
    return networkRegistry[this.chainId];
  };

  async switchNetwork(network: EthereumNetwork) {
    return switchChain(this.config, {
      chainId: network.chainId as 1 | 137 | 56 | 42161 | 10 | 43114 | 31337,
    });
  }

  private createFetchProvider() {
    try {
      const network = networkRegistry[this.chainId!];
      const fetchRpcUrl = network?.fetchRpcUrl;
      if (!fetchRpcUrl) {
        return undefined;
      }
      return fetchRpcUrl.includes("wss")
        ? new providers.WebSocketProvider(fetchRpcUrl)
        : new providers.StaticJsonRpcProvider(fetchRpcUrl);
    } catch (err) {
      console.log("create Fetch Provider error", err);
      return undefined;
    }
  }

  async getAddress(): Promise<string> {
    const { address } = getAccount(this.config);
    if (!address) {
      throw new Error("IllegalState");
    }
    return utils.getAddress(address);
  }

  setChainEventListener(chainEventListener: ChainEventListener): void {
    this.chainEventListener = chainEventListener;

    if (this.chainEventListener) {
      this.unsubscribeFns.push(
        watchAccount(this.config, {
          onChange: () => {
            if (!this.chainEventListener) {
              console.warn("chainEventListener is not set");
              return;
            }
            console.log("Account changed");
            this.chainEventListener.onAccountChanged();
          },
        })
      );
      this.unsubscribeFns.push(
        watchChainId(this.config, {
          onChange: (chainId) => {
            if (!this.chainEventListener) {
              console.warn("chainEventListener is not set");
              return;
            }
            console.log("Chain ID changed!", chainId);
            this.chainEventListener.onChainChanged(chainId);
          },
        })
      );
    }
  }

  onAccountChanged(): Promise<unknown> {
    return this.init();
  }

  onChainChanged(chainId?: number): Promise<unknown> {
    return this.init(chainId);
  }

  release(): void {
    this.removeListeners();
  }

  private removeListeners() {
    this.unsubscribeFns.forEach((unsubscribeFn) => unsubscribeFn());
    this.unsubscribeFns = [];
  }

  getContractMetadata(
    contractType: ContractType,
    chainId?: number
  ): ContractMetadata {
    const resultChainId = chainId ?? this.chainId;

    if (!resultChainId) {
      throw new Error("No chainId provided in context");
    }
    const network = networkRegistry[resultChainId];
    if (!network) {
      throw new Error(transactionErrorCodes.UNSUPPORTED_NETWORK);
    }
    const getContractMetadataFn = contractMetadataMapping[contractType];
    if (!getContractMetadataFn) {
      throw new Error(`Unsupported contractType: ${contractType}`);
    }
    return getContractMetadataFn(network.contractData);
  }

  getContract(
    contractType: ContractType,
    contractAddress = undefined,
    chainId?: number
  ): ethers.Contract {
    const contractMetadata: ContractMetadata = this.getContractMetadata(
      contractType,
      chainId
    );
    if (!contractMetadata.abi) {
      throw new Error(`No ABI configured for contractType: ${contractType}`);
    }
    if (contractMetadata.address && contractAddress) {
      throw new Error(
        `Overriding address is not supported for contractType: ${contractType}`
      );
    }
    const resultContractAddress = contractMetadata.address ?? contractAddress;
    if (!resultContractAddress) {
      throw new Error(
        `No contractAddress configured for contractType: ${contractType}`
      );
    }
    return new ethers.Contract(resultContractAddress, contractMetadata.abi);
  }

  getContractWithSigner(
    contract: ContractType,
    contractAddress = undefined
  ): ethers.Contract {
    if (!this.signer) throw new Error("IllegalState: no signer");

    return this.getContract(contract, contractAddress).connect(this.signer);
  }

  getContractWithFetcher(
    contract: ContractType,
    contractAddress = undefined
  ): ethers.Contract {
    if (!this.fetchProvider) throw new Error("fetchProvider not initialized");

    return this.getContract(contract, contractAddress).connect(
      this.fetchProvider
    );
  }

  getContractWithFetcherForEthereum(
    contract: ContractType,
    contractAddress = undefined
  ): ethers.Contract {
    const chainIdForRpcUrl =
      this.chainId === chainIds.localhost &&
      localhostNetwork === chainIds.ethMainnet
        ? chainIds.localhost
        : chainIds.ethMainnet;

    return this.getContract(contract, contractAddress).connect(
      new ethers.providers.StaticJsonRpcProvider(
        networkRegistry[chainIdForRpcUrl].fetchRpcUrl
      )
    );
  }

  async sendTransaction(tx: TransactionRequest) {
    if (!this.signer) throw new Error("IllegalState: no signer");

    const resp = await this.signer.sendTransaction(tx);

    return resp;
  }

  async patchExternalProvider(connector: Connector) {
    const provider = (await connector.getProvider()) as
      | providers.Provider
      | ethers.providers.Web3Provider
      | undefined;
    let externalProvider: providers.Provider | undefined;
    if (provider instanceof ethers.providers.Web3Provider)
      externalProvider = provider;
    else externalProvider = provider;
    if (externalProvider && "isWalletConnect" in externalProvider) {
      const chainId = await connector.getChainId();
      externalProvider.http = externalProvider.setHttpProvider?.(chainId);
    }
  }

  async connectAndPatchProvider(connector: Connector): Promise<number> {
    const chainId = await this.connectToConnector(connector);
    await this.patchExternalProvider(connector);
    return chainId;
  }

  isPermitterAvailable() {
    const network = this.getSelectedNetwork();
    return !!network?.contractData?.permitterAddress;
  }

  async getGasPrice(): Promise<bigint> {
    const price = await this.fetchProvider?.getGasPrice();
    if (!price) throw Error("Could not fetch gas price in getGasPrice");
    return price.toBigInt();
  }

  async walletClientToSigner(walletClient: any, chainId: number) {
    const { account, transport } = walletClient;
    const network = {
      chainId,
      name: "",
    };
    const provider = new providers.Web3Provider(transport, network);
    const signer = provider.getSigner(account);
    return signer;
  }
}
