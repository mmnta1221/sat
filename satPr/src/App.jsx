import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import Dashboard from './components/Dashboard';
import PracticeCatalog from './components/PracticeCatalog';
import Materials from './components/Materials';
import AdminConsole from './components/AdminConsole';
import QuestionEditor from './components/QuestionEditor';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <TopHeader />
          <div className="content-body">
            <Routes>
           
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/practice" element={<PracticeCatalog />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/admin" element={<AdminConsole />} />
              <Route path="/admin/editor" element={<QuestionEditor />} />
              
  
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}