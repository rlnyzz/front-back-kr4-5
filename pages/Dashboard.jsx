import { Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import QuickActions from '../components/QuickActions';
import './Dashboard.css';

function Dashboard({ technologies, progress, username }) {
  const completedTech = technologies.filter(tech => tech.status === 'completed').length;
  const inProgressTech = technologies.filter(tech => tech.status === 'in-progress').length;
  const notStartedTech = technologies.filter(tech => tech.status === 'not-started').length;
  
  const recentTech = technologies
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const quickActions = {
    markAllCompleted: () => {
      // Реализация в родительском компоненте
    },
    resetAllStatuses: () => {
      // Реализация в родительском компоненте
    },
    hasNotStartedTech: notStartedTech > 0,
    technologies
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>📋 Панель управления</h1>
        <div className="user-welcome">
          <span className="welcome-text">Добро пожаловать, {username}!</span>
          <span className="welcome-date">{new Date().toLocaleDateString('ru-RU', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-number">{technologies.length}</div>
            <div className="stat-label">Всего технологий</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{completedTech}</div>
            <div className="stat-label">Изучено</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-number">{inProgressTech}</div>
            <div className="stat-label">В процессе</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-number">{notStartedTech}</div>
            <div className="stat-label">Не начато</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-progress">
          <h2>📈 Общий прогресс</h2>
          <ProgressBar
            progress={progress}
            label="Ваш прогресс изучения"
            color="linear-gradient(90deg, #4caf50, #8bc34a)"
            height={30}
            animated={true}
          />
          <div className="progress-insights">
            {progress === 100 ? (
              <p className="insight success">🎉 Поздравляем! Вы изучили все технологии!</p>
            ) : progress >= 70 ? (
              <p className="insight good">👍 Отличный прогресс! Продолжайте в том же духе!</p>
            ) : progress >= 40 ? (
              <p className="insight average">📚 Хорошие результаты, можно двигаться дальше!</p>
            ) : progress >= 10 ? (
              <p className="insight low">🚀 Вы начали! Продолжайте изучение!</p>
            ) : (
              <p className="insight very-low">⏰ Самое время начать изучение первой технологии!</p>
            )}
          </div>
        </div>

        <div className="quick-actions-section">
          <h2>⚡ Быстрые действия</h2>
          <QuickActions {...quickActions} />
        </div>

        <div className="recent-technologies">
          <div className="section-header">
            <h2>🕐 Недавние технологии</h2>
            <Link to="/technologies" className="view-all-link">
              Показать все →
            </Link>
          </div>
          
          {recentTech.length === 0 ? (
            <div className="empty-state">
              <p>Технологий пока нет. Добавьте первую!</p>
              <Link to="/add-technology" className="btn btn-primary">
                Добавить технологию
              </Link>
            </div>
          ) : (
            <div className="recent-list">
              {recentTech.map(tech => (
                <Link 
                  key={tech.id} 
                  to={`/technology/${tech.id}`}
                  className="recent-item"
                >
                  <div className="recent-icon">
                    {tech.status === 'completed' ? '✅' : 
                     tech.status === 'in-progress' ? '⏳' : '🆕'}
                  </div>
                  <div className="recent-content">
                    <div className="recent-title">{tech.title}</div>
                    <div className="recent-meta">
                      <span className={`recent-status status-${tech.status}`}>
                        {tech.status === 'completed' ? 'Изучено' : 
                         tech.status === 'in-progress' ? 'В процессе' : 'Не начато'}
                      </span>
                      <span className="recent-date">
                        {new Date(tech.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="recent-arrow">→</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-quick-links">
          <h2>🔗 Быстрые ссылки</h2>
          <div className="quick-links-grid">
            <Link to="/add-technology" className="quick-link add">
              <span className="link-icon">➕</span>
              <span className="link-text">Добавить технологию</span>
            </Link>
            
            <Link to="/technologies" className="quick-link view">
              <span className="link-icon">👁️</span>
              <span className="link-text">Просмотреть все</span>
            </Link>
            
            <Link to="/statistics" className="quick-link stats">
              <span className="link-icon">📊</span>
              <span className="link-text">Статистика</span>
            </Link>
            
            <Link to="/settings" className="quick-link settings">
              <span className="link-icon">⚙️</span>
              <span className="link-text">Настройки</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;