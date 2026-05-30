import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LuxuryButton from '../../components/common/LuxuryButton';
import './Contact.css';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="contact-page">
      <motion.div
        className="contact-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1>{t('contact.hero.title')}</h1>
        <p>{t('contact.hero.subtitle')}</p>
      </motion.div>

      <div className="contact-content">
        <div className="contact-info">
          <h2>{t('contact.info.title')}</h2>
          <div className="info-items">
            <div className="info-item">
              <span className="info-icon">📞</span>
              <div>
                <h3>{t('contact.info.phone')}</h3>
                <p>{t('contact.info.phoneValue')}</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">✉️</span>
              <div>
                <h3>{t('contact.info.email')}</h3>
                <p>reservations@plhms.luxury</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">📍</span>
              <div>
                <h3>{t('contact.info.address')}</h3>
                <p>{t('contact.info.addressValue')}</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">🕐</span>
              <div>
                <h3>{t('contact.info.hours')}</h3>
                <p>{t('contact.info.hoursValue')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>{t('contact.form.title')}</h2>
          {submitted ? (
            <div className="success-message">
              <span>✓</span>
              <p>{t('contact.success')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>{t('contact.form.name')} *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('contact.form.email')} *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('contact.form.phone')}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>{t('contact.form.subject')} *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('contact.form.message')} *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                />
              </div>
              <LuxuryButton variant="primary" type="submit">
                {t('contact.form.submit')}
              </LuxuryButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
