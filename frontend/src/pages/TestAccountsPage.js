import React from 'react';
import { Link } from 'react-router-dom';

const TestAccountsPage = () => {
  const accounts = [
    {
      type: 'Admin',
      email: 'admin@swipetonpro.fr',
      password: 'admin123',
      description: 'Accès complet, validation des profils artisans',
      color: 'from-red-500 to-red-600'
    },
    {
      type: 'Particulier',
      email: 'part1@gmail.com',
      password: 'pat1pat1',
      description: 'Marie Dupont - Particulier avec projets',
      color: 'from-blue-500 to-blue-600'
    },
    {
      type: 'Particulier',
      email: 'part2@gmail.com',
      password: 'pat2pat2',
      description: 'Pierre Martin - Particulier avec projets',
      color: 'from-blue-500 to-blue-600'
    },
    {
      type: 'Particulier',
      email: 'part3@gmail.com',
      password: 'pat3pat3',
      description: 'Sophie Bernard - Particulier avec projets',
      color: 'from-blue-500 to-blue-600'
    },
    {
      type: 'Artisan Validé',
      email: 'art1@gmail.com',
      password: 'art1art1',
      description: 'Jean - Électricien validé avec crédits',
      color: 'from-green-500 to-green-600'
    },
    {
      type: 'Artisan Validé',
      email: 'art2@gmail.com',
      password: 'art2art2',
      description: 'Michel - Menuisier validé avec crédits',
      color: 'from-green-500 to-green-600'
    },
    {
      type: 'Artisan Validé',
      email: 'art3@gmail.com',
      password: 'art3art3',
      description: 'François - Chauffagiste validé avec crédits',
      color: 'from-green-500 to-green-600'
    },
    {
      type: 'Artisan En Attente',
      email: 'art4@gmail.com',
      password: 'art4art4',
      description: 'Antoine - Carreleur en attente de validation',
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Comptes de Test</h1>
          <p className="text-gray-300 text-lg">
            Utilisez ces comptes pour tester toutes les fonctionnalités de SwipeTonPro
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account, index) => (
            <div key={index} className={`bg-gradient-to-br ${account.color} rounded-lg p-6 text-white`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{account.type}</h3>
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-sm opacity-75">Email:</p>
                  <p className="font-mono text-sm bg-white/20 px-2 py-1 rounded">
                    {account.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-75">Mot de passe:</p>
                  <p className="font-mono text-sm bg-white/20 px-2 py-1 rounded">
                    {account.password}
                  </p>
                </div>
              </div>

              <p className="text-sm opacity-90 mb-4">{account.description}</p>
              
              <Link
                to="/login"
                className="block w-full bg-white/20 text-center py-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                Se connecter
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-slate-800/50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Guide de test</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">🔍 Test Particulier</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Connectez-vous avec part1@gmail.com</li>
                <li>• Allez sur "Swiper" pour voir les artisans</li>
                <li>• Testez les matches et projets</li>
                <li>• Vérifiez la confidentialité des données</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">🔨 Test Artisan</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Connectez-vous avec art1@gmail.com</li>
                <li>• Vérifiez vos crédits dans le dashboard</li>
                <li>• Testez les swipes sur projets</li>
                <li>• Créez des demandes de devis (60€)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">⚙️ Test Admin</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Connectez-vous avec admin@swipetonpro.fr</li>
                <li>• Validez les profils artisans en attente</li>
                <li>• Gérez les documents uploadés</li>
                <li>• Consultez les statistiques</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">📝 Test Validation</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Connectez-vous avec art4@gmail.com</li>
                <li>• Profil en mode "fantôme"</li>
                <li>• Uploadez des documents</li>
                <li>• Attendez validation admin</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            💡 Conseil: Ouvrez plusieurs onglets pour tester les interactions entre différents types d'utilisateurs
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestAccountsPage;