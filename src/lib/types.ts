export interface UserInterface {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  role: 'user' | 'admin' | 'owner' | '';
  plan: 'premium' | 'basic' | '';
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
  status: 'active' | 'pending' | 'suspended' | '';
  twoFA: boolean;
  emailVerified: boolean;
  globalSetting: GlobalRiskSetting;
}

export interface GlobalRiskSetting {
  dailyLossLimit: number;
  dailyLossCurrency: 'amount' | 'percentage';
  maxLossLimit: number;
  maxLossCurrency: 'amount' | 'percentage';
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
  winRate: number;
  avgProfit: number;
  avgLoss: number;
  star: number;
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
