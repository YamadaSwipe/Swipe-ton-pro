import React, { useState } from 'react';
import SwipeInterface from './SwipeInterface';
import MatchModal from './MatchModal';
import ChatInterface from './ChatInterface';

const SwipeTonPro = () => {
  const [currentView, setCurrentView] = useState('home'); // home, swipe, chat, profile
  const [userType, setUserType] = useState('client'); // client, professional
  const [matches, setMatches] = useState([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);

  const handleMatch = (profile) => {
    setCurrentMatch(profile);
    setShowMatchModal(true);
    
    // Ajouter à la liste des matches
    setMatches(prev => [...prev, { 
      ...profile, 
      chatUnlocked: userType === 'professional' // Pro a accès direct, client doit payer
    }]);
  };

  const handleCloseMatch = () => {
    setShowMatchModal(false);
    setCurrentMatch(null);
  };

  if (currentView === 'chat') {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <ChatInterface 
            matches={matches.filter(m => m.chatUnlocked)} 
            onBack={() => setCurrentView('home')}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'swipe') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
        <div className="max-w-md mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => setCurrentView('home')}
              className="absolute left-4 top-8 text-gray-600 hover:text-gray-800"
            >
              ← Retour
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Découvrir les {userType === 'client' ? 'Professionnels' : 'Projets'}
            </h1>
            <p className="text-gray-600 mt-1">
              Swipez pour trouver votre match parfait !
            </p>
          </div>

          <SwipeInterface 
            userType={userType}
            onMatch={handleMatch}
          />

          <MatchModal
            isOpen={showMatchModal}
            onClose={handleCloseMatch}
            matchedProfile={currentMatch}
            userType={userType}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Swipe Ton Pro
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="client">Je cherche un pro</option>
                <option value="professional">Je suis un pro</option>
              </select>
              <a
                href="/admin"
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                🔐 Admin
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Votre prochain match professionnel est un{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              swipe
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Que vous soyez un porteur de projet cherchant le talent idéal ou un professionnel 
            en quête de nouvelles opportunités, notre plateforme vous connecte instantanément.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => {
                setUserType('client');
                setCurrentView('swipe');
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Commencer gratuitement
            </button>
            <button
              onClick={() => {
                setUserType('professional');
                setCurrentView('swipe');
              }}
              className="border-2 border-blue-500 text-blue-500 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105"
            >
              Je suis un professionnel
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Matching intelligent</h3>
            <p className="text-gray-600">
              Notre algorithme analyse vos besoins et compétences pour des matches parfaits.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Chat sécurisé</h3>
            <p className="text-gray-600">
              Échangez directement avec vos matches dans un environnement sécurisé.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">Profils vérifiés</h3>
            <p className="text-gray-600">
              Tous nos professionnels sont vérifiés pour votre sécurité et confiance.
            </p>
          </div>
        </div>

        {/* Demo Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Découvrez notre communauté
            </h2>
            <p className="text-gray-600">
              Des milliers de professionnels qualifiés vous attendent
            </p>
          </div>

          {/* Preview Card */}
          <div className="max-w-sm mx-auto">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-64">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face"
                    alt="Thomas"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                    ✓ Vérifié
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">Thomas</h3>
                    <p className="text-sm">Électricien</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="text-yellow-400">⭐</span>
                      <span className="ml-1 font-semibold">5.0</span>
                    </div>
                    <span className="text-green-600 font-semibold">45€/h</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Spécialisé en installation électrique et dépannage d'urgence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">500+</div>
            <div className="text-gray-600">Professionnels</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">1000+</div>
            <div className="text-gray-600">Matches réussis</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">4.9/5</div>
            <div className="text-gray-600">Satisfaction</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pink-600">24h</div>
            <div className="text-gray-600">Temps de réponse</div>
          </div>
        </div>

        {/* Action Buttons */}
        {matches.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setCurrentView('chat')}
              className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors inline-flex items-center"
            >
              💬 Voir mes conversations ({matches.filter(m => m.chatUnlocked).length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipeTonPro;