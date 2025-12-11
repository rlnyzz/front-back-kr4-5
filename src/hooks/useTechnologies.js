import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

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
deadline: '2024-12-31',
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
deadline: '2024-11-30',
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
deadline: '2024-10-15',
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

// Массовое обновление статусов
const bulkUpdateStatuses = useCallback((techIds, newStatus) => {
setTechnologies(prev =>
prev.map(tech =>
techIds.includes(tech.id) ? { ...tech, status: newStatus } : tech
)
);
return techIds.length;
}, [setTechnologies]);

// Обновление дедлайнов
const updateDeadlines = useCallback((deadlines) => {
setTechnologies(prev =>
prev.map(tech => {
const newDeadline = deadlines[tech.id];
return newDeadline !== undefined ? { ...tech, deadline: newDeadline } : tech;
})
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
return updatedData;
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

const importTechnologies = useCallback(async (importedTechs) => {
try {
setLoading(true);
setError(null);
const newTechnologies = importedTechs.map(tech => ({
    ...tech,
    id: tech.id || Date.now() + Math.random(),
    createdAt: tech.createdAt || new Date().toISOString(),
    status: tech.status || 'not-started',
    notes: tech.notes || ''
  }));
  
  setTechnologies(prev => [...prev, ...newTechnologies]);
  return newTechnologies.length;
  
} catch (err) {
  setError(`Ошибка импорта: ${err.message}`);
  throw err;
} finally {
  setLoading(false);
}
}, [setTechnologies]);

const importFromFile = useCallback(async (file) => {
try {
setLoading(true);
setError(null);
 const text = await file.text();
  const data = JSON.parse(text);
  
  if (!data.technologies || !Array.isArray(data.technologies)) {
    throw new Error('Некорректный формат файла. Ожидается массив technologies');
  }

  return await importTechnologies(data.technologies);
  
} catch (err) {
  setError(`Ошибка импорта: ${err.message}`);
  throw err;
} finally {
  setLoading(false);
}
}, [importTechnologies]);

const filterTechnologies = useCallback((filters = {}) => {
return technologies.filter(tech => {
if (filters.status && tech.status !== filters.status) return false;
if (filters.category && tech.category !== filters.category) return false;
if (filters.difficulty && tech.difficulty !== filters.difficulty) return false;
if (filters.hasDeadline === true && !tech.deadline) return false;
if (filters.hasDeadline === false && tech.deadline) return false;
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

// Получение технологий с просроченными дедлайнами
const getOverdueTechnologies = useCallback(() => {
const today = new Date();
today.setHours(0, 0, 0, 0);
return technologies.filter(tech => {
  if (!tech.deadline || tech.status === 'completed') return false;
  const deadlineDate = new Date(tech.deadline);
  return deadlineDate < today;
});
}, [technologies]);

// Получение технологий с ближайшими дедлайнами
const getUpcomingDeadlines = useCallback((days = 7) => {
const today = new Date();
today.setHours(0, 0, 0, 0);
const futureDate = new Date();
futureDate.setDate(today.getDate() + days);
futureDate.setHours(23, 59, 59, 999);

return technologies.filter(tech => {
  if (!tech.deadline || tech.status === 'completed') return false;
  const deadlineDate = new Date(tech.deadline);
  return deadlineDate >= today && deadlineDate <= futureDate;
});
}, [technologies]);

return {
technologies,
loading,
error,
progress: calculateProgress(),
updateStatus,
bulkUpdateStatuses,
updateDeadlines,
updateNotes,
addTechnology,
editTechnology,
deleteTechnology,
markAllCompleted,
resetAllStatuses,
importTechnologies,
importFromFile,
filterTechnologies,
groupByStatus,
getOverdueTechnologies,
getUpcomingDeadlines,
refetch: () => setTechnologies([...technologies])
};
}
export default useTechnologies;