import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="error-code">404</div>
        <h1 className="error-title">Страница не найдена</h1>
        <p className="error-description">
          К сожалению, страница, которую вы ищете, не существует или была перемещена.
        </p>
        
        <div className="error-details">
          <p>Возможные причины:</p>
          <ul className="reasons-list">
            <li>❌ Вы ввели неправильный URL</li>
            <li>🚧 Страница находится в разработке</li>
            <li>🔗 Ссылка устарела или была удалена</li>
            <li>📄 Файл был перемещен в другое место</li>
          </ul>
        </div>

        <div className="quick-links">
          <h3>Быстрые ссылки:</h3>
          <div className="links-grid">
            <Link to="/" className="quick-link-card">
              <span className="link-icon">🏠</span>
              <span className="link-text">Главная страница</span>
            </Link>
            
            <Link to="/technologies" className="quick-link-card">
              <span className="link-icon">💻</span>
              <span className="link-text">Все технологии</span>
            </Link>
            
            <Link to="/dashboard" className="quick-link-card">
              <span className="link-icon">📊</span>
              <span className="link-text">Панель управления</span>
            </Link>
            
            <Link to="/settings" className="quick-link-card">
              <span className="link-icon">⚙️</span>
              <span className="link-text">Настройки</span>
            </Link>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/" className="btn btn-primary">
            ← Вернуться на главную
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-secondary"
          >
            ← Назад
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;