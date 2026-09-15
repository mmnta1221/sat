import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './AdminConsole.scss';

export default function AdminConsole() {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All'); // 'All', 'Math', 'Reading & Writing'

  useEffect(() => {
    fetchModules();
  }, []);

  // Получение списка модулей из Supabase
  const fetchModules = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setModules(data || []);
    } catch (err) {
      console.error('Ошибка загрузки модулей:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Гарантированное удаление модуля и всех его вопросов из Supabase
  const handleDelete = async (id, title) => {
    const isConfirmed = window.confirm(`Вы уверены, что хотите полностью удалить модуль "${title}"?`);
    if (!isConfirmed) return;

    try {
      // 1. Сначала удаляем все привязанные вопросы модуля (ручной каскад на случай, если в SQL нет ON DELETE CASCADE)
      const { error: qError } = await supabase
        .from('questions')
        .delete()
        .eq('module_id', id);

      if (qError) {
        console.warn('Предупреждение при очистке вопросов модуля:', qError.message);
      }

      // 2. Удаляем сам модуль из Supabase
      const { data, error } = await supabase
        .from('modules')
        .delete()
        .eq('id', id)
        .select(); // Добавляем select(), чтобы убедиться, какая именно строка была удалена

      if (error) throw error;

      // Проверяем, вернула ли база удаленную запись
      if (!data || data.length === 0) {
        throw new Error('База данных отклонила запрос. Проверьте RLS политики DELETE в Supabase.');
      }

      // 3. Обновляем состояние во фронтенде только после успешного ответа от базы
      setModules(prev => prev.filter(m => m.id !== id));
      alert(`Модуль "${title}" успешно удален.`);
    } catch (err) {
      console.error('Ошибка при удалении из Supabase:', err);
      alert('Не удалось удалить модуль из базы данных:\n' + err.message);
    }
  };

  // Переход к редактированию
  const handleEdit = (id) => {
    navigate(`/admin/editor?id=${id}`);
  };

  // Фильтрация модулей
  const filteredModules = modules.filter(m => {
    const titleMatch = m.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const idMatch = String(m.id).includes(searchQuery);
    const matchesSearch = titleMatch || idMatch;

    if (categoryFilter === 'Math') {
      return matchesSearch && m.category?.toLowerCase() === 'math';
    }
    if (categoryFilter === 'Verbal') {
      return matchesSearch && (m.category?.toLowerCase().includes('reading') || m.category?.toLowerCase().includes('writing') || m.category?.toLowerCase() === 'verbal');
    }
    return matchesSearch;
  });

  return (
    <div className="big-box">
      <div className="line1">
        <div className="search">
          <input
            type="text"
            placeholder="Search tests..."
            className="in1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="btns">
          <button
            className={categoryFilter === 'All' ? 'btn-blue' : 'btn-normal'}
            onClick={() => setCategoryFilter('All')}
          >
            All Modules
          </button>
          <button
            className={categoryFilter === 'Math' ? 'btn-blue' : 'btn-normal'}
            onClick={() => setCategoryFilter('Math')}
          >
            Math
          </button>
          <button
            className={categoryFilter === 'Verbal' ? 'btn-blue' : 'btn-normal'}
            onClick={() => setCategoryFilter('Verbal')}
          >
            Verbal
          </button>

          <button className="btn-drop"> Difficulty: All</button>
          <button className="btn-drop"> Latest First</button>
        </div>
      </div>

      <div className="table">
        <div className="head">
          <div className="w1">TEST IDENTIFICATION</div>
          <div className="w2">CATEGORY</div>
          <div className="w3">QUESTIONS</div>
          <div className="w4">DIFFICULTY</div>
          <div className="w5">STATUS</div>
          <div className="w6">ACTIONS</div>
        </div>

        <div className="body">
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#8d99ae' }}>
              Загрузка модулей...
            </div>
          ) : filteredModules.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#8d99ae' }}>
              Модули не найдены.
            </div>
          ) : (
            filteredModules.map((item) => (
              <div className="row" key={item.id}>
                <div className="w1">
                 <button className='lala' onClick={() => navigate(`/admin/question-list?id=${item.id}`)}> <div className="text-big" >{item.title}</div> </button>
                  <div className="text-small">
                    ID: SAT-{item.category?.[0] || 'M'}-{String(item.id).padStart(3, '0')} • {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="w2">
                  <span className={item.category?.toLowerCase() === 'math' ? 'tag-blue' : 'tag-purple'}>
                    {item.category || 'Math'}
                  </span>
                </div>

                <div className="w3">{item.questions_count ?? 0}</div>

                <div className="w4">
                  <span className="text-green1">|| {item.difficulty || 'Moderate'}</span>
                </div>

                <div className="w5">
                  <span className={item.status === 'Published' ? 'text-green2' : 'text-gray'}>
                    ● {item.status || 'Draft'}
                  </span>
                </div>

                <div className="w6">
                  <button className="btn-icon" onClick={() => navigate(`/admin/edit-module?id=${item.id}`)} >
                    edit
                  </button>
                  <button className="btn-icon2" onClick={() => handleDelete(item.id, item.title)}>
                    delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bottom"></div>
      </div>

      <button
        className="addModule"
        title="Создать модуль"
        onClick={() => navigate('/admin/question-list')}
      >
        +
      </button>
    </div>
  );
}