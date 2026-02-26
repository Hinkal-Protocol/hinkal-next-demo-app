import { Spinner } from "../../../Spinner";

interface NetworkDropdownItemProps {
  logoPath?: string;
  networkName: string;
  onSelect: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const NetworkDropdownItem = ({
  logoPath,
  networkName,
  onSelect,
  isLoading = false,
  disabled = false,
}: NetworkDropdownItemProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className="py-1 px-2 hover:bg-[#4f4f4f] w-full md:w-[220px] flex flex-col disabled:opacity-50 disabled:cursor-not-allowed"
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
        {isLoading && <Spinner styleSize="size-5 mr-0" />}
      </div>
    </button>
  );
};
