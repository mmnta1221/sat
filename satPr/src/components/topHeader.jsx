import React, { useState, useEffect } from 'react';
import './TopHeader.scss';
import Sidebar from "./sidebar"
export default function TopHeader() {
    <Sidebar />
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(2450); 

  useEffect(() => {
    
    const today = new Date().toISOString().split('T')[0];
    

    const lastVisit = localStorage.getItem('last_visit_date');
    const currentStreak = parseInt(localStorage.getItem('user_streak') || '0', 10);

    if (!lastVisit) {
  
      localStorage.setItem('last_visit_date', today);
      localStorage.setItem('user_streak', '1');
      setStreak(1);
    } else {
     
      const date1 = new Date(lastVisit);
      const date2 = new Date(today);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        
        const newStreak = currentStreak + 1;
        localStorage.setItem('last_visit_date', today);
        localStorage.setItem('user_streak', newStreak.toString());
        setStreak(newStreak);
      } else if (diffDays > 1) {
       
        localStorage.setItem('last_visit_date', today);
        localStorage.setItem('user_streak', '1');
        setStreak(1);
      } else {
  
        setStreak(currentStreak || 1);
      }
    }
  }, []);

  return (
    <header className="top-head">
      <div className="head-stats">
        <span className="stat-item">🔥 {streak} {streak === 1 ? 'Day' : 'Days'} Streak</span>
        <span className="stat-item">💎 {xp} XP</span>
      </div>
      <div className="head-profile">
        <span>Profile</span>
        <div className="avatar-sm"></div>
      </div>
    </header>
  );
}