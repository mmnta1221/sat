import React from 'react';
import './Materials.scss';

export default function Materials() {
  return (
    <div className="container">
      {/* Главный блок */}
      <div className="banner">
        <h1 className="t1">Учебные материалы</h1>
        <p className="t2">
          Все необходимые ресурсы для подготовки к SAT: от официальных
          гайдов до видеоуроков и удобных шпаргалок.
        </p>
        <div className="box-in">
          <span className="icon">🔍</span>
          <input type="text" placeholder="Поиск тем, формул или видео..." className="in2" />
        </div>
      </div>

      {/* Блок 1 */}
      <div className="block">
        <div className="top">
          <h2 className="t3"><span>📖</span> Официальные руководства</h2>
          <a href="#all" className="link">Смотреть все</a>
        </div>

        <div className="grid1">
      
          <div className="card1">
            <div className="box-icon red">
              <span className="f1">📄</span>
              <span className="f2">PDF</span>
            </div>
            <div className="right">
              <h3 className="name">The Official SAT Study Guide (2024)</h3>
              <p className="desc">Полное руководство от College Board с практическими тестами.</p>
              <span className="info">12.4 MB • PDF</span>
            </div>
          </div>

    
          <div className="card1">
            <div className="box-icon blue">
              <span className="f1">📄</span>
              <span className="f2">PDF</span>
            </div>
            <div className="right">
              <h3 className="name">Math Practice Questions Set 1</h3>
              <p className="desc">Сборник задач по алгебре и геометрии с разбором ответов.</p>
              <span className="info">4.8 MB • PDF</span>
            </div>
          </div>

          <div className="card1">
            <div className="box-icon green">
              <span className="f1">📄</span>
              <span className="f2">PDF</span>
            </div>
            <div className="right">
              <h3 className="name">Reading & Writing Strategy Guide</h3>
              <p className="desc"></p>
              <span className="info">8.2 MB • PDF</span>
            </div>
          </div>
        </div>
      </div>

      <div className="block">
        <div className="top">
          <h2 className="t3"> Шпаргалки с формулами</h2>
        </div>

        <div className="grid2">
        
          <div className="card2 border1">
            <div className="mini">
             
              <span className="name2">ALGEBRA</span>
            </div>
            <h3 className="title">Линейные уравнения</h3>
            <p className="desc2">y = mx + b, наклон, пересечения и преобразования.</p>
            <button className="btn"> Скачать</button>
          </div>

          <div className="card2 border2">
            <div className="mini">
             
              <span className="name2">GEOMETRY</span>
            </div>
            <h3 className="title">Площади и Объемы</h3>
            <p className="desc2">Основные формулы для кругов, призм и конусов.</p>
            <button className="btn"> Скачать</button>
          </div>
       
          <div className="card2 border3">
            <div className="mini">
             
              <span className="name2">STATISTICS</span>
            </div>
            <h3 className="title">Анализ данных</h3>
            <p className="desc2">Среднее, медиана, размах и стандартное отклонение.</p>
            <button className="btn"> Скачать</button>
          </div>

       
          <div className="card2 border4">
            <div className="mini">
             
              <span className="name2">WRITING</span>
            </div>
            <h3 className="title">Правила пунктуации</h3>
            <p className="desc2">Точки с запятой, тире и использование запятых.</p>
            <button className="btn"> Скачать</button>
          </div>
        </div>
      </div>
    </div>
  );
}