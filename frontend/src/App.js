import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SwipePage from './pages/SwipePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import MatchesPage from './pages/MatchesPage';
import ProjectsPage from './pages/ProjectsPage';
import SubscriptionPage from './pages/SubscriptionPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/swipe" element={<ProtectedRoute><SwipePage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/matches" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />
              <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
              <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
    </div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
    </div>;
  }
  
  return user && user.user_type === 'admin' ? children : <Navigate to="/" />;
}

export default App;