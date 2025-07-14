
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { DcaResult, DcaHistoryPoint } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useSettings } from '../contexts/SettingsContext';

const DcaSimulator: React.FC = () => {
  const [investment, setInvestment] = useState('100');
  const [frequency, setFrequency] = useState('weekly');
  const [startDate, setStartDate] = useState('2021-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<DcaResult | null>(null);
  const [history, setHistory] = useState<DcaHistoryPoint[]>([]);
  const { chart3DStyle } = useSettings();
  const is3D = chart3DStyle !== 'off';
  const chartClass = is3D ? `chart-3d-${chart3DStyle}` : '';

  const runSimulation = useCallback((
    currentInvestment: string,
    currentFrequency: string,
    currentStartDate: string,
    currentEndDate: string
  ) => {
    const start = new Date(currentStartDate);
    const end = new Date(currentEndDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      alert("Please enter valid start and end dates.");
      return;
    }
    const invAmount = parseFloat(currentInvestment);
    if (isNaN(invAmount) || invAmount <= 0) {
      alert("Please enter a valid investment amount.");
      return;
    }

    let currentDate = new Date(start);
    let totalInvested = 0;
    let totalTokens = 0;
    let numberOfInvestments = 0;
    const simulationHistory: DcaHistoryPoint[] = [];

    const initialPrice = 47000;
    const priceVolatility = 0.8;

    while (currentDate <= end) {
        const timeDiff = (currentDate.getTime() - new Date('2021-01-01').getTime()) / (1000 * 3600 * 24);
        const price = initialPrice * (1 + Math.sin(timeDiff / 100) * priceVolatility + (Math.random() - 0.5) * 0.2);

        totalInvested += invAmount;
        totalTokens += invAmount / price;
        numberOfInvestments++;
        
        const portfolioValue = totalTokens * price;
        simulationHistory.push({
            date: currentDate.toISOString().split('T')[0],
            totalInvested,
            portfolioValue,
            price
        });

        if (currentFrequency === 'daily') {
            currentDate.setDate(currentDate.getDate() + 1);
        } else if (currentFrequency === 'weekly') {
            currentDate.setDate(currentDate.getDate() + 7);
        } else if (currentFrequency === 'monthly') {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
    }

    if (simulationHistory.length === 0) {
        setResult(null);
        setHistory([]);
        return;
    }

    const finalTimeDiff = (end.getTime() - new Date('2021-01-01').getTime()) / (1000 * 3600 * 24);
    const finalPrice = initialPrice * (1 + Math.sin(finalTimeDiff / 100) * priceVolatility);
    const finalValue = totalTokens * finalPrice;
    const roi = totalInvested > 0 ? ((finalValue - totalInvested) / totalInvested) * 100 : 0;
    const averagePrice = totalTokens > 0 ? totalInvested / totalTokens : 0;

    setResult({ totalInvested, finalValue, roi, numberOfInvestments, averagePrice });
    setHistory(simulationHistory);

  }, []);

  const handleSimulate = () => {
    runSimulation(investment, frequency, startDate, endDate);
  };

  const handleTimeframeSelect = (months: number) => {
    const end = new Date();
    const start = new Date(end);
    start.setMonth(start.getMonth() - months);
    
    const newStartDate = start.toISOString().split('T')[0];
    const newEndDate = end.toISOString().split('T')[0];

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    runSimulation(investment, frequency, newStartDate, newEndDate);
  };
  
  const resultDisplay = useMemo(() => {
    if (!result) return null;
    const isGain = result.roi >= 0;

    return (
        <div className="mt-8 p-6 bg-brand-surface border border-brand-border rounded-xl animate-fade-in">
            <h3 className="text-xl font-semibold text-brand-text mb-4">Simulation Results</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-brand-secondary">Total Invested</p>
                    <p className="text-xl font-bold text-brand-text">${result.totalInvested.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-brand-secondary">Final Portfolio Value</p>
                    <p className="text-xl font-bold text-brand-text">${result.finalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className={`p-4 rounded-lg col-span-2 md:col-span-1 ${isGain ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <p className="text-sm text-brand-secondary">Return on Investment</p>
                    <p className={`text-xl font-bold ${isGain ? 'text-brand-success' : 'text-brand-danger'}`}>{result.roi.toFixed(2)}%</p>
                </div>
            </div>
        </div>
    )
  }, [result]);
  
  const DcaChart = () => {
    if (history.length === 0) return null;

    return (
        <div className={`mt-8 bg-brand-surface border border-brand-border rounded-xl p-4 md:p-6 shadow-lg h-96 animate-fade-in chart-container ${chartClass}`}>
            <h3 className="text-lg font-semibold text-brand-text mb-4">Portfolio Growth</h3>
            <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={history} margin={{ top: 5, right: 20, left: 20, bottom: 20 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#58A6FF" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#58A6FF" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B949E" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B949E" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="date" stroke="var(--color-secondary)" tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', {year: 'numeric', month: 'short'})} />
                    <YAxis stroke="var(--color-secondary)" tickFormatter={(v) => `$${(v/1000).toLocaleString()}k`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--color-surface)', 
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)'
                      }}
                      formatter={(value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    />
                    <Legend wrapperStyle={{ color: 'var(--color-secondary)'}} />
                    <Area type="monotone" dataKey="portfolioValue" name="Portfolio Value" stroke="#58A6FF" fill="url(#colorValue)" strokeWidth={2} />
                    <Area type="monotone" dataKey="totalInvested" name="Total Invested" stroke="#8B949E" fill="url(#colorInvested)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
  }

  const timePresets = [
    { label: '1M', months: 1 },
    { label: '6M', months: 6 },
    { label: '1Y', months: 12 },
    { label: '3Y', months: 36 },
  ];

  return (
    <div className="max-w-4xl mx-auto">
        <div className="bg-brand-surface border border-brand-border rounded-xl p-6 md:p-8 shadow-lg">
            <h2 className="text-xl font-semibold text-brand-text mb-6">Configure Your DCA Strategy for Bitcoin</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                    <label htmlFor="investment" className="block text-sm font-medium text-brand-secondary mb-2">Investment Amount ($)</label>
                    <input type="number" id="investment" value={investment} onChange={e => setInvestment(e.target.value)} className="w-full bg-gray-800/50 border border-brand-border rounded-lg px-3 py-2 text-brand-text focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                </div>
                <div>
                    <label htmlFor="frequency" className="block text-sm font-medium text-brand-secondary mb-2">Frequency</label>
                    <select id="frequency" value={frequency} onChange={e => setFrequency(e.target.value)} className="w-full bg-gray-800/50 border border-brand-border rounded-lg px-3 py-2 text-brand-text focus:ring-2 focus:ring-brand-primary focus:outline-none">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-brand-secondary mb-2">Start Date</label>
                    <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-gray-800/50 border border-brand-border rounded-lg px-3 py-2 text-brand-text focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-brand-secondary mb-2">End Date</label>
                    <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-gray-800/50 border border-brand-border rounded-lg px-3 py-2 text-brand-text focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                 <button onClick={handleSimulate} className="bg-brand-primary text-white font-bold py-2 px-8 rounded-lg hover:bg-blue-500 transition-colors duration-300 shadow-lg hover:shadow-brand-primary/40">
                    Simulate Strategy
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-brand-secondary">Or use presets:</span>
                  {timePresets.map(preset => (
                    <button key={preset.label} onClick={() => handleTimeframeSelect(preset.months)} className="bg-gray-700/60 text-brand-secondary font-medium py-2 px-3 rounded-lg hover:bg-gray-600 hover:text-brand-text transition-colors duration-200">
                        {preset.label}
                    </button>
                  ))}
                </div>
            </div>
        </div>
        {resultDisplay}
        <DcaChart />
    </div>
  );
};

export default DcaSimulator;