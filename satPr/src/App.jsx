import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/sidebar';
import TopHeader from './components/topHeader';
import Dashboard from './components/dashboard';
import PracticeCatalog from './components/PracticeCatalog';
import Materials from './components/Materials';
import AdminConsole from './components/AdminConsole';
import QuestionEditor from './components/QuestionEditor';
import CreateModule from './components/ModuleEditor'; 
import Login from './components/Login';
import './App.css';

function AdminRoute({ children }) {
  const { role, loading } = useAuth();
  if (loading) return <div style={{ padding: 40, color: '#fff' }}>Загрузка...</div>;
  if (role !== 'admin') {
    return (
      <div style={{ padding: 40, background: '#111a36', border: '1px solid #ef233c', borderRadius: 12, margin: '20px auto', maxWidth: 600, textAlign: 'center' }}>
        <h2 style={{ color: '#ff4d6d', marginBottom: 12 }}> Доступ ограничен</h2>
        <p style={{ color: '#8d99ae', marginBottom: 20 }}>Страница администрирования доступна только с ролью <strong>Администратор</strong>.</p>
        <Navigate to="/dashboard" replace />
      </div>
    );
  }
  return children;
}

function MainLayout() {
  return (
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
            <Route path="/admin" element={<AdminRoute><AdminConsole /></AdminRoute>} />
            <Route path="/admin/editor" element={<AdminRoute><QuestionEditor /></AdminRoute>} />
            <Route path="/admin/create-module" element={<AdminRoute><CreateModule /></AdminRoute>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}