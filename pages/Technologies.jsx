import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TechnologyCard from '../components/TechnologyCard';
import TechnologyFilters from '../components/TechnologyFilters';
import SearchBar from '../components/SearchBar';
import QuickActions from '../components/QuickActions';
import useTechnologies from '../hooks/useTechnologies';
import './Technologies.css';

function Technologies() {
  const { 
    technologies, 
    updateStatus, 
    updateNotes,
    markAllCompleted,
    resetAllStatuses,
    filterTechnologies 
  } = useTechnologies();
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTech, setFilteredTech] = useState(technologies);

  useEffect(() => {
    const filtered = filterTechnologies({
      status: activeFilter !== 'all' ? activeFilter : undefined,
      search: searchQuery
    });
    setFilteredTech(filtered);
  }, [technologies, activeFilter, searchQuery, filterTechnologies]);

  const stats = {
    total: technologies.length,
    completed: technologies.filter(tech => tech.status === 'completed').length,
    inProgress: technologies.filter(tech => tech.status === 'in-progress').length,
    notStarted: technologies.filter(tech => tech.status === 'not-started').length,
  };

  const handleRandomTech = () => {
    const notStartedTech = technologies.filter(tech => tech.status === 'not-started');
    if (notStartedTech.length === 0) {
      alert('Все технологии уже в процессе или завершены!');
      return;
    }
    const randomTech = notStartedTech[Math.floor(Math.random() * notStartedTech.length)];
    alert(`Рекомендуем изучить: "${randomTech.title}"`);
  };

  return (
    <div className="technologies-page">
      <div className="page-header">
        <h1>💻 Все технологии</h1>
        <div className="page-actions">
          <Link to="/add-technology" className="btn btn-primary">
            ➕ Добавить технологию
          </Link>
        </div>
      </div>

      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        technologies={technologies}
      />

      <QuickActions
        onMarkAllCompleted={markAllCompleted}
        onResetAllStatuses={resetAllStatuses}
        onSelectRandomTech={handleRandomTech}
        hasNotStartedTech={stats.notStarted > 0}
        technologies={technologies}
      />

      <TechnologyFilters 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        stats={stats}
      />

      <div className="technologies-container">
        <div className="technologies-header">
          <h2>
            {searchQuery ? `Результаты поиска: "${searchQuery}"` : 'Дорожная карта'}
          </h2>
          <div className="technologies-stats">
            <span className="stat-item">
              Всего: <strong>{technologies.length}</strong>
            </span>
            <span className="stat-item">
              Показано: <strong>{filteredTech.length}</strong>
            </span>
            {activeFilter !== 'all' && (
              <span className="stat-item">
                Фильтр: <strong>{activeFilter}</strong>
              </span>
            )}
          </div>
        </div>

        {filteredTech.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Технологии не найдены</h3>
            <p>
              {searchQuery 
                ? `По запросу "${searchQuery}" ничего не найдено`
                : 'Пока нет технологий. Добавьте первую!'}
            </p>
            <Link to="/add-technology" className="btn btn-primary">
              Добавить технологию
            </Link>
          </div>
        ) : (
          <div className="technologies-grid">
            {filteredTech.map((tech) => (
              <TechnologyCard
                key={tech.id}
                id={tech.id}
                title={tech.title}
                description={tech.description}
                status={tech.status}
                notes={tech.notes}
                category={tech.category}
                difficulty={tech.difficulty}
                resources={tech.resources}
                onStatusChange={updateStatus}
                onNotesChange={updateNotes}
              />
            ))}
          </div>
        )}
      </div>

      <div className="export-section">
        <h3>📤 Экспорт данных</h3>
        <p>Вы можете экспортировать все ваши технологии для резервного копирования или переноса</p>
        <button className="btn btn-secondary" onClick={() => {
          const dataStr = JSON.stringify(technologies, null, 2);
          const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
          const link = document.createElement('a');
          link.href = dataUri;
          link.download = 'technologies-backup.json';
          link.click();
        }}>
          📥 Скачать резервную копию
        </button>
      </div>
    </div>
  );
}

export default Technologies;