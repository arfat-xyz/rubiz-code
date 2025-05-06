"use client";
import { AlteredRubizCodeFile, tabValueProps } from "@/utils/interface";
import { useConversationStore } from "@/utils/use-conversation-zustand";
import React, { useEffect, useState } from "react";
import ChatWindow from "./chat-window";
import { frontendErrorResponse } from "@/lib/frontend-response-toast";

const ChatTabComponent = ({ activeTab }: { activeTab: tabValueProps }) => {
  const { conversation, setConversation } = useConversationStore();
  const [allFiles, setAllFiles] = useState<AlteredRubizCodeFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const init = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/get-chat-list`).then((res) =>
        res.json()
      );
      if (!response?.success) {
        return frontendErrorResponse({ message: response?.message });
      }
      setAllFiles(response?.data);
    } catch (error) {
      console.log(`Fetching error: `, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <div
      className={`transition-all duration-300
    ${activeTab === "chat" ? "animate-fadeIn" : "animate-fadeOut"}
    `}
    >
      {isLoading ? (
        <>
          <div className="absolute top-0 left-0 w-screen h-screen bg-black/30">
            <div className="flex justify-center items-center h-screen">
              <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
            </div>
          </div>
        </>
      ) : (
        <>
          {" "}
          <div className="grid grid-cols-1 lg:grid-cols-5 h-[calc(100svh-100px)] gap-2">
            {/* chat list */}
            <div className="w-full lg:col-span-2 border rounded-lg p-2">
              <ul className="flex flex-col gap-2">
                {allFiles.length > 0 ? (
                  <>
                    {allFiles.map((f) => (
                      <li
                        key={f?.id}
                        onClick={() => setConversation(f)}
                        className={`break-all flex items-center gap-1 text-wrap transition-colors p-2 rounded-lg cursor-pointer
              ${
                conversation?.id === f?.id
                  ? "bg-green-700 hover:bg-green-800 text-white"
                  : "hover:bg-green-200"
              }
            `}
                      >
                        <span
                          className="inline-block max-w-full overflow-hidden text-ellipsis whitespace-nowrap 
                transition-all duration-300 ease-in-out hover:whitespace-normal"
                        >
                          {f.name}
                        </span>
                        <strong className="whitespace-nowrap">
                          {" "}
                          ({f.size})
                        </strong>
                      </li>
                    ))}
                  </>
                ) : (
                  <h1 className="text-3xl">Please add a file</h1>
                )}
              </ul>
            </div>

            {/* chat window */}
            {conversation ? (
              <ChatWindow />
            ) : (
              <h1 className="col-span-3 text-3xl w-full h-full flex justify-center items-center ">
                Please select a PDF
              </h1>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatTabComponent;
