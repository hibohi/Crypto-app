import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { Chart3DStyle } from '../types';

type Theme = 'light' | 'dark';

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  chart3DStyle: Chart3DStyle;
  setChart3DStyle: (style: Chart3DStyle) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        return (localStorage.getItem('theme') as Theme) || 'dark';
    }
    return 'dark';
  });
  
  const [chart3DStyle, set3DStyleState] = useState<Chart3DStyle>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        return (localStorage.getItem('chart3DStyle') as Chart3DStyle) || 'off';
    }
    return 'off';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const setChart3DStyle = (value: Chart3DStyle) => {
    set3DStyleState(value);
    localStorage.setItem('chart3DStyle', value);
  }

  const setTheme = (value: Theme) => {
    setThemeState(value);
  }

  const value = useMemo(() => ({
    theme,
    setTheme,
    chart3DStyle,
    setChart3DStyle,
  }), [theme, chart3DStyle]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};