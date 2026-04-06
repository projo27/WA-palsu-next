import React from 'react';
import { ChatSettings } from '../../types';
import { cn } from '../../lib/utils';
import { WAIcon } from '../WAIcon';

interface ChatFooterProps {
  settings: ChatSettings;
}

export const ChatFooter: React.FC<ChatFooterProps> = ({ settings }) => {
  if (settings.hideFooter) return null;

  return (
    <footer className={cn(
      "p-2 flex items-center gap-2",
      settings.isDarkMode ? "bg-[#0b141a]" : "bg-transparent"
    )}>
      <div className={cn(
        "flex-1 flex items-center gap-2 rounded-full px-3 py-1.5",
        settings.isDarkMode ? "bg-[#2a3942]" : "bg-white shadow-sm"
      )}>
        <WAIcon name="smile" size={24} className="opacity-60" isDarkMode={settings.isDarkMode} />
        <span className="flex-1 text-xs opacity-50 ml-1">Message</span>
        {settings.showPayment && <span className="text-[#00a884] font-bold text-sm">$</span>}
        <WAIcon name="paperclip" size={20} className="opacity-60" isDarkMode={settings.isDarkMode} />
        <WAIcon name="camera" size={24} className="opacity-60" isDarkMode={settings.isDarkMode} />
      </div>
      <div className="w-11 h-11 rounded-full bg-[#00a884] flex items-center justify-center shadow-md">
        <WAIcon name="mic" size={24} isDarkMode={true} />
      </div>
    </footer>
  );
};
