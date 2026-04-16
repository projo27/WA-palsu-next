/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { PhonePreview } from "./components/Preview/PhonePreview";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { DEFAULT_SETTINGS } from "./constants";
import { ChatSettings, Message, MessageStatus, MessageType } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"display" | "chat" | "group">(
    "display",
  );
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  // Form States for adding message
  const [msgText, setMsgText] = useState("");
  const [msgSender, setMsgSender] = useState<"user" | "bot">("bot");
  const [msgTime, setMsgTime] = useState("07:49");
  const [msgStatus, setMsgStatus] = useState<MessageStatus>("seen");
  const [msgType, setMsgType] = useState<MessageType>("text");
  const [msgReaction, setMsgReaction] = useState("");
  const [msgFile, setMsgFile] = useState<string | null>(null);
  const [msgBotSenderId, setMsgBotSenderId] = useState<string>("1");

  useEffect(() => {
    const saved = localStorage.getItem("wa_fake_gen_v2");
    if (saved) {
      const data = JSON.parse(saved);
      setSettings({
        ...DEFAULT_SETTINGS,
        ...data.settings,
        groupParticipants:
          data.settings.groupParticipants || DEFAULT_SETTINGS.groupParticipants,
      });
      setMessages(data.messages);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "wa_fake_gen_v2",
      JSON.stringify({ settings, messages }),
    );
  }, [settings, messages]);

  const addMessage = () => {
    if (!msgText && msgType === "text") return;
    
    let currentSenderName, currentSenderColor;
    if (activeTab === "group" && msgSender === "bot") {
      const participant = settings.groupParticipants?.find(
        (p) => p.id === msgBotSenderId,
      );
      if (participant) {
        currentSenderName = participant.name;
        currentSenderColor = participant.color;
      }
    }

    if (editingMessageId) {
      setMessages(
        messages.map((m) =>
          m.id === editingMessageId
            ? {
                ...m,
                text: msgType === "date" && !msgText ? "Today" : msgText,
                type: msgType === "image" && !msgFile ? "text" : msgType,
                sender: msgSender,
                timestamp: msgTime,
                status: msgStatus,
                reaction: msgReaction,
                fileUrl: msgFile || undefined,
                senderName: currentSenderName,
                senderColor: currentSenderColor,
              }
            : m,
        ),
      );
      setEditingMessageId(null);
    } else {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: msgType === "date" && !msgText ? "Today" : msgText,
        type: msgType,
        sender: msgSender,
        timestamp: msgTime,
        status: msgStatus,
        reaction: msgReaction,
        fileUrl: msgFile || undefined,
        senderName: currentSenderName,
        senderColor: currentSenderColor,
      };
      setMessages([...messages, newMessage]);
    }
    setMsgText("");
    setMsgFile(null);
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    resetForm();
  };

  const handleEditRequest = (msg: Message) => {
    setEditingMessageId(msg.id);
    setMsgText(msg.text || "");
    setMsgType(msg.type);
    setMsgSender(msg.sender === "system" ? "bot" : msg.sender);
    setMsgTime(msg.timestamp);
    setMsgStatus(msg.status);
    setMsgReaction(msg.reaction || "");
    setMsgFile(msg.fileUrl || null);

    // Switch to active tab handling
    if (!settings.isGroup) {
      setActiveTab("chat");
    } else {
      setActiveTab("group");
    }
  };

  const deleteMessage = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
  };

  const moveMessage = (id: string, direction: "up" | "down") => {
    const idx = messages.findIndex((m) => m.id === id);
    if (idx < 0) return;
    const newMsgs = [...messages];
    if (direction === "up" && idx > 0) {
      [newMsgs[idx - 1], newMsgs[idx]] = [newMsgs[idx], newMsgs[idx - 1]];
      setMessages(newMsgs);
    } else if (direction === "down" && idx < messages.length - 1) {
      [newMsgs[idx], newMsgs[idx + 1]] = [newMsgs[idx + 1], newMsgs[idx]];
      setMessages(newMsgs);
    }
  };

  const toggleMessageSender = (id: string) => {
    setMessages(
      messages.map((m) =>
        m.id === id
          ? { ...m, sender: m.sender === "user" ? "bot" : "user" }
          : m,
      ),
    );
  };

  const resetForm = () => {
    setMsgText("");
    setMsgTime("07:49");
    setMsgStatus("seen");
    setMsgType("text");
    setMsgReaction("");
    setMsgFile(null);
  };

  const resetGroup = () => {
    setSettings({
      ...settings,
      receiverName: "Group Name",
      groupMembers: "Member1, Member2",
      isGroup: true,
    });
  };

  const clearAll = () => {
    setMessages([]);
    localStorage.removeItem("wa_fake_gen_v2");
  };

  const handleImport = (data: {
    settings: ChatSettings;
    messages: Message[];
  }) => {
    const importedSettings = {
      ...DEFAULT_SETTINGS,
      ...data.settings,
      groupParticipants:
        data.settings.groupParticipants || DEFAULT_SETTINGS.groupParticipants,
    };
    setSettings(importedSettings);
    setMessages(data.messages);
  };

  return (
    <div className="h-screen bg-[#f8f9fa] flex flex-col md:flex-row p-4 md:p-8 gap-8 overflow-x-hidden">
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
        msgBotSenderId={msgBotSenderId}
        setMsgBotSenderId={setMsgBotSenderId}
        addMessage={addMessage}
        resetForm={resetForm}
        resetGroup={resetGroup}
        editingMessageId={editingMessageId}
        cancelEdit={cancelEdit}
      />

      <PhonePreview
        settings={settings}
        messages={messages}
        clearAll={clearAll}
        onImport={handleImport}
        onEditRequest={handleEditRequest}
        onDeleteMessage={deleteMessage}
        onMoveMessage={moveMessage}
        onToggleSender={toggleMessageSender}
      />
    </div>
  );
}
