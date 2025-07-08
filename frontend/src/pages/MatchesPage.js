import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const MatchesPage = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [message, setMessage] = useState('');

  const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axios.get(`${API_URL}/matches`);
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedMatch) return;

    try {
      // Message API will be implemented later
      console.log('Sending message:', message, 'to match:', selectedMatch.id);
      setMessage('');
      // Show success message
    } catch (error) {
      console.error('Error sending message:', error);
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
          <h1 className="text-3xl font-bold text-white mb-2">Mes Matches</h1>
          <p className="text-gray-300">
            Gérez vos connexions avec les {user?.user_type === 'particulier' ? 'artisans' : 'clients'}
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💼</div>
            <h2 className="text-2xl font-bold text-white mb-2">Aucun match pour le moment</h2>
            <p className="text-gray-300 mb-4">
              {user?.user_type === 'particulier' 
                ? 'Commencez à swiper pour rencontrer des artisans !' 
                : 'Attendez que des clients vous contactent !'}
            </p>
            {user?.user_type === 'particulier' && (
              <button
                onClick={() => window.location.href = '/swipe'}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all"
              >
                Commencer à swiper
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-slate-800/50 rounded-lg p-6 hover:bg-slate-800/70 transition-all cursor-pointer"
                onClick={() => setSelectedMatch(match)}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">👤</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      {user?.user_type === 'particulier' ? 'Artisan' : 'Client'}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Match créé le {new Date(match.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 text-sm">Actif</span>
                    </div>
                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                      Voir détails →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Match Detail Modal */}
        {selectedMatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Détails du Match</h3>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">👤</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">
                      {user?.user_type === 'particulier' ? 'Artisan' : 'Client'}
                    </h4>
                    <p className="text-gray-400">
                      Match créé le {new Date(selectedMatch.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h5 className="text-white font-semibold mb-2">Informations du match</h5>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-300">
                      <span className="text-gray-400">ID:</span> {selectedMatch.id}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-400">Status:</span> 
                      <span className="text-green-400 ml-1">
                        {selectedMatch.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </p>
                    {selectedMatch.last_message_at && (
                      <p className="text-gray-300">
                        <span className="text-gray-400">Dernier message:</span> 
                        {new Date(selectedMatch.last_message_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Message Section */}
              <div className="border-t border-gray-700 pt-4">
                <h5 className="text-white font-semibold mb-4">Envoyer un message</h5>
                <div className="space-y-3">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Envoyer
                    </button>
                    <button
                      onClick={() => setSelectedMatch(null)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesPage;