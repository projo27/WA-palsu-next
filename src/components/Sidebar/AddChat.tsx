import {
  ArrowLeft,
  Calendar,
  Contact,
  File as FileIcon,
  MapPin,
  MessageSquare,
  PhoneCall,
  Plus,
  RotateCcw,
  Upload,
  X,
} from "lucide-react";
import React, { useRef } from "react";
import { cn } from "../../lib/utils";
import { ChatSettings, MessageStatus, MessageType } from "../../types";
import { CallMessageInput } from "./inputs/CallMessageInput";
import { ContactMessageInput } from "./inputs/ContactMessageInput";
import { DateMessageInput } from "./inputs/DateMessageInput";
import { DocsMessageInput } from "./inputs/DocsMessageInput";
import { LocationMessageInput } from "./inputs/LocationMessageInput";
import { SharedMessageOptions } from "./inputs/SharedMessageOptions";
import { TextMessageInput } from "./inputs/TextMessageInput";

interface AddChatProps {
  activeTab: "chat" | "group";
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
  msgBotSenderId?: string;
  setMsgBotSenderId?: (id: string) => void;
  addMessage: () => void;
  resetForm: () => void;
  resetGroup?: () => void;
  editingMessageId?: string | null;
  cancelEdit?: () => void;
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
  msgBotSenderId,
  setMsgBotSenderId,
  addMessage,
  resetForm,
  resetGroup,
  editingMessageId,
  cancelEdit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [newParticipantName, setNewParticipantName] = React.useState("");
  const [newParticipantColor, setNewParticipantColor] =
    React.useState("#ffb300");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey) {
      if (e.key === "Enter") {
        e.preventDefault();
        addMessage();
      } else if (e.key >= "1" && e.key <= "9") {
        const index = parseInt(e.key) - 1;
        if (activeTab === "chat") {
          if (index === 0) {
            e.preventDefault();
            setMsgSender("user");
          } else if (index === 1) {
            e.preventDefault();
            setMsgSender("bot");
          }
        } else if (activeTab === "group") {
          if (index === 0) {
            e.preventDefault();
            setMsgSender("user");
          } else {
            const participant = settings.groupParticipants?.[index - 1];
            if (participant) {
              e.preventDefault();
              setMsgSender("bot");
              if (setMsgBotSenderId) setMsgBotSenderId(participant.id);
            }
          }
        }
      }
    }
  };

  const handleMsgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setMsgFile(ev.target?.result as string);
        if (
          msgType !== "file" &&
          msgType !== "contact" &&
          msgType !== "location"
        ) {
          setMsgType("image");
        }
      };
      reader.readAsDataURL(file);
    } else {
      setMsgType("text");
    }
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSettings({
          ...settings,
          receiverAvatar: ev.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddParticipant = () => {
    if (!newParticipantName.trim()) return;
    const newParticipant = {
      id: Date.now().toString(),
      name: newParticipantName.trim(),
      color: newParticipantColor,
    };
    const updatedParticipants = [
      ...(settings.groupParticipants || []),
      newParticipant,
    ];
    setSettings({
      ...settings,
      groupParticipants: updatedParticipants,
    });
    setNewParticipantName("");
    if (setMsgBotSenderId) setMsgBotSenderId(newParticipant.id);
    setMsgSender("bot");
  };

  const removeParticipant = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedParticipants = (settings.groupParticipants || []).filter(
      (p) => p.id !== id,
    );
    setSettings({
      ...settings,
      groupParticipants: updatedParticipants,
    });
    if (msgSender === "bot" && msgBotSenderId === id) {
      if (updatedParticipants.length > 0) {
        if (setMsgBotSenderId) setMsgBotSenderId(updatedParticipants[0].id);
      } else {
        setMsgSender("user");
      }
    }
  };

  const inputProps = {
    msgText,
    setMsgText,
    msgTime,
    setMsgTime,
    msgStatus,
    setMsgStatus,
    msgReaction,
    setMsgReaction,
    msgFile,
    setMsgFile,
    msgType,
    setMsgType,
    fileInputRef,
    handleMsgFileUpload,
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300"
    >
      {/* Profile Section */}
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 space-y-4">
        <div className="flex items-center gap-4">
          <div
            className="relative group cursor-pointer"
            onClick={() => profileInputRef.current?.click()}
          >
            <img
              src={settings.receiverAvatar}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload size={16} className="text-white" />
            </div>
            <input
              type="file"
              ref={profileInputRef}
              className="hidden"
              onChange={handleProfileUpload}
            />
          </div>
          <div className="flex-1 space-y-2">
            <input
              type="text"
              placeholder={
                activeTab === "chat" ? "Receiver's Name" : "Group Name"
              }
              value={settings.receiverName}
              onChange={(e) =>
                setSettings({ ...settings, receiverName: e.target.value })
              }
              className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
            />
            {activeTab === "chat" && (
              <input
                type="text"
                placeholder="Status (Online/Offline)"
                value={settings.receiverStatus}
                onChange={(e) =>
                  setSettings({ ...settings, receiverStatus: e.target.value })
                }
                className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
              />
            )}
          </div>
        </div>
      </div>

      {/* Sender/Receiver Toggle */}
      {activeTab === "group" ? (
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 capitalize">
            Select Message Sender
          </label>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setMsgSender("user")}
              className={cn(
                "w-full text-left p-3 rounded-lg border text-sm font-medium transition-all flex items-center gap-2",
                msgSender === "user"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50",
              )}
            >
              Sender (You)
            </button>
            {settings.groupParticipants?.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setMsgSender("bot");
                  if (setMsgBotSenderId) setMsgBotSenderId(p.id);
                }}
                className={cn(
                  "w-full p-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-between group",
                  msgSender === "bot" && msgBotSenderId === p.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50",
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  {p.name}
                </div>
                <div
                  onClick={(e) => removeParticipant(p.id, e)}
                  className="p-1 rounded bg-red-100 text-red-500 hover:bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <RotateCcw size={12} className="rotate-45" />
                </div>
              </button>
            ))}
            <div className="flex gap-2 items-center p-2 rounded-lg border border-gray-200 bg-gray-50">
              <input
                type="color"
                value={newParticipantColor}
                onChange={(e) => setNewParticipantColor(e.target.value)}
                className="w-8 h-8 p-0 border-0 rounded cursor-pointer shrink-0"
              />
              <input
                type="text"
                placeholder="New user name..."
                value={newParticipantName}
                onChange={(e) => setNewParticipantName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation();
                    handleAddParticipant();
                  }
                }}
                className="flex-1 p-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
              />
              <button
                onClick={handleAddParticipant}
                disabled={!newParticipantName.trim()}
                className="px-3 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-primary-hover disabled:opacity-50 transition-all shrink-0"
              >
                + Add User
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setMsgSender("bot")}
            className={cn(
              "flex-1 py-2 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2",
              msgSender === "bot"
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-500",
            )}
          >
            <ArrowLeft size={14} className="rotate-180" /> Receiver
          </button>
          <button
            onClick={() => setMsgSender("user")}
            className={cn(
              "flex-1 py-2 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2",
              msgSender === "user"
                ? "bg-primary shadow-sm text-white"
                : "text-gray-500",
            )}
          >
            <ArrowLeft size={14} /> Sender (You)
          </button>
        </div>
      )}

      {/* Message Type Tabs */}
      <div className="flex shrink-0 border-b border-gray-200 overflow-x-auto scrollbar">
        {(["text", "date", "file", "call", "contact", "location"] as const).map(
          (t) => (
            <button
              key={t}
              onClick={() => {
                if (msgType !== t) {
                  if (msgText.startsWith("{") || msgType === "date") {
                    setMsgText("");
                  }
                  setMsgType(t);
                }
              }}
              className={cn(
                "px-4 py-2 text-sm font-medium whitespace-nowrap transition-all border-b-2 flex items-center",
                msgType === t
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700",
              )}
            >
              {t === "text" && (
                <MessageSquare size={14} className="inline mr-1" />
              )}
              {t === "date" && <Calendar size={14} className="inline mr-1" />}
              {t === "file" && <FileIcon size={14} className="inline mr-1" />}
              {t === "call" && <PhoneCall size={14} className="inline mr-1" />}
              {t === "contact" && <Contact size={14} className="inline mr-1" />}
              {t === "location" && <MapPin size={14} className="inline mr-1" />}
              {t === "file" ? "Docs" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ),
        )}
      </div>

      {/* Message Input */}
      <div className="space-y-4">
        {msgType === "date" && <DateMessageInput {...inputProps} />}
        {msgType === "file" && <DocsMessageInput {...inputProps} />}
        {msgType === "call" && <CallMessageInput {...inputProps} />}
        {msgType === "contact" && <ContactMessageInput {...inputProps} />}
        {msgType === "location" && <LocationMessageInput {...inputProps} />}
        {["text", "image"].includes(msgType) && (
          <TextMessageInput {...inputProps} />
        )}

        {msgType !== "date" && (
          <SharedMessageOptions
            msgTime={msgTime}
            setMsgTime={setMsgTime}
            msgStatus={msgStatus}
            setMsgStatus={setMsgStatus}
            msgReaction={msgReaction}
            setMsgReaction={setMsgReaction}
          />
        )}

        <div className="flex gap-3 pt-2">
          {editingMessageId ? (
            <>
              <button
                onClick={addMessage}
                className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-bold shadow-md hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Update Message
              </button>
              {cancelEdit && (
                <button
                  onClick={cancelEdit}
                  className="px-6 py-3 border border-gray-200 text-gray-500 rounded-lg font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <X size={18} /> Cancel
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={addMessage}
                className="flex-1 py-3 bg-primary text-white rounded-lg font-bold shadow-md hover:bg-primary-hover active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Add Message
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 border border-red-200 text-red-500 rounded-lg font-bold hover:bg-red-50 transition-all flex items-center gap-2"
              >
                <RotateCcw size={18} /> Reset Form
              </button>
              {activeTab === "group" && resetGroup && (
                <button
                  onClick={resetGroup}
                  className="px-6 py-3 border border-red-200 text-red-500 rounded-lg font-bold hover:bg-red-50 transition-all flex items-center gap-2"
                >
                  <RotateCcw size={18} /> Reset Group
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
