import React from 'react';
import { View } from '../types';
import { DashboardIcon } from './icons/DashboardIcon';
import { SimulatorIcon } from './icons/SimulatorIcon';
import { InsightsIcon } from './icons/InsightsIcon';
import { AnalyticsIcon } from './icons/AnalyticsIcon';
import { RainbowIcon } from './icons/RainbowIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { ChartGalleryIcon } from './icons/ChartGalleryIcon';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-brand-primary text-white'
        : 'text-brand-secondary hover:bg-brand-surface hover:text-brand-text'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <aside className="w-64 bg-brand-surface border-r border-brand-border flex-shrink-0 p-4 flex flex-col">
      <div className="flex items-center mb-8 px-2">
        <AnalyticsIcon className="h-8 w-8 text-brand-primary" />
        <h1 className="ml-2 text-xl font-bold text-brand-text">CryptoQuant</h1>
      </div>
      <nav className="flex flex-col space-y-2">
        <NavItem
          icon={<DashboardIcon className="h-5 w-5" />}
          label="Dashboard"
          isActive={currentView === 'dashboard'}
          onClick={() => setCurrentView('dashboard')}
        />
        <NavItem
          icon={<ChartGalleryIcon className="h-5 w-5" />}
          label="Advanced Charts"
          isActive={currentView === 'advanced-charts'}
          onClick={() => setCurrentView('advanced-charts')}
        />
         <NavItem
          icon={<RainbowIcon className="h-5 w-5" />}
          label="Rainbow Chart"
          isActive={currentView === 'rainbow-chart'}
          onClick={() => setCurrentView('rainbow-chart')}
        />
        <NavItem
          icon={<SimulatorIcon className="h-5 w-5" />}
          label="DCA Simulator"
          isActive={currentView === 'dca-simulator'}
          onClick={() => setCurrentView('dca-simulator')}
        />
        <NavItem
          icon={<InsightsIcon className="h-5 w-5" />}
          label="AI Insights"
          isActive={currentView === 'market-insights'}
          onClick={() => setCurrentView('market-insights')}
        />
      </nav>
      <div className="mt-auto">
        <nav className="flex flex-col space-y-2 pt-4 border-t border-brand-border">
            <NavItem
              icon={<SettingsIcon className="h-5 w-5" />}
              label="Settings"
              isActive={currentView === 'settings'}
              onClick={() => setCurrentView('settings')}
            />
        </nav>
        <div className="pt-4 text-center text-xs text-brand-secondary">
            <p>&copy; 2024 CryptoQuant Pro</p>
            <p>Data is for illustrative purposes.</p>
        </div>
      </div>
    </aside>
  );
};

export default React.memo(Sidebar);