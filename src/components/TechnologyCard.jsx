import './components/TechnologyCard.css';

function TechnologyCard({ id, title, description, status, onStatusChange }) {
  const handleClick = () => {
    if (onStatusChange) {
      onStatusChange(id);
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

  return (
    <div 
      className={`technology-card ${getStatusClass()}`}
      onClick={handleClick}
      title="Нажмите для изменения статуса"
    >
      <div className="card-header">
        <h3>{title}</h3>
        <span className="status-badge">
          {getStatusIcon()} {getStatusText()}
        </span>
      </div>
      
      <div className="card-content">
        <p>{description}</p>
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