import React from 'react';
import './Dashboard.scss';

export default function Dashboard() {
  return (
    <div className="block-dash">
      <h1 className="title-1">Welcome back, Scholar!</h1>
      <p className="subtitle-1">You're on track to hit your weekly target.</p>
      
      <div className="grid-2x1">
        <div className="card-1 text-center">
          <h3>Daily Goal Progress</h3>
          <div className="circle-progress">
            <span className="progress-text">75%</span>
          </div>
          <p>3/4 Activities Completed</p>
        </div>

        <div className="card-1 streak-banner">
          <div className="banner-text">
            <span className="tag-fire">ACTIVE STREAK</span>
            <h3>7-Day Fire Streak</h3>
            <p>You've mastered 7 days of consecutive study!</p>
            <button className="btn-2">+500 Bonus XP</button>
          </div>
        </div>
      </div>
    </div>
  );
}