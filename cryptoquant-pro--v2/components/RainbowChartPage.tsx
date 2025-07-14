import React from 'react';
import InteractiveRainbowChart from './InteractiveRainbowChart';

const RainbowChartPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-brand-text mb-2">Bitcoin Rainbow Chart</h2>
        <p className="text-brand-secondary max-w-4xl">
          A long-term valuation tool that uses a logarithmic growth curve to forecast potential price direction. It consists of colored bands that indicate market sentiment from 'Fire Sale' (undervalued) to 'Maximum Bubble Territory' (overvalued). Use the toggle to switch between the classic rainbow view and a candlestick overlay.
        </p>
      </div>
      <InteractiveRainbowChart />
    </div>
  );
};

export default RainbowChartPage;
