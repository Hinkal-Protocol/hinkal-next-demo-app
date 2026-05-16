import { AppTab } from "../../../types";
import { Dispatch, SetStateAction } from "react";

interface NavigationBarProps {
  activeTab: AppTab;
  setActiveTab: Dispatch<SetStateAction<AppTab>>;
}

interface TabButtonProps {
  isActive: boolean;
  title: string;
  onClick: () => void;
}

const TabButton = ({ isActive, title, onClick }: TabButtonProps) => (
  <div
    className={`${
      isActive
        ? "text-white border-b-primary border-b-[2px] pb-1"
        : "cursor-pointer hover:border-b-[2px] border-b-[#5f4ecd7b] text-[#bab9be] pb-1"
    } hover:border-b-[2px] flex-1 `}
  >
    <button
      type="button"
      className="h-full flex gap-x-2 justify-center w-full bg-transparent border-none outline-none"
      onClick={onClick}
    >
      {title}
    </button>
  </div>
);

const buttonClassName =
  "xl:flex w-1/4 block place-self-end xl:place-self-start max-xl:w-[50%] xl:space-x-0 space-y-3";

export const NavigationBar = ({
  activeTab,
  setActiveTab,
}: NavigationBarProps) => {
  return (
    <div className="mt-[4%] xl:flex h-12 mb-4 text-[15px] font-semibold border-b border-[#3e3c3c] block relative">
      <div className="flex xl:h-full h-1 xl:py-0 py-2 w-full align-top">
        <div className={buttonClassName}>
          <TabButton
            isActive={activeTab === AppTab.Deposit}
            title="Deposit"
            onClick={() => setActiveTab(AppTab.Deposit)}
          />
        </div>
        <div className={buttonClassName}>
          <TabButton
            isActive={activeTab === AppTab.Transfer}
            title="Transfer"
            onClick={() => setActiveTab(AppTab.Transfer)}
          />
        </div>
        <div className={buttonClassName}>
          <TabButton
            isActive={activeTab === AppTab.Withdraw}
            title="Withdraw"
            onClick={() => setActiveTab(AppTab.Withdraw)}
          />
        </div>
        <div className={buttonClassName}>
          <TabButton
            isActive={activeTab === AppTab.Swap}
            title="Swap"
            onClick={() => setActiveTab(AppTab.Swap)}
          />
        </div>
      </div>
    </div>
  );
};
