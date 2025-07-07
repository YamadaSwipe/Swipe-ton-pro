import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SwipePage = () => {
  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${API}/swipes/candidates`);
      setCandidates(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setLoading(false);
    }
  };

  const handleSwipe = async (action) => {
    if (swiping || currentIndex >= candidates.length) return;

    setSwiping(true);
    const candidate = candidates[currentIndex];

    try {
      await axios.post(`${API}/swipes`, {
        target_user_id: candidate.id,
        action: action
      });

      // Move to next candidate
      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error('Error swiping:', error);
    } finally {
      setSwiping(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (candidates.length === 0 || currentIndex >= candidates.length) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Plus de profils disponibles</h2>
          <p className="text-gray-300 mb-6">Revenez plus tard pour découvrir de nouveaux profils !</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const currentCandidate = candidates[currentIndex];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Découvrir</h1>
          <p className="text-gray-300">
            {currentIndex + 1} / {candidates.length}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {currentCandidate.first_name[0]}{currentCandidate.last_name[0]}
                </span>
              </div>
              <h2 className="text-2xl font-bold">
                {currentCandidate.first_name} {currentCandidate.last_name}
              </h2>
              <p className="text-gray-300 capitalize">{currentCandidate.user_type}</p>
              {currentCandidate.company_name && (
                <p className="text-gray-400">{currentCandidate.company_name}</p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Description</h3>
                <p className="text-gray-300">{currentCandidate.description || 'Aucune description disponible'}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">Statut</h3>
                <p className="text-gray-300 capitalize">
                  {currentCandidate.company_status?.replace('_', ' ') || 'Non spécifié'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">Téléphone</h3>
                <p className="text-gray-300">{currentCandidate.phone || 'Non spécifié'}</p>
              </div>

              <div className="flex items-center justify-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  currentCandidate.status === 'validated' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-yellow-600 text-white'
                }`}>
                  {currentCandidate.status === 'validated' ? 'Validé' : 'En attente'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex border-t border-gray-700">
            <button
              onClick={() => handleSwipe('dislike')}
              disabled={swiping}
              className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50"
            >
              {swiping ? 'Chargement...' : 'Passer'}
            </button>
            <button
              onClick={() => handleSwipe('like')}
              disabled={swiping}
              className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-50"
            >
              {swiping ? 'Chargement...' : 'Liker'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="text-blue-400 hover:text-blue-300"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwipePage;