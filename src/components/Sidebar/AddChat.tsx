import React, { useRef } from 'react';
import { 
  Upload, 
  ArrowLeft, 
  MessageSquare, 
  Calendar, 
  File as FileIcon, 
  PhoneCall, 
  Contact, 
  Trash2, 
  Plus, 
  RotateCcw,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { ChatSettings, MessageStatus, MessageType } from '../../types';
import { cn } from '../../lib/utils';

interface AddChatProps {
  activeTab: 'chat' | 'group';
  settings: ChatSettings;
  setSettings: (settings: ChatSettings) => void;
  msgText: string;
  setMsgText: (text: string) => void;
  msgSender: 'user' | 'bot';
  setMsgSender: (sender: 'user' | 'bot') => void;
  msgTime: string;
  setMsgTime: (time: string) => void;
  msgStatus: MessageStatus;
  setMsgStatus: (status: MessageStatus) => void;
  msgType: MessageType;
  setMsgType: (type: MessageType) => void;
  msgReaction: string;
  setMsgReaction: (reaction: string) => void;
  msgFile: string | null;
  setMsgFile: (file: string | null) => void;
  addMessage: () => void;
  resetForm: () => void;
  resetGroup?: () => void;
}

export const AddChat: React.FC<AddChatProps> = ({
  activeTab,
  settings,
  setSettings,
  msgText,
  setMsgText,
  msgSender,
  setMsgSender,
  msgTime,
  setMsgTime,
  msgStatus,
  setMsgStatus,
  msgType,
  setMsgType,
  msgReaction,
  setMsgReaction,
  msgFile,
  setMsgFile,
  addMessage,
  resetForm,
  resetGroup
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleMsgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setMsgFile(ev.target?.result as string);
        setMsgType('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSettings({ ...settings, receiverAvatar: ev.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Profile Section */}
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={() => profileInputRef.current?.click()}>
            <img src={settings.receiverAvatar} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload size={16} className="text-white" />
            </div>
            <input type="file" ref={profileInputRef} className="hidden" onChange={handleProfileUpload} />
          </div>
          <div className="flex-1 space-y-2">
            <input 
              type="text" 
              placeholder={activeTab === 'chat' ? "Receiver's Name" : "Group Name"}
              value={settings.receiverName}
              onChange={(e) => setSettings({ ...settings, receiverName: e.target.value })}
              className="w-full p-2 rounded border border-gray-200 text-sm"
            />
            <input 
              type="text" 
              placeholder={activeTab === 'chat' ? "Status (Online/Offline)" : "Members (Member1, Member2...)"}
              value={activeTab === 'chat' ? settings.receiverStatus : settings.groupMembers}
              onChange={(e) => activeTab === 'chat' 
                ? setSettings({ ...settings, receiverStatus: e.target.value })
                : setSettings({ ...settings, groupMembers: e.target.value })
              }
              className="w-full p-2 rounded border border-gray-200 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Sender/Receiver Toggle */}
      <div className="flex bg-gray-100 rounded-full p-1">
        <button 
          onClick={() => setMsgSender('bot')}
          className={cn(
            "flex-1 py-2 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2",
            msgSender === 'bot' ? "bg-white shadow-sm text-gray-800" : "text-gray-500"
          )}
        >
          <ArrowLeft size={14} className="rotate-180" /> Receiver
        </button>
        <button 
          onClick={() => setMsgSender('user')}
          className={cn(
            "flex-1 py-2 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2",
            msgSender === 'user' ? "bg-[#539ba0] shadow-sm text-white" : "text-gray-500"
          )}
        >
          <ArrowLeft size={14} /> Sender (You)
        </button>
      </div>

      {/* Message Type Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {(['text', 'date', 'file', 'call', 'contact'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setMsgType(t)}
            className={cn(
              "px-4 py-2 text-sm font-medium whitespace-nowrap transition-all border-b-2",
              msgType === t ? "border-[#539ba0] text-[#539ba0]" : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {t === 'text' && <MessageSquare size={14} className="inline mr-1" />}
            {t === 'date' && <Calendar size={14} className="inline mr-1" />}
            {t === 'file' && <FileIcon size={14} className="inline mr-1" />}
            {t === 'call' && <PhoneCall size={14} className="inline mr-1" />}
            {t === 'contact' && <Contact size={14} className="inline mr-1" />}
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Message Input */}
      <div className="space-y-4">
        <div className="relative">
          <textarea 
            placeholder="Type message here..."
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-200 text-sm min-h-[100px] focus:ring-2 focus:ring-[#539ba0]/20 focus:border-[#539ba0] outline-none transition-all"
          />
          <button 
            onClick={() => setMsgText('')}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Add Image Section */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-all"
        >
          {msgFile ? (
            <div className="relative">
              <img src={msgFile} alt="Preview" className="h-20 rounded shadow-sm" />
              <button 
                onClick={(e) => { e.stopPropagation(); setMsgFile(null); }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <>
              <ImageIcon size={24} className="text-gray-400" />
              <span className="text-xs text-gray-500">Add Image / Video Thumbnails</span>
            </>
          )}
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleMsgFileUpload} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Message Time</label>
            <input 
              type="text" 
              value={msgTime}
              onChange={(e) => setMsgTime(e.target.value)}
              className="w-full p-2 rounded border border-gray-200 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Status</label>
            <select 
              value={msgStatus}
              onChange={(e) => setMsgStatus(e.target.value as any)}
              className="w-full p-2 rounded border border-gray-200 text-sm"
            >
              <option value="none">None</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="seen">Seen</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Reaction</label>
            <input 
              type="text" 
              placeholder="👍"
              value={msgReaction}
              onChange={(e) => setMsgReaction(e.target.value)}
              className="w-full p-2 rounded border border-gray-200 text-sm"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            onClick={addMessage}
            className="flex-1 py-3 bg-[#539ba0] text-white rounded-lg font-bold shadow-md hover:bg-[#458287] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add Message
          </button>
          <button 
            onClick={resetForm}
            className="px-6 py-3 border border-red-200 text-red-500 rounded-lg font-bold hover:bg-red-50 transition-all flex items-center gap-2"
          >
            <RotateCcw size={18} /> Reset Form
          </button>
          {activeTab === 'group' && resetGroup && (
            <button 
              onClick={resetGroup}
              className="px-6 py-3 border border-red-200 text-red-500 rounded-lg font-bold hover:bg-red-50 transition-all flex items-center gap-2"
            >
              <RotateCcw size={18} /> Reset Group
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
