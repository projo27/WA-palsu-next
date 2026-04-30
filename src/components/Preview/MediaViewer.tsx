import { X } from "lucide-react";
import React from "react";

interface MediaViewerProps {
  mediaUrl: string | null;
  onClose: () => void;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({
  mediaUrl,
  onClose,
}) => {
  if (!mediaUrl) return null;

  const isYouTube = mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be");
  const isVideo =
    mediaUrl.startsWith("blob:") ||
    mediaUrl.endsWith(".mp4") ||
    mediaUrl.endsWith(".webm") ||
    mediaUrl.endsWith(".mov");

  const getYouTubeId = (url: string) => {
    return (
      url.match(
        /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/,
      )?.[2] || ""
    );
  };

  return (
    <div className="absolute inset-0 z-110 bg-black flex items-center justify-center p-4 animate-in fade-in duration-300">
      <button
        onClick={onClose}
        className="absolute top-10 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors shadow-lg z-50"
      >
        <X size={24} />
      </button>

      {isYouTube ? (
        <iframe
          src={`https://www.youtube.com/embed/${getYouTubeId(mediaUrl)}`}
          className="w-full aspect-video max-w-4xl shadow-2xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : isVideo ? (
        <video
          src={mediaUrl}
          controls
          autoPlay
          className="max-w-full max-h-full shadow-2xl rounded-lg"
        ></video>
      ) : (
        <img
          src={mediaUrl}
          alt="Full view"
          className="max-w-full max-h-full object-contain shadow-2xl"
        />
      )}

      <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
        <span className="text-white/60 text-xs font-medium tracking-wide">
          TAP ANYWHERE TO CLOSE
        </span>
      </div>
      {/* Backdrop click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
};
