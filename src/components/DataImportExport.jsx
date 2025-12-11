import { useState } from 'react';
import './DataImportExport.css';

function DataImportExport({ technologies, onImport }) {
// состояние для сообщений о статусе операций
const [status, setStatus] = useState('');
const [statusType, setStatusType] = useState('info'); // 'info', 'success', 'error'

const [isDragging, setIsDragging] = useState(false);

// экспорт данных в JSON-файл
const exportToJSON = () => {
    try {
        if (technologies.length === 0) {
            setStatus('Нет данных для экспорта');
            setStatusType('error');
            return;
        }

        // создаем структуру данных с метаинформацией
        const exportData = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            totalTechnologies: technologies.length,
            technologies: technologies
        };

        // преобразуем данные в JSON-строку с форматированием
        const dataStr = JSON.stringify(exportData, null, 2);

        // создаем Blob объект из строки
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        // создаем временную ссылку для скачивания
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `technologies_${new Date().toISOString().split('T')[0]}.json`;

        // программно кликаем по ссылке для начала скачивания
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // освобождаем память
        URL.revokeObjectURL(url);

        setStatus(`Экспортировано ${technologies.length} технологий`);
        setStatusType('success');
        
        // очистка статуса через 5 секунд
        setTimeout(() => setStatus(''), 5000);
        
    } catch (error) {
        setStatus(`Ошибка экспорта: ${error.message}`);
        setStatusType('error');
        console.error('Ошибка экспорта:', error);
    }
};

// импорт данных из JSON-файла
const importFromJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // проверка типа файла
    if (!file.name.endsWith('.json')) {
        setStatus('Выберите файл в формате JSON');
        setStatusType('error');
        return;
    }

    const reader = new FileReader();

    // обработчик завершения чтения файла
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);

            // проверка структуры данных
            if (!imported.technologies || !Array.isArray(imported.technologies)) {
                throw new Error('Неверный формат файла. Ожидается массив technologies');
            }

            // проверка каждого элемента массива
            const validTechnologies = imported.technologies.filter(tech => {
                return tech && typeof tech === 'object' && tech.title;
            });

            if (validTechnologies.length === 0) {
                throw new Error('Файл не содержит валидных технологий');
            }

            // вызываем callback для обработки импортированных данных
            if (onImport) {
                onImport(validTechnologies);
            }

            setStatus(`Импортировано ${validTechnologies.length} технологий из файла ${file.name}`);
            setStatusType('success');
            
            // очистка статуса через 5 секунд
            setTimeout(() => setStatus(''), 5000);
            
        } catch (error) {
            setStatus(`Ошибка импорта: ${error.message}`);
            setStatusType('error');
            console.error('Ошибка импорта:', error);
        }
    };

    // обработчик ошибок чтения
    reader.onerror = () => {
        setStatus('Ошибка чтения файла');
        setStatusType('error');
    };

    // запускаем асинхронное чтение файла как текста
    reader.readAsText(file);

    // сбрасываем значение input для возможности повторного импорта того же файла
    event.target.value = '';
};

// обработчики drag-and-drop
const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
};

const handleDragLeave = () => {
    setIsDragging(false);
};

const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    // проверка типа файла
    if (!file.name.endsWith('.json')) {
        setStatus('Разрешены только JSON файлы');
        setStatusType('error');
        return;
    }

    // создаем фиктивный input для обработки файла
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    // создаем DataTransfer для эмуляции выбора файла
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;
    
    // запускаем обработку импорта
    const event = { target: fileInput };
    importFromJSON(event);
};

// экспорт данных в формате CSV
const exportToCSV = () => {
    try {
        if (technologies.length === 0) {
            setStatus('Нет данных для экспорта');
            setStatusType('error');
            return;
        }

        // заголовки CSV
        const headers = ['Название', 'Описание', 'Категория', 'Сложность', 'Статус', 'Заметки'];
        
        // преобразуем данные в CSV строки
        const csvRows = technologies.map(tech => [
            `"${tech.title.replace(/"/g, '""')}"`,
            `"${(tech.description || '').replace(/"/g, '""')}"`,
            `"${tech.category || ''}"`,
            `"${tech.difficulty || ''}"`,
            `"${tech.status || ''}"`,
            `"${(tech.notes || '').replace(/"/g, '""')}"`
        ]);

        // создаем CSV контент
        const csvContent = [
            headers.join(','),
            ...csvRows.map(row => row.join(','))
        ].join('\n');

        // создаем Blob объект из CSV строки
        const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // создаем временную ссылку для скачивания
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `technologies_${new Date().toISOString().split('T')[0]}.csv`;

        // программно кликаем по ссылке для начала скачивания
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // освобождаем память
        URL.revokeObjectURL(url);

        setStatus(`Экспортировано ${technologies.length} технологий в CSV`);
        setStatusType('success');
        
        // очистка статуса через 5 секунд
        setTimeout(() => setStatus(''), 5000);
        
    } catch (error) {
        setStatus(`Ошибка экспорта CSV: ${error.message}`);
        setStatusType('error');
        console.error('Ошибка экспорта CSV:', error);
    }
};

return (
    <div className="data-import-export">
        <h1>📁 Импорт и экспорт данных</h1>
        
        {/* статусное сообщение */}
        {status && (
            <div className={`status-message status-${statusType}`} role="alert">
                {status}
            </div>
        )}

        {/* статистика */}
        <div className="data-stats">
            <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                    <h3>Всего технологий</h3>
                    <p className="stat-number">{technologies.length}</p>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                    <h3>Изучено</h3>
                    <p className="stat-number">
                        {technologies.filter(t => t.status === 'completed').length}
                    </p>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                    <h3>В процессе</h3>
                    <p className="stat-number">
                        {technologies.filter(t => t.status === 'in-progress').length}
                    </p>
                </div>
            </div>
        </div>

        {/* кнопки управления */}
        <div className="controls">
            <div className="export-buttons">
                <h3>📤 Экспорт данных</h3>
                <div className="buttons-group">
                    <button 
                        onClick={exportToJSON} 
                        disabled={technologies.length === 0}
                        className="btn btn-primary"
                    >
                        📄 Экспорт в JSON
                    </button>
                    <button 
                        onClick={exportToCSV} 
                        disabled={technologies.length === 0}
                        className="btn btn-secondary"
                    >
                        📊 Экспорт в CSV
                    </button>
                </div>
            </div>

            <div className="import-section">
                <h3>📥 Импорт данных</h3>
                <p className="section-description">
                    Поддерживается импорт из JSON файлов, экспортированных из этого приложения
                </p>
                
                <label className="file-input-label">
                    <input
                        type="file"
                        accept=".json"
                        onChange={importFromJSON}
                        style={{ display: 'none' }}
                    />
                    <div className="file-input-button">
                        📁 Выбрать JSON файл
                    </div>
                </label>
            </div>
        </div>

        {/* область drag-and-drop */}
        <div
            className={`drop-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            tabIndex="0"
            aria-label="Перетащите JSON файл сюда для импорта"
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    document.querySelector('.file-input-label input')?.click();
                }
            }}
        >
            <div className="drop-icon">📂</div>
            <h3>Перетащите JSON-файл сюда</h3>
            <p>или нажмите для выбора файла</p>
            <p className="drop-hint">
                Поддерживаются только файлы в формате JSON
            </p>
        </div>

        {/* инструкции */}
        <div className="instructions">
            <h3>📋 Инструкции</h3>
            <div className="instruction-cards">
                <div className="instruction-card">
                    <h4>Экспорт данных</h4>
                    <ul>
                        <li>JSON формат сохраняет все данные полностью</li>
                        <li>CSV формат удобен для открытия в Excel</li>
                        <li>Файлы автоматически сохраняются в папку загрузок</li>
                    </ul>
                </div>
                <div className="instruction-card">
                    <h4>Импорт данных</h4>
                    <ul>
                        <li>Поддерживаются только JSON файлы</li>
                        <li>Файл должен быть создан через экспорт из приложения</li>
                        <li>Импортированные данные добавляются к существующим</li>
                    </ul>
                </div>
                <div className="instruction-card">
                    <h4>Формат данных</h4>
                    <ul>
                        <li>Название технологии (обязательно)</li>
                        <li>Описание и категория</li>
                        <li>Статус изучения и заметки</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);
}
export default DataImportExport;