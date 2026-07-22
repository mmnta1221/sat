import React from 'react';
import { NavLink } from 'react-router-dom';
import "./sidebar.scss";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="side-logo">
        <h2>SAT Mastery</h2>
        <span>Level 24 Scholar</span>
      </div>

      <nav className="side-menu">
        <NavLink to="/dashboard" className="side-btn">
          Dashboard
        </NavLink>

        <NavLink to="/practice" className="side-btn">
          Practice
        </NavLink>
        <NavLink to="/leaderboard" className="side-btn">
          Leaderboard
        </NavLink>

        <NavLink to="/materials" className="side-btn">
          Materials
        </NavLink>
        <NavLink to="/admin" className="side-btn">
          Admin Console
        </NavLink>
      </nav>



      <div className="side-footer">
        <button className="btn-1 text-center">Start Daily Quiz</button>
        <div className="user-profile-sm">
          <div className="avatar"></div>
          <div className="info">
            <h4>Alex Rivera</h4>
            <span>Practice Mode</span>
          </div>
        </div>
      </div>
    </aside>
  );
}