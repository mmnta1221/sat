import React from 'react';
import './QuestionEditor.scss';

export default function QuestionEditor() {
  return (
    <div className="block-admin">
      <div className="admin-header">
        <h2>Edit Question</h2>
        <button className="btn-green">Save</button>
      </div>

      <div className="grid-split">
        <div className="card-1">
          <label>Question Текст</label>
          <textarea className="textarea-1" ></textarea>
        </div>
        
        

        
        <div className="card-1">
          <label>Options</label>
          <div className="choice"><input type="radio" /> Option A</div>
          <div className="choice"><input type="radio"  /> Option B</div>
          <div className="choice"><input type="radio"  /> Option C</div>
          <div className="choice"><input type="radio"  /> Option D</div>
        </div>

         <div className="card-2">
          <label>Explanantion</label>
          <textarea className="textarea-2" ></textarea>
        </div>
      </div>
    </div>
  );
}