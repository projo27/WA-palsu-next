export type MessageType = 'text' | 'video' | 'image' | 'file' | 'date' | 'call' | 'contact' | 'location';
export type MessageStatus = 'sent' | 'delivered' | 'seen' | 'none';
export type DeviceLayout = 'android' | 'ios' | 'desktop';

export interface Message {
  id: string;
  text?: string;
  type: MessageType;
  sender: 'user' | 'bot' | 'system';
  timestamp: string; // HH:mm format
  status: MessageStatus;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  thumbnailUrl?: string;
  reaction?: string;
  senderName?: string;
  senderColor?: string;
  senderId?: string;
  replyToId?: string;
}

export interface ChatSettings {
  // Display Settings
  layout: DeviceLayout;
  isDarkMode: boolean;
  networkType: string;
  isDualSim: boolean;
  batteryLevel: number;
  isCharging: boolean;
  showBatteryPercentage: boolean;
  headerIcon: 'none' | 'location' | 'silent';
  backgroundImage: string;
  chatBackgroundColor: string;
  userBubbleColor: string;
  receiverBubbleColor: string;
  textSize: number;
  uiTextSize: number;
  hideHeader: boolean;
  hideFooter: boolean;
  showPayment: boolean;
  showChatArrow: boolean;
  navigationBar: 'none' | 'android' | 'ios';
  clockTime: string;
  is24Hour: boolean;
  showDynamicIsland: boolean;
  enableContextMenu: boolean;

  // Profile Settings
  receiverName: string;
  receiverStatus: string;
  receiverAvatar: string;
  isGroup: boolean;
  groupMembers?: string;
  groupParticipants?: { id: string; name: string; color: string }[];
}
