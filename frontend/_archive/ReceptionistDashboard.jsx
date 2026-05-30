import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LuxuryButton from '../../components/common/LuxuryButton';
import './ReceptionistDashboard.css';

const ReceptionistDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [guestData, setGuestData] = useState({
    numberOfGuests: null,
    stayType: null,
    preferences: [],
    duration: null,
    specialNeeds: []
  });
  
  const [recommendations, setRecommendations] = useState({
    floors: [],
    rooms: [],
    services: []
  });

  const steps = [
    {
      id: 'welcome',
      type: 'intro',
      message: t('receptionist.chat.welcome')
    },
    {
      id: 'numberOfGuests',
      type: 'number',
      question: t('receptionist.chat.numberOfGuests'),
      options: [1, 2, 3, 4, 5, '6+']
    },
    {
      id: 'stayType',
      type: 'single',
      question: t('receptionist.chat.stayType'),
      options: ['luxury', 'family', 'business', 'quiet']
    },
    {
      id: 'preferences',
      type: 'multiple',
      question: t('receptionist.chat.preferences'),
      options: ['view', 'spa', 'restaurant', 'budget', 'suite', 'pool', 'gym', 'parking']
    },
    {
      id: 'duration',
      type: 'single',
      question: t('receptionist.chat.duration'),
      options: ['short', 'medium', 'long', 'extended']
    },
    {
      id: 'specialNeeds',
      type: 'multiple',
      question: t('receptionist.chat.specialNeeds'),
      options: ['children', 'elderly', 'medical', 'vip', 'accessibility', 'pets']
    }
  ];

  const handleOptionSelect = (value) => {
    const step = steps[currentStep];
    
    if (step.type === 'multiple') {
      const current = guestData[step.id] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      setGuestData({ ...guestData, [step.id]: updated });
    } else {
      setGuestData({ ...guestData, [step.id]: value });
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateRecommendations();
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setShowResults(false);
    setGuestData({
      numberOfGuests: null,
      stayType: null,
      preferences: [],
      duration: null,
      specialNeeds: []
    });
    setRecommendations({ floors: [], rooms: [], services: [] });
  };

  const calculateRecommendations = () => {
    const { stayType, preferences, duration, specialNeeds, numberOfGuests } = guestData;
    
    const floorRecs = [];
    const roomRecs = [];
    const serviceRecs = [];

    if (stayType === 'luxury' || preferences.includes('suite')) {
      floorRecs.push({
        id: '11',
        name: 'Floor 11 - Presidential Helipad',
        description: 'Ultimate luxury with private helipad access',
        match: 'perfect',
        features: ['Helipad', 'Sky Lounge', 'VIP Access']
      });
      floorRecs.push({
        id: '10',
        name: 'Floor 10 - Sky Garden & Infinity Pool',
        description: 'Panoramic views with exclusive infinity pool',
        match: 'perfect',
        features: ['Infinity Pool', 'Sky Garden', 'Observation Deck']
      });
    }

    if (preferences.includes('spa') || stayType === 'quiet') {
      floorRecs.push({
        id: '9',
        name: 'Floor 9 - Premium Spa & Wellness',
        description: 'Full-service spa and wellness center',
        match: preferences.includes('spa') ? 'perfect' : 'good',
        features: ['Luxury Spa', 'Wellness Center', 'Meditation Rooms']
      });
    }

    if (preferences.includes('restaurant') || stayType === 'luxury') {
      floorRecs.push({
        id: '1',
        name: 'Floor 1 - Fine Dining',
        description: 'World-class restaurants and cafés',
        match: 'good',
        features: ['Michelin Dining', 'VIP Lounge', '24/7 Café']
      });
    }

    if (stayType === 'business') {
      floorRecs.push({
        id: '2',
        name: 'Floor 2 - Conference & Events',
        description: 'Professional meeting spaces and business center',
        match: 'perfect',
        features: ['Conference Rooms', 'Business Center', 'Event Halls']
      });
    }

    if (stayType === 'family' || specialNeeds.includes('children')) {
      floorRecs.push({
        id: '3',
        name: 'Floor 3 - Family Suites',
        description: 'Spacious family accommodations with kids amenities',
        match: 'perfect',
        features: ['Family Rooms', 'Kids Play Area', 'Connecting Rooms']
      });
    }

    if (preferences.includes('view')) {
      roomRecs.push({
        id: 'suite-penthouse',
        name: 'Penthouse Suite',
        type: 'Suite',
        price: '$2,500/night',
        capacity: numberOfGuests || 2,
        features: ['360° View', 'Private Terrace', 'Butler Service'],
        available: true
      });
    }

    if (preferences.includes('budget') || duration === 'extended') {
      roomRecs.push({
        id: 'standard-deluxe',
        name: 'Deluxe Room',
        type: 'Standard',
        price: '$350/night',
        capacity: 2,
        features: ['City View', 'Modern Amenities', 'Work Desk'],
        available: true
      });
    }

    if (stayType === 'luxury' || preferences.includes('suite')) {
      roomRecs.push({
        id: 'suite-royal',
        name: 'Royal Suite',
        type: 'Suite',
        price: '$1,800/night',
        capacity: 4,
        features: ['Panoramic View', 'Living Room', 'Jacuzzi'],
        available: true
      });
    }

    if (stayType === 'family') {
      roomRecs.push({
        id: 'family-suite',
        name: 'Family Suite',
        type: 'Suite',
        price: '$950/night',
        capacity: 6,
        features: ['Two Bedrooms', 'Kids Area', 'Kitchen'],
        available: true
      });
    }

    if (preferences.includes('spa')) {
      serviceRecs.push({
        id: 'spa-package',
        name: 'Premium Spa Package',
        description: 'Full day wellness experience',
        icon: '💆',
        price: '$450'
      });
    }

    if (specialNeeds.includes('medical')) {
      serviceRecs.push({
        id: 'medical-support',
        name: '24/7 Medical Support',
        description: 'On-call medical staff and nursing services',
        icon: '🏥',
        price: 'Included'
      });
    }

    if (specialNeeds.includes('vip')) {
      serviceRecs.push({
        id: 'vip-concierge',
        name: 'VIP Concierge Service',
        description: 'Personal concierge and limousine service',
        icon: '👔',
        price: '$500/day'
      });
    }

    if (preferences.includes('restaurant')) {
      serviceRecs.push({
        id: 'dining-package',
        name: 'Gourmet Dining Package',
        description: 'Three meals at our premium restaurants',
        icon: '🍽️',
        price: '$280/day'
      });
    }

    setRecommendations({
      floors: floorRecs.slice(0, 4),
      rooms: roomRecs.slice(0, 4),
      services: serviceRecs.slice(0, 4)
    });
  };

  const canProceed = () => {
    const step = steps[currentStep];
    if (step.type === 'intro') return true;
    if (step.type === 'multiple') return true;
    return guestData[step.id] !== null && guestData[step.id] !== undefined;
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="receptionist-dashboard">
      <motion.header
        className="receptionist-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="receptionist-title">{t('receptionist.title')}</h1>
        <p className="receptionist-subtitle">{t('receptionist.subtitle')}</p>
      </motion.header>

      <div className="receptionist-content">
        <div className="receptionist-left">
          <div className="chat-container">
            <AnimatePresence mode="wait">
              {!showResults ? (
                <motion.div
                  key={currentStep}
                  className="chat-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="chat-message assistant">
                    <div className="message-avatar">🎯</div>
                    <div className="message-content">
                      {currentStepData.type === 'intro' ? (
                        <p className="message-text">{currentStepData.message}</p>
                      ) : (
                        <p className="message-text">{currentStepData.question}</p>
                      )}
                    </div>
                  </div>

                  {currentStepData.type !== 'intro' && (
                    <div className="chat-options">
                      {currentStepData.options.map((option) => {
                        const isSelected = currentStepData.type === 'multiple'
                          ? guestData[currentStepData.id]?.includes(option)
                          : guestData[currentStepData.id] === option;

                        return (
                          <motion.button
                            key={option}
                            className={`option-button ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleOptionSelect(option)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {currentStepData.type === 'number' ? (
                              <span className="option-text">{option}</span>
                            ) : (
                              <span className="option-text">
                                {t(`receptionist.${currentStepData.id}.${option}`)}
                              </span>
                            )}
                            {isSelected && <span className="option-check">✓</span>}
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  <div className="chat-navigation">
                    {currentStep > 0 && (
                      <LuxuryButton
                        variant="secondary"
                        size="medium"
                        onClick={handlePrevious}
                      >
                        ← {t('receptionist.chat.previous')}
                      </LuxuryButton>
                    )}
                    
                    {(canProceed() || currentStepData.type === 'multiple') && (
                      <LuxuryButton
                        variant="primary"
                        size="medium"
                        onClick={handleNext}
                      >
                        {currentStep === steps.length - 1
                          ? t('receptionist.chat.finish')
                          : currentStep === 0
                          ? t('receptionist.chat.letsBegin')
                          : t('receptionist.chat.next')} →
                      </LuxuryButton>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="chat-summary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="chat-message assistant">
                    <div className="message-avatar">🎯</div>
                    <div className="message-content">
                      <p className="message-text">{t('receptionist.chat.summary')}</p>
                    </div>
                  </div>
                  
                  <div className="summary-details">
                    {guestData.numberOfGuests && (
                      <div className="summary-item">
                        <span className="summary-label">Guests:</span>
                        <span className="summary-value">{guestData.numberOfGuests}</span>
                      </div>
                    )}
                    {guestData.stayType && (
                      <div className="summary-item">
                        <span className="summary-label">Stay Type:</span>
                        <span className="summary-value">
                          {t(`receptionist.stayTypes.${guestData.stayType}`)}
                        </span>
                      </div>
                    )}
                    {guestData.duration && (
                      <div className="summary-item">
                        <span className="summary-label">Duration:</span>
                        <span className="summary-value">
                          {t(`receptionist.duration.${guestData.duration}`)}
                        </span>
                      </div>
                    )}
                  </div>

                  <LuxuryButton
                    variant="secondary"
                    size="medium"
                    onClick={handleReset}
                    fullWidth
                  >
                    🔄 {t('receptionist.chat.reset')}
                  </LuxuryButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="receptionist-right">
          <AnimatePresence>
            {showResults && (
              <motion.div
                className="recommendations-container"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="recommendations-title">{t('receptionist.recommendations.title')}</h2>

                {recommendations.floors.length > 0 && (
                  <section className="recommendation-section">
                    <h3 className="section-heading">{t('receptionist.recommendations.floors')}</h3>
                    <div className="recommendation-grid">
                      {recommendations.floors.map((floor, idx) => (
                        <motion.div
                          key={floor.id}
                          className={`recommendation-card floor-card match-${floor.match}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <div className="card-badge">{t(`receptionist.recommendations.${floor.match}`)}</div>
                          <h4 className="card-title">{floor.name}</h4>
                          <p className="card-description">{floor.description}</p>
                          <div className="card-features">
                            {floor.features.map((feature, i) => (
                              <span key={i} className="feature-tag">{feature}</span>
                            ))}
                          </div>
                          <button
                            className="card-action"
                            onClick={() => navigate(`/floors/${floor.id}`)}
                          >
                            {t('receptionist.recommendations.viewMap')} →
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}

                {recommendations.rooms.length > 0 && (
                  <section className="recommendation-section">
                    <h3 className="section-heading">{t('receptionist.recommendations.rooms')}</h3>
                    <div className="recommendation-grid">
                      {recommendations.rooms.map((room, idx) => (
                        <motion.div
                          key={room.id}
                          className="recommendation-card room-card"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <div className="room-header">
                            <span className="room-type">{room.type}</span>
                            <span className="room-price">{room.price}</span>
                          </div>
                          <h4 className="card-title">{room.name}</h4>
                          <div className="card-features">
                            {room.features.map((feature, i) => (
                              <span key={i} className="feature-tag">{feature}</span>
                            ))}
                          </div>
                          <button
                            className="card-action primary"
                            onClick={() => navigate('/booking')}
                          >
                            {t('receptionist.recommendations.bookNow')} →
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}

                {recommendations.services.length > 0 && (
                  <section className="recommendation-section">
                    <h3 className="section-heading">{t('receptionist.recommendations.services')}</h3>
                    <div className="recommendation-grid services-grid">
                      {recommendations.services.map((service, idx) => (
                        <motion.div
                          key={service.id}
                          className="recommendation-card service-card"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <div className="service-icon">{service.icon}</div>
                          <h4 className="card-title">{service.name}</h4>
                          <p className="card-description">{service.description}</p>
                          <div className="service-price">{service.price}</div>
                          <button
                            className="card-action"
                            onClick={() => navigate('/services')}
                          >
                            {t('receptionist.recommendations.learnMore')} →
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}

                {recommendations.floors.length === 0 && recommendations.rooms.length === 0 && (
                  <div className="no-results">
                    <p>{t('receptionist.recommendations.noResults')}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!showResults && (
            <motion.div
              className="recommendations-placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="placeholder-icon">🎯</div>
              <p className="placeholder-text">
                Your personalized recommendations will appear here
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
