import './SearchBar.css';

function SearchBar({ searchQuery, onSearchChange, resultsCount, totalCount }) {
  return (
    <div className="search-bar">
      <div className="search-header">
        <h3>🔍 Поиск технологий</h3>
        <span className="search-stats">
          Найдено: <strong>{resultsCount}</strong> из {totalCount}
        </span>
      </div>
      
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Введите название технологии или описание..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button 
            className="clear-search-btn"
            onClick={() => onSearchChange('')}
            title="Очистить поиск"
          >
            ✕
          </button>
        )}
      </div>
      
      {searchQuery && (
        <div className="search-tips">
          <p>💡 Поиск работает по названию и описанию технологий. Регистр не учитывается.</p>
        </div>
      )}
    </div>
  );
}

export default SearchBar;