import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    professions: ['electricien'],
    description: '',
    experience_years: '',
    hourly_rate_min: '',
    hourly_rate_max: '',
    location: '',
    radius_km: 50,
    certifications: [],
    company_info: {
      company_name: '',
      siret: '',
      company_type: 'micro_entreprise',
      address: '',
      city: '',
      postal_code: '',
      insurance_number: '',
      website: ''
    }
  });

  // Profile particulier
  const [particulierProfile, setParticulierProfile] = useState(null);
  const [showParticulierProfile, setShowParticulierProfile] = useState(false);
  const [particulierData, setParticulierData] = useState({
    address: '',
    city: '',
    postal_code: '',
    property_type: 'appartement',
    property_size: '',
    preferred_contact: 'email',
    availability_schedule: 'flexible'
  });

  // Documents
  const [documents, setDocuments] = useState([]);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [documentData, setDocumentData] = useState({
    name: '',
    type: 'kbis',
    file: null
  });

  const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

  const professions = [
    { value: 'electricien', label: 'Électricien', icon: '⚡' },
    { value: 'plombier', label: 'Plombier', icon: '🔧' },
    { value: 'menuisier', label: 'Menuisier', icon: '🪚' },
    { value: 'peintre', label: 'Peintre', icon: '🎨' },
    { value: 'macon', label: 'Maçon', icon: '🧱' },
    { value: 'chauffagiste', label: 'Chauffagiste', icon: '🔥' },
    { value: 'carreleur', label: 'Carreleur', icon: '🏗️' },
    { value: 'couvreur', label: 'Couvreur', icon: '🏠' },
    { value: 'serrurerie', label: 'Serrurier', icon: '🔑' },
    { value: 'jardinage', label: 'Jardinage', icon: '🌱' },
    { value: 'nettoyage', label: 'Nettoyage', icon: '🧽' },
    { value: 'demenagement', label: 'Déménagement', icon: '📦' }
  ];

  const companyTypes = [
    { value: 'micro_entreprise', label: 'Micro-entreprise' },
    { value: 'auto_entrepreneur', label: 'Auto-entrepreneur' },
    { value: 'entreprise_individuelle', label: 'Entreprise individuelle' },
    { value: 'sarl', label: 'SARL' },
    { value: 'sas', label: 'SAS' },
    { value: 'sasu', label: 'SASU' }
  ];

  const documentTypes = [
    { value: 'kbis', label: 'Kbis' },
    { value: 'insurance', label: 'Assurance RC' },
    { value: 'certification', label: 'Certification' },
    { value: 'rge', label: 'RGE' },
    { value: 'other', label: 'Autre' }
  ];

  useEffect(() => {
    if (user?.user_type === 'artisan') {
      fetchArtisanProfile();
    } else if (user?.user_type === 'particulier') {
      fetchParticulierProfile();
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
        setProfileData({
          professions: userProfile.professions || ['electricien'],
          description: userProfile.description || '',
          experience_years: userProfile.experience_years || '',
          hourly_rate_min: userProfile.hourly_rate_min || '',
          hourly_rate_max: userProfile.hourly_rate_max || '',
          location: userProfile.location || '',
          radius_km: userProfile.radius_km || 50,
          certifications: userProfile.certifications || [],
          company_info: userProfile.company_info || {
            company_name: '',
            siret: '',
            company_type: 'micro_entreprise',
            address: '',
            city: '',
            postal_code: '',
            insurance_number: '',
            website: ''
          }
        });
        setDocuments(userProfile.documents || []);
      }
    } catch (error) {
      console.error('Error fetching artisan profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticulierProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/particulier/profiles`);
      const userProfile = response.data.find(p => p.user_id === user.id);
      setParticulierProfile(userProfile);
      if (userProfile) {
        setParticulierData({
          address: userProfile.address || '',
          city: userProfile.city || '',
          postal_code: userProfile.postal_code || '',
          property_type: userProfile.property_type || 'appartement',
          property_size: userProfile.property_size || '',
          preferred_contact: userProfile.preferred_contact || 'email',
          availability_schedule: userProfile.availability_schedule || 'flexible'
        });
      }
    } catch (error) {
      console.error('Error fetching particulier profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArtisanProfile = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...profileData,
        experience_years: parseInt(profileData.experience_years),
        hourly_rate_min: profileData.hourly_rate_min ? parseFloat(profileData.hourly_rate_min) : null,
        hourly_rate_max: profileData.hourly_rate_max ? parseFloat(profileData.hourly_rate_max) : null,
        property_size: profileData.property_size ? parseInt(profileData.property_size) : null
      };
      
      await axios.post(`${API_URL}/artisan/profile`, data);
      setShowCreateProfile(false);
      fetchArtisanProfile();
    } catch (error) {
      console.error('Error creating artisan profile:', error);
    }
  };

  const handleCreateParticulierProfile = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...particulierData,
        property_size: particulierData.property_size ? parseInt(particulierData.property_size) : null
      };
      
      await axios.post(`${API_URL}/particulier/profile`, data);
      setShowParticulierProfile(false);
      fetchParticulierProfile();
    } catch (error) {
      console.error('Error creating particulier profile:', error);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setDocumentData({
          ...documentData,
          file: base64String
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = async (e) => {
    e.preventDefault();
    if (!documentData.file) return;

    try {
      await axios.post(`${API_URL}/artisan/profile/document`, {
        name: documentData.name,
        type: documentData.type,
        file_data: documentData.file
      });
      
      setShowDocumentUpload(false);
      setDocumentData({ name: '', type: 'kbis', file: null });
      fetchArtisanProfile();
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  const toggleProfession = (profession) => {
    const newProfessions = profileData.professions.includes(profession)
      ? profileData.professions.filter(p => p !== profession)
      : [...profileData.professions, profession];
    
    setProfileData({
      ...profileData,
      professions: newProfessions
    });
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

  const getValidationStatusColor = (status) => {
    switch (status) {
      case 'validated': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getValidationStatusText = (status) => {
    switch (status) {
      case 'validated': return 'Validé';
      case 'pending': return 'En attente';
      case 'rejected': return 'Rejeté';
      default: return 'Inconnu';
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mon Profil</h1>
          <p className="text-gray-300">Gérez vos informations personnelles et professionnelles</p>
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
                {user?.validation_status && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className={`text-sm ${getValidationStatusColor(user.validation_status)}`}>
                      {getValidationStatusText(user.validation_status)}
                    </span>
                  </>
                )}
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
          <div className="bg-slate-800/50 rounded-lg p-6 mb-8">
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
                {/* Validation Status */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold">Statut de validation</h4>
                      <p className={`text-sm ${getValidationStatusColor(profile.validation_status)}`}>
                        {getValidationStatusText(profile.validation_status)}
                      </p>
                    </div>
                    {profile.validation_status === 'pending' && (
                      <div className="text-yellow-400 text-sm">
                        ⏳ En attente de validation admin
                      </div>
                    )}
                    {profile.validation_status === 'validated' && (
                      <div className="text-green-400 text-sm">
                        ✅ Profil validé
                      </div>
                    )}
                    {profile.validation_status === 'rejected' && (
                      <div className="text-red-400 text-sm">
                        ❌ Profil rejeté
                      </div>
                    )}
                  </div>
                </div>

                {/* Professions */}
                <div className="flex items-center space-x-4 flex-wrap">
                  {profile.professions.map((profession, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="text-2xl">
                        {professions.find(p => p.value === profession)?.icon || '🔨'}
                      </div>
                      <span className="text-white font-bold">
                        {professions.find(p => p.value === profession)?.label || profession}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Company Info */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="text-white font-bold mb-3">Informations Entreprise</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Nom de l'entreprise</p>
                      <p className="text-white">{profile.company_info.company_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">SIRET</p>
                      <p className="text-white">{profile.company_info.siret}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Type</p>
                      <p className="text-white">{profile.company_info.company_type}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Adresse</p>
                      <p className="text-white">{profile.company_info.address}, {profile.company_info.city}</p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-bold">Documents</h4>
                    <button
                      onClick={() => setShowDocumentUpload(true)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Ajouter document
                    </button>
                  </div>
                  {documents.length > 0 ? (
                    <div className="space-y-2">
                      {documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-600/50 rounded p-2">
                          <div>
                            <p className="text-white text-sm">{doc.name}</p>
                            <p className="text-gray-400 text-xs">{doc.type}</p>
                          </div>
                          <div className={`text-xs px-2 py-1 rounded ${
                            doc.validated ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
                          }`}>
                            {doc.validated ? 'Validé' : 'En attente'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">Aucun document uploadé</p>
                  )}
                </div>

                {/* Professional Info */}
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
                        <span className="text-white">
                          {profile.hourly_rate_min && profile.hourly_rate_max 
                            ? `${profile.hourly_rate_min}-${profile.hourly_rate_max}€/h`
                            : 'Non renseigné'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Localisation:</span>
                        <span className="text-white">{profile.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rayon d'action:</span>
                        <span className="text-white">{profile.radius_km} km</span>
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
                          <div key={index} className="bg-slate-700/50 rounded-lg p-2">
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

        {/* Particulier Profile Section */}
        {user?.user_type === 'particulier' && (
          <div className="bg-slate-800/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Profil Particulier</h3>
              {!particulierProfile && (
                <button
                  onClick={() => setShowParticulierProfile(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Compléter mon profil
                </button>
              )}
            </div>

            {particulierProfile ? (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-lg font-semibold text-white mb-3">Informations du logement</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Adresse:</span>
                        <span className="text-white">{particulierProfile.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Ville:</span>
                        <span className="text-white">{particulierProfile.city} ({particulierProfile.postal_code})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white">{particulierProfile.property_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Surface:</span>
                        <span className="text-white">{particulierProfile.property_size || 'Non renseigné'} m²</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-lg font-semibold text-white mb-3">Préférences</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Contact préféré:</span>
                        <span className="text-white">{particulierProfile.preferred_contact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Disponibilité:</span>
                        <span className="text-white">{particulierProfile.availability_schedule}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                {particulierProfile.project_details && Object.keys(particulierProfile.project_details).length > 0 && (
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h5 className="text-white font-bold mb-3">Détails projet (visibles aux artisans matchés)</h5>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(particulierProfile.project_details).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-gray-400 text-sm capitalize">{key.replace('_', ' ')}</p>
                          <p className="text-white">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🏠</div>
                <h4 className="text-xl font-bold text-white mb-2">Complétez votre profil</h4>
                <p className="text-gray-300 mb-4">
                  Ajoutez des informations sur votre logement et vos préférences
                </p>
                <button
                  onClick={() => setShowParticulierProfile(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Compléter mon profil
                </button>
              </div>
            )}
          </div>
        )}

        {/* Create Artisan Profile Modal */}
        {showCreateProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Créer votre profil artisan</h3>
                <button
                  onClick={() => setShowCreateProfile(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateArtisanProfile} className="space-y-6">
                {/* Professions - Multi-choix */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Métiers (plusieurs choix possible)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {professions.map(profession => (
                      <button
                        key={profession.value}
                        type="button"
                        onClick={() => toggleProfession(profession.value)}
                        className={`p-3 rounded-lg border text-sm font-medium ${
                          profileData.professions.includes(profession.value)
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {profession.icon} {profession.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Company Info */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="text-white font-bold mb-4">Informations Entreprise</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nom de l'entreprise
                      </label>
                      <input
                        type="text"
                        required
                        value={profileData.company_info.company_name}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          company_info: { ...profileData.company_info, company_name: e.target.value }
                        })}
                        className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                        placeholder="Ex: MonEntreprise SARL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        SIRET
                      </label>
                      <input
                        type="text"
                        required
                        value={profileData.company_info.siret}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          company_info: { ...profileData.company_info, siret: e.target.value }
                        })}
                        className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                        placeholder="12345678901234"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Type d'entreprise
                      </label>
                      <select
                        value={profileData.company_info.company_type}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          company_info: { ...profileData.company_info, company_type: e.target.value }
                        })}
                        className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                      >
                        {companyTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        required
                        value={profileData.company_info.address}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          company_info: { ...profileData.company_info, address: e.target.value }
                        })}
                        className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                        placeholder="123 Rue de la Paix"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Ville
                      </label>
                      <input
                        type="text"
                        required
                        value={profileData.company_info.city}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          company_info: { ...profileData.company_info, city: e.target.value }
                        })}
                        className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                        placeholder="Paris"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Code postal
                      </label>
                      <input
                        type="text"
                        required
                        value={profileData.company_info.postal_code}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          company_info: { ...profileData.company_info, postal_code: e.target.value }
                        })}
                        className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                        placeholder="75001"
                      />
                    </div>
                  </div>
                </div>

                {/* Rest of the form */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Années d'expérience
                    </label>
                    <input
                      type="number"
                      required
                      value={profileData.experience_years}
                      onChange={(e) => setProfileData({...profileData, experience_years: e.target.value})}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                      placeholder="5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Localisation
                    </label>
                    <input
                      type="text"
                      required
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                      placeholder="Paris, Lyon..."
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tarif horaire min (€)
                    </label>
                    <input
                      type="number"
                      value={profileData.hourly_rate_min}
                      onChange={(e) => setProfileData({...profileData, hourly_rate_min: e.target.value})}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                      placeholder="40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tarif horaire max (€)
                    </label>
                    <input
                      type="number"
                      value={profileData.hourly_rate_max}
                      onChange={(e) => setProfileData({...profileData, hourly_rate_max: e.target.value})}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                      placeholder="60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rayon d'action (km)
                    </label>
                    <input
                      type="number"
                      value={profileData.radius_km}
                      onChange={(e) => setProfileData({...profileData, radius_km: e.target.value})}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                      placeholder="50"
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
                    className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                    rows="4"
                    placeholder="Décrivez votre expertise et vos services..."
                  />
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

        {/* Document Upload Modal */}
        {showDocumentUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Ajouter un document</h3>
                <button
                  onClick={() => setShowDocumentUpload(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleDocumentUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom du document
                  </label>
                  <input
                    type="text"
                    required
                    value={documentData.name}
                    onChange={(e) => setDocumentData({...documentData, name: e.target.value})}
                    className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Ex: Kbis 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type de document
                  </label>
                  <select
                    value={documentData.type}
                    onChange={(e) => setDocumentData({...documentData, type: e.target.value})}
                    className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                  >
                    {documentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fichier
                  </label>
                  <input
                    type="file"
                    required
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowDocumentUpload(false)}
                    className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Uploader
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Particulier Profile Modal */}
        {showParticulierProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Compléter votre profil</h3>
                <button
                  onClick={() => setShowParticulierProfile(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateParticulierProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    required
                    value={particulierData.address}
                    onChange={(e) => setParticulierData({...particulierData, address: e.target.value})}
                    className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                    placeholder="123 Rue de la Paix"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      required
                      value={particulierData.city}
                      onChange={(e) => setParticulierData({...particulierData, city: e.target.value})}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                      placeholder="Paris"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Code postal
                    </label>
                    <input
                      type="text"
                      required
                      value={particulierData.postal_code}
                      onChange={(e) => setParticulierData({...particulierData, postal_code: e.target.value})}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                      placeholder="75001"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Type de logement
                    </label>
                    <select
                      value={particulierData.property_type}
                      onChange={(e) => setParticulierData({...particulierData, property_type: e.target.value})}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                    >
                      <option value="appartement">Appartement</option>
                      <option value="maison">Maison</option>
                      <option value="local_commercial">Local commercial</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Surface (m²)
                    </label>
                    <input
                      type="number"
                      value={particulierData.property_size}
                      onChange={(e) => setParticulierData({...particulierData, property_size: e.target.value})}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                      placeholder="80"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Contact préféré
                    </label>
                    <select
                      value={particulierData.preferred_contact}
                      onChange={(e) => setParticulierData({...particulierData, preferred_contact: e.target.value})}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Téléphone</option>
                      <option value="both">Les deux</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Disponibilité
                    </label>
                    <select
                      value={particulierData.availability_schedule}
                      onChange={(e) => setParticulierData({...particulierData, availability_schedule: e.target.value})}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                    >
                      <option value="matin">Matin</option>
                      <option value="apres_midi">Après-midi</option>
                      <option value="soir">Soir</option>
                      <option value="weekend">Weekend</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowParticulierProfile(false)}
                    className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sauvegarder
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