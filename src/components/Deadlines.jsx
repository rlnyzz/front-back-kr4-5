import DeadlineForm from '../components/DeadlineForm';
import useTechnologies from '../hooks/useTechnologies';
import { useNavigate } from 'react-router-dom';
import './Deadlines.css';

function Deadlines() {
const { technologies, updateDeadlines } = useTechnologies();
const navigate = useNavigate();

const handleSaveDeadlines = async (deadlines) => {
try {
updateDeadlines(deadlines);
return true;
} catch (error) {
console.error('Ошибка сохранения дедлайнов:', error);
throw error;
}
};

const handleBack = () => {
navigate('/technologies');
};

return (
<div className="deadlines-page">
<div className="page-header">
<button onClick={handleBack} className="btn btn-back">
← Назад
</button>
<h1>📅 Управление сроками изучения</h1>
</div>

  <div className="content">
    <DeadlineForm 
      technologies={technologies}
      onSaveDeadlines={handleSaveDeadlines}
    />
  </div>
</div>
);
}

export default Deadlines;