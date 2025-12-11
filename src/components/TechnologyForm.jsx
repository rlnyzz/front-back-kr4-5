import { useState, useEffect } from 'react';
import './TechnologyForm.css';

function TechnologyForm({ onSave, onCancel, initialData = {} }) {
const [formData, setFormData] = useState({
title: initialData.title || '',
description: initialData.description || '',
category: initialData.category || 'frontend',
difficulty: initialData.difficulty || 'beginner',
deadline: initialData.deadline || '',
resources: initialData.resources || [''],
notes: initialData.notes || ''
});
// состояние для хранения ошибок валидации
const [errors, setErrors] = useState({});

// флаг валидности всей формы
const [isFormValid, setIsFormValid] = useState(false);

// флаг отправки формы
const [isSubmitting, setIsSubmitting] = useState(false);

// функция валидации всей формы
const validateForm = () => {
    const newErrors = {};

    // валидация названия технологии
    if (!formData.title.trim()) {
        newErrors.title = 'Название технологии обязательно';
    } else if (formData.title.trim().length < 2) {
        newErrors.title = 'Название должно содержать минимум 2 символа';
    } else if (formData.title.trim().length > 50) {
        newErrors.title = 'Название не должно превышать 50 символов';
    }

    // валидация описания
    if (!formData.description.trim()) {
        newErrors.description = 'Описание технологии обязательно';
    } else if (formData.description.trim().length < 10) {
        newErrors.description = 'Описание должно содержать минимум 10 символов';
    } else if (formData.description.trim().length > 500) {
        newErrors.description = 'Описание не должно превышать 500 символов';
    }

    // валидация дедлайна (не должен быть в прошлом)
    if (formData.deadline) {
        const deadlineDate = new Date(formData.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // обнуляем время для сравнения только дат

        if (deadlineDate < today) {
            newErrors.deadline = 'Дедлайн не может быть в прошлом';
        }
    }

    // валидация URL-адресов ресурсов
    formData.resources.forEach((resource, index) => {
        if (resource && !isValidUrl(resource)) {
            newErrors[`resource_${index}`] = 'Введите корректный URL';
        }
    });

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
};

// проверка корректности URL
const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

// запуск валидации при каждом изменении formData
useEffect(() => {
    validateForm();
}, [formData]);

// обработчик изменения обычных полей (input, select, textarea)
const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
};

// обработчик изменения конкретного ресурса в массиве
const handleResourceChange = (index, value) => {
    const newResources = [...formData.resources];
    newResources[index] = value;
    setFormData(prev => ({
        ...prev,
        resources: newResources
    }));
};

// добавление нового пустого поля для ресурса
const addResourceField = () => {
    setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, '']
    }));
};

// удаление поля ресурса по индексу (минимум одно поле должно остаться)
const removeResourceField = (index) => {
    if (formData.resources.length > 1) {
        const newResources = formData.resources.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            resources: newResources
        }));
    }
};

// обработчик отправки формы
const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid || isSubmitting) {
        return;
    }

    setIsSubmitting(true);

    try {
        // очищаем пустые ресурсы перед сохранением
        const cleanedData = {
            ...formData,
            resources: formData.resources.filter(resource => resource.trim() !== ''),
            status: 'not-started',
            createdAt: new Date().toISOString()
        };

        await onSave(cleanedData);
    } catch (error) {
        console.error('Ошибка при сохранении:', error);
    } finally {
        setIsSubmitting(false);
    }
};

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

return (
    <form onSubmit={handleSubmit} className="technology-form" noValidate>
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {isSubmitting && 'Отправка формы...'}
        </div>

        <h2>{initialData.title ? 'Редактирование технологии' : 'Добавление новой технологии'}</h2>

        {/* поле названия */}
        <div className="form-group">
            <label htmlFor="title" className="required">
                Название технологии *
            </label>
            <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'error' : ''}
                placeholder="Например: React, Node.js, TypeScript"
                aria-describedby={errors.title ? 'title-error' : undefined}
                aria-required="true"
                aria-invalid={!!errors.title}
                disabled={isSubmitting}
                required
            />
            {errors.title && (
                <span id="title-error" className="error-message" role="alert">
                    {errors.title}
                </span>
            )}
        </div>

        {/* поле описания */}
        <div className="form-group">
            <label htmlFor="description" className="required">
                Описание *
            </label>
            <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={errors.description ? 'error' : ''}
                placeholder="Опишите, что это за технология и зачем её изучать..."
                aria-describedby={errors.description ? 'description-error' : undefined}
                aria-required="true"
                aria-invalid={!!errors.description}
                disabled={isSubmitting}
                required
            />
            {errors.description && (
                <span id="description-error" className="error-message" role="alert">
                    {errors.description}
                </span>
            )}
        </div>

        <div className="form-row">
            {/* выбор категории */}
            <div className="form-group">
                <label htmlFor="category">Категория</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={isSubmitting}
                >
                    {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* выбор сложности */}
            <div className="form-group">
                <label htmlFor="difficulty">Сложность</label>
                <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
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

        {/* дедлайн */}
        <div className="form-group">
            <label htmlFor="deadline">Дедлайн (необязательно)</label>
            <input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                className={errors.deadline ? 'error' : ''}
                aria-describedby={errors.deadline ? 'deadline-error' : undefined}
                aria-invalid={!!errors.deadline}
                disabled={isSubmitting}
            />
            {errors.deadline && (
                <span id="deadline-error" className="error-message" role="alert">
                    {errors.deadline}
                </span>
            )}
        </div>

        {/* список ресурсов для изучения */}
        <div className="form-group">
            <label>Ресурсы для изучения</label>
            {formData.resources.map((resource, index) => (
                <div key={index} className="resource-field">
                    <input
                        type="url"
                        value={resource}
                        onChange={(e) => handleResourceChange(index, e.target.value)}
                        placeholder="https://example.com"
                        className={errors[`resource_${index}`] ? 'error' : ''}
                        aria-describedby={errors[`resource_${index}`] ? `resource-${index}-error` : undefined}
                        aria-invalid={!!errors[`resource_${index}`]}
                        disabled={isSubmitting}
                    />
                    {formData.resources.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeResourceField(index)}
                            className="btn-remove"
                            aria-label={`Удалить ресурс ${index + 1}`}
                            disabled={isSubmitting}
                        >
                            ✕
                        </button>
                    )}
                    {errors[`resource_${index}`] && (
                        <span id={`resource-${index}-error`} className="error-message" role="alert">
                            {errors[`resource_${index}`]}
                        </span>
                    )}
                </div>
            ))}
            <button
                type="button"
                onClick={addResourceField}
                className="btn-add-resource"
                disabled={isSubmitting}
            >
                + Добавить ресурс
            </button>
        </div>

        {/* персональные заметки */}
        <div className="form-group">
            <label htmlFor="notes">Персональные заметки</label>
            <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Добавьте ваши заметки, цели изучения, сроки..."
                rows="5"
                disabled={isSubmitting}
            />
        </div>

        {/* кнопки действий */}
        <div className="form-actions">
            <button
                type="button"
                onClick={onCancel}
                className="btn-secondary"
                disabled={isSubmitting}
            >
                Отмена
            </button>
            <button
                type="submit"
                className="btn-primary"
                disabled={!isFormValid || isSubmitting}
                aria-busy={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <span className="spinner-small"></span>
                        Сохранение...
                    </>
                ) : (
                    'Сохранить технологию'
                )}
            </button>
        </div>

        {/* подсказка по заполнению */}
        <div className="form-hint">
            <p><strong>💡 Подсказки:</strong></p>
            <ul>
                <li>Поля, отмеченные * - обязательные для заполнения</li>
                <li>Ресурсы должны быть валидными URL-адресами</li>
                <li>Дедлайн можно установить для отслеживания сроков изучения</li>
            </ul>
        </div>
    </form>
);
}

export default TechnologyForm;