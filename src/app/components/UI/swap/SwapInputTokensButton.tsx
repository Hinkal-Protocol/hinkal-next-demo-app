interface SwapInputTokensButtonProps {
  onClick?: () => void;
}

export const SwapInputTokensButton = ({
  onClick,
}: SwapInputTokensButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="h-full mx-auto border-2 px-3 m-2 rounded-xl cursor-pointer text-[16px] font-bold text-white"
  >
    <span className="text-[12px]">⇅</span>
  </button>
);
