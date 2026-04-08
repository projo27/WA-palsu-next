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
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 capitalize">
          Reaction
        </label>
        <select
          value={msgReaction}
          onChange={(e) => setMsgReaction(e.target.value)}
          className="w-full p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all border-r-8 border-transparent outline outline-gray-200"
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
