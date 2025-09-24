import React, { useState, useEffect } from 'react';
import { useToast } from './ToastProvider';

const SwipeInterface = ({ userType, onMatch }) => {
  const { showToast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState('');

  // Données de profils simulées
  const mockProfiles = [
    {
      id: 1,
      name: "Thomas Martin",
      profession: "Électricien",
      location: "Paris",
      rating: 4.8,
      experience: "5 ans",
      price: "À partir de 45€/h",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
      description: "Spécialisé en installation électrique domestique et dépannage d'urgence.",
      verified: true
    },
    {
      id: 2,
      name: "Sophie Dubois",
      profession: "Plombière",
      location: "Lyon",
      rating: 4.9,
      experience: "8 ans",
      price: "À partir de 50€/h",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b830?w=400&h=500&fit=crop&crop=face",
      description: "Experte en plomberie moderne et énergies renouvelables.",
      verified: true
    },
    {
      id: 3,
      name: "Marc Durand",
      profession: "Menuisier",
      location: "Marseille",
      rating: 4.7,
      experience: "12 ans",
      price: "À partir de 40€/h",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
      description: "Création sur mesure et restauration de meubles anciens.",
      verified: true
    },
    {
      id: 4,
      name: "Julie Moreau",
      profession: "Peintre",
      location: "Toulouse",
      rating: 4.6,
      experience: "6 ans",
      price: "À partir de 35€/h",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face",
      description: "Peinture décorative et travaux de rénovation intérieure.",
      verified: true
    }
  ];

  useEffect(() => {
    setProfiles(mockProfiles);
  }, []);

  const handleSwipe = (direction) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSwipeDirection(direction);
    
    setTimeout(() => {
      if (direction === 'right') {
        // C'est un match !
        onMatch(profiles[currentIndex]);
      }
      
      setCurrentIndex(prevIndex => (prevIndex + 1) % profiles.length);
      setIsAnimating(false);
      setSwipeDirection('');
    }, 300);
  };

  const currentProfile = profiles[currentIndex];

  if (!currentProfile) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-gray-800">Plus de profils disponibles !</h3>
          <p className="text-gray-600 mt-2">Revenez plus tard pour découvrir de nouveaux professionnels.</p>
        </div>
      </div>
    );
  }

  // Gestion du boost (pour les pros)
  const [boostLoading, setBoostLoading] = useState(false);
  const [boostMessage, setBoostMessage] = useState("");
  const [creditsLeft, setCreditsLeft] = useState(null); // Ajout état crédits
  const [showBuyCredits, setShowBuyCredits] = useState(false); // UI achat
  const [creditConfig, setCreditConfig] = useState({ unit_price: 100, label: "Acheter des crédits (1€ / crédit)" });

  useEffect(() => {
    // Charger la config crédit depuis le backend
    fetch("/admin/credit-config", { credentials: "include" })
      .then(res => res.json())
      .then(conf => {
        if (conf.unit_price && conf.label) setCreditConfig(conf);
      });
  }, []);

  const handleBoost = async () => {
    setBoostLoading(true);
    setBoostMessage("");
    try {
      const res = await fetch("/swipe/boost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ target_user_id: currentProfile.id })
      });
      const data = await res.json();
      if (res.ok) {
        setBoostMessage("Boost envoyé ! (crédits restants : " + data.credits_left + ")");
        setCreditsLeft(data.credits_left);
        if (data.credits_left === 0) setShowBuyCredits(true);
      } else {
        setBoostMessage(data.detail || data.message || "Erreur lors du boost");
      }
      showToast("Boost envoyé avec succès !", "success");
    } catch (e) {
      setBoostMessage("Erreur réseau ou serveur");
      showToast("Erreur réseau lors du boost", "error");
    }
    setBoostLoading(false);
  };

  const handleBuyCredits = async () => {
    try {
      const res = await fetch("/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 10 }) // Par défaut 10 crédits, à adapter
      });
      const data = await res.json();
      if (res.ok && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        showToast(data.detail || data.message || "Erreur lors de l'achat de crédits", "error");
      }
    } catch (e) {
      showToast("Erreur réseau lors de l'achat de crédits", "error");
    }
  };

  return (
  <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto relative px-2 sm:px-4">
      {/* Stack de cartes */}
  <div className="relative h-[70vw] max-h-[600px] min-h-[350px] sm:h-[500px] md:h-[600px]">
        {/* Carte suivante (en arrière-plan) */}
        {profiles[currentIndex + 1] && (
          <div className="absolute inset-0 bg-white rounded-2xl shadow-lg transform scale-95 opacity-60">
            <div className="h-40 sm:h-56 md:h-80 bg-gray-200 rounded-t-2xl"></div>
          </div>
        )}

        {/* Carte actuelle */}
        <div 
          className={`absolute inset-0 bg-white rounded-2xl shadow-xl transform transition-all duration-300 ${
            isAnimating 
              ? swipeDirection === 'left' 
                ? '-translate-x-full rotate-12 opacity-0' 
                : swipeDirection === 'right'
                ? 'translate-x-full -rotate-12 opacity-0'
                : ''
              : 'translate-x-0 rotate-0 opacity-100'
          }`}
        >
          {/* Image de profil */}
          <div className="relative h-40 sm:h-56 md:h-80 overflow-hidden rounded-t-2xl">
             <img 
               src={currentProfile.image} 
        alt={currentProfile.name ? `Portrait de ${currentProfile.name}, ${currentProfile.profession}, ${currentProfile.location}` : "Portrait professionnel"}
               className="w-full h-full object-cover object-top"
               tabIndex={0}
               style={{ maxHeight: '100%', maxWidth: '100%' }}
             />
            
            {/* Badge vérifié */}
            {currentProfile.verified && (
              <div className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded-full text-xs flex items-center border-2 border-white shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300" tabIndex={0} aria-label="Profil vérifié">
                <span className="mr-1">✓</span>
                Vérifié
              </div>
            )}

            {/* Overlay dégradé */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            {/* Nom et profession en overlay */}
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-bold">{currentProfile.name}</h3>
              <p className="text-sm opacity-90">{currentProfile.profession}</p>
            </div>
          </div>

          {/* Informations détaillées */}
          <div className="p-3 sm:p-6 space-y-2 sm:space-y-4 text-base sm:text-lg">
            {/* Rating et localisation */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400 text-lg">⭐</span>
                <span className="font-semibold">{currentProfile.rating}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-1">📍</span>
                <span className="text-sm">{currentProfile.location}</span>
              </div>
            </div>

            {/* Expérience et prix */}
            <div className="flex justify-between text-sm">
              <div>
                <span className="text-gray-500">Expérience:</span>
                <span className="ml-2 font-medium">{currentProfile.experience}</span>
              </div>
              <div className="text-green-600 font-semibold">
                {currentProfile.price}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm leading-relaxed">
              {currentProfile.description}
            </p>
          </div>
        </div>
      </div>


      {/* Boutons d'action */}
  <div className="flex justify-center space-x-3 sm:space-x-6 mt-4 sm:mt-6">
         <button
           onClick={() => handleSwipe('left')}
           disabled={isAnimating}
           aria-label="Refuser le profil"
           tabIndex={0}
           className="w-16 h-16 sm:w-14 sm:h-14 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-800 disabled:opacity-50 transition-colors shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 text-3xl sm:text-2xl"
         >
           <span aria-hidden="true">✕</span>
         </button>

         <button
           onClick={() => handleSwipe('right')}
           disabled={isAnimating}
           aria-label="Accepter le profil"
           tabIndex={0}
           className="w-16 h-16 sm:w-14 sm:h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white disabled:opacity-50 transition-colors shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 text-3xl sm:text-2xl"
         >
           <span aria-hidden="true">♥</span>
         </button>

         {/* Bouton Boost visible uniquement pour les pros */}
         {userType === 'professional' && (
           <>
          <button
             onClick={handleBoost}
             disabled={boostLoading || isAnimating || creditsLeft === 0}
             aria-label="Utiliser un boost (crédits)"
             tabIndex={0}
             className="w-16 h-16 sm:w-14 sm:h-14 bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 transition-colors shadow-lg border-2 border-yellow-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 text-3xl sm:text-2xl"
             title="Utiliser un boost (crédits)"
           >
             <span aria-hidden="true">⚡</span>
           </button>
          {showBuyCredits && (
            <button
              onClick={handleBuyCredits}
              className="ml-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300 text-base font-semibold"
              disabled={boostLoading}
            >
              {creditConfig.label} ({creditConfig.unit_price / 100}€ / crédit)
            </button>
          )}
          </>
         )}
      </div>

      {/* Message feedback boost */}
      {userType === 'professional' && boostMessage && (
        <div className="text-center mt-2 text-sm text-yellow-700 font-semibold" aria-live="polite">{boostMessage}</div>
      )}

      {/* Bouton achat crédits */}
      {userType === 'professional' && showBuyCredits && (
        <div className="text-center mt-4">
          <button
            onClick={handleBuyCredits}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300"
          >
            Acheter des crédits
          </button>
        </div>
      )}

  {/* Indicateur de profils restants */}
      <div className="text-center mt-4">
        <div className="flex justify-center space-x-1">
          {profiles.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {currentIndex + 1} sur {profiles.length}
        </p>
      </div>
    </div>
  );
};

export default SwipeInterface;