import React, { useEffect, useState } from "react";
import { cn } from "../../../lib/utils";
import { MessageInputProps } from "./types";

export const CallMessageInput: React.FC<MessageInputProps> = ({
  msgText,
  setMsgText,
  msgTime,
  setMsgTime,
  msgReaction,
  setMsgReaction,
}) => {
  const [callMode, setCallMode] = useState<"video" | "voice">("video");
  const [callType, setCallType] = useState("Call");
  const [hh, setHh] = useState("");
  const [mm, setMm] = useState("");
  const [ss, setSs] = useState("");

  useEffect(() => {
    try {
      if (msgText && msgText.startsWith("{")) {
        const parsed = JSON.parse(msgText);
        if (parsed.callMode) setCallMode(parsed.callMode);
        if (parsed.callType) setCallType(parsed.callType);
        if (parsed.hh !== undefined) setHh(parsed.hh);
        if (parsed.mm !== undefined) setMm(parsed.mm);
        if (parsed.ss !== undefined) setSs(parsed.ss);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    setMsgText(JSON.stringify({ callMode, callType, hh, mm, ss }));
  }, [callMode, callType, hh, mm, ss, setMsgText]);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100 gap-1 w-fit">
        <button
          onClick={() => setCallMode("video")}
          className={cn(
            "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
            callMode === "video"
              ? "bg-primary text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700",
          )}
        >
          Video Call
        </button>
        <button
          onClick={() => setCallMode("voice")}
          className={cn(
            "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
            callMode === "voice"
              ? "bg-primary text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700",
          )}
        >
          Voice Call
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase">
            Call Type
          </label>
          <select
            value={callType}
            onChange={(e) => setCallType(e.target.value)}
            className="w-full p-2 rounded-md border border-gray-200 text-sm focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="Call">Call</option>
            <option value="Missed Call">Missed Call</option>
            <option value="No Answer">No Answer</option>
            <option value="Declined">Declined</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase">
            Communication Time
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={2}
              value={hh}
              onChange={(e) => setHh(e.target.value)}
              className="w-1/3 p-2 rounded-md border border-gray-200 text-sm text-center focus:ring-1 focus:ring-primary outline-none"
              placeholder="HH"
            />
            <input
              type="text"
              maxLength={2}
              value={mm}
              onChange={(e) => setMm(e.target.value)}
              className="w-1/3 p-2 rounded-md border border-gray-200 text-sm text-center focus:ring-1 focus:ring-primary outline-none"
              placeholder="MM"
            />
            <input
              type="text"
              maxLength={2}
              value={ss}
              onChange={(e) => setSs(e.target.value)}
              className="w-1/3 p-2 rounded-md border border-gray-200 text-sm text-center focus:ring-1 focus:ring-primary outline-none"
              placeholder="SS"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
