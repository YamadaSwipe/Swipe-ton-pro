// Script d'améliorations pour Swipe Ton Pro - Système de matching bidirectionnel réaliste
(function() {
    'use strict';

    // Système de matching - stockage des swipes
    let swipeData = {
        pendingMatches: [], // Swipes en attente de réponse
        matches: [], // Matches confirmés (bidirectionnels)
        currentUser: {
            type: 'particulier', // ou 'professionnel'
            id: 'user_' + Math.random().toString(36).substr(2, 9)
        }
    };

    // Simulation des profils et swipes existants
    const profiles = [
        {
            id: 'thomas_electricien',
            name: 'Thomas Martin',
            profession: 'Électricien',
            hasSwipedCurrentUser: Math.random() > 0.5 // 50% de chance qu'il ait déjà swipé
        }
    ];

    // Attendre que la page soit complètement chargée
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRealisticMatching);
    } else {
        initRealisticMatching();
    }

    function initRealisticMatching() {
        console.log('🎯 Initialisation du système de matching bidirectionnel...');
        
        setTimeout(() => {
            addRealisticSwipeSystem();
            addUserTypeSelector();
            addMatchingStatus();
        }, 2000);
    }

    function addUserTypeSelector() {
        // Ajouter un sélecteur de type d'utilisateur
        const header = document.querySelector('header, nav, .navbar');
        if (header && !document.querySelector('.user-type-selector')) {
            const selector = document.createElement('div');
            selector.className = 'user-type-selector';
            selector.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: rgba(255, 255, 255, 0.95);
                padding: 15px;
                border-radius: 15px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                border: 2px solid #2ed573;
            `;
            
            selector.innerHTML = `
                <div style="font-size: 12px; color: #666; margin-bottom: 8px; font-weight: bold;">Mode de test</div>
                <select onchange="changeUserType(this.value)" style="
                    border: 2px solid #2ed573;
                    border-radius: 8px;
                    padding: 5px 10px;
                    font-size: 14px;
                    color: #333;
                    background: white;
                ">
                    <option value="particulier">🏠 Particulier</option>
                    <option value="professionnel">🔧 Professionnel</option>
                </select>
                <div id="matchingInfo" style="font-size: 11px; color: #666; margin-top: 8px;">
                    Vous êtes un particulier
                </div>
            `;
            
            document.body.appendChild(selector);
        }
        
        // Fonction globale pour changer le type d'utilisateur
        window.changeUserType = function(type) {
            swipeData.currentUser.type = type;
            document.getElementById('matchingInfo').textContent = 
                type === 'particulier' ? 'Vous cherchez un professionnel' : 'Vous êtes un professionnel';
            updateSwipeInterface();
            console.log('👤 Type d\\'utilisateur changé:', type);
        };
    }

    function addRealisticSwipeSystem() {
        console.log('📱 Ajout du système de swipe réaliste...');
        
        // Réduire la taille de la carte
        const profileCard = document.querySelector('.card, [class*="profil"], div[style*="background"]');
        if (profileCard) {
            profileCard.style.transition = 'all 0.3s ease';
            profileCard.style.transform = 'scale(0.85)';
            profileCard.style.maxWidth = '350px';
        }
        
        // Remplacer le bouton "Demander un devis" par des boutons de swipe
        const devisBtn = document.querySelector('button');
        if (devisBtn && devisBtn.textContent.includes('devis')) {
            // Créer le container de swipe
            const swipeContainer = document.createElement('div');
            swipeContainer.style.cssText = \`
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-top: 20px;
                padding: 0 20px;
            \`;
            
            // Bouton de rejet
            const rejectBtn = document.createElement('button');
            rejectBtn.innerHTML = '✕';
            rejectBtn.style.cssText = \`
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
            \`;
            rejectBtn.onclick = () => handleSwipe('left');
            
            // Bouton d'acceptation  
            const acceptBtn = document.createElement('button');
            acceptBtn.innerHTML = '♥';
            acceptBtn.style.cssText = \`
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
            \`;
            acceptBtn.onclick = () => handleSwipe('right');
            
            swipeContainer.appendChild(rejectBtn);
            swipeContainer.appendChild(acceptBtn);
            
            // Remplacer le bouton devis
            devisBtn.parentNode.replaceChild(swipeContainer, devisBtn);
        }
        
        updateSwipeInterface();
    }

    function handleSwipe(direction) {
        const currentProfile = profiles[0]; // Thomas pour la demo
        
        if (direction === 'left') {
            console.log('👎 Swipe left - Profil rejeté');
            showSwipeAnimation('reject');
            setTimeout(() => {
                showNoMatchMessage();
            }, 800);
            return;
        }
        
        if (direction === 'right') {
            console.log('👍 Swipe right - Profil liké');
            showSwipeAnimation('like');
            
            // Vérifier si c'est un match bidirectionnel
            setTimeout(() => {
                if (currentProfile.hasSwipedCurrentUser) {
                    // C'est un MATCH !
                    console.log('🎉 MATCH BIDIRECTIONNEL !');
                    showMatchAnimation();
                } else {
                    // En attente de la réponse
                    console.log('⏳ En attente de la réponse...');
                    showPendingMessage();
                }
            }, 800);
        }
    }

    function showSwipeAnimation(type) {
        const card = document.querySelector('[class*="card"], .profile');
        if (card) {
            if (type === 'like') {
                card.style.transform = 'translateX(100%) rotate(30deg) scale(0.8)';
                card.style.opacity = '0.7';
                // Overlay coeur vert
                const overlay = document.createElement('div');
                overlay.style.cssText = \`
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 80px;
                    color: #2ed573;
                    z-index: 100;
                    animation: heartPulse 0.6s ease;
                \`;
                overlay.textContent = '♥';
                card.style.position = 'relative';
                card.appendChild(overlay);
                
                setTimeout(() => overlay.remove(), 600);
            } else {
                card.style.transform = 'translateX(-100%) rotate(-30deg) scale(0.8)';
                card.style.opacity = '0.7';
                // Overlay croix rouge
                const overlay = document.createElement('div');
                overlay.style.cssText = \`
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 80px;
                    color: #ff4757;
                    z-index: 100;
                    animation: rejectShake 0.6s ease;
                \`;
                overlay.textContent = '✕';
                card.style.position = 'relative';
                card.appendChild(overlay);
                
                setTimeout(() => overlay.remove(), 600);
            }
            
            setTimeout(() => {
                card.style.transform = 'translateX(0) rotate(0deg) scale(0.85)';
                card.style.opacity = '1';
            }, 800);
        }
        
        // Ajouter les styles d'animation
        if (!document.querySelector('#swipeAnimationStyles')) {
            const style = document.createElement('style');
            style.id = 'swipeAnimationStyles';
            style.textContent = \`
                @keyframes heartPulse {
                    0% { transform: translate(-50%, -50%) scale(0); }
                    50% { transform: translate(-50%, -50%) scale(1.2); }
                    100% { transform: translate(-50%, -50%) scale(1); }
                }
                @keyframes rejectShake {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    25% { transform: translate(-50%, -50%) rotate(-10deg); }
                    75% { transform: translate(-50%, -50%) rotate(10deg); }
                    100% { transform: translate(-50%, -50%) rotate(0deg); }
                }
            \`;
            document.head.appendChild(style);
        }
    }

    function showPendingMessage() {
        const pendingModal = document.createElement('div');
        pendingModal.style.cssText = \`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        \`;

        pendingModal.innerHTML = \`
            <div style="
                background: white;
                border-radius: 20px;
                padding: 40px;
                text-align: center;
                max-width: 400px;
                width: 90%;
                color: #333;
            ">
                <div style="font-size: 60px; margin-bottom: 20px;">⏳</div>
                <h3 style="font-size: 24px; margin-bottom: 15px; color: #ffa502;">En attente...</h3>
                <p style="color: #666; margin-bottom: 25px; line-height: 1.5;">
                    Vous avez liké Thomas ! Il doit maintenant vous liker en retour pour créer un match.
                </p>
                <div style="background: #fff3cd; padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #ffa502;">
                    <div style="font-size: 14px; color: #856404;">
                        <strong>💡 Comment ça marche :</strong><br>
                        1. Vous swipez à droite ✅<br>
                        2. Le professionnel doit aussi swiper à droite<br>
                        3. Si les deux swipent = MATCH ! 🎉
                    </div>
                </div>
                <button onclick="this.closest('div').parentElement.remove()" style="
                    background: #ffa502;
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                ">
                    Compris
                </button>
            </div>
        \`;

        document.body.appendChild(pendingModal);
        
        // Simuler une réponse dans 5 secondes pour la demo
        setTimeout(() => {
            if (document.body.contains(pendingModal)) {
                pendingModal.remove();
                // 70% de chance de match pour la demo
                if (Math.random() > 0.3) {
                    showMatchAnimation();
                } else {
                    showNoMatchMessage();
                }
            }
        }, 5000);
    }

    function showNoMatchMessage() {
        const noMatchModal = document.createElement('div');
        noMatchModal.style.cssText = \`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        \`;

        noMatchModal.innerHTML = \`
            <div style="
                background: white;
                border-radius: 20px;
                padding: 40px;
                text-align: center;
                max-width: 400px;
                width: 90%;
                color: #333;
            ">
                <div style="font-size: 60px; margin-bottom: 20px;">😔</div>
                <h3 style="font-size: 24px; margin-bottom: 15px; color: #ff4757;">Pas de match cette fois</h3>
                <p style="color: #666; margin-bottom: 25px;">
                    Ne vous découragez pas ! Continuez à swiper pour trouver votre professionnel idéal.
                </p>
                <button onclick="this.closest('div').parentElement.remove(); resetProfile();" style="
                    background: #2ed573;
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                ">
                    Continuer à swiper
                </button>
            </div>
        \`;

        document.body.appendChild(noMatchModal);
    }

    function showMatchAnimation() {
        console.log('🎉 Affichage de l\\'animation de MATCH BIDIRECTIONNEL...');
        
        const matchOverlay = document.createElement('div');
        matchOverlay.style.cssText = \`
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
        \`;

        const matchModal = document.createElement('div');
        matchModal.style.cssText = \`
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            color: white;
            max-width: 450px;
            width: 90%;
            position: relative;
            animation: bounceIn 0.6s ease;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        \`;

        matchModal.innerHTML = \`
            <div style="font-size: 80px; margin-bottom: 20px; animation: bounce 1s infinite;">🎉</div>
            <h2 style="font-size: 28px; margin-bottom: 15px; font-weight: bold;">C'est un Match !</h2>
            <p style="font-size: 16px; margin-bottom: 20px; opacity: 0.9;">
                Thomas et vous vous êtes swipés mutuellement !
            </p>
            <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 15px; margin-bottom: 25px;">
                <div style="font-size: 14px; margin-bottom: 10px;">
                    ✅ Vous avez swipé à droite<br>
                    ✅ Thomas a aussi swipé à droite
                </div>
                <div style="font-size: 12px; opacity: 0.8;">
                    Match bidirectionnel confirmé !
                </div>
            </div>
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
                Débloquer la messagerie (70€)
            </button>
        \`;

        matchOverlay.appendChild(matchModal);
        document.body.appendChild(matchOverlay);

        // Fonction globale pour continuer
        window.closeMatchAndShowPayment = function() {
            matchOverlay.remove();
            showPaymentModal();
        };
    }

    function showPaymentModal() {
        // [Le code du modal de paiement reste identique]
        console.log('💳 Affichage du modal de paiement...');
        
        const paymentOverlay = document.createElement('div');
        paymentOverlay.style.cssText = \`
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
        \`;

        const paymentModal = document.createElement('div');
        paymentModal.style.cssText = \`
            background: white;
            border-radius: 20px;
            padding: 30px;
            text-align: center;
            max-width: 400px;
            width: 90%;
            color: #333;
            position: relative;
        \`;

        paymentModal.innerHTML = \`
            <div style="font-size: 60px; margin-bottom: 20px;">💳</div>
            <h3 style="font-size: 24px; margin-bottom: 15px; color: #333;">Débloquer la messagerie</h3>
            <p style="color: #666; margin-bottom: 25px; line-height: 1.5;">
                Vous avez un match avec Thomas ! Pour échanger librement, effectuez le paiement de mise en relation.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 25px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                    <div style="display: flex; align-items: center;">
                        <div style="width: 50px; height: 50px; border-radius: 50%; background: url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face') center/cover; margin-right: 15px;"></div>
                        <div style="text-align: left;">
                            <div style="font-weight: bold; color: #333;">Thomas Martin</div>
                            <div style="color: #666; font-size: 14px;">Électricien - Match confirmé ✅</div>
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
        \`;

        paymentOverlay.appendChild(paymentModal);
        document.body.appendChild(paymentOverlay);

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
        // [Le code du chat débloqué reste identique avec une mention du match bidirectionnel]
        console.log('💬 Affichage du chat débloqué...');
        
        const chatOverlay = document.createElement('div');
        chatOverlay.style.cssText = \`
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
        \`;

        const chatModal = document.createElement('div');
        chatModal.style.cssText = \`
            background: white;
            border-radius: 20px;
            padding: 30px;
            text-align: center;
            max-width: 450px;
            width: 90%;
            color: #333;
        \`;

        chatModal.innerHTML = \`
            <div style="font-size: 60px; margin-bottom: 20px;">✅</div>
            <h3 style="font-size: 24px; margin-bottom: 15px; color: #28a745;">Messagerie débloquée !</h3>
            <p style="color: #666; margin-bottom: 25px;">
                Match confirmé avec Thomas Martin ! Vous pouvez maintenant échanger librement.
            </p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 25px; text-align: left;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face') center/cover; margin-right: 12px;"></div>
                    <div>
                        <div style="font-weight: bold; font-size: 14px; color: #333;">Thomas Martin</div>
                        <div style="color: #28a745; font-size: 12px;">● En ligne - Match confirmé</div>
                    </div>
                </div>
                
                <div style="space-y: 10px;">
                    <div style="background: #007bff; color: white; padding: 10px 15px; border-radius: 18px; margin-bottom: 8px; margin-left: 30px; font-size: 14px; max-width: 80%;">
                        Salut ! Ravi qu'on se soit matchés ! 👋
                    </div>
                    <div style="background: #e9ecef; color: #333; padding: 10px 15px; border-radius: 18px; margin-right: 30px; font-size: 14px; max-width: 80%;">
                        Moi aussi ! Parfait timing pour mon projet électrique
                    </div>
                    <div style="background: #007bff; color: white; padding: 10px 15px; border-radius: 18px; margin-left: 30px; font-size: 14px; max-width: 80%;">
                        Super ! Quand puis-je passer pour le devis ?
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
                💬 Accéder à la conversation
            </button>
        \`;

        chatOverlay.appendChild(chatModal);
        document.body.appendChild(chatOverlay);
    }

    function addMatchingStatus() {
        // Afficher le statut de matching près de la carte
        const card = document.querySelector('[class*="card"]');
        if (card && !document.querySelector('.matching-status')) {
            const status = document.createElement('div');
            status.className = 'matching-status';
            status.style.cssText = \`
                text-align: center;
                margin-top: 15px;
                padding: 10px;
                background: rgba(46, 213, 115, 0.1);
                border-radius: 10px;
                border: 1px solid #2ed573;
            \`;
            
            const currentProfile = profiles[0];
            const hasSwipedText = currentProfile.hasSwipedCurrentUser ? 
                '✅ Thomas vous a déjà liké !' : 
                '⏳ Thomas n\\'a pas encore swipé';
                
            status.innerHTML = \`
                <div style="font-size: 14px; color: #2ed573; font-weight: bold; margin-bottom: 5px;">
                    Statut de matching bidirectionnel
                </div>
                <div style="font-size: 12px; color: #666;">
                    ${hasSwipedText}<br>
                    Swipez à droite pour ${currentProfile.hasSwipedCurrentUser ? 'créer un match' : 'montrer votre intérêt'}
                </div>
            \`;
            
            card.parentNode.insertBefore(status, card.nextSibling);
        }
    }

    function updateSwipeInterface() {
        // Mettre à jour l'interface selon le type d'utilisateur et le statut
        const statusEl = document.querySelector('.matching-status');
        if (statusEl) {
            const currentProfile = profiles[0];
            const userType = swipeData.currentUser.type;
            
            let statusText = '';
            if (userType === 'particulier') {
                statusText = currentProfile.hasSwipedCurrentUser ? 
                    '✅ Thomas vous a déjà liké ! Swipez pour matcher' : 
                    '⏳ Swipez à droite si Thomas vous intéresse';
            } else {
                statusText = 'Vous êtes Thomas. Un particulier cherche un électricien.';
            }
            
            statusEl.querySelector('div:last-child').innerHTML = statusText;
        }
    }

    function resetProfile() {
        // Réinitialiser pour tester d'autres scénarios
        profiles[0].hasSwipedCurrentUser = Math.random() > 0.5;
        updateSwipeInterface();
        console.log('🔄 Profil réinitialisé pour nouveau test');
    }

    window.addChatButton = function() {
        const header = document.querySelector('header, .header, nav, .navbar');
        if (header && !document.querySelector('.chat-button-added')) {
            const chatButton = document.createElement('button');
            chatButton.className = 'chat-button-added';
            chatButton.innerHTML = '💬 Mes matches (1)';
            chatButton.style.cssText = \`
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
            \`;
            
            chatButton.onclick = () => {
                alert('💬 Vos Matches Swipe Ton Pro\\n\\n✅ Thomas Martin (Électricien)\\n💳 Chat débloqué\\n🎯 Match bidirectionnel confirmé\\n\\nVous pouvez échanger librement !');
            };
            
            header.appendChild(chatButton);
        }
    };

    // Ajouter les styles d'animation
    if (!document.querySelector('#realisticMatchingStyles')) {
        const style = document.createElement('style');
        style.id = 'realisticMatchingStyles';
        style.textContent = \`
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
        \`;
        document.head.appendChild(style);
    }

    console.log('🎉 Système de matching bidirectionnel réaliste activé !');
})();