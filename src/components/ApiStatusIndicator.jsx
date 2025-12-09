import './ApiStatusIndicator.css';

function ApiStatusIndicator({ loading, error, onRetry, dataCount }) {
  return (
    <div className="api-status-indicator">
      <div className="status-header">
        <h3>📡 Статус подключения к API</h3>
        <div className={`status-dot ${loading ? 'loading' : error ? 'error' : 'success'}`}></div>
      </div>
      
      <div className="status-details">
        {loading ? (
          <div className="status-loading">
            <div className="spinner-small"></div>
            <span>Загрузка данных из API...</span>
          </div>
        ) : error ? (
          <div className="status-error">
            <span className="error-icon">⚠️</span>
            <div className="error-details">
              <p className="error-title">Ошибка подключения</p>
              <p className="error-message">{error}</p>
            </div>
            <button onClick={onRetry} className="retry-btn">
              Повторить
            </button>
          </div>
        ) : (
          <div className="status-success">
            <span className="success-icon">✅</span>
            <div className="success-details">
              <p className="success-title">Подключено успешно</p>
              <p className="success-message">
                Загружено {dataCount} технологий из внешних источников
              </p>
            </div>
          </div>
        )}
        
        <div className="status-tips">
          <p>💡 API используется для загрузки актуальных дорожных карт и технологий</p>
        </div>
      </div>
    </div>
  );
}

export default ApiStatusIndicator;