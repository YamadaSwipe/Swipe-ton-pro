import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const SwipePage = () => {
  const { user } = useAuth();
  const [artisans, setArtisans] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [matchModal, setMatchModal] = useState(false);
  const [matchedArtisan, setMatchedArtisan] = useState(null);

  const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

  useEffect(() => {
    fetchArtisans();
  }, []);

  const fetchArtisans = async () => {
    try {
      const response = await axios.get(`${API_URL}/artisan/profiles`);
      setArtisans(response.data);
    } catch (error) {
      console.error('Error fetching artisans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (action) => {
    if (currentIndex >= artisans.length) return;

    const currentArtisan = artisans[currentIndex];
    setSwipeDirection(action);

    try {
      const response = await axios.post(`${API_URL}/swipe`, {
        target_id: currentArtisan.id,
        action: action
      });

      if (response.data.match_id) {
        setMatchedArtisan(currentArtisan);
        setMatchModal(true);
      }
    } catch (error) {
      console.error('Error swiping:', error);
    }

    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setSwipeDirection(null);
    }, 300);
  };

  const getProfessionIcon = (profession) => {
    const icons = {
      'electricien': '⚡',
      'plombier': '🔧',
      'menuisier': '🪚',
      'peintre': '🎨',
      'macon': '🧱',
      'chauffagiste': '🔥',
      'carreleur': '🏗️'
    };
    return icons[profession] || '🔨';
  };

  const getProfessionColor = (profession) => {
    const colors = {
      'electricien': 'from-yellow-500 to-orange-600',
      'plombier': 'from-blue-500 to-cyan-600',
      'menuisier': 'from-amber-500 to-yellow-600',
      'peintre': 'from-purple-500 to-pink-600',
      'macon': 'from-gray-500 to-slate-600',
      'chauffagiste': 'from-red-500 to-orange-600',
      'carreleur': 'from-green-500 to-emerald-600'
    };
    return colors[profession] || 'from-gray-500 to-gray-600';
  };

  if (user?.user_type !== 'particulier') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-white mb-2">Accès restreint</h2>
          <p className="text-gray-300">Seuls les particuliers peuvent utiliser la fonction swipe.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
          <p className="text-white">Chargement des profils...</p>
        </div>
      </div>
    );
  }

  if (currentIndex >= artisans.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">Plus de profils pour le moment !</h2>
          <p className="text-gray-300 mb-4">Vous avez vu tous les artisans disponibles.</p>
          <button
            onClick={() => {
              setCurrentIndex(0);
              fetchArtisans();
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Recommencer
          </button>
        </div>
      </div>
    );
  }

  const currentArtisan = artisans[currentIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Trouvez votre artisan</h1>
        <p className="text-gray-300">Swipez vers la droite pour liker, vers la gauche pour passer</p>
      </div>

      <div className="relative">
        {/* Card */}
        <div className={`
          w-96 h-[600px] bg-gradient-to-br ${getProfessionColor(currentArtisan.profession)} 
          rounded-3xl shadow-2xl transform transition-all duration-300 
          ${swipeDirection === 'like' ? 'rotate-12 translate-x-32' : ''}
          ${swipeDirection === 'pass' ? '-rotate-12 -translate-x-32' : ''}
          ${swipeDirection ? 'opacity-0' : 'opacity-100'}
        `}>
          {/* Profession Icon */}
          <div className="absolute top-8 left-8 text-6xl">
            {getProfessionIcon(currentArtisan.profession)}
          </div>

          {/* Content */}
          <div className="p-8 pt-24 h-full flex flex-col justify-between text-white">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {currentArtisan.user_id} {/* Will be replaced with actual user name */}
              </h2>
              <p className="text-lg opacity-90 mb-4 uppercase tracking-wide">
                {currentArtisan.profession}
              </p>
              
              <div className="flex items-center mb-4">
                <div className="text-yellow-300 text-xl">
                  {'⭐'.repeat(Math.floor(currentArtisan.rating || 4.5))}
                </div>
                <span className="ml-2 text-lg">{currentArtisan.rating || 4.5}</span>
                <span className="ml-2 text-sm opacity-75">({currentArtisan.reviews_count || 0} avis)</span>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm">
                  <span className="opacity-75">📍</span>
                  <span className="ml-2">{currentArtisan.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="opacity-75">💼</span>
                  <span className="ml-2">{currentArtisan.experience_years} ans d'expérience</span>
                </div>
                {currentArtisan.hourly_rate && (
                  <div className="flex items-center text-sm">
                    <span className="opacity-75">💰</span>
                    <span className="ml-2">{currentArtisan.hourly_rate}€/h</span>
                  </div>
                )}
              </div>

              <div className="bg-white/20 rounded-lg p-4 mb-4">
                <p className="text-sm leading-relaxed">
                  {currentArtisan.description}
                </p>
              </div>

              {currentArtisan.certifications?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentArtisan.certifications.map((cert, index) => (
                    <span key={index} className="bg-white/20 text-xs px-2 py-1 rounded-full">
                      ✓ {cert}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Availability indicator */}
            <div className="text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                currentArtisan.availability 
                  ? 'bg-green-500/20 text-green-100' 
                  : 'bg-red-500/20 text-red-100'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  currentArtisan.availability ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                {currentArtisan.availability ? 'Disponible' : 'Indisponible'}
              </div>
            </div>
          </div>
        </div>

        {/* Swipe indicators */}
        <div className={`absolute top-20 left-8 transform -rotate-12 ${
          swipeDirection === 'pass' ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}>
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-xl">
            PASS
          </div>
        </div>
        
        <div className={`absolute top-20 right-8 transform rotate-12 ${
          swipeDirection === 'like' ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}>
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-xl">
            LIKE
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex space-x-8 mt-8">
        <button
          onClick={() => handleSwipe('pass')}
          className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full transition-colors text-2xl"
        >
          ❌
        </button>
        <button
          onClick={() => handleSwipe('like')}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full transition-colors text-2xl"
        >
          💚
        </button>
      </div>

      {/* Progress indicator */}
      <div className="mt-8 text-center">
        <p className="text-gray-300 text-sm">
          {currentIndex + 1} / {artisans.length} profils
        </p>
        <div className="w-64 bg-gray-700 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / artisans.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Match Modal */}
      {matchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">C'est un match !</h3>
            <p className="text-gray-600 mb-4">
              Vous avez matché avec {matchedArtisan?.user_id} !
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setMatchModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Continuer
              </button>
              <button
                onClick={() => {
                  setMatchModal(false);
                  // Navigate to matches page
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Voir les matches
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipePage;