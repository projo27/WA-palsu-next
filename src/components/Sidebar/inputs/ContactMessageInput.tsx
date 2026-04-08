import { Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { cn } from "../../../lib/utils";
import { MessageInputProps } from "./types";

interface ContactMessageInputProps extends MessageInputProps {}

export const ContactMessageInput: React.FC<ContactMessageInputProps> = ({
  msgText,
  setMsgText,
  msgTime,
  setMsgTime,
  msgStatus,
  setMsgStatus,
  msgReaction,
  setMsgReaction,
  msgFile,
  setMsgFile,
  fileInputRef,
  handleMsgFileUpload,
}) => {
  const [isMultiple, setIsMultiple] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactCount, setContactCount] = useState("1");

  useEffect(() => {
    try {
      if (msgText && msgText.startsWith("{")) {
        const parsed = JSON.parse(msgText);
        setContactName(parsed.contactName || "");
        setIsMultiple(parsed.isMultiple || false);
        setContactCount(parsed.contactCount || "1");
      } else if (msgText && !msgText.startsWith("{")) {
        setContactName(msgText);
        setIsMultiple(false);
      }
    } catch {
      setContactName(msgText);
    }
  }, [msgText]);

  const updateMsgText = (name: string, multi: boolean, count: string) => {
    setMsgText(
      JSON.stringify({
        contactName: name,
        isMultiple: multi,
        contactCount: count,
      }),
    );
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMsgText(e.target.value, isMultiple, contactCount);
  };

  const handleModeChange = (multi: boolean) => {
    setIsMultiple(multi);
    updateMsgText(contactName, multi, contactCount);
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactCount(e.target.value);
    updateMsgText(contactName, isMultiple, e.target.value);
  };

  return (
    <div className="space-y-4">
      {/* Search/Mode Toggle */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => handleModeChange(false)}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all border-b-2 rounded-t-md",
            !isMultiple
              ? "bg-primary text-white border-primary"
              : "text-gray-500 hover:text-gray-700 bg-white",
          )}
        >
          Single Contact
        </button>
        <button
          onClick={() => handleModeChange(true)}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all border-b-2 rounded-t-md ml-2",
            isMultiple
              ? "bg-primary text-white border-primary"
              : "text-gray-500 hover:text-gray-700 bg-white",
          )}
        >
          Multiple Contact
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500">
          Contact Detail
        </label>
        <div className="flex items-center gap-3">
          <div
            className="relative group cursor-pointer shrink-0"
            onClick={() => fileInputRef?.current?.click()}
          >
            {msgFile ? (
              <img
                src={msgFile}
                alt="Contact Avatar"
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload size={14} className="text-white" />
            </div>
            {handleMsgFileUpload && (
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleMsgFileUpload}
              />
            )}
          </div>
          <input
            type="text"
            placeholder="Enter your name"
            value={contactName}
            onChange={handleNameChange}
            className="flex-1 p-2 rounded border border-gray-200 text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {isMultiple && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            Contact Count
            <div className="w-3.5 h-3.5 rounded-full border border-gray-400 text-gray-400 flex items-center justify-center text-[9px] font-bold">
              i
            </div>
          </label>
          <input
            type="number"
            min="1"
            value={contactCount}
            onChange={handleCountChange}
            className="w-full p-2 rounded border border-gray-200 text-sm focus:outline-none focus:border-primary"
          />
        </div>
      )}
    </div>
  );
};
