import './TechnologyCard.css';

function TechnologyCard({ title, description, status }) {
  // Функция для определения класса статуса
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

  // Функция для отображения иконки статуса
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

  // Функция для отображения текста статуса
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
    <div className={`technology-card ${getStatusClass()}`}>
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
      </div>
    </div>
  );
}

export default TechnologyCard;