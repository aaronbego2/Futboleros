import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('futbol-theme');
    return (saved as Theme) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('futbol-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme colors
export const themeColors = {
  dark: {
    bg: '#1a1a1a',
    bgSecondary: '#121212',
    primary: '#f18904', // Orange
    secondary: '#ff0000', // Red
    text: '#ffffff',
    textMuted: 'rgba(255, 255, 255, 0.6)',
    border: 'rgba(241, 137, 4, 0.2)',
    glass: 'rgba(255, 255, 255, 0.08)',
  },
  light: {
    bg: '#f5f0fa',
    bgSecondary: '#ffffff',
    primary: '#f18904', // Orange
    secondary: '#ff0000', // Red
    text: '#2b193e',
    textMuted: 'rgba(43, 25, 62, 0.6)',
    border: 'rgba(241, 137, 4, 0.3)',
    glass: 'rgba(43, 25, 62, 0.08)',
  }
};
