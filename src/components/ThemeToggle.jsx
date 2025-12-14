import React from 'react';
import {
  IconButton,
  Tooltip,
  useTheme,
  Box,
} from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';

const ThemeToggle = ({ mode, onToggle }) => {
  const theme = useTheme();

  return (
    <Tooltip title={mode === 'light' ? 'Тёмная тема' : 'Светлая тема'}>
      <IconButton
        onClick={onToggle}
        sx={{
          color: theme.palette.mode === 'dark' ? 'warning.main' : 'primary.main',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 167, 38, 0.1)' 
            : 'rgba(25, 118, 210, 0.1)',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 167, 38, 0.2)' 
              : 'rgba(25, 118, 210, 0.2)',
          },
          transition: 'all 0.3s ease',
          p: 1.5,
          borderRadius: 2,
        }}
        aria-label="Переключить тему"
      >
        {mode === 'light' ? (
          <DarkModeIcon sx={{ fontSize: '1.5rem' }} />
        ) : (
          <LightModeIcon sx={{ fontSize: '1.5rem' }} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;