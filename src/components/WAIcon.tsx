import React from "react";
import spriteUrl from "../assets/image/whatsapp-chat.png";
import { cn } from "../lib/utils";

export type WAIconName =
  | "backArrow"
  | "backChevron"
  | "phone"
  | "video"
  | "more"
  | "smile"
  | "paperclip"
  | "camera"
  | "mic"
  | "chevronDown"
  | "plus";

const ICON_MAP: Record<
  WAIconName,
  { x: number; y: number; oWidth?: number; oHeight?: number }
> = {
  backArrow: { x: 0, y: 0 },
  phone: { x: 2, y: 0 },
  more: { x: 4, y: 0 },

  smile: { x: 0, y: 1 },
  paperclip: { x: 2, y: 1 },

  mic: { x: 0, y: 2 },
  camera: { x: 4, y: 2 }, // bold camera

  backChevron: { x: 0, y: 3 },
  video: { x: 4, y: 5 },

  chevronDown: { x: 2, y: 4 },

  plus: { x: 0, y: 5 },
};

interface WAIconProps {
  name: WAIconName;
  className?: string;
  size?: number; // Target size in px
  isDarkMode?: boolean;
}

export const WAIcon: React.FC<WAIconProps> = ({
  name,
  className,
  size = 24,
  isDarkMode = false,
}) => {
  const icon = ICON_MAP[name];
  const CELL_SIZE = 60;

  // Calculate relative scaling
  const scale = size / CELL_SIZE;
  const bgSizeX = 360 * scale;
  const bgSizeY = 480 * scale;
  const posX = -icon.x * CELL_SIZE * scale;
  const posY = -icon.y * CELL_SIZE * scale;

  // Most of the icons in standard whatsapp-chat.png are black/grey.
  // Invert colors fully for dark mode to get white/light-grey.
  return (
    <div
      className={cn("inline-block shrink-0", className)}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${spriteUrl})`,
        backgroundSize: `${bgSizeX}px ${bgSizeY}px`,
        backgroundPosition: `${posX}px ${posY}px`,
        backgroundRepeat: "no-repeat",
        filter: isDarkMode ? "invert(1) brightness(1.2) contrast(1.2)" : "none",
      }}
    />
  );
};
