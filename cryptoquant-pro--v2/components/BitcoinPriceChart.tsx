
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSettings } from '../contexts/SettingsContext';

const generatePriceData = () => {
  const data = [];
  const days = 90;
  let price = 68500;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Simulate some realistic price movement
    const volatility = 0.03;
    const trend = Math.sin(i / 20) * 0.005;
    price *= 1 + (Math.random() - 0.5) * volatility + trend;
    
    data.push({
      date: date.getTime(),
      price: price
    });
  }
  return data;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-surface/80 backdrop-blur-sm border border-brand-border p-3 rounded-lg shadow-lg">
        <p className="label text-sm text-brand-secondary">{new Date(label).toLocaleDateString()}</p>
        <p className="intro text-base font-bold text-brand-text">{`Price: $${payload[0].value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</p>
      </div>
    );
  }
  return null;
};

const BitcoinPriceChart: React.FC = () => {
  const data = useMemo(() => generatePriceData(), []);
  const { chart3DStyle } = useSettings();
  const is3D = chart3DStyle !== 'off';
  const chartClass = is3D ? `chart-3d-${chart3DStyle}` : '';

  return (
    <div className={`bg-brand-surface border border-brand-border rounded-xl p-4 md:p-6 shadow-lg h-full min-h-[440px] chart-container ${chartClass}`}>
      <h3 className="text-lg font-semibold text-brand-text mb-4">Bitcoin Price (90-Day)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 20,
          }}
        >
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-chart-orange)" stopOpacity={0.7}/>
              <stop offset="95%" stopColor="var(--color-chart-orange)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="date" 
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            stroke="var(--color-secondary)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis
            orientation="right"
            stroke="var(--color-secondary)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1, strokeDasharray: '3 3' }} />
          <Area type="monotone" dataKey="price" stroke="var(--color-chart-orange)" strokeWidth={2} fill="url(#priceGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(BitcoinPriceChart);
