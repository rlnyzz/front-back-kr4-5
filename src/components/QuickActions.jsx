import { useState } from 'react';
import Modal from './Modal';
import './QuickActions.css';

function QuickActions({ onMarkAllCompleted, onResetAllStatuses, onSelectRandomTech, hasNotStartedTech, technologies }) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      technologies: technologies.map(tech => ({
        id: tech.id,
        title: tech.title,
        description: tech.description,
        status: tech.status,
        category: tech.category,
        notes: tech.notes,
        difficulty: tech.difficulty,
        createdAt: tech.createdAt
      }))
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    
    // Создаем Blob и ссылку для скачивания
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowExportModal(true);
  };

  const handleResetAll = () => {
    onResetAllStatuses();
    setShowResetConfirmModal(false);
  };

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
          onClick={() => setShowResetConfirmModal(true)}
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

        <button 
          className="action-btn export-data" 
          onClick={handleExport}
        >
          <span className="action-icon">📥</span>
          <span className="action-text">Экспорт данных</span>
        </button>
      </div>

      {/* Модальное окно экспорта */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт данных"
      >
        <div className="export-modal-content">
          <div className="export-success">
            <div className="success-icon">✅</div>
            <h3>Данные успешно экспортированы!</h3>
            <p>Файл с вашими технологиями был скачан на ваш компьютер.</p>
            <div className="export-details">
              <p><strong>Формат:</strong> JSON</p>
              <p><strong>Количество технологий:</strong> {technologies.length}</p>
              <p><strong>Дата экспорта:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="modal-actions">
            <button 
              onClick={() => setShowExportModal(false)}
              className="modal-btn primary"
            >
              Закрыть
            </button>
          </div>
        </div>
      </Modal>

      {/* Модальное окно подтверждения сброса */}
      <Modal
        isOpen={showResetConfirmModal}
        onClose={() => setShowResetConfirmModal(false)}
        title="Подтверждение сброса"
      >
        <div className="confirm-modal-content">
          <div className="warning-icon">⚠️</div>
          <h3>Вы уверены?</h3>
          <p>Это действие сбросит статусы <strong>всех {technologies.length} технологий</strong> на "Не начато".</p>
          <p className="warning-text">Это действие нельзя отменить!</p>
          
          <div className="modal-actions">
            <button 
              onClick={() => setShowResetConfirmModal(false)}
              className="modal-btn secondary"
            >
              Отмена
            </button>
            <button 
              onClick={handleResetAll}
              className="modal-btn danger"
            >
              Сбросить все статусы
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default QuickActions;