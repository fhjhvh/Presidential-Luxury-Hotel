import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import RoyalLogo from './RoyalLogo';
import './Footer.css';

const API_URL = 'http://localhost:5000/api';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState({
    phone: '+1 (555) 123-4567',
    email: 'reservations@plhms.luxury',
    address: 'Presidential Avenue, Luxury District',
    facebook: '#',
    instagram: '#',
    twitter: '#',
    linkedin: '#'
  });

  useEffect(() => {
    fetch(`${API_URL}/settings/footer`)
      .then(r => r.ok ? r.json() : null)
      .then(data => data && setSettings(prev => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  const footerLinks = {
    hotel: [
      { label: t('footer.links.aboutUs'), path: '/about' },
      { label: t('footer.links.floorsOverview'), path: '/floors' },
      { label: t('footer.links.roomsSuites'), path: '/rooms' },
      { label: t('footer.links.services'), path: '/services' }
    ],
    services: [
      { label: t('footer.links.restaurant'), path: '/services#restaurant' },
      { label: t('footer.links.spaWellness'), path: '/services#spa' },
      { label: t('footer.links.eventHalls'), path: '/services#events' },
      { label: t('footer.links.helipadServices'), path: '/services#helipad' }
    ],
    support: [
      { label: t('footer.links.contactUs'), path: '/contact' },
      { label: t('footer.links.faqs'), path: '/faqs' },
      { label: t('footer.links.terms'), path: '/terms' },
      { label: t('footer.links.privacy'), path: '/privacy' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: '𝑓', url: settings.facebook },
    { name: 'Instagram', icon: '📷', url: settings.instagram },
    { name: 'Twitter', icon: '𝕏', url: settings.twitter },
    { name: 'LinkedIn', icon: 'in', url: settings.linkedin }
  ];

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container">
          <div className="footer__grid">
            <motion.div
              className="footer__brand"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="footer__logo">
                <RoyalLogo size="lg" layout="horizontal" showTagline />
              </div>
              <p className="footer__description">
                {t('footer.description')}
              </p>
              <div className="footer__contact">
                <p>📞 {settings.phone}</p>
                <p>✉️ {settings.email}</p>
                <p>📍 {settings.address}</p>
              </div>
            </motion.div>

            <motion.div
              className="footer__links-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4>{t('footer.sections.ourHotel')}</h4>
              <ul>
                {footerLinks.hotel.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="footer__links-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4>{t('footer.sections.services')}</h4>
              <ul>
                {footerLinks.services.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="footer__links-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4>{t('footer.sections.support')}</h4>
              <ul>
                {footerLinks.support.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <div className="footer__bottom-content">
            <p className="footer__copyright">
              © {currentYear} {t('footer.copyright')}
            </p>
            <div className="footer__social">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  className="footer__social-link"
                  aria-label={social.name}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
