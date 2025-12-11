import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';
import './TechnologyDetail.css';

function TechnologyDetail() {
  const { techId } = useParams();
  const navigate = useNavigate();
  const { technologies, updateStatus, updateNotes, deleteTechnology } = useTechnologies();
  const [technology, setTechnology] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState('');

  useEffect(() => {
    const tech = technologies.find(t => t.id === parseInt(techId));
    if (tech) {
      setTechnology(tech);
      setNotesText(tech.notes || '');
    }
  }, [technologies, techId]);

if (!technology) {
  return (
    <div className="tech-not-found">
      <h1>📛 Технология не найдена</h1>
      <p>Технология с ID {techId} не существует или была удалена.</p>
      <Link to="/technologies" className="btn btn-primary">
        ← Вернуться к списку
      </Link>
      <Link to="/404" className="btn btn-secondary" style={{ marginLeft: '10px' }}>
        Страница 404
      </Link>
    </div>
  );
}

  const handleStatusChange = (newStatus) => {
    updateStatus(parseInt(techId), newStatus);
  };

  const handleSaveNotes = () => {
    updateNotes(parseInt(techId), notesText);
    setIsEditingNotes(false);
  };

  const handleDelete = () => {
    deleteTechnology(parseInt(techId));
    setShowDeleteModal(false);
    navigate('/technologies');
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return '✅';
      case 'in-progress': return '⏳';
      default: return '🆕';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return 'Изучено';
      case 'in-progress': return 'В процессе';
      default: return 'Не начато';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch(difficulty) {
      case 'beginner': return 'Начальный';
      case 'intermediate': return 'Средний';
      case 'advanced': return 'Продвинутый';
      default: return difficulty;
    }
  };

  return (
    <div className="technology-detail">
      <div className="detail-header">
        <div className="breadcrumb">
          <Link to="/technologies" className="breadcrumb-link">
            ← Все технологии
          </Link>
        </div>
        <div className="header-content">
          <h1>{technology.title}</h1>
          <div className="header-actions">
            <button 
              onClick={() => navigate(`/edit-technology/${techId}`)}
              className="btn btn-secondary"
            >
              ✏️ Редактировать
            </button>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="btn btn-danger"
            >
              🗑️ Удалить
            </button>
          </div>
        </div>
      </div>

      <div className="detail-content">
        <div className="main-info">
          <div className="info-card">
            <h2>📋 Информация</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Статус:</span>
                <span className={`info-value status-${technology.status}`}>
                  {getStatusIcon(technology.status)} {getStatusText(technology.status)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Категория:</span>
                <span className="info-value category">
                  {technology.category || 'Не указана'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Сложность:</span>
                <span className="info-value">
                  {getDifficultyText(technology.difficulty) || 'Не указана'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Добавлено:</span>
                <span className="info-value">
                  {new Date(technology.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="description-card">
            <h2>📖 Описание</h2>
            <p className="description-text">
              {technology.description || 'Описание отсутствует'}
            </p>
          </div>

          <div className="resources-card">
            <h2>🔗 Ресурсы</h2>
            {technology.resources && technology.resources.length > 0 ? (
              <div className="resources-list">
                {technology.resources.map((resource, index) => (
                  <a 
                    key={index}
                    href={resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <span className="link-icon">🔗</span>
                    <span className="link-text">
                      {new URL(resource).hostname}
                    </span>
                    <span className="link-arrow">↗</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="no-resources">Ресурсы не добавлены</p>
            )}
          </div>
        </div>

        <div className="side-panel">
          <div className="status-card">
            <h2>📈 Прогресс</h2>
            <ProgressBar
              progress={technology.status === 'completed' ? 100 : 
                       technology.status === 'in-progress' ? 50 : 0}
              label="Прогресс изучения"
              color={technology.status === 'completed' ? '#4CAF50' : 
                     technology.status === 'in-progress' ? '#FF9800' : '#F44336'}
              animated={true}
              height={20}
            />
            <div className="status-buttons">
              <button
                onClick={() => handleStatusChange('not-started')}
                className={`status-btn ${technology.status === 'not-started' ? 'active' : ''}`}
              >
                🆕 Не начато
              </button>
              <button
                onClick={() => handleStatusChange('in-progress')}
                className={`status-btn ${technology.status === 'in-progress' ? 'active' : ''}`}
              >
                ⏳ В процессе
              </button>
              <button
                onClick={() => handleStatusChange('completed')}
                className={`status-btn ${technology.status === 'completed' ? 'active' : ''}`}
              >
                ✅ Изучено
              </button>
            </div>
          </div>

          <div className="notes-card">
            <div className="notes-header">
              <h2>📝 Мои заметки</h2>
              {!isEditingNotes && (
                <button 
                  onClick={() => setIsEditingNotes(true)}
                  className="edit-notes-btn"
                >
                  ✏️
                </button>
              )}
            </div>
            
            {isEditingNotes ? (
              <div className="notes-editor">
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Добавьте ваши заметки здесь..."
                  rows="8"
                  className="notes-textarea"
                />
                <div className="editor-actions">
                  <button 
                    onClick={() => {
                      setNotesText(technology.notes || '');
                      setIsEditingNotes(false);
                    }}
                    className="btn btn-secondary"
                  >
                    Отмена
                  </button>
                  <button 
                    onClick={handleSaveNotes}
                    className="btn btn-primary"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            ) : (
              <div className="notes-content">
                {technology.notes ? (
                  <p className="notes-text">{technology.notes}</p>
                ) : (
                  <p className="no-notes">Заметки отсутствуют</p>
                )}
                {technology.notes && (
                  <div className="notes-meta">
                    <span className="notes-length">
                      {technology.notes.length} символов
                    </span>
                    <button 
                      onClick={() => setIsEditingNotes(true)}
                      className="edit-link"
                    >
                      Редактировать
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно удаления */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Удаление технологии"
      >
        <div className="delete-modal-content">
          <div className="warning-icon">⚠️</div>
          <h3>Вы уверены?</h3>
          <p>Вы собираетесь удалить технологию <strong>"{technology.title}"</strong>.</p>
          <p className="warning-text">Это действие нельзя отменить!</p>
          
          <div className="modal-actions">
            <button 
              onClick={() => setShowDeleteModal(false)}
              className="btn btn-secondary"
            >
              Отмена
            </button>
            <button 
              onClick={handleDelete}
              className="btn btn-danger"
            >
              Удалить
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TechnologyDetail;