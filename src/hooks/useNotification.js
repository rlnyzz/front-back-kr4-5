import { useState, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

const useNotification = () => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
    autoHideDuration: 6000,
  });

  // Сохраняем настройки уведомлений в localStorage
  const [notificationSettings, setNotificationSettings] = useLocalStorage('notification-settings', {
    soundEnabled: false,
    autoHide: true,
    defaultDuration: 6000,
    position: 'top-right',
  });

  const showNotification = useCallback((message, severity = 'info', customDuration = null) => {
    const duration = customDuration || notificationSettings.defaultDuration;
    
    setNotification({
      open: true,
      message,
      severity,
      autoHideDuration: notificationSettings.autoHide ? duration : null,
    });
  }, [notificationSettings]);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  const showSuccess = useCallback((message) => {
    showNotification(message, 'success');
  }, [showNotification]);

  const showError = useCallback((message) => {
    showNotification(message, 'error', 8000);
  }, [showNotification]);

  const showWarning = useCallback((message) => {
    showNotification(message, 'warning');
  }, [showNotification]);

  const showInfo = useCallback((message) => {
    showNotification(message, 'info');
  }, [showNotification]);

  // Функции для управления настройками уведомлений
  const updateNotificationSettings = useCallback((newSettings) => {
    setNotificationSettings(prev => ({ ...prev, ...newSettings }));
  }, [setNotificationSettings]);

  const toggleSound = useCallback(() => {
    setNotificationSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, [setNotificationSettings]);

  const toggleAutoHide = useCallback(() => {
    setNotificationSettings(prev => ({ ...prev, autoHide: !prev.autoHide }));
  }, [setNotificationSettings]);

  return {
    notification,
    notificationSettings,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    updateNotificationSettings,
    toggleSound,
    toggleAutoHide,
  };
};

export default useNotification;