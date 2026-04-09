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
  const [tab, setTab] = React.useState<"local" | "url" | "youtube">(
    msgFile?.includes("youtube.com") || msgFile?.includes("youtu.be") || msgFile?.includes("img.youtube.com") 
      ? "youtube" 
      : (msgFile?.startsWith('http') ? "url" : "local")
  );

  // Sync tab with msgFile changes from outside if needed
  React.useEffect(() => {
    if (msgFile?.includes("youtube.com") || msgFile?.includes("youtu.be") || msgFile?.includes("img.youtube.com")) {
      if (tab !== "youtube") setTab("youtube");
    } else if (msgFile?.startsWith('http')) {
      if (tab !== "url") setTab("url");
    } else if (msgFile) {
      if (tab !== "local") setTab("local");
    }
  }, [msgFile]);

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleUrlChange = (value: string) => {
    const ytId = getYoutubeId(value);
    const finalVal = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : value;
    
    setMsgFile(finalVal);
    
    if (finalVal.trim() !== "") {
      if (
        msgType !== "image" &&
        msgType !== "file" &&
        msgType !== "contact" &&
        msgType !== "location"
      ) {
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
        
        <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setTab("local")}
            className={cn(
              "py-1.5 text-[10px] font-medium rounded-md transition-all",
              tab === "local" ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Local
          </button>
          <button
            onClick={() => setTab("url")}
            className={cn(
              "py-1.5 text-[10px] font-medium rounded-md transition-all",
              tab === "url" ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Image Link
          </button>
          <button
            onClick={() => setTab("youtube")}
            className={cn(
              "py-1.5 text-[10px] font-medium rounded-md transition-all flex items-center justify-center gap-1",
              tab === "youtube" ? "bg-white shadow-sm text-red-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> 
            YouTube
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
                placeholder={tab === "youtube" ? "Paste YouTube Video URL here..." : "Paste image URL here..."}
                value={(tab === "youtube" && msgFile?.includes("img.youtube.com")) ? "" : (msgFile || "")}
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
              <div className="flex justify-center p-2 border border-gray-100 rounded-lg bg-gray-50 min-h-[100px] items-center group relative overflow-hidden">
                <img
                  src={msgFile}
                  alt="URL Preview"
                  className="h-24 rounded shadow-sm object-contain lg:h-32"
                  onError={(e) => {
                    if ((e.target as HTMLImageElement).src.includes('maxresdefault')) {
                      (e.target as HTMLImageElement).src = (e.target as HTMLImageElement).src.replace('maxresdefault', 'hqdefault');
                    } else {
                      (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Invalid+URL";
                    }
                  }}
                />
                
                {(tab === "youtube" || msgFile.includes("img.youtube.com")) && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-red-600 text-white p-2 rounded-full shadow-lg opacity-90 ring-4 ring-white/20">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-[11px] text-gray-400 text-center italic py-4">
                {tab === "youtube" ? "Enter a YouTube link to generate thumbnail" : "Preview will appear here once you paste a valid URL"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
