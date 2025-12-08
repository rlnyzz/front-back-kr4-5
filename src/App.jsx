import './App.css';
import Greeting from './Greeting';
import UserCard from './UserCard';
import TaskList from './TaskList';
import ProgressHeader from './ProgressHeader';
import TechnologyCard from './TechnologyCard';

// Тестовые данные для технологий
const technologies = [
  { id: 1, title: 'React Components', description: 'Изучение базовых компонентов', status: 'completed' },
  { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'in-progress' },
  { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'not-started' },
  { id: 4, title: 'Props and Context', description: 'Передача данных между компонентами', status: 'completed' },
  { id: 5, title: 'Hooks', description: 'Использование хуков React', status: 'in-progress' },
  { id: 6, title: 'Routing', description: 'Навигация между страницами', status: 'not-started' }
];

function App() {
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
      
      <div className="technology-section">
        <h2>🛣️ Дорожная карта изучения технологий</h2>
        <div className="technology-grid">
          {technologies.map((tech) => (
            <TechnologyCard
              key={tech.id}
              title={tech.title}
              description={tech.description}
              status={tech.status}
            />
          ))}
        </div>
      </div>
      
      <TaskList />
    </div>
  );
}

export default App;