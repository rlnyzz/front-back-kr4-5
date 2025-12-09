import { useState } from 'react';
import './App.css';
import Greeting from './Greeting';
import UserCard from './UserCard';
import TaskList from './TaskList';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';
import TechnologyFilters from './components/TechnologyFilters';

const initialTechnologies = [
  { id: 1, title: 'React Components', description: 'Изучение базовых компонентов', status: 'completed' },
  { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'in-progress' },
  { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'not-started' },
  { id: 4, title: 'Props and Context', description: 'Передача данных между компонентами', status: 'completed' },
  { id: 5, title: 'Hooks', description: 'Использование хуков React', status: 'in-progress' },
  { id: 6, title: 'Routing', description: 'Навигация между страницами', status: 'not-started' },
  { id: 7, title: 'API Integration', description: 'Работа с внешними API', status: 'not-started' },
  { id: 8, title: 'Testing', description: 'Написание тестов для компонентов', status: 'not-started' }
];

function App() {
  const [technologies, setTechnologies] = useState(initialTechnologies);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'not-started', 'in-progress', 'completed'

  const handleStatusChange = (id) => {
    setTechnologies(prevTech => 
      prevTech.map(tech => {
        if (tech.id === id) {
          // Циклическое изменение статуса: not-started → in-progress → completed → not-started
          const statusOrder = ['not-started', 'in-progress', 'completed'];
          const currentIndex = statusOrder.indexOf(tech.status);
          const nextIndex = (currentIndex + 1) % statusOrder.length;
          return { ...tech, status: statusOrder[nextIndex] };
        }
        return tech;
      })
    );
  };

  const markAllCompleted = () => {
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  const resetAllStatuses = () => {
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

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

  const filteredTechnologies = technologies.filter(tech => {
    if (activeFilter === 'all') return true;
    return tech.status === activeFilter;
  });

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
            <p>Нет технологий с выбранным статусом.</p>
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
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
        
        <div className="filter-info">
          <p>
            Показано: {filteredTechnologies.length} из {technologies.length} технологий
            {activeFilter !== 'all' && ` (только ${activeFilter})`}
          </p>
        </div>
      </div>
      
      <TaskList />
    </div>
  );
}

export default App;