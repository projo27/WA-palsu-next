import {
  Battery,
  BatteryCharging,
  MapPin,
  Moon,
  Sun,
  VolumeX,
  X,
} from "lucide-react";
import React from "react";
import { cn } from "../../lib/utils";
import { ChatSettings, DeviceLayout } from "../../types";

import androidIcon from "../../assets/icon/android.svg";
import iosIcon from "../../assets/icon/ios.svg";
import desktopIcon from "../../assets/icon/desktop.svg";

interface DisplaySettingsProps {
  settings: ChatSettings;
  setSettings: (settings: ChatSettings) => void;
}

export const DisplaySettings: React.FC<DisplaySettingsProps> = ({
  settings,
  setSettings,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
      {/* Layout Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">Layout</label>
        <div className="flex gap-2">
          {(["android", "ios", "desktop"] as DeviceLayout[]).map((l) => (
            <button
              key={l}
              onClick={() => setSettings({ ...settings, layout: l })}
              className={cn(
                "p-2 rounded border transition-all",
                settings.layout === l
                  ? "border-[#539ba0] bg-[#539ba0]/10 text-[#539ba0]"
                  : "border-gray-200 hover:border-gray-300",
              )}
            >
              {l === "android" && (
                <img src={androidIcon} alt="Android" className="w-5 h-5" />
              )}
              {l === "ios" && (
                <img
                  src={iosIcon}
                  alt="iOS"
                  className="w-5 h-5"
                />
              )}
              {l === "desktop" && (
                <img src={desktopIcon} alt="Desktop" className="w-5 h-5" />
              )}
            </button>
          ))}
          <button
            onClick={() =>
              setSettings({ ...settings, isDarkMode: !settings.isDarkMode })
            }
            className={cn(
              "ml-auto px-4 py-2 rounded-full border flex items-center gap-2 text-sm font-medium transition-all",
              settings.isDarkMode
                ? "bg-[#202c33] text-white border-[#202c33]"
                : "bg-white text-gray-700 border-gray-200",
            )}
          >
            {settings.isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
            Dark Mode
          </button>
        </div>
      </div>

      {/* Network & Clock */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Network</label>
          <select
            value={settings.networkType}
            onChange={(e) =>
              setSettings({ ...settings, networkType: e.target.value })
            }
            className="w-full p-2 rounded border border-gray-200 text-sm"
          >
            <option>4G</option>
            <option>5G</option>
            <option>WiFi</option>
            <option>LTE</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Clock</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={settings.clockTime}
              onChange={(e) =>
                setSettings({ ...settings, clockTime: e.target.value })
              }
              className="w-full p-2 rounded border border-gray-200 text-sm"
            />
            <button
              onClick={() =>
                setSettings({ ...settings, is24Hour: !settings.is24Hour })
              }
              className={cn(
                "px-2 py-1 rounded text-[10px] font-bold border",
                settings.is24Hour
                  ? "bg-[#539ba0] text-white border-[#539ba0]"
                  : "bg-white text-gray-500 border-gray-200",
              )}
            >
              {settings.is24Hour ? "24h" : "12h"}
            </button>
          </div>
        </div>
      </div>

      {/* Battery */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-600">Battery</label>
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={settings.batteryLevel}
            onChange={(e) =>
              setSettings({
                ...settings,
                batteryLevel: parseInt(e.target.value),
              })
            }
            className="w-16 p-2 rounded border border-gray-200 text-sm"
          />
          <span className="text-sm text-gray-500">%</span>
          <button
            onClick={() =>
              setSettings({ ...settings, isCharging: !settings.isCharging })
            }
            className={cn(
              "px-4 py-2 rounded border flex items-center gap-2 text-sm transition-all",
              settings.isCharging
                ? "bg-green-500 text-white border-green-500"
                : "bg-white text-gray-600 border-gray-200",
            )}
          >
            {settings.isCharging ? (
              <BatteryCharging size={16} />
            ) : (
              <Battery size={16} />
            )}
            Charging
          </button>
          <button
            onClick={() =>
              setSettings({
                ...settings,
                showBatteryPercentage: !settings.showBatteryPercentage,
              })
            }
            className={cn(
              "px-4 py-2 rounded border text-sm transition-all",
              settings.showBatteryPercentage
                ? "bg-[#539ba0] text-white border-[#539ba0]"
                : "bg-white text-gray-600 border-gray-200",
            )}
          >
            Show Battery %
          </button>
        </div>
      </div>

      {/* Header Icons */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">
          Header Icons
        </label>
        <div className="flex gap-2">
          {(["none", "location", "silent"] as const).map((icon) => (
            <button
              key={icon}
              onClick={() => setSettings({ ...settings, headerIcon: icon })}
              className={cn(
                "flex-1 py-2 px-3 rounded border flex items-center justify-center gap-2 text-sm font-medium transition-all",
                settings.headerIcon === icon
                  ? "bg-[#539ba0] text-white border-[#539ba0]"
                  : "bg-white text-gray-600 border-gray-200",
              )}
            >
              {icon === "none" && <X size={16} />}
              {icon === "location" && <MapPin size={16} />}
              {icon === "silent" && <VolumeX size={16} />}
              {icon.charAt(0).toUpperCase() + icon.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Options */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-600">
          Chat & Bubble Colors
        </label>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Background</label>
            <input
              type="color"
              value={settings.chatBackgroundColor}
              onChange={(e) =>
                setSettings({ ...settings, chatBackgroundColor: e.target.value })
              }
              className="w-full h-8 p-0 border-0 rounded cursor-pointer"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500">My Bubble</label>
            <input
              type="color"
              value={settings.userBubbleColor || (settings.isDarkMode ? '#005c4b' : '#d9fdd3')}
              onChange={(e) =>
                setSettings({ ...settings, userBubbleColor: e.target.value })
              }
              className="w-full h-8 p-0 border-0 rounded cursor-pointer"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Their Bubble</label>
            <input
              type="color"
              value={settings.receiverBubbleColor || (settings.isDarkMode ? '#202c33' : '#ffffff')}
              onChange={(e) =>
                setSettings({ ...settings, receiverBubbleColor: e.target.value })
              }
              className="w-full h-8 p-0 border-0 rounded cursor-pointer"
            />
          </div>
        </div>
        <div className="space-y-2 mt-2">
          <label className="text-sm font-medium text-gray-600">Text Size</label>
          <select
            value={settings.textSize}
            onChange={(e) =>
              setSettings({ ...settings, textSize: e.target.value as any })
            }
            className="w-full p-2 rounded border border-gray-200 text-sm"
          >
            <option value="small">Small</option>
            <option value="default">Default</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>

      {/* More Options */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">
          More Options
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() =>
              setSettings({ ...settings, hideHeader: !settings.hideHeader })
            }
            className={cn(
              "p-2 rounded border text-xs transition-all flex items-center justify-center gap-2",
              settings.hideHeader ? "bg-[#539ba0] text-white" : "bg-white",
            )}
          >
            <X size={14} /> Hide Header
          </button>
          <button
            onClick={() =>
              setSettings({ ...settings, hideFooter: !settings.hideFooter })
            }
            className={cn(
              "p-2 rounded border text-xs transition-all flex items-center justify-center gap-2",
              settings.hideFooter ? "bg-[#539ba0] text-white" : "bg-white",
            )}
          >
            <X size={14} /> Hide Footer
          </button>
          <button
            onClick={() =>
              setSettings({ ...settings, showPayment: !settings.showPayment })
            }
            className={cn(
              "p-2 rounded border text-xs transition-all flex items-center justify-center gap-2",
              settings.showPayment ? "bg-[#539ba0] text-white" : "bg-white",
            )}
          >
            $ Show Payment
          </button>
          <button
            onClick={() =>
              setSettings({
                ...settings,
                showChatArrow: !settings.showChatArrow,
              })
            }
            className={cn(
              "p-2 rounded border text-xs transition-all flex items-center justify-center gap-2",
              settings.showChatArrow ? "bg-[#539ba0] text-white" : "bg-white",
            )}
          >
            Chat Arrow
          </button>
        </div>
      </div>

      {/* Screen Navigation Bar */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">
          Screen Navigation Bar
        </label>
        <select
          value={settings.navigationBar}
          onChange={(e) =>
            setSettings({ ...settings, navigationBar: e.target.value as any })
          }
          className="w-full p-2 rounded border border-gray-200 text-sm"
        >
          <option value="none">None</option>
          <option value="android">Android</option>
          <option value="ios">iOS</option>
        </select>
      </div>
    </div>
  );
};
