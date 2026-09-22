import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './PracticeCatalog.scss';

export default function PracticeCatalog() {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Загрузка всех модулей
      const { data: modulesData, error: modError } = await supabase
        .from('modules')
        .select('*')
        .order('id', { ascending: true });

      if (modError) throw modError;

      // 2. Получение текущего пользователя из Supabase Auth (auth.users)
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Запрос прогресса авторизованного пользователя
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('module_id, completed_percentage, is_completed')
          .eq('user_id', user.id);

        if (progressData) {
          const progressMap = {};
          progressData.forEach((item) => {
            progressMap[item.module_id] = item;
          });
          setUserProgress(progressMap);
        }
      }

      setModules(modulesData || []);
    } catch (err) {
      console.error('Ошибка при загрузке каталога:', err);
    } finally {
      setLoading(false);
    }
  };

  // Группировка модулей по дисциплине
  const mathModules = modules.filter(
    (m) => m.category?.toLowerCase() === 'math' || !m.category
  );
  const readingModules = modules.filter(
    (m) => m.category?.toLowerCase().includes('reading')
  );

  const renderModuleCard = (module) => {
    const progress = userProgress[module.id];
    const percentage = progress?.completed_percentage || 0;

    // Плашка статуса
    let badgeClass = 'badge-gray';
    let badgeText = 'Не начато';

    if (percentage > 0 && percentage < 100) {
      badgeClass = 'badge-green';
      badgeText = `${percentage}% Выполнено`;
    } else if (percentage === 100 || progress?.is_completed) {
      badgeClass = 'badge-green';
      badgeText = 'Завершено';
    }

    return (
      <div 
        key={module.id} 
        className="card-1"
        onClick={() => navigate(`/QuizPractice?moduleId=${module.id}`)}
        style={{ cursor: 'pointer' }}
      >
        <div className="card-head">
          <h3>{module.title}</h3>
          <span className={badgeClass}>{badgeText}</span>
        </div>
        <p className="desc">
          {module.description || `${module.questions_count || 0} вопросов • ${module.est_time_minutes || 35} мин`}
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="block-practice" style={{ textAlign: 'center', padding: '50px' }}>
        <p>Загрузка каталога практики...</p>
      </div>
    );
  }

  return (
    <div className="block-practice">
      <h1 className="title-1">Каталог практики</h1>
      <p className="subtitle-1">Выберите модуль для подготовки.</p>

      {/* Математика */}
      <div className="section-group">
        <h2 className="section-title">Математика</h2>
        <div className="grid-2">
          {mathModules.length === 0 ? (
            <p className="empty-text">Нет доступных модулей по математике.</p>
          ) : (
            mathModules.map(renderModuleCard)
          )}
        </div>
      </div>

      {/* Reading & Writing */}
      {readingModules.length > 0 && (
        <div className="section-group" style={{ marginTop: '40px' }}>
          <h2 className="section-title">Reading & Writing</h2>
          <div className="grid-2">
            {readingModules.map(renderModuleCard)}
          </div>
        </div>
      )}
    </div>
  );
}