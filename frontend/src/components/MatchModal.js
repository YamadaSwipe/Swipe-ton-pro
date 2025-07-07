import React, { useState, useEffect } from 'react';

const MatchModal = ({ isOpen, onClose, matchedProfile, userType }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [step, setStep] = useState('celebration'); // celebration, payment, chat

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Animation de célébration
      setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
    }
  }, [isOpen]);

  const handleContinue = () => {
    if (userType === 'client') {
      setStep('payment');
    } else {
      setStep('chat');
    }
  };

  const handlePayment = () => {
    // Simulation du paiement
    setStep('chat');
  };

  if (!isOpen || !matchedProfile) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        
        {/* Étape 1: Célébration du Match */}
        {step === 'celebration' && (
          <div className="text-center p-8">
            {/* Animation de confettis */}
            <div className={`text-8xl mb-6 ${isAnimating ? 'animate-bounce' : ''}`}>
              🎉
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              C'est un Match !
            </h2>
            
            <p className="text-gray-600 mb-6">
              Vous et {matchedProfile.name} vous êtes trouvés mutuellement intéressants !
            </p>

            {/* Profils qui se rencontrent */}
            <div className="flex justify-center items-center space-x-4 mb-8">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-pink-500">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" 
                  alt="Vous"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="text-pink-500 text-2xl animate-pulse">
                ❤️
              </div>
              
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-pink-500">
                <img 
                  src={matchedProfile.image} 
                  alt={matchedProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
            >
              Continuer
            </button>
          </div>
        )}

        {/* Étape 2: Paiement (pour les clients) */}
        {step === 'payment' && userType === 'client' && (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Débloquer la mise en relation
              </h3>
              <p className="text-gray-600">
                Pour commencer à échanger avec {matchedProfile.name}, veuillez effectuer le paiement de mise en relation.
              </p>
            </div>

            {/* Récapitulatif */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <img 
                  src={matchedProfile.image} 
                  alt={matchedProfile.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{matchedProfile.name}</h4>
                  <p className="text-sm text-gray-600">{matchedProfile.profession}</p>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Frais de mise en relation</span>
                  <span className="text-xl font-bold text-green-600">70€</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Paiement unique pour débloquer la messagerie
                </p>
              </div>
            </div>

            {/* Bouton de paiement */}
            <button
              onClick={handlePayment}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-600 transition-colors mb-3"
            >
              Payer 70€ et débloquer la messagerie
            </button>

            <button
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 py-2 px-6 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Plus tard
            </button>
          </div>
        )}

        {/* Étape 3: Chat débloqué */}
        {step === 'chat' && (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Messagerie débloquée !
              </h3>
              <p className="text-gray-600">
                Vous pouvez maintenant échanger librement avec {matchedProfile.name}.
              </p>
            </div>

            {/* Preview du chat */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={matchedProfile.image} 
                  alt={matchedProfile.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-sm">{matchedProfile.name}</h4>
                  <span className="text-xs text-green-500">● En ligne</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="bg-blue-500 text-white rounded-lg p-2 ml-8 text-sm">
                  Salut ! Je suis ravi de cette mise en relation 👋
                </div>
                <div className="bg-white rounded-lg p-2 mr-8 text-sm">
                  Moi aussi ! Parlons de votre projet...
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              Commencer à chatter
            </button>
          </div>
        )}

        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default MatchModal;