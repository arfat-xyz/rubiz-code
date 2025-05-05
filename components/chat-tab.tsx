"use client";
import { tabValueProps } from "@/utils/interface";
import React from "react";

const ChatTabComponent = ({ activeTab }: { activeTab: tabValueProps }) => {
  return (
    <div
      className={`transition-all duration-300
    ${activeTab === "chat" ? "animate-fadeIn" : "animate-fadeOut"}
    `}
    >
      <div className="grid lg:grid-cols-5 h-[calc(100svh-100px)] gap-2">
        {/* chat list */}
        <div className="lg:col-span-2 border rounded-lg p-2">
          <div className="">chat list</div>
        </div>

        {/* chat window */}
        <div className="lg:col-span-3">chat window</div>
      </div>
    </div>
  );
};

export default ChatTabComponent;
