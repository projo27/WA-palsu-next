import React from 'react';
import { ChatSettings } from '../../types';
import { cn } from '../../lib/utils';
import { WAIcon } from '../WAIcon';

interface ChatHeaderProps {
  settings: ChatSettings;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ settings }) => {
  if (settings.hideHeader) return null;

  return (
    <header className={cn(
      "flex items-center justify-between px-3 py-2 z-20 shadow-sm",
      settings.isDarkMode ? "bg-[#202c33]" : "bg-[#f0f2f5]"
    )}>
      <div className="flex items-center gap-1">
        <WAIcon name="backArrow" size={24} className="-ml-1" isDarkMode={settings.isDarkMode} />
        <div className="flex items-center gap-2">
          <img src={settings.receiverAvatar} alt="Avatar" className="w-9 h-9 rounded-full object-cover cursor-pointer" />
          <div className="leading-tight">
            <h1 className="font-semibold text-sm flex items-center gap-1 cursor-pointer">
              {settings.receiverName}
              {settings.isGroup && <WAIcon name="chevronDown" size={16} isDarkMode={settings.isDarkMode} />}
            </h1>
            <p className="text-[10px] opacity-70 truncate max-w-[120px]">
              {settings.isGroup ? settings.groupMembers : settings.receiverStatus}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 mr-1">
        <WAIcon name="video" size={24} isDarkMode={settings.isDarkMode} />
        <WAIcon name="phone" size={24} isDarkMode={settings.isDarkMode} />
        <WAIcon name="more" size={24} isDarkMode={settings.isDarkMode} />
      </div>
    </header>
  );
};
