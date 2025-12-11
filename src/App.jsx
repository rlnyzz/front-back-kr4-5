import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import './App.css';

function App() {

const [isLoggedIn, setIsLoggedIn] = useState(false);
const [username, setUsername] = useState('');

const {
technologies,
updateStatus,
updateNotes,
markAllCompleted,
resetAllStatuses,
progress,
loading
} = useTechnologies();

useEffect(() => {
const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
const user = localStorage.getItem('username') || '';
setIsLoggedIn(loggedIn);
setUsername(user);
}, []);

const handleLogin = (user) => {
setIsLoggedIn(true);
setUsername(user);
};

const handleLogout = () => {
localStorage.removeItem('isLoggedIn');
localStorage.removeItem('username');
setIsLoggedIn(false);
setUsername('');
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

return (
<div className="App">
<Navigation isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
  <main className="main-content">
    <Routes>
      {/* Публичные маршруты */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/technologies" element={<Technologies />} />
      <Route path="/technology/:techId" element={<TechnologyDetail />} />
      
      {/* Защищенные маршруты */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Dashboard 
              technologies={technologies}
              progress={progress}
              username={username}
            />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/add-technology"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <AddTechnology />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/statistics"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Statistics />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/settings"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Settings />
          </ProtectedRoute>
        }
      />
      
      {/* Новые защищенные маршруты для практического занятия */}
      <Route
        path="/import-export"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <ImportExport />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/deadlines"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Deadlines />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/bulk-edit"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <BulkEdit />
          </ProtectedRoute>
        }
      />
      
      {/* Страница 404 */}
      <Route path="/404" element={<NotFound />} />
      
      {/* Редирект для несуществующих маршрутов на страницу 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </main>
  
  <footer className="app-footer">
    <div className="footer-content">
      <div className="footer-section">
        <h3>💻 Трекер технологий</h3>
        <p>Система для отслеживания прогресса в изучении программирования</p>
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
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2024 Трекер технологий. Все права защищены.</p>
      <p style={{ fontSize: '0.8em', opacity: 0.7, marginTop: '5px' }}>
        <a href="/404" style={{ color: 'inherit', textDecoration: 'none' }}>
          Страница 404
        </a>
      </p>
    </div>
  </footer>
</div>
);
}

export default App;