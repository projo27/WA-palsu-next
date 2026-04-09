import { Image as ImageIcon, Trash2, X } from "lucide-react";
import React from "react";
import { MessageInputProps } from "./types";
import { cn } from "@/src/lib/utils";

export const TextMessageInput: React.FC<MessageInputProps> = ({
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
  msgType,
  setMsgType,
  fileInputRef,
  handleMsgFileUpload,
}) => {
  const [tab, setTab] = React.useState<"local" | "url">(msgFile?.startsWith('http') ? "url" : "local");

  // Sync tab with msgFile changes from outside if needed
  React.useEffect(() => {
    if (msgFile?.startsWith('http') && tab !== "url") setTab("url");
    if (msgFile && !msgFile.startsWith('http') && tab !== "local") setTab("local");
  }, [msgFile]);

  const handleUrlChange = (value: string) => {
    setMsgFile(value);
    if (value.trim() !== "") {
      if (msgType !== "image" && msgType !== "file" && msgType !== "contact" && msgType !== "location") {
        setMsgType("image");
      }
    }
  };

  const clearImage = () => {
    setMsgFile("");
    if (msgType === "image" && !msgText) {
      setMsgType("text");
    }
  };
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="relative">
        <textarea
          placeholder="Type message here..."
          value={msgText}
          onChange={(e) => setMsgText(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-200 text-sm min-h-[100px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
        />
        <button
          onClick={() => setMsgText("")}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Add Image Section */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 capitalize">
          Add Image / Video Thumbnails
        </label>
        
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setTab("local")}
            className={cn(
              "py-1.5 text-xs font-medium rounded-md transition-all",
              tab === "local" ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
            )}
            title="Upload from device"
          >
            Local File
          </button>
          <button
            onClick={() => setTab("url")}
            className={cn(
              "py-1.5 text-xs font-medium rounded-md transition-all",
              tab === "url" ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
            )}
            title="External URL"
          >
            URL Link
          </button>
        </div>

        {tab === "local" ? (
          <div
            onClick={() => fileInputRef?.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-all min-h-[120px] group"
          >
            {msgFile && !msgFile.startsWith('http') ? (
              <div className="relative">
                <img
                  src={msgFile}
                  alt="Preview"
                  className="h-24 rounded shadow-sm border border-gray-100"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="p-3 bg-gray-100 rounded-full text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <ImageIcon size={24} />
                </div>
                <div className="text-center">
                  <span className="text-xs font-medium text-gray-700 block">Click to upload image</span>
                  <span className="text-[10px] text-gray-400">JPG, PNG, GIF or WebP</span>
                </div>
              </>
            )}
            {handleMsgFileUpload && fileInputRef && (
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleMsgFileUpload}
              />
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Paste image URL here..."
                value={msgFile || ""}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-mono"
              />
              {msgFile && (
                <button
                  onClick={clearImage}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {msgFile && msgFile.startsWith('http') ? (
              <div className="flex justify-center p-2 border border-gray-100 rounded-lg bg-gray-50 min-h-[100px] items-center">
                <img
                  src={msgFile}
                  alt="URL Preview"
                  className="h-24 rounded shadow-sm object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Invalid+Image+URL";
                  }}
                />
              </div>
            ) : (
              <div className="text-[10px] text-gray-400 text-center italic">
                Preview will appear here once you paste a valid URL
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
