import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './EditModule.scss';

export default function EditModule() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('id'); // Получаем id из URL (?id=...)

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Основная информация
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('math');
  const [moduleType, setModuleType] = useState('practice');

  // 2. Конфигурация
  const [difficulty, setDifficulty] = useState('Moderate');
  const [estTime, setEstTime] = useState(35);
  const [targetMin, setTargetMin] = useState('');
  const [targetMax, setTargetMax] = useState('');

  // 3. Настройки доступа
  const [isVisible, setIsVisible] = useState(true);
  const [requiresPrereq, setRequiresPrereq] = useState(false);
  const [timedEnforced, setTimedEnforced] = useState(false);

  // 4. Вопросы
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // 📥 1. Подгрузка данных редактируемого модуля из Supabase при монтировании
  useEffect(() => {
    if (!moduleId) {
      setErrorMsg('Идентификатор модуля (ID) не найден в URL.');
      setFetching(false);
      return;
    }

    const fetchModuleData = async () => {
      setFetching(true);
      try {
        // Загружаем сам модуль
        const { data: mod, error: modError } = await supabase
          .from('modules')
          .select('*')
          .eq('id', moduleId)
          .single();

        if (modError) throw modError;

        if (mod) {
          setTitle(mod.title || '');
          setCategory(mod.category?.toLowerCase().includes('reading') ? 'reading' : 'math');
          setModuleType(mod.module_type || 'practice');
          setDifficulty(mod.difficulty || 'Moderate');
          setEstTime(mod.est_time_minutes || 35);
          setTargetMin(mod.target_score_min || '');
          setTargetMax(mod.target_score_max || '');
          setIsVisible(mod.is_visible_to_students ?? true);
          setRequiresPrereq(mod.requires_prerequisite ?? false);
          setTimedEnforced(mod.timed_mode_enforced ?? false);
        }

        // Загружаем привязанные к этому модулю вопросы
        const { data: qData, error: qError } = await supabase
          .from('questions')
          .select('*')
          .eq('module_id', moduleId);

        if (!qError && qData) {
          setSelectedQuestions(qData);
        }
      } catch (err) {
        console.error('Ошибка загрузки модуля:', err);
        setErrorMsg('Не удалось загрузить данные модуля: ' + err.message);
      } finally {
        setFetching(false);
      }
    };

    fetchModuleData();
  }, [moduleId]);

  // 🗑️ 2. Обработка удаления вопроса (из Supabase и локального списка)
  const handleDeleteQuestion = async (qId, indexInState) => {
    if (qId) {
      try {
        const { error } = await supabase
          .from('questions')
          .delete()
          .eq('id', qId);

        if (error) throw error;
      } catch (err) {
        console.error('Ошибка удаления вопроса:', err);
        alert('Не удалось удалить вопрос из БД: ' + err.message);
        return;
      }
    }
    setSelectedQuestions(prev => prev.filter((_, idx) => idx !== indexInState));
  };

  // 💾 3. Сохранение (ОБНОВЛЕНИЕ) модуля в Supabase
  const handleSaveModule = async (isPublish = false) => {
    if (!title.trim()) {
      setErrorMsg('Пожалуйста, введите название модуля.');
      return;
    }

    if (!moduleId) {
      setErrorMsg('Отсутствует ID модуля для обновления.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const statusValue = isPublish ? 'Published' : 'Draft';

    const payload = {
      title: title,
      category: category === 'math' ? 'Math' : 'Reading & Writing',
      module_type: moduleType,
      difficulty: difficulty,
      est_time_minutes: Number(estTime) || 35,
      target_score_min: Number(targetMin) || 200,
      target_score_max: Number(targetMax) || 800,
      is_visible_to_students: isVisible,
      requires_prerequisite: requiresPrereq,
      timed_mode_enforced: timedEnforced,
      questions_count: selectedQuestions.length,
      status: statusValue,
      status_text: isPublish ? 'Не начато' : 'Черновик',
      status_class: isPublish ? 'badge-gray' : 'badge-yellow',
      is_locked: requiresPrereq
    };

    try {
      // ИСПОЛЬЗУЕМ .update() ВМЕСТО .insert()
      const { error } = await supabase
        .from('modules')
        .update(payload)
        .eq('id', moduleId);

      if (error) throw error;

      // Переход назад к админке или практике
      navigate('/admin'); 
    } catch (err) {
      console.error('Ошибка обновления модуля:', err);
      setErrorMsg(err.message || 'Не удалось обновить модуль.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#8d99ae' }}>
        Загрузка данных модуля...
      </div>
    );
  }

  return (
    <div className="page-box">
      {errorMsg && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '20px',
          borderRadius: '8px',
          background: 'rgba(239, 35, 60, 0.15)',
          border: '1px solid #ef233c',
          color: '#ff4d6d'
        }}>
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="top-row">
        <div className="btn-group">
          <button 
            type="button"
            className="btn-draft" 
            onClick={() => handleSaveModule(false)}
            disabled={loading}
          >
            {loading ? 'Сохранение...' : 'Save Draft'}
          </button>
          <button 
            type="button"
            className="btn-publish" 
            onClick={() => handleSaveModule(true)}
            disabled={loading}
          >
            {loading ? 'Обновление...' : '↑ Publish Module'}
          </button>
        </div>
      </div>

      <div className="grid-box">
        <div className="left-col">
          {/* Basic Information */}
          <div className="card-box border-blue">
            <div className="card-head">
              <span className="title">Basic Information</span>
            </div>

            <div className="field">
              <label className="lbl">Module Name</label>
              <input
                type="text"
                placeholder="e.g., Advanced Algebra Review"
                className="in-text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="two-in">
              <div className="field">
                <label className="lbl">Subject</label>
                <select 
                  className="in-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="math">Math</option>
                  <option value="reading">Reading & Writing</option>
                </select>
              </div>

              <div className="field">
                <label className="lbl">Module Type</label>
                <select 
                  className="in-select"
                  value={moduleType}
                  onChange={(e) => setModuleType(e.target.value)}
                >
                  <option value="practice">Practice</option>
                  <option value="quiz">Quiz</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content Assignment */}
          <div className="card-box border-green">
            <div className="card-head between">
              <div className="left-title">
                <span className="title">Content Assignment</span>
              </div>
              <span className="badge">{selectedQuestions.length} Questions Selected</span>
            </div>

            <div className="search-row">
              <div className="search-in">
                <input
                  type="text"
                  placeholder="Search question bank by ID or keyword..."
                  className="in-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="table-box">
              <div className="table-head">
                <div className="c1">#</div>
                <div className="c2">Question Preview</div>
                <div className="c3">Action</div>
              </div>

              {selectedQuestions.length === 0 ? (
                <div className="empty-box">
                  <div className="empty-title">No questions assigned yet.</div>
                  <div className="empty-sub">
                    Search and select questions from the bank to build your module.
                  </div>
                  <button type="button" className="bank-btn">Browse Full Bank</button>
                </div>
              ) : (
                <div className="question-list">
                  {selectedQuestions.map((q, idx) => (
                    <div key={q.id || idx} className="table-row">
                      <div className="c1">{idx + 1}</div>
                      <div className="c2">{q.question_text || q.text || 'Question Content'}</div>
                      <div className="c3">
                        <button 
                          type="button" 
                          style={{ color: '#ef233c', background: 'none', border: 'none', cursor: 'pointer' }}
                          onClick={() => handleDeleteQuestion(q.id, idx)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Правая колонка */}
        <div className="right-col">
          {/* Configuration */}
          <div className="card-box border-red">
            <div className="card-head">
              <span className="title">Configuration</span>
            </div>

            <div className="field">
              <label className="lbl">Difficulty Level</label>
              <div className="diff-grid">
                {['Foundation', 'Moderate', 'Advanced', 'Hard'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`diff-btn ${difficulty === level ? 'active' : ''}`}
                    onClick={() => setDifficulty(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label className="lbl">Est. Time Limit (Mins)</label>
              <div className="time-in">
                <input
                  type="number"
                  value={estTime}
                  onChange={(e) => setEstTime(e.target.value)}
                  className="in-num"
                />
              </div>
            </div>

            <div className="field">
              <label className="lbl">Target Score Range</label>
              <div className="range-box">
                <input
                  type="text"
                  placeholder="Min"
                  className="in-min"
                  value={targetMin}
                  onChange={(e) => setTargetMin(e.target.value)}
                />
                <span className="dash">-</span>
                <input
                  type="text"
                  placeholder="Max"
                  className="in-max"
                  value={targetMax}
                  onChange={(e) => setTargetMax(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Access Settings */}
          <div className="card-box border-teal">
            <div className="card-head">
              <span className="title">Access Settings</span>
            </div>

            <div className="toggle-row">
              <div className="toggle-text">
                <div className="t-name">Visible to Students</div>
                <div className="t-sub">Allow immediate access</div>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-row">
              <div className="toggle-text">
                <div className="t-name">Requires Prerequisite</div>
                <div className="t-sub">Must complete previous module</div>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={requiresPrereq}
                  onChange={(e) => setRequiresPrereq(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-row">
              <div className="toggle-text">
                <div className="t-name">Timed Mode Enforced</div>
                <div className="t-sub">Strict timer during attempt</div>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={timedEnforced}
                  onChange={(e) => setTimedEnforced(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}