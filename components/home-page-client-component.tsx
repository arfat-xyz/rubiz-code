"use client";
import React, { useState } from "react";
import UploadTabComponent from "./upload-tab";
import ChatTabComponent from "./chat-tab";
import { tabValueProps } from "@/utils/interface";
import { tabsArr } from "@/utils/constants";

const HomePageClientComponent = () => {
  const [activeTab, setActiveTab] = useState<tabValueProps>(tabsArr[0].value);
  return (
    <div className="mx-auto max-w-full lg:max-w-screen-lg">
      {/* tabs */}
      <div className="w-full grid grid-cols-2 text-center gap-2">
        {tabsArr.map((t) => (
          <div
            onClick={() => setActiveTab(t.value)}
            key={t.value}
            className={`border-b   py-2 font-semibold cursor-pointer ${
              activeTab === t.value
                ? "border-red-400 text-red-400"
                : "border-gray-400"
            }`}
          >
            {t.name}
          </div>
        ))}
      </div>

      {/* tabs content */}
      <div className="w-full mt-8">
        {activeTab === "upload" ? (
          <UploadTabComponent activeTab={activeTab} />
        ) : (
          <></>
        )}
        {activeTab === "chat" ? (
          <ChatTabComponent activeTab={activeTab} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default HomePageClientComponent;
