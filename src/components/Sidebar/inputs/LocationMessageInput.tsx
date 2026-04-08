import { MapPin, Upload, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import { MessageInputProps } from "./types";

interface LocationMessageInputProps extends MessageInputProps {}

export const LocationMessageInput: React.FC<LocationMessageInputProps> = ({
  msgText,
  setMsgText,
  msgFile,
  setMsgFile,
  fileInputRef,
  handleMsgFileUpload,
}) => {
  const [locType, setLocType] = useState<
    "current" | "share_live" | "stop_live"
  >("current");
  const [notes, setNotes] = useState("");
  const [liveTime, setLiveTime] = useState("");
  const [pinName, setPinName] = useState("");
  const [pinAvatar, setPinAvatar] = useState("");

  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      if (msgText && msgText.startsWith("{")) {
        const parsed = JSON.parse(msgText);
        setLocType(parsed.locType || "current");
        setNotes(parsed.notes || "");
        setLiveTime(parsed.liveTime || "");
        setPinName(parsed.pinName || "");
        setPinAvatar(parsed.pinAvatar || "");
      }
    } catch {
      // ignore
    }
  }, [msgText]);

  const updateMsgText = (
    t: string,
    n: string,
    l: string,
    pn: string,
    pa: string,
  ) => {
    setMsgText(
      JSON.stringify({
        locType: t,
        notes: n,
        liveTime: l,
        pinName: pn,
        pinAvatar: pa,
      }),
    );
  };

  const handleLocType = (t: "current" | "share_live" | "stop_live") => {
    setLocType(t);
    updateMsgText(t, notes, liveTime, pinName, pinAvatar);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setPinAvatar(result);
        updateMsgText(locType, notes, liveTime, pinName, result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex border border-gray-200 rounded-md overflow-hidden bg-white">
        <button
          onClick={() => handleLocType("current")}
          className={cn(
            "flex-1 py-2 text-[11px] font-semibold transition-colors",
            locType === "current"
              ? "bg-primary text-white"
              : "text-gray-500 hover:bg-gray-50 border-r border-gray-200",
          )}
        >
          Current Location
        </button>
        <button
          onClick={() => handleLocType("share_live")}
          className={cn(
            "flex-1 py-2 text-[11px] font-semibold transition-colors",
            locType === "share_live"
              ? "bg-primary text-white"
              : "text-gray-500 hover:bg-gray-50 border-r border-gray-200",
          )}
        >
          Share Live Location
        </button>
        <button
          onClick={() => handleLocType("stop_live")}
          className={cn(
            "flex-1 py-2 text-[11px] font-semibold transition-colors",
            locType === "stop_live"
              ? "bg-primary text-white"
              : "text-gray-500 hover:bg-gray-50",
          )}
        >
          Stop Live Location
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500">
          Add image for map
        </label>
        <div
          onClick={() => fileInputRef?.current?.click()}
          className="border border-dashed border-gray-300 rounded-lg p-3 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors bg-white relative"
        >
          {msgFile ? (
            <div className="flex flex-col items-center gap-2 w-full">
              <img
                src={msgFile}
                alt="Map preview"
                className="w-full h-24 object-cover rounded"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMsgFile("");
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <>
              <MapPin size={16} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-600">
                Add map image
              </span>
            </>
          )}
          {handleMsgFileUpload && (
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleMsgFileUpload}
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <textarea
          placeholder="Enter notes..."
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            updateMsgText(
              locType,
              e.target.value,
              liveTime,
              pinName,
              pinAvatar,
            );
          }}
          className="w-full p-2 rounded-md border border-gray-200 text-sm min-h-[60px] focus:outline-none focus:border-primary"
        />
      </div>

      {(locType === "share_live" || locType === "stop_live") && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500">
            Live location time
          </label>
          <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white">
            <input
              type="time"
              value={liveTime}
              onChange={(e) => {
                setLiveTime(e.target.value);
                updateMsgText(
                  locType,
                  notes,
                  e.target.value,
                  pinName,
                  pinAvatar,
                );
              }}
              className="flex-1 p-2 text-sm outline-none"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500">
          Add sender profile
        </label>
        <div className="flex items-center gap-3">
          <div
            className="relative group cursor-pointer shrink-0"
            onClick={() => avatarInputRef.current?.click()}
          >
            {pinAvatar ? (
              <img
                src={pinAvatar}
                alt="Sender Avatar"
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload size={14} className="text-white" />
            </div>
            <input
              type="file"
              ref={avatarInputRef}
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
          <input
            type="text"
            placeholder="Enter your name"
            value={pinName}
            onChange={(e) => {
              setPinName(e.target.value);
              updateMsgText(
                locType,
                notes,
                liveTime,
                e.target.value,
                pinAvatar,
              );
            }}
            className="flex-1 p-2 rounded border border-gray-200 text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
};
