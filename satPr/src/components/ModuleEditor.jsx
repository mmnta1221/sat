import React from 'react';
import './ModuleEditor.scss';

export default function CreateModule() {
  return (
    <div className="page-box">
      <div className="top-row">
        <div className="btn-group">
          <button className="btn-draft">Save Draft</button>
          <button className="btn-publish">↑ Publish Module</button>
        </div>
      </div>

      <div className="grid-box">

        <div className="left-col">
  
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
              />
            </div>

            <div className="two-in">
              <div className="field">
                <label className="lbl">Subject</label>
                <select className="in-select">
                  <option value="">Select Subject</option>
                  <option value="math">Math</option>
                  <option value="reading">Reading & Writing</option>
                </select>
              </div>

              <div className="field">
                <label className="lbl">Module Type</label>
                <select className="in-select">
                  <option value="">Select Type</option>
                  <option value="practice">Practice</option>
                  <option value="quiz">Quiz</option>
                </select>
              </div>
            </div>
          </div>

   
          <div className="card-box border-green">
            <div className="card-head between">
              <div className="left-title">
         
                <span className="title">Content Assignment</span>
              </div>
              <span className="badge">0 Questions Selected</span>
            </div>

            <div className="search-row">
              <div className="search-in">
           
                <input
                  type="text"
                  placeholder="Search question bank by ID or keyword..."
                  className="in-search"
                />
              </div>
           
            </div>

            <div className="table-box">
              <div className="table-head">
                <div className="c1">#</div>
                <div className="c2">Question Preview</div>
                <div className="c3">Action</div>
              </div>

              <div className="empty-box">
            
                <div className="empty-title">No questions assigned yet.</div>
                <div className="empty-sub">
                  Search and select questions from the bank to build your
                  module.
                </div>
                <button className="bank-btn"> Browse Full Bank</button>
              </div>
            </div>
          </div>
        </div>

   
        <div className="right-col">
      
          <div className="card-box border-red">
            <div className="card-head">
        
              <span className="title">Configuration</span>
            </div>

            <div className="field">
              <label className="lbl">Difficulty Level</label>
              <div className="diff-grid">
                <button className="diff-btn">Foundation</button>
                <button className="diff-btn">Moderate</button>
                <button className="diff-btn">Advanced</button>
                <button className="diff-btn">Hard</button>
              </div>
            </div>

            <div className="field">
              <label className="lbl">Est. Time Limit (Mins)</label>
              <div className="time-in">
   
                <input type="number" defaultValue={35} className="in-num" />
              </div>
            </div>

            <div className="field">
              <label className="lbl">Target Score Range</label>
              <div className="range-box">
                <input type="text" placeholder="Min" className="in-min" />
                <span className="dash">-</span>
                <input type="text" placeholder="Max" className="in-max" />
              </div>
            </div>
          </div>

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
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-row">
              <div className="toggle-text">
                <div className="t-name">Requires Prerequisite</div>
                <div className="t-sub">Must complete previous module</div>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-row">
              <div className="toggle-text">
                <div className="t-name">Timed Mode Enforced</div>
                <div className="t-sub">Strict timer during attempt</div>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}