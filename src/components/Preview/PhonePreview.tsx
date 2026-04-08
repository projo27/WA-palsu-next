import React, { useRef, useEffect } from 'react';
import { Trash2, File as FileIcon } from 'lucide-react';
import { Message, ChatSettings } from '../../types';
import { cn } from '../../lib/utils';
import { StatusBar } from './StatusBar';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { ChatFooter } from './ChatFooter';
import { NavigationBar } from './NavigationBar';
import bgDark from '../../assets/image/whatsapp-bg-dark.png';
import bgLight from '../../assets/image/whatsapp-bg-light.png';

interface PhonePreviewProps {
  settings: ChatSettings;
  messages: Message[];
  clearAll: () => void;
}

export const PhonePreview: React.FC<PhonePreviewProps> = ({ settings, messages, clearAll }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex items-center justify-center sticky top-8 h-full p-8 my-auto">
      <div className="relative h-full">
        {/* Device Frame */}
        <div className={cn(
          "relative w-[380px] aspect-9/16 bg-black rounded-[3rem] p-3 shadow-2xl border-8 border-gray-800 overflow-hidden",
          settings.layout === 'desktop' && "w-[600px] h-[400px] rounded-xl border-4"
        )}>
          {/* Screen Content */}
          <div className={cn(
            "w-full h-full rounded-4xl overflow-hidden flex flex-col relative",
            settings.isDarkMode ? "bg-[#0b141a] text-[#e9edef]" : "bg-[#efeae2] text-[#111b21]"
          )} style={{ 
            backgroundColor: settings.chatBackgroundColor,
            fontFamily: settings.layout === 'android' ? '"Roboto", sans-serif' : '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          }}>
            
            <StatusBar settings={settings} />
            <ChatHeader settings={settings} />

            {/* Chat Content */}
            <main className="flex-1 overflow-y-auto p-3 space-y-2 relative custom-scrollbar">
              {/* Background Pattern */}
              <div 
                className="absolute h-full w-full inset-0 pointer-events-none bg-repeat opacity-[0.4] bg-size-[400px_auto]"
                style={{ backgroundImage: `url(${settings.isDarkMode ? bgDark : bgLight})` }}
              />
              
              <div className="flex flex-col gap-1 relative z-10">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex flex-col">
                    <MessageBubble msg={msg} settings={settings} />
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </main>

            <ChatFooter settings={settings} />
            <NavigationBar settings={settings} />
          </div>
        </div>

        {/* Floating Action Buttons for Preview */}
        <div className="absolute -right-16 top-0 flex flex-col gap-2">
          <button 
            onClick={clearAll}
            className="w-12 h-12 bg-red-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 transition-all"
            title="Clear All"
          >
            <Trash2 size={20} />
          </button>
          <button 
            onClick={() => window.print()}
            className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all"
            title="Download/Print"
          >
            <FileIcon size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
