import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = ({ token, admin, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  // Boost config states
  const [boostConfig, setBoostConfig] = useState({ cost: '', enabled: false });
  const [boostProId, setBoostProId] = useState('');
  const [boostProConfig, setBoostProConfig] = useState(null);
  const [boostLoading, setBoostLoading] = useState(false);
  const [boostMsg, setBoostMsg] = useState('');
  // Fetch global boost config
  const fetchBoostConfig = async () => {
    setBoostLoading(true);
    setBoostMsg('');
    try {
      const res = await axios.get(`${API}/admin/boost-config`, axiosConfig);
      setBoostConfig(res.data);
    } catch (e) {
      setBoostMsg('Erreur chargement config boost');
    }
    setBoostLoading(false);
  };

  // Update global boost config
  const updateBoostConfig = async () => {
    setBoostLoading(true);
    setBoostMsg('');
    try {
      await axios.put(`${API}/admin/boost-config`, boostConfig, axiosConfig);
      setBoostMsg('Config boost globale mise à jour');
    } catch (e) {
      setBoostMsg('Erreur maj config boost');
    }
    setBoostLoading(false);
  };

  // Fetch boost config for a pro
  const fetchBoostProConfig = async () => {
    setBoostLoading(true);
    setBoostMsg('');
    try {
      const res = await axios.get(`${API}/admin/boost-config/${boostProId}`, axiosConfig);
      setBoostProConfig(res.data);
    } catch (e) {
      setBoostMsg('Erreur chargement config pro');
      setBoostProConfig(null);
    }
    setBoostLoading(false);
  };

  // Update boost config for a pro
  const updateBoostProConfig = async () => {
    setBoostLoading(true);
    setBoostMsg('');
    try {
      await axios.put(`${API}/admin/boost-config/${boostProId}`, boostProConfig, axiosConfig);
      setBoostMsg('Config boost pro mise à jour');
    } catch (e) {
      setBoostMsg('Erreur maj config pro');
    }
    setBoostLoading(false);
  };
  // Onglet Boost
  const renderBoost = () => (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Configuration Boost Swipe</h3>
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Config globale</h4>
        <div className="flex items-center space-x-4 mb-2">
          <label className="font-medium">Coût (crédits):</label>
          <input type="number" min="1" value={boostConfig.cost}
            onChange={e => setBoostConfig({ ...boostConfig, cost: e.target.value })}
            className="border rounded px-2 py-1 w-24" />
          <label className="font-medium">Activé:</label>
          <input type="checkbox" checked={boostConfig.enabled}
            onChange={e => setBoostConfig({ ...boostConfig, enabled: e.target.checked })}
            className="ml-2" />
          <button onClick={updateBoostConfig} disabled={boostLoading}
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Enregistrer
          </button>
        </div>
      </div>
      <div className="mb-4 border-t pt-4">
        <h4 className="font-semibold mb-2">Config par pro</h4>
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="text"
            placeholder="Recherche pro (nom, email ou ID)"
            value={boostProId}
            onChange={e => setBoostProId(e.target.value)}
            className="border rounded px-2 py-1 w-64"
            aria-label="Recherche professionnel par nom, email ou ID"
            autoComplete="off"
            onKeyDown={e => { if (e.key === 'Enter') fetchBoostProConfig(); }}
          />
          <button
            onClick={fetchBoostProConfig}
            disabled={boostLoading || !boostProId}
            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
            aria-label="Charger la configuration du pro sélectionné"
          >
            Charger config
          </button>
        </div>
        {/* Liste filtrée des pros (affichage dynamique, accessibilité, UX) */}
        {boostProId && users.length > 0 && (
          <div className="max-h-40 overflow-y-auto border rounded mb-2 bg-gray-50" role="listbox" aria-label="Résultats professionnels">
            {users.filter(u =>
              (u.is_professional && (
                u.id.toLowerCase().includes(boostProId.toLowerCase()) ||
                (u.name && u.name.toLowerCase().includes(boostProId.toLowerCase())) ||
                (u.email && u.email.toLowerCase().includes(boostProId.toLowerCase()))
              ))
            ).slice(0, 10).map((pro, idx) => (
              <div
                key={pro.id}
                className="px-3 py-2 hover:bg-blue-100 cursor-pointer flex justify-between items-center"
                onClick={() => setBoostProId(pro.id)}
                tabIndex={0}
                role="option"
                aria-selected={boostProId === pro.id}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setBoostProId(pro.id); }}
              >
                <span className="font-medium text-gray-700">{pro.name || pro.email || pro.id}</span>
                <span className="text-xs text-gray-500">{pro.email}</span>
              </div>
            ))}
          </div>
        )}
        {boostProConfig && (
          <div className="flex items-center space-x-4 mb-2">
            <label>Coût:</label>
            <input type="number" min="1" value={boostProConfig.cost || ''}
              onChange={e => setBoostProConfig({ ...boostProConfig, cost: e.target.value })}
              className="border rounded px-2 py-1 w-24" />
            <label>Activé:</label>
            <input type="checkbox" checked={boostProConfig.enabled}
              onChange={e => setBoostProConfig({ ...boostProConfig, enabled: e.target.checked })}
              className="ml-2" />
            <button onClick={updateBoostProConfig} disabled={boostLoading}
              className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Enregistrer
            </button>
          </div>
        )}
      </div>
      {boostMsg && <div className="text-sm text-blue-700 mt-2">{boostMsg}</div>}
    </div>
  );
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'admins') {
      fetchAdmins();
      fetchInvitations();
    } else if (activeTab === 'reports') {
      fetchReports();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/admin/stats`, axiosConfig);
      setStats(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/admin/users`, axiosConfig);
      setUsers(response.data.users);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${API}/admin/list`, axiosConfig);
      setAdmins(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des admins');
    }
  };

  const fetchInvitations = async () => {
    try {
      const response = await axios.get(`${API}/admin/invitations`, axiosConfig);
      setInvitations(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des invitations');
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/admin/reports`, axiosConfig);
      setReports(response.data.reports);
    } catch (err) {
      setError('Erreur lors du chargement des signalements');
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      await axios.put(`${API}/admin/users/${userId}`, {
        status: newStatus
      }, axiosConfig);
      fetchUsers();
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await axios.delete(`${API}/admin/users/${userId}`, axiosConfig);
        fetchUsers();
      } catch (err) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const handleResolveReport = async (reportId) => {
    try {
      await axios.put(`${API}/admin/reports/${reportId}/resolve`, {}, axiosConfig);
      fetchReports();
    } catch (err) {
      setError('Erreur lors de la résolution du signalement');
    }
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700">Utilisateurs Total</h3>
        <p className="text-3xl font-bold text-blue-600">{stats.total_users || 0}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700">Professionnels</h3>
        <p className="text-3xl font-bold text-green-600">{stats.total_professionals || 0}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700">Admins</h3>
        <p className="text-3xl font-bold text-purple-600">{stats.total_admins || 0}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700">Signalements en attente</h3>
        <p className="text-3xl font-bold text-red-600">{stats.pending_reports || 0}</p>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Gestion des utilisateurs</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Nom</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Statut</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.is_professional ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.is_professional ? 'Professionnel' : 'Utilisateur'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={user.status}
                      onChange={(e) => handleUserStatusChange(user.id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="active">Actif</option>
                      <option value="suspended">Suspendu</option>
                      <option value="banned">Banni</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAdmins = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Administrateurs</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Nom</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Rôle</th>
                  <th className="px-4 py-2 text-left">Dernière connexion</th>
                  <th className="px-4 py-2 text-left">Statut</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(adminUser => (
                  <tr key={adminUser.id} className="border-b">
                    <td className="px-4 py-2">{adminUser.name}</td>
                    <td className="px-4 py-2">{adminUser.email}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        adminUser.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                        adminUser.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {adminUser.role === 'super_admin' ? 'Super Admin' :
                         adminUser.role === 'admin' ? 'Admin' : 'Modérateur'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {adminUser.last_login ? new Date(adminUser.last_login).toLocaleDateString() : 'Jamais'}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        adminUser.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {adminUser.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Invitations</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Rôle</th>
                  <th className="px-4 py-2 text-left">Statut</th>
                  <th className="px-4 py-2 text-left">Date d'envoi</th>
                  <th className="px-4 py-2 text-left">Expiration</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map(invitation => (
                  <tr key={invitation.id} className="border-b">
                    <td className="px-4 py-2">{invitation.email}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        invitation.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                        invitation.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {invitation.role === 'super_admin' ? 'Super Admin' :
                         invitation.role === 'admin' ? 'Admin' : 'Modérateur'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        invitation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        invitation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {invitation.status === 'pending' ? 'En attente' :
                         invitation.status === 'accepted' ? 'Acceptée' : 'Expirée'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {new Date(invitation.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(invitation.expires_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Signalements</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Raison</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Statut</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id} className="border-b">
                  <td className="px-4 py-2">{report.reason}</td>
                  <td className="px-4 py-2">{report.description}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {report.status === 'pending' ? 'En attente' : 'Résolu'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(report.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {report.status === 'pending' && (
                      <button
                        onClick={() => handleResolveReport(report.id)}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Résoudre
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Connecté en tant que {admin.name} ({admin.role})
              </span>
              <button
                onClick={onLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <nav className="mb-6">
          <div className="border-b border-gray-200">
            <div className="-mb-px flex space-x-8">
              <button
                onClick={() => { setActiveTab('boost'); fetchBoostConfig(); }}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'boost'
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Boost
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Utilisateurs
              </button>
              <button
                onClick={() => setActiveTab('admins')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'admins'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Admins
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reports'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Signalements
              </button>
            </div>
          </div>
        </nav>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'admins' && renderAdmins()}
            {activeTab === 'reports' && renderReports()}
            {activeTab === 'boost' && renderBoost()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;