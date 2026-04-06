import React from 'react';
import { Smile, Paperclip, Camera, Mic } from 'lucide-react';
import { ChatSettings } from '../../types';
import { cn } from '../../lib/utils';

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
        <Smile size={20} className="opacity-60" />
        <span className="flex-1 text-xs opacity-50">Message</span>
        {settings.showPayment && <span className="text-[#00a884] font-bold text-sm">$</span>}
        <Paperclip size={20} className="opacity-60 -rotate-45" />
        <Camera size={20} className="opacity-60" />
      </div>
      <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-white shadow-md">
        <Mic size={20} />
      </div>
    </footer>
  );
};
