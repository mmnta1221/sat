import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './QuizPractice.scss';

export default function QuizPractice() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('moduleId');

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (moduleId) {
      fetchQuestions();
    } else {
      setLoading(false);
    }
  }, [moduleId]);

  // 1. Загрузка вопросов
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('module_id', moduleId)
        .order('id', { ascending: true });

      if (error) throw error;
      setQuestions(data || []);
    } catch (err) {
      console.error('Ошибка при загрузке вопросов:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Сохранение прогресса
  const saveProgressToDb = async (answersMap, finished = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const totalCount = questions.length;
      const answeredCount = Object.keys(answersMap).length;
      const percentage = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

      await supabase
        .from('user_progress')
        .upsert(
          {
            user_id: user.id,
            module_id: Number(moduleId),
            completed_percentage: percentage,
            is_completed: finished,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id, module_id' }
        );
    } catch (err) {
      console.error('Ошибка сохранения прогресса:', err);
    }
  };

  // Переход к следующему вопросу
  const handleNextQuestion = (chosenOption = selectedOption) => {
    const currentQ = questions[currentIndex];
    
    const updatedAnswers = {
      ...userAnswers,
      ...(chosenOption ? { [currentQ.id]: chosenOption } : {})
    };
    setUserAnswers(updatedAnswers);

    const isLastQuestion = currentIndex + 1 >= questions.length;
    saveProgressToDb(updatedAnswers, isLastQuestion);

    if (isLastQuestion) {
      setIsFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      const nextQId = questions[currentIndex + 1]?.id;
      setSelectedOption(updatedAnswers[nextQId] || null);
    }
  };

  const handleSkip = () => {
    handleNextQuestion(null);
  };

  if (loading) {
    return (
      <div className="quiz-page state-page">
        <h2 className="state-title">Загрузка вопросов...</h2>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-page state-page">
        <h2 className="state-title">В данном модуле пока нет вопросов.</h2>
        <button 
          className="submit-btn active btn-margin" 
          onClick={() => navigate('/practice')}
        >
          Вернуться в каталог
        </button>
      </div>
    );
  }

  // --- РЕЗУЛЬТАТЫ ---
  if (isFinished) {
    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correct_option) {
        correctCount += 1;
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="quiz-page result-view">
        <div className="result-header">
          <div className="result-badge">🎉 Module Completed</div>
          <h1 className="result-title">Результаты тестирования</h1>
          <p className="result-subtitle">Отличная работа! Ознакомьтесь с подробным разбором ответов ниже.</p>
        </div>

        <div className="result-container">
          <div className="score-summary-card">
            <div className="score-circle">
              <span className="percent">{scorePercentage}%</span>
              <span className="label">Score</span>
            </div>

            <div className="stats-row">
              <div className="stat-item correct">
                <span className="stat-value">{correctCount}</span>
                <span className="stat-label">Правильно</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item wrong">
                <span className="stat-value">{questions.length - correctCount}</span>
                <span className="stat-label">Ошибок</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item total">
                <span className="stat-value">{questions.length}</span>
                <span className="stat-label">Всего вопросов</span>
              </div>
            </div>
          </div>

          <h2 className="section-title">Разбор вопросов</h2>

          <div className="review-list">
            {questions.map((q, idx) => {
              const userAnswer = userAnswers[q.id];
              const isCorrect = userAnswer === q.correct_option;

              return (
                <div key={q.id} className={`review-card ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
                  <div className="card-header">
                    <span className="q-badge">Вопрос {idx + 1}</span>
                    <span className={`status-tag ${isCorrect ? 'correct' : 'wrong'}`}>
                      {isCorrect ? '✔ Верно' : '✖ Неверно'}
                    </span>
                  </div>

                  <div className="review-question-text">{q.question_text}</div>

                  <div className="options-grid">
                    {['A', 'B', 'C', 'D'].map((letter) => {
                      const optKey = `option_${letter.toLowerCase()}`;
                      const optText = q[optKey];
                      if (!optText) return null;

                      let statusClass = '';
                      if (letter === q.correct_option) {
                        statusClass = 'correct';
                      } else if (letter === userAnswer && !isCorrect) {
                        statusClass = 'wrong';
                      }

                      return (
                        <div key={letter} className={`option-card ${statusClass}`}>
                          <div className="opt-circle">{letter}</div>
                          <div className="opt-val">{optText}</div>
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="explanation-box">
                      <div className="exp-title">💡 Пояснение:</div>
                      <div className="exp-text">{q.explanation}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="quiz-footer">
          <button className="submit-btn active" onClick={() => navigate('/practice')}>
            Завершить и вернуться
          </button>
        </div>
      </div>
    );
  }

  // --- ВОПРОС ---
  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="quiz-page">
      <div className="quiz-top">
        <div className="quiz-header">
          <div className="title-box">
            <h2 className="quiz-title">Question {currentIndex + 1}</h2>
          </div>
        </div>

        <div className="progress-info">
          <span className="q-count">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="question-wrapper">
        <div className="question-card">
          <div className="question-text">{currentQ.question_text}</div>

          <div className="options-grid">
            {['A', 'B', 'C', 'D'].map((letter) => {
              const optKey = `option_${letter.toLowerCase()}`;
              const optText = currentQ[optKey];
              if (!optText) return null;

              return (
                <div
                  key={letter}
                  className={`option-card ${selectedOption === letter ? 'active' : ''}`}
                  onClick={() => setSelectedOption(letter)}
                >
                  <div className="opt-circle">{letter}</div>
                  <div className="opt-val">{optText}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="quiz-footer">
        <button className="report-btn">Report Issue</button>
        <div className="right-actions">
          <button className="skip-btn" onClick={handleSkip}>
            Skip
          </button>
          <button
            className={`submit-btn ${selectedOption ? 'active' : ''}`}
            disabled={!selectedOption}
            onClick={() => handleNextQuestion(selectedOption)}
          >
            {currentIndex + 1 === questions.length ? 'Finish Test' : 'Submit Answer'}
          </button>
        </div>
      </div>
    </div>
  );
}