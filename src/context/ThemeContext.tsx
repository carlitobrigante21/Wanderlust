import { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';

import type { ThemeMode, ThemeState } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

const defaultThemeState: ThemeState = {
  theme: 'light',
  toggleTheme: () => undefined,
  setTheme: () => undefined,
};

const ThemeContext = createContext<ThemeState>(defaultThemeState);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps): JSX.Element => {
  const [theme, setTheme, removeTheme] = useLocalStorage<ThemeMode>('wanderlust-theme', 'light');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
  }, [theme]);

  const toggleTheme = (): void => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  const resetTheme = (): void => {
    removeTheme();
  };

  const value = useMemo<ThemeState>(
    () => ({
      theme,
      toggleTheme,
      setTheme,
    }),
    [theme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeState => useContext(ThemeContext);

export default ThemeContext;
