import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './AccessEntry.css';

const AccessEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Get redirect message from state (when redirected from booking/services)
  const redirectMessage = location.state?.message;

  const cards = [
    {
      id: 'firstTime',
      tone: 'gold',
      title: t('auth.accessEntry.roles.firstTime.title'),
      subtitle: t('auth.accessEntry.roles.firstTime.subtitle'),
      highlight: t('auth.accessEntry.roles.firstTime.highlight'),
      cta: t('auth.accessEntry.roles.firstTime.cta'),
      to: '/auth/guest/new'
    },
    {
      id: 'returning',
      tone: 'emerald',
      title: t('auth.accessEntry.roles.returning.title'),
      subtitle: t('auth.accessEntry.roles.returning.subtitle'),
      highlight: t('auth.accessEntry.roles.returning.highlight'),
      cta: t('auth.accessEntry.roles.returning.cta'),
      to: '/auth/guest/returning'
    }
  ];

  return (
    <div className="access-entry">
      <div className="access-entry__bg" />
      <div className="access-entry__container">
        {redirectMessage && (
          <motion.div
            className="access-entry__message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p>🔐 {redirectMessage}</p>
          </motion.div>
        )}
        
        <motion.div
          className="access-entry__header"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="access-entry__mark">♛</div>
          <h1 className="access-entry__title">{t('auth.accessEntry.title')}</h1>
          <p className="access-entry__subtitle">{t('auth.accessEntry.subtitle')}</p>
        </motion.div>

        <div className="access-entry__grid">
          {cards.map((c, idx) => (
            <motion.button
              key={c.id}
              type="button"
              className={`access-entry__card access-entry__card--${c.tone}`}
              onClick={() => navigate(c.to)}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
            >
              <div className="access-entry__cardTop">
                <div>
                  <h2 className="access-entry__cardTitle">{c.title}</h2>
                  <p className="access-entry__cardSubtitle">{c.subtitle}</p>
                </div>
                <div className="access-entry__badge">{c.highlight}</div>
              </div>

              <div className="access-entry__cardBottom">
                <span className="access-entry__cta">{c.cta}</span>
                <span className="access-entry__arrow">→</span>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="access-entry__footer">
          <span className="access-entry__footerText">{t('auth.accessEntry.footer')}</span>
        </div>
      </div>
    </div>
  );
};

export default AccessEntry;
