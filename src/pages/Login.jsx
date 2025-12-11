import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Имя пользователя обязательно';
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Проверка учетных данных (в реальном приложении здесь был бы запрос к API)
      if (formData.username === 'admin' && formData.password === 'password') {
        // Сохраняем данные в localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', formData.username);
        
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }
        
        if (onLogin) {
          onLogin(formData.username);
        }
        
        // Получаем URL, откуда пользователь пришел (или куда хотел попасть)
        const from = location.state?.from?.pathname || '/';
        
        // Перенаправляем на сохраненную страницу или на главную
        navigate(from, { replace: true });
        
      } else {
        setErrors({ general: 'Неверное имя пользователя или пароль' });
      }
    } catch (error) {
      setErrors({ general: 'Произошла ошибка при входе. Пожалуйста, попробуйте снова.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Автоматически заполняем форму демо-данными
    setFormData({
      username: 'demo',
      password: 'demo123',
      rememberMe: false
    });
    
    // Очищаем ошибки при демо-входе
    setErrors({});
  };

  const handleSocialLogin = (provider) => {
    alert(`Вход через ${provider} в демо-режиме не реализован. Используйте демо-вход.`);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Link to="/" className="back-link">
            ← На главную
          </Link>
          <h1>🔐 Вход в систему</h1>
          <p>Войдите в ваш аккаунт для доступа ко всем функциям</p>
          
          {location.state?.from && (
            <div className="login-redirect-notice">
              ⚠️ Для доступа к запрошенной странице требуется авторизация
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {errors.general && (
            <div className="error-alert">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Введите имя пользователя"
              className={errors.username ? 'error' : ''}
              disabled={isLoading}
              autoComplete="username"
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Введите пароль"
              className={errors.password ? 'error' : ''}
              disabled={isLoading}
              autoComplete="current-password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <span className="checkmark"></span>
              Запомнить меня
            </label>
            
            <Link to="/forgot-password" className="forgot-link">
              Забыли пароль?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-login"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-small"></span>
                Вход...
              </>
            ) : (
              'Войти'
            )}
          </button>

          <div className="demo-section">
            <p className="demo-text">Хотите попробовать демо-версию?</p>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="btn btn-secondary btn-demo"
              disabled={isLoading}
            >
              🚀 Войти как демо-пользователь
            </button>
            
            <div className="demo-credentials">
              <small>Логин: <strong>demo</strong> | Пароль: <strong>demo123</strong></small>
            </div>
          </div>

          <div className="divider">
            <span>или</span>
          </div>

          <div className="social-login">
            <button 
              type="button" 
              className="social-btn google"
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
            >
              <span className="social-icon">🔍</span>
              Войти через Google
            </button>
            <button 
              type="button" 
              className="social-btn github"
              onClick={() => handleSocialLogin('GitHub')}
              disabled={isLoading}
            >
              <span className="social-icon">💻</span>
              Войти через GitHub
            </button>
          </div>

          <div className="register-link">
            <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
            <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
              По вопросам доступа обратитесь к администратору
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;