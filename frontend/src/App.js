import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Sample data for demo purposes
const SAMPLE_PROFILES = [
  {
    id: "1",
    user_id: "user1",
    bio: "Électricien expérimenté avec 10 ans d'expérience. Spécialisé dans les installations domestiques et industrielles.",
    location: "Paris, France",
    rating: 4.8,
    reviews_count: 127,
    profession_category: "electricien",
    experience_years: 10,
    hourly_rate: 45,
    profile_image: "https://images.unsplash.com/photo-1573496130103-a442a3754d0e?w=400&h=400&fit=crop",
    portfolio_images: [
      "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?w=400&h=300&fit=crop",
      "https://images.pexels.com/photos/162568/pexels-photo-162568.jpeg?w=400&h=300&fit=crop"
    ],
    availability: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "2", 
    user_id: "user2",
    bio: "Plombier qualifié, interventions rapides 24h/24. Réparation, installation, dépannage urgence.",
    location: "Lyon, France",
    rating: 4.9,
    reviews_count: 89,
    profession_category: "plombier",
    experience_years: 7,
    hourly_rate: 50,
    profile_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    portfolio_images: [
      "https://images.pexels.com/photos/8488035/pexels-photo-8488035.jpeg?w=400&h=300&fit=crop"
    ],
    availability: true,
    created_at: "2024-01-16T09:00:00Z",
    updated_at: "2024-01-16T09:00:00Z"
  },
  {
    id: "3",
    user_id: "user3", 
    bio: "Menuisier artisan, créations sur mesure. Meubles, placards, aménagements intérieurs.",
    location: "Marseille, France",
    rating: 4.7,
    reviews_count: 156,
    profession_category: "menuisier",
    experience_years: 15,
    hourly_rate: 40,
    profile_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    portfolio_images: [
      "https://images.pexels.com/photos/5089178/pexels-photo-5089178.jpeg?w=400&h=300&fit=crop"
    ],
    availability: true,
    created_at: "2024-01-17T14:00:00Z",
    updated_at: "2024-01-17T14:00:00Z"
  },
  {
    id: "4",
    user_id: "user4",
    bio: "Peintre en bâtiment, finitions soignées. Intérieur, extérieur, décoration.",
    location: "Toulouse, France", 
    rating: 4.6,
    reviews_count: 203,
    profession_category: "peintre",
    experience_years: 8,
    hourly_rate: 35,
    profile_image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    portfolio_images: [
      "https://images.pexels.com/photos/5493653/pexels-photo-5493653.jpeg?w=400&h=300&fit=crop"
    ],
    availability: true,
    created_at: "2024-01-18T11:00:00Z",
    updated_at: "2024-01-18T11:00:00Z"
  }
];

const SwipeCard = ({ profile, onSwipe, isActive }) => {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setCurrentY(e.touches[0].clientY - startY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (Math.abs(currentY) > 50) {
      if (currentY < 0) {
        // Swipe up = like
        onSwipe(profile.id, 'like');
      } else {
        // Swipe down = pass
        onSwipe(profile.id, 'pass');
      }
    }
    
    setCurrentY(0);
  };

  const handleMouseDown = (e) => {
    setStartY(e.clientY);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCurrentY(e.clientY - startY);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (Math.abs(currentY) > 50) {
      if (currentY < 0) {
        // Swipe up = like
        onSwipe(profile.id, 'like');
      } else {
        // Swipe down = pass
        onSwipe(profile.id, 'pass');
      }
    }
    
    setCurrentY(0);
  };

  const cardStyle = {
    transform: `translateY(${currentY}px) scale(${isActive ? 1 : 0.95})`,
    opacity: isActive ? 1 : 0.7,
    zIndex: isActive ? 10 : 1,
    transition: isDragging ? 'none' : 'all 0.3s ease-out'
  };

  const getSwipeIndicator = () => {
    if (Math.abs(currentY) < 30) return null;
    return currentY < 0 ? '❤️ LIKE' : '❌ PASS';
  };

  return (
    <div 
      className={`swipe-card ${isActive ? 'active' : ''}`}
      style={cardStyle}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Swipe indicator */}
      {getSwipeIndicator() && (
        <div className={`swipe-indicator ${currentY < 0 ? 'like' : 'pass'}`}>
          {getSwipeIndicator()}
        </div>
      )}
      
      {/* Profile image */}
      <div className="profile-image">
        <img src={profile.profile_image} alt={profile.bio} />
      </div>
      
      {/* Profile info */}
      <div className="profile-info">
        <div className="profile-header">
          <h3>{profile.profession_category}</h3>
          <div className="rating">
            ⭐ {profile.rating} ({profile.reviews_count})
          </div>
        </div>
        
        <p className="bio">{profile.bio}</p>
        
        <div className="details">
          <span className="location">📍 {profile.location}</span>
          <span className="experience">👔 {profile.experience_years} ans</span>
          <span className="rate">💰 {profile.hourly_rate}€/h</span>
        </div>
        
        {/* Portfolio preview */}
        {profile.portfolio_images.length > 0 && (
          <div className="portfolio-preview">
            <h4>Portfolio</h4>
            <div className="portfolio-images">
              {profile.portfolio_images.map((img, index) => (
                <img key={index} src={img} alt={`Portfolio ${index + 1}`} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MatchNotification = ({ match, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="match-notification">
      <div className="match-content">
        <h2>🎉 C'est un MATCH ! 🎉</h2>
        <p>Vous pouvez maintenant discuter avec ce professionnel!</p>
        <button onClick={onClose}>Super!</button>
      </div>
    </div>
  );
};

const SwipeInterface = () => {
  const [profiles, setProfiles] = useState(SAMPLE_PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const [showMatch, setShowMatch] = useState(false);
  const [stats, setStats] = useState({ likes: 0, passes: 0, matches: 0 });

  const handleSwipe = async (profileId, swipeType) => {
    try {
      const swipeData = {
        swiper_id: "current_user", // In real app, this would be the logged-in user
        swiped_id: profileId,
        swipe_type: swipeType
      };

      const response = await axios.post(`${API}/swipes`, swipeData);
      
      if (response.data.is_match) {
        setMatches(prev => [...prev, response.data.match]);
        setShowMatch(true);
        setStats(prev => ({ ...prev, matches: prev.matches + 1 }));
      }
      
      // Update stats
      setStats(prev => ({
        ...prev,
        [swipeType === 'like' ? 'likes' : 'passes']: prev[swipeType === 'like' ? 'likes' : 'passes'] + 1
      }));
      
      // Move to next profile
      setCurrentIndex(prev => prev + 1);
      
    } catch (error) {
      console.error('Error swiping:', error);
      // For demo purposes, still advance to next profile
      setCurrentIndex(prev => prev + 1);
    }
  };

  const resetDemo = () => {
    setCurrentIndex(0);
    setMatches([]);
    setStats({ likes: 0, passes: 0, matches: 0 });
  };

  const currentProfile = profiles[currentIndex];
  const hasMoreProfiles = currentIndex < profiles.length;

  return (
    <div className="swipe-interface">
      <div className="app-header">
        <h1>💼 Swipe Ton Pro</h1>
        <div className="stats">
          <span>❤️ {stats.likes}</span>
          <span>❌ {stats.passes}</span>
          <span>🎯 {stats.matches}</span>
        </div>
      </div>

      <div className="swipe-container">
        {hasMoreProfiles ? (
          <div className="cards-stack">
            {/* Show current card and next card preview */}
            {profiles.slice(currentIndex, currentIndex + 2).map((profile, index) => (
              <SwipeCard
                key={profile.id}
                profile={profile}
                onSwipe={handleSwipe}
                isActive={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="no-more-cards">
            <h2>🎉 Tous les profils vus!</h2>
            <p>Vous avez vu tous les professionnels disponibles.</p>
            <button onClick={resetDemo} className="reset-btn">
              Recommencer la démo
            </button>
          </div>
        )}
      </div>

      <div className="swipe-instructions">
        <div className="instruction">
          <span>👆 Swipe vers le haut</span>
          <span>❤️ LIKE</span>
        </div>
        <div className="instruction">
          <span>👇 Swipe vers le bas</span>
          <span>❌ PASS</span>
        </div>
      </div>

      {showMatch && (
        <MatchNotification 
          match={matches[matches.length - 1]}
          onClose={() => setShowMatch(false)}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <SwipeInterface />
    </div>
  );
}

export default App;