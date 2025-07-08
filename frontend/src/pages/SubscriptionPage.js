import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SubscriptionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscriptionPacks, setSubscriptionPacks] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

  useEffect(() => {
    if (user?.user_type !== 'artisan') {
      navigate('/');
      return;
    }
    fetchSubscriptionData();
  }, [user, navigate]);

  const fetchSubscriptionData = async () => {
    try {
      const [packsResponse, currentResponse] = await Promise.all([
        axios.get(`${API_URL}/subscription/packs`),
        axios.get(`${API_URL}/subscription/current`)
      ]);
      
      setSubscriptionPacks(packsResponse.data);
      setCurrentSubscription(currentResponse.data);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packType) => {
    setPurchasing(true);
    try {
      await axios.post(`${API_URL}/subscription/purchase`, {
        pack: packType
      });
      
      // Refresh subscription data
      await fetchSubscriptionData();
      
      alert('Abonnement acheté avec succès !');
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      alert('Erreur lors de l\'achat de l\'abonnement');
    } finally {
      setPurchasing(false);
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
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choisissez votre pack</h1>
          <p className="text-gray-300 text-lg">
            Maximisez vos opportunités avec nos packs de crédits de matching
          </p>
        </div>

        {/* Current Subscription Status */}
        {currentSubscription && (
          <div className="bg-slate-800/50 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Votre abonnement actuel</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{currentSubscription.current_credits}</div>
                <div className="text-gray-400">Crédits restants</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-white">
                  {currentSubscription.subscription_pack || 'Aucun pack actif'}
                </div>
                <div className="text-gray-400">Pack actuel</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-white">
                  {currentSubscription.subscription_expires 
                    ? new Date(currentSubscription.subscription_expires).toLocaleDateString()
                    : 'N/A'}
                </div>
                <div className="text-gray-400">Expiration</div>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Packs */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {subscriptionPacks.map((pack, index) => (
            <div
              key={index}
              className={`relative bg-slate-800/50 rounded-xl p-6 border-2 transition-all hover:scale-105 ${
                pack.popular 
                  ? 'border-yellow-400 bg-gradient-to-br from-yellow-500/10 to-orange-600/10' 
                  : 'border-slate-600 hover:border-blue-400'
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                    POPULAIRE
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{pack.name}</h3>
                <div className="text-4xl font-bold text-blue-400 mb-1">{pack.price}€</div>
                <p className="text-gray-400 mb-4">
                  {pack.credits === 999999 ? 'Crédits illimités' : `${pack.credits} crédits`}
                </p>
                
                <ul className="space-y-2 mb-6 text-left">
                  {pack.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-green-400 text-sm">✓</span>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handlePurchase(pack.pack)}
                  disabled={purchasing}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                    pack.popular
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {purchasing ? 'Achat en cours...' : 'Acheter'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* How Credits Work */}
        <div className="mt-16 bg-slate-800/30 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Comment fonctionnent les crédits ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">👀</div>
              <h3 className="text-lg font-bold text-white mb-2">Parcourir gratuitement</h3>
              <p className="text-gray-300">
                Parcourez tous les profils et projets gratuitement. Pas de limite pour explorer.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💚</div>
              <h3 className="text-lg font-bold text-white mb-2">1 crédit = 1 like</h3>
              <p className="text-gray-300">
                Chaque "like" consomme 1 crédit. Swipez vers le bas pour passer sans consommer de crédit.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-bold text-white mb-2">Match = Conversation</h3>
              <p className="text-gray-300">
                Quand un like est réciproque, c'est un match ! Échangez directement sans limite.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Benefits */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Pourquoi choisir SwipeTonPro ?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-2">💰 Tarifs équitables</h4>
              <p className="text-gray-300">
                Payez uniquement pour les connections qui vous intéressent vraiment. 
                Pas d'abonnement mensuel obligatoire.
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-2">🔥 Clients qualifiés</h4>
              <p className="text-gray-300">
                Tous les projets sont vérifiés. Rencontrez des clients sérieux 
                avec des projets concrets et des budgets définis.
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-2">⚡ Matching intelligent</h4>
              <p className="text-gray-300">
                Notre algorithme vous propose les projets les plus pertinents 
                selon vos compétences et votre localisation.
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-2">🛡️ Sécurité garantie</h4>
              <p className="text-gray-300">
                Tous les artisans sont vérifiés (SIRET, assurance, certifications). 
                Travaillez en toute confiance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;