import { useSwitchChain } from "wagmi";

interface NetworkDropdownItemProps {
  logoPath?: string;
  networkName: string;
  onSelect: () => void;
}

export const NetworkDropdownItem = ({
  logoPath,
  networkName,
  onSelect,
}: NetworkDropdownItemProps) => {
  const {} = useSwitchChain({
    mutation: {
      onError(err) {
        console.error(err);
      },
    },
  });

  return (
    <button
      type="button"
      onClick={onSelect}
      className={
        "py-1 px-2 hover:bg-[#4f4f4f] w-full md:w-[220px] flex flex-col"
      }
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex pb-1 flex-1 items-center justify-between">
          <div className="flex gap-x-2 items-center">
            {logoPath && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoPath} alt="Logo" className="w-[20px] h-[20px]" />
            )}
            <span>{networkName}</span>
          </div>
        </div>
      </div>
    </button>
  );
};
