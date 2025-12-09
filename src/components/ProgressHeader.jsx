import './components/ProgressHeader.css';
import { useState, useEffect } from 'react';

function ProgressHeader({ technologies = [] }) {
  const totalTech = technologies.length;
  const completedTech = technologies.filter(tech => tech.status === 'completed').length;
  const inProgressTech = technologies.filter(tech => tech.status === 'in-progress').length;
  const notStartedTech = technologies.filter(tech => tech.status === 'not-started').length;
  
  const progressPercentage = totalTech > 0 ? Math.round((completedTech / totalTech) * 100) : 0;
  
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(progressPercentage);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  return (
    <div className="progress-header">
      <h2>📊 Статистика изучения технологий</h2>
      
      <div className="progress-stats">
        <div className="stat-item">
          <span className="stat-label">Всего:</span>
          <span className="stat-value total">{totalTech}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Изучено:</span>
          <span className="stat-value completed">{completedTech}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">В процессе:</span>
          <span className="stat-value in-progress">{inProgressTech}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Не начато:</span>
          <span className="stat-value not-started">{notStartedTech}</span>
        </div>
      </div>
      
      {/* Прогресс-бар */}
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${animatedPercentage}%` }}
        >
          <span className="progress-text">{progressPercentage}%</span>
        </div>
      </div>
      
      <div className="detailed-stats">
        <div className="stat-row">
          <div className="stat-label-bar">Изучено:</div>
          <div className="stat-bar">
            <div 
              className="stat-bar-fill completed" 
              style={{ width: `${totalTech > 0 ? (completedTech / totalTech) * 100 : 0}%` }}
            ></div>
          </div>
          <div className="stat-value">{completedTech} ({progressPercentage}%)</div>
        </div>
        
        <div className="stat-row">
          <div className="stat-label-bar">В процессе:</div>
          <div className="stat-bar">
            <div 
              className="stat-bar-fill in-progress" 
              style={{ width: `${totalTech > 0 ? (inProgressTech / totalTech) * 100 : 0}%` }}
            ></div>
          </div>
          <div className="stat-value">{inProgressTech} ({totalTech > 0 ? Math.round((inProgressTech / totalTech) * 100) : 0}%)</div>
        </div>
        
        <div className="stat-row">
          <div className="stat-label-bar">Не начато:</div>
          <div className="stat-bar">
            <div 
              className="stat-bar-fill not-started" 
              style={{ width: `${totalTech > 0 ? (notStartedTech / totalTech) * 100 : 0}%` }}
            ></div>
          </div>
          <div className="stat-value">{notStartedTech} ({totalTech > 0 ? Math.round((notStartedTech / totalTech) * 100) : 0}%)</div>
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
        ) : progressPercentage >= 10 ? (
          <p className="low">🚀 Вы начали! Продолжайте изучение!</p>
        ) : (
          <p className="very-low">⏰ Самое время начать изучение первой технологии!</p>
        )}
      </div>
    </div>
  );
}

export default ProgressHeader;