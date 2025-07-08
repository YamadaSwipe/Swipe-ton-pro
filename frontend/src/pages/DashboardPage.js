import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    matches: 0,
    projects: 0,
    messages: 0
  });
  const [recentMatches, setRecentMatches] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [matchesRes, projectsRes] = await Promise.all([
        axios.get(`${API_URL}/matches`),
        axios.get(`${API_URL}/projects`)
      ]);

      setStats({
        matches: matchesRes.data.length,
        projects: projectsRes.data.length,
        messages: 0 // Will be implemented later
      });

      setRecentMatches(matchesRes.data.slice(0, 5));
      setRecentProjects(projectsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bienvenue, {user?.first_name} !
          </h1>
          <p className="text-gray-300">
            Voici un aperçu de votre activité sur SwipeTonPro
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Matches</h3>
                <p className="text-3xl font-bold">{stats.matches}</p>
              </div>
              <div className="text-4xl opacity-75">💼</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Projets</h3>
                <p className="text-3xl font-bold">{stats.projects}</p>
              </div>
              <div className="text-4xl opacity-75">📋</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Messages</h3>
                <p className="text-3xl font-bold">{stats.messages}</p>
              </div>
              <div className="text-4xl opacity-75">💬</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {user?.user_type === 'particulier' && (
            <Link
              to="/swipe"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-lg text-center hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              <div className="text-2xl mb-2">🔥</div>
              <div className="font-semibold">Swiper</div>
            </Link>
          )}
          
          <Link
            to="/matches"
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-4 rounded-lg text-center hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105"
          >
            <div className="text-2xl mb-2">💼</div>
            <div className="font-semibold">Mes Matches</div>
          </Link>
          
          <Link
            to="/projects"
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg text-center hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="font-semibold">Mes Projets</div>
          </Link>
          
          <Link
            to="/profile"
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-lg text-center hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105"
          >
            <div className="text-2xl mb-2">👤</div>
            <div className="font-semibold">Mon Profil</div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Matches */}
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Matches récents</h3>
            {recentMatches.length > 0 ? (
              <div className="space-y-3">
                {recentMatches.map((match, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">👤</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Match #{index + 1}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(match.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/matches`}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Voir →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Aucun match pour le moment</p>
            )}
          </div>

          {/* Recent Projects */}
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Projets récents</h3>
            {recentProjects.length > 0 ? (
              <div className="space-y-3">
                {recentProjects.map((project, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">📋</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{project.title}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(project.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/projects`}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Voir →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Aucun projet pour le moment</p>
            )}
          </div>
        </div>

        {/* User Type Specific Content */}
        {user?.user_type === 'particulier' && (
          <div className="mt-8 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-lg p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold text-white mb-2">🎯 Conseils pour les particuliers</h3>
            <p className="text-gray-300 mb-4">
              Maximisez vos chances de trouver le bon artisan !
            </p>
            <ul className="text-gray-300 space-y-2">
              <li>• Soyez précis dans vos descriptions de projets</li>
              <li>• Swipez régulièrement pour découvrir de nouveaux artisans</li>
              <li>• Répondez rapidement aux messages des artisans</li>
              <li>• Laissez des avis après chaque collaboration</li>
            </ul>
          </div>
        )}

        {user?.user_type === 'artisan' && (
          <div className="mt-8 bg-gradient-to-r from-green-500/20 to-blue-600/20 rounded-lg p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-2">🔨 Conseils pour les artisans</h3>
            <p className="text-gray-300 mb-4">
              Développez votre activité sur SwipeTonPro !
            </p>
            <ul className="text-gray-300 space-y-2">
              <li>• Complétez votre profil avec des photos de vos réalisations</li>
              <li>• Maintenez vos disponibilités à jour</li>
              <li>• Répondez rapidement aux demandes de devis</li>
              <li>• Encouragez vos clients à laisser des avis</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;