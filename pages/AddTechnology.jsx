import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import './AddTechnology.css';

function AddTechnology() {
  const navigate = useNavigate();
  const { addTechnology } = useTechnologies();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'frontend',
    difficulty: 'beginner',
    resources: [''],
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'frontend', label: 'Фронтенд' },
    { value: 'backend', label: 'Бэкенд' },
    { value: 'mobile', label: 'Мобильная разработка' },
    { value: 'devops', label: 'DevOps' },
    { value: 'database', label: 'Базы данных' },
    { value: 'testing', label: 'Тестирование' },
    { value: 'tools', label: 'Инструменты' },
    { value: 'other', label: 'Другое' }
  ];

  const difficulties = [
    { value: 'beginner', label: 'Начальный' },
    { value: 'intermediate', label: 'Средний' },
    { value: 'advanced', label: 'Продвинутый' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Название обязательно';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleResourceChange = (index, value) => {
    const newResources = [...formData.resources];
    newResources[index] = value;
    setFormData(prev => ({
      ...prev,
      resources: newResources
    }));
  };

  const addResourceField = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, '']
    }));
  };

  const removeResourceField = (index) => {
    if (formData.resources.length > 1) {
      setFormData(prev => ({
        ...prev,
        resources: prev.resources.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Фильтруем пустые ресурсы
      const filteredResources = formData.resources.filter(r => r.trim() !== '');
      
      const techData = {
        ...formData,
        resources: filteredResources,
        status: 'not-started'
      };
      
      const newTech = addTechnology(techData);
      
      // Показываем уведомление об успехе
      alert(`Технология "${newTech.title}" успешно добавлена!`);
      
      // Перенаправляем на страницу технологии или списка
      navigate(`/technology/${newTech.id}`);
      
    } catch (error) {
      console.error('Ошибка при добавлении технологии:', error);
      alert('Произошла ошибка при добавлении технологии');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Вы уверены? Все несохраненные изменения будут потеряны.')) {
      navigate('/technologies');
    }
  };

  return (
    <div className="add-technology-page">
      <div className="page-header">
        <h1>➕ Добавить новую технологию</h1>
        <button onClick={handleCancel} className="btn btn-secondary">
          Отмена
        </button>
      </div>

      <form onSubmit={handleSubmit} className="technology-form">
        <div className="form-section">
          <h2>📝 Основная информация</h2>
          
          <div className="form-group">
            <label htmlFor="title" className="required">
              Название технологии
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Например: React, Node.js, Docker..."
              className={errors.title ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="required">
              Описание
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Опишите, что это за технология и зачем её изучать..."
              rows="4"
              className={errors.description ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
        </div>

        <div className="form-section">
          <h2>🏷️ Классификация</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Категория</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Уровень сложности</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>🔗 Полезные ресурсы</h2>
          <p className="section-description">
            Добавьте ссылки на документацию, курсы, статьи и другие полезные материалы
          </p>
          
          {formData.resources.map((resource, index) => (
            <div key={index} className="resource-field">
              <input
                type="url"
                value={resource}
                onChange={(e) => handleResourceChange(index, e.target.value)}
                placeholder="https://example.com"
                disabled={isSubmitting}
              />
              {formData.resources.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeResourceField(index)}
                  className="remove-resource-btn"
                  disabled={isSubmitting}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addResourceField}
            className="btn btn-secondary btn-small"
            disabled={isSubmitting}
          >
            + Добавить ещё ресурс
          </button>
        </div>

        <div className="form-section">
          <h2>📝 Персональные заметки</h2>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Добавьте ваши заметки, цели изучения, сроки..."
            rows="5"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-small"></span>
                Добавление...
              </>
            ) : (
              'Добавить технологию'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTechnology;