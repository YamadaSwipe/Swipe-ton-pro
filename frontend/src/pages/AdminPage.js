import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const AdminPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArtisans: 0,
    totalParticuliers: 0,
    totalMatches: 0,
    totalProjects: 0
  });
  const [users, setUsers] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [projects, setProjects] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [artisansRes, projectsRes, matchesRes] = await Promise.all([
        axios.get(`${API_URL}/artisan/profiles`),
        axios.get(`${API_URL}/projects`),
        axios.get(`${API_URL}/matches`)
      ]);

      setArtisans(artisansRes.data);
      setProjects(projectsRes.data);
      setMatches(matchesRes.data);

      // Calculate stats
      const totalArtisans = artisansRes.data.length;
      const totalProjects = projectsRes.data.length;
      const totalMatches = matchesRes.data.length;

      setStats({
        totalUsers: totalArtisans, // We'll get this from a proper endpoint later
        totalArtisans,
        totalParticuliers: totalProjects, // Approximation
        totalMatches,
        totalProjects
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProfessionIcon = (profession) => {
    const icons = {
      'electricien': '⚡',
      'plombier': '🔧',
      'menuisier': '🪚',
      'peintre': '🎨',
      'macon': '🧱',
      'chauffagiste': '🔥',
      'carreleur': '🏗️'
    };
    return icons[profession] || '🔨';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return 'Inconnu';
    }
  };

  if (user?.user_type !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-white mb-2">Accès refusé</h2>
          <p className="text-gray-300">Cette page est réservée aux administrateurs.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Administration SwipeTonPro</h1>
          <p className="text-gray-300">Tableau de bord administrateur</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('artisans')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'artisans'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            🔨 Artisans
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'projects'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            📋 Projets
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'matches'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            💼 Matches
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Total Utilisateurs</h3>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
                <p className="text-sm opacity-75">Tous types confondus</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Artisans</h3>
                <p className="text-3xl font-bold">{stats.totalArtisans}</p>
                <p className="text-sm opacity-75">Professionnels actifs</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Particuliers</h3>
                <p className="text-3xl font-bold">{stats.totalParticuliers}</p>
                <p className="text-sm opacity-75">Clients inscrits</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Matches</h3>
                <p className="text-3xl font-bold">{stats.totalMatches}</p>
                <p className="text-sm opacity-75">Connexions réalisées</p>
              </div>
              
              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Projets</h3>
                <p className="text-3xl font-bold">{stats.totalProjects}</p>
                <p className="text-sm opacity-75">Projets créés</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-800/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Projets récents</h3>
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getProfessionIcon(project.profession_needed)}</div>
                        <div>
                          <p className="text-white font-medium">{project.title}</p>
                          <p className="text-gray-400 text-sm">{project.location}</p>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`}></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Matches récents</h3>
                <div className="space-y-3">
                  {matches.slice(0, 5).map((match, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">💼</div>
                        <div>
                          <p className="text-white font-medium">Match #{match.id.substring(0, 8)}</p>
                          <p className="text-gray-400 text-sm">
                            {new Date(match.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${match.is_active ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Artisans Tab */}
        {activeTab === 'artisans' && (
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Gestion des Artisans</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300">Profession</th>
                    <th className="text-left py-3 px-4 text-gray-300">Expérience</th>
                    <th className="text-left py-3 px-4 text-gray-300">Localisation</th>
                    <th className="text-left py-3 px-4 text-gray-300">Note</th>
                    <th className="text-left py-3 px-4 text-gray-300">Statut</th>
                    <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {artisans.map((artisan) => (
                    <tr key={artisan.id} className="border-b border-gray-700/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{getProfessionIcon(artisan.profession)}</span>
                          <span className="text-white capitalize">{artisan.profession}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{artisan.experience_years} ans</td>
                      <td className="py-3 px-4 text-gray-300">{artisan.location}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-white">{artisan.rating || 0}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className={`w-3 h-3 rounded-full ${artisan.availability ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          Voir détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Gestion des Projets</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300">Titre</th>
                    <th className="text-left py-3 px-4 text-gray-300">Profession</th>
                    <th className="text-left py-3 px-4 text-gray-300">Localisation</th>
                    <th className="text-left py-3 px-4 text-gray-300">Budget</th>
                    <th className="text-left py-3 px-4 text-gray-300">Statut</th>
                    <th className="text-left py-3 px-4 text-gray-300">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-700/50">
                      <td className="py-3 px-4 text-white">{project.title}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{getProfessionIcon(project.profession_needed)}</span>
                          <span className="text-gray-300 capitalize">{project.profession_needed}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{project.location}</td>
                      <td className="py-3 px-4 text-gray-300">
                        {project.budget ? `${project.budget}€` : 'Non spécifié'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {new Date(project.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Gestion des Matches</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300">ID</th>
                    <th className="text-left py-3 px-4 text-gray-300">Particulier</th>
                    <th className="text-left py-3 px-4 text-gray-300">Artisan</th>
                    <th className="text-left py-3 px-4 text-gray-300">Date</th>
                    <th className="text-left py-3 px-4 text-gray-300">Statut</th>
                    <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match) => (
                    <tr key={match.id} className="border-b border-gray-700/50">
                      <td className="py-3 px-4 text-gray-300">#{match.id.substring(0, 8)}</td>
                      <td className="py-3 px-4 text-white">{match.particulier_id.substring(0, 8)}</td>
                      <td className="py-3 px-4 text-white">{match.artisan_id.substring(0, 8)}</td>
                      <td className="py-3 px-4 text-gray-300">
                        {new Date(match.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className={`w-3 h-3 rounded-full ${match.is_active ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          Voir détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;