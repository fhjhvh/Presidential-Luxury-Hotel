import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import RevealOnScroll from '../../components/animations/RevealOnScroll';
import './PremiumServices.css';

const PremiumServices = () => {
  const { t } = useTranslation();

  const services = [
    { icon: '⚕️', nameKey: 'premiumServices.items.medical.name', descKey: 'premiumServices.items.medical.desc', img: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=600' },
    { icon: '🎩', nameKey: 'premiumServices.items.butler.name', descKey: 'premiumServices.items.butler.desc', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600' },
    { icon: '🛡️', nameKey: 'premiumServices.items.security.name', descKey: 'premiumServices.items.security.desc', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600' },
    { icon: '🔧', nameKey: 'premiumServices.items.maintenance.name', descKey: 'premiumServices.items.maintenance.desc', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600' },
    { icon: '🚗', nameKey: 'premiumServices.items.carFleet.name', descKey: 'premiumServices.items.carFleet.desc', img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600' },
    { icon: '🚁', nameKey: 'premiumServices.items.helicopter.name', descKey: 'premiumServices.items.helicopter.desc', img: 'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=600' },
    { icon: '🧘', nameKey: 'premiumServices.items.wellness.name', descKey: 'premiumServices.items.wellness.desc', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600' },
    { icon: '💪', nameKey: 'premiumServices.items.fitnessTrainers.name', descKey: 'premiumServices.items.fitnessTrainers.desc', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600' },
    { icon: '🎯', nameKey: 'premiumServices.items.eventPlanning.name', descKey: 'premiumServices.items.eventPlanning.desc', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600' },
    { icon: '💼', nameKey: 'premiumServices.items.businessSupport.name', descKey: 'premiumServices.items.businessSupport.desc', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600' }
  ];

  return (
    <div className="premium-services">
      <section className="premium-hero">
        <video autoPlay loop muted playsInline className="premium-hero__video">
          <source src="https://videos.pexels.com/video-files/3191300/3191300-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        </video>
        <div className="premium-hero__overlay"></div>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1>{t('premiumServices.hero.title')}</h1>
            <p>{t('premiumServices.hero.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <section className="section container">
        <div className="premium-grid">
          {services.map((service, index) => (
            <RevealOnScroll key={index} delay={index * 0.05}>
              <motion.div className="premium-card" whileHover={{ y: -10 }}>
                <div className="premium-card__image" style={{ backgroundImage: `url(${service.img})` }}>
                  <div className="premium-card__overlay"></div>
                  <div className="premium-card__icon">{service.icon}</div>
                </div>
                <div className="premium-card__content">
                  <h3>{t(service.nameKey)}</h3>
                  <p>{t(service.descKey)}</p>
                  <Link to="/dashboard/service-requests" className="premium-card__link">{t('premiumServices.card.requestService')} →</Link>
                </div>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PremiumServices;
