import { useState, useEffect, useCallback } from 'react';

function useTechnologiesApi() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [abortController, setAbortController] = useState(null);

  const fetchTechnologies = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);

      if (abortController) {
        abortController.abort();
      }

      const controller = new AbortController();
      setAbortController(controller);

      const response = await fetch('https://api.github.com/repos/kamranahmedse/developer-roadmap/contents', {
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();

      const mappedTechnologies = data
        .filter(item => item.type === 'dir' && item.name.includes('roadmap'))
        .map((item, index) => ({
          id: index + 1,
          title: item.name.replace('-', ' ').replace('roadmap', 'Roadmap').toUpperCase(),
          description: `Дорожная карта для ${item.name.replace('-', ' ').replace('roadmap', '')}`,
          category: getCategoryFromName(item.name),
          status: 'not-started',
          notes: '',
          difficulty: getDifficulty(index),
          resources: [
            `https://github.com/kamranahmedse/developer-roadmap/tree/master/${item.name}`,
            'https://roadmap.sh'
          ],
          apiSource: 'GitHub API'
        }))
        .slice(0, 10);
      if (mappedTechnologies.length === 0) {
        const mockTechnologies = [
          {
            id: 1,
            title: 'React',
            description: 'Библиотека для создания пользовательских интерфейсов',
            category: 'frontend',
            difficulty: 'beginner',
            status: 'not-started',
            notes: '',
            resources: ['https://react.dev', 'https://ru.reactjs.org'],
            apiSource: 'Mock Data'
          },
          {
            id: 2,
            title: 'Node.js',
            description: 'Среда выполнения JavaScript на сервере',
            category: 'backend',
            difficulty: 'intermediate',
            status: 'not-started',
            notes: '',
            resources: ['https://nodejs.org', 'https://nodejs.org/ru/docs/'],
            apiSource: 'Mock Data'
          },
          {
            id: 3,
            title: 'TypeScript',
            description: 'Типизированное надмножество JavaScript',
            category: 'language',
            difficulty: 'intermediate',
            status: 'not-started',
            notes: '',
            resources: ['https://www.typescriptlang.org'],
            apiSource: 'Mock Data'
          },
          {
            id: 4,
            title: 'Docker',
            description: 'Платформа для контейнеризации приложений',
            category: 'devops',
            difficulty: 'advanced',
            status: 'not-started',
            notes: '',
            resources: ['https://www.docker.com', 'https://docs.docker.com/'],
            apiSource: 'Mock Data'
          },
          {
            id: 5,
            title: 'GraphQL',
            description: 'Язык запросов для API',
            category: 'backend',
            difficulty: 'intermediate',
            status: 'not-started',
            notes: '',
            resources: ['https://graphql.org', 'https://www.howtographql.com/'],
            apiSource: 'Mock Data'
          }
        ];
        setTechnologies(mockTechnologies);
      } else {
        setTechnologies(mappedTechnologies);
      }

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(`Не удалось загрузить технологии: ${err.message}`);
        console.error('Ошибка загрузки:', err);
 
        const localData = localStorage.getItem('techTrackerData');
        if (localData) {
          setTechnologies(JSON.parse(localData));
          setError(null);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [abortController]);

  const getCategoryFromName = (name) => {
    if (name.includes('frontend')) return 'frontend';
    if (name.includes('backend')) return 'backend';
    if (name.includes('devops')) return 'devops';
    if (name.includes('android')) return 'mobile';
    if (name.includes('react')) return 'frontend';
    if (name.includes('node')) return 'backend';
    return 'other';
  };

  const getDifficulty = (index) => {
    const difficulties = ['beginner', 'intermediate', 'advanced'];
    return difficulties[index % difficulties.length];
  };

  const addTechnology = useCallback(async (techData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const newTech = {
        id: Date.now(),
        ...techData,
        status: techData.status || 'not-started',
        notes: techData.notes || '',
        createdAt: new Date().toISOString(),
        apiSource: 'User Added'
      };

      setTechnologies(prev => [...prev, newTech]);
      return newTech;

    } catch (err) {
      throw new Error('Не удалось добавить технологию');
    }
  }, []);

  const updateTechnology = useCallback(async (id, updates) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      setTechnologies(prev => 
        prev.map(tech => 
          tech.id === id ? { ...tech, ...updates } : tech
        )
      );

      return true;
    } catch (err) {
      throw new Error('Не удалось обновить технологию');
    }
  }, []);

  useEffect(() => {
    fetchTechnologies();
  
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, []);

  return {
    technologies,
    loading,
    error,
    refetch: fetchTechnologies,
    addTechnology,
    updateTechnology
  };
}

export default useTechnologiesApi;