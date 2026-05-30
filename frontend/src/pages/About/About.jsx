import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './About.css';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      <motion.div
        className="about-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1>{t('about.hero.title')}</h1>
        <p className="about-subtitle">{t('about.hero.subtitle')}</p>
      </motion.div>

      <div className="about-content">
        <section className="about-section">
          <h2>{t('about.story.title')}</h2>
          <p>{t('about.story.body')}</p>
        </section>

        <section className="about-section">
          <h2>{t('about.facilities.title')}</h2>
          <div className="facilities-grid">
            <div className="facility-card">
              <span className="facility-icon">🏨</span>
              <h3>{t('about.facilities.rooms.title')}</h3>
              <p>{t('about.facilities.rooms.desc')}</p>
            </div>
            <div className="facility-card">
              <span className="facility-icon">🍽️</span>
              <h3>{t('about.facilities.dining.title')}</h3>
              <p>{t('about.facilities.dining.desc')}</p>
            </div>
            <div className="facility-card">
              <span className="facility-icon">💆</span>
              <h3>{t('about.facilities.spa.title')}</h3>
              <p>{t('about.facilities.spa.desc')}</p>
            </div>
            <div className="facility-card">
              <span className="facility-icon">🚁</span>
              <h3>{t('about.facilities.helipad.title')}</h3>
              <p>{t('about.facilities.helipad.desc')}</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>{t('about.commitment.title')}</h2>
          <p>{t('about.commitment.body')}</p>
        </section>
      </div>
    </div>
  );
};

export default About;
