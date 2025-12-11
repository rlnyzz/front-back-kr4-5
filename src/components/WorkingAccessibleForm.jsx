import { useState } from 'react';
import './WorkingAccessibleForm.css';

function WorkingAccessibleForm() {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [message, setMessage] = useState('');
const [errors, setErrors] = useState({});

// состояние отправки
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitSuccess, setSubmitSuccess] = useState(false);

// валидация формы
const validateForm = () => {
    const newErrors = {};

    // валидация имени
    if (!name.trim()) {
        newErrors.name = 'Имя обязательно для заполнения';
    } else if (name.trim().length < 2) {
        newErrors.name = 'Имя должно содержать минимум 2 символа';
    } else if (name.trim().length > 50) {
        newErrors.name = 'Имя не должно превышать 50 символов';
    }

    // валидация email с помощью регулярного выражения
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        newErrors.email = 'Email обязателен для заполнения';
    } else if (!emailRegex.test(email)) {
        newErrors.email = 'Введите корректный email адрес';
    }

    // валидация сообщения
    if (!message.trim()) {
        newErrors.message = 'Сообщение обязательно для заполнения';
    } else if (message.trim().length < 10) {
        newErrors.message = 'Сообщение должно содержать минимум 10 символов';
    } else if (message.trim().length > 1000) {
        newErrors.message = 'Сообщение не должно превышать 1000 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

// обработчик отправки формы
const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        // Фокусируемся на первом поле с ошибкой
        const firstErrorField = document.querySelector('.error');
        if (firstErrorField) {
            firstErrorField.focus();
        }
        return;
    }

    setIsSubmitting(true);

    // имитация отправки на сервер
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setSubmitSuccess(true);
        
        // очистка формы после успешной отправки
        setName('');
        setEmail('');
        setMessage('');
        setErrors({});

        // скрытие сообщения об успехе через 5 секунд
        setTimeout(() => {
            setSubmitSuccess(false);
        }, 5000);
        
    } catch (error) {
        console.error('Ошибка отправки:', error);
    } finally {
        setIsSubmitting(false);
    }
};

return (
    <div className="accessible-form-container">
        <h1 id="form-title">Контактная форма</h1>
        
        {/* область для скринридера - объявляет статус отправки */}
        <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
        >
            {isSubmitting && 'Отправка формы...'}
            {submitSuccess && 'Форма успешно отправлена!'}
        </div>

        {/* визуальное сообщение об успехе */}
        {submitSuccess && (
            <div className="success-message" role="alert" aria-live="assertive">
                <span className="success-icon">✓</span>
                <div>
                    <h3>Спасибо!</h3>
                    <p>Ваше сообщение успешно отправлено. Мы ответим вам в ближайшее время.</p>
                </div>
            </div>
        )}

        <form onSubmit={handleSubmit} noValidate aria-labelledby="form-title">
            {/* поле имени */}
            <div className="form-field">
                <label htmlFor="contact-name">
                    Ваше имя <span className="required-star" aria-label="обязательное поле">*</span>
                </label>
                <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : 'name-hint'}
                    className={errors.name ? 'error' : ''}
                    placeholder="Введите ваше имя"
                    disabled={isSubmitting}
                    autoComplete="name"
                />
                <div id="name-hint" className="field-hint">
                    Введите ваше полное имя
                </div>
                {errors.name && (
                    <span id="name-error" className="error-text" role="alert">
                        {errors.name}
                    </span>
                )}
            </div>

            {/* поле email */}
            <div className="form-field">
                <label htmlFor="contact-email">
                    Email <span className="required-star" aria-label="обязательное поле">*</span>
                </label>
                <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : 'email-hint'}
                    className={errors.email ? 'error' : ''}
                    placeholder="example@domain.com"
                    disabled={isSubmitting}
                    autoComplete="email"
                />
                <div id="email-hint" className="field-hint">
                    Мы отправим ответ на этот адрес
                </div>
                {errors.email && (
                    <span id="email-error" className="error-text" role="alert">
                        {errors.email}
                    </span>
                )}
            </div>

            {/* поле сообщения */}
            <div className="form-field">
                <label htmlFor="contact-message">
                    Сообщение <span className="required-star" aria-label="обязательное поле">*</span>
                </label>
                <textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="5"
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : 'message-hint'}
                    className={errors.message ? 'error' : ''}
                    placeholder="Опишите вашу проблему или вопрос..."
                    disabled={isSubmitting}
                />
                <div id="message-hint" className="field-hint">
                    Минимум 10 символов. Опишите подробно ваш вопрос.
                </div>
                {errors.message && (
                    <span id="message-error" className="error-text" role="alert">
                        {errors.message}
                    </span>
                )}
                <div className="char-counter">
                    Символов: {message.length}/1000
                </div>
            </div>

            {/* кнопка отправки */}
            <div className="form-actions">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className="submit-btn"
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner"></span>
                            Отправка...
                        </>
                    ) : (
                        'Отправить сообщение'
                    )}
                </button>
                
                <button
                    type="button"
                    onClick={() => {
                        setName('');
                        setEmail('');
                        setMessage('');
                        setErrors({});
                    }}
                    className="clear-btn"
                    disabled={isSubmitting}
                >
                    Очистить форму
                </button>
            </div>
        </form>

        {/* Информация о доступности */}
        <div className="accessibility-info" role="note" aria-label="Информация о доступности формы">
            <h3>♿ Информация о доступности</h3>
            <ul>
                <li>Все поля формы имеют соответствующие метки (label)</li>
                <li>Ошибки валидации объявляются скринридерам немедленно</li>
                <li>Форма поддерживает навигацию с клавиатуры (Tab, Shift+Tab)</li>
                <li>Статус отправки формы доступен для скринридеров</li>
                <li>Обязательные поля помечены звёздочкой и aria-required</li>
            </ul>
        </div>
    </div>
);
}

export default WorkingAccessibleForm;