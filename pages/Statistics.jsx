import { useState } from 'react';
import { Link } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import ProgressBar from '../components/ProgressBar';
import './Statistics.css';

function Statistics() {
  const { technologies, groupByStatus } = useTechnologies();
  
  const grouped = groupByStatus();
  const total = technologies.length;
  const completed = grouped.completed.length;
  const inProgress = grouped.inProgress.length;
  const notStarted = grouped.notStarted.length;
  
  const overallProgress = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Группировка по категориям
  const categories = {};
  technologies.forEach(tech => {
    const category = tech.category || 'other';
    if (!categories[category]) {
      categories[category] = { total: 0, completed: 0, inProgress: 0, notStarted: 0 };
    }
    categories[category].total++;
    categories[category][tech.status]++;
  });
  
  // Группировка по сложности
  const difficulties = {};
  technologies.forEach(tech => {
    const difficulty = tech.difficulty || 'not-specified';
    if (!difficulties[difficulty]) {
      difficulties[difficulty] = { total: 0, completed: 0 };
    }
    difficulties[difficulty].total++;
    if (tech.status === 'completed') {
      difficulties[difficulty].completed++;
    }
  });
  
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="statistics-page">
      <div className="page-header">
        <h1>📊 Статистика</h1>
        <Link to="/technologies" className="btn btn-secondary">
          ← Назад к технологиям
        </Link>
      </div>

      <div className="stats-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📈 Обзор
        </button>
        <button 
          className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          🏷️ По категориям
        </button>
        <button 
          className={`tab-btn ${activeTab === 'difficulty' ? 'active' : ''}`}
          onClick={() => setActiveTab('difficulty')}
        >
          📊 По сложности
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="overview-stats">
          <div className="stats-cards">
            <div className="stat-card total">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <div className="stat-number">{total}</div>
                <div className="stat-label">Всего технологий</div>
              </div>
            </div>
            
            <div className="stat-card completed">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-number">{completed}</div>
                <div className="stat-label">Изучено</div>
              </div>
            </div>
            
            <div className="stat-card in-progress">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <div className="stat-number">{inProgress}</div>
                <div className="stat-label">В процессе</div>
              </div>
            </div>
            
            <div className="stat-card not-started">
              <div className="stat-icon">🆕</div>
              <div className="stat-content">
                <div className="stat-number">{notStarted}</div>
                <div className="stat-label">Не начато</div>
              </div>
            </div>
          </div>

          <div className="progress-section">
            <h2>Общий прогресс</h2>
            <ProgressBar
              progress={overallProgress}
              label="Прогресс изучения"
              color="linear-gradient(90deg, #4caf50, #8bc34a)"
              height={30}
              animated={true}
            />
            <div className="progress-details">
              <div className="progress-item">
                <span className="progress-label">Выполнено:</span>
                <span className="progress-value">{completed}/{total}</span>
              </div>
              <div className="progress-item">
                <span className="progress-label">Прогресс:</span>
                <span className="progress-value">{overallProgress}%</span>
              </div>
              <div className="progress-item">
                <span className="progress-label">Осталось:</span>
                <span className="progress-value">{total - completed} технологий</span>
              </div>
            </div>
          </div>

          <div className="status-distribution">
            <h2>Распределение по статусам</h2>
            <div className="distribution-chart">
              <div 
                className="chart-bar completed"
                style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
                title={`Изучено: ${completed} (${total > 0 ? Math.round((completed / total) * 100) : 0}%)`}
              >
                <span className="bar-label">Изучено</span>
              </div>
              <div 
                className="chart-bar in-progress"
                style={{ width: `${total > 0 ? (inProgress / total) * 100 : 0}%` }}
                title={`В процессе: ${inProgress} (${total > 0 ? Math.round((inProgress / total) * 100) : 0}%)`}
              >
                <span className="bar-label">В процессе</span>
              </div>
              <div 
                className="chart-bar not-started"
                style={{ width: `${total > 0 ? (notStarted / total) * 100 : 0}%` }}
                title={`Не начато: ${notStarted} (${total > 0 ? Math.round((notStarted / total) * 100) : 0}%)`}
              >
                <span className="bar-label">Не начато</span>
              </div>
            </div>
          </div>

          <div className="recent-activity">
            <h2>Последняя активность</h2>
            {technologies
              .filter(tech => tech.status !== 'not-started')
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
              .map(tech => (
                <div key={tech.id} className="activity-item">
                  <div className="activity-icon">
                    {tech.status === 'completed' ? '✅' : '⏳'}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">{tech.title}</div>
                    <div className="activity-meta">
                      <span className={`activity-status status-${tech.status}`}>
                        {tech.status === 'completed' ? 'Изучено' : 'В процессе'}
                      </span>
                      <span className="activity-date">
                        {new Date(tech.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Link to={`/technology/${tech.id}`} className="activity-link">
                    →
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="categories-stats">
          <h2>Статистика по категориям</h2>
          <div className="categories-grid">
            {Object.entries(categories).map(([category, stats]) => {
              const categoryProgress = stats.total > 0 
                ? Math.round((stats.completed / stats.total) * 100) 
                : 0;
              
              return (
                <div key={category} className="category-stat-card">
                  <div className="category-header">
                    <h3 className="category-name">{category}</h3>
                    <span className="category-count">{stats.total} технологий</span>
                  </div>
                  
                  <ProgressBar
                    progress={categoryProgress}
                    height={12}
                    showPercentage={false}
                    color="#667eea"
                  />
                  
                  <div className="category-details">
                    <div className="category-stats-row">
                      <span className="stat-label">Изучено:</span>
                      <span className="stat-value">{stats.completed}</span>
                    </div>
                    <div className="category-stats-row">
                      <span className="stat-label">В процессе:</span>
                      <span className="stat-value">{stats.inProgress}</span>
                    </div>
                    <div className="category-stats-row">
                      <span className="stat-label">Не начато:</span>
                      <span className="stat-value">{stats.notStarted}</span>
                    </div>
                  </div>
                  
                  <div className="category-progress">
                    <span className="progress-label">Прогресс:</span>
                    <span className="progress-value">{categoryProgress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'difficulty' && (
        <div className="difficulty-stats">
          <h2>Статистика по уровню сложности</h2>
          <div className="difficulty-chart">
            {Object.entries(difficulties).map(([difficulty, stats]) => {
              const difficultyProgress = stats.total > 0 
                ? Math.round((stats.completed / stats.total) * 100) 
                : 0;
              
              const difficultyText = {
                'beginner': 'Начальный',
                'intermediate': 'Средний',
                'advanced': 'Продвинутый',
                'not-specified': 'Не указано'
              }[difficulty] || difficulty;
              
              return (
                <div key={difficulty} className="difficulty-item">
                  <div className="difficulty-header">
                    <span className="difficulty-name">{difficultyText}</span>
                    <span className="difficulty-count">{stats.total} технологий</span>
                  </div>
                  
                  <ProgressBar
                    progress={difficultyProgress}
                    label={`${stats.completed}/${stats.total} изучено`}
                    color={getDifficultyColor(difficulty)}
                    height={20}
                    animated={false}
                  />
                  
                  <div className="difficulty-progress">
                    <span className="progress-text">Прогресс:</span>
                    <span className="progress-value">{difficultyProgress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="insights-section">
        <h2>💡 Рекомендации</h2>
        <div className="insights-grid">
          {notStarted > 0 && (
            <div className="insight-card">
              <div className="insight-icon">🎯</div>
              <div className="insight-content">
                <h3>Начните изучение</h3>
                <p>У вас есть {notStarted} технологий, которые ещё не начаты. Начните с самой простой!</p>
              </div>
            </div>
          )}
          
          {inProgress > 0 && (
            <div className="insight-card">
              <div className="insight-icon">⚡</div>
              <div className="insight-content">
                <h3>Завершите начатое</h3>
                <p>У вас {inProgress} технологий в процессе. Сосредоточьтесь на их завершении!</p>
              </div>
            </div>
          )}
          
          {overallProgress >= 70 && overallProgress < 100 && (
            <div className="insight-card">
              <div className="insight-icon">🎉</div>
              <div className="insight-content">
                <h3>Отличный прогресс!</h3>
                <p>Вы изучили {overallProgress}% технологий. Продолжайте в том же духе!</p>
              </div>
            </div>
          )}
          
          {total === 0 && (
            <div className="insight-card">
              <div className="insight-icon">📚</div>
              <div className="insight-content">
                <h3>Добавьте технологии</h3>
                <p>Начните с добавления технологий, которые хотите изучить.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getDifficultyColor(difficulty) {
  switch(difficulty) {
    case 'beginner': return '#4caf50';
    case 'intermediate': return '#ff9800';
    case 'advanced': return '#f44336';
    default: return '#607d8b';
  }
}

export default Statistics;