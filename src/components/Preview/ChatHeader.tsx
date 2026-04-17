import React from "react";
import { cn } from "../../lib/utils";
import { ChatSettings } from "../../types";
import { WAIcon } from "../WAIcon";

interface ChatHeaderProps {
  settings: ChatSettings;
  onImageClick?: (url: string) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  settings,
  onImageClick,
}) => {
  if (settings.hideHeader) return null;

  return (
    <header
      className={cn(
        "flex items-center justify-between px-3 py-2 z-20 shadow-sm",
        settings.isDarkMode ? "bg-bubble-receiver-dark" : "bg-[#f0f2f5]",
      )}
    >
      <div className="flex-1 flex items-center gap-1">
        <WAIcon
          name="backArrow"
          size={24}
          className="-ml-1"
          isDarkMode={settings.isDarkMode}
        />
        <div className="flex items-center gap-2">
          <img
            src={settings.receiverAvatar}
            alt="Avatar"
            className="w-9 h-9 rounded-full object-cover cursor-pointer"
            onClick={() => onImageClick?.(settings.receiverAvatar)}
          />
          <div className="leading-tight min-w-0">
            <h1
              className="font-semibold flex items-center gap-1 cursor-pointer"
              style={{ fontSize: `${(settings.uiTextSize || 13) + 1}px` }}
            >
              <div className="truncate">{settings.receiverName}</div>
            </h1>
            <p
              className="opacity-70 truncate max-w-[120px]"
              style={{ fontSize: `${(settings.uiTextSize || 13) - 3}px` }}
            >
              {settings.isGroup
                ? `${settings.groupParticipants?.length ? settings.groupParticipants.map((p) => p.name).join(", ") + ", You" : "You"}`
                : settings.receiverStatus}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-self-end gap-2 ml-auto">
        {/* {settings.isGroup && (
          <WAIcon
            name="chevronDown"
            size={16}
            isDarkMode={settings.isDarkMode}
          />
        )} */}
        <WAIcon name="video" size={24} isDarkMode={settings.isDarkMode} />
        {settings.isGroup && (
          <span className="-ml-2 text-sm self-center">▾</span>
        )}
        {!settings.isGroup && (
          <WAIcon name="phone" size={24} isDarkMode={settings.isDarkMode} />
        )}
        <WAIcon name="more" size={24} isDarkMode={settings.isDarkMode} />
      </div>
    </header>
  );
};
