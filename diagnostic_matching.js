// Diagnostic du système de matching - Swipe Ton Pro
console.log('🔍 DIAGNOSTIC DU SYSTÈME DE MATCHING');
console.log('=====================================');

// Récupérer toutes les données
const allUsers = JSON.parse(localStorage.getItem('swipe_ton_pro_all_users') || '[]');
const allProjects = JSON.parse(localStorage.getItem('swipe_ton_pro_projects') || '[]');
const allLikes = JSON.parse(localStorage.getItem('swipe_ton_pro_likes') || '[]');
const allMatches = JSON.parse(localStorage.getItem('swipe_ton_pro_matches') || '[]');

console.log('📊 STATISTIQUES GÉNÉRALES:');
console.log(`• ${allUsers.length} utilisateur(s) total(aux)`);
console.log(`• ${allProjects.length} projet(s) créé(s)`);
console.log(`• ${allLikes.length} like(s) enregistré(s)`);
console.log(`• ${allMatches.length} match(s) réalisé(s)`);
console.log('');

// Analyser les utilisateurs
console.log('👥 ANALYSE DES UTILISATEURS:');
const particuliers = allUsers.filter(u => u.type === 'particulier');
const professionnels = allUsers.filter(u => u.type === 'professionnel');
const prosActifs = professionnels.filter(p => p.status === 'active');
const prosPending = professionnels.filter(p => p.status === 'pending');

console.log(`• ${particuliers.length} particulier(s):`);
particuliers.forEach(p => {
  console.log(`  - ${p.firstName} ${p.lastName} (${p.email}) - Status: ${p.status}`);
});

console.log(`• ${professionnels.length} professionnel(s):`);
professionnels.forEach(p => {
  console.log(`  - ${p.firstName} ${p.lastName} (${p.email}) - ${p.specialty || p.specialties?.join(', ') || 'Pas de spécialité'} - Status: ${p.status}`);
});

console.log('');
console.log('⚠️  PROBLÈMES DÉTECTÉS:');

// Problème 1: Professionnels pas actifs
if (prosPending.length > 0) {
  console.log(`❌ ${prosPending.length} professionnel(s) avec status "pending" ne peuvent pas être vus par les particuliers`);
  console.log('   Solution: Activez-les manuellement ou terminez leur validation');
}

// Problème 2: Pas de projets
if (allProjects.length === 0) {
  console.log('❌ Aucun projet créé - les professionnels n\'ont rien à swiper');
  console.log('   Solution: Créez des projets depuis un compte particulier');
}

// Problème 3: Projets avec mauvais status
const projetsOuverts = allProjects.filter(p => p.status === 'open');
if (allProjects.length > 0 && projetsOuverts.length === 0) {
  console.log('❌ Aucun projet avec status "open" - ils ne seront pas visibles');
}

console.log('');
console.log('🔧 SOLUTIONS RAPIDES:');
console.log('');

// Solution 1: Activer tous les professionnels
console.log('1️⃣ ACTIVER TOUS LES PROFESSIONNELS:');
console.log('localStorage.setItem("swipe_ton_pro_all_users", JSON.stringify(' + 
  JSON.stringify(allUsers.map(u => u.type === 'professionnel' ? {...u, status: 'active'} : u)) + '));');
console.log('');

// Solution 2: Créer des projets de test
if (allProjects.length === 0) {
  const projetsTest = [
    {
      id: 'test_project_1',
      userId: particuliers[0]?.id || 'user1',
      userName: particuliers[0]?.firstName + ' ' + particuliers[0]?.lastName || 'Marie Dupont',
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
      id: 'test_project_2', 
      userId: particuliers[1]?.id || 'user2',
      userName: particuliers[1]?.firstName + ' ' + particuliers[1]?.lastName || 'Pierre Martin',
      title: 'Rénovation cuisine - Plomberie',
      description: 'Installation nouvelle cuisine avec raccordements eau et évacuation',
      category: 'Plomberie',
      budget: '1500-2500€',
      deadline: '3 semaines',
      location: 'Lyon 6ème',
      status: 'open',
      timestamp: new Date().toISOString()
    }
  ];
  
  console.log('2️⃣ CRÉER DES PROJETS DE TEST:');
  console.log('localStorage.setItem("swipe_ton_pro_projects", JSON.stringify(' + JSON.stringify(projetsTest) + '));');
  console.log('');
}

console.log('3️⃣ VIDER LES LIKES ET MATCHES POUR RECOMMENCER:');
console.log('localStorage.setItem("swipe_ton_pro_likes", "[]");');
console.log('localStorage.setItem("swipe_ton_pro_matches", "[]");');
console.log('');

console.log('🎯 COMMENT TESTER LE MATCHING:');
console.log('1. Connectez-vous comme PARTICULIER');
console.log('2. Allez dans "Swiper" et swipez HAUT sur un professionnel');
console.log('3. Déconnectez-vous et connectez-vous comme ce PROFESSIONNEL');
console.log('4. Allez dans "Swiper" et swipez HAUT sur le projet du particulier');
console.log('5. 💥 BOOM! Animation de match!');
console.log('');

console.log('📱 COMPTES DE TEST RAPIDES:');
if (allUsers.length > 0) {
  console.log('Particuliers:');
  particuliers.forEach(p => console.log(`• ${p.email} / ${p.password || 'test123'}`));
  console.log('Professionnels:');
  professionnels.forEach(p => console.log(`• ${p.email} / ${p.password || 'test123'} (${p.specialty || p.specialties?.join(', ')})`));
} else {
  console.log('Aucun compte trouvé - utilisez les comptes de test créés plus tôt');
}

console.log('');
console.log('🚀 Une fois ces corrections appliquées, le matching devrait fonctionner!');