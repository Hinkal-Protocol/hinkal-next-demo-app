interface SwapInputTokensButtonProps {
  onClick?: () => void;
}

export const SwapInputTokensButton = ({
  onClick,
}: SwapInputTokensButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="h-full mx-auto border-2 border-white/20 py-2 px-5 m-2 rounded-xl cursor-pointer bg-white/10 hover:bg-white/20 transition-colors"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 16V4m0 0L3 8m4-4l4 4" />
      <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  </button>
);
