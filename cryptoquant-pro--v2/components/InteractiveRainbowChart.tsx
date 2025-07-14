
import React, { useMemo, useState } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useSettings } from '../contexts/SettingsContext';
import { CustomCandle } from './Candlestick';

// Use theme-aware CSS variables for colors
const BANDS = [
  { name: 'Basically a Fire Sale', color: 'var(--color-chart-blue)' },
  { name: 'BUY!', color: 'var(--color-chart-sky)' },
  { name: 'Accumulate', color: 'var(--color-chart-cyan)' },
  { name: 'Still Cheap', color: 'var(--color-chart-teal)' },
  { name: 'HODL!', color: 'var(--color-chart-green)' },
  { name: 'Is This A Bubble?', color: 'var(--color-chart-yellow)' },
  { name: 'FOMO Intensifies', color: 'var(--color-chart-orange)' },
  { name: 'Sell. Seriously, SELL!', color: 'var(--color-chart-red)' },
  { name: 'Maximum Bubble Territory', color: 'var(--color-chart-pink)' },
];

const getBandForPrice = (price, dataPoint) => {
    if (!dataPoint) return BANDS[0];
    for (let i = 0; i < BANDS.length; i++) {
        const bandTop = dataPoint[`bandTop${i}`];
        if (price <= bandTop) {
            return BANDS[i];
        }
    }
    // If price is higher than all bands
    return BANDS[BANDS.length - 1];
};

const generateRainbowData = () => {
  const data = [];
  const days = 365 * 8; // ~8 years
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const A = 2.1; // Growth factor
  const B = 5.5; // Initial offset

  for (let i = 1; i <= days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    if (i <= 0) continue; // safety check for log
    const baseLogPrice = A * Math.log(i) + B;

    // Generate upper bounds for each band
    const bandsData = {};
    for (let j = 0; j < BANDS.length; j++) {
      const bandOffset = (j - BANDS.length / 2 + 0.5) * 0.5;
      const bandUpper = Math.exp(baseLogPrice + bandOffset);
      bandsData[`bandTop${j}`] = bandUpper;
    }
    
    const cycleDays = 1460; // 4 year cycle
    const cycle = Math.sin((i / cycleDays) * 2 * Math.PI - Math.PI / 1.8);
    
    const priceVolatility = 1.6 + Math.sin(i / (cycleDays * 2)) * 0.5;
    const randomNoise = (Math.random() - 0.5) * 0.3 * (1 + i/days);
    const priceLogOffset = cycle * priceVolatility + randomNoise;
    
    const close = Math.exp(baseLogPrice + priceLogOffset);
    
    const prevDayCycle = i > 1 ? Math.sin(((i-1) / cycleDays) * 2 * Math.PI - Math.PI / 1.8) : 0;
    const prevPriceLogOffset = prevDayCycle * priceVolatility;
    const open = i > 1 ? Math.exp(baseLogPrice - (A * Math.log(i/(i-1))) + prevPriceLogOffset) : close;
    
    const high = Math.max(open, close) * (1 + Math.random() * 0.05);
    const low = Math.min(open, close) * (1 - Math.random() * 0.05);
    
    const basePoint = {
      date: date.getTime(),
      price: close,
      ohlc: [open, high, low, close],
      ...bandsData,
    };
    
    data.push(basePoint);
  }
  return data;
};

const CustomTooltipContent = ({ active, payload, label }: {active?: boolean; payload?: any[]; label?: any; [key: string]: any; }) => {
  if (active && payload && payload.length) {
    const pointData = payload[0]?.payload;
    if (!pointData) return null;

    const price = pointData.price;
    const currentBand = getBandForPrice(price, pointData);
    
    return (
      <div className="bg-brand-surface/80 backdrop-blur-sm border border-brand-border p-3 rounded-lg shadow-lg">
        <p className="label text-sm text-brand-secondary">{new Date(label).toLocaleDateString()}</p>
        <p className="intro text-base font-bold text-brand-text">{`Price: $${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</p>
        <div className="flex items-center mt-1">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: currentBand.color }}/>
          <p className="text-sm font-semibold" style={{ color: currentBand.color }}>{currentBand.name}</p>
        </div>
      </div>
    );
  }
  return null;
};

const RainbowChartLegend = () => (
    <div className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-lg h-full">
        <h3 className="text-lg font-semibold text-brand-text mb-4">Valuation Zones</h3>
        <ul className="space-y-2">
            {[...BANDS].reverse().map(band => (
                <li key={band.name} className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-3 border border-white/20" style={{ backgroundColor: band.color }}></div>
                    <span className="text-sm text-brand-text">{band.name}</span>
                </li>
            ))}
        </ul>
        <p className="text-xs text-brand-secondary mt-4">
            This is not investment advice. It is a visual tool for gauging market sentiment based on a logarithmic growth model.
        </p>
    </div>
);

const InteractiveRainbowChart = () => {
    const [view, setView] = useState('line');
    const data = useMemo(() => generateRainbowData(), []);
    const { chart3DStyle } = useSettings();
    const is3D = chart3DStyle !== 'off';
    const chartClass = is3D ? `chart-3d-${chart3DStyle}` : '';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className={`lg:col-span-3 bg-brand-surface border border-brand-border rounded-xl p-4 md:p-6 shadow-lg h-[700px] chart-container ${chartClass}`}>
                <div className="flex justify-end mb-4">
                    <div className="flex items-center bg-gray-800/50 border border-brand-border rounded-lg p-1">
                        <button onClick={() => setView('line')} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors w-28 ${view === 'line' ? 'bg-brand-primary text-white shadow' : 'text-brand-secondary hover:bg-brand-surface'}`}>Rainbow Line</button>
                        <button onClick={() => setView('candle')} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors w-28 ${view === 'candle' ? 'bg-brand-primary text-white shadow' : 'text-brand-secondary hover:bg-brand-surface'}`}>Candlestick</button>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height="calc(100% - 40px)">
                    <ComposedChart
                        data={data}
                        margin={{ top: 5, right: 20, left: 10, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5} />
                        <XAxis
                            dataKey="date"
                            type="number"
                            scale="time"
                            domain={['dataMin', 'dataMax']}
                            tickFormatter={(unixTime) => new Date(unixTime).getFullYear().toString()}
                            stroke="var(--color-secondary)"
                            fontSize={12}
                        />
                        <YAxis
                            scale="log"
                            domain={[1, 'auto']}
                            allowDataOverflow={true}
                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                            stroke="var(--color-secondary)"
                            fontSize={12}
                            width={80}
                        />
                        <Tooltip content={<CustomTooltipContent />} cursor={{ stroke: 'var(--color-primary)' }} />
                        
                        {/* Render bands from top to bottom so they layer correctly */}
                        {[...BANDS].reverse().map((band, index) => {
                            const bandIndex = BANDS.length - 1 - index;
                            return (
                                <Area
                                    key={band.name}
                                    type="monotone"
                                    dataKey={`bandTop${bandIndex}`}
                                    fill={band.color}
                                    stroke="none"
                                    fillOpacity={0.8}
                                    isAnimationActive={false}
                                />
                            );
                        })}
                         
                        {view === 'line' ? (
                             <Line dataKey="price" stroke={'#FFFFFF'} strokeWidth={2} dot={false} isAnimationActive={false} />
                        ) : (
                            <Line dataKey="ohlc" stroke="transparent" isAnimationActive={false}>
                                {data.map((entry, index) => (
                                    <CustomCandle key={`candle-${index}`} {...entry} />
                                ))}
                            </Line>
                        )}
                       
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
            <div className="lg:col-span-1">
                <RainbowChartLegend />
            </div>
        </div>
    );
};

export default InteractiveRainbowChart;
