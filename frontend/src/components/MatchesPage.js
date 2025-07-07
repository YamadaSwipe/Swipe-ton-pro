import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState('text');
  const [quoteAmount, setQuoteAmount] = useState('');
  const [meetingDate, setMeetingDate] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axios.get(`${API}/matches`);
      setMatches(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async (matchId) => {
    try {
      const response = await axios.get(`${API}/messages/${matchId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const unlockChat = async (matchId) => {
    try {
      await axios.post(`${API}/matches/${matchId}/unlock`);
      // Refresh matches
      await fetchMatches();
    } catch (error) {
      console.error('Error unlocking chat:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedMatch) return;

    try {
      const messageData = {
        match_id: selectedMatch.id,
        content: newMessage,
        message_type: messageType,
        quote_amount: messageType === 'quote_request' ? parseFloat(quoteAmount) : null,
        meeting_date: messageType === 'meeting_request' ? new Date(meetingDate).toISOString() : null
      };

      await axios.post(`${API}/messages`, messageData);
      setNewMessage('');
      setQuoteAmount('');
      setMeetingDate('');
      await fetchMessages(selectedMatch.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const selectMatch = (match) => {
    setSelectedMatch(match);
    if (match.is_chat_unlocked) {
      fetchMessages(match.id);
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
          <h1 className="text-3xl font-bold">Mes Matches</h1>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 text-blue-400 hover:text-blue-300"
          >
            Retour à l'accueil
          </button>
        </div>

        {matches.length === 0 ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Aucun match pour l'instant</h2>
            <p className="text-gray-300 mb-6">Continuez à swiper pour trouver des matches !</p>
            <button
              onClick={() => window.location.href = '/swipe'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Découvrir des profils
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Matches List */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold mb-4">Vos matches ({matches.length})</h2>
              <div className="space-y-3">
                {matches.map((match) => (
                  <div
                    key={match.id}
                    onClick={() => selectMatch(match)}
                    className={`bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors ${
                      selectedMatch?.id === match.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">M</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Match #{match.id.slice(0, 8)}</h3>
                        <p className="text-sm text-gray-400">
                          {new Date(match.created_at).toLocaleDateString()}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            match.is_chat_unlocked 
                              ? 'bg-green-600 text-white' 
                              : 'bg-yellow-600 text-white'
                          }`}>
                            {match.is_chat_unlocked ? 'Débloqué' : 'Verrouillé'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              {selectedMatch ? (
                <div className="bg-gray-800 rounded-lg h-96 flex flex-col">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="font-bold">Match #{selectedMatch.id.slice(0, 8)}</h3>
                    <p className="text-sm text-gray-400">
                      Créé le {new Date(selectedMatch.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {!selectedMatch.is_chat_unlocked ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">🔒</span>
                        </div>
                        <h4 className="text-lg font-bold mb-2">Chat verrouillé</h4>
                        <p className="text-gray-300 mb-4">
                          Débloquez le chat pour commencer la conversation
                        </p>
                        <button
                          onClick={() => unlockChat(selectedMatch.id)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg"
                        >
                          Débloquer pour 60€
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender_id === selectedMatch.user1_id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender_id === selectedMatch.user1_id 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-700 text-white'
                            }`}>
                              <p>{message.content}</p>
                              {message.message_type === 'quote_request' && (
                                <p className="text-sm mt-1 opacity-75">
                                  Demande de devis: {message.quote_amount}€
                                </p>
                              )}
                              {message.message_type === 'meeting_request' && (
                                <p className="text-sm mt-1 opacity-75">
                                  Demande de RDV: {new Date(message.meeting_date).toLocaleDateString()}
                                </p>
                              )}
                              <p className="text-xs opacity-50 mt-1">
                                {new Date(message.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t border-gray-700">
                        <div className="flex items-center space-x-2 mb-3">
                          <select
                            value={messageType}
                            onChange={(e) => setMessageType(e.target.value)}
                            className="px-3 py-1 bg-gray-700 text-white rounded text-sm"
                          >
                            <option value="text">Message</option>
                            <option value="quote_request">Demande de devis</option>
                            <option value="meeting_request">Demande de RDV</option>
                          </select>
                        </div>

                        {messageType === 'quote_request' && (
                          <div className="mb-3">
                            <input
                              type="number"
                              value={quoteAmount}
                              onChange={(e) => setQuoteAmount(e.target.value)}
                              placeholder="Montant du devis (€)"
                              className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                            />
                          </div>
                        )}

                        {messageType === 'meeting_request' && (
                          <div className="mb-3">
                            <input
                              type="datetime-local"
                              value={meetingDate}
                              onChange={(e) => setMeetingDate(e.target.value)}
                              className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                            />
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Tapez votre message..."
                            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded"
                          />
                          <button
                            onClick={sendMessage}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                          >
                            Envoyer
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg h-96 flex items-center justify-center">
                  <p className="text-gray-400">Sélectionnez un match pour commencer la conversation</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesPage;