import { Listbox } from "@headlessui/react";
import { ERC20Token } from "@sabaaa1/common";
import { SetStateAction, useEffect } from "react";
import Image from "next/image";

import { useAppContext } from "../layouts/app";
import VectorDown from "../../assets/VectorDown.svg";

interface TokenAmountInputInterface {
  buttonWrapperStyles?: string;
  tokenAmount: string;
  setTokenAmount: (param: SetStateAction<string>) => void;
  selectedToken: ERC20Token;
  setSelectedToken: (param: SetStateAction<ERC20Token>) => void;
}

export const TokenAmountInput = ({
  buttonWrapperStyles,
  tokenAmount,
  setTokenAmount,
  selectedToken,
  setSelectedToken,
}: TokenAmountInputInterface) => {
  const { erc20List } = useAppContext();

  useEffect(() => {
    setSelectedToken(erc20List[0]);
  }, [setSelectedToken, erc20List]);

  /**
   * deposit amount onChange handler
   * @param event onChange event instance
   */
  const setTokenAmountHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const regExp = /^[0-9]*[.]?[0-9]*$/;
    if (regExp.test(event.target.value)) {
      setTokenAmount(event.target.value);
    }
  };

  if (!erc20List.length)
    return <div className="p-6">Please Connect your walet before deposit</div>;

  return (
    <div className="flex flex-col item-center justify-center">
      <label className="text-white pl-[5%] text-[14px] font-[300]">Token</label>
      <div
        className={`flex justify-center mt-1 mb-8 ${buttonWrapperStyles} w-[90%] mx-auto relative`}
      >
        <Listbox
          disabled={false}
          value={selectedToken}
          onChange={setSelectedToken}
          as="div"
          className="flex flex-col relative w-[50%] min-[375px]:w-[40%] lg:w-[35%]"
        >
          {({ open }) => (
            <>
              <Listbox.Button
                className={`h-10 px-2 md:px-0 text-white bg-[#353945] rounded-l-lg ${
                  open ? "rounded-l-[0px] rounded-tl-lg" : ""
                } outline-none flex items-center justify-center gap-x-2 w-full ${
                  true ? "cursor-pointer" : "cursor-not-allowed"
                } `}
              >
                <div className="w-[60px] relative flex h-[25px]">
                  {selectedToken?.logoURI && (
                    <Image
                      src={selectedToken.logoURI}
                      fill={true}
                      alt="tokenIcon"
                      className="w-[26px]"
                    />
                  )}
                </div>
                <span>{selectedToken?.symbol}</span>
                {!open ? (
                  <Image src={VectorDown} alt={""} />
                ) : (
                  <div className="rotate-180">
                    <Image src={VectorDown} alt={""} />
                  </div>
                )}
              </Listbox.Button>
              <Listbox.Options className="absolute w-full top-10 text-white flex flex-col bg-[#272B30] rounded-b-lg z-20">
                {erc20List.map((token, index) => (
                  <Listbox.Option
                    key={token.name + token.erc20TokenAddress}
                    value={token}
                    className={`cursor-pointer py-2 flex items-center gap-x-2 pl-[8px] ${
                      token?.name === selectedToken?.name ? "bg-[#64717d]" : ""
                    } ${
                      index === erc20List.length - 1 ? " rounded-b-lg" : ""
                    }  `}
                  >
                    <div className="w-[26px] relative flex h-[25px]">
                      {token?.logoURI && (
                        <Image
                          src={token?.logoURI}
                          fill={true}
                          alt="tokenIcon"
                          className="w-[26px]"
                        />
                      )}
                    </div>{" "}
                    <span>{token?.symbol}</span>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </>
          )}
        </Listbox>
        <input
          autoComplete="off"
          type="text"
          id="totalAmount"
          placeholder="Token amount"
          className={`bg-[#272B30] h-10 w-[50%] min-[375px]:w-[60%] lg:w-[65%] text-white text-[14px] rounded-r-lg pl-[15px] outline-none ${
            true ? "" : "cursor-not-allowed"
          } `}
          disabled={false}
          onChange={(event) => setTokenAmountHandler(event)}
          value={tokenAmount}
        />
      </div>
    </div>
  );
};
