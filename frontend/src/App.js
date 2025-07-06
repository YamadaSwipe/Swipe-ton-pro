import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Components } from "./components";

const {
  Header,
  Hero,
  HowItWorks,
  WhyChooseUs,
  ProfessionalCategories,
  PricingPlans,
  Testimonials,
  MobileApp,
  Footer,
  OnSwipeForYou,
  AuthModal,
  Dashboard,
  SwipeInterface
} = Components;

const Home = () => {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState('particulier');

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('swipe_ton_pro_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuth = (userData) => {
    setUser(userData);
    localStorage.setItem('swipe_ton_pro_user', JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('swipe_ton_pro_user');
  };

  if (user) {
    if (window.location.pathname === '/swipe') {
      return <SwipeInterface user={user} onLogout={handleLogout} />;
    }
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header 
        onShowAuth={setShowAuthModal} 
        setAuthType={setAuthType}
      />
      <Hero 
        onShowAuth={setShowAuthModal} 
        setAuthType={setAuthType}
      />
      <HowItWorks />
      <WhyChooseUs />
      <ProfessionalCategories />
      <PricingPlans />
      <OnSwipeForYou />
      <Testimonials />
      <MobileApp />
      <Footer />
      
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          authType={authType}
          onAuth={handleAuth}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;