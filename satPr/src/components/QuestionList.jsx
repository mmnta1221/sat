import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './QuestionList.scss';

export default function QuestionList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('id');

  const [moduleData, setModuleData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Фильтры
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [diffFilter, setDiffFilter] = useState('');

  useEffect(() => {
    if (moduleId) {
      fetchModuleAndQuestions();
    } else {
      setLoading(false);
    }
  }, [moduleId]);

  const fetchModuleAndQuestions = async () => {
    try {
      setLoading(true);

      // 1. Получаем инфо о модуле
      const { data: mod, error: modErr } = await supabase
        .from('modules')
        .select('*')
        .eq('id', moduleId)
        .single();

      if (modErr) console.error('Ошибка загрузки модуля:', modErr);
      else setModuleData(mod);

      // 2. Получаем вопросы, привязаные к этому module_id
      const { data: qData, error: qErr } = await supabase
        .from('questions')
        .select('*')
        .eq('module_id', moduleId)
        .order('id', { ascending: true });

      if (qErr) throw qErr;
      setQuestions(qData || []);

    } catch (err) {
      console.error('Ошибка при получении вопросов:', err);
    } finally {
      setLoading(false);
    }
  };

  // Удаление вопроса из БД
  const handleDeleteQuestion = async (qId) => {
    if (!window.confirm('Вы действительно хотите удалить этот вопрос?')) return;

    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', qId);

      if (error) throw error;
      setQuestions((prev) => prev.filter((q) => q.id !== qId));
    } catch (err) {
      alert('Ошибка при удалении: ' + err.message);
    }
  };

  // Фильтрация списка на клиенте
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = 
      q.question_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(q.id).includes(searchQuery);

    const matchesType = typeFilter ? (q.question_type || 'mc').toLowerCase() === typeFilter.toLowerCase() : true;
    const matchesDiff = diffFilter ? (q.difficulty || 'moderate').toLowerCase() === diffFilter.toLowerCase() : true;

    return matchesSearch && matchesType && matchesDiff;
  });

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#8d99ae' }}>Загрузка вопросов...</div>;
  }

  return (
    <div className="module-page">
      <div className="header-row">
        <div className="header-info">
          <h1 className="title">{moduleData?.title || `Module #${moduleId || 'N/A'}`}</h1>
          <div className="badges">
            <span className="badge-count">{questions.length} Questions</span>
            <span className="badge-status">
              {moduleData?.status || 'Active Module'}
            </span>
          </div>
        </div>

        <button 
          type="button"
          className="add-btn" 
          onClick={() => navigate(`/admin/question-create?moduleId=${moduleId}`)}
        >
          + Add Question
        </button>
      </div>

      {/* Фильтры */}
      <div className="filter-card">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by ID or question text..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select 
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="mc">Multiple Choice</option>
          <option value="gi">Grid-In</option>
        </select>

        <select 
          className="filter-select"
          value={diffFilter}
          onChange={(e) => setDiffFilter(e.target.value)}
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="moderate">Moderate</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Список вопросов */}
      <div className="questions-list">
        {filteredQuestions.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#8d99ae', background: '#fff', borderRadius: '12px' }}>
            Вопросы не найдены.
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div key={q.id} className="question-card">
              <div className="card-left">
                <div className="tags-row">
                  <span className="tag-id">Q-{q.id}</span>
                  <span className="tag-type">{q.question_type || 'MULTIPLE CHOICE'}</span>
                  <span className="tag-diff">{q.difficulty || 'MODERATE'}</span>
                </div>
                <div className="question-text">
                  {q.question_text}
                </div>
              </div>

              <div className="card-right">
                <div className="actions">
                  <button 
                    type="button"
                    className="icon-btn" 
                    title="Edit" 
                    onClick={() => navigate(`/admin/editor?id=${q.id}&moduleId=${moduleId}`)}
                  >
                    edit
                  </button>
                  <button 
                    type="button"
                    className="icon-btn delete" 
                    title="Delete"
                    onClick={() => handleDeleteQuestion(q.id)}
                  >
                    delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}