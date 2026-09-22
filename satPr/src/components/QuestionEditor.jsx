import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './QuestionEditor.scss';

export default function QuestionEditor({ questionId: propQuestionId = null, moduleId: propModuleId = null, onSaveSuccess }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Считываем ID вопроса и модуля из props или URL (?id=...&moduleId=...)
  const questionId = propQuestionId || searchParams.get('id');
  const moduleId = propModuleId || searchParams.get('moduleId') || 1;

  const [formData, setFormData] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'A',
    explanation: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 📥 Загрузка данных редактируемого вопроса при наличии questionId
  useEffect(() => {
    if (questionId) {
      fetchQuestion(questionId);
    }
  }, [questionId]);

  const fetchQuestion = async (qId) => {
    try {
      setFetching(true);
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', qId)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          question_text: data.question_text || '',
          option_a: data.option_a || '',
          option_b: data.option_b || '',
          option_c: data.option_c || '',
          option_d: data.option_d || '',
          correct_option: data.correct_option || 'A',
          explanation: data.explanation || ''
        });
      }
    } catch (err) {
      console.error('Ошибка загрузки вопроса:', err);
      setMessage({ type: 'error', text: `Ошибка загрузки: ${err.message}` });
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 📊 Функция для синхронизации количества вопросов в таблице modules
  const updateModuleQuestionCount = async (targetModuleId) => {
    try {
      const { count, error: countErr } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('module_id', targetModuleId);

      if (!countErr && count !== null) {
        await supabase
          .from('modules')
          .update({ questions_count: count })
          .eq('id', targetModuleId);
      }
    } catch (err) {
      console.error('Не удалось обновить счетчик вопросов модуля:', err);
    }
  };

  // 💾 Сохранение или обновление вопроса
  const handleSave = async () => {
    if (!formData.question_text.trim()) {
      setMessage({ type: 'error', text: 'Заполните текст вопроса!' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        module_id: Number(moduleId),
        question_text: formData.question_text,
        option_a: formData.option_a,
        option_b: formData.option_b,
        option_c: formData.option_c,
        option_d: formData.option_d,
        correct_option: formData.correct_option,
        explanation: formData.explanation
      };

      if (questionId) {
        // ОБНОВЛЕНИЕ вопроса
        const { error } = await supabase
          .from('questions')
          .update(payload)
          .eq('id', questionId);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Вопрос успешно обновлен!' });
      } else {
        // СОЗДАНИЕ нового вопроса
        const { error } = await supabase
          .from('questions')
          .insert([payload]);

        if (error) throw error;
        
        // Пересчитываем вопросы в модуле при добавлении нового
        await updateModuleQuestionCount(Number(moduleId));

        setMessage({ type: 'success', text: 'Вопрос успешно создан!' });
      }

      if (onSaveSuccess) {
        onSaveSuccess();
      } else {
        // Возврат к списку вопросов модуля через 1 секунду
        setTimeout(() => {
          navigate(`/admin/questions?id=${moduleId}`);
        }, 1000);
      }
    } catch (err) {
      console.error('Ошибка сохранения вопроса:', err);
      setMessage({ type: 'error', text: `Ошибка сохранения: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#8d99ae' }}>
        Загрузка данных вопроса...
      </div>
    );
  }

  return (
    <div className="block-admin">
      <div className="admin-header">
        <h2>{questionId ? `Редактировать вопрос #${questionId}` : 'Создать вопрос'}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate(`/admin/questions?id=${moduleId}`)}
            style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
          >
            Назад к списку
          </button>
          <button 
            type="button"
            className="btn-green" 
            onClick={handleSave} 
            disabled={loading}
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`status-alert ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="grid-split">
        {/* Текст вопроса */}
        <div className="card-1">
          <label>Текст вопроса</label>
          <textarea
            name="question_text"
            className="textarea-1"
            placeholder="Введите условия задачи..."
            value={formData.question_text}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Варианты ответов */}
        <div className="card-1">
          <label>Варианты ответов (отметьте правильный)</label>
          
          <div className="choice">
            <input
              type="radio"
              name="correct_option"
              value="A"
              checked={formData.correct_option === 'A'}
              onChange={handleChange}
            />
            <span>A:</span>
            <input
              type="text"
              name="option_a"
              className="input-option"
              placeholder="Ответ A"
              value={formData.option_a}
              onChange={handleChange}
            />
          </div>

          <div className="choice">
            <input
              type="radio"
              name="correct_option"
              value="B"
              checked={formData.correct_option === 'B'}
              onChange={handleChange}
            />
            <span>B:</span>
            <input
              type="text"
              name="option_b"
              className="input-option"
              placeholder="Ответ B"
              value={formData.option_b}
              onChange={handleChange}
            />
          </div>

          <div className="choice">
            <input
              type="radio"
              name="correct_option"
              value="C"
              checked={formData.correct_option === 'C'}
              onChange={handleChange}
            />
            <span>C:</span>
            <input
              type="text"
              name="option_c"
              className="input-option"
              placeholder="Ответ C"
              value={formData.option_c}
              onChange={handleChange}
            />
          </div>

          <div className="choice">
            <input
              type="radio"
              name="correct_option"
              value="D"
              checked={formData.correct_option === 'D'}
              onChange={handleChange}
            />
            <span>D:</span>
            <input
              type="text"
              name="option_d"
              className="input-option"
              placeholder="Ответ D"
              value={formData.option_d}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Пояснение */}
        <div className="card-2">
          <label>Пояснение к решению (Explanation)</label>
          <textarea
            name="explanation"
            className="textarea-2"
            placeholder="Подробное объяснение правильного ответа..."
            value={formData.explanation}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
    </div>
  );
}