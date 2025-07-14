import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DcaSimulator from './components/DcaSimulator';
import MarketInsights from './components/MarketInsights';
import AdvancedCharts from './components/AdvancedCharts';
import RainbowChartPage from './components/RainbowChartPage';
import Settings from './components/Settings';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'advanced-charts':
        return <AdvancedCharts />;
      case 'rainbow-chart':
        return <RainbowChartPage />;
      case 'dca-simulator':
        return <DcaSimulator />;
      case 'market-insights':
        return <MarketInsights />;
       case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };
  
  const viewTitles: Record<View, string> = {
    'dashboard': 'Market Dashboard',
    'advanced-charts': 'Advanced Charts',
    'rainbow-chart': 'Bitcoin Rainbow Chart',
    'dca-simulator': 'DCA Simulator',
    'market-insights': 'AI Market Insights',
    'settings': 'Settings'
  };

  return (
    <div className="flex h-screen bg-brand-bg text-brand-text font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={viewTitles[currentView]} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;