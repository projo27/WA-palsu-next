import React, { useState, useRef, useEffect } from 'react';
import { MessageStatus, ChatSettings } from '../../../types';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';

export interface SharedMessageOptionsProps {
  msgTime: string;
  setMsgTime: (time: string) => void;
  msgStatus: MessageStatus;
  setMsgStatus: (status: MessageStatus) => void;
  msgReaction: string;
  setMsgReaction: (reaction: string) => void;
  settings?: ChatSettings;
}

export const SharedMessageOptions: React.FC<SharedMessageOptionsProps> = ({
  msgTime,
  setMsgTime,
  msgStatus,
  setMsgStatus,
  msgReaction,
  setMsgReaction,
  settings,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  const handleEmojiSelect = (emoji: any) => {
    // emoji-mart uses .native, emoji-picker-react uses .emoji
    const emojiChar = emoji.emoji || emoji.native;
    if (emojiChar) {
      setMsgReaction(emojiChar);
    }
    setShowEmojiPicker(false);
  };

  const getEmojiStyle = () => {
    const layout = settings?.layout || 'android';
    if (layout === 'ios') return EmojiStyle.APPLE;
    if (layout === 'android') return EmojiStyle.GOOGLE;
    if (layout === 'desktop') return EmojiStyle.TWITTER;
    return EmojiStyle.NATIVE;
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 capitalize">
          Message Time
        </label>
        <input
          type="time"
          value={msgTime}
          onChange={(e) => setMsgTime(e.target.value)}
          className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 capitalize">
          Status
        </label>
        <select
          value={msgStatus}
          onChange={(e) => setMsgStatus(e.target.value as MessageStatus)}
          className="w-full p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all border-r-8 border-transparent outline outline-gray-200"
        >
          <option value="none">None</option>
          <option value="sent">Sent</option>
          <option value="delivered">Delivered</option>
          <option value="seen">Seen</option>
        </select>
      </div>
      <div className="space-y-1 relative">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-500 capitalize">
            Reaction
          </label>
          {msgReaction && (
            <button 
              onClick={() => setMsgReaction('')}
              className="text-[10px] text-red-500 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all flex items-center justify-between bg-white h-[42px]"
          >
            <span className="truncate">{msgReaction || 'None'}</span>
            <span className="text-gray-400 text-[10px]">▼</span>
          </button>
          
          {showEmojiPicker && (
            <div 
              ref={pickerRef}
              className="absolute bottom-full right-0 mb-2 z-[9999] shadow-2xl rounded-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-100"
            >
              <EmojiPicker 
                onEmojiClick={(emojiData) => handleEmojiSelect(emojiData)}
                emojiStyle={getEmojiStyle()}
                theme={settings?.isDarkMode ? Theme.DARK : Theme.LIGHT}
                lazyLoadEmojis={true}
                searchPlaceholder="Search emoji..."
                width="100%"
                height="400px"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
