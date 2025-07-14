import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Chart3DStyle } from '../types';

const Settings: React.FC = () => {
    const { theme, setTheme, chart3DStyle, setChart3DStyle } = useSettings();

    const chartStyles: { id: Chart3DStyle, label: string }[] = [
        { id: 'off', label: 'Off' },
        { id: 'subtle', label: 'Subtle Tilt' },
        { id: 'iso', label: 'Isometric' },
    ]

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-brand-surface border border-brand-border rounded-xl p-6 md:p-8 shadow-lg">
                <h2 className="text-xl font-semibold text-brand-text mb-6">Appearance Settings</h2>

                {/* Theme Setting */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-md font-medium text-brand-text">Theme</h3>
                        <p className="text-sm text-brand-secondary">Choose between a light or dark interface.</p>
                    </div>
                    <div className="flex items-center bg-gray-700/50 rounded-lg p-1">
                        <button
                            onClick={() => setTheme('light')}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors w-20 ${theme === 'light' ? 'bg-brand-primary text-white shadow' : 'text-brand-secondary hover:bg-gray-600'}`}
                        >
                            Light
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors w-20 ${theme === 'dark' ? 'bg-brand-primary text-white shadow' : 'text-brand-secondary hover:bg-gray-600'}`}
                        >
                            Dark
                        </button>
                    </div>
                </div>

                <hr className="my-6 border-brand-border" />

                {/* 3D Chart View Setting */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-md font-medium text-brand-text">3D Chart Style</h3>
                        <p className="text-sm text-brand-secondary">Adds a perspective shift to charts for a 3D effect.</p>
                    </div>
                     <div className="flex items-center bg-gray-700/50 rounded-lg p-1">
                        {chartStyles.map(style => (
                            <button
                                key={style.id}
                                onClick={() => setChart3DStyle(style.id)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors w-24 ${chart3DStyle === style.id ? 'bg-brand-primary text-white shadow' : 'text-brand-secondary hover:bg-gray-600'}`}
                            >
                                {style.label}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
            
            <div className="bg-brand-surface border border-brand-border rounded-xl p-6 md:p-8 shadow-lg">
                <h2 className="text-xl font-semibold text-brand-text mb-6">Data & Accessibility</h2>
                 <p className="text-sm text-brand-secondary">More settings for data sources, notifications, and accessibility features will be available here soon.</p>
            </div>
        </div>
    );
};

export default Settings;