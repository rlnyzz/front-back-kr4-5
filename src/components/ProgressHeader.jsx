import './ProgressHeader.css';
import { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';

function ProgressHeader({ technologies = [] }) {
  // Подсчет статистики
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

  const categories = {};
  technologies.forEach(tech => {
    if (tech.category) {
      if (!categories[tech.category]) {
        categories[tech.category] = { total: 0, completed: 0 };
      }
      categories[tech.category].total++;
      if (tech.status === 'completed') {
        categories[tech.category].completed++;
      }
    }
  });

  return (
    <div className="progress-header">
      <div className="progress-header-top">
        <h2>📊 Статистика изучения технологий</h2>
        <div className="progress-summary">
          <span className="summary-item">
            <strong>{totalTech}</strong> всего
          </span>
          <span className="summary-item">
            <strong>{completedTech}</strong> изучено
          </span>
          <span className="summary-item">
            <strong>{inProgressTech}</strong> в процессе
          </span>
        </div>
      </div>
      
      {/* Основной прогресс-бар */}
      <ProgressBar
        progress={animatedPercentage}
        label="Общий прогресс"
        color="linear-gradient(90deg, #4caf50, #8bc34a)"
        height={25}
        animated={true}
        className="main-progress-bar"
      />
      
      <div className="category-progress">
        <h3>Прогресс по категориям:</h3>
        {Object.entries(categories).map(([category, stats]) => {
          const categoryProgress = stats.total > 0 
            ? Math.round((stats.completed / stats.total) * 100) 
            : 0;
          
          return (
            <div key={category} className="category-item">
              <div className="category-info">
                <span className="category-name">{category}</span>
                <span className="category-stats">
                  {stats.completed}/{stats.total} ({categoryProgress}%)
                </span>
              </div>
              <ProgressBar
                progress={categoryProgress}
                height={12}
                showPercentage={false}
                color={getCategoryColor(category)}
              />
            </div>
          );
        })}
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

function getCategoryColor(category) {
  const colors = {
    frontend: '#2196f3',
    backend: '#4caf50',
    devops: '#ff9800',
    mobile: '#9c27b0',
    language: '#f44336',
    other: '#607d8b'
  };
  return colors[category.toLowerCase()] || '#667eea';
}

export default ProgressHeader;