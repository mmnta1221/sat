import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "./sidebar.scss";
import dash from "./dash.png"
import achieve from "./achieve.png"
import practice from "./practice.png"
import materials from "./materials.png"
import adminCon from "./admin.png"
export default function Sidebar() {
  const { user, role, profile, signOut, isAdmin } = useAuth();

  return (
    <aside className="sidebar">
      <div className="side-logo">
        <h2>SAT Mastery</h2>
        <span>{role === 'admin' ? ' Admin Panel' : ' Student Portal'}</span>
      </div>

      <nav className="side-menu">
        <NavLink to="/dashboard" className={({ isActive }) => `side-btn ${isActive ? 'active' : ''}`}>
        <img src={dash} alt="" />
           Dashboard
        </NavLink>

        <NavLink to="/practice" className={({ isActive }) => `side-btn ${isActive ? 'active' : ''}`}>
         <img src={practice} alt="" />
           Practice
        </NavLink>

        <NavLink to="/materials" className={({ isActive }) => `side-btn ${isActive ? 'active' : ''}`}>
         <img src={materials} alt="" />
           Materials
        </NavLink>

        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => `side-btn ${isActive ? 'active' : ''}`}>
             <img src={adminCon} alt="" />
             Admin Console
          </NavLink>
        )}
      </nav>

      <div className="side-footer">
        {user ? (
          <div className="user-profile-sm">
            <div className="avatar" style={{ background: role === 'admin' ? '#ef233c' : '#3a86ff' }}></div>
            <div className="info" style={{ flexGrow: 1 }}>
              <h4>{profile?.full_name || user.email?.split('@')[0]}</h4>
              <span style={{ color: role === 'admin' ? '#ff4d6d' : '#3a86ff', fontWeight: 'bold' }}>
                {role === 'admin' ? 'Администратор' : 'Ученик'}
              </span>
            </div>
            <button
              onClick={signOut}
              title="Выйти"
              style={{
                background: 'none',
                border: 'none',
                color: '#8d99ae',
                cursor: 'pointer',
                fontSize: '16px',
                
                
              }}
            >
              выйти
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="btn-1 text-center" style={{ textDecoration: 'none', textAlign: 'center' }}>
            Войти в аккаунт
          </NavLink>
        )}
      </div>
    </aside>
  );
}