import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const ContactModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Contactez-nous</h3>
        <p className="text-gray-600 mb-4">
          Pour les demandes d'entreprises et grands comptes, veuillez nous contacter :
        </p>
        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <p className="text-blue-800 font-medium">contact@swipetonpro.fr</p>
        </div>
        <button
          onClick={() => setShowContactModal(false)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );

  return (
    <>
      <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">ST</span>
              </div>
              <span className="text-white font-bold text-xl">SwipeTonPro</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-white hover:text-blue-400 transition-colors">
                🏠 Accueil
              </Link>
              
              <button
                onClick={() => setShowContactModal(true)}
                className="text-white hover:text-blue-400 transition-colors"
              >
                Grand compte
              </button>
              
              <button
                onClick={() => setShowContactModal(true)}
                className="text-white hover:text-blue-400 transition-colors"
              >
                Enseignes
              </button>

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/dashboard" 
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                  
                  {user.user_type === 'particulier' && (
                    <Link 
                      to="/swipe" 
                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all"
                    >
                      Swiper
                    </Link>
                  )}
                  
                  <Link 
                    to="/matches" 
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    Matches
                  </Link>
                  
                  <Link 
                    to="/profile" 
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    Profil
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Button (Hidden at bottom) */}
      {user && user.user_type === 'admin' && (
        <div className="fixed bottom-4 left-4 z-40">
          <Link 
            to="/admin"
            className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-all opacity-70 hover:opacity-100"
            title="Admin"
          >
            ⚙️
          </Link>
        </div>
      )}

      {showContactModal && <ContactModal />}
    </>
  );
};

export default Navbar;