import React, { useState, useEffect, createContext, useContext } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

// Import components
import SwipePage from "./components/SwipePage";
import MatchesPage from "./components/MatchesPage";
import ProfilePage from "./components/ProfilePage";
import AdminPage from "./components/AdminPage";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API}/users/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Components
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-white hover:text-blue-400">
              Swipe-ton-pro
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/swipe" className="text-white hover:text-blue-400">Découvrir</a>
            <a href="/matches" className="text-white hover:text-blue-400">Matches</a>
            <a href="/profile" className="text-white hover:text-blue-400">Profil</a>
            {user?.user_type === 'admin' && (
              <a href="/admin" className="text-white hover:text-red-400">Admin</a>
            )}
            <span className="text-white">{user?.first_name} {user?.last_name}</span>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Home = () => {
  const [featuredUser, setFeaturedUser] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchFeaturedUser();
  }, []);

  const fetchFeaturedUser = async () => {
    try {
      const response = await axios.get(`${API}/users/featured`);
      setFeaturedUser(response.data);
    } catch (error) {
      console.error('Error fetching featured user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Bienvenue sur Swipe-ton-pro</h2>
          <p className="text-xl text-gray-300">La plateforme de matching professionnel</p>
        </div>

        {featuredUser && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-center">⭐ Profil en vedette</h3>
            <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto border-2 border-yellow-500">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {featuredUser.first_name[0]}{featuredUser.last_name[0]}
                  </span>
                </div>
                <h4 className="text-xl font-bold">{featuredUser.first_name} {featuredUser.last_name}</h4>
                <p className="text-yellow-400 capitalize font-semibold">{featuredUser.user_type}</p>
                {featuredUser.company_name && (
                  <p className="text-gray-300 text-sm">{featuredUser.company_name}</p>
                )}
                <p className="text-sm text-gray-400 mt-2">{featuredUser.description}</p>
                <div className="mt-3">
                  <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">
                    Profil vedette
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
            <h3 className="text-xl font-bold mb-4">🔍 Découvrir</h3>
            <p className="text-gray-300 mb-4">Parcourez les profils et trouvez votre match professionnel</p>
            <a href="/swipe" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-block">
              Commencer à swiper
            </a>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
            <h3 className="text-xl font-bold mb-4">💬 Mes Matches</h3>
            <p className="text-gray-300 mb-4">Gérez vos connexions et conversations</p>
            <a href="/matches" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded inline-block">
              Voir mes matches
            </a>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
            <h3 className="text-xl font-bold mb-4">👤 Mon Profil</h3>
            <p className="text-gray-300 mb-4">Gérez votre profil et vos documents</p>
            <a href="/profile" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded inline-block">
              Éditer profil
            </a>
          </div>
        </div>

        {user?.user_type === 'admin' && (
          <div className="mt-12 bg-red-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">🔧 Administration</h3>
            <p className="text-gray-300 mb-4">Gérez les utilisateurs et les validations</p>
            <a href="/admin" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded inline-block">
              Panneau d'administration
            </a>
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">🔒 Mode Fantôme</h3>
            <p className="text-gray-300 mb-4">
              Votre statut actuel: <span className={`px-3 py-1 rounded-full text-sm ${
                user?.status === 'validated' ? 'bg-green-600' : 'bg-yellow-600'
              }`}>
                {user?.status === 'validated' ? 'Validé' : 'Mode fantôme'}
              </span>
            </p>
            {user?.status !== 'validated' && (
              <p className="text-yellow-400 text-sm">
                Uploadez vos documents dans votre profil pour sortir du mode fantôme !
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    user_type: 'freelancer',
    company_status: 'auto_entrepreneur',
    company_name: '',
    phone: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const response = await axios.post(`${API}/auth/login`, {
          email: formData.email,
          password: formData.password
        });
        login(response.data.access_token, response.data.user);
      } else {
        const response = await axios.post(`${API}/auth/register`, formData);
        const loginResponse = await axios.post(`${API}/auth/login`, {
          email: formData.email,
          password: formData.password
        });
        login(loginResponse.data.access_token, loginResponse.data.user);
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Swipe-ton-pro</h1>
          <h2 className="text-xl text-gray-300">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h2>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Prénom</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Nom</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">Type d'utilisateur</label>
                <select
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="freelancer">Freelancer</option>
                  <option value="company">Entreprise</option>
                  <option value="individual">Particulier</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">Statut d'entreprise</label>
                <select
                  name="company_status"
                  value={formData.company_status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="auto_entrepreneur">Auto-entrepreneur</option>
                  <option value="micro_entreprise">Micro-entreprise</option>
                  <option value="sarl">SARL</option>
                  <option value="sas">SAS</option>
                  <option value="eurl">EURL</option>
                  <option value="association">Association</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              {formData.user_type === 'company' && (
                <div>
                  <label className="block text-white mb-2">Nom de l'entreprise</label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-white mb-2">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'S\'inscrire')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:text-blue-300"
          >
            {isLogin ? 'Pas de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.user_type !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/swipe" element={
              <ProtectedRoute>
                <SwipePage />
              </ProtectedRoute>
            } />
            <Route path="/matches" element={
              <ProtectedRoute>
                <MatchesPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;