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
      {msg.text && <p className="pr-10 whitespace-pre-wrap">{msg.text}</p>}
      
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
