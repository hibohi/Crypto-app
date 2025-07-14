
import React from 'react';
import MarketOverviewCard from './MarketOverviewCard';
import RiskTable from './RiskTable';
import { BitcoinIcon } from './icons/BitcoinIcon';
import { EthereumIcon } from './icons/EthereumIcon';
import BitcoinPriceChart from './BitcoinPriceChart';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Row: Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MarketOverviewCard
          name="Bitcoin"
          ticker="BTC"
          price={68450.75}
          change={2.35}
          marketCap={1.35 * 1e12}
          icon={<BitcoinIcon className="h-10 w-10" />}
          color="text-orange-400"
        />
        <MarketOverviewCard
          name="Ethereum"
          ticker="ETH"
          price={3560.21}
          change={-1.12}
          marketCap={427.8 * 1e9}
          icon={<EthereumIcon className="h-10 w-10" />}
          color="text-indigo-400"
        />
         <MarketOverviewCard
          name="Total Market Cap"
          ticker="TOTAL"
          price={2.52 * 1e12}
          change={1.78}
          marketCap={2.52 * 1e12}
          icon={<div className="text-2xl font-bold text-brand-primary">Σ</div>}
          color="text-brand-primary"
        />
      </div>

      {/* Main Content: Price Chart and Risk Table */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <BitcoinPriceChart />
        </div>
        <div className="lg:col-span-2">
          <RiskTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;