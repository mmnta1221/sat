import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; 
import { supabase } from '../../supabaseClient';
import './QuestionList.scss';

export default function QuestionList() {
  const navigate = useNavigate();
  

  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('id');

  return (
    <div className="module-page">
      <div className="header-row">
        <div className="header-info">
          <h1 className="title">Math Module 1: Heart of Algebra</h1>
          <div className="badges">
            <span className="badge-count"> 22 Questions</span>
            <span className="badge-status"> Active Module</span>
          </div>
        </div>
        
    
        <button 
          className="add-btn" 
          onClick={() => navigate(`/admin/question-create?id=${moduleId}`)}
        >
          + Add Question
        </button>
      </div>

      <div className="filter-card">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by ID or question text..."
            className="search-input"
          />
        </div>

        <select className="filter-select">
          <option value="">All Types</option>
          <option value="mc">Multiple Choice</option>
          <option value="gi">Grid-In</option>
        </select>

        <select className="filter-select">
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="moderate">Moderate</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="questions-list">
        <div className="question-card">
          <div className="card-left">
            <div className="tags-row">
              <span className="tag-id">Q-8291</span>
              <span className="tag-type">MULTIPLE CHOICE</span>
              <span className="tag-diff">MODERATE</span>
            </div>
            <div className="question-text">
              If 3x - y = 12 and y = 3/2 x, what is the value of x?
            </div>
          </div>

          <div className="card-right">
            <div className="actions">
           
              <button 
                className="icon-btn" 
                title="Edit" 
                onClick={() => navigate(`/admin/editor?moduleId=${moduleId}`)}
              >
                edit
              </button>
              <button className="icon-btn delete" title="Delete">delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}