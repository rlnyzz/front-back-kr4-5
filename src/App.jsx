import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Technologies from './pages/Technologies';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import ProtectedRoute from './pages/ProtectedRoute';
import useTechnologies from './hooks/useTechnologies';
import ImportExport from './pages/ImportExport';
import Deadlines from './pages/Deadlines';
import BulkEdit from './pages/BulkEdit';

// Импортируем новые компоненты для заданий
import Notification from './components/Notification';
import ThemeToggle from './components/ThemeToggle';
import useNotification from './hooks/useNotification';
import useLocalStorage from './hooks/useLocalStorage';
import { lightTheme, darkTheme } from './theme/theme';
import './App.css';

// Компонент-обёртка для темы
function ThemeWrapper({ children }) {
  const [themeMode, setThemeMode] = useLocalStorage('theme-mode', 'light');
  
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  
  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {React.Children.map(children, child => 
        React.cloneElement(child, { themeMode, toggleTheme })
      )}
    </ThemeProvider>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Используем хук уведомлений
  const {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  } = useNotification();
  
  const {
    technologies,
    updateStatus,
    updateNotes,
    markAllCompleted,
    resetAllStatuses,
    progress,
    loading,
    addTechnology,
    editTechnology,
    deleteTechnology,
    bulkUpdateStatuses
  } = useTechnologies();

  // Передаём функции уведомлений в useTechnologies через контекст или пропсы
  // В реальном приложении можно создать контекст для уведомлений

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = localStorage.getItem('username') || '';
    setIsLoggedIn(loggedIn);
    setUsername(user);
  }, []);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUsername(user);
    showSuccess(`Добро пожаловать, ${user}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    showInfo('Вы успешно вышли из системы');
  };

  // Функции для работы с технологиями с уведомлениями
  const handleAddTechnology = (techData) => {
    try {
      const newTech = addTechnology(techData);
      showSuccess(`Технология "${newTech.title}" успешно добавлена`);
      return newTech;
    } catch (error) {
      showError(`Ошибка при добавлении технологии: ${error.message}`);
      throw error;
    }
  };

  const handleEditTechnology = (techId, updatedData) => {
    try {
      editTechnology(techId, updatedData);
      showSuccess('Технология успешно обновлена');
    } catch (error) {
      showError(`Ошибка при обновлении технологии: ${error.message}`);
      throw error;
    }
  };

  const handleDeleteTechnology = (techId, techTitle) => {
    try {
      deleteTechnology(techId);
      showWarning(`Технология "${techTitle}" удалена`);
    } catch (error) {
      showError(`Ошибка при удалении технологии: ${error.message}`);
      throw error;
    }
  };

  const handleBulkUpdate = (techIds, newStatus) => {
    try {
      const count = bulkUpdateStatuses(techIds, newStatus);
      showSuccess(`Статус обновлён для ${count} технологий`);
    } catch (error) {
      showError(`Ошибка при массовом обновлении: ${error.message}`);
      throw error;
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Показываем индикатор загрузки при первой загрузке
  if (loading && technologies.length === 0) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Загрузка приложения...</p>
      </div>
    );
  }

  // Главный компонент приложения
  const AppContent = ({ themeMode, toggleTheme }) => (
    <div className="App">
      {/* Передаём themeMode и toggleTheme в Navigation для отображения переключателя темы */}
      <Navigation 
        isLoggedIn={isLoggedIn} 
        username={username} 
        onLogout={handleLogout}
        themeMode={themeMode}
        toggleTheme={toggleTheme}
        onDrawerToggle={handleDrawerToggle}
      />
      
      <Box component="main" className="main-content" sx={{ mt: { xs: 7, sm: 8 } }}>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/" element={<Home themeMode={themeMode} />} />
          <Route 
            path="/login" 
            element={<Login onLogin={handleLogin} showNotification={showNotification} />} 
          />
          <Route 
            path="/technologies" 
            element={
              <Technologies 
                technologies={technologies}
                onEdit={handleEditTechnology}
                onDelete={handleDeleteTechnology}
                showNotification={showNotification}
              />
            } 
          />
          <Route 
            path="/technology/:techId" 
            element={
              <TechnologyDetail 
                technologies={technologies}
                showNotification={showNotification}
              />
            } 
          />
          
          {/* Защищенные маршруты */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Dashboard 
                  technologies={technologies}
                  progress={progress}
                  username={username}
                  themeMode={themeMode}
                />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/add-technology"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <AddTechnology 
                  onAdd={handleAddTechnology}
                  showNotification={showNotification}
                />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/statistics"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Statistics 
                  technologies={technologies}
                  themeMode={themeMode}
                />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/settings"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Settings 
                  themeMode={themeMode}
                  toggleTheme={toggleTheme}
                  showNotification={showNotification}
                />
              </ProtectedRoute>
            }
          />
          
          {/* Новые защищенные маршруты для практического занятия */}
          <Route
            path="/import-export"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <ImportExport 
                  technologies={technologies}
                  showNotification={showNotification}
                />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/deadlines"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Deadlines 
                  technologies={technologies}
                  showNotification={showNotification}
                />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/bulk-edit"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <BulkEdit 
                  technologies={technologies}
                  onBulkUpdate={handleBulkUpdate}
                  showNotification={showNotification}
                />
              </ProtectedRoute>
            }
          />
          
          {/* Страница 404 */}
          <Route path="/404" element={<NotFound themeMode={themeMode} />} />
          
          {/* Редирект для несуществующих маршрутов на страницу 404 */}
          <Route path="*" element={<NotFound themeMode={themeMode} />} />
        </Routes>
      </Box>
      
      {/* Компонент уведомлений */}
      <Notification 
        notification={notification}
        onClose={hideNotification}
      />
      
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>💻 Трекер технологий</h3>
            <p>Система для отслеживания прогресса в изучении программирования</p>
            <Box sx={{ mt: 1 }}>
              <ThemeToggle mode={themeMode} onToggle={toggleTheme} />
            </Box>
          </div>
          <div className="footer-section">
            <h3>🔗 Быстрые ссылки</h3>
            <a href="/">Главная</a>
            <a href="/technologies">Технологии</a>
            <a href="/statistics">Статистика</a>
            <a href="/settings">Настройки</a>
            {isLoggedIn && (
              <>
                <a href="/import-export">Импорт/Экспорт</a>
                <a href="/deadlines">Сроки изучения</a>
                <a href="/bulk-edit">Массовое редактирование</a>
              </>
            )}
          </div>
          <div className="footer-section">
            <h3>📱 Контакты</h3>
            <p>email: support@techtracker.com</p>
            <p>телефон: +7 (999) 123-45-67</p>
            <Box sx={{ mt: 1 }}>
              <button 
                className="test-notification-btn"
                onClick={() => showInfo('Это тестовое уведомление!')}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Тест уведомления
              </button>
            </Box>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Трекер технологий. Все права защищены.</p>
          <p style={{ fontSize: '0.8em', opacity: 0.7, marginTop: '5px' }}>
            Тема: {themeMode === 'light' ? 'Светлая' : 'Тёмная'}
          </p>
          <p style={{ fontSize: '0.8em', opacity: 0.7, marginTop: '5px' }}>
            <a href="/404" style={{ color: 'inherit', textDecoration: 'none' }}>
              Страница 404
            </a>
          </p>
        </div>
      </footer>
    </div>
  );

  // Рендерим приложение с обёрткой темы
  return (
    <ThemeWrapper>
      <AppContent />
    </ThemeWrapper>
  );
}

export default App;