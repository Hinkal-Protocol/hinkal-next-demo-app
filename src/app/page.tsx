"use client";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { AppContextProvider } from "./components/layouts/app";
import { Header } from "./components/UI/Header";
import { AppTab } from "@/types/tabs";
import { NavigationBar } from "./components/UI/NavigationBar/NavigationBar";
import { Deposit } from "./components/UI/pages/Deposit";
import { Transfer } from "./components/UI/pages/Transfer";
import { Withdraw } from "./components/UI/pages/Withdraw";
import { Swap } from "./components/UI/pages/Swap";

const DemoPage = () => {
  const [activeTab, setActiveTab] = useState(AppTab.Deposit);

  return (
    <AppContextProvider>
      <div className="bg-bgColor min-h-screen font-pubsans">
        <Header />
        <div className="flex justify-center">
          <section className="bg-modalBgColor rounded-xl w-[87%] md:w-[40%] min-w-[300px] md:mt-[120px] md:h-fit mx-auto pt-2">
            <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="px-2">
              {activeTab === AppTab.Deposit && <Deposit />}
              {activeTab === AppTab.Transfer && <Transfer />}
              {activeTab === AppTab.Withdraw && <Withdraw />}
              {activeTab === AppTab.Swap && <Swap />}
            </div>
          </section>
        </div>
      </div>
      <Toaster />
    </AppContextProvider>
  );
};

export default DemoPage;
