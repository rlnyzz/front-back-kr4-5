import { useState, useEffect } from 'react';
import './App.css';
import Greeting from './Greeting';
import UserCard from './UserCard';
import TaskList from './TaskList';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';
import TechnologyFilters from './components/TechnologyFilters';
import SearchBar from './components/SearchBar';

const initialTechnologies = [
  { 
    id: 1, 
    title: 'React Components', 
    description: 'Изучение базовых компонентов', 
    status: 'completed',
    notes: 'Компоненты должны быть чистыми и переиспользуемыми.'
  },
  { 
    id: 2, 
    title: 'JSX Syntax', 
    description: 'Освоение синтаксиса JSX', 
    status: 'in-progress',
    notes: 'JSX - это синтаксический сахар для React.createElement()'
  },
  { 
    id: 3, 
    title: 'State Management', 
    description: 'Работа с состоянием компонентов', 
    status: 'not-started',
    notes: ''
  },
  { 
    id: 4, 
    title: 'Props and Context', 
    description: 'Передача данных между компонентами', 
    status: 'completed',
    notes: 'Context позволяет избежать пропс-дриллинга.'
  },
  { 
    id: 5, 
    title: 'Hooks', 
    description: 'Использование хуков React', 
    status: 'in-progress',
    notes: 'useEffect для side effects, useState для состояния'
  },
  { 
    id: 6, 
    title: 'Routing', 
    description: 'Навигация между страницами', 
    status: 'not-started',
    notes: ''
  },
  { 
    id: 7, 
    title: 'API Integration', 
    description: 'Работа с внешними API', 
    status: 'not-started',
    notes: ''
  },
  { 
    id: 8, 
    title: 'Testing', 
    description: 'Написание тестов для компонентов', 
    status: 'not-started',
    notes: ''
  }
];

function App() {
  const [technologies, setTechnologies] = useState(() => {
    // Загружаем данные из localStorage при первом рендере
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      console.log('Данные загружены из localStorage');
      return JSON.parse(saved);
    }
    console.log('Используются начальные данные');
    return initialTechnologies;
  });
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Сохраняем технологии в localStorage при любом изменении
  useEffect(() => {
    localStorage.setItem('techTrackerData', JSON.stringify(technologies));
    console.log('Данные сохранены в localStorage');
  }, [technologies]);

  // Функция для изменения статуса технологии
  const handleStatusChange = (id) => {
    setTechnologies(prevTech => 
      prevTech.map(tech => {
        if (tech.id === id) {
          const statusOrder = ['not-started', 'in-progress', 'completed'];
          const currentIndex = statusOrder.indexOf(tech.status);
          const nextIndex = (currentIndex + 1) % statusOrder.length;
          return { ...tech, status: statusOrder[nextIndex] };
        }
        return tech;
      })
    );
  };

  // Функция для обновления заметок технологии
  const updateTechnologyNotes = (techId, newNotes) => {
    setTechnologies(prevTech =>
      prevTech.map(tech =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  // Функция для отметки всех как выполненных
  const markAllCompleted = () => {
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  // Функция для сброса всех статусов
  const resetAllStatuses = () => {
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  // Функция для случайного выбора следующей технологии
  const selectRandomTechnology = () => {
    const notStartedTech = technologies.filter(tech => tech.status === 'not-started');
    
    if (notStartedTech.length === 0) {
      alert('Все технологии уже в процессе или завершены!');
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * notStartedTech.length);
    const selectedTech = notStartedTech[randomIndex];
    
    setTechnologies(prevTech => 
      prevTech.map(tech => 
        tech.id === selectedTech.id ? { ...tech, status: 'in-progress' } : tech
      )
    );
    
    alert(`Выбрана технология: "${selectedTech.title}" для изучения!`);
  };

  // Функция для очистки localStorage
  const clearLocalStorage = () => {
    localStorage.removeItem('techTrackerData');
    setTechnologies(initialTechnologies);
    alert('Данные сброшены до начального состояния!');
  };

  // Комбинированная фильтрация: сначала по поиску, затем по статусу
  const filteredTechnologies = technologies.filter(tech => {
    // Поиск по названию и описанию
    const matchesSearch = searchQuery === '' || 
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Фильтр по статусу
    const matchesFilter = activeFilter === 'all' || tech.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Подсчет технологий по статусам для статистики
  const stats = {
    total: technologies.length,
    completed: technologies.filter(tech => tech.status === 'completed').length,
    inProgress: technologies.filter(tech => tech.status === 'in-progress').length,
    notStarted: technologies.filter(tech => tech.status === 'not-started').length,
  };

  return (
    <div className="App">
      <Greeting />
      
      <UserCard
        name="Виталий Сысоев"
        role="Администратор"
        avatarUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfVMhpKmVy_-iwfRLAiNiaDslMa-2oEz7KTw&s"
        isOnline={true}
      />
      
      <ProgressHeader technologies={technologies} />
      
      <div className="storage-controls">
        <button className="clear-storage-btn" onClick={clearLocalStorage}>
          🔄 Сбросить все данные
        </button>
        <span className="storage-hint">
          Данные сохраняются автоматически при изменении
        </span>
      </div>
      
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultsCount={filteredTechnologies.length}
        totalCount={technologies.length}
      />
      
      <QuickActions
        onMarkAllCompleted={markAllCompleted}
        onResetAllStatuses={resetAllStatuses}
        onSelectRandomTech={selectRandomTechnology}
        hasNotStartedTech={stats.notStarted > 0}
      />
      
      <TechnologyFilters 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        stats={stats}
      />
      
      <div className="technology-section">
        <h2>🛣️ Дорожная карта изучения технологий</h2>
        
        {filteredTechnologies.length === 0 ? (
          <div className="no-results">
            <p>🚫 Не найдено технологий по вашему запросу.</p>
            <p>Попробуйте изменить поисковый запрос или фильтр.</p>
          </div>
        ) : (
          <div className="technology-grid">
            {filteredTechnologies.map((tech) => (
              <TechnologyCard
                key={tech.id}
                id={tech.id}
                title={tech.title}
                description={tech.description}
                status={tech.status}
                notes={tech.notes}
                onStatusChange={handleStatusChange}
                onNotesChange={updateTechnologyNotes}
              />
            ))}
          </div>
        )}
        
        <div className="filter-info">
          <p>
            📊 Показано: <strong>{filteredTechnologies.length}</strong> из <strong>{technologies.length}</strong> технологий
            {searchQuery && ` по запросу "${searchQuery}"`}
            {activeFilter !== 'all' && ` (статус: ${activeFilter})`}
          </p>
        </div>
      </div>
      
      <TaskList />
    </div>
  );
}

export default App;