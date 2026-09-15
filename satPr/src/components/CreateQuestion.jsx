import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './QuestionEditor.scss';

export default function QuestionCreate({ questionId = null, moduleId = 1, onSaveSuccess }) {
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
  const [message, setMessage] = useState({ type: '', text: '' });


  useEffect(() => {
    if (questionId) {
      fetchQuestion();
    }
  }, [questionId]);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
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
      setMessage({ type: 'error', text: `Ошибка загрузки: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.question_text.trim()) {
      setMessage({ type: 'error', text: 'Заполните текст вопроса!' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        module_id: moduleId,
        question_text: formData.question_text,
        option_a: formData.option_a,
        option_b: formData.option_b,
        option_c: formData.option_c,
        option_d: formData.option_d,
        correct_option: formData.correct_option,
        explanation: formData.explanation
      };

      let resultError;

      if (questionId) {
        // Обновление существующего вопроса
        const { error } = await supabase
          .from('questions')
          .update(payload)
          .eq('id', questionId);
        resultError = error;
      } else {
        // Создание нового вопроса
        const { error } = await supabase
          .from('questions')
          .insert([payload]);
        resultError = error;
      }

      if (resultError) throw resultError;

      setMessage({ type: 'success', text: 'Вопрос успешно сохранен!' });
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      setMessage({ type: 'error', text: `Ошибка сохранения: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="block-admin">
      <div className="admin-header">
        <h2>{questionId ? 'Редактировать вопрос' : 'Создать вопрос'}</h2>
        <button 
          className="btn-green" 
          onClick={handleSave} 
          disabled={loading}
        >
          {loading ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>

      {message.text && (
        <div className={`status-alert ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="grid-split">
        {/* Карточка 1: Текст вопроса */}
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

        {/* Карточка 2: Варианты ответов */}
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

        {/* Карточка 3: Пояснение */}
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