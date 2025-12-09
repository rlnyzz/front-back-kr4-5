import { useState } from 'react';
import './TechnologyCard.css';

function TechnologyCard({ id, title, description, status, notes, onStatusChange, onNotesChange }) {
  const [showNotes, setShowNotes] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  
  // Обработчик клика для изменения статуса
  const handleCardClick = () => {
    if (onStatusChange) {
      onStatusChange(id);
    }
  };

  // Обработчик клика для заметок (чтобы не путать с кликом по карточке)
  const handleNotesClick = (e) => {
    e.stopPropagation();
    setShowNotes(!showNotes);
  };

  // Обработчик изменения заметок
  const handleNotesChange = (e) => {
    if (onNotesChange) {
      onNotesChange(id, e.target.value);
    }
  };

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
    <div 
      className={`technology-card ${getStatusClass()}`}
      onClick={handleCardClick}
      title="Нажмите для изменения статуса"
    >
      <div className="card-header">
        <h3>{title}</h3>
        <span className="status-badge">
          {getStatusIcon()} {getStatusText()}
        </span>
      </div>
      
      <div className="card-content">
        <p className="description">{description}</p>
        
        {/* Блок заметок */}
        <div className="notes-container">
          <button 
            className="notes-toggle-btn"
            onClick={handleNotesClick}
            title={showNotes ? "Скрыть заметки" : "Показать заметки"}
          >
            📝 {notes ? `Заметка (${notes.length} симв.)` : 'Добавить заметку'}
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
                {notes ? `Сохранено (${notes.length} символов)` : 'Начните вводить текст...'}
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