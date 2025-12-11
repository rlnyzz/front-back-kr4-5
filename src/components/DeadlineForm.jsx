import { useState, useEffect } from 'react';
import './DeadlineForm.css';

function DeadlineForm({ technologies = [], onSaveDeadlines }) {
// состояние для сроков изучения
const [deadlines, setDeadlines] = useState({});
const [errors, setErrors] = useState({});

// состояние отправки формы
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitSuccess, setSubmitSuccess] = useState(false);

// состояние фильтрации
const [filter, setFilter] = useState({
    status: 'all',
    category: 'all'
});

// состояние массового редактирования
const [bulkDeadline, setBulkDeadline] = useState('');
const [selectedTechs, setSelectedTechs] = useState([]);

// инициализация дедлайнов из технологий
useEffect(() => {
    const initialDeadlines = {};
    technologies.forEach(tech => {
        if (tech.deadline) {
            initialDeadlines[tech.id] = tech.deadline;
        }
    });
    setDeadlines(initialDeadlines);
}, [technologies]);

// валидация даты дедлайна
const validateDeadline = (dateString, techId) => {
    if (!dateString) return null; // пустая дата допустима
    
    const deadlineDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (deadlineDate < today) {
        return 'Дедлайн не может быть в прошлом';
    }
    
    // проверка на слишком далекую дату (больше 5 лет)
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 5);
    
    if (deadlineDate > maxDate) {
        return 'Дедлайн не может быть больше чем через 5 лет';
    }
    
    return null;
};

// обработчик изменения дедлайна
const handleDeadlineChange = (techId, dateString) => {
    const error = validateDeadline(dateString, techId);
    
    setDeadlines(prev => ({
        ...prev,
        [techId]: dateString
    }));
    
    setErrors(prev => ({
        ...prev,
        [techId]: error
    }));
};

// обработчик массового установления дедлайна
const handleBulkDeadlineChange = () => {
    if (!bulkDeadline) return;
    
    const error = validateDeadline(bulkDeadline, 'bulk');
    if (error) {
        setErrors(prev => ({ ...prev, bulk: error }));
        return;
    }
    
    const newDeadlines = { ...deadlines };
    selectedTechs.forEach(techId => {
        newDeadlines[techId] = bulkDeadline;
    });
    
    setDeadlines(newDeadlines);
    setBulkDeadline('');
    setSelectedTechs([]);
    setErrors(prev => ({ ...prev, bulk: null }));
};

// выбор/отмена выбора технологии
const toggleTechSelection = (techId) => {
    setSelectedTechs(prev => 
        prev.includes(techId) 
            ? prev.filter(id => id !== techId)
            : [...prev, techId]
    );
};

// выбор всех технологий
const selectAllTechs = () => {
    const filteredTechs = getFilteredTechnologies();
    setSelectedTechs(filteredTechs.map(tech => tech.id));
};

// отмена выбора всех технологий
const deselectAllTechs = () => {
    setSelectedTechs([]);
};

// получение отфильтрованных технологий
const getFilteredTechnologies = () => {
    return technologies.filter(tech => {
        if (filter.status !== 'all' && tech.status !== filter.status) return false;
        if (filter.category !== 'all' && tech.category !== filter.category) return false;
        return true;
    });
};

// обработчик отправки формы
const handleSubmit = async (e) => {
    e.preventDefault();
    
    // проверка валидности всех дедлайнов
    const newErrors = {};
    Object.entries(deadlines).forEach(([techId, deadline]) => {
        const error = validateDeadline(deadline, techId);
        if (error) {
            newErrors[techId] = error;
        }
    });
    
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }
    
    setIsSubmitting(true);
    
    try {
        if (onSaveDeadlines) {
            await onSaveDeadlines(deadlines);
        }
        
        setSubmitSuccess(true);
        
        // скрытие сообщения об успехе через 3 секунды
        setTimeout(() => setSubmitSuccess(false), 3000);
        
    } catch (error) {
        console.error('Ошибка сохранения дедлайнов:', error);
    } finally {
        setIsSubmitting(false);
    }
};

// сброс всех дедлайнов
const handleReset = () => {
    if (window.confirm('Вы уверены? Это сбросит все установленные дедлайны.')) {
        setDeadlines({});
        setSelectedTechs([]);
        setBulkDeadline('');
        setErrors({});
    }
};

// получение уникальных категорий
const categories = ['all', ...new Set(technologies.map(tech => tech.category))];

const filteredTechnologies = getFilteredTechnologies();

return (
    <div className="deadline-form-container">
        <h1>📅 Управление сроками изучения</h1>
        
        {/* Статусное сообщение */}
        {submitSuccess && (
            <div className="success-message" role="alert" aria-live="assertive">
                <span className="success-icon">✓</span>
                <div>
                    <h3>Успешно!</h3>
                    <p>Сроки изучения сохранены.</p>
                </div>
            </div>
        )}
        
        {/* Общая статистика */}
        <div className="deadline-stats">
            <div className="stat-item">
                <div className="stat-label">Всего технологий</div>
                <div className="stat-value">{technologies.length}</div>
            </div>
            <div className="stat-item">
                <div className="stat-label">С установленным сроком</div>
                <div className="stat-value">
                    {Object.keys(deadlines).length}
                </div>
            </div>
            <div className="stat-item">
                <div className="stat-label">Просрочено</div>
                <div className="stat-value error">
                    {Object.entries(deadlines).filter(([_, deadline]) => {
                        if (!deadline) return false;
                        const deadlineDate = new Date(deadline);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return deadlineDate < today;
                    }).length}
                </div>
            </div>
        </div>
        
        {/* Фильтры */}
        <div className="filters-section">
            <h3>Фильтры</h3>
            <div className="filters">
                <div className="filter-group">
                    <label htmlFor="status-filter">Статус:</label>
                    <select
                        id="status-filter"
                        value={filter.status}
                        onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                    >
                        <option value="all">Все статусы</option>
                        <option value="not-started">Не начато</option>
                        <option value="in-progress">В процессе</option>
                        <option value="completed">Изучено</option>
                    </select>
                </div>
                
                <div className="filter-group">
                    <label htmlFor="category-filter">Категория:</label>
                    <select
                        id="category-filter"
                        value={filter.category}
                        onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat === 'all' ? 'Все категории' : cat}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
        
        {/* Массовое редактирование */}
        <div className="bulk-edit-section">
            <h3>Массовое редактирование</h3>
            <div className="bulk-controls">
                <div className="bulk-date">
                    <label htmlFor="bulk-deadline">Установить общий дедлайн:</label>
                    <input
                        id="bulk-deadline"
                        type="date"
                        value={bulkDeadline}
                        onChange={(e) => {
                            setBulkDeadline(e.target.value);
                            setErrors(prev => ({ ...prev, bulk: null }));
                        }}
                        className={errors.bulk ? 'error' : ''}
                        aria-describedby={errors.bulk ? 'bulk-error' : undefined}
                    />
                    {errors.bulk && (
                        <span id="bulk-error" className="error-message" role="alert">
                            {errors.bulk}
                        </span>
                    )}
                </div>
                
                <div className="bulk-actions">
                    <button
                        type="button"
                        onClick={handleBulkDeadlineChange}
                        disabled={!bulkDeadline || selectedTechs.length === 0}
                        className="btn btn-primary"
                    >
                        Применить к выбранным ({selectedTechs.length})
                    </button>
                    
                    <div className="selection-actions">
                        <button
                            type="button"
                            onClick={selectAllTechs}
                            className="btn btn-secondary btn-small"
                        >
                            Выбрать все ({filteredTechnologies.length})
                        </button>
                        <button
                            type="button"
                            onClick={deselectAllTechs}
                            className="btn btn-secondary btn-small"
                        >
                            Снять выделение
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Форма дедлайнов */}
        <form onSubmit={handleSubmit} className="deadline-form" noValidate>
            <div className="technologies-list">
                {filteredTechnologies.length === 0 ? (
                    <div className="no-techs-message">
                        <p>Нет технологий, соответствующих фильтрам.</p>
                    </div>
                ) : (
                    filteredTechnologies.map(tech => {
                        const deadline = deadlines[tech.id] || '';
                        const error = errors[tech.id];
                        const isOverdue = deadline && new Date(deadline) < new Date();
                        const isSelected = selectedTechs.includes(tech.id);
                        
                        return (
                            <div 
                                key={tech.id} 
                                className={`tech-deadline-item ${isSelected ? 'selected' : ''} ${isOverdue ? 'overdue' : ''}`}
                            >
                                <div className="tech-info">
                                    <div className="tech-header">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleTechSelection(tech.id)}
                                            id={`select-${tech.id}`}
                                            aria-label={`Выбрать ${tech.title}`}
                                        />
                                        <label htmlFor={`select-${tech.id}`} className="tech-title">
                                            <h4>{tech.title}</h4>
                                            <div className="tech-meta">
                                                <span className={`status-badge status-${tech.status}`}>
                                                    {tech.status === 'completed' ? '✅' : 
                                                     tech.status === 'in-progress' ? '⏳' : '🆕'}
                                                    {tech.status === 'completed' ? 'Изучено' : 
                                                     tech.status === 'in-progress' ? 'В процессе' : 'Не начато'}
                                                </span>
                                                <span className="category-badge">
                                                    {tech.category}
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <p className="tech-description">
                                        {tech.description}
                                    </p>
                                </div>
                                
                                <div className="deadline-input">
                                    <label htmlFor={`deadline-${tech.id}`}>
                                        Дедлайн изучения:
                                    </label>
                                    <input
                                        id={`deadline-${tech.id}`}
                                        type="date"
                                        value={deadline}
                                        onChange={(e) => handleDeadlineChange(tech.id, e.target.value)}
                                        className={error ? 'error' : ''}
                                        aria-describedby={error ? `deadline-error-${tech.id}` : undefined}
                                        aria-invalid={!!error}
                                    />
                                    {error && (
                                        <span id={`deadline-error-${tech.id}`} className="error-message" role="alert">
                                            {error}
                                        </span>
                                    )}
                                    {deadline && isOverdue && !error && (
                                        <span className="overdue-warning" role="alert">
                                            ⚠️ Просрочено!
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            
            {/* Кнопки действий */}
            <div className="form-actions">
                <button
                    type="button"
                    onClick={handleReset}
                    className="btn btn-secondary"
                    disabled={isSubmitting}
                >
                    Сбросить все сроки
                </button>
                
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner"></span>
                            Сохранение...
                        </>
                    ) : (
                        'Сохранить сроки'
                    )}
                </button>
            </div>
        </form>
        
        {/* Подсказки */}
        <div className="hints-section">
            <h3>💡 Подсказки</h3>
            <ul>
                <li>Установите реалистичные сроки изучения каждой технологии</li>
                <li>Используйте массовое редактирование для одинаковых сроков</li>
                <li>Просроченные дедлайны подсвечиваются красным</li>
                <li>Дедлайн не может быть установлен в прошлом</li>
            </ul>
        </div>
    </div>
);
}
export default DeadlineForm;