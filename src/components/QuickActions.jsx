import './components/QuickActions.css';

function QuickActions({ onMarkAllCompleted, onResetAllStatuses, onSelectRandomTech, hasNotStartedTech }) {
  return (
    <div className="quick-actions">
      <h3>⚡ Быстрые действия</h3>
      <div className="actions-grid">
        <button 
          className="action-btn mark-all" 
          onClick={onMarkAllCompleted}
        >
          <span className="action-icon">✓</span>
          <span className="action-text">Отметить все как выполненные</span>
        </button>
        
        <button 
          className="action-btn reset-all" 
          onClick={onResetAllStatuses}
        >
          <span className="action-icon">↺</span>
          <span className="action-text">Сбросить все статусы</span>
        </button>
        
        <button 
          className="action-btn random-select" 
          onClick={onSelectRandomTech}
          disabled={!hasNotStartedTech}
        >
          <span className="action-icon">🎲</span>
          <span className="action-text">Случайный выбор следующей технологии</span>
          {!hasNotStartedTech && (
            <span className="action-hint">(нет не начатых)</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default QuickActions;