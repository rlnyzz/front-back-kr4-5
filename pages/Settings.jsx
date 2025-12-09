import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import Modal from '../components/Modal';
import './Settings.css';

function Settings() {
  // Настройки темы
  const [theme, setTheme] = useLocalStorage('appTheme', 'light');
  const [notifications, setNotifications] = useLocalStorage('notifications', true);
  const [autoSave, setAutoSave] = useLocalStorage('autoSave', true);
  const [language, setLanguage] = useLocalStorage('language', 'ru');
  
  // Модальные окна
  const [showResetModal, setShowResetModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  
  // Импорт файла
  const [importFile, setImportFile] = useState(null);
  const [importStatus, setImportStatus] = useState('');
  
  // Эффект для применения темы
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      app: 'Tech Tracker',
      version: '1.0',
      settings: {
        theme,
        notifications,
        autoSave,
        language
      },
      data: JSON.parse(localStorage.getItem('technologies') || '[]')
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tech-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowExportModal(true);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/json') {
      setImportFile(file);
    } else {
      alert('Пожалуйста, выберите JSON файл');
    }
  };

  const handleImportData = async () => {
    if (!importFile) {
      alert('Пожалуйста, выберите файл для импорта');
      return;
    }

    try {
      setImportStatus('Импорт...');
      const text = await importFile.text();
      const data = JSON.parse(text);
      
      // Проверяем формат файла
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Некорректный формат файла');
      }
      
      // Импортируем технологии
      localStorage.setItem('technologies', JSON.stringify(data.data));
      
      // Импортируем настройки, если они есть
      if (data.settings) {
        if (data.settings.theme) setTheme(data.settings.theme);
        if (data.settings.notifications !== undefined) setNotifications(data.settings.notifications);
        if (data.settings.autoSave !== undefined) setAutoSave(data.settings.autoSave);
        if (data.settings.language) setLanguage(data.settings.language);
      }
      
      setImportStatus('Импорт завершен успешно!');
      setTimeout(() => {
        setShowImportModal(false);
        setImportFile(null);
        setImportStatus('');
        window.location.reload(); // Перезагружаем для применения настроек
      }, 2000);
      
    } catch (error) {
      console.error('Ошибка импорта:', error);
      setImportStatus(`Ошибка: ${error.message}`);
    }
  };

  const handleResetData = () => {
    localStorage.removeItem('technologies');
    localStorage.removeItem('appTheme');
    localStorage.removeItem('notifications');
    localStorage.removeItem('autoSave');
    localStorage.removeItem('language');
    localStorage.removeItem('techTrackerData');
    setShowResetModal(false);
    window.location.reload();
  };

  const handleClearLocalStorage = () => {
    if (window.confirm('Вы уверены? Это удалит ВСЕ данные приложения, включая настройки и технологии.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>⚙️ Настройки</h1>
        <Link to="/" className="btn btn-secondary">
          ← На главную
        </Link>
      </div>

      <div className="settings-grid">
        {/* Внешний вид */}
        <div className="settings-card">
          <div className="card-header">
            <h2>🎨 Внешний вид</h2>
            <span className="card-icon">🎨</span>
          </div>
          
          <div className="setting-group">
            <label>Тема оформления</label>
            <div className="theme-options">
              <button
                className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <div className="theme-preview light">
                  <div className="preview-header"></div>
                  <div className="preview-content"></div>
                </div>
                <span className="theme-name">Светлая</span>
              </button>
              <button
                className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <div className="theme-preview dark">
                  <div className="preview-header"></div>
                  <div className="preview-content"></div>
                </div>
                <span className="theme-name">Тёмная</span>
              </button>
              <button
                className={`theme-option ${theme === 'auto' ? 'active' : ''}`}
                onClick={() => handleThemeChange('auto')}
              >
                <div className="theme-preview auto">
                  <div className="preview-header"></div>
                  <div className="preview-content"></div>
                </div>
                <span className="theme-name">Авто</span>
              </button>
            </div>
          </div>

          <div className="setting-group">
            <label>Язык интерфейса</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-select"
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

        {/* Уведомления */}
        <div className="settings-card">
          <div className="card-header">
            <h2>🔔 Уведомления</h2>
            <span className="card-icon">🔔</span>
          </div>
          
          <div className="setting-group toggle-group">
            <div className="toggle-label">
              <span className="toggle-title">Включить уведомления</span>
              <span className="toggle-description">
                Получайте напоминания о изучении технологий
              </span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-group toggle-group">
            <div className="toggle-label">
              <span className="toggle-title">Автосохранение</span>
              <span className="toggle-description">
                Автоматически сохранять изменения
              </span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Управление данными */}
        <div className="settings-card">
          <div className="card-header">
            <h2>💾 Управление данными</h2>
            <span className="card-icon">💾</span>
          </div>
          
          <div className="data-actions">
            <button
              onClick={() => setShowExportModal(true)}
              className="data-action-btn export"
            >
              <span className="action-icon">📤</span>
              <span className="action-text">Экспорт данных</span>
            </button>
            
            <button
              onClick={() => setShowImportModal(true)}
              className="data-action-btn import"
            >
              <span className="action-icon">📥</span>
              <span className="action-text">Импорт данных</span>
            </button>
            
            <button
              onClick={() => setShowResetModal(true)}
              className="data-action-btn reset"
            >
              <span className="action-icon">🔄</span>
              <span className="action-text">Сбросить прогресс</span>
            </button>
            
            <button
              onClick={handleClearLocalStorage}
              className="data-action-btn clear"
            >
              <span className="action-icon">🗑️</span>
              <span className="action-text">Очистить всё</span>
            </button>
          </div>
        </div>

        {/* О приложении */}
        <div className="settings-card">
          <div className="card-header">
            <h2>ℹ️ О приложении</h2>
            <span className="card-icon">ℹ️</span>
          </div>
          
          <div className="about-content">
            <div className="app-info">
              <div className="app-logo">💻</div>
              <div className="app-details">
                <h3>Трекер технологий</h3>
                <p>Версия 1.0.0</p>
              </div>
            </div>
            
            <div className="about-stats">
              <div className="stat">
                <span className="stat-value">
                  {JSON.parse(localStorage.getItem('technologies') || '[]').length}
                </span>
                <span className="stat-label">Технологий</span>
              </div>
              <div className="stat">
                <span className="stat-value">
                  {JSON.parse(localStorage.getItem('technologies') || '[]')
                    .filter(t => t.status === 'completed').length}
                </span>
                <span className="stat-label">Изучено</span>
              </div>
            </div>
            
            <div className="about-links">
              <a href="#" className="about-link">
                📖 Документация
              </a>
              <a href="#" className="about-link">
                🐛 Сообщить об ошибке
              </a>
              <a href="#" className="about-link">
                💡 Предложить функцию
              </a>
            </div>
          </div>
        </div>
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
            <h3>Данные экспортированы!</h3>
            <p>Файл с вашими технологиями и настройками был скачан.</p>
            
            <div className="export-info">
              <p><strong>Формат:</strong> JSON</p>
              <p><strong>Содержимое:</strong></p>
              <ul className="export-contents">
                <li>Все технологии ({JSON.parse(localStorage.getItem('technologies') || '[]').length})</li>
                <li>Настройки приложения</li>
                <li>Статистика прогресса</li>
              </ul>
            </div>
          </div>
          <div className="modal-actions">
            <button 
              onClick={() => setShowExportModal(false)}
              className="btn btn-primary"
            >
              Закрыть
            </button>
          </div>
        </div>
      </Modal>

      {/* Модальное окно импорта */}
      <Modal
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          setImportFile(null);
          setImportStatus('');
        }}
        title="Импорт данных"
      >
        <div className="import-modal-content">
          {importStatus ? (
            <div className={`import-status ${importStatus.includes('Ошибка') ? 'error' : 'success'}`}>
              <div className="status-icon">
                {importStatus.includes('Ошибка') ? '❌' : '✅'}
              </div>
              <p>{importStatus}</p>
            </div>
          ) : (
            <>
              <div className="import-instructions">
                <p>Выберите JSON файл с экспортированными данными трекера технологий.</p>
                <p className="warning-text">
                  ⚠️ Внимание: Импорт заменит все текущие данные!
                </p>
              </div>
              
              <div className="file-input-area">
                <label className="file-input-label">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                    className="file-input"
                  />
                  <div className="file-input-content">
                    <div className="file-icon">📁</div>
                    {importFile ? (
                      <div className="file-selected">
                        <span className="file-name">{importFile.name}</span>
                        <span className="file-size">
                          {(importFile.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    ) : (
                      <>
                        <span className="file-prompt">Выберите файл</span>
                        <span className="file-hint">или перетащите его сюда</span>
                      </>
                    )}
                  </div>
                </label>
              </div>
              
              <div className="modal-actions">
                <button 
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                  }}
                  className="btn btn-secondary"
                >
                  Отмена
                </button>
                <button 
                  onClick={handleImportData}
                  disabled={!importFile}
                  className="btn btn-primary"
                >
                  Импортировать
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Модальное окно сброса */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Сброс прогресса"
      >
        <div className="reset-modal-content">
          <div className="warning-icon">⚠️</div>
          <h3>Вы уверены?</h3>
          <p>Это действие сбросит статусы всех технологий на "Не начато".</p>
          
          <div className="reset-stats">
            <p><strong>Будет сброшено:</strong></p>
            <ul>
              <li>Статусы всех технологий</li>
              <li>Прогресс изучения</li>
              <li>Персональные заметки останутся</li>
              <li>Настройки не изменятся</li>
            </ul>
          </div>
          
          <p className="warning-text">Это действие нельзя отменить!</p>
          
          <div className="modal-actions">
            <button 
              onClick={() => setShowResetModal(false)}
              className="btn btn-secondary"
            >
              Отмена
            </button>
            <button 
              onClick={handleResetData}
              className="btn btn-danger"
            >
              Сбросить прогресс
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Settings;