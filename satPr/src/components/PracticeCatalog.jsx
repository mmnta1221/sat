import React from 'react';
import './PracticeCatalog.scss';

export default function PracticeCatalog() {
  return (
    <div className="block-practice">
      <h1 className="title-1">Каталог практики</h1>
      <p className="subtitle-1">Выберите модуль для подготовки.</p>
      
      <div className="section-group">

        <h2 className="section-title"> Математика</h2>
        <div className="grid-2">
          <div className="card-1">
            <div className="card-head">
              <h3>Модуль 1: Практика</h3>
              <span className="badge-green">80% Выполнено</span>
            </div>
            <p className="desc">Алгебра и предварительный расчет</p>
          </div>


          <div className="card-1 locked">
            <div className="card-head">
              <h3>Модуль 2: Практика</h3>
              <span className="badge-gray">Не начато</span>
            </div>
            <div className="lock-overlay"> Требуется 500 XP</div>
          </div>
        </div>
      </div>
    </div>
  );
}