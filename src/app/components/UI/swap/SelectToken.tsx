import { ERC20Token } from "@sabaaa1/common";
import { useState } from "react";
import Image from "next/image";
import { TokenDropdown } from "./TokenDropdown";

interface SelectTokenProps {
  swapToken?: ERC20Token;
  onTokenChange: (prev?: ERC20Token, cur?: ERC20Token) => void;
  disabled?: boolean;
  tokenFilter?: (arg: ERC20Token) => boolean;
}

export const SelectToken = ({
  swapToken,
  onTokenChange,
  disabled,
  tokenFilter,
}: SelectTokenProps) => {
  const [isTokenSelectShown, setIsTokenSelectShown] = useState(false);
  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsTokenSelectShown((prev) => !prev)}
        className={`rounded-lg ${
          swapToken ? "bg-modalBgColor" : "bg-primary"
        } px-3 py-2 w-fit mr-[15px] flex items-center justify-center`}
      >
        <span className="text-xl font-[600]">
          {swapToken ? (
            <span className="flex justify-center items-center gap-x-2">
              {swapToken.logoURI && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={swapToken.logoURI}
                  alt={swapToken.symbol}
                  className="w-[24px] h-[24px]"
                />
              )}
              <span>{swapToken.symbol}</span>{" "}
            </span>
          ) : (
            "Select token"
          )}
        </span>
        <div className={`px-1 ${isTokenSelectShown ? "rotate-180" : ""}`}>
          <Image
            src="/icons/VectorDown.svg"
            alt="dropdown arrow"
            width={12}
            height={12}
          />
        </div>
      </button>
      {isTokenSelectShown && (
        <TokenDropdown
          isTokenSelectShown={isTokenSelectShown}
          setIsTokenSelectShown={setIsTokenSelectShown}
          swapToken={swapToken}
          onTokenChange={onTokenChange}
          tokenFilter={tokenFilter}
        />
      )}
    </>
  );
};
