import { ERC20Token } from "@gurg/hi-test";
import { ethers } from "ethers";

export const getAmountInToken = (token: ERC20Token, amount: bigint): string =>
  ethers.utils.formatUnits(amount, token.decimals);

export const getAmountInWei = (token: ERC20Token, amount: string): bigint => {
  try {
    return ethers.utils.parseUnits(amount, token.decimals).toBigInt();
  } catch {
    throw new Error("Invalid amount");
  }
};
