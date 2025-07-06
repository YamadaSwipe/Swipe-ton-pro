import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Star, 
  Users, 
  Shield, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Search,
  Heart,
  X,
  Menu,
  ChevronDown,
  Upload,
  Eye,
  EyeOff,
  FileText,
  Camera,
  Settings,
  LogOut,
  MessageCircle,
  TrendingUp,
  Award,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign
} from "lucide-react";

// Header Component
const Header = ({ onShowAuth, setAuthType }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-white">Swipe Ton Pro</span>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Accueil</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
              Projets <ChevronDown className="w-4 h-4 ml-1" />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
              Artisans <ChevronDown className="w-4 h-4 ml-1" />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => {
                setAuthType('login');
                onShowAuth(true);
              }}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Se connecter
            </button>
            <button 
              onClick={() => {
                setAuthType('particulier');
                onShowAuth(true);
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Inscription
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Hero Component
const Hero = ({ onShowAuth, setAuthType }) => {
  return (
    <section className="pt-20 pb-32 bg-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-blue-600"></div>
        <div className="absolute inset-0 bg-slate-800 opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Notification Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-center"
        >
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-full flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Nouveau : Interface Swipe révolutionnaire !</span>
          </div>
        </motion.div>

        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Votre prochain match<br />
            <span className="text-emerald-400">professionnel</span> est un swipe.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Que vous soyez un porteur de projet cherchant le talent idéal ou un professionnel en 
            quête de nouvelles opportunités, notre plateforme vous connecte instantanément.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12"
          >
            <button 
              onClick={() => {
                setAuthType('particulier');
                onShowAuth(true);
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center"
            >
              Commencer gratuitement
              <span className="ml-2 text-sm font-normal">(Particuliers)</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button 
              onClick={() => {
                setAuthType('professionnel');
                onShowAuth(true);
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-lg transition-colors flex items-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Je suis un professionnel
            </button>
          </motion.div>

          {/* Professional Card Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-sm mx-auto"
          >
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1573496130103-a442a3754d0e"
                  alt="Thomas, Électricien" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">Match parfait !</h3>
              <p className="text-emerald-400 mb-1">Thomas, Électricien</p>
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="text-gray-400 ml-2">5.0 (127 avis)</span>
              </div>
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition-colors">
                Demander un devis
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Auth Modal Component
const AuthModal = ({ isOpen, onClose, authType, onAuth }) => {
  const [currentAuthType, setCurrentAuthType] = useState(authType);
  const [isLogin, setIsLogin] = useState(authType === 'login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    company: '',
    siret: '',
    specialty: '',
    experience: '',
    location: ''
  });
  const [documents, setDocuments] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedPack, setSelectedPack] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const packs = [
    {
      id: 'starter',
      name: 'Pro Starter',
      price: 49,
      period: '/mois',
      features: [
        'Profil vérifié',
        '30 demandes/mois',
        'Facturation devis 30€',
        'Analytics basiques',
        'Support email'
      ]
    },
    {
      id: 'business',
      name: 'Pro Business',
      price: 99,
      period: '/mois',
      popular: true,
      features: [
        'Profil premium',
        '100 demandes/mois',
        'Facturation devis 80€',
        'Analytics avancées',
        'Support chat',
        'Badge "Pro Business"'
      ]
    },
    {
      id: 'premium',
      name: 'Pro Premium',
      price: 149,
      period: '/mois',
      features: [
        'Profil premium+',
        '250 demandes/mois',
        'Facturation devis 80€',
        'Projets complexes',
        'Support chat',
        'Option "être rappelé"',
        'Badge "Expert"'
      ]
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Check for admin login
      if (formData.email === 'admin@swipetonpro.fr' && formData.password === 'admin123') {
        const adminData = {
          id: 'admin',
          email: 'admin@swipetonpro.fr',
          type: 'admin',
          firstName: 'Admin',
          lastName: 'SwipeTonPro',
          status: 'active',
          role: 'administrator'
        };
        onAuth(adminData);
        return;
      }
      
      // Check existing users
      const allUsers = JSON.parse(localStorage.getItem('swipe_ton_pro_all_users') || '[]');
      const existingUser = allUsers.find(u => u.email === formData.email);
      
      if (existingUser) {
        // Verify password (simple check for demo)
        if (existingUser.password === formData.password) {
          onAuth(existingUser);
        } else {
          alert('Mot de passe incorrect');
        }
      } else {
        alert('Utilisateur non trouvé. Veuillez vous inscrire.');
      }
    } else {
      // Validation des champs
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }
      
      if (formData.password.length < 6) {
        alert('Le mot de passe doit contenir au moins 6 caractères');
        return;
      }
      
      // Check if email already exists
      const allUsers = JSON.parse(localStorage.getItem('swipe_ton_pro_all_users') || '[]');
      const emailExists = allUsers.find(u => u.email === formData.email);
      
      if (emailExists) {
        alert('Cette adresse email est déjà utilisée');
        return;
      }
      
      // For professionals, require pack selection and payment
      if (currentAuthType === 'professionnel') {
        if (!selectedPack) {
          alert('Veuillez sélectionner un pack');
          return;
        }
        
        if (!formData.company || !formData.siret || !formData.specialty) {
          alert('Veuillez remplir toutes les informations professionnelles');
          return;
        }
        
        // Show payment modal
        setShowPayment(true);
        return;
      }
      
      // Create new user
      const userData = {
        id: Date.now(),
        ...formData,
        type: currentAuthType,
        status: currentAuthType === 'professionnel' ? 'pending' : 'active',
        documents: documents,
        profileImage: profileImage,
        selectedPack: selectedPack,
        createdAt: new Date().toISOString()
      };
      
      // Save user
      const updatedUsers = [...allUsers, userData];
      localStorage.setItem('swipe_ton_pro_all_users', JSON.stringify(updatedUsers));
      
      onAuth(userData);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(prev => [...prev, ...files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      id: Date.now() + Math.random()
    }))]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePayment = (paymentData) => {
    // Simulate payment processing
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        ...formData,
        type: currentAuthType,
        status: 'pending', // Professional needs validation
        documents: documents,
        profileImage: profileImage,
        selectedPack: selectedPack,
        paymentData: paymentData,
        createdAt: new Date().toISOString()
      };
      
      // Save user
      const allUsers = JSON.parse(localStorage.getItem('swipe_ton_pro_all_users') || '[]');
      const updatedUsers = [...allUsers, userData];
      localStorage.setItem('swipe_ton_pro_all_users', JSON.stringify(updatedUsers));
      
      setShowPayment(false);
      onAuth(userData);
    }, 2000);
  };

  if (showPayment) {
    return <PaymentModal 
      pack={selectedPack} 
      user={formData}
      onPayment={handlePayment}
      onCancel={() => setShowPayment(false)}
    />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? 'Connexion' : `Inscription ${currentAuthType === 'particulier' ? 'Particulier' : 'Professionnel'}`}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isLogin && (
          <div className="flex mb-6 bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setCurrentAuthType('particulier')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                currentAuthType === 'particulier' ? 'bg-yellow-500 text-white' : 'text-gray-300'
              }`}
            >
              Particulier
            </button>
            <button
              onClick={() => setCurrentAuthType('professionnel')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                currentAuthType === 'professionnel' ? 'bg-emerald-500 text-white' : 'text-gray-300'
              }`}
            >
              Professionnel
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo de profil */}
          {!isLogin && (
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-700 mx-auto mb-4 flex items-center justify-center cursor-pointer border-2 border-dashed border-slate-600 hover:border-emerald-500 transition-colors"
                     onClick={() => imageInputRef.current?.click()}>
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">Photo</p>
                    </div>
                  )}
                </div>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <p className="text-gray-400 text-sm">Cliquez pour ajouter une photo de profil</p>
            </div>
          )}

          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Prénom"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Nom"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {!isLogin && currentAuthType === 'professionnel' && (
            <>
              <input
                type="text"
                placeholder="Téléphone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              
              <input
                type="text"
                placeholder="Entreprise"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />

              <input
                type="text"
                placeholder="SIRET"
                value={formData.siret}
                onChange={(e) => setFormData({...formData, siret: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />

              <select
                value={formData.specialty}
                onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">Sélectionner votre spécialité</option>
                <option value="electricien">Électricien</option>
                <option value="plombier">Plombier</option>
                <option value="menuisier">Menuisier</option>
                <option value="peintre">Peintre</option>
                <option value="macon">Maçon</option>
                <option value="chauffagiste">Chauffagiste</option>
                <option value="carreleur">Carreleur</option>
              </select>

              <input
                type="text"
                placeholder="Localisation"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />

              <div className="space-y-4">
                <label className="block text-white text-sm font-medium">
                  Documents requis (Kbis, assurance, certifications)
                </label>
                
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-500 transition-colors"
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">Cliquez pour ajouter des documents</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (max 5MB)</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {documents.length > 0 && (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between bg-slate-700 p-3 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-emerald-500 mr-3" />
                          <span className="text-white text-sm">{doc.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDocuments(docs => docs.filter(d => d.id !== doc.id))}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {currentAuthType === 'professionnel' && (
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-yellow-400 font-medium">Validation en cours</p>
                        <p className="text-yellow-300 mt-1">
                          Votre profil sera activé sous 24-48h après vérification des documents. 
                          En attendant, vous pourrez swiper en mode fantôme.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              currentAuthType === 'professionnel' 
                ? 'bg-emerald-500 hover:bg-emerald-600' 
                : 'bg-yellow-500 hover:bg-yellow-600'
            } text-white`}
          >
            {isLogin ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-400 hover:text-emerald-300 text-sm"
          >
            {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const isProfessional = user.type === 'professionnel';
  const isAdmin = user.type === 'admin';
  const isPending = user.status === 'pending';
  const isGhost = isPending;

  // Admin tabs
  const adminTabs = [
    { id: 'overview', label: 'Dashboard Admin', icon: TrendingUp },
    { id: 'users', label: 'Gestion Utilisateurs', icon: Users },
    { id: 'pending', label: 'Validations', icon: AlertCircle },
    { id: 'projects', label: 'Tous les Projets', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Paramètres Site', icon: Settings }
  ];

  const professionalTabs = [
    { id: 'overview', label: 'Tableau de bord', icon: TrendingUp },
    { id: 'profile', label: 'Mon profil', icon: Users },
    { id: 'documents', label: 'Mes documents', icon: FileText },
    { id: 'projects', label: 'Projets', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'swipe', label: 'Swiper', icon: Heart },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const particularTabs = [
    { id: 'overview', label: 'Tableau de bord', icon: TrendingUp },
    { id: 'profile', label: 'Mon profil', icon: Users },
    { id: 'projects', label: 'Mes projets', icon: FileText },
    { id: 'swipe', label: 'Swiper', icon: Heart },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const tabs = isAdmin ? adminTabs : (isProfessional ? professionalTabs : particularTabs);

  if (activeTab === 'swipe' && !isAdmin) {
    return <SwipeInterface user={user} onBack={() => setActiveTab('overview')} />;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-lg font-bold text-white">Swipe Ton Pro</span>
              {isAdmin && (
                <span className="ml-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  ADMIN
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {isPending && !isAdmin && (
                <div className="flex items-center bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Mode fantôme</span>
                </div>
              )}
              
              {!isAdmin && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab('swipe')}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Swiper
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Accueil
                  </button>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-gray-400 text-xs">
                    {isAdmin ? 'Administrateur' : (isProfessional ? user.specialty || 'Professionnel' : 'Particulier')}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  className="text-gray-400 hover:text-white p-2"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 mr-8">
            <nav className="space-y-2">
              {/* Navigation rapide */}
              {!isAdmin && (
                <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <h4 className="text-white font-medium mb-3">Navigation rapide</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab('swipe')}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Aller Swiper
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Retour Accueil
                    </button>
                  </div>
                </div>
              )}
              
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? (isAdmin ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white')
                        : 'text-gray-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {isAdmin && activeTab === 'overview' && <AdminOverview />}
            {isAdmin && activeTab === 'users' && <UserManagement />}
            {isAdmin && activeTab === 'pending' && <PendingValidations />}
            {isAdmin && activeTab === 'analytics' && <AdminAnalytics />}
            
            {!isAdmin && activeTab === 'overview' && (
              <DashboardOverview user={user} isPending={isPending} />
            )}
            {activeTab === 'profile' && (
              <ProfileManagement user={user} />
            )}
            {activeTab === 'documents' && isProfessional && (
              <DocumentsManagement user={user} />
            )}
            {activeTab === 'projects' && (
              <ProjectsManagement user={user} isProfessional={isProfessional} />
            )}
            {activeTab === 'messages' && (
              <MessagesManagement user={user} />
            )}
            {activeTab === 'settings' && (
              <SettingsManagement user={user} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = ({ user, isPending }) => {
  const isProfessional = user.type === 'professionnel';

  const stats = isProfessional ? [
    { label: 'Projets vus', value: isPending ? '12 (fantôme)' : '45', icon: Eye },
    { label: 'Matches', value: isPending ? '0' : '8', icon: Heart },
    { label: 'Devis envoyés', value: isPending ? '0' : '23', icon: FileText },
    { label: 'Taux de réponse', value: isPending ? '0%' : '67%', icon: TrendingUp }
  ] : [
    { label: 'Projets créés', value: '3', icon: FileText },
    { label: 'Pros contactés', value: '12', icon: Users },
    { label: 'Devis reçus', value: '8', icon: MessageCircle },
    { label: 'Projets terminés', value: '1', icon: CheckCircle }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Bonjour {user.firstName} !
        </h1>
        <p className="text-gray-400">
          {isPending ? 
            'Votre profil est en cours de validation. Vous pouvez swiper en mode fantôme.' :
            'Voici un aperçu de votre activité.'
          }
        </p>
      </div>

      {isPending && (
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-yellow-400 mr-4 mt-1" />
            <div>
              <h3 className="text-yellow-400 font-semibold mb-2">Validation en cours</h3>
              <p className="text-yellow-300 mb-4">
                Nous vérifions vos documents. Votre profil sera activé sous 24-48h.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-yellow-200">En mode fantôme, vous pouvez :</p>
                <ul className="text-sm text-yellow-200 ml-4 space-y-1">
                  <li>• Voir les projets disponibles</li>
                  <li>• Swiper les projets (sans être visible)</li>
                  <li>• Préparer votre profil</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 text-emerald-400" />
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Activité récente</h3>
        <div className="space-y-4">
          {isPending ? (
            <p className="text-gray-400">Aucune activité en mode fantôme.</p>
          ) : (
            <>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white">Nouveau match avec Marie L.</p>
                  <p className="text-gray-400 text-sm">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white">Devis envoyé pour "Rénovation cuisine"</p>
                  <p className="text-gray-400 text-sm">Il y a 5 heures</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Documents Management Component (for professionals)
const DocumentsManagement = ({ user }) => {
  const [documents, setDocuments] = useState(user.documents || []);
  const [newDocuments, setNewDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const documentsToAdd = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      id: Date.now() + Math.random(),
      uploadDate: new Date().toISOString(),
      status: 'pending'
    }));
    
    setNewDocuments(prev => [...prev, ...documentsToAdd]);
  };

  const handleSaveDocuments = () => {
    setIsUploading(true);
    
    // Simuler l'upload
    setTimeout(() => {
      const allDocuments = [...documents, ...newDocuments];
      setDocuments(allDocuments);
      
      // Mettre à jour les données utilisateur
      const updatedUser = { ...user, documents: allDocuments };
      localStorage.setItem('swipe_ton_pro_user', JSON.stringify(updatedUser));
      
      // Mettre à jour dans la liste globale
      const allUsers = JSON.parse(localStorage.getItem('swipe_ton_pro_all_users') || '[]');
      const userIndex = allUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        allUsers[userIndex] = updatedUser;
        localStorage.setItem('swipe_ton_pro_all_users', JSON.stringify(allUsers));
      }
      
      setNewDocuments([]);
      setIsUploading(false);
    }, 2000);
  };

  const handleRemoveDocument = (docId, isNew = false) => {
    if (isNew) {
      setNewDocuments(prev => prev.filter(doc => doc.id !== docId));
    } else {
      if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
        const updatedDocuments = documents.filter(doc => doc.id !== docId);
        setDocuments(updatedDocuments);
        
        // Mettre à jour les données utilisateur
        const updatedUser = { ...user, documents: updatedDocuments };
        localStorage.setItem('swipe_ton_pro_user', JSON.stringify(updatedUser));
        
        // Mettre à jour dans la liste globale
        const allUsers = JSON.parse(localStorage.getItem('swipe_ton_pro_all_users') || '[]');
        const userIndex = allUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          allUsers[userIndex] = updatedUser;
          localStorage.setItem('swipe_ton_pro_all_users', JSON.stringify(allUsers));
        }
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-emerald-500/20 text-emerald-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Validé';
      case 'rejected': return 'Rejeté';
      case 'pending': return 'En attente';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Mes documents</h1>
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            user.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
            user.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            Profil: {user.status === 'active' ? 'Validé' : user.status === 'pending' ? 'En attente' : 'Rejeté'}
          </span>
        </div>
      </div>

      {/* Status Message */}
      <div className={`p-6 rounded-lg border ${
        user.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/30' :
        user.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/30' :
        'bg-red-500/10 border-red-500/30'
      }`}>
        <div className="flex items-start">
          {user.status === 'pending' && <AlertCircle className="w-6 h-6 text-yellow-400 mr-4 mt-1" />}
          {user.status === 'active' && <CheckCircle className="w-6 h-6 text-emerald-400 mr-4 mt-1" />}
          {user.status === 'rejected' && <X className="w-6 h-6 text-red-400 mr-4 mt-1" />}
          <div>
            <h3 className={`font-semibold mb-2 ${
              user.status === 'pending' ? 'text-yellow-400' :
              user.status === 'active' ? 'text-emerald-400' :
              'text-red-400'
            }`}>
              {user.status === 'pending' && 'Validation en cours'}
              {user.status === 'active' && 'Profil validé'}
              {user.status === 'rejected' && 'Profil rejeté'}
            </h3>
            <p className={`${
              user.status === 'pending' ? 'text-yellow-300' :
              user.status === 'active' ? 'text-emerald-300' :
              'text-red-300'
            }`}>
              {user.status === 'pending' && 'Vos documents sont en cours de vérification. Vous pouvez swiper en mode fantôme en attendant.'}
              {user.status === 'active' && 'Votre profil est validé ! Vous avez accès à toutes les fonctionnalités.'}
              {user.status === 'rejected' && 'Votre profil a été rejeté. Veuillez nous contacter ou télécharger de nouveaux documents.'}
            </p>
          </div>
        </div>
      </div>

      {/* Documents Required */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Documents requis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-700 p-4 rounded-lg">
            <FileText className="w-8 h-8 text-emerald-400 mb-2" />
            <h4 className="text-white font-medium">Kbis</h4>
            <p className="text-gray-400 text-sm">Extrait Kbis de moins de 3 mois</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <Shield className="w-8 h-8 text-blue-400 mb-2" />
            <h4 className="text-white font-medium">Assurance</h4>
            <p className="text-gray-400 text-sm">Attestation d'assurance responsabilité civile</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <Award className="w-8 h-8 text-purple-400 mb-2" />
            <h4 className="text-white font-medium">Certifications</h4>
            <p className="text-gray-400 text-sm">Certificats professionnels ou qualifications</p>
          </div>
        </div>
      </div>

      {/* Current Documents */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Documents actuels</h3>
        {documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-6 h-6 text-emerald-400 mr-4" />
                  <div>
                    <p className="text-white font-medium">{doc.name}</p>
                    <p className="text-gray-400 text-sm">
                      Téléchargé le {new Date(doc.uploadDate || Date.now()).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(doc.status || 'pending')}`}>
                    {getStatusText(doc.status || 'pending')}
                  </span>
                  <button
                    onClick={() => handleRemoveDocument(doc.id)}
                    className="text-red-400 hover:text-red-300 p-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Aucun document téléchargé.</p>
        )}
      </div>

      {/* Upload New Documents */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Ajouter des documents</h3>
        
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-500 transition-colors mb-6"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-white mb-2">Cliquez pour sélectionner des fichiers</p>
          <p className="text-gray-400 text-sm">PDF, JPG, PNG (max 5MB par fichier)</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* New Documents Preview */}
        {newDocuments.length > 0 && (
          <div className="space-y-4 mb-6">
            <h4 className="text-white font-medium">Nouveaux documents à télécharger :</h4>
            {newDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between bg-slate-700 p-4 rounded-lg border border-emerald-500/30">
                <div className="flex items-center">
                  <FileText className="w-6 h-6 text-emerald-400 mr-4" />
                  <div>
                    <p className="text-white font-medium">{doc.name}</p>
                    <p className="text-gray-400 text-sm">
                      {(doc.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveDocument(doc.id, true)}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            
            <div className="flex space-x-4">
              <button
                onClick={handleSaveDocuments}
                disabled={isUploading}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center ${
                  isUploading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-600'
                } text-white`}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Téléchargement...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Télécharger les documents
                  </>
                )}
              </button>
              <button
                onClick={() => setNewDocuments([])}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-blue-400 font-semibold mb-2">Besoin d'aide ?</h3>
        <p className="text-blue-300 text-sm mb-4">
          Si vous avez des questions sur les documents requis ou si votre profil a été rejeté, 
          n'hésitez pas à nous contacter.
        </p>
        <div className="flex space-x-4">
          <a 
            href="mailto:support@swipetonpro.fr"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            support@swipetonpro.fr
          </a>
          <a 
            href="mailto:contact@swipetonpro.fr"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            contact@swipetonpro.fr
          </a>
        </div>
      </div>
    </div>
  );
};
const ProfileManagement = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    company: user.company || '',
    specialty: user.specialty || '',
    location: user.location || '',
    bio: user.bio || '',
    profileImage: user.profileImage || null
  });
  const [profileImage, setProfileImage] = useState(user.profileImage || null);
  const imageInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setProfileImage(imageUrl);
        setProfileData(prev => ({...prev, profileImage: imageUrl}));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Mettre à jour les données utilisateur dans localStorage
    const updatedUser = { ...user, ...profileData, profileImage };
    localStorage.setItem('swipe_ton_pro_user', JSON.stringify(updatedUser));
    
    // Mettre à jour aussi dans la liste des utilisateurs
    const allUsers = JSON.parse(localStorage.getItem('swipe_ton_pro_all_users') || '[]');
    const userIndex = allUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      allUsers[userIndex] = updatedUser;
    } else {
      allUsers.push(updatedUser);
    }
    localStorage.setItem('swipe_ton_pro_all_users', JSON.stringify(allUsers));
    
    setIsEditing(false);
    
    // Recharger la page pour refléter les changements
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Mon profil</h1>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            isEditing 
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isEditing ? 'Sauvegarder' : 'Modifier le profil'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Photo de profil */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Photo de profil</h3>
          <div className="text-center">
            <div 
              className="w-32 h-32 rounded-full overflow-hidden bg-slate-700 mx-auto mb-4 flex items-center justify-center cursor-pointer border-2 border-dashed border-slate-600 hover:border-emerald-500 transition-colors"
              onClick={() => isEditing && imageInputRef.current?.click()}
            >
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Ajouter une photo</p>
                </div>
              )}
            </div>
            {isEditing && (
              <>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Changer la photo
                </button>
              </>
            )}
          </div>
        </div>

        {/* Informations personnelles */}
        <div className="lg:col-span-2 bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Informations personnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Prénom</label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => setProfileData(prev => ({...prev, firstName: e.target.value}))}
                className={`w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white ${
                  isEditing ? 'focus:outline-none focus:ring-2 focus:ring-emerald-500' : 'cursor-not-allowed'
                }`}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Nom</label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData(prev => ({...prev, lastName: e.target.value}))}
                className={`w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white ${
                  isEditing ? 'focus:outline-none focus:ring-2 focus:ring-emerald-500' : 'cursor-not-allowed'
                }`}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({...prev, email: e.target.value}))}
                className={`w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white ${
                  isEditing ? 'focus:outline-none focus:ring-2 focus:ring-emerald-500' : 'cursor-not-allowed'
                }`}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Téléphone</label>
              <input
                type="text"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({...prev, phone: e.target.value}))}
                className={`w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white ${
                  isEditing ? 'focus:outline-none focus:ring-2 focus:ring-emerald-500' : 'cursor-not-allowed'
                }`}
                readOnly={!isEditing}
              />
            </div>
            {user.type === 'professionnel' && (
              <>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Entreprise</label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData(prev => ({...prev, company: e.target.value}))}
                    className={`w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white ${
                      isEditing ? 'focus:outline-none focus:ring-2 focus:ring-emerald-500' : 'cursor-not-allowed'
                    }`}
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Spécialité</label>
                  <select
                    value={profileData.specialty}
                    onChange={(e) => setProfileData(prev => ({...prev, specialty: e.target.value}))}
                    className={`w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white ${
                      isEditing ? 'focus:outline-none focus:ring-2 focus:ring-emerald-500' : 'cursor-not-allowed'
                    }`}
                    disabled={!isEditing}
                  >
                    <option value="">Sélectionner une spécialité</option>
                    <option value="electricien">Électricien</option>
                    <option value="plombier">Plombier</option>
                    <option value="menuisier">Menuisier</option>
                    <option value="peintre">Peintre</option>
                    <option value="macon">Maçon</option>
                    <option value="chauffagiste">Chauffagiste</option>
                    <option value="carreleur">Carreleur</option>
                  </select>
                </div>
              </>
            )}
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-2">Localisation</label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => setProfileData(prev => ({...prev, location: e.target.value}))}
                className={`w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white ${
                  isEditing ? 'focus:outline-none focus:ring-2 focus:ring-emerald-500' : 'cursor-not-allowed'
                }`}
                readOnly={!isEditing}
              />
            </div>
            {user.type === 'particulier' && (
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-2">Présentation</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                  rows={4}
                  className={`w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white ${
                    isEditing ? 'focus:outline-none focus:ring-2 focus:ring-emerald-500' : 'cursor-not-allowed'
                  }`}
                  placeholder="Parlez-nous de vos projets, vos préférences, ce que vous recherchez..."
                  readOnly={!isEditing}
                />
              </div>
            )}
            {user.type === 'professionnel' && (
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-2">Présentation professionnelle</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                  rows={4}
                  className={`w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white ${
                    isEditing ? 'focus:outline-none focus:ring-2 focus:ring-emerald-500' : 'cursor-not-allowed'
                  }`}
                  placeholder="Décrivez vos compétences, votre expérience, vos spécialités, vos réalisations..."
                  readOnly={!isEditing}
                />
              </div>
            )}
          </div>
          
          {isEditing && (
            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleSave}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Sauvegarder les modifications
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Statut du profil */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Statut du profil</h3>
        <div className="flex items-center space-x-4">
          <div className={`w-4 h-4 rounded-full ${
            user.status === 'active' ? 'bg-emerald-500' : 
            user.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className="text-white">
            {user.status === 'active' ? 'Profil actif' : 
             user.status === 'pending' ? 'En cours de validation' : 'Profil suspendu'}
          </span>
          {user.status === 'pending' && (
            <span className="text-yellow-400 text-sm">
              (Validation sous 24-48h)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Projects Management Component
const ProjectsManagement = ({ user, isProfessional }) => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">
        {isProfessional ? 'Projets' : 'Mes projets'}
      </h1>
      
      <div className="text-gray-400">
        <p>Gestion des projets en cours de développement...</p>
      </div>
    </div>
  );
};

// Messages Management Component
const MessagesManagement = ({ user }) => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Messages</h1>
      
      <div className="text-gray-400">
        <p>Système de messagerie en cours de développement...</p>
      </div>
    </div>
  );
};

// Settings Management Component
const SettingsManagement = ({ user }) => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Paramètres</h1>
      
      <div className="text-gray-400">
        <p>Paramètres de compte en cours de développement...</p>
      </div>
    </div>
  );
};

// Swipe Interface Component
const SwipeInterface = ({ user, onBack }) => {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [projects] = useState([
    {
      id: 1,
      title: "Rénovation salle de bain",
      description: "Recherche plombier pour rénover entièrement une salle de bain de 8m²",
      budget: "3000-5000€",
      location: "Paris 15ème",
      client: "Marie L.",
      images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a"],
      category: "Plomberie",
      urgent: false
    },
    {
      id: 2,
      title: "Installation électrique",
      description: "Mise aux normes électriques maison 120m²",
      budget: "2000-3000€",
      location: "Lyon 3ème",
      client: "Jean P.",
      images: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e"],
      category: "Électricité",
      urgent: true
    },
    {
      id: 3,
      title: "Création cuisine sur mesure",
      description: "Conception et installation d'une cuisine moderne",
      budget: "8000-12000€",
      location: "Marseille 8ème",
      client: "Sophie R.",
      images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136"],
      category: "Menuiserie",
      urgent: false
    }
  ]);

  const isPending = user.status === 'pending';
  const currentProject = projects[currentProjectIndex];

  const handleSwipe = (direction) => {
    if (direction === 'right' && !isPending) {
      // Like - only allowed for validated profiles
      console.log('Liked project:', currentProject.title);
    }
    
    // Move to next project
    setCurrentProjectIndex((prev) => 
      prev < projects.length - 1 ? prev + 1 : 0
    );
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-white mr-4 flex items-center"
              >
                <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
                Retour Dashboard
              </button>
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-lg font-bold text-white">Swipe Ton Pro</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {isPending && (
                <div className="flex items-center bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="text-sm">Mode fantôme</span>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <span className="text-white text-sm">{user.firstName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Interface */}
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <div className="w-full max-w-md">
          {currentProject ? (
            <div className="bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
              {/* Project Image */}
              <div className="relative h-64">
                <img
                  src={currentProject.images[0]}
                  alt={currentProject.title}
                  className="w-full h-full object-cover"
                />
                {currentProject.urgent && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Urgent
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentProject.category}
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{currentProject.title}</h3>
                  <p className="text-gray-300 text-sm">{currentProject.description}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{currentProject.location}</span>
                  </div>
                  <div className="flex items-center text-emerald-400">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="text-sm font-semibold">{currentProject.budget}</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm">Client: {currentProject.client}</span>
                </div>

                {isPending && (
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
                    <p className="text-yellow-400 text-sm text-center">
                      Mode fantôme - Vous pouvez voir mais pas être vu
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0">
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleSwipe('left')}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Passer
                  </button>
                  <button
                    onClick={() => handleSwipe('right')}
                    disabled={isPending}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                      isPending 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    {isPending ? 'Fantôme' : 'Intéressé'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p>Plus de projets disponibles pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Keep existing components (HowItWorks, WhyChooseUs, etc.)
const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="w-12 h-12 text-emerald-500" />,
      title: "Décrivez votre projet",
      description: "Décrivez votre projet en quelques clics et laissez notre algorithme intelligent vous proposer les meilleurs profils."
    },
    {
      icon: <Heart className="w-12 h-12 text-emerald-500" />,
      title: "Swipez les profils",
      description: "Parcourez les profils de professionnels qualifiés et swipez vers la droite pour ceux qui vous intéressent."
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-emerald-500" />,
      title: "Obtenez vos devis",
      description: "Recevez rapidement des devis personnalisés et échangez directement avec les professionnels."
    }
  ];

  return (
    <section className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Comment ça marche ?</h2>
          <p className="text-xl text-gray-300">
            Seul 3 étapes simples, trouvez l'expert parfait pour votre projet
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-slate-900 p-8 rounded-2xl border border-slate-700 text-center hover:border-emerald-500 transition-colors"
            >
              <div className="flex justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
              <p className="text-gray-300">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Why Choose Us Component
const WhyChooseUs = () => {
  const features = [
    {
      icon: <Users className="w-12 h-12 text-blue-500" />,
      title: "Réseau d'experts",
      description: "Accédez à un réseau de professionnels vérifiés et qualifiés dans tous les domaines."
    },
    {
      icon: <Shield className="w-12 h-12 text-yellow-500" />,
      title: "Sécurité garantie",
      description: "Tous les échanges et devis passent par notre plateforme sécurisée. Protection mutuelle en cas de litige."
    },
    {
      icon: <Clock className="w-12 h-12 text-purple-500" />,
      title: "Gain de temps",
      description: "Trouvez rapidement le bon professionnel grâce à notre algorithme de matching intelligent."
    },
    {
      icon: <Star className="w-12 h-12 text-emerald-500" />,
      title: "Satisfaction client",
      description: "Plus de 95% de nos clients sont satisfaits de nos services et recommandent notre plateforme."
    }
  ];

  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Pourquoi choisir Swipe Ton Pro ?</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center hover:border-emerald-500 transition-colors"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Professional Categories Component
const ProfessionalCategories = () => {
  const categories = [
    {
      name: "Électricien",
      image: "https://images.pexels.com/photos/27928761/pexels-photo-27928761.jpeg",
      count: "250+ pros"
    },
    {
      name: "Plombier",
      image: "https://images.pexels.com/photos/8488035/pexels-photo-8488035.jpeg",
      count: "180+ pros"
    },
    {
      name: "Menuisier",
      image: "https://images.pexels.com/photos/5089178/pexels-photo-5089178.jpeg",
      count: "120+ pros"
    },
    {
      name: "Peintre",
      image: "https://images.pexels.com/photos/5493653/pexels-photo-5493653.jpeg",
      count: "300+ pros"
    },
    {
      name: "Maçon",
      image: "https://images.pexels.com/photos/19688828/pexels-photo-19688828.jpeg",
      count: "200+ pros"
    },
    {
      name: "Chauffagiste",
      image: "https://images.pexels.com/photos/7859953/pexels-photo-7859953.jpeg",
      count: "150+ pros"
    },
    {
      name: "Carreleur",
      image: "https://images.pexels.com/photos/11806477/pexels-photo-11806477.jpeg",
      count: "90+ pros"
    },
    {
      name: "Et plus...",
      image: "https://images.pexels.com/photos/8853507/pexels-photo-8853507.jpeg",
      count: "500+ pros"
    }
  ];

  return (
    <section className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Tous les corps de métier</h2>
          <p className="text-xl text-gray-300">
            Des professionnels qualifiés dans tous les domaines
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 transition-all duration-300">
                <div className="aspect-square relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg mb-1">{category.name}</h3>
                    <p className="text-emerald-400 text-sm">{category.count}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing Plans Component
const PricingPlans = () => {
  const plans = [
    {
      name: "Particuliers",
      subtitle: "GRATUIT",
      price: "",
      period: "",
      badge: "100% Free! 🎁",
      features: [
        "Swipe illimité",
        "Chat avec artisans",
        "Demandes de devis",
        "Support client"
      ],
      buttonText: "Commencer gratuitement",
      buttonColor: "bg-emerald-500 hover:bg-emerald-600",
      borderColor: "border-emerald-500",
      icon: "🎁"
    },
    {
      name: "Pro Starter",
      subtitle: "49€/mois",
      price: "49€",
      period: "/mois",
      badge: "30 demandes incluses",
      features: [
        "Profil vérifié",
        "30 demandes/mois",
        "Facturation devis 30€",
        "Analytics basiques",
        "Support email"
      ],
      buttonText: "Essayer gratuitement",
      buttonColor: "bg-purple-500 hover:bg-purple-600",
      borderColor: "border-purple-500",
      icon: "🔨"
    },
    {
      name: "Pro Business",
      subtitle: "99€/mois",
      price: "99€",
      period: "/mois",
      badge: "100 demandes incluses",
      topBadge: "Business",
      features: [
        "Profil premium",
        "100 demandes/mois",
        "Facturation devis 80€",
        "Analytics avancées",
        "Support chat",
        "Badge \"Pro Business\""
      ],
      buttonText: "Commencer l'essai",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      borderColor: "border-blue-500",
      popular: true,
      icon: "📈"
    },
    {
      name: "Pro Premium",
      subtitle: "149€/mois",
      price: "149€",
      period: "/mois",
      badge: "250 demandes incluses",
      topBadge: "Premium",
      features: [
        "Profil premium+",
        "250 demandes/mois",
        "Facturation devis 80€",
        "Projets complexes",
        "Support chat",
        "Option \"être rappelé\"",
        "Badge \"Expert\""
      ],
      buttonText: "Contactez-nous",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600",
      borderColor: "border-yellow-500",
      icon: "👑"
    }
  ];

  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
            Nos formules artisans 
            <span className="ml-2 text-blue-400">💎</span>
          </h2>
          <p className="text-xl text-gray-300">
            Pour tous les besoins et tous les budgets
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-slate-800 p-6 rounded-2xl border-2 ${
                plan.borderColor
              } transition-all duration-300 hover:shadow-xl hover:shadow-${plan.borderColor.split('-')[1]}-500/20`}
            >
              {plan.topBadge && (
                <div className="absolute -top-3 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    plan.topBadge === 'Business' ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-white'
                  }`}>
                    {plan.topBadge}
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">{plan.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                {plan.price && (
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400 ml-1">{plan.period}</span>
                    </div>
                  </div>
                )}
                {plan.name === "Particuliers" && (
                  <div className="text-3xl font-bold text-emerald-400 mb-2">GRATUIT</div>
                )}
                
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  plan.name === "Particuliers" ? 'bg-emerald-500/20 text-emerald-400' :
                  plan.name === "Pro Starter" ? 'bg-purple-500/20 text-purple-400' :
                  plan.name === "Pro Business" ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {plan.badge}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full ${plan.buttonColor} text-white py-3 rounded-lg font-semibold transition-colors`}>
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// On Swipe Pour Vous Component
const OnSwipeForYou = () => {
  return (
    <section className="py-20 bg-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 rounded-2xl border border-purple-500/20"
        >
          <div className="w-16 h-16 bg-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            "On swipe pour vous"
          </h2>
          
          <div className="text-4xl font-bold text-white mb-2">
            299€<span className="text-2xl text-pink-200">/mois</span>
          </div>
          
          <p className="text-pink-100 mb-8 max-w-2xl mx-auto">
            Notre équipe d'experts sélectionne et présente vos profils aux clients potentiels, 
            maximisant vos chances de décrocher de nouveaux projets sans effort de votre part.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center">
              <Heart className="w-5 h-5 mr-2" />
              Découvrir ce service
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center">
              <Users className="w-5 h-5 mr-2" />
              Demander plus d'infos
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Réserver votre place
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Testimonials Component
const Testimonials = () => {
  const testimonials = [
    {
      name: "Marie-Claire L.",
      role: "Propriétaire d'une maison",
      content: "J'ai trouvé mon électricien en 5 minutes ! Le service est incroyable.",
      rating: 5
    },
    {
      name: "Jean-Pierre M.",
      role: "Plombier indépendant",
      content: "Grâce à Swipe Ton Pro, j'ai doublé mon chiffre d'affaires en 6 mois.",
      rating: 5
    },
    {
      name: "Sophie R.",
      role: "Architecte d'intérieur",
      content: "La plateforme parfaite pour trouver des artisans qualifiés rapidement.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Ils nous font confiance</h2>
          <p className="text-xl text-gray-300">
            Des milliers de projets réalisés avec succès
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-slate-800 p-6 rounded-2xl border border-slate-700"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
              <div>
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-gray-400 text-sm">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Mobile App Component
const MobileApp = () => {
  return (
    <section className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Visualisez avant de choisir</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Notre application mobile vous permet de voir les profils en détail et de prendre 
            des décisions éclairées avec des portfolios complets, tout cela avant et après 
            votre décision de sélection.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-6">
                Interface de swipe révolutionnaire
              </h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                  Profils détaillés avec portfolios
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                  Système de matching intelligent
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                  Chat intégré pour échanger
                </li>
              </ul>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Swiper gratuitement
              </button>
            </div>
          </div>
          
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-64 h-96 bg-slate-900 rounded-3xl border-4 border-slate-700 p-4 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1603015269169-225cb700e29a"
                    alt="Swipe Ton Pro App"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-lg font-bold text-white">Swipe Ton Pro</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              La plateforme révolutionnaire de mise en relation entre porteurs de projets 
              et professionnels qualifiés. Swipez vers votre prochain succès !
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">f</span>
              </div>
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">t</span>
              </div>
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">in</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Découvrir un projet</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Devenir artisan</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Interface Swipe</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tarifs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Légal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Mentions Légales</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">CGU</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Politique de confidentialité</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-2" />
                <a href="mailto:contact@swipetonpro.fr" className="hover:text-white transition-colors">
                  contact@swipetonpro.fr
                </a>
              </li>
              <li className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-2" />
                <a href="mailto:support@swipetonpro.fr" className="hover:text-white transition-colors">
                  support@swipetonpro.fr
                </a>
              </li>
              <li className="text-gray-400 text-sm mt-4">
                Une question ? Contactez-nous !
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Swipe Ton Pro. Tous droits réservés.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Nous Administrateur</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingPros: 0,
    activeProjects: 0,
    monthlyRevenue: 0
  });

  useEffect(() => {
    // Calculer les statistiques depuis localStorage
    const allUsers = JSON.parse(localStorage.getItem('swipe_ton_pro_all_users') || '[]');
    const totalUsers = allUsers.length;
    const pendingPros = allUsers.filter(user => user.status === 'pending' && user.type === 'professionnel').length;
    
    setStats({
      totalUsers,
      pendingPros,
      activeProjects: Math.floor(totalUsers * 0.3), // Simulation
      monthlyRevenue: totalUsers * 47 // Simulation basée sur les abonnements
    });
  }, []);

  const statsDisplay = [
    { label: 'Utilisateurs totaux', value: stats.totalUsers.toString(), icon: Users, color: 'text-blue-400' },
    { label: 'Pros en attente', value: stats.pendingPros.toString(), icon: AlertCircle, color: 'text-yellow-400' },
    { label: 'Projets actifs', value: stats.activeProjects.toString(), icon: FileText, color: 'text-emerald-400' },
    { label: 'Revenue mensuel', value: `€${stats.monthlyRevenue}`, icon: DollarSign, color: 'text-green-400' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Administrateur</h1>
        <p className="text-gray-400">Vue d'ensemble de la plateforme SwipeTonPro</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statsDisplay.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <span className={`text-2xl font-bold text-white`}>{stat.value}</span>
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Dernières inscriptions</h3>
          <div className="space-y-4">
            {JSON.parse(localStorage.getItem('swipe_ton_pro_all_users') || '[]')
              .slice(-3)
              .reverse()
              .map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white">{user.firstName} {user.lastName}</p>
                      <p className="text-gray-400 text-sm">
                        {user.type === 'professionnel' ? user.specialty || 'Professionnel' : 'Particulier'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                    user.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {user.status === 'active' ? 'Actif' : 
                     user.status === 'pending' ? 'En attente' : 'Rejeté'}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Actions requises</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <span className="text-white">{stats.pendingPros} professionnel(s) à valider</span>
            </div>
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-blue-400" />
              <span className="text-white">0 message(s) support</span>
            </div>
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-white">Plateforme opérationnelle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// User Management Component
const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Charger les utilisateurs depuis localStorage
    const allUsers = JSON.parse(localStorage.getItem('swipe_ton_pro_all_users') || '[]');
    setUsers(allUsers);
  }, []);

  const handleStatusChange = (userId, newStatus) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('swipe_ton_pro_all_users', JSON.stringify(updatedUsers));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('swipe_ton_pro_all_users', JSON.stringify(updatedUsers));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Gestion des Utilisateurs</h1>
        <div className="flex space-x-4">
          <span className="text-gray-400">Total: {users.length} utilisateurs</span>
          <button 
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," 
                + "Nom,Email,Type,Statut,Date\n"
                + users.map(u => `${u.firstName} ${u.lastName},${u.email},${u.type},${u.status},${u.createdAt?.split('T')[0] || 'N/A'}`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "utilisateurs_swipetonpro.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"
          >
            Exporter CSV
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-white font-semibold">Photo</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Nom</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Type</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Statut</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Inscription</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-600 flex items-center justify-center">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white">{user.firstName} {user.lastName}</td>
                  <td className="px-6 py-4 text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 text-gray-300 capitalize">
                    {user.type === 'professionnel' ? (user.specialty || 'Professionnel') : user.type}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user.id, e.target.value)}
                      className={`px-3 py-1 rounded text-xs font-semibold bg-slate-600 border border-slate-500 ${
                        user.status === 'active' ? 'text-emerald-400' :
                        user.status === 'pending' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}
                    >
                      <option value="active">Actif</option>
                      <option value="pending">En attente</option>
                      <option value="suspended">Suspendu</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          const userDetails = `
Nom: ${user.firstName} ${user.lastName}
Email: ${user.email}
Type: ${user.type}
Spécialité: ${user.specialty || 'N/A'}
Entreprise: ${user.company || 'N/A'}
Téléphone: ${user.phone || 'N/A'}
Localisation: ${user.location || 'N/A'}
Statut: ${user.status}
Inscription: ${user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                          `;
                          alert(userDetails);
                        }}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Voir
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Aucun utilisateur enregistré pour le moment.
          </div>
        )}
      </div>
    </div>
  );
};

const PendingValidations = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    // Charger les utilisateurs en attente depuis localStorage
    const allUsers = JSON.parse(localStorage.getItem('swipe_ton_pro_all_users') || '[]');
    const pending = allUsers.filter(user => user.status === 'pending' && user.type === 'professionnel');
    setPendingUsers(pending);
  }, []);

  const handleValidation = (userId, action) => {
    const allUsers = JSON.parse(localStorage.getItem('swipe_ton_pro_all_users') || '[]');
    const updatedUsers = allUsers.map(user => {
      if (user.id === userId) {
        return { ...user, status: action === 'approve' ? 'active' : 'rejected' };
      }
      return user;
    });
    
    localStorage.setItem('swipe_ton_pro_all_users', JSON.stringify(updatedUsers));
    
    // Mettre à jour l'état local
    const updatedPending = pendingUsers.filter(user => user.id !== userId);
    setPendingUsers(updatedPending);
    
    // Si l'utilisateur actuel est celui qui vient d'être validé, mettre à jour sa session
    const currentUser = JSON.parse(localStorage.getItem('swipe_ton_pro_user') || '{}');
    if (currentUser.id === userId) {
      const updatedCurrentUser = { ...currentUser, status: action === 'approve' ? 'active' : 'rejected' };
      localStorage.setItem('swipe_ton_pro_user', JSON.stringify(updatedCurrentUser));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Validations en attente</h1>
        <span className="text-gray-400">{pendingUsers.length} professionnel(s) en attente</span>
      </div>

      {pendingUsers.length === 0 ? (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Aucune validation en attente</h3>
          <p className="text-gray-400">Tous les professionnels ont été traités.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingUsers.map((user) => (
            <div key={user.id} className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{user.firstName} {user.lastName}</h3>
                    <p className="text-gray-400">{user.specialty} - {user.company}</p>
                    <p className="text-gray-400 text-sm">Email: {user.email}</p>
                    <p className="text-gray-400 text-sm">Téléphone: {user.phone || 'Non renseigné'}</p>
                    <p className="text-gray-400 text-sm">SIRET: {user.siret || 'Non renseigné'}</p>
                    <p className="text-gray-400 text-sm">Localisation: {user.location || 'Non renseignée'}</p>
                    <p className="text-gray-400 text-sm">
                      Demande du {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => handleValidation(user.id, 'approve')}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg flex items-center font-semibold transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Valider
                  </button>
                  <button 
                    onClick={() => handleValidation(user.id, 'reject')}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center font-semibold transition-colors"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Refuser
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-3">Documents fournis :</h4>
                {user.documents && user.documents.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {user.documents.map((doc, index) => (
                      <div key={index} className="flex items-center bg-slate-700 px-4 py-2 rounded-lg">
                        <FileText className="w-5 h-5 text-emerald-400 mr-3" />
                        <span className="text-gray-300 text-sm">{doc.name}</span>
                        <button className="ml-3 text-blue-400 hover:text-blue-300">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Aucun document fourni</p>
                )}
              </div>

              {user.bio && (
                <div className="mt-4">
                  <h4 className="text-white font-medium mb-2">Présentation :</h4>
                  <p className="text-gray-300 text-sm bg-slate-700 p-3 rounded">{user.bio}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminAnalytics = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Analytics & Statistiques</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Inscriptions par mois</h3>
          <div className="text-gray-400">Graphique en développement...</div>
        </div>
        
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Revenue par catégorie</h3>
          <div className="text-gray-400">Graphique en développement...</div>
        </div>
      </div>
    </div>
  );
};

// Export all components
export const Components = {
  Header,
  Hero,
  HowItWorks,
  WhyChooseUs,
  ProfessionalCategories,
  PricingPlans,
  OnSwipeForYou,
  Testimonials,
  MobileApp,
  Footer,
  AuthModal,
  Dashboard,
  SwipeInterface,
  DocumentsManagement,
  UserManagement,
  PendingValidations,
  AdminAnalytics
};