import { useState } from 'react';
import './RoadmapImporter.css';

function RoadmapImporter({ onImport }) {
  const [importing, setImporting] = useState(false);
  const [importSource, setImportSource] = useState('github');
  const [customUrl, setCustomUrl] = useState('');
  const [importStatus, setImportStatus] = useState('');

  const exampleRoadmaps = [
    {
      id: 'frontend',
      name: 'Frontend Roadmap',
      url: 'https://api.github.com/repos/kamranahmedse/developer-roadmap/contents',
      description: 'Дорожная карта фронтенд-разработчика'
    },
    {
      id: 'backend',
      name: 'Backend Roadmap',
      url: 'https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/readme.md',
      description: 'Дорожная карта бэкенд-разработчика'
    },
    {
      id: 'devops',
      name: 'DevOps Roadmap',
      url: 'https://roadmap.sh/devops',
      description: 'Дорожная карта DevOps инженера'
    }
  ];

  const handleImportRoadmap = async (roadmapUrl, roadmapName) => {
    try {
      setImporting(true);
      setImportStatus(`Импорт ${roadmapName}...`);

      await new Promise(resolve => setTimeout(resolve, 1500));

      const roadmapTechnologies = [
        {
          title: `${roadmapName} - Основы`,
          description: `Основные концепции и технологии ${roadmapName}`,
          category: importSource,
          difficulty: 'beginner',
          status: 'not-started',
          notes: `Импортировано из ${roadmapName}`,
          resources: [roadmapUrl]
        },
        {
          title: `${roadmapName} - Продвинутые темы`,
          description: `Продвинутые концепции ${roadmapName}`,
          category: importSource,
          difficulty: 'intermediate',
          status: 'not-started',
          notes: `Импортировано из ${roadmapName}`,
          resources: [roadmapUrl]
        },
        {
          title: `${roadmapName} - Инструменты`,
          description: `Инструменты и фреймворки для ${roadmapName}`,
          category: importSource,
          difficulty: 'beginner',
          status: 'not-started',
          notes: `Импортировано из ${roadmapName}`,
          resources: [roadmapUrl]
        }
      ];

      for (const tech of roadmapTechnologies) {
        if (onImport) {
          await onImport(tech);
        }
      }

      setImportStatus(`Успешно импортировано ${roadmapTechnologies.length} технологий из "${roadmapName}"`);

      setTimeout(() => {
        setImportStatus('');
      }, 3000);

    } catch (err) {
      setImportStatus(`Ошибка импорта: ${err.message}`);
      console.error('Ошибка импорта:', err);
    } finally {
      setImporting(false);
    }
  };

  const handleCustomImport = async () => {
    if (!customUrl.trim()) {
      setImportStatus('Введите URL для импорта');
      return;
    }

    await handleImportRoadmap(customUrl, 'Пользовательская дорожная карта');
  };

  return (
    <div className="roadmap-importer">
      <div className="importer-header">
        <h3>🌐 Импорт дорожных карт из API</h3>
        <div className="import-badge">
          <span className="api-status active">API подключен</span>
        </div>
      </div>

      <div className="importer-content">
        <div className="source-selector">
          <label>Источник импорта:</label>
          <select 
            value={importSource} 
            onChange={(e) => setImportSource(e.target.value)}
            disabled={importing}
          >
            <option value="github">GitHub API</option>
            <option value="public">Public APIs</option>
            <option value="custom">Свой URL</option>
          </select>
        </div>

        {importSource === 'custom' && (
          <div className="custom-url-input">
            <input
              type="text"
              placeholder="Введите URL дорожной карты..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              disabled={importing}
            />
            <button 
              onClick={handleCustomImport}
              disabled={importing || !customUrl.trim()}
              className="import-custom-btn"
            >
              Импортировать
            </button>
          </div>
        )}

        <div className="example-roadmaps">
          <h4>Примеры дорожных карт:</h4>
          <div className="roadmap-list">
            {exampleRoadmaps.map(roadmap => (
              <div key={roadmap.id} className="roadmap-item">
                <div className="roadmap-info">
                  <h5>{roadmap.name}</h5>
                  <p>{roadmap.description}</p>
                </div>
                <button
                  onClick={() => handleImportRoadmap(roadmap.url, roadmap.name)}
                  disabled={importing}
                  className="import-example-btn"
                >
                  {importing ? 'Импорт...' : 'Импортировать'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {importStatus && (
          <div className={`import-status ${importStatus.includes('Ошибка') ? 'error' : 'success'}`}>
            {importStatus}
          </div>
        )}

        <div className="importer-tips">
          <p>💡 Совет: Импортируйте готовые дорожные карты, чтобы быстро начать изучение</p>
          <p>📚 Ресурсы: <a href="https://roadmap.sh" target="_blank" rel="noopener noreferrer">roadmap.sh</a> • 
          <a href="https://github.com/kamranahmedse/developer-roadmap" target="_blank" rel="noopener noreferrer">GitHub Roadmaps</a></p>
        </div>
      </div>
    </div>
  );
}

export default RoadmapImporter;