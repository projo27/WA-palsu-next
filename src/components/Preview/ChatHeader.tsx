import React from 'react';
import { ArrowLeft, ChevronDown, Video, Phone, MoreVertical } from 'lucide-react';
import { ChatSettings } from '../../types';
import { cn } from '../../lib/utils';

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
        <ArrowLeft size={20} />
        <div className="flex items-center gap-2">
          <img src={settings.receiverAvatar} alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
          <div className="leading-tight">
            <h1 className="font-semibold text-sm flex items-center gap-1">
              {settings.receiverName}
              {settings.isGroup && <ChevronDown size={12} />}
            </h1>
            <p className="text-[10px] opacity-70 truncate max-w-[120px]">
              {settings.isGroup ? settings.groupMembers : settings.receiverStatus}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Video size={18} />
        <Phone size={16} />
        <MoreVertical size={18} />
      </div>
    </header>
  );
};
