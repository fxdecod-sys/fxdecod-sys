export enum ActionType {
  BUY = 'BUY',
  SELL = 'SELL',
  NEUTRAL = 'NEUTRAL'
}

export interface TradeLevel {
  price: number;
  label: string;
}

export interface SupportResistance {
  supports: number[];
  resistances: number[];
}

export interface AnalysisResponse {
  pair: string;
  currentPrice: number;
  action: ActionType;
  entry: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  confidence: number;
  riskRewardRatio: string;
  smcContext: string; // Order blocks, liquidity grabs
  fundamentalAnalysis: string;
  correlationNote: string;
  supportResistance: SupportResistance;
}

export interface AnalysisRequest {
  pair: string;
  timeframe: string;
  strategy: string;
}

export const PAIRS = [
  'XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'USDCAD', 'BTCUSD', 'ETHUSD', 'WTI_OIL'
];

export const TIMEFRAMES = [
  'Scalping (5m)', 'Intraday (15m)', 'Intraday (1h)', 'Swing (4h)', 'Swing (Daily)'
];

export const STRATEGIES = [
  'Smart Money Concepts (SMC)', 'Conservative Trend', 'Aggressive Reversal'
];