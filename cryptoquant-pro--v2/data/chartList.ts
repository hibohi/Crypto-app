import { ChartCategory } from '../types';
import React from 'react';
import {
    MvrvZScoreChart,
    SOPRChart,
    NUPLChart,
    NVTSChart,
    TotalMarketCapChart,
    DominanceChart,
    SSRChart,
    CryptoHeatmap,
    MonthlyReturnsChart,
    AltcoinSeasonIndexChart,
    ROIAfterBottomChart,
    BestDayToDCAChart,
    HODLWavesChart,
    RHODLRatioChart,
    S2FChart,
    PuellMultipleChart,
    RSIChart,
    MACDChart,
    BollingerBandsChart,
    GoldenDeathCrossChart,
    OpenInterestChart,
} from '../components/AllCharts';

export const chartCategories: ChartCategory[] = [
    {
        name: 'Valuation',
        charts: [
             { id: 'mvrv-z-score', name: 'MVRV Z-Score', description: 'Assesses when Bitcoin is over/undervalued relative to its "fair value".', component: MvrvZScoreChart },
             { id: 'sopr', name: 'Spent Output Profit Ratio (SOPR)', description: 'Indicates if holders are selling at a profit or loss. Values > 1 indicate profit.', component: SOPRChart },
             { id: 'nupl', name: 'Net Unrealized Profit/Loss (NUPL)', description: 'Shows the total amount of profit/loss in all coins, split into sentiment zones.', component: NUPLChart },
             { id: 'nvts', name: 'Network Value to Transaction Signal (NVTS)', description: 'A valuation multiple based on transaction volume vs. market cap.', component: NVTSChart },
        ],
    },
    {
        name: 'Price & Market Cap Metrics',
        charts: [
            { id: 'total-mcap', name: 'Total Crypto Market Cap', description: 'The total value of all cryptocurrencies, including and excluding Bitcoin.', component: TotalMarketCapChart },
            { id: 'dominance', name: 'Crypto Dominance', description: 'The market cap of a coin as a percentage of the total market.', component: DominanceChart },
            { id: 'ssr', name: 'Stablecoin Supply Ratio (SSR)', description: 'The ratio of Bitcoin market cap to the total stablecoin supply.', component: SSRChart },
            { id: 'heatmap', name: 'Crypto Heatmap', description: 'Visualizes the performance of different cryptocurrencies over the last 24h.', component: CryptoHeatmap },
        ]
    },
     {
        name: 'On-Chain Supply',
        charts: [
            { id: 'hodl-waves', name: 'HODL Waves', description: 'Visualizes the age distribution of coins, showing holding patterns.', component: HODLWavesChart },
            { id: 'rhodl-ratio', name: 'RHODL Ratio', description: 'Ratio of short-term vs long-term holder wealth to identify market tops.', component: RHODLRatioChart },
            { id: 's2f', name: 'Stock to Flow (S2F)', description: 'A model that values an asset based on its scarcity and halving cycles.', component: S2FChart },
            { id: 'puell-multiple', name: 'Puell Multiple', description: 'Examines miner revenue to identify market tops and bottoms.', component: PuellMultipleChart },
        ]
    },
    {
        name: 'Technical Analysis',
        charts: [
            { id: 'bollinger-bands', name: 'Bollinger Bands', description: 'Measures market volatility and potential price levels around a moving average.', component: BollingerBandsChart },
            { id: 'golden-death-cross', name: 'Golden/Death Crosses', description: 'Occurs when a short-term moving average crosses over a long-term one.', component: GoldenDeathCrossChart },
            { id: 'rsi', name: 'Relative Strength Index (RSI)', description: 'A momentum indicator that measures the speed and change of price movements.', component: RSIChart },
            { id: 'macd', name: 'Moving Average Convergence Divergence (MACD)', description: 'A trend-following momentum indicator showing relationship between two MAs.', component: MACDChart },
        ]
    },
    {
        name: 'Return On Investment',
        charts: [
            { id: 'monthly-returns', name: 'BTC Monthly Returns', description: 'Historical monthly ROI for an asset, visualized as a heatmap.', component: MonthlyReturnsChart },
            { id: 'altcoin-season', name: 'Altcoin Season Index', description: 'Indicates if it is a better time to invest in altcoins vs. Bitcoin.', component: AltcoinSeasonIndexChart },
            { id: 'roi-after-bottom', name: 'ROI Since Cycle Bottom', description: 'Tracks performance since the last major market bottom across cycles.', component: ROIAfterBottomChart },
            { id: 'best-dca-day', name: 'Best Day To DCA', description: 'Analyzes the best day of the week to make regular investments for BTC.', component: BestDayToDCAChart },
        ]
    },
    {
        name: 'Derivatives',
        charts: [
            { id: 'open-interest-futures', name: 'Open Interest of BTC Futures', description: 'The total number of outstanding derivative contracts, indicating market sentiment.', component: OpenInterestChart },
        ]
    }
];