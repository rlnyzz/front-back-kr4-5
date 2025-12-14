import React, { useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import useLocalStorage from '../hooks/useLocalStorage';
import { lightTheme, darkTheme } from '../theme/theme';

const ThemeProviderWrapper = ({ children }) => {
  const [themeMode, setThemeMode] = useLocalStorage('theme-mode', 'light');

  const theme = useMemo(() => {
    return themeMode === 'dark' ? darkTheme : lightTheme;
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Передаём themeMode и toggleTheme через контекст или клонирование детей
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { themeMode, toggleTheme });
    }
    return child;
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {childrenWithProps}
    </ThemeProvider>
  );
};

export default ThemeProviderWrapper;