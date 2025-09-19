export interface UserInterface {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  role: 'user' | 'admin' | 'trader';
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
}

export interface ConnectAccount {
  name: string;
  platform: 'mt4' | 'mt5';
  magic: string;
  login: string;
  brokerage: string;
  accountId: string;
  active: boolean;
  subscribedStrategies: string[];
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
  maxCurrentPositions: number;
  dailyLossLimit: number;
  dailyLossCurrency: string;
  maxLossLimit: number;
  maxLossCurrency: string;
  // maximumDrawdown: number;
  isCloseAllPositions: boolean;
  isPauseTrading: boolean;
  isSendNotification: boolean;
  subscribed: string[];
}

export interface PositionSizeInterface {
  riskAmount: number;
  positionSize: number;
}
