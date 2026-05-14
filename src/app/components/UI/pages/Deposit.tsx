import { SyntheticEvent, useCallback, useState, useMemo } from "react";
import { ERC20Token } from "@gurg/hi-test";
import { toast } from "react-hot-toast";
import { useAppContext } from "../../layouts/app";
import { getAmountInWei } from "@/app/utils/amount.utils";
import { TokenAmountInput } from "../TokenAmountInput";
import { Spinner } from "../Spinner";

export const Deposit = () => {
  const { hinkal, chainId } = useAppContext();

  const [selectedToken, setSelectedToken] = useState<ERC20Token | undefined>(
    undefined,
  );
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = useCallback(async () => {
    try {
      if (!chainId || !selectedToken || !hinkal) return;
      setIsProcessing(true);
      const amountInWei = getAmountInWei(selectedToken, depositAmount);

      const result = await hinkal.deposit([selectedToken], [amountInWei]);

      if (result && typeof result === "object" && "hash" in result)
        await hinkal.waitForTransaction(chainId, result.hash);
      toast.success(
        "Deposit successful! Balance will update in several seconds",
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [chainId, selectedToken, depositAmount, hinkal]);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const isDisabled = useMemo(
    () => !hinkal || !selectedToken || !depositAmount || isProcessing,
    [hinkal, selectedToken, depositAmount, isProcessing],
  );

  return (
    <div>
      <form className="rounded-lg" onSubmit={handleSubmit}>
        <TokenAmountInput
          buttonWrapperStyles="!mb-0"
          tokenAmount={depositAmount}
          setTokenAmount={setDepositAmount}
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
        />
        <div className="w-[90%] mx-auto mb-6 mt-6 h-[1px] bg-[#272B30]" />
        <div className="border-solid">
          <button
            type="submit"
            disabled={isDisabled}
            onClick={handleDeposit}
            className={`w-[90%] ml-[5%] mb-3 md:mx-[5%] rounded-lg h-10 text-sm font-semibold outline-none ${
              !isDisabled
                ? "bg-primary text-white hover:bg-[#4d32fa] duration-200"
                : "bg-[#37363d] text-[#848688] cursor-not-allowed"
            } `}
          >
            {isProcessing ? (
              <div className="mx-[5%] flex items-center justify-center gap-x-2">
                <span>Depositing</span> <Spinner />
              </div>
            ) : (
              <span>Deposit</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
