import { ChatSettings } from './types';

export const DEFAULT_SETTINGS: ChatSettings = {
  layout: 'android',
  isDarkMode: false,
  networkType: '4G',
  isDualSim: false,
  batteryLevel: 50,
  isCharging: false,
  showBatteryPercentage: true,
  headerIcon: 'none',
  backgroundImage: '',
  chatBackgroundColor: '#efeae2',
  userBubbleColor: '#d9fdd3',
  receiverBubbleColor: '#ffffff',
  textSize: 'default',
  hideHeader: false,
  hideFooter: false,
  showPayment: false,
  showChatArrow: true,
  navigationBar: 'none',
  clockTime: '10:04',
  is24Hour: true,
  showDynamicIsland: false,
  receiverName: 'John Doe',
  receiverStatus: 'Online',
  receiverAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  isGroup: false,
  groupMembers: 'Member1, Member2',
  groupParticipants: [
    { id: '1', name: 'User A', color: '#ffb300' },
    { id: '2', name: 'User B', color: '#00a884' }
  ]
};
