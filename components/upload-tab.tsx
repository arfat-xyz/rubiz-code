"use client";
import {
  frontendErrorResponse,
  frontendSuccessResponse,
} from "@/lib/frontend-response-toast";
import { tabValueProps } from "@/utils/interface";
import { useConversationStore } from "@/utils/use-conversation-zustand";
import React, { useState, useRef, ChangeEvent } from "react";

const UploadTabComponent = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: tabValueProps;
  setActiveTab: React.Dispatch<React.SetStateAction<tabValueProps>>;
}) => {
  const { setConversation } = useConversationStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];

    if (!file) return;

    // Check file type
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }

    // Check file size (2MB = 2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("pdfFile", selectedFile);

      // Replace with your actual API endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      if (!response?.success) {
        return frontendErrorResponse({ message: response?.message });
      }
      // Handle successful upload (e.g., show success message, reset form)
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setConversation(response?.data);
      return frontendSuccessResponse({ message: response?.message });
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setActiveTab("chat");
      }, 1000);
    }
  };

  return (
    <div
      className={`transition-all duration-300 ${
        activeTab === "upload" ? "animate-fadeIn" : "animate-fadeOut"
      }`}
    >
      <div className="space-y-4 p-4">
        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload PDF (max 2MB)
          </label>
          <input
            type="file"
            ref={fileInputRef}
            placeholder="input file"
            onChange={handleFileChange}
            accept="application/pdf"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            disabled={isSubmitting}
          />
        </div>

        {selectedFile && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div>
              <p className="text-sm font-medium text-gray-700">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              title="Remove file"
              onClick={handleRemoveFile}
              className="text-red-500 hover:text-red-700"
              disabled={isSubmitting}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedFile || isSubmitting}
            className={` py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              !selectedFile || isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isSubmitting ? "Uploading..." : "Upload PDF"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadTabComponent;
