import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    userType: searchParams.get('type') || 'particulier',
    // Champs spécifiques aux artisans
    companyName: '',
    siret: '',
    companyType: 'micro_entreprise',
    companyAddress: '',
    companyCity: '',
    companyPostalCode: '',
    professions: [],
    // Champs spécifiques aux particuliers
    address: '',
    city: '',
    postalCode: '',
    propertyType: 'appartement',
    acceptPrivacyPolicy: false,
    acceptMeetingRequest: true  // Par défaut cochée, à décocher si refus
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProfessions, setSelectedProfessions] = useState([]);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const professions = [
    { value: 'electricien', label: 'Électricien', icon: '⚡' },
    { value: 'plombier', label: 'Plombier', icon: '🔧' },
    { value: 'menuisier', label: 'Menuisier', icon: '🪚' },
    { value: 'peintre', label: 'Peintre', icon: '🎨' },
    { value: 'macon', label: 'Maçon', icon: '🧱' },
    { value: 'chauffagiste', label: 'Chauffagiste', icon: '🔥' },
    { value: 'carreleur', label: 'Carreleur', icon: '🏗️' },
    { value: 'couvreur', label: 'Couvreur', icon: '🏠' },
    { value: 'serrurerie', label: 'Serrurier', icon: '🔑' },
    { value: 'jardinage', label: 'Jardinage', icon: '🌱' },
    { value: 'nettoyage', label: 'Nettoyage', icon: '🧽' },
    { value: 'demenagement', label: 'Déménagement', icon: '📦' }
  ];

  const companyTypes = [
    { value: 'micro_entreprise', label: 'Micro-entreprise' },
    { value: 'auto_entrepreneur', label: 'Auto-entrepreneur' },
    { value: 'entreprise_individuelle', label: 'Entreprise individuelle' },
    { value: 'sarl', label: 'SARL' },
    { value: 'sas', label: 'SAS' },
    { value: 'sasu', label: 'SASU' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleProfession = (profession) => {
    const newProfessions = selectedProfessions.includes(profession)
      ? selectedProfessions.filter(p => p !== profession)
      : [...selectedProfessions, profession];
    
    setSelectedProfessions(newProfessions);
    setFormData({
      ...formData,
      professions: newProfessions
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    // Validation spécifique aux artisans
    if (formData.userType === 'artisan') {
      if (!formData.companyName || !formData.siret) {
        setError('Les informations d\'entreprise sont obligatoires pour les artisans');
        setLoading(false);
        return;
      }
      if (selectedProfessions.length === 0) {
        setError('Veuillez sélectionner au moins un métier');
        setLoading(false);
        return;
      }
    }

    // Validation spécifique aux particuliers
    if (formData.userType === 'particulier') {
      if (!formData.acceptPrivacyPolicy) {
        setError('Vous devez accepter les conditions de confidentialité');
        setLoading(false);
        return;
      }
    }

    const userData = {
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      user_type: formData.userType
    };

    const result = await register(userData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Créer votre compte {formData.userType === 'artisan' ? 'professionnel' : 'particulier'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Ou{' '}
            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
              se connecter à un compte existant
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type de compte
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, userType: 'particulier'})}
                className={`p-3 rounded-lg border text-sm font-medium ${
                  formData.userType === 'particulier'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🏠 Particulier
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, userType: 'artisan'})}
                className={`p-3 rounded-lg border text-sm font-medium ${
                  formData.userType === 'artisan'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🔨 Professionnel
              </button>
            </div>
          </div>

          {/* Common Fields */}
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h3 className="text-white font-bold mb-4">Informations personnelles</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                  Prénom
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Prénom"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                  Nom
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@exemple.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                  Téléphone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 pr-10 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mot de passe"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 pr-10 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirmer le mot de passe"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          </div>

          {/* Artisan-specific fields */}
          {formData.userType === 'artisan' && (
            <>
              <div className="bg-slate-800/50 rounded-lg p-6">
                <h3 className="text-white font-bold mb-4">Informations entreprise</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Nom de l'entreprise
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="MonEntreprise SARL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      SIRET
                    </label>
                    <input
                      type="text"
                      name="siret"
                      required
                      value={formData.siret}
                      onChange={handleChange}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="12345678901234"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Type d'entreprise
                    </label>
                    <select
                      name="companyType"
                      value={formData.companyType}
                      onChange={handleChange}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {companyTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Ville
                    </label>
                    <input
                      type="text"
                      name="companyCity"
                      required
                      value={formData.companyCity}
                      onChange={handleChange}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Paris"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Code postal
                    </label>
                    <input
                      type="text"
                      name="companyPostalCode"
                      required
                      value={formData.companyPostalCode}
                      onChange={handleChange}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="75001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Adresse de l'entreprise
                  </label>
                  <input
                    type="text"
                    name="companyAddress"
                    required
                    value={formData.companyAddress}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123 Rue de la Paix"
                  />
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-6">
                <h3 className="text-white font-bold mb-4">Métiers (sélection multiple)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {professions.map(profession => (
                    <button
                      key={profession.value}
                      type="button"
                      onClick={() => toggleProfession(profession.value)}
                      className={`p-3 rounded-lg border text-sm font-medium ${
                        selectedProfessions.includes(profession.value)
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {profession.icon} {profession.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Particulier-specific fields */}
          {formData.userType === 'particulier' && (
            <>
              <div className="bg-slate-800/50 rounded-lg p-6">
                <h3 className="text-white font-bold mb-4">Informations du logement</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Ville
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Paris"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Code postal
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="75001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123 Rue de la Paix"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Type de logement
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="appartement">Appartement</option>
                      <option value="maison">Maison</option>
                      <option value="local_commercial">Local commercial</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Informations confidentialité et conditions */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-white font-bold mb-4 flex items-center">
                  <span className="text-blue-400 mr-2">🔒</span>
                  Confidentialité et conditions
                </h3>
                
                <div className="space-y-4 mb-4">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h4 className="text-yellow-400 font-semibold mb-2">🛡️ Protection de vos données</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Vos informations personnelles (nom, téléphone, adresse) ne seront <strong>jamais visibles</strong> 
                      par les artisans tant qu'il n'y a pas de match confirmé des deux côtés.
                    </p>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h4 className="text-green-400 font-semibold mb-2">💰 Système de paiement sécurisé</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Toute demande de devis ou RDV doit être validée par le professionnel avec un paiement de 
                      <strong className="text-yellow-400"> 60€</strong> qui garantit son sérieux et sa disponibilité.
                    </p>
                  </div>
                </div>

                {/* Cases à cocher */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="acceptPrivacyPolicy"
                      checked={formData.acceptPrivacyPolicy}
                      onChange={(e) => setFormData({...formData, acceptPrivacyPolicy: e.target.checked})}
                      className="mt-1 w-4 h-4 text-blue-600 bg-slate-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="acceptPrivacyPolicy" className="text-sm text-gray-300">
                      J'accepte les conditions de confidentialité et comprends que mes informations personnelles 
                      ne seront partagées qu'après un match mutuel validé.
                    </label>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="acceptMeetingRequest"
                      checked={formData.acceptMeetingRequest}
                      onChange={(e) => setFormData({...formData, acceptMeetingRequest: e.target.checked})}
                      className="mt-1 w-4 h-4 text-blue-600 bg-slate-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="acceptMeetingRequest" className="text-sm text-gray-300">
                      J'accepte de recevoir des demandes de devis/RDV de la part des artisans 
                      (décochez si vous ne souhaitez pas être contacté directement).
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </div>

          {formData.userType === 'artisan' && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p className="text-sm">
                <strong>Note importante :</strong> Votre profil sera en mode "fantôme" jusqu'à validation 
                par nos équipes. Vous devrez uploader vos documents (Kbis, assurance, etc.) pour être visible.
              </p>
              <p className="text-sm mt-2">
                <strong>💰 Système de validation :</strong> Chaque demande de devis/RDV que vous faites 
                nécessite un paiement de 60€ qui garantit votre sérieux et filtre les demandes qualifiées.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;