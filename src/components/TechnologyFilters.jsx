import './components/TechnologyFilters.css';

function TechnologyFilters({ activeFilter, onFilterChange, stats }) {
  const filters = [
    { key: 'all', label: 'Все', count: stats.total },
    { key: 'not-started', label: 'Не начато', count: stats.notStarted },
    { key: 'in-progress', label: 'В процессе', count: stats.inProgress },
    { key: 'completed', label: 'Изучено', count: stats.completed }
  ];

  return (
    <div className="technology-filters">
      <h3>🔍 Фильтр по статусу</h3>
      <div className="filters-container">
        {filters.map(filter => (
          <button
            key={filter.key}
            className={`filter-btn ${filter.key} ${activeFilter === filter.key ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.key)}
          >
            <span className="filter-label">{filter.label}</span>
            <span className="filter-count">{filter.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TechnologyFilters;