import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from '../../useLocalStorage';

const initialTechnologies = [
  {
    id: 1,
    title: 'React Components',
    description: 'Изучение базовых компонентов',
    status: 'not-started',
    notes: '',
    category: 'frontend',
    difficulty: 'beginner',
    resources: ['https://react.dev'],
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Node.js Basics',
    description: 'Основы серверного JavaScript',
    status: 'not-started',
    notes: '',
    category: 'backend',
    difficulty: 'beginner',
    resources: ['https://nodejs.org'],
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'HTML & CSS',
    description: 'Основы веб-разработки',
    status: 'completed',
    notes: 'Важная база для фронтенда',
    category: 'frontend',
    difficulty: 'beginner',
    resources: ['https://developer.mozilla.org'],
    createdAt: new Date().toISOString()
  }
];

function useTechnologies() {
  const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateStatus = useCallback((techId, newStatus) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, status: newStatus } : tech
      )
    );
  }, [setTechnologies]);

  const updateNotes = useCallback((techId, newNotes) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  }, [setTechnologies]);

  const addTechnology = useCallback((techData) => {
    const newTech = {
      id: Date.now(),
      status: 'not-started',
      notes: '',
      createdAt: new Date().toISOString(),
      ...techData
    };
    
    setTechnologies(prev => [...prev, newTech]);
    return newTech;
  }, [setTechnologies]);

  const deleteTechnology = useCallback((techId) => {
    setTechnologies(prev => prev.filter(tech => tech.id !== techId));
  }, [setTechnologies]);

  const markAllCompleted = useCallback(() => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'completed' }))
    );
  }, [setTechnologies]);

  const resetAllStatuses = useCallback(() => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'not-started' }))
    );
  }, [setTechnologies]);

  const calculateProgress = useCallback(() => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  }, [technologies]);

  const importFromFile = useCallback(async (file) => {
    try {
      setLoading(true);
      setError(null);
      
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!data.technologies || !Array.isArray(data.technologies)) {
        throw new Error('Некорректный формат файла');
      }
    
      const importedTech = data.technologies.map(tech => ({
        ...tech,
        id: tech.id || Date.now() + Math.random(),
        createdAt: tech.createdAt || new Date().toISOString()
      }));
      
      setTechnologies(prev => [...prev, ...importedTech]);
      return importedTech.length;
      
    } catch (err) {
      setError(`Ошибка импорта: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setTechnologies]);

  const filterTechnologies = useCallback((filters = {}) => {
    return technologies.filter(tech => {
      if (filters.status && tech.status !== filters.status) return false;
      if (filters.category && tech.category !== filters.category) return false;
      if (filters.difficulty && tech.difficulty !== filters.difficulty) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          tech.title.toLowerCase().includes(searchLower) ||
          tech.description.toLowerCase().includes(searchLower) ||
          (tech.notes && tech.notes.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });
  }, [technologies]);

  const groupByStatus = useCallback(() => {
    return {
      'not-started': technologies.filter(tech => tech.status === 'not-started'),
      'in-progress': technologies.filter(tech => tech.status === 'in-progress'),
      'completed': technologies.filter(tech => tech.status === 'completed')
    };
  }, [technologies]);

  return {
    technologies,
    loading,
    error,
    progress: calculateProgress(),
    updateStatus,
    updateNotes,
    addTechnology,
    deleteTechnology,
    markAllCompleted,
    resetAllStatuses,
    importFromFile,
    filterTechnologies,
    groupByStatus,
    refetch: () => setTechnologies([...technologies]) 
  };
}

export default useTechnologies;