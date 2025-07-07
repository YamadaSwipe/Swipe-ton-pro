import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminInvite from "./components/AdminInvite";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log(response.data.message);
    } catch (e) {
      console.error(e, `errored out requesting / api`);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  return (
    <div>
      <header className="App-header">
        <a
          className="App-link"
          href="https://emergent.sh"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="https://avatars.githubusercontent.com/in/1201222?s=120&u=2686cf91179bbafbc7a71bfbc43004cf9ae1acea&v=4" alt="Emergent" />
        </a>
        <p className="mt-5">Building something incredible ~!</p>
        <div className="mt-8">
          <a
            href="/admin"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Accès Administration
          </a>
        </div>
      </header>
    </div>
  );
};

const AdminApp = () => {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in
    const savedToken = localStorage.getItem('adminToken');
    const savedAdmin = localStorage.getItem('adminInfo');
    
    if (savedToken && savedAdmin) {
      setToken(savedToken);
      setAdmin(JSON.parse(savedAdmin));
    }
  }, []);

  const handleLogin = (newToken, adminInfo) => {
    setToken(newToken);
    setAdmin(adminInfo);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    setToken(null);
    setAdmin(null);
  };

  if (!token || !admin) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div>
      <AdminDashboard
        token={token}
        admin={admin}
        onLogout={handleLogout}
      />
      {showInvite && (
        <AdminInvite
          token={token}
          onClose={() => setShowInvite(false)}
        />
      )}
      {admin.permissions && admin.permissions.includes('invite_admins') && (
        <button
          onClick={() => setShowInvite(true)}
          className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors"
          title="Inviter un admin"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
