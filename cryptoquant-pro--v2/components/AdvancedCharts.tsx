import React from 'react';
import { chartCategories } from '../data/chartList';
import { ChartInfo } from '../types';
import InfoTooltip from './InfoTooltip';

const ChartCard: React.FC<{ chartInfo: ChartInfo }> = ({ chartInfo }) => {
    const ChartComponent = chartInfo.component;
    return (
        <div className="bg-brand-surface border border-brand-border rounded-xl shadow-lg flex flex-col overflow-hidden h-full group transition-all duration-300 hover:border-brand-primary/50 hover:shadow-brand-primary/20 hover:scale-[1.02]">
            <div className="p-4 md:p-6 border-b border-brand-border">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-brand-text">{chartInfo.name}</h3>
                    <InfoTooltip text={chartInfo.description} />
                </div>
            </div>
            <div className="flex-grow p-1 sm:p-2 md:p-4">
                <ChartComponent />
            </div>
        </div>
    );
};


const AdvancedCharts: React.FC = () => {
  return (
    <div className="space-y-12">
      {chartCategories.map((category) => (
        <section key={category.name} aria-labelledby={`${category.name}-heading`}>
          <h2 id={`${category.name}-heading`} className="text-3xl font-bold text-brand-text mb-6 pb-2 border-b-2 border-brand-primary/50">{category.name}</h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {category.charts.map((chartInfo) => (
                <ChartCard key={chartInfo.id} chartInfo={chartInfo} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default AdvancedCharts;