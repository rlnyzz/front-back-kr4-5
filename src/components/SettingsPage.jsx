import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Slider,
  Divider,
  Grid,
  Button,
} from '@mui/material';
import useLocalStorage from '../hooks/useLocalStorage';

const SettingsPage = () => {
  const [themeMode, setThemeMode] = useLocalStorage('theme-mode', 'light');
  const [notificationSettings, setNotificationSettings] = useLocalStorage('notification-settings', {
    soundEnabled: false,
    autoHide: true,
    defaultDuration: 6000,
  });

  const handleThemeToggle = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleNotificationSettingChange = (key, value) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleResetSettings = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Настройки приложения
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Настройки темы */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Внешний вид
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={themeMode === 'dark'}
              onChange={handleThemeToggle}
              color="primary"
            />
          }
          label={`Тёмная тема ${themeMode === 'dark' ? 'включена' : 'выключена'}`}
        />
      </Box>

      {/* Настройки уведомлений */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Уведомления
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.autoHide}
                  onChange={(e) => handleNotificationSettingChange('autoHide', e.target.checked)}
                  color="primary"
                />
              }
              label="Автоматически скрывать уведомления"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.soundEnabled}
                  onChange={(e) => handleNotificationSettingChange('soundEnabled', e.target.checked)}
                  color="primary"
                />
              }
              label="Звуковые уведомления"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body2" gutterBottom>
              Длительность показа уведомлений: {notificationSettings.defaultDuration / 1000} сек
            </Typography>
            <Slider
              value={notificationSettings.defaultDuration}
              onChange={(_, value) => handleNotificationSettingChange('defaultDuration', value)}
              min={2000}
              max={10000}
              step={1000}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value / 1000} сек`}
              sx={{ maxWidth: 300 }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Сброс настроек */}
      <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom color="error">
          Опасная зона
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={handleResetSettings}
          sx={{ mt: 1 }}
        >
          Сбросить все настройки
        </Button>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          Это очистит все ваши настройки и восстановит значения по умолчанию
        </Typography>
      </Box>
    </Paper>
  );
};

export default SettingsPage;