import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import Notification from './Notification';
import ThemeToggle from './ThemeToggle';
import useNotification from '../hooks/useNotification';

const Layout = ({ children, themeMode, toggleTheme }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  } = useNotification();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Тестовые уведомления для демонстрации
  const handleTestNotification = (type) => {
    const messages = {
      success: 'Операция успешно выполнена!',
      error: 'Произошла ошибка при выполнении операции',
      warning: 'Внимание! Проверьте введенные данные',
      info: 'Новая информация доступна для просмотра',
    };

    const functions = {
      success: showSuccess,
      error: showError,
      warning: showWarning,
      info: showInfo,
    };

    functions[type](messages[type]);
  };

  const drawerWidth = 240;

  const drawer = (
    <Box
      sx={{
        width: drawerWidth,
        bgcolor: 'background.paper',
        height: '100%',
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Меню
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Тест уведомлений:
        </Typography>
        
        {['success', 'error', 'warning', 'info'].map((type) => (
          <Paper
            key={type}
            elevation={0}
            onClick={() => handleTestNotification(type)}
            sx={{
              p: 1.5,
              cursor: 'pointer',
              bgcolor: `${type}.light`,
              color: `${type}.contrastText`,
              borderRadius: 1,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: `${type}.main`,
                transform: 'translateY(-2px)',
              },
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Paper>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: 'primary.main',
            }}
          >
            Технологии для изучения
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <ThemeToggle mode={themeMode} onToggle={toggleTheme} />
            
            <Tooltip title="Настройки">
              <IconButton color="inherit">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                borderRight: '1px solid',
                borderColor: 'divider',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px', // AppBar height
          minHeight: 'calc(100vh - 64px)',
          bgcolor: 'background.default',
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            p: isSmallScreen ? 1 : 3,
          }}
        >
          {children}
        </Container>
      </Box>

      {/* Notification Component */}
      <Notification
        notification={notification}
        onClose={hideNotification}
      />
    </Box>
  );
};

export default Layout;