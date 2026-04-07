import React from 'react';
import { Trash2, X, Image as ImageIcon } from 'lucide-react';
import { MessageInputProps } from './types';

export const TextMessageInput: React.FC<MessageInputProps> = ({
  msgText, setMsgText, msgTime, setMsgTime, msgStatus, setMsgStatus, msgReaction, setMsgReaction, msgFile, setMsgFile, fileInputRef, handleMsgFileUpload
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
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
        onClick={() => fileInputRef?.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-all"
      >
        {msgFile ? (
          <div className="relative">
            <img src={msgFile} alt="Preview" className="h-20 rounded shadow-sm" />
            <button 
              onClick={(e) => { e.stopPropagation(); setMsgFile(''); }}
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
        {handleMsgFileUpload && fileInputRef && <input type="file" ref={fileInputRef} className="hidden" onChange={handleMsgFileUpload} />}
      </div>

    </div>
  );
};
