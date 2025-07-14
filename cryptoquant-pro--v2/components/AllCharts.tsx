
import React, { useMemo } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, Legend, Cell
} from 'recharts';
import { useSettings } from '../contexts/SettingsContext';
import { CustomCandle } from './Candlestick';


// --- Data Generation & Helpers ---
const generateCyclicData = (days, period, amplitude, base, noise) => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const cycle = Math.sin((i / period) * 2 * Math.PI - Math.PI / 2);
        const irregularity = Math.sin((i / (period * 0.37)) * 2 * Math.PI) * 0.2; // Add a smaller, faster cycle
        const value = base + (cycle + irregularity) * amplitude + (Math.random() - 0.5) * noise * (1 + cycle);
        data.push({ date: date.getTime(), value: Math.max(0, value) }); // Ensure value is not negative
    }
    return data;
};

const generatePriceData = (days) => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    let price = 5000;
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        // Geometric Brownian Motion for more realistic price movement
        const drift = 0.0007; // upward trend
        const volatility = 0.025; // daily volatility
        price *= Math.exp(drift - 0.5 * volatility ** 2 + volatility * ((Math.random() + Math.random() + Math.random() + Math.random()) - 2)); // Use Irwin-Hall for pseudo-normal distribution

        const open = price * (1 + (Math.random() - 0.5) * 0.03);
        const high = Math.max(price, open) * (1 + Math.random() * 0.02);
        const low = Math.min(price, open) * (1 - Math.random() * 0.02);
        
        data.push({
            date: date.getTime(),
            price: Math.max(0, price),
            ohlc: [open, high, low, Math.max(0, price)],
            vol: Math.random() * 1e9 + (price/60000) * 0.5 * 1e9
        });
    }
    return data;
}

const BaseChartTooltip = ({ active, payload, label, valueFormatter, labelFormatter }: { active?: boolean; payload?: any[]; label?: any; valueFormatter?: (value: any, name?: string) => string; labelFormatter?: (label: any) => string; [key: string]: any; }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-brand-surface/80 backdrop-blur-sm border border-brand-border p-2 px-3 rounded-lg shadow-lg text-sm">
                <p className="label text-brand-secondary mb-1">{labelFormatter ? labelFormatter(label) : (label ? new Date(label).toLocaleDateString() : '')}</p>
                {payload.map((p, i) => (
                    <div key={i} className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: p.color || p.stroke || 'var(--color-primary)'}} />
                        <p style={{ color: 'var(--color-text)' }}>{`${p.name}: `}<span className="font-bold">{valueFormatter ? valueFormatter(p.value, p.name) : (typeof p.value === 'number' ? p.value.toLocaleString(undefined, {maximumFractionDigits: 2}) : String(p.value))}</span></p>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const ChartWrapper = ({ children, chart3DStyle }) => {
    const chartClass = chart3DStyle !== 'off' ? `chart-3d-${chart3DStyle}` : '';
    return <div className={`h-64 sm:h-72 chart-container ${chartClass}`}>{children}</div>;
};

// --- VALUATION CHARTS ---
export const MvrvZScoreChart = () => {
    const data = useMemo(() => generateCyclicData(1825, 1460, 4.5, 3.5, 1.5).map(d => ({ ...d, zScore: Math.max(-1, d.value - 4)})), []);
    const { chart3DStyle } = useSettings();

    return (
        <ChartWrapper chart3DStyle={chart3DStyle}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5}/>
                    <XAxis dataKey="date" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).getFullYear().toString()} stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis domain={[-2, 12]} allowDataOverflow={true} stroke="var(--color-secondary)" fontSize={12} />
                    <Tooltip content={<BaseChartTooltip valueFormatter={(v) => v.toFixed(2)}/>} />
                    <ReferenceArea y1={7} y2={12} fill="var(--color-chart-red)" fillOpacity={0.2} label={{ value: 'Sell Zone', position: 'insideTop', fill: 'var(--color-text)', fontSize: 10, dy:10 }}/>
                    <ReferenceArea y1={-2} y2={0} fill="var(--color-chart-green)" fillOpacity={0.2} label={{ value: 'Buy Zone', position: 'insideBottom', fill: 'var(--color-text)', fontSize: 10, dy: -2 }}/>
                    <defs>
                        <linearGradient id="mvrvZ" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-chart-sky)" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="var(--color-chart-sky)" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="zScore" name="Z-Score" stroke="none" fill="url(#mvrvZ)" />
                    <Line type="monotone" dataKey="zScore" name="Z-Score" stroke="var(--color-chart-sky)" strokeWidth={2} dot={false} />
                </ComposedChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};


export const SOPRChart = () => {
    const data = useMemo(() => generateCyclicData(1825, 1460, 0.4, 1.1, 0.2), []);
    const { chart3DStyle } = useSettings();

    return (
        <ChartWrapper chart3DStyle={chart3DStyle}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5}/>
                    <XAxis dataKey="date" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).getFullYear().toString()} stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis domain={[0.6, 'auto']} stroke="var(--color-secondary)" fontSize={12} />
                    <Tooltip content={<BaseChartTooltip valueFormatter={(v) => v.toFixed(3)}/>} />
                    <ReferenceLine y={1} stroke="var(--color-secondary)" strokeDasharray="4 4" label={{ value: 'Profit / Loss', position: 'insideTopRight', fill: 'var(--color-secondary)', fontSize: 10 }} />
                    <defs>
                        <linearGradient id="soprGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-chart-blue)" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="var(--color-chart-blue)" stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" name="SOPR" stroke="var(--color-chart-blue)" fill="url(#soprGradient)" strokeWidth={2}/>
                </AreaChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export const NUPLChart = () => {
    const data = useMemo(() => generateCyclicData(1825, 1460, 0.6, 0.25, 0.15).map(d => ({...d, value: Math.min(1, Math.max(-0.5, d.value))})), []);
    const { chart3DStyle } = useSettings();
    const zones = [
        { y1: 0.75, y2: 1.1, color: 'var(--color-chart-red)', name: 'Euphoria' },
        { y1: 0.5, y2: 0.75, color: 'var(--color-chart-orange)', name: 'Belief' },
        { y1: 0.25, y2: 0.5, color: 'var(--color-chart-yellow)', name: 'Optimism' },
        { y1: 0, y2: 0.25, color: 'var(--color-chart-sky)', name: 'Hope' },
        { y1: -0.5, y2: 0, color: 'var(--color-chart-blue)', name: 'Capitulation' },
    ];

    return (
        <ChartWrapper chart3DStyle={chart3DStyle}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 15, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5}/>
                    <XAxis dataKey="date" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).getFullYear().toString()} stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis domain={[-0.5, 1]} tickFormatter={(v) => v.toFixed(2)} stroke="var(--color-secondary)" fontSize={12} />
                    <Tooltip content={<BaseChartTooltip valueFormatter={(v) => v.toFixed(3)}/>} />
                    {zones.map(z => <ReferenceArea key={z.name} y1={z.y1} y2={z.y2} fill={z.color} fillOpacity={0.3} label={{ value: z.name, position: 'insideTopLeft', fill: z.color, fontSize: 10, fontWeight: 'bold' }} />)}
                    <Area type="monotone" dataKey="value" name="NUPL" stroke="#ffffff" strokeWidth={2} fill="transparent" />
                </AreaChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export const NVTSChart = () => {
    const priceData = useMemo(() => generatePriceData(1825), []);
    const data = useMemo(() => priceData.map(d => ({...d, nvts: (d.price / d.vol) * 5e10 + Math.random() * 20})), [priceData]);
    const { chart3DStyle } = useSettings();

    return (
        <ChartWrapper chart3DStyle={chart3DStyle}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5}/>
                    <XAxis dataKey="date" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).getFullYear().toString()} stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis yAxisId="left" scale="log" domain={['auto', 'auto']} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 'dataMax + 20']} stroke="var(--color-chart-orange)" fontSize={12} />
                    <Tooltip content={<BaseChartTooltip valueFormatter={(v, name) => name === 'Price' ? `$${v.toFixed(0)}` : v.toFixed(2)} />} />
                    <Legend iconSize={10} wrapperStyle={{fontSize: "12px"}}/>
                    <Area yAxisId="left" type="monotone" dataKey="price" name="Price" stroke="var(--color-secondary)" fill="var(--color-secondary)" fillOpacity={0.2} />
                    <Line yAxisId="right" type="monotone" dataKey="nvts" name="NVTS" stroke="var(--color-chart-orange)" strokeWidth={2} dot={false} />
                </ComposedChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

// --- PRICE & MARKET CAP CHARTS ---

export const TotalMarketCapChart = () => {
    const data = useMemo(() => {
        const d = generatePriceData(1825);
        return d.map(p => ({ date: p.date, "Total Cap": p.price * 4.5e6, "Altcoin Cap": p.price * 2.5e6 }))
    }, []);
    const { chart3DStyle } = useSettings();

    return (
        <ChartWrapper chart3DStyle={chart3DStyle}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5}/>
                    <XAxis dataKey="date" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).getFullYear().toString()} stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis scale="log" domain={['auto', 'auto']} tickFormatter={v => `$${(v/1e12).toFixed(1)}T`} stroke="var(--color-secondary)" fontSize={12} />
                    <Tooltip content={<BaseChartTooltip valueFormatter={v => `$${(v/1e12).toFixed(3)}T`}/>} />
                    <Legend iconSize={10} wrapperStyle={{fontSize: "12px"}}/>
                    <defs>
                        <linearGradient id="totalCap" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-chart-sky)" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="var(--color-chart-sky)" stopOpacity={0.1}/>
                        </linearGradient>
                         <linearGradient id="altCap" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-chart-indigo)" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="var(--color-chart-indigo)" stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="Total Cap" stroke="var(--color-chart-sky)" fill="url(#totalCap)" strokeWidth={2}/>
                    <Area type="monotone" dataKey="Altcoin Cap" stroke="var(--color-chart-indigo)" fill="url(#altCap)" strokeWidth={2}/>
                </AreaChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export const DominanceChart = () => {
    const data = useMemo(() => {
        const d = [];
        const days = 1825;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        for (let i=0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            const btcCycle = 0.55 + Math.sin(i / 1460 * 2 * Math.PI) * 0.15;
            const ethCycle = 0.18 + Math.sin(i / 1000 * 2 * Math.PI + Math.PI) * 0.04;
            const other = 1 - btcCycle - ethCycle;
            d.push({date: date.getTime(), BTC: btcCycle, ETH: ethCycle, Others: other });
        }
        return d;
    }, []);
    const { chart3DStyle } = useSettings();
    
    return (
        <ChartWrapper chart3DStyle={chart3DStyle}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} stackOffset="expand" margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5}/>
                    <XAxis dataKey="date" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).getFullYear().toString()} stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis tickFormatter={v => `${(v * 100).toFixed(0)}%`} stroke="var(--color-secondary)" fontSize={12} />
                    <Tooltip content={<BaseChartTooltip valueFormatter={v => `${(v * 100).toFixed(2)}%`}/>} />
                    <Legend iconSize={10} wrapperStyle={{fontSize: "12px"}}/>
                    <Area type="monotone" dataKey="BTC" stackId="1" stroke="#F7931A" fill="#F7931A" fillOpacity={0.7}/>
                    <Area type="monotone" dataKey="ETH" stackId="1" stroke="var(--color-chart-indigo)" fill="var(--color-chart-indigo)" fillOpacity={0.7}/>
                    <Area type="monotone" dataKey="Others" stackId="1" stroke="var(--color-secondary)" fill="var(--color-secondary)" fillOpacity={0.5}/>
                </AreaChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export const SSRChart = () => {
    const data = useMemo(() => generateCyclicData(1825, 1460, 10, 12, 5), []);
    const { chart3DStyle } = useSettings();

    return (
        <ChartWrapper chart3DStyle={chart3DStyle}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5}/>
                    <XAxis dataKey="date" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).getFullYear().toString()} stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis reversed={true} stroke="var(--color-secondary)" fontSize={12} />
                    <Tooltip content={<BaseChartTooltip valueFormatter={(v) => v.toFixed(2)} />}/>
                    <ReferenceArea y1={0} y2={5} fill="var(--color-chart-green)" fillOpacity={0.2} label={{ value: 'High Buying Power', position: 'insideBottom', fill: 'var(--color-text)', fontSize: 10 }}/>
                    <defs>
                        <linearGradient id="ssrGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-chart-orange)" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="var(--color-chart-orange)" stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" name="SSR" stroke="var(--color-chart-orange)" fill="url(#ssrGrad)" strokeWidth={2}/>
                </AreaChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export const CryptoHeatmap = () => {
    const data = useMemo(() => [
        {t: 'BTC', p:68123, c: 2.5}, {t: 'ETH', p:3500, c: 1.2}, {t: 'SOL', p:160, c: -1.8},
        {t: 'XRP', p:0.52, c: 0.5}, {t: 'DOGE', p:0.15, c: 5.1}, {t: 'ADA', p:0.45, c: -0.1},
        {t: 'SHIB', p:0.000025, c: 3.3}, {t: 'AVAX', p:35, c: -2.4}, {t: 'DOT', p:7.1, c: 1.1},
        {t: 'LINK', p:17.5, c: -0.8}, {t: 'TRX', p:0.11, c: 0.1}, {t: 'BCH', p:450, c: 4.2},
    ], []);

    const getColor = (change) => {
        if (change >= 3) return 'rgba(34, 197, 94, 0.9)';
        if (change > 0) return 'rgba(34, 197, 94, 0.6)';
        if (change > -1) return 'rgba(107, 114, 128, 0.5)';
        if (change > -3) return 'rgba(239, 68, 68, 0.6)';
        return 'rgba(239, 68, 68, 0.9)';
    };

    return (
        <div className="h-64 sm:h-72 p-2 grid grid-cols-4 grid-rows-3 gap-2">
            {data.map(d => (
                <div key={d.t} className={`flex flex-col items-center justify-center rounded-lg text-white p-2 transition-transform duration-300 hover:scale-105 hover:!opacity-100`} style={{backgroundColor: getColor(d.c)}}>
                    <p className="font-bold text-sm sm:text-lg">{d.t}</p>
                    <p className="text-xs sm:text-base font-medium">{d.c.toFixed(1)}%</p>
                </div>
            ))}
        </div>
    );
};

// --- ON-CHAIN SUPPLY ---

export const HODLWavesChart = () => {
    const bands = ['> 5y', '3y-5y', '1y-3y', '6m-1y', '3m-6m', '1m-3m', '< 1m'];
    const colors = [
        'var(--color-chart-indigo)', 
        'var(--color-chart-purple)', 
        'var(--color-chart-blue)', 
        'var(--color-chart-sky)', 
        'var(--color-chart-cyan)', 
        'var(--color-chart-teal)', 
        'var(--color-chart-green)'
    ];
    const data = useMemo(() => {
        const d = [];
        const days = 1825;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        for (let i=0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            const cycle = (1 + Math.sin(i / 1460 * 2 * Math.PI + Math.PI*1.5)) / 2; // 0 to 1
            const point = { date: date.getTime() };
            point[bands[6]] = (0.1 + Math.random()*0.1) * (1-cycle); // < 1m
            point[bands[5]] = 0.05 * (1-cycle); // 1m-3m
            point[bands[4]] = 0.1 * (1-cycle); // 3m-6m
            point[bands[3]] = 0.15 - cycle*0.1; // 6m-1y
            point[bands[2]] = 0.3 + cycle*0.1; // 1y-3y
            point[bands[1]] = 0.2 + cycle*0.1; // 3y-5y
            point[bands[0]] = 0.1 + cycle*0.1; // > 5y
            d.push(point);
        }
        return d;
    }, []);
    const { chart3DStyle } = useSettings();
    const reversedBands = [...bands].reverse();
    const reversedColors = [...colors].reverse();
    
    return (
        <ChartWrapper chart3DStyle={chart3DStyle}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} stackOffset="expand" margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5}/>
                    <XAxis dataKey="date" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).getFullYear().toString()} stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis tickFormatter={v => `${(v * 100).toFixed(0)}%`} stroke="var(--color-secondary)" fontSize={12} />
                    <Tooltip content={<BaseChartTooltip valueFormatter={v => `${(v * 100).toFixed(2)}%`} />} />
                    <Legend iconSize={10} wrapperStyle={{fontSize: "12px"}}/>
                    {reversedBands.map((band, i) => (
                        <Area key={band} type="monotone" dataKey={band} name={band} stackId="1" stroke={reversedColors[i]} fill={reversedColors[i]} fillOpacity={0.8} />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export const RHODLRatioChart = () => {
    const data = useMemo(() => generateCyclicData(1825, 1460, 40000, 45000, 10000), []);
    const { chart3DStyle } = useSettings();
    return (
        <ChartWrapper chart3DStyle={chart3DStyle}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5}/>
                    <XAxis dataKey="date" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).getFullYear().toString()} stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis domain={[0, 'auto']} tickFormatter={(v) => v.toLocaleString()} stroke="var(--color-secondary)" fontSize={12} />
                    <Tooltip content={<BaseChartTooltip valueFormatter={(v) => v.toFixed(2)} />}/>
                    <ReferenceArea y1={80000} y2={100000} fill="var(--color-chart-red)" fillOpacity={0.2} label={{ value: 'Top', position: 'insideTop', fill: 'var(--color-text)', fontSize: 10, dy:10 }}/>
                    <ReferenceArea y1={0} y2={10000} fill="var(--color-chart-green)" fillOpacity={0.2} label={{ value: 'Bottom', position: 'insideBottom', fill: 'var(--color-text)', fontSize: 10, dy:-2 }}/>
                    <defs>
                        <linearGradient id="rhodlGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-chart-pink)" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="var(--color-chart-pink)" stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" name="RHODL" stroke="var(--color-chart-pink)" fill="url(#rhodlGrad)" strokeWidth={2}/>
                </AreaChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
}

export const S2FChart = () => {
    const data = useMemo(() => {
        const d = [];
        let s2fPrice = 1000;
        const days = 4380; // 12 years
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        let price = 1;
        
        for (let i=1; i <= days; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);

            if (i > 365*11) s2fPrice = 1000000;
            else if (i > 365*7) s2fPrice = 100000;
            else if (i > 365*3) s2fPrice = 8000;

            const cycle = Math.sin((i / 1460) * 2 * Math.PI - Math.PI / 2);
            price = s2fPrice * (1 + cycle * 0.8) * (1 + (Math.random() - 0.5) * 0.3);
            if(price < 1) price = 1;

            d.push({date: date.getTime(), price, s2f: s2fPrice });
        }
        return d;
    }, []);
    const { chart3DStyle } = useSettings();

    return (
        <ChartWrapper chart3DStyle={chart3DStyle}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5}/>
                    <XAxis dataKey="date" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).getFullYear().toString()} stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis scale="log" domain={[1, 'auto']} tickFormatter={v => `$${v.toLocaleString()}`} stroke="var(--color-secondary)" fontSize={12} />
                    <Tooltip content={<BaseChartTooltip valueFormatter={v => `$${v.toLocaleString()}`}/>} />
                    <Legend iconSize={10} wrapperStyle={{fontSize: "12px"}}/>
                    <Line type="monotone" dataKey="price" name="Price" stroke="var(--color-chart-sky)" dot={false} strokeWidth={2} />
                    <Line type="stepAfter" dataKey="s2f" name="S2F Model" stroke="var(--color-chart-orange)" strokeDasharray="5 5" dot={false} strokeWidth={2}/>
                </ComposedChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export const PuellMultipleChart = () => {
    const data = useMemo(() => generateCyclicData(1825, 1460, 2, 1.5, 0.8), []);
    const { chart3DStyle } = useSettings();
    return (
        <ChartWrapper chart3DStyle={chart3DStyle}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5}/>
                    <XAxis dataKey="date" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).getFullYear().toString()} stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis domain={[0, 'auto']} stroke="var(--color-secondary)" fontSize={12} />
                    <Tooltip content={<BaseChartTooltip valueFormatter={(v) => v.toFixed(2)} />}/>
                    <ReferenceArea y1={4} y2={10} fill="var(--color-chart-red)" fillOpacity={0.2} label={{ value: 'Sell', position: 'insideTop', fill: 'var(--color-text)', fontSize: 10, dy:10 }}/>
                    <ReferenceArea y1={0} y2={0.5} fill="var(--color-chart-green)" fillOpacity={0.2} label={{ value: 'Buy', position: 'insideBottom', fill: 'var(--color-text)', fontSize: 10, dy:-2 }}/>
                    <defs>
                        <linearGradient id="puellGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-chart-purple)" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="var(--color-chart-purple)" stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" name="Puell Multiple" stroke="var(--color-chart-purple)" fill="url(#puellGrad)" strokeWidth={2}/>
                </AreaChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

// --- TA CHARTS ---

export const BollingerBandsChart = () => {
    const data = useMemo(() => {
        const d = [];
        const prices = [];
        let price = 50000;
        for (let i = 0; i < 365; i++) {
            price += (Math.sin(i / 50) * 1000) + (Math.random() - 0.5) * 3000;
            prices.push(price);
        }

        for (let i = 0; i < 365; i++) {
            const date = new Date();
            date.setDate(date.getDate() - 365 + i);
            if (i < 20) {
                 d.push({ date: date.getTime(), price: prices[i], band: [null, null] });
                 continue;
            }
            const slice = prices.slice(i-20, i);
            const sma = slice.reduce((a, b) => a + b, 0) / 20;
            const stdDev = Math.sqrt(slice.map(x => Math.pow(x - sma, 2)).reduce((a, b) => a + b, 0) / 20);
            d.push({ date: date.getTime(), price: prices[i], band: [sma - 2 * stdDev, sma + 2 * stdDev] });
        }
        return d;
    }, []);
    const { chart3DStyle } = useSettings();

    return (
        <ChartWrapper chart3DStyle={chart3DStyle}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5}/>
                    <XAxis dataKey="date" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()} stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis scale="log" domain={['auto', 'auto']} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} stroke="var(--color-secondary)" fontSize={12} />
                    <Tooltip content={<BaseChartTooltip valueFormatter={(v) => Array.isArray(v) ? `$${Math.round(v[0])} - $${Math.round(v[1])}` :`$${Math.round(v)}`} />} />
                    <Legend iconSize={10} wrapperStyle={{fontSize: "12px"}}/>
                    <Area dataKey="band" name="Bands" stroke="var(--color-chart-indigo)" fill="var(--color-chart-indigo)" fillOpacity={0.2} isAnimationActive={false} />
                    <Line type="monotone" dataKey="price" name="Price" stroke="var(--color-chart-sky)" dot={false} strokeWidth={2}/>
                </ComposedChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export const GoldenDeathCrossChart = () => {
    const data = useMemo(() => {
        let price = 50000;
        const prices = [];
        for(let i=0; i<500; i++) {
            price += (Math.sin(i / 80) * 1500) + (Math.random()-0.5) * 3000;
            prices.push(price);
        }
        return prices.map((p, i) => {
            const date = new Date();
            date.setDate(date.getDate() - 500 + i);
            const ma50 = i < 50 ? null : prices.slice(i-50, i).reduce((a,b)=>a+b,0)/50;
            const ma200 = i < 200 ? null : prices.slice(i-200, i).reduce((a,b)=>a+b,0)/200;
            return {date: date.getTime(), price:p, ma50, ma200};
        });
    }, []);
    const { chart3DStyle } = useSettings();
    
    return (
        <ChartWrapper chart3DStyle={chart3DStyle}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5}/>
                    <XAxis dataKey="date" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()} stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis scale="log" domain={['auto', 'auto']} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} stroke="var(--color-secondary)" fontSize={12} />
                    <Tooltip content={<BaseChartTooltip valueFormatter={(v) => v ? `$${v.toFixed(0)}` : 'N/A'}/>} />
                    <Legend iconSize={10} wrapperStyle={{fontSize: "12px"}}/>
                    <Area type="monotone" dataKey="price" name="Price" stroke="var(--color-secondary)" fill="var(--color-secondary)" fillOpacity={0.1} />
                    <Line type="monotone" dataKey="ma50" name="50 MA" stroke="var(--color-chart-yellow)" dot={false} strokeWidth={2}/>
                    <Line type="monotone" dataKey="ma200" name="200 MA" stroke="var(--color-chart-purple)" dot={false} strokeWidth={2}/>
                </ComposedChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export const RSIChart = () => {
    const data = useMemo(() => generateCyclicData(365, 90, 30, 50, 10), []);
    const { chart3DStyle } = useSettings();
    
    return (
        <ChartWrapper chart3DStyle={chart3DStyle}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5}/>
                    <XAxis dataKey="date" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()} stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis domain={[0, 100]} stroke="var(--color-secondary)" fontSize={12} />
                    <Tooltip content={<BaseChartTooltip valueFormatter={(v) => v.toFixed(2)} />}/>
                    <ReferenceLine y={70} stroke="var(--color-chart-red)" strokeDasharray="4 4" label={{ value: 'Overbought', position: 'insideTopRight', fill: 'var(--color-chart-red)', fontSize: 10 }} />
                    <ReferenceLine y={30} stroke="var(--color-chart-green)" strokeDasharray="4 4" label={{ value: 'Oversold', position: 'insideBottomRight', fill: 'var(--color-chart-green)', fontSize: 10 }} />
                     <defs>
                        <linearGradient id="rsiGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-chart-purple)" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="var(--color-chart-purple)" stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" name="RSI" stroke="var(--color-chart-purple)" fill="url(#rsiGrad)" strokeWidth={2}/>
                </AreaChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export const MACDChart = () => {
    const data = useMemo(() => {
        const d = [];
        let macd = 0;
        let signal = 0;
        for (let i=0; i < 365; i++) {
            const date = new Date();
            date.setDate(date.getDate() - 365 + i);
            macd += Math.sin(i / 50 * Math.PI) * 50 + (Math.random() - 0.5) * 20;
            signal = macd * 0.8 + signal * 0.2; // simplified signal line
            d.push({date: date.getTime(), macd, signal, histogram: macd - signal});
        }
        return d;
    }, []);
    const { chart3DStyle } = useSettings();

    return (
        <ChartWrapper chart3DStyle={chart3DStyle}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5}/>
                    <XAxis dataKey="date" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()} stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis stroke="var(--color-secondary)" fontSize={12} />
                    <Tooltip content={<BaseChartTooltip valueFormatter={(v) => v.toFixed(2)}/>}/>
                    <Legend iconSize={10} wrapperStyle={{fontSize: "12px"}}/>
                    <Bar dataKey="histogram" name="Histogram" barSize={5}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.histogram > 0 ? 'var(--color-chart-green)' : 'var(--color-chart-red)'} opacity={0.6}/>
                        ))}
                    </Bar>
                    <Line type="monotone" dataKey="macd" name="MACD" stroke="var(--color-chart-blue)" dot={false} strokeWidth={2}/>
                    <Line type="monotone" dataKey="signal" name="Signal" stroke="var(--color-chart-orange)" dot={false} strokeWidth={2}/>
                </ComposedChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

// --- ROI CHARTS ---

export const MonthlyReturnsChart = () => {
    const data = useMemo(() => {
        const d = {};
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        for(let y=2020; y<=2024; y++){
            d[y] = months.map(m => ({month:m, return: (Math.random() - 0.4) * 50}));
        }
        return d;
    }, []);
    
    const getColor = (r) => {
        if (r > 20) return 'bg-green-600/90'; if (r > 10) return 'bg-green-600/70'; if (r > 0) return 'bg-green-600/50';
        if (r > -10) return 'bg-red-600/50'; if (r > -20) return 'bg-red-600/70'; return 'bg-red-600/90';
    }

    return (
        <div className="h-64 sm:h-72 p-2 text-xs text-white overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="p-1 border border-brand-border">Year</th>
                        {data[2020].map(m => <th key={m.month} className="p-1 border border-brand-border w-1/12">{m.month}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(data).reverse().map(y => (
                        <tr key={y}>
                            <td className="p-1 border border-brand-border font-bold text-center">{y}</td>
                            {data[y].map((m, i) => (
                                <td key={i} className={`p-1 border border-brand-border text-center font-medium transition-colors duration-200 ${getColor(m.return)}`}>
                                    {m.return.toFixed(1)}%
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const AltcoinSeasonIndexChart = () => {
    const data = useMemo(() => generateCyclicData(730, 240, 45, 50, 20), []);
    const { chart3DStyle } = useSettings();
    return (
        <ChartWrapper chart3DStyle={chart3DStyle}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5}/>
                    <XAxis dataKey="date" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()} stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis domain={[0, 100]} stroke="var(--color-secondary)" fontSize={12} />
                    <Tooltip content={<BaseChartTooltip valueFormatter={(v) => v.toFixed(0)}/>}/>
                    <ReferenceArea y1={75} y2={100} fill="var(--color-chart-green)" fillOpacity={0.2} label={{ value: 'Altcoin Season', position: 'insideTop', fill: 'var(--color-text)', fontSize: 10, dy:10 }}/>
                    <ReferenceArea y1={0} y2={25} fill="var(--color-chart-orange)" fillOpacity={0.2} label={{ value: 'Bitcoin Season', position: 'insideBottom', fill: 'var(--color-text)', fontSize: 10, dy:-2 }}/>
                    <defs>
                        <linearGradient id="altSeasonGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-chart-teal)" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="var(--color-chart-teal)" stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" name="Index" stroke="var(--color-chart-teal)" fill="url(#altSeasonGrad)" strokeWidth={2}/>
                </AreaChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export const ROIAfterBottomChart = () => {
    const data = useMemo(() => {
        const cycles = {
            "2015-2018": (i) => Math.pow(i, 1.8) * 0.1,
            "2018-2021": (i) => Math.pow(i, 1.7) * 0.2,
            "2022-Now": (i) => Math.pow(i, 1.6) * 0.4
        };
        const d = [];
        for(let i=1; i<1095; i++){
            const point = {days: i};
            Object.keys(cycles).forEach(c => point[c] = cycles[c](i));
            d.push(point);
        }
        return d;
    }, []);
    const { chart3DStyle } = useSettings();
    const colors = ["var(--color-chart-sky)", "var(--color-chart-indigo)", "var(--color-chart-orange)"];

    return (
        <ChartWrapper chart3DStyle={chart3DStyle}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5}/>
                    <XAxis dataKey="days" name="Days After Bottom" stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis scale="log" domain={[1, 'auto']} tickFormatter={v => `${v.toFixed(0)}x`} stroke="var(--color-secondary)" fontSize={12} />
                    <Tooltip content={<BaseChartTooltip valueFormatter={v => `${v.toFixed(2)}x`}/>} />
                    <Legend iconSize={10} wrapperStyle={{fontSize: "12px"}}/>
                    {Object.keys(data[0]).filter(k=>k!=='days').map((c, i) => <Line key={c} type="monotone" dataKey={c} name={c} stroke={colors[i]} dot={false} strokeWidth={2}/>)}
                </LineChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export const BestDayToDCAChart = () => {
    const data = useMemo(() => [
        {day: 'Mon', roi: 15.2}, {day: 'Tue', roi: 16.1}, {day: 'Wed', roi: 15.8},
        {day: 'Thu', roi: 17.5}, {day: 'Fri', roi: 14.9}, {day: 'Sat', roi: 18.2},
        {day: 'Sun', roi: 20.1}
    ], []);
    const { chart3DStyle } = useSettings();
    return (
        <ChartWrapper chart3DStyle={chart3DStyle}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5}/>
                    <XAxis dataKey="day" stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis tickFormatter={v => `${v}%`} stroke="var(--color-secondary)" fontSize={12} />
                    <Tooltip content={<BaseChartTooltip valueFormatter={v => `${v}%`}/>} />
                    <Bar dataKey="roi" name="Average ROI">
                         {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.roi > 19 ? 'var(--color-chart-green)' : 'var(--color-chart-sky)'} opacity={0.8}/>
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

// --- DERIVATIVES CHARTS ---

export const OpenInterestChart = () => {
    const priceData = useMemo(() => generatePriceData(365), []);
    const data = useMemo(() => priceData.map(d => ({ ...d, "Open Interest": d.vol * (1.5 + Math.random()) })), [priceData]);
    const { chart3DStyle } = useSettings();

    return (
        <ChartWrapper chart3DStyle={chart3DStyle}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5}/>
                    <XAxis dataKey="date" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()} stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis yAxisId="left" scale="log" domain={['auto', 'auto']} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} stroke="var(--color-secondary)" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={v => `$${(v/1e9).toFixed(1)}B`} stroke="var(--color-chart-pink)" fontSize={12} />
                    <Tooltip content={<BaseChartTooltip valueFormatter={(value, name) => {
                      if (name === 'price') return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
                      if (name === 'Open Interest') return `$${(value / 1e9).toFixed(2)}B`;
                      return value;
                    }} />} />
                    <Legend iconSize={10} wrapperStyle={{fontSize: "12px"}}/>
                    <Line yAxisId="left" type="monotone" dataKey="price" name="Price" stroke="var(--color-secondary)" dot={false} strokeOpacity={0.8} />
                    <defs>
                        <linearGradient id="oiGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-chart-pink)" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="var(--color-chart-pink)" stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    <Area yAxisId="right" type="monotone" dataKey="Open Interest" name="Open Interest" stroke="var(--color-chart-pink)" fill="url(#oiGrad)" strokeWidth={2}/>
                </ComposedChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};
