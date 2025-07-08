import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const HomePage = () => {
  const { user } = useAuth();
  const [subscriptionPacks, setSubscriptionPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

  useEffect(() => {
    fetchSubscriptionPacks();
  }, []);

  const fetchSubscriptionPacks = async () => {
    try {
      const response = await axios.get(`${API_URL}/subscription/packs`);
      setSubscriptionPacks(response.data);
    } catch (error) {
      console.error('Error fetching subscription packs:', error);
    } finally {
      setLoading(false);
    }
  };

  const professions = [
    { name: 'Électricien', count: '250+', icon: '⚡' },
    { name: 'Plombier', count: '180+', icon: '🔧' },
    { name: 'Menuisier', count: '120+', icon: '🪚' },
    { name: 'Peintre', count: '300+', icon: '🎨' },
    { name: 'Maçon', count: '200+', icon: '🧱' },
    { name: 'Chauffagiste', count: '150+', icon: '🔥' },
    { name: 'Carreleur', count: '90+', icon: '🏗️' },
    { name: 'Et plus...', count: '500+', icon: '✨' }
  ];

  const testimonials = [
    {
      quote: "J'ai trouvé mon électricien en 5 minutes ! Le service est incroyable.",
      author: "Marie-Claire L.",
      role: "Propriétaire d'une maison"
    },
    {
      quote: "Grâce à Swipe Ton Pro, j'ai doublé mon chiffre d'affaires en 6 mois.",
      author: "Jean-Pierre M.",
      role: "Plombier indépendant"
    },
    {
      quote: "La plateforme parfaite pour trouver des artisans qualifiés rapidement.",
      author: "Sophie R.",
      role: "Architecte d'intérieur"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-6xl font-bold text-white mb-6">
          Ton prochain <span className="text-green-400">CRUSH</span>
          <br />
          professionnel en un <span className="text-yellow-400">SWIPE</span>
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Que tu sois un porteur de projet cherchant le talent idéal ou un professionnel en quête 
          de nouvelles opportunités, notre plateforme te connecte instantanément.
        </p>
        
        {!user && (
          <div className="flex justify-center space-x-6">
            <Link 
              to="/register?type=particulier"
              className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Créer mon compte particulier
            </Link>
            <Link 
              to="/register?type=artisan"
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Devenir professionnel
            </Link>
          </div>
        )}

        {user && user.user_type === 'particulier' && (
          <div className="mt-8">
            <Link 
              to="/swipe"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-6 rounded-lg text-2xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Commencer à swiper ! 🔥
            </Link>
          </div>
        )}
      </section>

      {/* Featured Professionals Preview */}
      <section className="py-16">
        <div className="flex justify-center space-x-8">
          {/* Électricien Card */}
          <div className="bg-gradient-to-br from-orange-500 to-yellow-600 rounded-3xl p-8 w-80 text-center transform hover:scale-105 transition-all">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-white font-bold text-2xl mb-2">Électricien Pro</h3>
            <p className="text-orange-100 mb-4">ÉLECTRICIEN</p>
            <div className="flex justify-center items-center mb-4">
              <div className="text-yellow-300">⭐⭐⭐⭐⭐</div>
              <span className="text-white ml-2">4.8</span>
            </div>
            <div className="text-green-300 text-sm">
              📍 PARIS ✓ Tarifs vérifiés
            </div>
          </div>

          {/* Project Card */}
          <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl p-8 w-80 text-center transform hover:scale-105 transition-all">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-white font-bold text-2xl mb-2">Votre projet</h3>
            <p className="text-green-100 mb-4">Décrivez vos besoins</p>
            <div className="mb-4">
              <p className="text-yellow-300 text-sm">✓ Votre ville</p>
              <p className="text-yellow-300 text-lg font-bold">💰 Votre budget</p>
              <p className="text-yellow-300 text-sm">& votre besoin</p>
            </div>
          </div>

          {/* Plombier Card */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 w-80 text-center transform hover:scale-105 transition-all">
            <div className="text-6xl mb-4">🔧</div>
            <h3 className="text-white font-bold text-2xl mb-2">Plombier Expert</h3>
            <p className="text-blue-100 mb-4">PLOMBIER</p>
            <div className="flex justify-center items-center mb-4">
              <div className="text-yellow-300">⭐⭐⭐⭐⭐</div>
              <span className="text-white ml-2">5.0</span>
            </div>
            <div className="text-green-300 text-sm">
              📍 LYON ✓ Tarifs vérifiés
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Packs for Professionals */}
      {!loading && subscriptionPacks.length > 0 && (
        <section className="py-16 bg-slate-800/30 rounded-3xl mx-8 mb-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-white text-center mb-4">Packs Professionnels</h2>
            <p className="text-gray-300 text-center mb-12">
              Choisissez le pack qui correspond à vos besoins pour maximiser vos opportunités
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subscriptionPacks.map((pack, index) => (
                <div
                  key={index}
                  className={`relative bg-slate-700/50 rounded-xl p-6 border-2 transition-all hover:scale-105 ${
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
                    
                    <Link
                      to="/register?type=artisan"
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all block text-center ${
                        pack.popular
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Commencer
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <p className="text-gray-400 text-sm">
                * Particuliers : utilisation 100% gratuite • Artisans : payez uniquement pour matcher
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="text-center py-12">
        <p className="text-gray-300 text-lg mb-8">
          Professionnels qualifiés et projets passionnants t'attendent
        </p>
      </section>

      {/* How it works */}
      <section className="py-16 bg-slate-800/30 rounded-3xl mx-8 mb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Comment ça marche</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl mb-4">1️⃣</div>
              <h3 className="text-2xl font-bold text-white mb-4">Créez votre profil</h3>
              <p className="text-gray-300">
                Particuliers : créez votre compte gratuitement et décrivez vos projets.
                Artisans : choisissez votre pack et complétez votre profil professionnel.
              </p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">2️⃣</div>
              <h3 className="text-2xl font-bold text-white mb-4">Swipez et matchez</h3>
              <p className="text-gray-300">
                Découvrez les profils correspondants et swipez pour montrer votre intérêt. 
                Chaque like d'artisan utilise un crédit.
              </p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">3️⃣</div>
              <h3 className="text-2xl font-bold text-white mb-4">Collaborez</h3>
              <p className="text-gray-300">
                En cas de match mutuel, échangez directement et concrétisez vos projets 
                en toute confiance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Nos professionnels</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {professions.map((profession, index) => (
              <div key={index} className="bg-slate-800/50 rounded-lg p-6 text-center hover:bg-slate-800/70 transition-all">
                <div className="text-3xl mb-2">{profession.icon}</div>
                <h3 className="text-white font-bold text-lg mb-1">{profession.name}</h3>
                <p className="text-blue-400 font-semibold">{profession.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-slate-800/30 rounded-3xl mx-8">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Ce qu'ils disent</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-6">
                <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                <div className="text-white font-bold">{testimonial.author}</div>
                <div className="text-blue-400 text-sm">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;