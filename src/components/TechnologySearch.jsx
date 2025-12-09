import { useState, useEffect, useRef } from 'react';
import './TechnologySearch.css';

function TechnologySearch({ searchQuery, onSearchChange, technologies }) {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Debounce для поиска
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      onSearchChange(localQuery);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [localQuery, onSearchChange]);

  useEffect(() => {
    if (localQuery.trim() && technologies.length > 0) {
      const matched = technologies
        .filter(tech => 
          tech.title.toLowerCase().includes(localQuery.toLowerCase()) ||
          tech.description.toLowerCase().includes(localQuery.toLowerCase()) ||
          (tech.category && tech.category.toLowerCase().includes(localQuery.toLowerCase()))
        )
        .slice(0, 5); 
        
      setSuggestions(matched);
      setShowSuggestions(matched.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [localQuery, technologies]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
  };

  const handleSuggestionClick = (tech) => {
    setLocalQuery(tech.title);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setLocalQuery('');
    onSearchChange('');
    setShowSuggestions(false);
  };

  const searchResultsCount = technologies.filter(tech => 
    tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).length;

  return (
    <div className="technology-search">
      <div className="search-header">
        <h3>🔍 Поиск технологий</h3>
        <div className="search-stats">
          <span className="stat-item">
            Всего: <strong>{technologies.length}</strong>
          </span>
          {searchQuery && (
            <span className="stat-item">
              Найдено: <strong>{searchResultsCount}</strong>
            </span>
          )}
        </div>
      </div>
      
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Введите название, описание или категорию..."
            value={localQuery}
            onChange={handleInputChange}
            className="search-input"
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          
          {localQuery && (
            <button 
              className="clear-search-btn"
              onClick={clearSearch}
              title="Очистить поиск"
            >
              ✕
            </button>
          )}
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map(tech => (
                <div 
                  key={tech.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(tech)}
                >
                  <div className="suggestion-title">{tech.title}</div>
                  <div className="suggestion-meta">
                    <span className="suggestion-category">{tech.category}</span>
                    <span className={`suggestion-status ${tech.status}`}>
                      {tech.status === 'completed' ? '✅' : 
                       tech.status === 'in-progress' ? '⏳' : '🆕'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="search-tips">
          <p>
            💡 Используйте поиск для быстрого нахождения технологий. 
            Поиск работает по названию, описанию и категории.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TechnologySearch;