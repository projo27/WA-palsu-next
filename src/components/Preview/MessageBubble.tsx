import { Check, CheckCheck } from "lucide-react";
import React from "react";
import { cn, getContrastColor } from "../../lib/utils";
import { ChatSettings, Message } from "../../types";

interface MessageBubbleProps {
  msg: Message;
  settings: ChatSettings;
  isFirstInGroup?: boolean;
  onImageClick?: (url: string) => void;
  replyMsg?: Message;
}

interface MessageBubbleCardProps extends MessageBubbleProps {
  children: React.ReactNode;
}

export const MessageBubbleCard: React.FC<MessageBubbleCardProps> = ({
  msg,
  settings,
  isFirstInGroup = true,
  children,
}) => {
  const userColor =
    settings.userBubbleColor ||
    (settings.isDarkMode
      ? "var(--color-bubble-user-dark)"
      : "var(--color-bubble-user)");
  const receiverColor =
    settings.receiverBubbleColor ||
    (settings.isDarkMode
      ? "var(--color-bubble-receiver-dark)"
      : "var(--color-bubble-receiver)");
  const backgroundColor = msg.sender === "user" ? userColor : receiverColor;
  const textColor = getContrastColor(backgroundColor);
  const isTailVisible = settings.showChatArrow && isFirstInGroup;

  const listClipPath = {
    user: "polygon(0 0, 0 100%, 100% 0)",
    bot: "polygon(100% 0, 100% 100%, 0 0)",
  };

  return (
    <div
      className={cn(
        "max-w-[85%] rounded-lg px-2 py-1 relative shadow-sm mb-0.5",
        msg.sender === "user" ? "self-end" : "self-start",
        isTailVisible && msg.sender === "user" && "rounded-tr-none",
        isTailVisible && msg.sender !== "user" && "rounded-tl-none",
        isFirstInGroup && "mt-2",
        msg.reaction && "mb-3.5",
      )}
      style={{
        backgroundColor,
        color: textColor,
        fontSize: `${settings.textSize || 13}px`,
      }}
    >
      {/* Bubble Tail (Sudut Lancip) - Only show if it's the first message in the group */}
      {settings.showChatArrow && isFirstInGroup && (
        <div
          className={cn(
            "absolute top-0 w-2 h-2.5",
            msg.sender === "user" ? "-right-[5px]" : "-left-[5px]",
          )}
          style={{
            clipPath: listClipPath[msg.sender],
            backgroundColor,
          }}
        />
      )}

      {children}
    </div>
  );
};

export const FileUrlBubbleCard: React.FC<MessageBubbleProps> = ({
  msg,
  onImageClick,
}) => {
  return (
    <div className="mb-1 relative">
      <img
        src={msg.fileUrl}
        alt="Sent"
        className={cn(
          "rounded-md max-w-full max-h-64 object-contain",
          onImageClick &&
            "cursor-none active:scale-[0.98] transition-transform",
        )}
        onClick={() => onImageClick?.(msg.fileUrl!)}
      />
      <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-gray-500/40 to-transparent h-4 rounded-b-md"></div>
      <span className="absolute bottom-1 right-1 flex items-center justify-end gap-1">
        <span className="text-[9px] opacity-60">{msg.timestamp}</span>
        <MessageStatusIcon msg={msg} />
      </span>
    </div>
  );
};

export const VideoBubbleCard: React.FC<MessageBubbleProps> = ({
  msg,
  onImageClick,
}) => {
  return (
    <div className="mb-1 relative cursor-pointer" onClick={() => onImageClick?.(msg.fileUrl!)}>
      <img
        src={msg.thumbnailUrl || "https://placehold.co/400x225?text=Video+Thumbnail"}
        alt="Video Thumbnail"
        className="rounded-md max-w-full max-h-64 object-cover aspect-video bg-black/10"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black/40 text-white p-3 rounded-full backdrop-blur-sm border border-white/20 shadow-lg group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/60 to-transparent h-10 rounded-b-md"></div>
      <span className="absolute bottom-1 right-1 flex items-center justify-end gap-1">
        <span className="text-[10px] text-white font-medium drop-shadow-md">
          {msg.timestamp}
        </span>
        <MessageStatusIcon msg={msg} />
      </span>
    </div>
  );
};

export const FileBubbleCard: React.FC<MessageBubbleProps> = ({ msg }) => {
  let docName = "document",
    docExt = "JPG",
    docSize = "12",
    docSizeType = "Bytes";
  try {
    if (msg.text && msg.text.startsWith("{")) {
      const parsed = JSON.parse(msg.text);
      docName = parsed.docName || docName;
      docExt = parsed.docExt || docExt;
      docSize = parsed.docSize || docSize;
      docSizeType = parsed.docSizeType || docSizeType;
    }
  } catch (e) {}

  let sizeUnit = docSizeType;
  if (docSizeType === "Bytes") sizeUnit = "B";

  return (
    <div className="flex items-center gap-3 bg-black/5 p-2 rounded-lg my-1 hover:bg-black/10 transition-colors min-w-[200px]">
      <div className="w-9 h-11 bg-black/10 rounded-sm relative flex items-center justify-center shrink-0">
        <div className="absolute inset-x-0 bottom-1 flex justify-center">
          <span className="text-[8px] font-bold opacity-70 bg-white/50 px-1 rounded-sm">
            {docExt.substring(0, 3)}
          </span>
        </div>
      </div>
      <div className="flex flex-col overflow-hidden w-full">
        <span className="font-semibold text-sm truncate">
          {docName}.{docExt.toLowerCase()}
        </span>
        <span className="text-[10px] opacity-60">
          {docSize} {sizeUnit} • {docExt.toLowerCase()}
        </span>
        <span className="text-[10px] opacity-60 self-end">{msg.timestamp}</span>
      </div>
    </div>
  );
};

export const CallBubbleCard: React.FC<MessageBubbleProps> = ({ msg }) => {
  let callMode = "video",
    callType = "Call",
    hh = "",
    mm = "",
    ss = "";
  try {
    if (msg.text && msg.text.startsWith("{")) {
      const parsed = JSON.parse(msg.text);
      callMode = parsed.callMode || callMode;
      callType = parsed.callType || callType;
      hh = parsed.hh || hh;
      mm = parsed.mm || mm;
      ss = parsed.ss || ss;
    }
  } catch (e) {}

  let durationText = "";
  if (["Missed Call", "No Answer", "Declined"].includes(callType)) {
    durationText = callType === "No Answer" ? "No answer" : callType;
  } else {
    let t = [];
    if (hh) t.push(`${hh} hr`);
    if (mm) t.push(`${mm} min`);
    if (ss) t.push(`${ss} sec`);
    if (t.length === 0) durationText = "0 sec";
    else durationText = t.join(" ");
  }

  return (
    <div className="flex items-center gap-3 bg-black/5 p-2 rounded-lg my-0.5 hover:bg-black/10 transition-colors">
      <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center shrink-0">
        {callMode === "video" ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-white"
          >
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-white"
          >
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.03 21c.75 0 .99-.65.99-1.19v-3.44c0-.54-.45-.99-.99-.99z" />
          </svg>
        )}
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-[15px]">
          {callMode === "video" ? "Video call" : "Voice call"}
        </span>
        <span className="text-xs opacity-60">{durationText}</span>
      </div>
      <span className="text-[10px] opacity-60 self-end">{msg.timestamp}</span>
    </div>
  );
};

export const ContactBubbleCard: React.FC<MessageBubbleProps> = ({ msg }) => {
  let isMultiple = false,
    contactName = "",
    contactCount = "1";
  try {
    if (msg.text && msg.text.startsWith("{")) {
      const parsed = JSON.parse(msg.text);
      isMultiple = parsed.isMultiple;
      contactName = parsed.contactName;
      contactCount = parsed.contactCount || "1";
    } else {
      contactName = msg.text || "";
    }
  } catch (e) {
    contactName = msg.text || "";
  }

  return (
    <div className="flex flex-col min-w-[200px] -mx-2 -mt-1 -mb-1 pt-1 pb-1">
      <div className="flex items-center gap-3 pl-3 pr-1.5 py-2">
        {msg.fileUrl ? (
          <img
            src={msg.fileUrl}
            alt="Contact"
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center shrink-0">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-white opacity-80"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
        <span className="font-semibold text-[15px]">
          {contactName}
          {isMultiple
            ? ` and ${contactCount} other contact${parseInt(contactCount) > 1 ? "s" : ""}`
            : ""}
        </span>
        <span className="text-[10px] self-end ml-auto flex items-center justify-end gap-1">
          <span className="opacity-60">{msg.timestamp}</span>{" "}
          <MessageStatusIcon msg={msg} />
        </span>
      </div>
      <div className="h-px bg-black/10 w-full" />
      <div className="pt-2 text-center text-brand-blue font-medium text-sm">
        {isMultiple ? "View all" : "Message"}
      </div>
    </div>
  );
};

export const LocationBubbleCard: React.FC<MessageBubbleProps> = ({ msg }) => {
  let locType = "current",
    notes = "",
    liveTime = "",
    pinName = "",
    pinAvatar = "";

  try {
    if (msg.text && msg.text.startsWith("{")) {
      const parsed = JSON.parse(msg.text);
      locType = parsed.locType || "current";
      notes = parsed.notes || "";
      liveTime = parsed.liveTime || "";
      pinName = parsed.pinName || "";
      pinAvatar = parsed.pinAvatar || "";
    }
  } catch (e) {}

  return (
    <div className="flex flex-col min-w-[200px] -mx-2 -mt-1 -mb-1 pt-0 pb-0">
      <div className="relative m-0.5">
        {msg.fileUrl ? (
          <img
            src={msg.fileUrl}
            alt="Map"
            className={cn(
              "w-full h-32 object-cover rounded-lg",
              locType === "stop_live" ? "grayscale opacity-80" : "",
            )}
          />
        ) : (
          <div
            className={cn(
              "w-full h-32 bg-chat-light rounded-lg flex items-center justify-center relative overflow-hidden",
              locType === "stop_live" ? "grayscale opacity-80" : "",
            )}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #000 1px, transparent 1px)",
                backgroundSize: "10px 10px",
              }}
            ></div>
          </div>
        )}

        {/* Pin Avatar / Info */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {pinAvatar ? (
            <img
              src={pinAvatar}
              alt="Pin"
              className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-300 rounded-full border-2 border-white shadow-md flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
        </div>

        {locType === "share_live" && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-2 py-1 flex items-center gap-1.5 object-bottom">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-white"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span className="text-white text-[10px] font-medium">
              Live until {liveTime || "8:33 AM"}
            </span>
          </div>
        )}
      </div>

      {locType === "stop_live" && (
        <div className="bg-black/5 px-2 py-1.5 text-center shadow-sm">
          <span className="text-gray-500 text-[11px] font-medium">
            Live location ended
          </span>
        </div>
      )}

      <div className="flex items-center justify-between">
        {(notes || pinName) && (
          <div className="px-2 pt-2">
            {notes && (
              <div className="text-sm pb-1 whitespace-pre-wrap">{notes}</div>
            )}
          </div>
        )}
        <span className="text-[10px] opacity-60 self-end px-2 pb-1">
          {msg.timestamp}
        </span>
      </div>

      {locType === "share_live" && (
        <>
          <div className="h-px bg-black/10 w-full mt-1" />
          <div className="py-2 text-center text-red-500 font-medium text-[13px]">
            Stop sharing
          </div>
        </>
      )}
    </div>
  );
};

export const DateBubbleCard: React.FC<MessageBubbleProps> = ({ msg }) => {
  return (
    <div className="self-center my-2 px-3 py-1 rounded-lg bg-black/10 text-[10px] uppercase font-medium">
      {msg.text}
    </div>
  );
};

export const MessageStatusIcon: React.FC<MessageBubbleProps> = ({ msg }) => {
  if (msg.sender !== "user") return null;
  if (msg.status === "none") return null;
  if (!["text", "image", "contact", "video"].includes(msg.type)) return null;

  if (msg.status === "seen") {
    return (
      <span className="text-blue-400">
        <CheckCheck size={12} />
      </span>
    );
  }
  if (msg.status === "delivered") {
    return (
      <span className="text-gray-400">
        <CheckCheck size={12} />
      </span>
    );
  }
  if (msg.status === "sent") {
    return (
      <span className="text-gray-400">
        <Check size={12} />
      </span>
    );
  }
  return null;
};

export const ReplyQuote: React.FC<{
  replyMsg?: Message;
  settings: ChatSettings;
}> = ({ replyMsg, settings }) => {
  if (!replyMsg) return null;
  const mapMsg = typeof replyMsg.text === 'string' ? JSON.parse(replyMsg.text) : replyMsg.text;

  const truncateText = (text?: string) => {
    if (!text) return "";
    return text.length > 80 ? text.substring(0, 80) + "..." : text;
  };

  const nameColor = replyMsg.sender === "user" ? "#00a884" : (replyMsg.senderColor || "#53bdeb");

  return (
    <div className="mb-1 flex rounded-md overflow-hidden bg-black/5 border-l-4"
    style={{ borderLeftColor: nameColor }}
    >
      <div className="flex-1 p-1.5 flex flex-col min-w-0">
        <span className="text-[11px] font-bold truncate" style={{ color: nameColor }}>
          {replyMsg.sender === "user" ? "You" : (replyMsg.senderName || settings.receiverName)}
        </span>
        <div className="text-[11px] opacity-70 truncate leading-tight">
          {replyMsg.type === "text" ? truncateText(replyMsg.text) : 
           replyMsg.type === "image" ? "📷 Photo" : 
           replyMsg.type === "video" ? "🎥 Video" : 
           replyMsg.type === "file" ? `📄 ${mapMsg.docName}.${mapMsg.docExt}` : 
           replyMsg.type === "location" ? "📍 Location" : 
           "Media"}
        </div>
      </div>
      {(replyMsg.thumbnailUrl || (replyMsg.type === "image" && replyMsg.fileUrl)) && (
        <img 
          src={replyMsg.thumbnailUrl || replyMsg.fileUrl} 
          className="w-12 h-12 object-cover shrink-0 ml-1 opacity-80" 
          alt="Quote" 
        />
      )}
    </div>
  );
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  msg,
  settings,
  isFirstInGroup = true,
  onImageClick,
  replyMsg,
}) => {
  if (msg.type === "date") {
    return <DateBubbleCard msg={msg} />;
  }

  return (
    <MessageBubbleCard
      msg={msg}
      settings={settings}
      isFirstInGroup={isFirstInGroup}
    >
      {settings.isGroup && msg.sender !== "user" && (
        <div
          className="text-[13px] font-bold leading-tight mb-1"
          style={{
            color:
              settings.groupParticipants?.find((p) => p.id === msg.senderId)
                ?.color ||
              msg.senderColor ||
              "#00a884",
          }}
        >
          {settings.groupParticipants?.find((p) => p.id === msg.senderId)
            ?.name || msg.senderName}
        </div>
      )}

      {msg.type === "image" && msg.fileUrl && (
        <FileUrlBubbleCard msg={msg} onImageClick={onImageClick} />
      )}

      {msg.type === "video" && (
        <VideoBubbleCard msg={msg} onImageClick={onImageClick} />
      )}

      {msg.type === "file" && <FileBubbleCard msg={msg} />}
      {msg.type === "call" && <CallBubbleCard msg={msg} />}
      {msg.type === "contact" && <ContactBubbleCard msg={msg} />}
      {msg.type === "location" && <LocationBubbleCard msg={msg} />}
      
      {/* For non-text messages with replies, show the quote above the media */}
      {msg.type !== "text" && replyMsg && (
        <ReplyQuote replyMsg={replyMsg} settings={settings} />
      )}

      {msg.type === "text" && msg.text && (
        <div className="relative flex flex-col gap-0.5">
          {replyMsg && <ReplyQuote replyMsg={replyMsg} settings={settings} />}
          <div className="flex flex-wrap gap-x-2 gap-y-0.5">
            <p className="whitespace-pre-line flex-1 min-w-[60px]">
              {msg.text}
            </p>
            <span className="flex items-center justify-end gap-0.5 w-auto ml-auto self-end">
              <span className="text-[9px] opacity-60">{msg.timestamp}</span>
              <MessageStatusIcon msg={msg} />
            </span>
          </div>
        </div>
      )}

      {msg.reaction && (
        <div
          className={cn(
            "absolute -bottom-3.5 right-1 px-1 rounded-full text-[14px] shadow-sm border",
            settings.isDarkMode
              ? "bg-bubble-receiver-dark border-gray-700"
              : "bg-white border-gray-100",
          )}
        >
          {msg.reaction}
        </div>
      )}
    </MessageBubbleCard>
  );
};
