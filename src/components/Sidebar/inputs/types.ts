import React from 'react';
import { ChatSettings, MessageStatus, MessageType } from '../../../types';

export interface MessageInputProps {
  msgText: string;
  setMsgText: (text: string) => void;
  msgTime: string;
  setMsgTime: (time: string) => void;
  msgStatus: MessageStatus;
  setMsgStatus: (status: MessageStatus) => void;
  msgReaction: string;
  setMsgReaction: (reaction: string) => void;
  msgFile: string | null;
  setMsgFile: (file: string | null) => void;
  fileInputRef?: React.RefObject<HTMLInputElement>;
  handleMsgFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
