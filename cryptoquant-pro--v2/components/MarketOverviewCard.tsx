
import React from 'react';

interface MarketOverviewCardProps {
  name: string;
  ticker: string;
  price: number;
  change: number;
  marketCap: number;
  icon: React.ReactNode;
  color: string;
}

const MarketOverviewCard: React.FC<MarketOverviewCardProps> = ({
  name,
  ticker,
  price,
  change,
  marketCap,
  icon,
  color,
}) => {
  const isPositive = change >= 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  const formatLargeValue = (value: number, isCurrency = false) => {
    const prefix = isCurrency ? '$' : '';
    if (value >= 1e12) {
      return `${prefix}${(value / 1e12).toFixed(2)}T`;
    }
    if (value >= 1e9) {
      return `${prefix}${(value / 1e9).toFixed(2)}B`;
    }
    if (value >= 1e6) {
      return `${prefix}${(value / 1e6).toFixed(2)}M`;
    }
    return `${prefix}${value.toLocaleString()}`;
  };

  const displayValue = name === 'Total Market Cap' ? formatLargeValue(price, true) : formatCurrency(price);

  return (
    <div className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-lg hover:shadow-brand-primary/20 transition-all duration-300 group relative overflow-hidden">
        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-purple to-brand-danger opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl"></div>
        <div className="absolute -inset-px bg-gradient-to-r from-brand-primary via-brand-purple to-brand-danger rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                <div className={color}>{icon}</div>
                <div className="ml-3">
                    <h3 className="text-lg font-semibold text-brand-text">{name}</h3>
                    <p className="text-sm text-brand-secondary">{ticker}</p>
                </div>
                </div>
                <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isPositive ? 'bg-green-500/20 text-brand-success' : 'bg-red-500/20 text-brand-danger'
                }`}
                >
                {isPositive ? '+' : ''}
                {change.toFixed(2)}%
                </div>
            </div>
            <div>
                <p className="text-3xl font-bold text-brand-text">{displayValue}</p>
                <p className="text-sm text-brand-secondary mt-1">
                Market Cap: {formatLargeValue(marketCap, true)}
                </p>
            </div>
        </div>
    </div>
  );
};

export default React.memo(MarketOverviewCard);