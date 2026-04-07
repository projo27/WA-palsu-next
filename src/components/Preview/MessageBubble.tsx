import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { Message, ChatSettings } from '../../types';
import { cn, getContrastColor } from '../../lib/utils';

interface MessageBubbleProps {
  msg: Message;
  settings: ChatSettings;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ msg, settings }) => {
  if (msg.type === 'date') {
    return (
      <div className="self-center my-2 px-3 py-1 rounded-lg bg-black/10 text-[10px] uppercase font-medium">
        {msg.text}
      </div>
    );
  }

  const userColor = settings.userBubbleColor || (settings.isDarkMode ? "#005c4b" : "#d9fdd3");
  const receiverColor = settings.receiverBubbleColor || (settings.isDarkMode ? "#202c33" : "#ffffff");
  const backgroundColor = msg.sender === 'user' ? userColor : receiverColor;
  const textColor = getContrastColor(backgroundColor);

  return (
    <div 
      className={cn(
        "max-w-[85%] rounded-lg px-2 py-1 relative shadow-sm mb-1",
        msg.sender === 'user' ? "self-end" : "self-start",
      settings.showChatArrow && msg.sender === 'user' && "rounded-tr-none",
      settings.showChatArrow && msg.sender !== 'user' && "rounded-tl-none",
      settings.textSize === 'small' && "text-[11px]",
      settings.textSize === 'default' && "text-xs",
      settings.textSize === 'large' && "text-sm"
    )} style={{ backgroundColor, color: textColor }}>
      {msg.fileUrl && (
        <div className="mb-1">
          <img src={msg.fileUrl} alt="Sent" className="rounded-md max-w-full max-h-64 object-contain" />
        </div>
      )}
      
      {msg.type === 'file' ? (() => {
        let docName = 'document', docExt = 'JPG', docSize = '12', docSizeType = 'Bytes';
        try {
          if (msg.text && msg.text.startsWith('{')) {
            const parsed = JSON.parse(msg.text);
            docName = parsed.docName || docName;
            docExt = parsed.docExt || docExt;
            docSize = parsed.docSize || docSize;
            docSizeType = parsed.docSizeType || docSizeType;
          }
        } catch(e) {}
        
        let sizeUnit = docSizeType;
        if (docSizeType === 'Bytes') sizeUnit = 'B';
        
        return (
          <div className="flex items-center gap-3 bg-black/5 p-2 rounded-lg mb-1 pr-10 hover:bg-black/10 transition-colors min-w-[200px]">
            <div className="w-9 h-11 bg-black/10 rounded-sm relative flex items-center justify-center shrink-0">
              <div className="absolute inset-x-0 bottom-1 flex justify-center">
                <span className="text-[8px] font-bold opacity-70 bg-white/50 px-1 rounded-sm">{docExt.substring(0,3)}</span>
              </div>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-sm truncate">{docName}.{docExt.toLowerCase()}</span>
              <span className="text-[10px] opacity-60">
                {docSize} {sizeUnit} • {docExt.toLowerCase()}
              </span>
            </div>
          </div>
        );
      })() : msg.type === 'call' ? (() => {
        let callMode = 'video', callType = 'Call', hh = '', mm = '', ss = '';
        try {
          if (msg.text && msg.text.startsWith('{')) {
            const parsed = JSON.parse(msg.text);
            callMode = parsed.callMode || callMode;
            callType = parsed.callType || callType;
            hh = parsed.hh || hh;
            mm = parsed.mm || mm;
            ss = parsed.ss || ss;
          }
        } catch(e) {}
        
        let durationText = '';
        if (['Missed Call', 'No Answer', 'Declined'].includes(callType)) {
          durationText = callType === 'No Answer' ? 'No answer' : callType;
        } else {
          let t = [];
          if (hh) t.push(`${hh} hr`);
          if (mm) t.push(`${mm} min`);
          if (ss) t.push(`${ss} sec`);
          if (t.length === 0) durationText = '0 sec';
          else durationText = t.join(' ');
        }
        
        return (
          <div className="flex items-center gap-3 bg-black/5 p-2 rounded-lg mb-1 pr-14 hover:bg-black/10 transition-colors">
            <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center shrink-0">
              {callMode === 'video' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.03 21c.75 0 .99-.65.99-1.19v-3.44c0-.54-.45-.99-.99-.99z"/></svg>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[15px]">{callMode === 'video' ? 'Video call' : 'Voice call'}</span>
              <span className="text-xs opacity-60">{durationText}</span>
            </div>
          </div>
        );
      })() : (
        msg.text && <p className="pr-10 whitespace-pre-wrap">{msg.text}</p>
      )}
      
      <div className="flex items-center justify-end gap-1 mt-0.5">
        <span className="text-[9px] opacity-60">{msg.timestamp}</span>
        {msg.sender === 'user' && msg.status !== 'none' && (
          <span className={cn(msg.status === 'seen' ? "text-blue-400" : "text-gray-400")}>
            {msg.status === 'seen' || msg.status === 'delivered' ? <CheckCheck size={12} /> : <Check size={12} />}
          </span>
        )}
      </div>

      {msg.reaction && (
        <div className={cn(
          "absolute -bottom-2 right-1 px-1 rounded-full text-[10px] shadow-sm border",
          settings.isDarkMode ? "bg-[#202c33] border-gray-700" : "bg-white border-gray-100"
        )}>
          {msg.reaction}
        </div>
      )}
    </div>
  );
};
