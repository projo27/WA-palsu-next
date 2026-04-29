import { Video, Trash2, X, Play } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { MessageInputProps } from "./types";
import { cn } from "../../../lib/utils";

export const VideoMessageInput: React.FC<MessageInputProps> = ({
  msgFile,
  setMsgFile,
  msgThumbnail,
  setMsgThumbnail,
  msgType,
  setMsgType,
}) => {
  const [tab, setTab] = useState<"local" | "url">(
    msgFile?.startsWith("http") ? "url" : "local"
  );
  const [url, setUrl] = useState(
    msgFile?.startsWith("http") ? msgFile : ""
  );
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const generateRemoteThumbnail = (videoUrl: string) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = "anonymous";
    video.preload = "metadata";
    
    video.onloadedmetadata = () => {
      video.currentTime = 0.5; // Seek to 0.5s for a better chance of a frame
    };
    
    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        if (dataUrl && dataUrl !== 'data:,') {
          setMsgThumbnail(dataUrl);
        }
      } catch (e) {
        console.warn("CORS issue preventing thumbnail generation for remote video", e);
      }
    };
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    const ytId = getYoutubeId(newUrl);
    if (ytId) {
      setMsgFile(newUrl);
      setMsgThumbnail(`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`);
    } else if (newUrl.startsWith('http')) {
      setMsgFile(newUrl);
      // For generic URLs, clear existing thumbnail and try to generate a new one
      setMsgThumbnail(null);
      generateRemoteThumbnail(newUrl);
    } else {
      setMsgFile(null);
      setMsgThumbnail(null);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setMsgFile(videoUrl);
      
      const video = document.createElement('video');
      video.src = videoUrl;
      video.onloadeddata = () => {
        video.currentTime = 1;
      };
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        setMsgThumbnail(canvas.toDataURL('image/jpeg'));
      };
    }
  };

  const clearVideo = () => {
    setMsgFile(null);
    setMsgThumbnail(null);
    setUrl("");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 capitalize">
          Video Source
        </label>
        
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setTab("local")}
            className={cn(
              "py-1.5 text-[10px] font-medium rounded-md transition-all",
              tab === "local" ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Local Video
          </button>
          <button
            onClick={() => setTab("url")}
            className={cn(
              "py-1.5 text-[10px] font-medium rounded-md transition-all flex items-center justify-center gap-1",
              tab === "url" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Play size={10} className="fill-current" /> 
            Video URL
          </button>
        </div>

        {tab === "local" ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-all min-h-[140px] group relative overflow-hidden"
          >
            {msgFile && !msgFile.startsWith('http') ? (
              <div className="relative z-10">
                <div className="relative">
                  <img
                    src={msgThumbnail || ""}
                    alt="Thumbnail"
                    className="h-28 rounded shadow-sm border border-gray-100 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm">
                      <Play size={16} fill="currentColor" />
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearVideo();
                  }}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="p-3 bg-gray-100 rounded-full text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Video size={24} />
                </div>
                <div className="text-center">
                  <span className="text-xs font-medium text-gray-700 block">Click to upload video</span>
                  <span className="text-[10px] text-gray-400">MP4, WebM, MOV</span>
                </div>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="video/*"
              onChange={handleVideoUpload}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Paste Video or YouTube URL here..."
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-mono"
              />
              {url && (
                <button
                  onClick={clearVideo}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {msgThumbnail ? (
              <div className="flex justify-center p-2 border border-gray-100 rounded-lg bg-gray-50 min-h-[100px] items-center group relative overflow-hidden">
                <img
                  src={msgThumbnail}
                  alt="Video Preview"
                  className="h-24 rounded shadow-sm object-contain lg:h-32"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={cn(
                    "p-2 rounded-full shadow-lg opacity-90 ring-4 ring-white/20",
                    getYoutubeId(url) ? "bg-red-600 text-white" : "bg-primary text-white"
                  )}>
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>
            ) : url ? (
              <div className="flex flex-col items-center justify-center p-6 border border-gray-200 border-dashed rounded-lg bg-gray-50 gap-2">
                 <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                   <Video size={20} />
                 </div>
                 <span className="text-[10px] text-gray-500 font-medium">Link video terdeteksi</span>
              </div>
            ) : (
              <div className="text-[11px] text-gray-400 text-center italic py-4">
                Enter a video link to generate preview
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
