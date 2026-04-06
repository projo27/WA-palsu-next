import React from "react";
import { MapPin, VolumeX, Signal, Wifi, BatteryCharging } from "lucide-react";
import { ChatSettings } from "../../types";
import { cn } from "../../lib/utils";

interface StatusBarProps {
  settings: ChatSettings;
}

export const StatusBar: React.FC<StatusBarProps> = ({ settings }) => {
  if (settings.hideHeader) return null;

  return (
    <div
      className={cn(
        "px-6 py-2 flex justify-between items-center text-[10px] font-bold z-30",
        settings.isDarkMode ? "bg-[#202c33]" : "bg-[#f0f2f5]",
      )}
    >
      <span>{settings.clockTime}</span>
      <div className="flex items-center gap-1.5">
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
                settings.batteryLevel < 20 ? "bg-red-500" : "bg-current",
              )}
              style={{ width: `${settings.batteryLevel}%` }}
            />
            {settings.isCharging && (
              <BatteryCharging size={8} className="absolute inset-0 m-auto" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
