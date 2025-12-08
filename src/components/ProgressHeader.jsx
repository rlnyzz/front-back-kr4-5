import './ProgressHeader.css';

function ProgressHeader({ technologies = [] }) {
  // Подсчет статистики
  const totalTech = technologies.length;
  const completedTech = technologies.filter(tech => tech.status === 'completed').length;
  const progressPercentage = totalTech > 0 ? Math.round((completedTech / totalTech) * 100) : 0;
  
  return (
    <div className="progress-header">
      <h2>📊 Прогресс изучения технологий</h2>
      
      <div className="progress-stats">
        <div className="stat-item">
          <span className="stat-label">Всего технологий:</span>
          <span className="stat-value">{totalTech}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Изучено:</span>
          <span className="stat-value completed">{completedTech}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Прогресс:</span>
          <span className="stat-value">{progressPercentage}%</span>
        </div>
      </div>
      
      {/* Прогресс-бар */}
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progressPercentage}%` }}
        >
          <span className="progress-text">{progressPercentage}%</span>
        </div>
      </div>
      
      {/* Условный рендеринг сообщения в зависимости от прогресса */}
      <div className="progress-message">
        {progressPercentage === 100 ? (
          <p className="complete">🎉 Поздравляем! Все технологии изучены!</p>
        ) : progressPercentage >= 70 ? (
          <p className="good">👍 Отличный прогресс! Продолжайте в том же духе!</p>
        ) : progressPercentage >= 40 ? (
          <p className="average">📚 Хорошие результаты, можно двигаться дальше!</p>
        ) : (
          <p className="low">🚀 Начните изучение первой технологии!</p>
        )}
      </div>
    </div>
  );
}

export default ProgressHeader;