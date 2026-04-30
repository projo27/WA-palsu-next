/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { AIPanel } from "./components/AI/Panel";
import { PhonePreview } from "./components/Preview/PhonePreview";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { DEFAULT_SETTINGS } from "./constants";
import { cn } from "./lib/utils";
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
  const [msgThumbnail, setMsgThumbnail] = useState<string | null>(null);
  const [msgBotSenderId, setMsgBotSenderId] = useState<string>("1");
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [replyToId, setReplyToId] = useState<string | null>(null);

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

  // Sync message sender data when participants are edited
  useEffect(() => {
    if (settings.isGroup && settings.groupParticipants?.length) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          // 1. If message has senderId, keep name/color in sync with latest participant data
          if (msg.senderId) {
            const p = settings.groupParticipants?.find(
              (p) => p.id === msg.senderId,
            );
            if (
              p &&
              (p.name !== msg.senderName || p.color !== msg.senderColor)
            ) {
              return { ...msg, senderName: p.name, senderColor: p.color };
            }
          }
          // 2. If message LACKS senderId (old JSON), try to link it via name match
          else if (msg.sender === "bot" && msg.senderName) {
            const p = settings.groupParticipants?.find(
              (p) => p.name === msg.senderName,
            );
            if (p) {
              return { ...msg, senderId: p.id, senderColor: p.color };
            }
          }
          return msg;
        }),
      );
    }
  }, [settings.groupParticipants]);

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
                thumbnailUrl: msgThumbnail || undefined,
                senderName: currentSenderName,
                senderColor: currentSenderColor,
                senderId: msgSender === "bot" ? msgBotSenderId : undefined,
                replyToId: replyToId || undefined,
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
        thumbnailUrl: msgThumbnail || undefined,
        senderName: currentSenderName,
        senderColor: currentSenderColor,
        senderId: msgSender === "bot" ? msgBotSenderId : undefined,
        replyToId: replyToId || undefined,
      };
      setMessages([...messages, newMessage]);
    }
    setMsgText("");
    setMsgReaction("");
    setMsgFile(null);
    setMsgThumbnail(null);
    setMsgType("text");
    setReplyToId(null);
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    resetForm();
    setReplyToId(null);
  };

  const handleEditRequest = (msg: Message) => {
    setEditingMessageId(msg.id);
    setMsgText(msg.text || "");
    setMsgType(msg.type);
    setMsgTime(msg.timestamp);
    setMsgStatus(msg.status);
    setMsgReaction(msg.reaction || "");
    setMsgFile(msg.fileUrl || null);
    setMsgThumbnail(msg.thumbnailUrl || null);
    setReplyToId(msg.replyToId || null);

    // Determine sender type
    const isBot = msg.sender === "bot" || msg.sender === "system";
    setMsgSender(isBot ? "bot" : "user");

    // If it's a group participant, try to select them in the sidebar
    if (isBot) {
      if (msg.senderId) {
        setMsgBotSenderId(msg.senderId);
      } else if (msg.senderName) {
        const participant = settings.groupParticipants?.find(
          (p) => p.name === msg.senderName,
        );
        if (participant) setMsgBotSenderId(participant.id);
      }
    }

    // Switch to appropriate tab
    if (settings.isGroup) {
      setActiveTab("group");
    } else {
      setActiveTab("chat");
    }
  };
  
  const handleReplyRequest = (msg: Message) => {
    setReplyToId(msg.id);
    // Switch to appropriate tab
    if (settings.isGroup) {
      setActiveTab("group");
    } else {
      setActiveTab("chat");
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
    setReplyToId(null);
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

  const toggleAIPanel = () => {
    setShowAIPanel(!showAIPanel);
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
        msgThumbnail={msgThumbnail}
        setMsgThumbnail={setMsgThumbnail}
        msgBotSenderId={msgBotSenderId}
        setMsgBotSenderId={setMsgBotSenderId}
        addMessage={addMessage}
        resetForm={resetForm}
        resetGroup={resetGroup}
        editingMessageId={editingMessageId}
        cancelEdit={cancelEdit}
        replyToId={replyToId}
        setReplyToId={setReplyToId}
        messages={messages}
        className="w-full md:w-1/2 xl:w-1/3"
      />

      <AIPanel
        onImport={handleImport}
        activeTab={activeTab}
        className={cn(
          "w-full md:w-1/3 xl:w-1/4 h-auto mb-auto transition-all duration-300 ease-in-out transform",
          showAIPanel
            ? "block opacity-100 scale-100"
            : "hidden opacity-0 scale-95",
        )}
      />

      <PhonePreview
        settings={settings}
        messages={messages}
        clearAll={clearAll}
        onImport={handleImport}
        onEditRequest={handleEditRequest}
        onReplyRequest={handleReplyRequest}
        onDeleteMessage={deleteMessage}
        onMoveMessage={moveMessage}
        onToggleSender={toggleMessageSender}
        onToggleAIPanel={toggleAIPanel}
        className="flex-1 flex items-center"
      />
    </div>
  );
}
