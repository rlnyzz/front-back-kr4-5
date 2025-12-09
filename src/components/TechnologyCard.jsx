import { useState } from 'react';
import './TechnologyCard.css';

function TechnologyCard({ 
  id, 
  title, 
  description, 
  status, 
  notes, 
  onStatusChange, 
  onNotesChange,
  category,
  difficulty,
  resources,
  apiSource 
}) {
  const [showNotes, setShowNotes] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  
  const handleCardClick = () => {
    if (onStatusChange) {
      onStatusChange(id);
    }
  };

  const handleNotesClick = (e) => {
    e.stopPropagation();
    setShowNotes(!showNotes);
  };

  const handleNotesChange = (e) => {
    if (onNotesChange) {
      onNotesChange(id, e.target.value);
    }
  };

  const getStatusClass = () => {
    switch(status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-in-progress';
      case 'not-started':
        return 'status-not-started';
      default:
        return '';
    }
  };

  const getStatusIcon = () => {
    switch(status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '⏳';
      case 'not-started':
        return '🆕';
      default:
        return '';
    }
  };

  const getStatusText = () => {
    switch(status) {
      case 'completed':
        return 'Изучено';
      case 'in-progress':
        return 'В процессе';
      case 'not-started':
        return 'Не начато';
      default:
        return '';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      frontend: '#2196f3',
      backend: '#4caf50',
      devops: '#ff9800',
      mobile: '#9c27b0',
      language: '#f44336',
      other: '#607d8b'
    };
    return colors[category] || '#607d8b';
  };

  const getDifficultyText = (difficulty) => {
    switch(difficulty) {
      case 'beginner':
        return 'Начальный';
      case 'intermediate':
        return 'Средний';
      case 'advanced':
        return 'Продвинутый';
      default:
        return difficulty;
    }
  };

  const getHostnameFromUrl = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div 
      className={`technology-card ${getStatusClass()}`}
      onClick={handleCardClick}
      title="Нажмите для изменения статуса"
    >
      <div className="card-header">
        <div className="header-left">
          <h3>{title}</h3>
          <div className="header-meta">
            {apiSource && (
              <span className="api-source-badge" title={`Источник: ${apiSource}`}>
                🌐 API
              </span>
            )}
            {category && (
              <span 
                className="tech-category" 
                style={{ backgroundColor: getCategoryColor(category) }}
              >
                {category}
              </span>
            )}
          </div>
        </div>
        <span className="status-badge">
          {getStatusIcon()} {getStatusText()}
        </span>
      </div>
      
      <div className="card-content">
        <p className="description">{description}</p>
        
        {/* Мета-информация */}
        <div className="tech-meta">
          {difficulty && (
            <span className="tech-difficulty">
              📊 Сложность: {getDifficultyText(difficulty)}
            </span>
          )}
          {resources && resources.length > 0 && (
            <span className="resources-count">
              🔗 {resources.length} ресурсов
            </span>
          )}
        </div>
        
        {/* Ресурсы */}
        {resources && resources.length > 0 && (
          <div className="tech-resources" onClick={(e) => e.stopPropagation()}>
            <h4>🔗 Полезные ресурсы:</h4>
            <div className="resources-list">
              {resources.slice(0, 3).map((resource, index) => (
                <a 
                  key={index}
                  href={resource} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  {getHostnameFromUrl(resource)}
                </a>
              ))}
              {resources.length > 3 && (
                <span className="more-resources" title={`Ещё ${resources.length - 3} ресурсов`}>
                  +{resources.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Блок заметок */}
        <div className="notes-container">
          <button 
            className="notes-toggle-btn"
            onClick={handleNotesClick}
            title={showNotes ? "Скрыть заметки" : "Показать заметки"}
          >
            📝 {notes && notes.trim() ? `Заметка (${notes.length} симв.)` : 'Добавить заметку'}
          </button>
          
          {showNotes && (
            <div className="notes-editor" onClick={(e) => e.stopPropagation()}>
              <h4>Мои заметки:</h4>
              <textarea
                value={notes || ''}
                onChange={handleNotesChange}
                onFocus={() => setIsEditingNotes(true)}
                onBlur={() => setIsEditingNotes(false)}
                placeholder="Записывайте сюда важные моменты, ссылки, примеры кода..."
                rows="4"
                className={isEditingNotes ? 'editing' : ''}
              />
              <div className="notes-hint">
                {notes && notes.trim() ? `Сохранено (${notes.length} символов)` : 'Начните вводить текст...'}
              </div>
              <div className="notes-tips">
                💡 Совет: Добавляйте ссылки на документацию, примеры кода, полезные статьи
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="card-footer">
        <div className="progress-indicator">
          {status === 'completed' && (
            <div className="progress-line full"></div>
          )}
          {status === 'in-progress' && (
            <div className="progress-line half"></div>
          )}
          {status === 'not-started' && (
            <div className="progress-line none"></div>
          )}
        </div>
        
        <div className="click-hint">
          <span className="hint-text">Нажмите для изменения статуса →</span>
          <span className="next-status">
            {status === 'not-started' ? '→ Начать изучение' : 
             status === 'in-progress' ? '→ Завершить' : 
             '→ Сбросить'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TechnologyCard;