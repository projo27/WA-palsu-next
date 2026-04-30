import {
  ArrowLeft,
  Calendar,
  Contact,
  File as FileIcon,
  MapPin,
  MessageSquare,
  PhoneCall,
  Check,
  Edit2,
  Plus,
  RotateCcw,
  Trash,
  Upload,
  Video,
  X,
} from "lucide-react";
import React, { useRef } from "react";
import { cn } from "../../lib/utils";
import { ChatSettings, Message, MessageStatus, MessageType } from "../../types";
import { CallMessageInput } from "./inputs/CallMessageInput";
import { ContactMessageInput } from "./inputs/ContactMessageInput";
import { DateMessageInput } from "./inputs/DateMessageInput";
import { DocsMessageInput } from "./inputs/DocsMessageInput";
import { LocationMessageInput } from "./inputs/LocationMessageInput";
import { SharedMessageOptions } from "./inputs/SharedMessageOptions";
import { TextMessageInput } from "./inputs/TextMessageInput";
import { VideoMessageInput } from "./inputs/VideoMessageInput";

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
  msgThumbnail: string | null;
  setMsgThumbnail: (thumb: string | null) => void;
  msgBotSenderId?: string;
  setMsgBotSenderId?: (id: string) => void;
  addMessage: () => void;
  resetForm: () => void;
  resetGroup?: () => void;
  editingMessageId?: string | null;
  cancelEdit?: () => void;
  replyToId: string | null;
  setReplyToId: (id: string | null) => void;
  messages: Message[];
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
  msgThumbnail,
  setMsgThumbnail,
  msgBotSenderId,
  setMsgBotSenderId,
  addMessage,
  resetForm,
  resetGroup,
  editingMessageId,
  cancelEdit,
  replyToId,
  setReplyToId,
  messages,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  
  const replyMsg = messages.find(m => m.id === replyToId);
  const [newParticipantName, setNewParticipantName] = React.useState("");
  const [newParticipantColor, setNewParticipantColor] =
    React.useState("#ffb300");
  const [editingParticipantId, setEditingParticipantId] =
    React.useState<string | null>(null);

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

    if (editingParticipantId) {
      const updatedParticipants = (settings.groupParticipants || []).map((p) =>
        p.id === editingParticipantId
          ? {
              ...p,
              name: newParticipantName.trim(),
              color: newParticipantColor,
            }
          : p,
      );
      setSettings({
        ...settings,
        groupParticipants: updatedParticipants,
      });
      setEditingParticipantId(null);
    } else {
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
      if (setMsgBotSenderId) setMsgBotSenderId(newParticipant.id);
      setMsgSender("bot");
    }

    setNewParticipantName("");
    setNewParticipantColor("#ffb300");
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

  const startEditingParticipant = (
    id: string,
    name: string,
    color: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setEditingParticipantId(id);
    setNewParticipantName(name);
    setNewParticipantColor(color);
  };

  const cancelParticipantEdit = () => {
    setEditingParticipantId(null);
    setNewParticipantName("");
    setNewParticipantColor("#ffb300");
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
    msgThumbnail,
    setMsgThumbnail,
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
            <input
              type="text"
              placeholder="Profile Image URL (e.g. https://...)"
              value={
                settings.receiverAvatar.startsWith("data:")
                  ? ""
                  : settings.receiverAvatar
              }
              onChange={(e) =>
                setSettings({ ...settings, receiverAvatar: e.target.value })
              }
              className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
            />
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
              <div className="w-3 h-3 rounded-sm bg-primary" />
              Sender (You)
            </button>
            <div className="grid grid-cols-3 gap-1 w-full">
              {settings.groupParticipants?.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setMsgSender("bot");
                    if (setMsgBotSenderId) setMsgBotSenderId(p.id);
                  }}
                  className={cn(
                    "p-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-between group text-left truncate",
                    msgSender === "bot" && msgBotSenderId === p.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50",
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="truncate">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div
                      onClick={(e) =>
                        startEditingParticipant(p.id, p.name, p.color, e)
                      }
                      className="p-1 rounded bg-blue-100 text-blue-500 hover:bg-blue-200"
                    >
                      <Edit2 size={12} />
                    </div>
                    <div
                      onClick={(e) => removeParticipant(p.id, e)}
                      className="p-1 rounded bg-red-100 text-red-500 hover:bg-red-200"
                    >
                      <Trash size={12} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
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
                  } else if (e.key === "Escape") {
                    cancelParticipantEdit();
                  }
                }}
                className="flex-1 p-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
              />
              <button
                onClick={handleAddParticipant}
                disabled={!newParticipantName.trim()}
                className={cn(
                  "px-3 py-2 text-white rounded text-sm font-medium transition-all shrink-0",
                  editingParticipantId
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-primary hover:bg-primary-hover",
                )}
              >
                {editingParticipantId ? "Update Name" : "+ Add User"}
              </button>
              {editingParticipantId && (
                <button
                  onClick={cancelParticipantEdit}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <X size={18} />
                </button>
              )}
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
        {(
          ["text", "video", "date", "file", "call", "contact", "location"] as const
        ).map((t) => (
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
              {t === "video" && <Video size={14} className="inline mr-1" />}
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

      {/* Reply Preview */}
      {replyMsg && (
        <div className="p-3 bg-gray-50 border-l-4 border-primary rounded-r-lg flex items-center justify-between group animate-in slide-in-from-left-2 duration-200">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-primary block">
              Replying to {replyMsg.sender === "user" ? "You" : (replyMsg.senderName || settings.receiverName)}
            </span>
            <p className="text-xs text-gray-500 truncate">
              {replyMsg.text || (replyMsg.type === "image" ? "Photo" : "Media")}
            </p>
          </div>
          <button
            onClick={() => setReplyToId(null)}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Message Input */}
      <div className="space-y-4">
        {msgType === "video" && (
          <VideoMessageInput {...inputProps} />
        )}
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
