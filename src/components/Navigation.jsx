
import { NavLink } from 'react-router-dom';
import './Navigation.css';

function Navigation({ isLoggedIn, username, onLogout }) {
return (
<nav className="navigation">
<div className="nav-container">
<div className="nav-brand">
<NavLink to="/" className="brand-link">
💻 TechTracker
</NavLink>
</div>

text
    <div className="nav-menu">
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        🏠 Главная
      </NavLink>
      
      <NavLink 
        to="/technologies" 
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        📚 Технологии
      </NavLink>
      
      {isLoggedIn && (
        <>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            📊 Дашборд
          </NavLink>
          
          <NavLink 
            to="/statistics" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            📈 Статистика
          </NavLink>
          
          {/* Новые ссылки для практического занятия */}
          <div className="dropdown">
            <button className="dropdown-toggle">
              ⚙️ Управление
            </button>
            <div className="dropdown-menu">
              <NavLink 
                to="/add-technology" 
                className={({ isActive }) => isActive ? 'dropdown-item active' : 'dropdown-item'}
              >
                ➕ Добавить технологию
              </NavLink>
              <NavLink 
                to="/import-export" 
                className={({ isActive }) => isActive ? 'dropdown-item active' : 'dropdown-item'}
              >
                📁 Импорт/Экспорт
              </NavLink>
              <NavLink 
                to="/deadlines" 
                className={({ isActive }) => isActive ? 'dropdown-item active' : 'dropdown-item'}
              >
                📅 Сроки изучения
              </NavLink>
              <NavLink 
                to="/bulk-edit" 
                className={({ isActive }) => isActive ? 'dropdown-item active' : 'dropdown-item'}
              >
                ⚡ Массовое редактирование
              </NavLink>
              <NavLink 
                to="/settings" 
                className={({ isActive }) => isActive ? 'dropdown-item active' : 'dropdown-item'}
              >
                ⚙️ Настройки
              </NavLink>
            </div>
          </div>
        </>
      )}
    </div>

    <div className="nav-auth">
      {isLoggedIn ? (
        <div className="user-section">
          <span className="username">👤 {username}</span>
          <button onClick={onLogout} className="logout-btn">
            Выйти
          </button>
        </div>
      ) : (
        <NavLink 
          to="/login" 
          className={({ isActive }) => isActive ? 'login-link active' : 'login-link'}
        >
          🔑 Войти
        </NavLink>
      )}
    </div>
  </div>
</nav>
);
}

export default Navigation;