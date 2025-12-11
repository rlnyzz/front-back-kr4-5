import { useState, useEffect } from 'react';
import './BulkStatusEditor.css';

function BulkStatusEditor({ technologies = [], onStatusUpdate }) {
// состояние выбранных технологий
const [selectedTechs, setSelectedTechs] = useState([]);
const [newStatus, setNewStatus] = useState('not-started');

// состояние фильтров
const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    search: ''
});

// состояние отправки
const [isUpdating, setIsUpdating] = useState(false);
const [updateResult, setUpdateResult] = useState(null);

// состояние группировки
const [groupBy, setGroupBy] = useState('none'); // 'none', 'category', 'status'

// обновление выбранных технологий при изменении фильтров
useEffect(() => {
    // Снимаем выделение с технологий, которые не проходят фильтр
    const filteredTechs = getFilteredTechnologies();
    const filteredTechIds = filteredTechs.map(tech => tech.id);
    
    setSelectedTechs(prev => 
        prev.filter(techId => filteredTechIds.includes(techId))
    );
}, [filters, technologies]);

// получение отфильтрованных технологий
const getFilteredTechnologies = () => {
    return technologies.filter(tech => {
        if (filters.category !== 'all' && tech.category !== filters.category) return false;
        if (filters.status !== 'all' && tech.status !== filters.status) return false;
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                tech.title.toLowerCase().includes(searchLower) ||
                tech.description.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });
};

// группировка технологий
const getGroupedTechnologies = () => {
    const filteredTechs = getFilteredTechnologies();
    
    if (groupBy === 'none') {
        return { 'Все технологии': filteredTechs };
    }
    
    if (groupBy === 'category') {
        const groups = {};
        filteredTechs.forEach(tech => {
            const category = tech.category || 'Без категории';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(tech);
        });
        return groups;
    }
    
    if (groupBy === 'status') {
        const groups = {
            'not-started': [],
            'in-progress': [],
            'completed': []
        };
        filteredTechs.forEach(tech => {
            if (groups[tech.status]) {
                groups[tech.status].push(tech);
            }
        });
        
        // Преобразуем в объект с читаемыми названиями
        return {
            'Не начато': groups['not-started'],
            'В процессе': groups['in-progress'],
            'Изучено': groups['completed']
        };
    }
    
    return { 'Все технологии': filteredTechs };
};

// выбор/отмена выбора технологии
const toggleTechSelection = (techId) => {
    setSelectedTechs(prev => 
        prev.includes(techId) 
            ? prev.filter(id => id !== techId)
            : [...prev, techId]
    );
};

// выбор всех технологий в текущей фильтрации
const selectAllFiltered = () => {
    const filteredTechs = getFilteredTechnologies();
    setSelectedTechs(filteredTechs.map(tech => tech.id));
};

// отмена выбора всех технологий
const deselectAll = () => {
    setSelectedTechs([]);
};

// обновление статуса выбранных технологий
const handleStatusUpdate = async () => {
    if (selectedTechs.length === 0) {
        setUpdateResult({
            type: 'error',
            message: 'Выберите хотя бы одну технологию'
        });
        return;
    }

    setIsUpdating(true);

    try {
        if (onStatusUpdate) {
            await onStatusUpdate(selectedTechs, newStatus);
        }

        setUpdateResult({
            type: 'success',
            message: `Обновлено ${selectedTechs.length} технологий. Новый статус: ${getStatusText(newStatus)}`
        });

        // Снимаем выделение после успешного обновления
        setSelectedTechs([]);

        // Очищаем сообщение через 5 секунд
        setTimeout(() => setUpdateResult(null), 5000);

    } catch (error) {
        setUpdateResult({
            type: 'error',
            message: `Ошибка обновления: ${error.message}`
        });
    } finally {
        setIsUpdating(false);
    }
};

// получение текста статуса
const getStatusText = (status) => {
    switch(status) {
        case 'not-started': return 'Не начато';
        case 'in-progress': return 'В процессе';
        case 'completed': return 'Изучено';
        default: return status;
    }
};

// получение иконки статуса
const getStatusIcon = (status) => {
    switch(status) {
        case 'not-started': return '🆕';
        case 'in-progress': return '⏳';
        case 'completed': return '✅';
        default: return '';
    }
};

// получение уникальных категорий
const getUniqueCategories = () => {
    const categories = new Set(technologies.map(tech => tech.category).filter(Boolean));
    return ['all', ...Array.from(categories)];
};

// сброс фильтров
const resetFilters = () => {
    setFilters({
        category: 'all',
        status: 'all',
        search: ''
    });
    setSelectedTechs([]);
};

const filteredTechnologies = getFilteredTechnologies();
const groupedTechnologies = getGroupedTechnologies();

return (
    <div className="bulk-status-editor">
        <h1>⚡ Массовое редактирование статусов</h1>
        
        {/* Результат обновления */}
        {updateResult && (
            <div className={`update-result ${updateResult.type}`} role="alert">
                <span className="result-icon">
                    {updateResult.type === 'success' ? '✓' : '✗'}
                </span>
                <span className="result-message">{updateResult.message}</span>
            </div>
        )}
        
        {/* Панель управления */}
        <div className="control-panel">
            <div className="stats-section">
                <div className="stat">
                    <div className="stat-label">Всего технологий</div>
                    <div className="stat-value">{technologies.length}</div>
                </div>
                <div className="stat">
                    <div className="stat-label">Отфильтровано</div>
                    <div className="stat-value">{filteredTechnologies.length}</div>
                </div>
                <div className="stat">
                    <div className="stat-label">Выбрано</div>
                    <div className="stat-value">{selectedTechs.length}</div>
                </div>
            </div>
            
            <div className="status-controls">
                <div className="status-selector">
                    <label htmlFor="new-status">
                        <span className="label-text">Новый статус:</span>
                        <span className="status-preview">
                            {getStatusIcon(newStatus)} {getStatusText(newStatus)}
                        </span>
                    </label>
                    <select
                        id="new-status"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        disabled={isUpdating}
                        aria-describedby="status-hint"
                    >
                        <option value="not-started">🆕 Не начато</option>
                        <option value="in-progress">⏳ В процессе</option>
                        <option value="completed">✅ Изучено</option>
                    </select>
                    <div id="status-hint" className="field-hint">
                        Будет применен ко всем выбранным технологиям
                    </div>
                </div>
                
                <button
                    onClick={handleStatusUpdate}
                    disabled={isUpdating || selectedTechs.length === 0}
                    className="btn btn-primary btn-update"
                    aria-busy={isUpdating}
                >
                    {isUpdating ? (
                        <>
                            <span className="spinner"></span>
                            Обновление...
                        </>
                    ) : (
                        `Обновить (${selectedTechs.length})`
                    )}
                </button>
            </div>
        </div>
        
        {/* Фильтры */}
        <div className="filters-section">
            <h3>Фильтры</h3>
            <div className="filters-grid">
                <div className="filter-group">
                    <label htmlFor="category-filter">Категория:</label>
                    <select
                        id="category-filter"
                        value={filters.category}
                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                        disabled={isUpdating}
                    >
                        <option value="all">Все категории</option>
                        {getUniqueCategories().slice(1).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                
                <div className="filter-group">
                    <label htmlFor="status-filter">Статус:</label>
                    <select
                        id="status-filter"
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        disabled={isUpdating}
                    >
                        <option value="all">Все статусы</option>
                        <option value="not-started">Не начато</option>
                        <option value="in-progress">В процессе</option>
                        <option value="completed">Изучено</option>
                    </select>
                </div>
                
                <div className="filter-group">
                    <label htmlFor="search-filter">Поиск:</label>
                    <input
                        id="search-filter"
                        type="text"
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        placeholder="Название или описание..."
                        disabled={isUpdating}
                        aria-label="Поиск технологий"
                    />
                </div>
                
                <div className="filter-group">
                    <label htmlFor="group-by">Группировка:</label>
                    <select
                        id="group-by"
                        value={groupBy}
                        onChange={(e) => setGroupBy(e.target.value)}
                        disabled={isUpdating}
                    >
                        <option value="none">Без группировки</option>
                        <option value="category">По категории</option>
                        <option value="status">По статусу</option>
                    </select>
                </div>
            </div>
            
            <div className="filter-actions">
                <button
                    onClick={resetFilters}
                    className="btn btn-secondary"
                    disabled={isUpdating}
                >
                    Сбросить фильтры
                </button>
                
                <div className="selection-actions">
                    <button
                        onClick={selectAllFiltered}
                        disabled={isUpdating || filteredTechnologies.length === 0}
                        className="btn btn-secondary btn-small"
                    >
                        Выбрать все ({filteredTechnologies.length})
                    </button>
                    <button
                        onClick={deselectAll}
                        disabled={isUpdating || selectedTechs.length === 0}
                        className="btn btn-secondary btn-small"
                    >
                        Снять выделение
                    </button>
                </div>
            </div>
        </div>
        
        {/* Список технологий */}
        <div className="technologies-section">
            <h3>
                Технологии
                <span className="counter">
                    ({filteredTechnologies.length} из {technologies.length})
                </span>
            </h3>
            
            {filteredTechnologies.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <p>Нет технологий, соответствующих фильтрам.</p>
                    <button
                        onClick={resetFilters}
                        className="btn btn-secondary"
                    >
                        Сбросить фильтры
                    </button>
                </div>
            ) : (
                <div className="technologies-list">
                    {Object.entries(groupedTechnologies).map(([groupName, techs]) => (
                        techs.length > 0 && (
                            <div key={groupName} className="tech-group">
                                {groupBy !== 'none' && (
                                    <h4 className="group-header">
                                        {groupName}
                                        <span className="group-count">({techs.length})</span>
                                    </h4>
                                )}
                                
                                <div className="tech-cards">
                                    {techs.map(tech => {
                                        const isSelected = selectedTechs.includes(tech.id);
                                        
                                        return (
                                            <div 
                                                key={tech.id}
                                                className={`tech-card ${isSelected ? 'selected' : ''}`}
                                                onClick={() => toggleTechSelection(tech.id)}
                                                role="checkbox"
                                                aria-checked={isSelected}
                                                tabIndex="0"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        toggleTechSelection(tech.id);
                                                    }
                                                }}
                                            >
                                                <div className="card-header">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => {}}
                                                        tabIndex="-1"
                                                        aria-label={`Выбрать ${tech.title}`}
                                                    />
                                                    <span className="status-indicator">
                                                        {getStatusIcon(tech.status)}
                                                    </span>
                                                    <h4>{tech.title}</h4>
                                                </div>
                                                
                                                <p className="tech-description">
                                                    {tech.description}
                                                </p>
                                                
                                                <div className="card-footer">
                                                    <span className="category-badge">
                                                        {tech.category}
                                                    </span>
                                                    <span className={`status-badge status-${tech.status}`}>
                                                        {getStatusText(tech.status)}
                                                    </span>
                                                </div>
                                                
                                                {isSelected && (
                                                    <div className="selected-overlay" aria-hidden="true">
                                                        <span className="checkmark">✓</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
        
        {/* Быстрые действия */}
        <div className="quick-actions">
            <h3>⚡ Быстрые действия</h3>
            <div className="action-buttons">
                <button
                    onClick={() => {
                        setNewStatus('completed');
                        selectAllFiltered();
                    }}
                    disabled={isUpdating || filteredTechnologies.length === 0}
                    className="btn action-btn success"
                >
                    ✅ Отметить все как изученные
                </button>
                <button
                    onClick={() => {
                        setNewStatus('not-started');
                        selectAllFiltered();
                    }}
                    disabled={isUpdating || filteredTechnologies.length === 0}
                    className="btn action-btn warning"
                >
                    🆕 Сбросить все статусы
                </button>
                <button
                    onClick={() => {
                        setNewStatus('in-progress');
                        const inProgressTechs = filteredTechnologies
                            .filter(tech => tech.status === 'not-started')
                            .map(tech => tech.id);
                        setSelectedTechs(inProgressTechs);
                    }}
                    disabled={isUpdating}
                    className="btn action-btn info"
                >
                    ⏳ Начать изучение не начатых
                </button>
            </div>
        </div>
        
        {/* Информация о доступности */}
        <div className="accessibility-info" role="note">
            <h3>♿ Информация о доступности</h3>
            <ul>
                <li>Используйте Tab для навигации по элементам</li>
                <li>Нажмите Enter или Пробел для выбора технологии</li>
                <li>Фильтры доступны для навигации с клавиатуры</li>
                <li>Статус обновления объявляется скринридерам</li>
            </ul>
        </div>
    </div>
);
}
export default BulkStatusEditor;