import React from "react";
import { cn } from "../../lib/utils";
import { ChatSettings } from "../../types";
import { WAIcon } from "../WAIcon";

interface ChatFooterProps {
  settings: ChatSettings;
}

export const ChatFooter: React.FC<ChatFooterProps> = ({ settings }) => {
  if (settings.hideFooter) return null;

  return (
    <footer
      className={cn(
        "p-2 flex items-center gap-2 z-100",
        settings.isDarkMode ? "bg-chat-dark" : "bg-transparent",
      )}
    >
      <div
        className={cn(
          "flex-1 flex items-center gap-2 rounded-full px-3 py-1.5",
          settings.isDarkMode ? "bg-[#2a3942]" : "bg-white",
        )}
      >
        <WAIcon
          name="smile"
          size={24}
          className="opacity-60"
          isDarkMode={settings.isDarkMode}
        />
        <span className="flex-1 ml-1 opacity-60" style={{ fontSize: `${(settings.uiTextSize || 13) - 1}px` }}>Message</span>
        {settings.showPayment && (
          <span className="text-primary font-bold" style={{ fontSize: `${(settings.uiTextSize || 13) + 1}px` }}>$</span>
        )}
        <WAIcon
          name="paperclip"
          size={20}
          className="opacity-60"
          isDarkMode={settings.isDarkMode}
        />
        <WAIcon
          name="camera"
          size={24}
          className="opacity-60"
          isDarkMode={settings.isDarkMode}
        />
      </div>
      <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-md">
        <WAIcon name="mic" size={24} isDarkMode={true} />
      </div>
    </footer>
  );
};
