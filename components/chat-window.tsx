"use client";
import { SingleConversationProps } from "@/utils/interface";
import { useConversationStore } from "@/utils/use-conversation-zustand";
import React, { useState, useRef, useEffect } from "react";

const ChatWindow = () => {
  const [allConversations, setAllConversations] = useState<
    SingleConversationProps[]
  >([]);
  const { conversation } = useConversationStore();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations from localStorage when conversation changes
  useEffect(() => {
    if (conversation?.id) {
      const savedConversations = localStorage.getItem(
        `conversation_${conversation.id}`
      );
      if (savedConversations) {
        setAllConversations(JSON.parse(savedConversations));
      } else {
        setAllConversations([]);
      }
    }
  }, [conversation?.id]);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversation?.id && allConversations.length > 0) {
      localStorage.setItem(
        `conversation_${conversation.id}`,
        JSON.stringify(allConversations)
      );
    }
  }, [allConversations, conversation?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !conversation?.id) return;

    // Add both messages
    const updatedConversations: SingleConversationProps[] = [
      ...allConversations,
      { user: "human", query: inputValue },
      { user: "assistant", query: "" },
    ];
    setAllConversations(updatedConversations);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversation.id,
          message: inputValue,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n").filter((line) => line.trim());

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.replace("data: ", "");

            if (data === "[DONE]") {
              setIsLoading(false);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.token) {
                setAllConversations((prev) => {
                  const lastIndex = prev.length - 1;
                  if (lastIndex >= 0 && prev[lastIndex].user === "assistant") {
                    const newMessages = [...prev];

                    // Only append if the token doesn't duplicate existing content
                    if (
                      !newMessages[lastIndex].query.includes(
                        parsed.token.trim()
                      )
                    ) {
                      newMessages[lastIndex].query += parsed.token;
                    }

                    return newMessages;
                  }
                  return prev;
                });
              }
              if (parsed.error) throw new Error(parsed.error);
            } catch (e) {
              console.error("Error parsing chunk:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setAllConversations((prev) => {
        const lastIndex = prev.length - 1;
        if (lastIndex >= 0 && prev[lastIndex].user === "assistant") {
          const newMessages = [...prev];
          newMessages[lastIndex].query =
            "Sorry, I encountered an error. Please try again.";
          return newMessages;
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  return (
    <div className="lg:col-span-3 border rounded-lg grid h-[calc(100svh-100px)] overflow-hidden grid-rows-[80px_1fr_60px] gap-2">
      <div className=" w-full grid grid-cols-2 items-center p-2 border-b-2">
        <h1 className="text-2xl truncate w-full font-semibold">
          {conversation?.name}
        </h1>
      </div>
      <div className=" overflow-auto flex flex-col gap-2 ">
        {allConversations.length > 0 ? (
          <>
            {allConversations.map((conversation, i) => {
              const { user, query } = conversation;
              const isHuman = user === "human";

              return (
                <div
                  key={i}
                  className={`max-w-[80%] shadow-lg break-words bg-white px-3 py-2 mx-3 rounded-lg ${
                    isHuman ? "self-end" : "self-start"
                  }`}
                >
                  {query}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Start a new conversation</p>
          </div>
        )}
        {isLoading && (
          <div className="flex space-x-2 justify-start items-center px-3 mx-3 mt-3">
            <span className="sr-only">Loading...</span>
            <div className="size-2 bg-black rounded-full animate-bounce-loading [animation-delay:-0.3s]"></div>
            <div className="size-2 bg-black rounded-full animate-bounce-loading [animation-delay:-0.15s]"></div>
            <div className="size-2 bg-black rounded-full animate-bounce-loading"></div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className=" relative rounded-lg shadow-lg">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter message"
          className="w-full h-full p-2 pr-10 text-lg focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          title="Input submit button"
          className="absolute top-1/2 right-2 transform -translate-y-1/2"
          disabled={isLoading || !inputValue.trim()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${isLoading ? "text-gray-400" : "text-pink-500"}`}
          >
            <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
            <path d="M6 12h16" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
