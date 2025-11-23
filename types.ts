export interface TradeLevel {
  price: number;
  description?: string;
}

export interface TradeSetup {
  type: 'BUY' | 'SELL' | 'NEUTRAL';
  entry: number;
  stopLoss: number;
  tp1: number;
  tp2: number;
  tp3: number;
  riskRewardRatio: string;
  confidence: number; // 0-100
  reasoning: string[];
  managementTips: string[]; // New: Specific advice for managing this trade
}

export interface TechnicalIndicator {
  name: string;
  value: string | number;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
}

export interface MarketAnalysis {
  pair: string;
  currentPrice: number;
  timestamp: string;
  session: string; // New: London, New York, Asian, etc.
  trend: 'UP' | 'DOWN' | 'SIDEWAYS';
  fundamentals: {
    summary: string;
    impactLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    newsPoints: string[];
    upcomingEvents: string[]; // New: Specific next events
  };
  technicals: {
    rsi: number;
    macd: string;
    mas: string;
    patterns: string[];
    indicators: TechnicalIndicator[];
    institutionalBias: string; // New: Smart Money Concept
  };
  correlations: { // New: DXY, Yields, etc.
    asset: string;
    correlation: string; // e.g. "Inverse - Strong"
    details: string;
  }[];
  levels: {
    support: number[];
    resistance: number[];
  };
  setup: TradeSetup;
  sources: { uri: string; title: string }[];
}

export enum Timeframe {
  SCALPING = 'Scalping (M5-M15)',
  INTRADAY = 'Intraday (H1-H4)',
  SWING = 'Swing (Daily)',
}

export enum StrategyStyle {
  CONSERVATIVE = 'محافظ (Conservative)',
  AGGRESSIVE = 'مغامر (Aggressive)',
}