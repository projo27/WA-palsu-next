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
  textSize: 'default',
  hideHeader: false,
  hideFooter: false,
  showPayment: false,
  showChatArrow: true,
  navigationBar: 'none',
  clockTime: '10:04',
  is24Hour: true,
  receiverName: 'John Doe',
  receiverStatus: 'Online',
  receiverAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  isGroup: false,
  groupMembers: 'Member1, Member2'
};
