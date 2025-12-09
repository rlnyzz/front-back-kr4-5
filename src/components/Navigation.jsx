import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navigation.css';
import { useState } from 'react';

function Navigation({ isLoggedIn, username, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Главная', icon: '🏠' },
    { path: '/technologies', label: 'Технологии', icon: '💻' },
    { path: '/add-technology', label: 'Добавить', icon: '➕' },
    { path: '/statistics', label: 'Статистика', icon: '📊' },
    { path: '/settings', label: 'Настройки', icon: '⚙️' },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">💻</span>
            <h2 className="brand-title">Трекер Технологий</h2>
          </Link>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        <div className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            {navItems.map(item => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="user-section">
            {isLoggedIn ? (
              <div className="user-info">
                <span className="user-greeting">👤 Привет, {username}!</span>
                <button onClick={handleLogout} className="logout-btn">
                  Выйти
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-btn">
                Войти
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;