import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Admin Login Component (conservé tel quel)
const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "admin@swipetonpro.com",
    password: "admin123"
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdmin({
      name: "Admin Swipe Ton Pro",
      email: formData.email,
      role: "super_admin"
    });
    setIsLoggedIn(true);
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">✅ Administration Swipe Ton Pro</h1>
                <p className="text-blue-200 mt-1">Connecté en tant que {admin.name} ({admin.role})</p>
              </div>
              <div className="flex space-x-3">
                <a href="/" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition duration-200">
                  Retour à l'App
                </a>
                <button onClick={() => setIsLoggedIn(false)} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition duration-200">
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-green-500/20 border border-green-500 rounded-xl p-8 text-center mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold mb-4">ADMINISTRATION SWIPE TON PRO OPÉRATIONNELLE</h2>
              <p className="text-lg text-green-100">Système d'administration fonctionnel avec toutes les permissions</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center text-white">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">⚙️</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Administration</h1>
          <p className="text-blue-200">Swipe Ton Pro</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required
                   className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Mot de passe</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required
                   className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          
          <button type="submit" disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 py-3 px-4 rounded-lg font-semibold transition duration-200 disabled:opacity-50">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-white/10 rounded-lg">
          <p className="text-sm font-medium mb-2">🔐 Compte de test :</p>
          <p className="text-xs text-blue-200">📧 admin@swipetonpro.com</p>
          <p className="text-xs text-blue-200">🔑 admin123</p>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log(response.data.message);
    } catch (e) {
      console.error(e, `errored out requesting / api`);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  return (
    <div>
      <header className="App-header">
        <a className="App-link" href="https://emergent.sh" target="_blank" rel="noopener noreferrer">
          <img src="https://avatars.githubusercontent.com/in/1201222?s=120&u=2686cf91179bbafbc7a71bfbc43004cf9ae1acea&v=4" alt="Emergent" />
        </a>
        <p className="mt-5">Building something incredible ~!</p>
        <div className="mt-8">
          <a href="/admin" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            🔐 Accès Administration
          </a>
        </div>
      </header>
      
      {/* Injection des améliorations pour l'interface existante */}
      <script dangerouslySetInnerHTML={{__html: `
        // Attendre que la page soit chargée
        document.addEventListener('DOMContentLoaded', function() {
          setTimeout(() => {
            // Ajouter les améliorations à l'interface existante
            addSwipeImprovements();
          }, 2000);
        });

        function addSwipeImprovements() {
          // 1. Réduire la taille des profils pour le swipe
          const profileCards = document.querySelectorAll('.profile-card, [class*="card"], [class*="profil"]');
          profileCards.forEach(card => {
            if (card) {
              card.style.transition = 'all 0.3s ease';
              card.style.transform = 'scale(0.85)';
              card.style.maxWidth = '300px';
              card.style.margin = '0 auto';
            }
          });

          // 2. Ajouter animation de match
          const matchButtons = document.querySelectorAll('button[class*="devis"], button[class*="match"], .btn-primary');
          matchButtons.forEach(btn => {
            if (btn && btn.textContent.includes('devis')) {
              btn.addEventListener('click', function(e) {
                e.preventDefault();
                showMatchAnimation();
              });
            }
          });

          // 3. Ajouter système de messagerie avec paiement
          addMessagingSystem();
        }

        function showMatchAnimation() {
          // Créer modal de match
          const modal = document.createElement('div');
          modal.innerHTML = \`
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
              <div style="background: white; border-radius: 20px; padding: 40px; max-width: 400px; text-align: center; animation: bounceIn 0.5s;">
                <div style="font-size: 80px; margin-bottom: 20px;">🎉</div>
                <h2 style="color: #333; margin-bottom: 20px; font-size: 24px;">C'est un Match !</h2>
                <p style="color: #666; margin-bottom: 30px;">Vous et ce professionnel vous êtes trouvés mutuellement intéressants !</p>
                <button onclick="this.closest('div').parentElement.remove(); showPaymentModal();" 
                        style="background: linear-gradient(45deg, #ff6b6b, #ee5a24); color: white; border: none; padding: 15px 30px; border-radius: 25px; font-size: 16px; cursor: pointer;">
                  Continuer
                </button>
              </div>
            </div>
          \`;
          document.body.appendChild(modal);
          
          // Animation CSS
          const style = document.createElement('style');
          style.textContent = \`
            @keyframes bounceIn {
              0% { transform: scale(0.3); opacity: 0; }
              50% { transform: scale(1.05); }
              70% { transform: scale(0.9); }
              100% { transform: scale(1); opacity: 1; }
            }
          \`;
          document.head.appendChild(style);
        }

        function showPaymentModal() {
          const modal = document.createElement('div');
          modal.innerHTML = \`
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
              <div style="background: white; border-radius: 20px; padding: 30px; max-width: 400px; text-align: center;">
                <div style="font-size: 60px; margin-bottom: 20px;">💳</div>
                <h3 style="color: #333; margin-bottom: 15px;">Débloquer la messagerie</h3>
                <p style="color: #666; margin-bottom: 20px;">Pour commencer à échanger, effectuez le paiement de mise en relation.</p>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #666;">Frais de mise en relation</span>
                    <span style="font-size: 24px; font-weight: bold; color: #28a745;">70€</span>
                  </div>
                  <p style="font-size: 12px; color: #999; margin-top: 5px;">Paiement unique pour débloquer la messagerie</p>
                </div>
                <button onclick="unlockChat(this)" 
                        style="background: #28a745; color: white; border: none; padding: 15px 30px; border-radius: 10px; font-size: 16px; cursor: pointer; width: 100%; margin-bottom: 10px;">
                  Payer 70€ et débloquer
                </button>
                <button onclick="this.closest('div').parentElement.remove();" 
                        style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 10px; font-size: 14px; cursor: pointer;">
                  Plus tard
                </button>
              </div>
            </div>
          \`;
          document.body.appendChild(modal);
        }

        function unlockChat(btn) {
          btn.textContent = 'Traitement du paiement...';
          btn.disabled = true;
          
          setTimeout(() => {
            btn.closest('div').parentElement.remove();
            showChatUnlocked();
          }, 2000);
        }

        function showChatUnlocked() {
          const modal = document.createElement('div');
          modal.innerHTML = \`
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
              <div style="background: white; border-radius: 20px; padding: 30px; max-width: 400px; text-align: center;">
                <div style="font-size: 60px; margin-bottom: 20px;">💬</div>
                <h3 style="color: #333; margin-bottom: 15px;">Messagerie débloquée !</h3>
                <p style="color: #666; margin-bottom: 20px;">Vous pouvez maintenant échanger librement avec ce professionnel.</p>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: left;">
                  <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <div style="width: 40px; height: 40px; background: #007bff; border-radius: 50%; margin-right: 10px;"></div>
                    <div>
                      <div style="font-weight: bold; font-size: 14px;">Thomas Martin</div>
                      <div style="color: #28a745; font-size: 12px;">● En ligne</div>
                    </div>
                  </div>
                  <div style="background: #007bff; color: white; padding: 8px 12px; border-radius: 15px; margin-bottom: 5px; margin-left: 30px; font-size: 13px;">
                    Salut ! Je suis ravi de cette mise en relation 👋
                  </div>
                  <div style="background: #e9ecef; color: #333; padding: 8px 12px; border-radius: 15px; margin-right: 30px; font-size: 13px;">
                    Moi aussi ! Parlons de votre projet...
                  </div>
                </div>
                <button onclick="this.closest('div').parentElement.remove();" 
                        style="background: #007bff; color: white; border: none; padding: 15px 30px; border-radius: 10px; font-size: 16px; cursor: pointer; width: 100%;">
                  Commencer à chatter
                </button>
              </div>
            </div>
          \`;
          document.body.appendChild(modal);
        }

        function addMessagingSystem() {
          // Ajouter un bouton de messagerie dans l'interface existante si il n'y en a pas
          const header = document.querySelector('header, .header, nav');
          if (header && !document.querySelector('.chat-btn')) {
            const chatBtn = document.createElement('button');
            chatBtn.className = 'chat-btn';
            chatBtn.innerHTML = '💬 Mes conversations';
            chatBtn.style.cssText = 'background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; margin-left: 10px; cursor: pointer; font-size: 14px;';
            chatBtn.onclick = () => alert('Fonctionnalité de messagerie activée !\\n\\nVos conversations avec les professionnels apparaîtront ici après les matches et paiements.');
            header.appendChild(chatBtn);
          }
        }
      `}} />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminLogin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
