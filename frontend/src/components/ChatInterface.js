import React, { useState, useEffect } from 'react';

const ChatInterface = ({ matches, onBack }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Messages simulés
  const mockMessages = {
    1: [
      { id: 1, text: "Salut ! Je suis ravi de cette mise en relation 👋", sender: 'other', timestamp: '14:30' },
      { id: 2, text: "Moi aussi ! J'ai vu que vous cherchiez un électricien ?", sender: 'me', timestamp: '14:32' },
      { id: 3, text: "Exactement ! J'ai besoin de refaire l'installation électrique de mon salon.", sender: 'other', timestamp: '14:33' },
      { id: 4, text: "Parfait ! Je peux passer faire un devis cette semaine. Quel jour vous conviendrait ?", sender: 'me', timestamp: '14:35' }
    ]
  };

  useEffect(() => {
    if (selectedMatch) {
      setMessages(mockMessages[selectedMatch.id] || []);
    }
  }, [selectedMatch]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  if (selectedMatch) {
    return (
      <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 flex items-center">
          <button
            onClick={() => setSelectedMatch(null)}
            className="mr-3 text-white hover:bg-blue-600 rounded-full p-1"
          >
            ←
          </button>
          <img
            src={selectedMatch.image}
            alt={selectedMatch.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h3 className="font-semibold">{selectedMatch.name}</h3>
            <p className="text-sm opacity-90">{selectedMatch.profession}</p>
          </div>
          <div className="ml-auto flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            <span className="text-sm">En ligne</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'me'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Tapez votre message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white rounded-full px-6 py-2 hover:bg-blue-600 transition-colors"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Mes Conversations</h2>
        <button
          onClick={onBack}
          className="text-white hover:bg-blue-600 rounded-full px-3 py-1"
        >
          Retour
        </button>
      </div>

      {/* Liste des matches */}
      <div className="divide-y">
        {matches.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Aucune conversation
            </h3>
            <p className="text-gray-500">
              Vos matches avec messagerie débloquée apparaîtront ici.
            </p>
          </div>
        ) : (
          matches.map((match) => (
            <div
              key={match.id}
              onClick={() => setSelectedMatch(match)}
              className="p-4 hover:bg-gray-50 cursor-pointer flex items-center"
            >
              <img
                src={match.image}
                alt={match.name}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800">{match.name}</h3>
                  <span className="text-xs text-gray-500">14:35</span>
                </div>
                <p className="text-sm text-gray-600">{match.profession}</p>
                <p className="text-sm text-gray-500 truncate">
                  Parfait ! Je peux passer faire un devis...
                </p>
              </div>
              <div className="flex items-center">
                {match.chatUnlocked ? (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                ) : (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    🔒 Verrouillé
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatInterface;