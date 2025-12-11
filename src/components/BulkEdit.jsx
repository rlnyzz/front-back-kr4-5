import BulkStatusEditor from '../components/BulkStatusEditor';
import useTechnologies from '../hooks/useTechnologies';
import { useNavigate } from 'react-router-dom';
import './BulkEdit.css';

function BulkEdit() {
const { technologies, bulkUpdateStatuses } = useTechnologies();
const navigate = useNavigate();

const handleStatusUpdate = async (techIds, newStatus) => {
try {
const count = bulkUpdateStatuses(techIds, newStatus);
return count;
} catch (error) {
console.error('Ошибка обновления статусов:', error);
throw error;
}
};

const handleBack = () => {
navigate('/technologies');
};

return (
<div className="bulk-edit-page">
<div className="page-header">
<button onClick={handleBack} className="btn btn-back">
← Назад
</button>
<h1>⚡ Массовое редактирование статусов</h1>
</div>

text
  <div className="content">
    <BulkStatusEditor 
      technologies={technologies}
      onStatusUpdate={handleStatusUpdate}
    />
  </div>
</div>
);
}

export default BulkEdit;