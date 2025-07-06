import React, { useState } from "react";
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
  ChevronDown
} from "lucide-react";

// Header Component
const Header = () => {
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
            <button className="text-gray-300 hover:text-white transition-colors">
              Se connecter
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors">
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
const Hero = () => {
  const [email, setEmail] = useState("");

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
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center">
              Commencer gratuitement
              <span className="ml-2 text-sm font-normal">(Particuliers)</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-lg transition-colors flex items-center">
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

// How It Works Component
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
      description: "Tous nos professionnels sont vérifiés et assurés pour votre tranquillité d'esprit."
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
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-orange-500 rounded-full animate-pulse"></div>
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
            <p className="text-gray-400 text-sm">
              Une question ? Contactez-nous !
            </p>
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
  Footer
};