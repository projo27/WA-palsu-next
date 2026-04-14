import { MapPin, Signal, VolumeX, Wifi, Zap } from "lucide-react";
import React from "react";
import { cn } from "../../lib/utils";
import { ChatSettings } from "../../types";

interface StatusBarProps {
  settings: ChatSettings;
}

export const StatusBar: React.FC<StatusBarProps> = ({ settings }) => {
  if (settings.hideHeader) return null;

  return (
    <div
      className={cn(
        "px-4 py-2 grid grid-cols-3 items-center font-bold z-30",
        settings.isDarkMode ? "bg-bubble-receiver-dark" : "bg-bubble-receiver",
      )}
      style={{ fontSize: `${(settings.uiTextSize || 13) - 1}px` }}
    >
      <div className="justify-self-start">
        <span>{settings.clockTime}</span>
      </div>

      <div className="justify-self-center">
        {settings.showDynamicIsland && (
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full flex items-center justify-center shadow-sm">
            {/* Subtle glow or detail if needed, but a clean black pill is the standard look */}
            <div className="w-1 h-1 bg-gray-800 rounded-full ml-auto mr-3 opacity-50" />
          </div>
        )}
      </div>

      <div className="justify-self-end flex items-center gap-1">
        {settings.headerIcon === "location" && <MapPin size={10} />}
        {settings.headerIcon === "silent" && <VolumeX size={10} />}
        <Signal size={10} />
        <span className="uppercase">{settings.networkType}</span>
        <Wifi size={10} />
        <div className="flex items-center gap-0.5">
          {settings.showBatteryPercentage && (
            <span>{settings.batteryLevel}%</span>
          )}
          <div className="w-5 h-2.5 border border-current rounded-sm relative p-0.5">
            <div
              className={cn(
                "h-full rounded-sm",
                settings.batteryLevel < 20 ? "bg-red-500" : "bg-green-500",
              )}
              style={{ width: `${settings.batteryLevel}%` }}
            />
            {settings.isCharging && (
              <Zap size={6} className="absolute inset-0 m-auto" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
