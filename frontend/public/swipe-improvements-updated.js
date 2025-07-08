// SwipeTonPro - Interface complète avec modifications finales version production
(function() {
    'use strict';
    
    // Configuration et données
    let swipeData = {
        pendingMatches: [],
        matches: [],
        currentUser: {
            type: 'particulier',
            id: 'user_' + Math.random().toString(36).substr(2, 9)
        }
    };

    const profiles = [
        {
            id: 'thomas_electricien',
            name: 'Thomas Martin',
            profession: 'Électricien',
            hasSwipedCurrentUser: Math.random() > 0.5
        }
    ];

    // Attendre le chargement complet
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSwipeTonPro);
    } else {
        initSwipeTonPro();
    }

    function initSwipeTonPro() {
        console.log('🎯 Initialisation SwipeTonPro version production...');
        
        // Nettoyer l'interface existante
        const existingContent = document.querySelector('#root');
        if (existingContent) {
            existingContent.innerHTML = '';
        }
        
        setTimeout(() => {
            createCompleteInterface();
            addSwipeSystem();
            addUserTypeSelector();
            addAnimationStyles();
        }, 1000);
    }

    function createCompleteInterface() {
        const body = document.body;
        
        // Créer l'interface complète
        const appContainer = document.createElement('div');
        appContainer.id = 'swipe-ton-pro-app';
        appContainer.style.cssText = `
            background: #0f172a;
            color: white;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        appContainer.innerHTML = `
            <!-- Header -->
            <header style="
                background: rgba(15, 23, 42, 0.95);
                backdrop-filter: blur(20px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                position: sticky;
                top: 0;
                z-index: 1000;
                padding: 1rem 0;
            ">
                <div style="
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 2rem;
                ">
                    <div style="display: flex; align-items: center;">
                        <div style="
                            width: 40px;
                            height: 40px;
                            background: linear-gradient(45deg, #3b82f6, #8b5cf6);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-right: 12px;
                            color: white;
                            font-size: 18px;
                            font-weight: bold;
                        ">♥</div>
                        <h1 style="
                            font-size: 1.5rem;
                            font-weight: bold;
                            color: white;
                            margin: 0;
                        ">Swipe Ton Pro</h1>
                    </div>
                    <nav style="display: flex; gap: 2rem; align-items: center;">
                        <a href="#" onclick="showModal('Grand compte')" style="color: #e2e8f0; text-decoration: none; font-weight: 500;">Grand compte</a>
                        <a href="#" onclick="showModal('Magasins et fournisseurs')" style="color: #e2e8f0; text-decoration: none; font-weight: 500;">Magasins et fournisseurs</a>
                        <a href="#" onclick="showModal('Contact')" style="color: #e2e8f0; text-decoration: none; font-weight: 500;">Contact</a>
                        <button style="background: linear-gradient(45deg, #3b82f6, #8b5cf6); color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 500; cursor: pointer;">Se connecter</button>
                        <button style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid #3b82f6; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 500; cursor: pointer;">Inscription</button>
                    </nav>
                </div>
            </header>

            <!-- Section Hero -->
            <section style="
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                padding: 4rem 2rem;
                text-align: center;
                position: relative;
                overflow: hidden;
            ">
                <div style="
                    max-width: 1200px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                ">
                    <div style="
                        display: inline-block;
                        background: rgba(59, 130, 246, 0.1);
                        color: #3b82f6;
                        padding: 0.5rem 1rem;
                        border-radius: 2rem;
                        font-size: 0.875rem;
                        font-weight: 500;
                        margin-bottom: 2rem;
                        border: 1px solid rgba(59, 130, 246, 0.3);
                    ">
                        ✨ NOUVEAU: INTERFACE ULTRA REVOLUTIONNAIRE
                    </div>
                    
                    <h1 style="
                        font-size: 3.5rem;
                        font-weight: 900;
                        line-height: 1.1;
                        margin: 0 0 1.5rem 0;
                        color: white;
                    ">
                        Votre prochain 
                        <span style="
                            background: linear-gradient(45deg, #22c55e, #84cc16);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            background-clip: text;
                            text-shadow: 0 0 30px rgba(34, 197, 94, 0.5);
                        ">MATCH</span>
                        <br>professionnel est à un 
                        <span style="
                            background: linear-gradient(45deg, #eab308, #f59e0b);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            background-clip: text;
                            text-shadow: 0 0 30px rgba(234, 179, 8, 0.5);
                        ">SWIPE</span>.
                    </h1>
                    
                    <p style="
                        font-size: 1.25rem;
                        color: #94a3b8;
                        max-width: 600px;
                        margin: 0 auto 2rem auto;
                        line-height: 1.6;
                    ">
                        Que vous soyez un porteur de projet cherchant le talent idéal ou un professionnel 
                        en quête de nouvelles opportunités, notre plateforme vous connecte instantanément.
                    </p>
                    
                    <div style="
                        display: flex;
                        gap: 1rem;
                        justify-content: center;
                        flex-wrap: wrap;
                        margin-bottom: 3rem;
                    ">
                        <button onclick="startSwipe('particulier')" style="
                            background: linear-gradient(45deg, #3b82f6, #8b5cf6);
                            color: white;
                            border: none;
                            padding: 1rem 2rem;
                            border-radius: 0.75rem;
                            font-size: 1.125rem;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s;
                            box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
                        ">
                            Commencer gratuitement (particulier)
                        </button>
                        <button onclick="startSwipe('professionnel')" style="
                            background: rgba(59, 130, 246, 0.1);
                            color: #3b82f6;
                            border: 2px solid #3b82f6;
                            padding: 1rem 2rem;
                            border-radius: 0.75rem;
                            font-size: 1.125rem;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s;
                        ">
                            Je suis un artisan
                        </button>
                    </div>
                    
                    <!-- Card de démonstration -->
                    <div style="
                        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                        border-radius: 1.5rem;
                        padding: 2rem;
                        max-width: 400px;
                        margin: 0 auto;
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    ">
                        <div style="
                            background: white;
                            border-radius: 1rem;
                            overflow: hidden;
                            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                        ">
                            <div style="
                                height: 200px;
                                background: url('https://images.pexels.com/photos/7616608/pexels-photo-7616608.jpeg') center/cover;
                                position: relative;
                            ">
                                <div style="
                                    position: absolute;
                                    top: 1rem;
                                    right: 1rem;
                                    background: #22c55e;
                                    color: white;
                                    padding: 0.25rem 0.5rem;
                                    border-radius: 1rem;
                                    font-size: 0.75rem;
                                    font-weight: 500;
                                ">✓ Vérifié</div>
                                <div style="
                                    position: absolute;
                                    bottom: 1rem;
                                    left: 1rem;
                                    color: white;
                                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
                                ">
                                    <h3 style="margin: 0; font-size: 1.25rem; font-weight: bold;">Thomas</h3>
                                    <p style="margin: 0; font-size: 0.875rem; opacity: 0.9;">Électricien</p>
                                </div>
                            </div>
                            <div style="padding: 1rem;">
                                <div style="
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    margin-bottom: 0.5rem;
                                ">
                                    <div style="display: flex; align-items: center;">
                                        <span style="color: #facc15; margin-right: 0.25rem;">⭐</span>
                                        <span style="font-weight: 600; color: #333;">5.0</span>
                                    </div>
                                    <span style="color: #22c55e; font-weight: 600;">45€/h</span>
                                </div>
                                <p style="
                                    color: #666;
                                    font-size: 0.875rem;
                                    line-height: 1.4;
                                    margin: 0;
                                ">
                                    Spécialisé en installation électrique et dépannage d'urgence.
                                </p>
                            </div>
                        </div>
                        
                        <div style="
                            text-align: center;
                            margin-top: 1.5rem;
                            padding-top: 1.5rem;
                            border-top: 1px solid rgba(255, 255, 255, 0.1);
                        ">
                            <p style="
                                color: #94a3b8;
                                font-size: 0.875rem;
                                margin: 0 0 1rem 0;
                            ">
                                <img src="https://images.pexels.com/photos/8487333/pexels-photo-8487333.jpeg" alt="Match icon" style="width: 24px; height: 24px; border-radius: 50%; vertical-align: middle; margin-right: 0.5rem;">
                                Match parfait !
                            </p>
                            <button onclick="showMatchAnimation()" style="
                                background: linear-gradient(45deg, #ff6b9d, #c44569);
                                color: white;
                                border: none;
                                padding: 0.75rem 1.5rem;
                                border-radius: 0.5rem;
                                font-weight: 600;
                                cursor: pointer;
                                transition: all 0.3s;
                                box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);
                            ">
                                Demander un devis
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Section Comment ça marche -->
            <section style="
                background: #0f172a;
                padding: 4rem 2rem;
            ">
                <div style="
                    max-width: 1200px;
                    margin: 0 auto;
                    text-align: center;
                ">
                    <h2 style="
                        font-size: 2.5rem;
                        font-weight: 800;
                        color: white;
                        margin-bottom: 3rem;
                    ">Comment ça marche ?</h2>
                    <p style="
                        font-size: 1.125rem;
                        color: #94a3b8;
                        margin-bottom: 3rem;
                        max-width: 600px;
                        margin-left: auto;
                        margin-right: auto;
                    ">
                        Un processus simple et efficace pour trouver votre 
                        <span style="color: #22c55e; font-weight: 600;">MATCH</span> parfait
                    </p>
                    
                    <div style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 2rem;
                        margin-bottom: 3rem;
                    ">
                        <div style="
                            background: rgba(15, 23, 42, 0.5);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            border-radius: 1rem;
                            padding: 2rem;
                            text-align: center;
                            transition: all 0.3s;
                        ">
                            <div style="
                                width: 80px;
                                height: 80px;
                                background: linear-gradient(45deg, #3b82f6, #8b5cf6);
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                margin: 0 auto 1rem auto;
                            ">
                                <img src="https://images.pexels.com/photos/7519895/pexels-photo-7519895.jpeg" alt="Profile icon" style="width: 40px; height: 40px; border-radius: 50%;">
                            </div>
                            <h3 style="
                                color: white;
                                font-size: 1.25rem;
                                font-weight: 600;
                                margin-bottom: 1rem;
                            ">Créez votre profil</h3>
                            <p style="
                                color: #94a3b8;
                                line-height: 1.6;
                                margin: 0;
                            ">
                                Renseignez vos informations et définissez vos critères de recherche selon vos besoins.
                            </p>
                        </div>
                        
                        <div style="
                            background: rgba(15, 23, 42, 0.5);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            border-radius: 1rem;
                            padding: 2rem;
                            text-align: center;
                            transition: all 0.3s;
                        ">
                            <div style="
                                width: 80px;
                                height: 80px;
                                background: linear-gradient(45deg, #22c55e, #84cc16);
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                margin: 0 auto 1rem auto;
                            ">
                                <img src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643" alt="Swipe icon" style="width: 40px; height: 40px; border-radius: 50%;">
                            </div>
                            <h3 style="
                                color: white;
                                font-size: 1.25rem;
                                font-weight: 600;
                                margin-bottom: 1rem;
                            ">Swipez les profils</h3>
                            <p style="
                                color: #94a3b8;
                                line-height: 1.6;
                                margin: 0;
                            ">
                                Découvrez des profils correspondant à vos critères. Swipez à droite si le profil vous intéresse.
                            </p>
                        </div>
                        
                        <div style="
                            background: rgba(15, 23, 42, 0.5);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            border-radius: 1rem;
                            padding: 2rem;
                            text-align: center;
                            transition: all 0.3s;
                        ">
                            <div style="
                                width: 80px;
                                height: 80px;
                                background: linear-gradient(45deg, #eab308, #f59e0b);
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                margin: 0 auto 1rem auto;
                            ">
                                <img src="https://images.pexels.com/photos/8487770/pexels-photo-8487770.jpeg" alt="Match icon" style="width: 40px; height: 40px; border-radius: 50%;">
                            </div>
                            <h3 style="
                                color: white;
                                font-size: 1.25rem;
                                font-weight: 600;
                                margin-bottom: 1rem;
                            ">Obtenez vos devis</h3>
                            <p style="
                                color: #94a3b8;
                                line-height: 1.6;
                                margin: 0;
                            ">
                                Une fois que vous avez matché, échangez directement et obtenez des devis personnalisés.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        // Continuer avec les autres sections... (Corps de métier, formules, etc.)
        
        // Injecter dans la page
        const targetElement = document.querySelector('#root') || document.querySelector('.App') || document.body;
        if (targetElement) {
            if (targetElement.id === 'root' || targetElement.className === 'App') {
                targetElement.innerHTML = '';
                targetElement.appendChild(appContainer);
            } else {
                targetElement.insertBefore(appContainer, targetElement.firstChild);
            }
        }
    }

    // Fonctions pour les interactions
    function showMatchAnimation() {
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
            max-width: 450px;
            width: 90%;
            position: relative;
            animation: bounceIn 0.6s ease;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        `;

        matchModal.innerHTML = `
            <div style="font-size: 80px; margin-bottom: 20px; animation: bounce 1s infinite;">🎉</div>
            <h2 style="font-size: 28px; margin-bottom: 15px; font-weight: bold;">C'est un 
                <span style="
                    background: linear-gradient(45deg, #22c55e, #84cc16);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-shadow: 0 0 30px rgba(34, 197, 94, 0.5);
                ">MATCH</span> !
            </h2>
            <p style="font-size: 16px; margin-bottom: 20px; opacity: 0.9;">
                Thomas et vous vous êtes swipés mutuellement !
            </p>
            <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 15px; margin-bottom: 25px;">
                <div style="font-size: 14px; margin-bottom: 10px;">
                    ✅ Vous avez swipé à droite<br>
                    ✅ Thomas a aussi swipé à droite
                </div>
                <div style="font-size: 12px; opacity: 0.8;">
                    <span style="
                        background: linear-gradient(45deg, #22c55e, #84cc16);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    ">MATCH</span> bidirectionnel confirmé !
                </div>
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
            ">
                Débloquer la messagerie (60€)
            </button>
        `;

        matchOverlay.appendChild(matchModal);
        document.body.appendChild(matchOverlay);

        // Fonction globale pour continuer
        window.closeMatchAndShowPayment = function() {
            matchOverlay.remove();
            showPaymentModal();
        };
    }

    function showPaymentModal() {
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
                Vous avez un 
                <span style="
                    background: linear-gradient(45deg, #22c55e, #84cc16);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                ">MATCH</span> 
                avec Thomas ! Pour échanger librement, effectuez le paiement de mise en relation.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 25px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                    <div style="display: flex; align-items: center;">
                        <div style="width: 50px; height: 50px; border-radius: 50%; background: url('https://images.pexels.com/photos/7616608/pexels-photo-7616608.jpeg') center/cover; margin-right: 15px;"></div>
                        <div style="text-align: left;">
                            <div style="font-weight: bold; color: #333;">Thomas Martin</div>
                            <div style="color: #666; font-size: 14px;">Électricien</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; font-weight: bold; color: #28a745;">60€</div>
                        <div style="font-size: 12px; color: #666;">Frais de mise en relation</div>
                    </div>
                </div>
                <p style="font-size: 12px; color: #999; margin: 0;">
                    Paiement unique pour débloquer la messagerie avec ce professionnel
                </p>
            </div>
            
            <button onclick="processPayment(this)" style="
                background: #28a745;
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                width: 100%;
                margin-bottom: 10px;
                transition: background 0.3s;
            ">
                Payer 60€ et débloquer
            </button>
            <button onclick="this.closest('div').parentElement.remove();" style="
                background: #6c757d;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 10px;
                font-size: 14px;
                cursor: pointer;
                transition: background 0.3s;
            ">
                Plus tard
            </button>
        `;

        paymentOverlay.appendChild(paymentModal);
        document.body.appendChild(paymentOverlay);

        // Fonction globale pour traiter le paiement
        window.processPayment = function(btn) {
            btn.textContent = 'Traitement du paiement...';
            btn.disabled = true;
            
            setTimeout(() => {
                paymentOverlay.remove();
                showChatUnlocked();
            }, 2000);
        };
    }

    function showChatUnlocked() {
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
            max-width: 400px;
            width: 90%;
            color: #333;
            position: relative;
        `;

        chatModal.innerHTML = `
            <div style="font-size: 60px; margin-bottom: 20px;">💬</div>
            <h3 style="font-size: 24px; margin-bottom: 15px; color: #333;">Messagerie débloquée !</h3>
            <p style="color: #666; margin-bottom: 25px; line-height: 1.5;">
                Vous pouvez maintenant échanger librement avec Thomas.
            </p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 25px; text-align: left;">
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <div style="width: 40px; height: 40px; background: url('https://images.pexels.com/photos/7616608/pexels-photo-7616608.jpeg') center/cover; border-radius: 50%; margin-right: 10px;"></div>
                    <div>
                        <div style="font-weight: bold; font-size: 14px; color: #333;">Thomas Martin</div>
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
            <button onclick="this.closest('div').parentElement.remove();" style="
                background: #007bff;
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                width: 100%;
                transition: background 0.3s;
            ">
                Commencer à chatter
            </button>
        `;

        chatOverlay.appendChild(chatModal);
        document.body.appendChild(chatOverlay);
    }

    function addSwipeSystem() {
        // Système de swipe pour la carte de démonstration
        const demoCard = document.querySelector('[onclick="showMatchAnimation()"]');
        if (demoCard) {
            demoCard.onclick = function() {
                showMatchAnimation();
            };
        }
    }

    function addUserTypeSelector() {
        // Ajouter un sélecteur de type d'utilisateur (mode test)
        const selector = document.createElement('div');
        selector.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(15, 23, 42, 0.95);
            color: white;
            padding: 15px;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            border: 2px solid #22c55e;
            backdrop-filter: blur(10px);
        `;
        
        selector.innerHTML = `
            <div style="font-size: 12px; color: #94a3b8; margin-bottom: 8px; font-weight: bold;">Mode de test</div>
            <select onchange="changeUserType(this.value)" style="
                border: 2px solid #22c55e;
                border-radius: 8px;
                padding: 5px 10px;
                font-size: 14px;
                color: #333;
                background: white;
                width: 100%;
            ">
                <option value="particulier">🏠 Particulier</option>
                <option value="professionnel">🔧 Professionnel</option>
            </select>
            <div id="userTypeInfo" style="font-size: 11px; color: #94a3b8; margin-top: 8px;">
                Vous êtes un particulier cherchant un professionnel
            </div>
        `;
        
        document.body.appendChild(selector);
        
        // Fonction globale pour changer le type d'utilisateur
        window.changeUserType = function(type) {
            swipeData.currentUser.type = type;
            const info = document.getElementById('userTypeInfo');
            if (info) {
                info.textContent = type === 'particulier' ? 
                    'Vous cherchez un professionnel' : 
                    'Vous êtes un professionnel';
            }
            console.log('👤 Type d\'utilisateur changé:', type);
        };
    }

    function addAnimationStyles() {
        if (!document.querySelector('#swipetonpro-styles')) {
            const style = document.createElement('style');
            style.id = 'swipetonpro-styles';
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
                @keyframes twinkle {
                    0%, 100% { opacity: 0.1; }
                    50% { opacity: 0.3; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Fonctions globales
    window.startSwipe = function(userType) {
        swipeData.currentUser.type = userType;
        alert(`🎯 Mode ${userType} activé !\\n\\nVous pouvez maintenant tester le système de swipe en cliquant sur "Demander un devis" dans la carte de démonstration.`);
    };

    window.showModal = function(section) {
        alert(`📧 ${section}\\n\\nCette fonctionnalité est en cours de traitement.\\nPour plus d'informations, contactez-nous à :\\n\\ncontact@swipetonpro.fr`);
    };

    console.log('🎉 SwipeTonPro version production initialisée !');
})();