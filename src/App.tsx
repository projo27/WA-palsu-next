/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Message, ChatSettings, MessageStatus, MessageType } from './types';
import { DEFAULT_SETTINGS } from './constants';
import { Sidebar } from './components/Sidebar/Sidebar';
import { PhonePreview } from './components/Preview/PhonePreview';

export default function App() {
  const [activeTab, setActiveTab] = useState<'display' | 'chat' | 'group'>('display');
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Form States for adding message
  const [msgText, setMsgText] = useState('');
  const [msgSender, setMsgSender] = useState<'user' | 'bot'>('bot');
  const [msgTime, setMsgTime] = useState('07:49');
  const [msgStatus, setMsgStatus] = useState<MessageStatus>('seen');
  const [msgType, setMsgType] = useState<MessageType>('text');
  const [msgReaction, setMsgReaction] = useState('');
  const [msgFile, setMsgFile] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('wa_fake_gen_v2');
    if (saved) {
      const data = JSON.parse(saved);
      setSettings(data.settings);
      setMessages(data.messages);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wa_fake_gen_v2', JSON.stringify({ settings, messages }));
  }, [settings, messages]);

  const addMessage = () => {
    if (!msgText && msgType === 'text') return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: (msgType === 'date' && !msgText) ? 'Today' : msgText,
      type: msgType,
      sender: msgSender,
      timestamp: msgTime,
      status: msgStatus,
      reaction: msgReaction,
      fileUrl: msgFile || undefined
    };
    
    setMessages([...messages, newMessage]);
    setMsgText('');
    setMsgFile(null);
  };

  const resetForm = () => {
    setMsgText('');
    setMsgTime('07:49');
    setMsgStatus('seen');
    setMsgType('text');
    setMsgReaction('');
    setMsgFile(null);
  };

  const resetGroup = () => {
    setSettings({
      ...settings,
      receiverName: 'Group Name',
      groupMembers: 'Member1, Member2',
      isGroup: true
    });
  };

  const clearAll = () => {
    setMessages([]);
    localStorage.removeItem('wa_fake_gen_v2');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row p-4 md:p-8 gap-8 overflow-x-hidden">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        setSettings={setSettings}
        msgText={msgText}
        setMsgText={setMsgText}
        msgSender={msgSender}
        setMsgSender={setMsgSender}
        msgTime={msgTime}
        setMsgTime={setMsgTime}
        msgStatus={msgStatus}
        setMsgStatus={setMsgStatus}
        msgType={msgType}
        setMsgType={setMsgType}
        msgReaction={msgReaction}
        setMsgReaction={setMsgReaction}
        msgFile={msgFile}
        setMsgFile={setMsgFile}
        addMessage={addMessage}
        resetForm={resetForm}
        resetGroup={resetGroup}
      />

      <PhonePreview 
        settings={settings}
        messages={messages}
        clearAll={clearAll}
      />
    </div>
  );
}
