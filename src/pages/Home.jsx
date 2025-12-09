import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">🚀 Трекер изучения технологий</h1>
          <p className="hero-subtitle">
            Управляйте своим прогрессом в изучении программирования и технологий
          </p>
          <div className="hero-actions">
            <Link to="/technologies" className="btn btn-primary btn-large">
              📚 Начать изучение
            </Link>
            <Link to="/add-technology" className="btn btn-secondary btn-large">
              ➕ Добавить технологию
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="tech-icons">
            <span className="tech-icon">⚛️</span>
            <span className="tech-icon">🌐</span>
            <span className="tech-icon">📱</span>
            <span className="tech-icon">🔧</span>
            <span className="tech-icon">⚡</span>
            <span className="tech-icon">🎯</span>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">📋 Возможности трекера</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Отслеживание прогресса</h3>
            <p className="feature-description">
              Визуализируйте ваш прогресс с помощью графиков и статистики
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏷️</div>
            <h3 className="feature-title">Категории и теги</h3>
            <p className="feature-description">
              Организуйте технологии по категориям и уровню сложности
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3 className="feature-title">Персональные заметки</h3>
            <p className="feature-description">
              Добавляйте заметки и полезные ссылки к каждой технологии
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3 className="feature-title">Импорт из API</h3>
            <p className="feature-description">
              Загружайте готовые дорожные карты из публичных API
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📤</div>
            <h3 className="feature-title">Экспорт данных</h3>
            <p className="feature-description">
              Сохраняйте и переносите ваши данные между устройствами
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Цели и напоминания</h3>
            <p className="feature-description">
              Ставьте цели и получайте рекомендации по изучению
            </p>
          </div>
        </div>
      </section>

      <section className="quick-start-section">
        <h2 className="section-title">🚀 Быстрый старт</h2>
        <div className="quick-start-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Добавьте технологии</h3>
              <p>Начните с добавления технологий, которые хотите изучить</p>
              <Link to="/add-technology" className="step-link">
                Добавить технологию →
              </Link>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Отслеживайте прогресс</h3>
              <p>Отмечайте статус изучения каждой технологии</p>
              <Link to="/technologies" className="step-link">
                Просмотреть технологии →
              </Link>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Анализируйте статистику</h3>
              <p>Смотрите вашу статистику и ставьте новые цели</p>
              <Link to="/statistics" className="step-link">
                Посмотреть статистику →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Готовы начать?</h2>
          <p>Присоединяйтесь к тысячам разработчиков, которые используют наш трекер для системного изучения технологий</p>
          <Link to="/technologies" className="btn btn-primary btn-extra-large">
            🚀 Начать прямо сейчас
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;