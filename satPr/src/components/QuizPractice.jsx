import React, { useState } from 'react';
import './QuizPractice.scss';

export default function QuizPractice() {
  let [selectedOption, setSelectedOption] = useState(null);

  return (
    <div className="quiz-page">
   
      <div className="quiz-top">
        <div className="quiz-header">
          <div className="title-box">
      
            <h2 className="quiz-title">Question 1</h2>
          </div>
        
        </div>

        <div className="progress-info">
          <span className="q-count">Question 1 of 20</span>
        
        </div>

        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: '5%' }}></div>
        </div>
      </div>

 
      <div className="question-wrapper">
        <div className="question-card">
          

          <div className="question-text">
            In the linear function <span>f(x) = ax + b</span>, the value of <span>f(2)</span> is <span>7</span> and the value of <span>f(5)</span> is <span>16</span>. What is the value of the slope <span>a</span>?
          </div>

        
          <div className="options-grid">
            <div
              className={`option-card ${selectedOption === 'A' ? 'active' : ''}`}
              onClick={function() { setSelectedOption('A'); }}
            >
              <div className="opt-circle">A</div>
              <div className="opt-val">2</div>
            </div>

            <div
              className={`option-card ${selectedOption === 'B' ? 'active' : ''}`}
              onClick={function() { setSelectedOption('B'); }}
            >
              <div className="opt-circle">B</div>
              <div className="opt-val">3</div>
            </div>

            <div
              className={`option-card ${selectedOption === 'C' ? 'active' : ''}`}
              onClick={function() { setSelectedOption('C'); }}
            >
              <div className="opt-circle">C</div>
              <div className="opt-val">4</div>
            </div>

            <div
              className={`option-card ${selectedOption === 'D' ? 'active' : ''}`}
              onClick={function() { setSelectedOption('D'); }}
            >
              <div className="opt-circle">D</div>
              <div className="opt-val">9</div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="quiz-footer">
        <button className="report-btn"> Report Issue</button>
        <div className="right-actions">
          <button className="skip-btn">Skip</button>
          <button
            className={`submit-btn ${selectedOption ? 'active' : ''}`}
            disabled={!selectedOption}
          >
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
}