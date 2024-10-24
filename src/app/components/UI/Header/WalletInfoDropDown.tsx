import toast from "react-hot-toast";
import Image from "next/image";

import DisconnectImg from '../../../assets/Disconnect.svg';
import CopyImg from '../../../assets/Copy.svg'
import { copyToClipboard } from "../../../utils/copyToClipboard";
import { reloadPage } from "../../../utils/pageReload";

export const WalletInfoDropDown = () => {
  return (
    <div className="absolute min-w-max top-20 md:top-2 left-0 md:left-auto right-0 bg-[#272B30] rounded-xl shadow-metamask font-pubsans p-4 items-center max-content">
      <div className="flex items-center space-x-4">
        <div className="w-[26px]" />
        <p className="text-[#abaeaf] text-[12px] text-left">Balance</p>
      </div>

      <div className="border-t-2 md:text-[15px] border-[#36393D]">
        <button
          type="button"
          onClick={() => {
            copyToClipboard("shieldedAddress ");
            toast.success("Shielded address copied to clipboard");
          }}
        >
          <div className="flex items-center mt-2 text-white text-[14px] md:w-[9.5rem]">
            <div className="flex justify-center items-center w-[25px] h-[25px]">
              <Image src={CopyImg} alt="" />
            </div>
            <div className="pl-2">Copy Address</div>
          </div>
        </button>
        <div>
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => reloadPage()}
          >
            <div className="flex flex-row items-center text-white text-[14px] mt-2 w-[9.5rem]">
              <div className="flex justify-center items-center w-[25px] h-[25px]">
                <Image src={DisconnectImg} alt="" />
              </div>
              <div className="pl-2">Disconnect</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
