import { Popover } from "@headlessui/react";
import Image from "next/image";

import VectorDown from "../../../../assets/VectorDown.svg";
import { NetworkSettingsDropdown } from "./NetworkSettingsDropdown";
import { useAppContext } from "../../../layouts/app";

type NetworkSettingsBodyProps = {
  open: boolean;
};
export const NetworkSettingsBody = ({ open }: NetworkSettingsBodyProps) => {
  const { selectedNetwork } = useAppContext();

  return (
    <>
      <Popover.Button
        as="button"
        type="button"
        className="rounded-[12px] text-white font-semibold flex items-center gap-2 cursor-pointer duration-500 px-3 min-[375px]:px-4 py-[0.875rem] text-base bg-[#2c2a2a] relative z-20"
      >
        {!selectedNetwork && (
          <i className="bi bi-exclamation-triangle text-white" />
        )}

        <div>{selectedNetwork?.name || "Unsupported"}</div>
        <div className={`hidden min-[375px]:block ${open ? "rotate-180" : ""}`}>
          <Image src={VectorDown} alt={""} />
        </div>
      </Popover.Button>
      <Popover.Panel className="md:relative z-20">
        {({ close }) => <NetworkSettingsDropdown close={close} />}
      </Popover.Panel>
    </>
  );
};
