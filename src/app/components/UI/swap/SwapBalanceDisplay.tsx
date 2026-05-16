import { ERC20Token } from "@gurg/hi-test";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../layouts/app";
import { getAmountInToken } from "../../../utils/amount.utils";

interface SwapBalanceDisplayProps {
  token?: ERC20Token;
  onBalanceChange?: (balance: bigint) => void;
}

export const SwapBalanceDisplay = ({
  token,
  onBalanceChange,
}: SwapBalanceDisplayProps) => {
  const { privateBalancesWithUSD, chainId } = useAppContext();

  const balances = useMemo(() => {
    if (chainId === undefined) return [];
    return privateBalancesWithUSD[chainId] ?? [];
  }, [chainId, privateBalancesWithUSD]);
  const [balance, setBalance] = useState(0n);

  useEffect(() => {
    if (!token) {
      setBalance(0n);
      if (onBalanceChange) onBalanceChange(0n);
      return;
    }

    const tokenBalance = balances.find(
      (b) => b.token.erc20TokenAddress === token.erc20TokenAddress,
    );

    const newBalance = tokenBalance?.balance ?? 0n;
    setBalance(newBalance);
    if (onBalanceChange) onBalanceChange(newBalance);
  }, [token, balances, onBalanceChange]);

  const displayBalance = token
    ? Number(getAmountInToken(token, balance)).toFixed(6)
    : "0.0000";

  return <p className="px-3 mr-[15px]">Balance: {displayBalance}</p>;
};
