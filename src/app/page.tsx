"use client";
import dynamic from "next/dynamic";

const DemoPage = dynamic(() => import("./components/DemoPage"), {
  ssr: false,
});

export default function Page() {
  return <DemoPage />;
}
