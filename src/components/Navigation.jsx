import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Code as CodeIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  CloudUpload as ImportIcon,
  CalendarMonth as DeadlinesIcon,
  EditNote as BulkEditIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';

const Navigation = ({ 
  isLoggedIn, 
  username, 
  onLogout, 
  themeMode, 
  toggleTheme,
  onDrawerToggle 
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    if (onDrawerToggle) onDrawerToggle();
  };

  const menuItems = [
    { text: 'Главная', icon: <HomeIcon />, path: '/', public: true },
    { text: 'Технологии', icon: <CodeIcon />, path: '/technologies', public: true },
    { text: 'Дашборд', icon: <DashboardIcon />, path: '/dashboard', public: false },
    { text: 'Добавить', icon: <AddIcon />, path: '/add-technology', public: false },
    { text: 'Статистика', icon: <BarChartIcon />, path: '/statistics', public: false },
    { text: 'Импорт/Экспорт', icon: <ImportIcon />, path: '/import-export', public: false },
    { text: 'Сроки', icon: <DeadlinesIcon />, path: '/deadlines', public: false },
    { text: 'Массовое редакт.', icon: <BulkEditIcon />, path: '/bulk-edit', public: false },
    { text: 'Настройки', icon: <SettingsIcon />, path: '/settings', public: false },
  ];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6">
          {username ? `Привет, ${username}!` : 'Трекер технологий'}
        </Typography>
      </Box>
      <List>
        {menuItems
          .filter(item => isLoggedIn || item.public)
          .map((item) => (
            <ListItem 
              button 
              key={item.text}
              component="a"
              href={item.path}
              sx={{
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        <ListItem 
          button 
          onClick={toggleTheme}
          sx={{
            '&:hover': {
              bgcolor: 'action.hover',
            }
          }}
        >
          <ListItemIcon>
            {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </ListItemIcon>
          <ListItemText 
            primary={themeMode === 'light' ? 'Тёмная тема' : 'Светлая тема'} 
          />
        </ListItem>
        {isLoggedIn ? (
          <ListItem 
            button 
            onClick={onLogout}
            sx={{
              '&:hover': {
                bgcolor: 'error.light',
                color: 'error.contrastText',
              }
            }}
          >
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Выйти" />
          </ListItem>
        ) : (
          <ListItem 
            button 
            component="a"
            href="/login"
            sx={{
              '&:hover': {
                bgcolor: 'success.light',
                color: 'success.contrastText',
              }
            }}
          >
            <ListItemIcon><LoginIcon /></ListItemIcon>
            <ListItemText primary="Войти" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1,
              fontWeight: 700,
              color: 'primary.main'
            }}
          >
            💻 Трекер технологий
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {menuItems
                .filter(item => isLoggedIn || item.public)
                .slice(0, 4) // Показываем только первые 4 пункта в AppBar
                .map((item) => (
                  <Button
                    key={item.text}
                    color="inherit"
                    href={item.path}
                    startIcon={item.icon}
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.hover',
                      }
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              
              <IconButton
                onClick={toggleTheme}
                sx={{
                  color: themeMode === 'dark' ? 'warning.main' : 'primary.main',
                }}
                title={themeMode === 'light' ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'}
              >
                {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
              
              {isLoggedIn ? (
                <>
                  <Typography variant="body2" sx={{ mx: 1 }}>
                    {username}
                  </Typography>
                  <Button
                    color="inherit"
                    onClick={onLogout}
                    startIcon={<LogoutIcon />}
                    sx={{
                      '&:hover': {
                        bgcolor: 'error.light',
                        color: 'error.contrastText',
                      }
                    }}
                  >
                    Выйти
                  </Button>
                </>
              ) : (
                <Button
                  color="inherit"
                  href="/login"
                  startIcon={<LoginIcon />}
                  sx={{
                    '&:hover': {
                      bgcolor: 'success.light',
                      color: 'success.contrastText',
                    }
                  }}
                >
                  Войти
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 250 
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default Navigation;