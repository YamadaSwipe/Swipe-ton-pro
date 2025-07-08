import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    budget: '',
    profession_needed: 'electricien',
    location: '',
    urgency: 'normal'
  });

  const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

  const professions = [
    { value: 'electricien', label: 'Électricien', icon: '⚡' },
    { value: 'plombier', label: 'Plombier', icon: '🔧' },
    { value: 'menuisier', label: 'Menuisier', icon: '🪚' },
    { value: 'peintre', label: 'Peintre', icon: '🎨' },
    { value: 'macon', label: 'Maçon', icon: '🧱' },
    { value: 'chauffagiste', label: 'Chauffagiste', icon: '🔥' },
    { value: 'carreleur', label: 'Carreleur', icon: '🏗️' }
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const projectData = {
        ...newProject,
        budget: newProject.budget ? parseFloat(newProject.budget) : null
      };
      
      await axios.post(`${API_URL}/projects`, projectData);
      setShowCreateModal(false);
      setNewProject({
        title: '',
        description: '',
        budget: '',
        profession_needed: 'electricien',
        location: '',
        urgency: 'normal'
      });
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
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

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'text-red-400';
      case 'normal': return 'text-yellow-400';
      case 'flexible': return 'text-green-400';
      default: return 'text-gray-400';
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mes Projets</h1>
            <p className="text-gray-300">
              {user?.user_type === 'particulier' 
                ? 'Gérez vos projets et demandes' 
                : 'Découvrez les projets disponibles'}
            </p>
          </div>
          
          {user?.user_type === 'particulier' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              + Nouveau projet
            </button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {user?.user_type === 'particulier' 
                ? 'Aucun projet créé' 
                : 'Aucun projet disponible'}
            </h2>
            <p className="text-gray-300 mb-4">
              {user?.user_type === 'particulier' 
                ? 'Créez votre premier projet pour commencer !' 
                : 'Revenez plus tard pour voir de nouveaux projets.'}
            </p>
            {user?.user_type === 'particulier' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Créer un projet
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const profession = professions.find(p => p.value === project.profession_needed);
              
              return (
                <div
                  key={project.id}
                  className="bg-slate-800/50 rounded-lg p-6 hover:bg-slate-800/70 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{profession?.icon || '🔨'}</span>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`}></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getUrgencyColor(project.urgency)}`}>
                        {project.urgency === 'urgent' ? '🔥' : project.urgency === 'flexible' ? '🕐' : '⏰'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)} text-white`}>
                        {getStatusText(project.status)}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-white font-bold text-lg mb-2">{project.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{project.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="mr-2">🏢</span>
                      <span>{profession?.label || project.profession_needed}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="mr-2">📍</span>
                      <span>{project.location}</span>
                    </div>
                    {project.budget && (
                      <div className="flex items-center text-sm text-gray-400">
                        <span className="mr-2">💰</span>
                        <span>{project.budget}€</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="mr-2">📅</span>
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Voir détails
                    </button>
                    {user?.user_type === 'particulier' && project.user_id === user.id && (
                      <button className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                        Modifier
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Créer un nouveau projet</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Titre du projet
                  </label>
                  <input
                    type="text"
                    required
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Rénovation salle de bain"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Décrivez votre projet en détail..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Profession requise
                    </label>
                    <select
                      value={newProject.profession_needed}
                      onChange={(e) => setNewProject({...newProject, profession_needed: e.target.value})}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {professions.map(profession => (
                        <option key={profession.value} value={profession.value}>
                          {profession.icon} {profession.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Urgence
                    </label>
                    <select
                      value={newProject.urgency}
                      onChange={(e) => setNewProject({...newProject, urgency: e.target.value})}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="flexible">🕐 Flexible</option>
                      <option value="normal">⏰ Normal</option>
                      <option value="urgent">🔥 Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Localisation
                    </label>
                    <input
                      type="text"
                      required
                      value={newProject.location}
                      onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Paris, Lyon..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Budget (optionnel)
                    </label>
                    <input
                      type="number"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 1000"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Créer le projet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;