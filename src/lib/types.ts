export type UserRole = 'user' | 'admin' | 'owner' | 'support' | '';
export type UserStatus = 'active' | 'pending' | 'suspended' | 'deleted' | '';
export type UserPlan = 'premium' | 'basic' | '';

export interface UserInterface {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
  plan: UserPlan;
  mt5AccountId: string;
  riskSettings: RiskSettingsInterface;
  isPausedTradingForDay: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  accounts: ConnectAccount[];
  strategySetting: RiskSettingsInterface[];
  metaApiToken: string;
  trades?: any[] | undefined;
  status: UserStatus;
  twoFA: boolean;
  agreedTerms: boolean;
  emailVerified: boolean;
  globalSetting: GlobalRiskSetting;
}

export interface GlobalRiskSetting {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  weeklyClose: boolean;
  weeklyCloseTime: string;

  isTimeLimit: boolean;
  startTime: string;
  endTime: string;
}

export interface StrategySetting {
  strategyId: string;
  title: string;
  riskPerTrade: number;
  subscribed: boolean;
  // maxCurrentPositions: number;
  // isCloseAllPositions: boolean;
  // isPauseTrading: boolean;
  // isSendNotification: boolean;
  // subscribed: string[];
}

export interface ConnectAccount {
  name: string;
  platform: 'mt4' | 'mt5' | '-';
  magic: string;
  login: string;
  brokerage: string;
  accountId: string;
  active: boolean;
  strategySettings: StrategySetting[];
  subscribedStrategies: string[];
  dailyLossCurrency: 'percentage' | 'amount';
  dailyLossLimit: number;
  maxLossCurrency: 'percentage' | 'amount';
  maxLossLimit: number;
}

export interface PositionSize {
  riskType: string;
  riskPerTrade: number;
  accountBalance: number;
  stopLossType: 'atr' | 'percentage' | 'fixed';
  atrMultiplier?: number;
  stopLossPercentage?: number;
  riskAmount: number;
  positionSize: number;
}

export interface TradingLimits {
  maxCurrentPositions: number;
  dailyLossLimit: number;
  // maximumDrawdown: number;
  isCloseAllPositions: boolean;
  isPauseTrading: boolean;
  isSendNotification: boolean;
}

export interface StopLossSettings {
  // isAutoStopLoss: boolean;
  isTrailingStop: boolean;
  trailingUnits: string;
  trailingDistance: number;
  // isMoveToBreak: boolean;
  // triggerAtProfit: number;
}

export interface PartialClose {
  close: number;
  target: number;
}

export interface TakeProfitSettings {
  // isAutoTakeProfit: boolean;
  partialClose: PartialClose[];
}

export interface RiskSettingsInterface {
  strategyId: string;
  title?: string;
  riskPerTrade: number;
  // maxCurrentPositions: number;
  // dailyLossLimit: number;
  // dailyLossCurrency: 'percentage' | 'amount';
  // maxLossLimit: number;
  // maxLossCurrency: string;
  // maximumDrawdown: number;
  // isCloseAllPositions: boolean;
  // isPauseTrading: boolean;
  // isSendNotification: boolean;
  subscribed: string[];
}

export interface PositionSizeInterface {
  riskAmount: number;
  positionSize: number;
}

export interface StrategyInterface {
  _id: string;
  title: string;
  description: string;
  symbol: string;
  winRate: number;
  avgProfit: number;
  avgLoss: number;
  star: number;
  images: string[];
  tags: string[];
  subscribers: string[];
  status: 'Live' | 'Development' | 'Paused';
  enabled: boolean;
}

export interface GlobalSettingInterface {
  isPausedAllTrading: boolean;
  isMaintaining: boolean;
  tiers: ITier[];
}

export interface ITier {
  name: 'basic' | 'premium';
  price: number;
  maxAccountsCount: number;
  level: number;
}

export interface HistoryItem {
  quantity: number;
  date: number;
}

export interface DataItem {
  _id: any;
  userId: any;
  accountId: string;
  login: string;
  history: HistoryItem[];
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface StrategyInterface {
  _id: string;
  title: string;
  description: string;
  winRate: number;
  avgProfit: number;
  avgLoss: number;
  star: number;
  tags: string[];
  subscribers: string[];
  status: 'Live' | 'Development' | 'Paused';
  enabled: boolean;
}

export interface Announcement {
  _id: string;
  title: string;
  message: string;
  expireTime: string;
  readers: string[];
  receivers: string[];
  image_url: string | null;
  createdAt: string;
  createdBy: string;
}

export interface Lesson {
  _id: string;
  title: string;
  description: string | null;
  video: string;
  order: number;
  moduleId: string;
  moduleTitle: string;
  tutorialId: string;
  tutorialTitle: string;
}

export interface Module {
  _id: string;
  title: string;
  order: number;
  lessons: Lesson[];
  tutorialTitle: string;
  tutorialId: string;
}

export interface Tutorial {
  _id: string;
  title: string;
  description: string | null;
  modules: Module[];
}
