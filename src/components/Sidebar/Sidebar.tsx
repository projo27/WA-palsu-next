import { Layout, User, Users } from "lucide-react";
import React from "react";
import { cn } from "../../lib/utils";
import { ChatSettings, MessageStatus, MessageType } from "../../types";
import { AddChat } from "./AddChat";
import { DisplaySettings } from "./DisplaySettings";

interface SidebarProps {
  activeTab: "display" | "chat" | "group";
  setActiveTab: (tab: "display" | "chat" | "group") => void;
  settings: ChatSettings;
  setSettings: (settings: ChatSettings) => void;
  msgText: string;
  setMsgText: (text: string) => void;
  msgSender: "user" | "bot";
  setMsgSender: (sender: "user" | "bot") => void;
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
  msgThumbnail: string | null;
  setMsgThumbnail: (thumb: string | null) => void;
  msgBotSenderId: string;
  setMsgBotSenderId: (id: string) => void;
  addMessage: () => void;
  resetForm: () => void;
  resetGroup: () => void;
  editingMessageId?: string | null;
  cancelEdit?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  className,
  activeTab,
  setActiveTab,
  settings,
  setSettings,
  ...addChatProps
}) => {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs Navigation */}
        <div className="flex bg-primary text-white">
          <button
            onClick={() => {
              setActiveTab("display");
              setSettings({ ...settings });
            }}
            className={cn(
              "flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors",
              activeTab === "display"
                ? "bg-white text-primary"
                : "hover:bg-white/10",
            )}
          >
            <Layout size={18} /> Display Settings
          </button>
          <button
            onClick={() => {
              setActiveTab("chat");
              setSettings({ ...settings, isGroup: false });
            }}
            className={cn(
              "flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors border-x border-white/20",
              activeTab === "chat"
                ? "bg-white text-primary"
                : "hover:bg-white/10",
            )}
          >
            <User size={18} /> Single Chat
          </button>
          <button
            onClick={() => {
              setActiveTab("group");
              setSettings({ ...settings, isGroup: true });
            }}
            className={cn(
              "flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors",
              activeTab === "group"
                ? "bg-white text-primary"
                : "hover:bg-white/10",
            )}
          >
            <Users size={18} /> Group Chat
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {activeTab === "display" ? (
            <DisplaySettings settings={settings} setSettings={setSettings} />
          ) : (
            <AddChat
              activeTab={activeTab}
              settings={settings}
              setSettings={setSettings}
              {...addChatProps}
            />
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 italic">
        👉 Facing any issues with current options or have new feature
        suggestions? Send us your feedback!
      </p>
    </div>
  );
};
