import React from 'react';
import './AdminConsole.scss';

export default function AdminConsole() {
  return (
   
   <div className="big-box">

      <div className="line1">
        <div className="search">
        
          <input type="text" placeholder="Search tests..." className="in1" />
        </div>
        
        <div className="btns">
          <button className="btn-blue">All Modules</button>
          <button className="btn-normal">Math</button>
          <button className="btn-normal">Verbal</button>
          
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
          <div className="row">
            <div className="w1">
              <div className="text-big">Math Module 1: Heart of Algebra</div>
              <div className="text-small">ID: SAT-M-001 • Updated 2h ago</div>
            </div>
            
            <div className="w2">
              <span className="tag-blue">Math</span>
            </div>
            
            <div className="w3">22</div>
            
            <div className="w4">
              <span className="text-green1">|| Moderate</span>
            </div>
            
            <div className="w5">
              <span className="text-green2">● Published</span>
            </div>
            
            <div className="w6">
              <button className="btn-icon">edit</button>
              <button className="btn-icon grey">⋮</button>
            </div>
          </div>
        </div>

        <div className="bottom">
       
        </div>
      </div>
    </div>
  );
}