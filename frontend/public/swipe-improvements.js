// Script d'améliorations pour Swipe Ton Pro - À injecter dans l'interface existante
(function() {
    'use strict';

    // Attendre que la page soit complètement chargée
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initImprovements);
    } else {
        initImprovements();
    }

    function initImprovements() {
        console.log('🚀 Initialisation des améliorations Swipe Ton Pro...');
        
        // Délai pour s'assurer que l'interface est prête
        setTimeout(() => {
            addSwipeImprovements();
            addMatchAnimation();
            addMessagingSystem();
        }, 2000);
    }

    function addSwipeImprovements() {
        console.log('📱 Ajout des améliorations de swipe...');
        
        // 1. Réduire la taille de la carte de profil
        const profileCard = document.querySelector('.card, [class*="profil"], div[style*="background"]');
        if (profileCard) {
            profileCard.style.transition = 'all 0.3s ease';
            profileCard.style.transform = 'scale(0.85)';
            profileCard.style.maxWidth = '350px';
            console.log('✅ Carte de profil redimensionnée');
        }
        
        // 2. Ajouter des boutons de swipe si ils n'existent pas
        const existingCard = document.querySelector('[class*="card"], .profile');
        if (existingCard && !document.querySelector('.swipe-buttons')) {
            const swipeContainer = document.createElement('div');
            swipeContainer.className = 'swipe-buttons';
            swipeContainer.style.cssText = `
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-top: 20px;
                padding: 0 20px;
            `;
            
            const dislikeBtn = document.createElement('button');
            dislikeBtn.innerHTML = '✕';
            dislikeBtn.style.cssText = `
                width: 60px;
                height: 60px;
                border-radius: 50%;
                border: 3px solid #ff4757;
                background: white;
                color: #ff4757;
                font-size: 24px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(255, 71, 87, 0.3);
            `;
            dislikeBtn.onmouseover = () => dislikeBtn.style.background = '#ff4757';
            dislikeBtn.onmouseout = () => dislikeBtn.style.background = 'white';
            dislikeBtn.onclick = () => handleSwipeLeft();
            
            const likeBtn = document.createElement('button');
            likeBtn.innerHTML = '♥';
            likeBtn.style.cssText = `
                width: 60px;
                height: 60px;
                border-radius: 50%;
                border: 3px solid #2ed573;
                background: white;
                color: #2ed573;
                font-size: 24px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(46, 213, 115, 0.3);
            `;
            likeBtn.onmouseover = () => likeBtn.style.background = '#2ed573';
            likeBtn.onmouseout = () => likeBtn.style.background = 'white';
            likeBtn.onclick = () => handleSwipeRight();
            
            swipeContainer.appendChild(dislikeBtn);
            swipeContainer.appendChild(likeBtn);
            
            // Insérer après la carte de profil
            existingCard.parentNode.insertBefore(swipeContainer, existingCard.nextSibling);
            console.log('✅ Boutons de swipe ajoutés');
        }
    }

    function handleSwipeLeft() {
        console.log('👎 Swipe left - Pass');
        // Animation de rejet
        const card = document.querySelector('[class*="card"], .profile');
        if (card) {
            card.style.transform = 'translateX(-100%) rotate(-30deg) scale(0.8)';
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.transform = 'translateX(0) rotate(0deg) scale(0.85)';
                card.style.opacity = '1';
            }, 500);
        }
    }

    function handleSwipeRight() {
        console.log('👍 Swipe right - Match!');
        showMatchAnimation();
    }

    function addMatchAnimation() {
        console.log('💕 Configuration de l\'animation de match...');
        
        // Intercepter le clic sur le bouton "Demander un devis"
        const devisBtn = document.querySelector('button, .btn, a');
        const buttons = document.querySelectorAll('button, .btn, a');
        
        buttons.forEach(btn => {
            if (btn.textContent && btn.textContent.toLowerCase().includes('devis')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    showMatchAnimation();
                });
                console.log('✅ Handler de match ajouté au bouton devis');
            }
        });
    }

    function showMatchAnimation() {
        console.log('🎉 Affichage de l\'animation de match...');
        
        // Créer l'overlay de match
        const matchOverlay = document.createElement('div');
        matchOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        const matchModal = document.createElement('div');
        matchModal.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            color: white;
            max-width: 400px;
            width: 90%;
            position: relative;
            animation: bounceIn 0.6s ease;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        `;

        matchModal.innerHTML = `
            <div style="font-size: 80px; margin-bottom: 20px; animation: bounce 1s infinite;">🎉</div>
            <h2 style="font-size: 28px; margin-bottom: 15px; font-weight: bold;">C'est un Match !</h2>
            <p style="font-size: 16px; margin-bottom: 30px; opacity: 0.9;">
                Vous et Thomas vous êtes trouvés mutuellement intéressants !
            </p>
            <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 20px;">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23f0f0f0%22/><text x=%2250%22 y=%2260%22 text-anchor=%22middle%22 font-size=%2230%22>👤</text></svg>') center/cover; border: 4px solid #ff6b9d;"></div>
                <div style="font-size: 40px; display: flex; align-items: center; animation: pulse 2s infinite;">❤️</div>
                <div style="width: 80px; height: 80px; border-radius: 50%; background: url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face') center/cover; border: 4px solid #ff6b9d;"></div>
            </div>
            <button onclick="closeMatchAndShowPayment()" style="
                background: linear-gradient(45deg, #ff6b9d, #c44569);
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 25px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: transform 0.2s ease;
                box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                Continuer vers la messagerie
            </button>
        `;

        // Ajouter les styles d'animation
        if (!document.querySelector('#matchAnimationStyles')) {
            const style = document.createElement('style');
            style.id = 'matchAnimationStyles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes bounceIn {
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.05); }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }

        matchOverlay.appendChild(matchModal);
        document.body.appendChild(matchOverlay);

        // Fonction globale pour fermer et passer au paiement
        window.closeMatchAndShowPayment = function() {
            matchOverlay.remove();
            showPaymentModal();
        };
    }

    function showPaymentModal() {
        console.log('💳 Affichage du modal de paiement...');
        
        const paymentOverlay = document.createElement('div');
        paymentOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        const paymentModal = document.createElement('div');
        paymentModal.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 30px;
            text-align: center;
            max-width: 400px;
            width: 90%;
            color: #333;
            position: relative;
        `;

        paymentModal.innerHTML = `
            <div style="font-size: 60px; margin-bottom: 20px;">💳</div>
            <h3 style="font-size: 24px; margin-bottom: 15px; color: #333;">Débloquer la messagerie</h3>
            <p style="color: #666; margin-bottom: 25px; line-height: 1.5;">
                Pour commencer à échanger avec Thomas, veuillez effectuer le paiement de mise en relation.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 25px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                    <div style="display: flex; align-items: center;">
                        <div style="width: 50px; height: 50px; border-radius: 50%; background: url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face') center/cover; margin-right: 15px;"></div>
                        <div style="text-align: left;">
                            <div style="font-weight: bold; color: #333;">Thomas Martin</div>
                            <div style="color: #666; font-size: 14px;">Électricien</div>
                        </div>
                    </div>
                </div>
                <hr style="margin: 15px 0; border: none; border-top: 1px solid #dee2e6;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #666;">Frais de mise en relation</span>
                    <span style="font-size: 24px; font-weight: bold; color: #28a745;">70€</span>
                </div>
                <p style="font-size: 12px; color: #999; margin-top: 8px; margin-bottom: 0;">
                    Paiement unique pour débloquer la messagerie
                </p>
            </div>

            <button onclick="processPayment(this)" style="
                background: #28a745;
                color: white;
                border: none;
                padding: 15px 25px;
                border-radius: 10px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
                margin-bottom: 15px;
                transition: background 0.3s ease;
            " onmouseover="this.style.background='#218838'" onmouseout="this.style.background='#28a745'">
                💳 Payer 70€ et débloquer la messagerie
            </button>
            
            <button onclick="this.closest('div').parentElement.remove()" style="
                background: transparent;
                color: #6c757d;
                border: 2px solid #6c757d;
                padding: 10px 20px;
                border-radius: 10px;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s ease;
            " onmouseover="this.style.background='#6c757d'; this.style.color='white'" onmouseout="this.style.background='transparent'; this.style.color='#6c757d'">
                Plus tard
            </button>
        `;

        paymentOverlay.appendChild(paymentModal);
        document.body.appendChild(paymentOverlay);

        // Fonction globale pour traiter le paiement
        window.processPayment = function(btn) {
            btn.textContent = '⏳ Traitement du paiement...';
            btn.disabled = true;
            btn.style.background = '#6c757d';
            
            setTimeout(() => {
                paymentOverlay.remove();
                showChatUnlocked();
            }, 2500);
        };
    }

    function showChatUnlocked() {
        console.log('💬 Affichage du chat débloqué...');
        
        const chatOverlay = document.createElement('div');
        chatOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        const chatModal = document.createElement('div');
        chatModal.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 30px;
            text-align: center;
            max-width: 450px;
            width: 90%;
            color: #333;
        `;

        chatModal.innerHTML = `
            <div style="font-size: 60px; margin-bottom: 20px;">✅</div>
            <h3 style="font-size: 24px; margin-bottom: 15px; color: #28a745;">Messagerie débloquée !</h3>
            <p style="color: #666; margin-bottom: 25px;">
                Vous pouvez maintenant échanger librement avec Thomas Martin.
            </p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 25px; text-align: left;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face') center/cover; margin-right: 12px;"></div>
                    <div>
                        <div style="font-weight: bold; font-size: 14px; color: #333;">Thomas Martin</div>
                        <div style="color: #28a745; font-size: 12px;">● En ligne</div>
                    </div>
                </div>
                
                <div style="space-y: 10px;">
                    <div style="background: #007bff; color: white; padding: 10px 15px; border-radius: 18px; margin-bottom: 8px; margin-left: 30px; font-size: 14px; max-width: 80%;">
                        Salut ! Je suis ravi de cette mise en relation 👋
                    </div>
                    <div style="background: #e9ecef; color: #333; padding: 10px 15px; border-radius: 18px; margin-right: 30px; font-size: 14px; max-width: 80%;">
                        Moi aussi ! Parlons de votre projet...
                    </div>
                    <div style="background: #007bff; color: white; padding: 10px 15px; border-radius: 18px; margin-left: 30px; font-size: 14px; max-width: 80%;">
                        Parfait ! Quand puis-je passer pour le devis ?
                    </div>
                </div>
            </div>

            <button onclick="this.closest('div').parentElement.remove(); addChatButton();" style="
                background: linear-gradient(45deg, #007bff, #0056b3);
                color: white;
                border: none;
                padding: 15px 25px;
                border-radius: 10px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
                transition: transform 0.2s ease;
            " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                💬 Commencer à chatter
            </button>
        `;

        chatOverlay.appendChild(chatModal);
        document.body.appendChild(chatOverlay);
    }

    function addMessagingSystem() {
        console.log('💬 Ajout du système de messagerie...');
        
        // Ajouter un bouton de messagerie dans le header
        window.addChatButton = function() {
            const header = document.querySelector('header, .header, nav, .navbar');
            if (header && !document.querySelector('.chat-button-added')) {
                const chatButton = document.createElement('button');
                chatButton.className = 'chat-button-added';
                chatButton.innerHTML = '💬 Mes conversations (1)';
                chatButton.style.cssText = `
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    margin-left: 15px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
                `;
                
                chatButton.onmouseover = () => {
                    chatButton.style.background = '#218838';
                    chatButton.style.transform = 'translateY(-1px)';
                };
                chatButton.onmouseout = () => {
                    chatButton.style.background = '#28a745';
                    chatButton.style.transform = 'translateY(0)';
                };
                
                chatButton.onclick = () => {
                    alert('💬 Messagerie Swipe Ton Pro\n\n✅ Conversation avec Thomas Martin\n📱 Chat débloqué après paiement de 70€\n💡 Vous pouvez maintenant échanger librement !');
                };
                
                header.appendChild(chatButton);
                console.log('✅ Bouton de messagerie ajouté au header');
            }
        };
    }

    console.log('🎉 Améliorations Swipe Ton Pro chargées avec succès !');
})();