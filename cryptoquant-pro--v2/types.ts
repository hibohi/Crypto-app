export type View = 'dashboard' | 'dca-simulator' | 'market-insights' | 'advanced-charts' | 'rainbow-chart' | 'settings';
export type Chart3DStyle = 'off' | 'subtle' | 'iso';

export interface DcaResult {
  totalInvested: number;
  finalValue: number;
  roi: number;
  numberOfInvestments: number;
  averagePrice: number;
}

export interface DcaHistoryPoint {
    date: string;
    totalInvested: number;
    portfolioValue: number;
    price: number;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export interface ChartInfo {
    id: string;
    name: string;
    description: string;
    component: React.FC;
}

export interface ChartCategory {
    name: string;
    charts: ChartInfo[];
}
