import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    title: '',
    description: '',
    skills: [],
    experience_years: '',
    location: '',
    hourly_rate: '',
    availability: '',
    portfolio_images: []
  });
  const [newSkill, setNewSkill] = useState('');
  const [newDocument, setNewDocument] = useState({
    name: '',
    document_type: 'kbis',
    content: ''
  });

  useEffect(() => {
    fetchProfile();
    fetchDocuments();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API}/profiles/me`);
      if (response.data) {
        setProfile(response.data);
        setProfileData(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API}/documents/me`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const saveProfile = async () => {
    try {
      if (profile) {
        await axios.put(`${API}/profiles/me`, profileData);
      } else {
        await axios.post(`${API}/profiles`, profileData);
      }
      await fetchProfile();
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (e, isDocument = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Content = e.target.result;
      
      if (isDocument) {
        setNewDocument(prev => ({
          ...prev,
          content: base64Content
        }));
      } else {
        // Add to portfolio images
        setProfileData(prev => ({
          ...prev,
          portfolio_images: [...prev.portfolio_images, base64Content]
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadDocument = async () => {
    if (!newDocument.name || !newDocument.content) return;

    try {
      await axios.post(`${API}/documents`, newDocument);
      setNewDocument({ name: '', document_type: 'kbis', content: '' });
      await fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-600';
      case 'rejected': return 'bg-red-600';
      default: return 'bg-yellow-600';
    }
  };

  const getDocumentStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      default: return 'En attente';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Mon Profil</h1>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 text-blue-400 hover:text-blue-300"
          >
            Retour à l'accueil
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Profil Professionnel</h2>
              <button
                onClick={() => editing ? saveProfile() : setEditing(true)}
                className={`px-4 py-2 rounded ${
                  editing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {editing ? 'Sauvegarder' : 'Modifier'}
              </button>
            </div>

            {!profile && !editing ? (
              <div className="text-center">
                <p className="text-gray-400 mb-4">Vous n'avez pas encore de profil</p>
                <button
                  onClick={() => setEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                >
                  Créer mon profil
                </button>
              </div>
            ) : editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <input
                    type="text"
                    name="title"
                    value={profileData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                    placeholder="Ex: Développeur Full Stack"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={profileData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                    placeholder="Décrivez votre expertise..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Compétences</label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      className="flex-1 px-3 py-2 bg-gray-700 text-white rounded"
                      placeholder="Ajouter une compétence"
                    />
                    <button
                      onClick={addSkill}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Ajouter
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => removeSkill(index)}
                          className="text-white hover:text-red-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expérience (années)</label>
                    <input
                      type="number"
                      name="experience_years"
                      value={profileData.experience_years}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tarif horaire (€)</label>
                    <input
                      type="number"
                      name="hourly_rate"
                      value={profileData.hourly_rate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Localisation</label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                    placeholder="Ex: Paris, France"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Disponibilité</label>
                  <input
                    type="text"
                    name="availability"
                    value={profileData.availability}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                    placeholder="Ex: Disponible immédiatement"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Images Portfolio</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, false)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                  />
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {profileData.portfolio_images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          onClick={() => setProfileData(prev => ({
                            ...prev,
                            portfolio_images: prev.portfolio_images.filter((_, i) => i !== index)
                          }))}
                          className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{profile.title}</h3>
                  <p className="text-gray-300">{profile.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Compétences</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Expérience</h4>
                    <p className="text-gray-300">{profile.experience_years} ans</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Tarif</h4>
                    <p className="text-gray-300">{profile.hourly_rate}€/h</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Localisation</h4>
                  <p className="text-gray-300">{profile.location}</p>
                </div>

                <div>
                  <h4 className="font-medium">Disponibilité</h4>
                  <p className="text-gray-300">{profile.availability}</p>
                </div>

                {profile.portfolio_images.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Portfolio</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {profile.portfolio_images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Documents Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Documents</h2>

            {/* Upload new document */}
            <div className="mb-6 space-y-4">
              <h3 className="text-lg font-semibold">Ajouter un document</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Nom du document</label>
                <input
                  type="text"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                  placeholder="Ex: KBIS de l'entreprise"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type de document</label>
                <select
                  value={newDocument.document_type}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, document_type: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                >
                  <option value="kbis">KBIS</option>
                  <option value="carte_identite">Carte d'identité</option>
                  <option value="justificatif_domicile">Justificatif de domicile</option>
                  <option value="diplome">Diplôme</option>
                  <option value="portfolio">Portfolio</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fichier</label>
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, true)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                />
              </div>
              <button
                onClick={uploadDocument}
                disabled={!newDocument.name || !newDocument.content}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
              >
                Uploader le document
              </button>
            </div>

            {/* Existing documents */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Mes documents ({documents.length})</h3>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{doc.name}</h4>
                        <p className="text-sm text-gray-400 capitalize">
                          {doc.document_type.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${getDocumentStatusColor(doc.status)}`}>
                        {getDocumentStatusText(doc.status)}
                      </span>
                    </div>
                    {doc.admin_comment && (
                      <p className="text-sm text-gray-300 mt-2 italic">
                        Commentaire admin: {doc.admin_comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;