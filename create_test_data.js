// Script pour créer des données de test pour Swipe Ton Pro
console.log('🚀 Création des données de test...');

// Supprimer les anciennes données
localStorage.clear();

// Créer des utilisateurs de test
const testUsers = [
  // PARTICULIERS
  {
    id: 'user1',
    type: 'particulier',
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie.dupont@test.fr',
    password: 'test123',
    phone: '0123456789',
    address: '123 Rue de la Paix, Paris',
    profileImage: null,
    bio: 'Je cherche un électricien pour refaire mon installation',
    status: 'active'
  },
  {
    id: 'user2', 
    type: 'particulier',
    firstName: 'Pierre',
    lastName: 'Martin',
    email: 'pierre.martin@test.fr',
    password: 'test123',
    phone: '0123456790',
    address: '456 Avenue des Champs, Lyon',
    profileImage: null,
    bio: 'Besoin d\'un plombier pour ma cuisine',
    status: 'active'
  },
  {
    id: 'user3',
    type: 'particulier', 
    firstName: 'Sophie',
    lastName: 'Bernard',
    email: 'sophie.bernard@test.fr',
    password: 'test123',
    phone: '0123456791',
    address: '789 Boulevard Saint-Michel, Marseille',
    profileImage: null,
    bio: 'Recherche un menuisier pour des étagères',
    status: 'active'
  },

  // PROFESSIONNELS
  {
    id: 'pro1',
    type: 'professionnel',
    firstName: 'Thomas',
    lastName: 'Leblanc',
    email: 'thomas.leblanc@test.fr',
    password: 'test123',
    phone: '0123456792',
    address: '321 Rue du Commerce, Paris',
    profileImage: null,
    bio: 'Électricien professionnel avec 10 ans d\'expérience',
    profession: 'Électricien',
    experience: '10 ans',
    certifications: ['Qualification QUALIFELEC'],
    rating: 4.8,
    reviewsCount: 127,
    status: 'active',
    packType: 'pro-premium'
  },
  {
    id: 'pro2',
    type: 'professionnel',
    firstName: 'Nicolas',
    lastName: 'Moreau',
    email: 'nicolas.moreau@test.fr',
    password: 'test123',
    phone: '0123456793',
    address: '654 Avenue Victor Hugo, Lyon',
    profileImage: null,
    bio: 'Plombier chauffagiste, interventions rapides',
    profession: 'Plombier',
    experience: '8 ans',
    certifications: ['PGN', 'RGE'],
    rating: 4.9,
    reviewsCount: 98,
    status: 'active',
    packType: 'pro-standard'
  },
  {
    id: 'pro3',
    type: 'professionnel',
    firstName: 'Antoine',
    lastName: 'Rousseau',
    email: 'antoine.rousseau@test.fr',
    password: 'test123',
    phone: '0123456794',
    address: '987 Place de la République, Marseille',
    profileImage: null,
    bio: 'Menuisier ébéniste, créations sur mesure',
    profession: 'Menuisier',
    experience: '12 ans',
    certifications: ['CAP Menuisier', 'Brevet Professionnel'],
    rating: 5.0,
    reviewsCount: 156,
    status: 'active',
    packType: 'pro-premium'
  }
];

// Créer des projets de test
const testProjects = [
  {
    id: 'project1',
    userId: 'user1',
    userName: 'Marie Dupont',
    title: 'Installation électrique complète',
    description: 'Refaire toute l\'installation électrique d\'un appartement de 70m²',
    category: 'Électricité',
    budget: '2000-3000€',
    deadline: '2 semaines',
    location: 'Paris 15ème',
    status: 'open',
    timestamp: new Date().toISOString()
  },
  {
    id: 'project2',
    userId: 'user2',
    userName: 'Pierre Martin',
    title: 'Rénovation cuisine - Plomberie',
    description: 'Installation nouvelle cuisine avec raccordements eau et évacuation',
    category: 'Plomberie',
    budget: '1500-2500€',
    deadline: '3 semaines',
    location: 'Lyon 6ème',
    status: 'open',
    timestamp: new Date().toISOString()
  },
  {
    id: 'project3',
    userId: 'user3',
    userName: 'Sophie Bernard',
    title: 'Étagères sur mesure',
    description: 'Création d\'étagères encastrées dans le salon, bois massif',
    category: 'Menuiserie',
    budget: '800-1200€',
    deadline: '1 mois',
    location: 'Marseille 2ème',
    status: 'open',
    timestamp: new Date().toISOString()
  }
];

// Sauvegarder dans localStorage
localStorage.setItem('swipe_ton_pro_all_users', JSON.stringify(testUsers));
localStorage.setItem('swipe_ton_pro_projects', JSON.stringify(testProjects));

// Initialiser les autres données vides
localStorage.setItem('swipe_ton_pro_likes', JSON.stringify([]));
localStorage.setItem('swipe_ton_pro_matches', JSON.stringify([]));
localStorage.setItem('swipe_ton_pro_requests', JSON.stringify([]));

console.log('✅ Données de test créées !');
console.log('👥 Utilisateurs:', testUsers.length);
console.log('📋 Projets:', testProjects.length);
console.log('');
console.log('🔑 COMPTES DE TEST :');
console.log('');
console.log('PARTICULIERS :');
console.log('• marie.dupont@test.fr / test123');
console.log('• pierre.martin@test.fr / test123'); 
console.log('• sophie.bernard@test.fr / test123');
console.log('');
console.log('PROFESSIONNELS :');
console.log('• thomas.leblanc@test.fr / test123 (Électricien)');
console.log('• nicolas.moreau@test.fr / test123 (Plombier)');
console.log('• antoine.rousseau@test.fr / test123 (Menuisier)');