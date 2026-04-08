import React, { useRef, useEffect } from 'react';
import { Trash2, Download, Upload } from 'lucide-react';
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
  onImport: (data: { settings: ChatSettings; messages: Message[] }) => void;
}

export const PhonePreview: React.FC<PhonePreviewProps> = ({ settings, messages, clearAll, onImport }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleExport = () => {
    const exportData = { settings, messages };
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wa-chat-${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (
          typeof parsed === 'object' &&
          parsed !== null &&
          Array.isArray(parsed.messages) &&
          typeof parsed.settings === 'object'
        ) {
          onImport(parsed);
        } else {
          alert('Format JSON tidak valid. Pastikan file memiliki properti "messages" (array) dan "settings" (object).');
        }
      } catch {
        alert('File tidak dapat dibaca. Pastikan file adalah JSON yang valid.');
      }
    };
    reader.readAsText(file);
    // Reset input so the same file can be re-imported
    e.target.value = '';
  };

  return (
    <div className="flex-1 flex items-center justify-center sticky top-8 h-full p-4 my-auto">
      <div className="relative h-full">
        {/* Device Frame */}
        <div className={cn(
          "relative w-[380px] aspect-9/18 bg-black rounded-[3rem] p-3 shadow-2xl border-8 border-gray-800 overflow-hidden",
          settings.layout === 'desktop' && "w-[600px] h-[400px] rounded-xl border-4"
        )}>
          {/* Screen Content */}
          <div className={cn(
            "w-full h-full rounded-4xl overflow-hidden flex flex-col relative",
            settings.isDarkMode ? "bg-chat-dark text-[#e9edef]" : "bg-chat-light text-[#111b21]"
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
          {/* Clear All */}
          <button 
            onClick={clearAll}
            className="w-12 h-12 bg-red-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 active:scale-95 transition-all"
            title="Hapus semua pesan"
          >
            <Trash2 size={20} />
          </button>

          {/* Export Chat */}
          <button 
            onClick={handleExport}
            className="w-12 h-12 bg-emerald-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-600 active:scale-95 transition-all"
            title="Export chat ke JSON"
          >
            <Download size={20} />
          </button>

          {/* Import Chat */}
          <button 
            onClick={handleImportClick}
            className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 active:scale-95 transition-all"
            title="Import chat dari JSON"
          >
            <Upload size={20} />
          </button>

          {/* Hidden file input for import */}
          <input
            ref={importInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
