import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchUsers();
    fetchDocuments();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}/admin/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API}/admin/documents`);
      setDocuments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setLoading(false);
    }
  };

  const validateUser = async (userId) => {
    try {
      await axios.put(`${API}/admin/users/${userId}/validate`);
      await fetchUsers();
    } catch (error) {
      console.error('Error validating user:', error);
    }
  };

  const setFeaturedUser = async (userId) => {
    try {
      await axios.put(`${API}/admin/users/${userId}/feature`);
      await fetchUsers();
    } catch (error) {
      console.error('Error setting featured user:', error);
    }
  };

  const approveDocument = async (docId, comment = '') => {
    try {
      await axios.put(`${API}/admin/documents/${docId}/approve`, null, {
        params: { admin_comment: comment }
      });
      await fetchDocuments();
    } catch (error) {
      console.error('Error approving document:', error);
    }
  };

  const rejectDocument = async (docId, comment) => {
    try {
      await axios.put(`${API}/admin/documents/${docId}/reject`, null, {
        params: { admin_comment: comment }
      });
      await fetchDocuments();
    } catch (error) {
      console.error('Error rejecting document:', error);
    }
  };

  const getUserStatusColor = (status) => {
    switch (status) {
      case 'validated': return 'bg-green-600';
      case 'suspended': return 'bg-red-600';
      default: return 'bg-yellow-600';
    }
  };

  const getUserStatusText = (status) => {
    switch (status) {
      case 'validated': return 'Validé';
      case 'suspended': return 'Suspendu';
      default: return 'Mode fantôme';
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Administration</h1>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 text-blue-400 hover:text-blue-300"
          >
            Retour à l'accueil
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              activeTab === 'users' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Utilisateurs ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              activeTab === 'documents' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Documents ({documents.length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h2>
            
            <div className="grid gap-4">
              {users.map((user) => (
                <div key={user.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">
                            {user.first_name[0]}{user.last_name[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {user.first_name} {user.last_name}
                          </h3>
                          <p className="text-gray-400">{user.email}</p>
                        </div>
                        {user.is_featured && (
                          <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm">
                            ⭐ Vedette
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-gray-400">Type:</span>
                          <p className="capitalize">{user.user_type}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">Statut:</span>
                          <p className="capitalize">{user.company_status?.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">Téléphone:</span>
                          <p>{user.phone || 'Non renseigné'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">Inscription:</span>
                          <p>{new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {user.company_name && (
                        <div className="mb-3">
                          <span className="text-sm text-gray-400">Entreprise:</span>
                          <p>{user.company_name}</p>
                        </div>
                      )}

                      {user.description && (
                        <div className="mb-3">
                          <span className="text-sm text-gray-400">Description:</span>
                          <p className="text-sm">{user.description}</p>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${getUserStatusColor(user.status)}`}>
                          {getUserStatusText(user.status)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {user.status !== 'validated' && (
                        <button
                          onClick={() => validateUser(user.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                        >
                          Valider
                        </button>
                      )}
                      
                      <button
                        onClick={() => setFeaturedUser(user.id)}
                        className={`px-4 py-2 rounded text-sm ${
                          user.is_featured 
                            ? 'bg-yellow-700 text-white' 
                            : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        }`}
                      >
                        {user.is_featured ? 'Retirer vedette' : 'Mettre en vedette'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Validation des documents</h2>
            
            <div className="grid gap-4">
              {documents.map((doc) => {
                const user = users.find(u => u.id === doc.user_id);
                return (
                  <div key={doc.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold">
                              {user ? `${user.first_name[0]}${user.last_name[0]}` : 'U'}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{doc.name}</h3>
                            <p className="text-gray-400">
                              {user ? `${user.first_name} ${user.last_name}` : 'Utilisateur inconnu'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                          <div>
                            <span className="text-sm text-gray-400">Type:</span>
                            <p className="capitalize">{doc.document_type.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-400">Uploadé le:</span>
                            <p>{new Date(doc.created_at).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-400">Statut:</span>
                            <span className={`px-2 py-1 rounded-full text-sm ${getDocumentStatusColor(doc.status)}`}>
                              {getDocumentStatusText(doc.status)}
                            </span>
                          </div>
                        </div>

                        {doc.admin_comment && (
                          <div className="mb-3">
                            <span className="text-sm text-gray-400">Commentaire admin:</span>
                            <p className="text-sm italic">{doc.admin_comment}</p>
                          </div>
                        )}

                        <div className="mb-3">
                          <button
                            onClick={() => {
                              // Créer un lien de téléchargement pour visualiser le document
                              const link = document.createElement('a');
                              link.href = doc.content;
                              link.download = doc.name;
                              link.click();
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                          >
                            Télécharger le document
                          </button>
                        </div>
                      </div>

                      {doc.status === 'pending' && (
                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            onClick={() => {
                              const comment = prompt('Commentaire d\'approbation (optionnel):');
                              approveDocument(doc.id, comment || '');
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                          >
                            Approuver
                          </button>
                          
                          <button
                            onClick={() => {
                              const comment = prompt('Raison du rejet (obligatoire):');
                              if (comment) {
                                rejectDocument(doc.id, comment);
                              }
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                          >
                            Rejeter
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {documents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">Aucun document en attente de validation</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;