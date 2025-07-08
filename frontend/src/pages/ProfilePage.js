import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    profession: 'electricien',
    description: '',
    experience_years: '',
    hourly_rate: '',
    location: '',
    certifications: []
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
    if (user?.user_type === 'artisan') {
      fetchArtisanProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchArtisanProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/artisan/profiles`);
      const userProfile = response.data.find(p => p.user_id === user.id);
      setProfile(userProfile);
      if (userProfile) {
        setProfileData(userProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...profileData,
        experience_years: parseInt(profileData.experience_years),
        hourly_rate: profileData.hourly_rate ? parseFloat(profileData.hourly_rate) : null
      };
      
      await axios.post(`${API_URL}/artisan/profile`, data);
      setShowCreateProfile(false);
      fetchArtisanProfile();
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const addCertification = () => {
    const cert = prompt('Nouvelle certification:');
    if (cert) {
      setProfileData({
        ...profileData,
        certifications: [...profileData.certifications, cert]
      });
    }
  };

  const removeCertification = (index) => {
    setProfileData({
      ...profileData,
      certifications: profileData.certifications.filter((_, i) => i !== index)
    });
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mon Profil</h1>
          <p className="text-gray-300">Gérez vos informations personnelles</p>
        </div>

        {/* User Information */}
        <div className="bg-slate-800/50 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-gray-300">{user?.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <div className={`w-3 h-3 rounded-full ${user?.is_active ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className={`text-sm ${user?.is_active ? 'text-green-400' : 'text-red-400'}`}>
                  {user?.is_active ? 'Actif' : 'Inactif'}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-blue-400 capitalize">{user?.user_type}</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Informations personnelles</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Téléphone:</span>
                  <span className="text-white">{user?.phone || 'Non renseigné'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Membre depuis:</span>
                  <span className="text-white">
                    {new Date(user?.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Statistiques</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-400">0</div>
                  <div className="text-sm text-gray-400">Matches</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">0</div>
                  <div className="text-sm text-gray-400">Projets</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Artisan Profile Section */}
        {user?.user_type === 'artisan' && (
          <div className="bg-slate-800/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Profil Artisan</h3>
              {!profile && (
                <button
                  onClick={() => setShowCreateProfile(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Créer mon profil
                </button>
              )}
            </div>

            {profile ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">
                    {professions.find(p => p.value === profile.profession)?.icon || '🔨'}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">
                      {professions.find(p => p.value === profile.profession)?.label || profile.profession}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <div className="text-yellow-400">
                        {'⭐'.repeat(Math.floor(profile.rating || 0))}
                      </div>
                      <span className="text-white">{profile.rating || 0}/5</span>
                      <span className="text-gray-400">({profile.reviews_count || 0} avis)</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-lg font-semibold text-white mb-3">Informations professionnelles</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expérience:</span>
                        <span className="text-white">{profile.experience_years} ans</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tarif horaire:</span>
                        <span className="text-white">{profile.hourly_rate || 'Non renseigné'}€/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Localisation:</span>
                        <span className="text-white">{profile.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Disponibilité:</span>
                        <span className={`${profile.availability ? 'text-green-400' : 'text-red-400'}`}>
                          {profile.availability ? 'Disponible' : 'Indisponible'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-lg font-semibold text-white mb-3">Certifications</h5>
                    {profile.certifications?.length > 0 ? (
                      <div className="space-y-2">
                        {profile.certifications.map((cert, index) => (
                          <div key={index} className="bg-slate-700/50 rounded-lg p-2 flex items-center justify-between">
                            <span className="text-white text-sm">✓ {cert}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">Aucune certification</p>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="text-lg font-semibold text-white mb-3">Description</h5>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-gray-300 leading-relaxed">
                      {profile.description || 'Aucune description'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔨</div>
                <h4 className="text-xl font-bold text-white mb-2">Créez votre profil artisan</h4>
                <p className="text-gray-300 mb-4">
                  Complétez votre profil pour être visible par les clients
                </p>
                <button
                  onClick={() => setShowCreateProfile(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Créer mon profil
                </button>
              </div>
            )}
          </div>
        )}

        {/* Create Profile Modal */}
        {showCreateProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Créer votre profil artisan</h3>
                <button
                  onClick={() => setShowCreateProfile(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProfile} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Profession
                    </label>
                    <select
                      value={profileData.profession}
                      onChange={(e) => setProfileData({...profileData, profession: e.target.value})}
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
                      Années d'expérience
                    </label>
                    <input
                      type="number"
                      required
                      value={profileData.experience_years}
                      onChange={(e) => setProfileData({...profileData, experience_years: e.target.value})}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={profileData.description}
                    onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                    className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Décrivez votre expertise et vos services..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Localisation
                    </label>
                    <input
                      type="text"
                      required
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Paris, Lyon..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tarif horaire (€)
                    </label>
                    <input
                      type="number"
                      value={profileData.hourly_rate}
                      onChange={(e) => setProfileData({...profileData, hourly_rate: e.target.value})}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Certifications
                  </label>
                  <div className="space-y-2">
                    {profileData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={cert}
                          onChange={(e) => {
                            const newCerts = [...profileData.certifications];
                            newCerts[index] = e.target.value;
                            setProfileData({...profileData, certifications: newCerts});
                          }}
                          className="flex-1 p-2 bg-slate-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Certification..."
                        />
                        <button
                          type="button"
                          onClick={() => removeCertification(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addCertification}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      + Ajouter une certification
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateProfile(false)}
                    className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Créer le profil
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

export default ProfilePage;