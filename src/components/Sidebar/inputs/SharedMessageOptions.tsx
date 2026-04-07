import React from 'react';
import { MessageStatus } from '../../../types';

export interface SharedMessageOptionsProps {
  msgTime: string;
  setMsgTime: (time: string) => void;
  msgStatus: MessageStatus;
  setMsgStatus: (status: MessageStatus) => void;
  msgReaction: string;
  setMsgReaction: (reaction: string) => void;
}

export const SharedMessageOptions: React.FC<SharedMessageOptionsProps> = ({
  msgTime,
  setMsgTime,
  msgStatus,
  setMsgStatus,
  msgReaction,
  setMsgReaction,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase">
          Message Time
        </label>
        <input
          type="time"
          value={msgTime}
          onChange={(e) => setMsgTime(e.target.value)}
          className="w-full p-2 rounded border border-gray-200 text-sm"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase">
          Status
        </label>
        <select
          value={msgStatus}
          onChange={(e) => setMsgStatus(e.target.value as MessageStatus)}
          className="w-full p-2 rounded border border-gray-200 text-sm"
        >
          <option value="none">None</option>
          <option value="sent">Sent</option>
          <option value="delivered">Delivered</option>
          <option value="seen">Seen</option>
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase">
          Reaction
        </label>
        <select
          value={msgReaction}
          onChange={(e) => setMsgReaction(e.target.value)}
          className="w-full p-2 rounded border border-gray-200 text-sm"
        >
          <option value="">None</option>
          <option value="👍">👍</option>
          <option value="❤️">❤️</option>
          <option value="😂">😂</option>
          <option value="😮">😮</option>
          <option value="😢">😢</option>
          <option value="🙏">🙏</option>
        </select>
      </div>
    </div>
  );
};
