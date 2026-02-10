import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('dark');

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('app_theme') as ThemeType | null;
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
    } catch (e) {
      setTheme('dark');
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('app_theme', theme);
    } catch (e) {
      console.warn('Failed to save theme preference');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const colors = theme === 'dark' ? {
    primary: '#10b981', // Emerald - Islamic green
    secondary: '#f59e0b', // Amber - Islamic gold
    accent: '#8b5cf6', // Violet for accents
    background: '#0f172a', // Very dark slate (almost black)
    surface: '#1e293b', // Dark slate surface
    text: '#f1f5f9', // Light slate text
    textSecondary: '#cbd5e1', // Medium slate text
    border: '#334155', // Dark slate border
    success: '#10b981', // Emerald
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red
  } : {
    primary: '#059669', // Darker emerald for light mode
    secondary: '#d97706', // Darker amber for light mode
    accent: '#7c3aed', // Darker violet
    background: '#f8fafc', // Light background
    surface: '#ffffff', // White surface
    text: '#1e293b', // Dark text
    textSecondary: '#64748b', // Medium text
    border: '#e2e8f0', // Light border
    success: '#059669', // Emerald
    warning: '#d97706', // Amber
    error: '#dc2626', // Red
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
