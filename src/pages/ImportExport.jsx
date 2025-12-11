import DataImportExport from '../components/DataImportExport';
import useTechnologies from '../hooks/useTechnologies';
import { useNavigate } from 'react-router-dom';
import './ImportExport.css';

function ImportExport() {
const { technologies, importTechnologies } = useTechnologies();
const navigate = useNavigate();

const handleImport = (importedTechnologies) => {
try {
const count = importTechnologies(importedTechnologies);
alert(`Успешно импортировано ${count} технологий!`);
} catch (error) {
alert(`Ошибка импорта: ${error.message}`);
}
};

const handleBack = () => {
navigate('/technologies');
};

return (
<div className="import-export-page">
<div className="page-header">
<button onClick={handleBack} className="btn btn-back">
← Назад
</button>
<h1>📁 Управление данными</h1>
</div>
<div className="content">
    <DataImportExport 
      technologies={technologies}
      onImport={handleImport}
    />
  </div>
</div>
);
}

export default ImportExport;