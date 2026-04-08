import { BatteryCharging, MapPin, Signal, VolumeX, Wifi, Zap } from "lucide-react";
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
        "px-4 py-2 flex justify-between items-center text-xs font-bold z-30",
        settings.isDarkMode ? "bg-[#202c33]" : "bg-[#f5f5f5]",
      )}
    >
      <span>{settings.clockTime}</span>
      <div className="flex items-center gap-1">
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
