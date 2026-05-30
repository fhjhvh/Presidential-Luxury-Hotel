import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Auth.css';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail]         = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const navigate = useNavigate();

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) { setError(t('forgotPassword.invalidEmail')); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const [line1, line2] = t('forgotPassword.leftHeadline').split('\n');

  return (
    <div className="lauth-page">
      {/* Left panel */}
      <div className="lauth-left">
        <div className="lauth-left__bg" />
        <div className="lauth-left__overlay" />
        <div className="lauth-left__content">
          <div className="lauth-brand">
            <div className="lauth-brand__icon">♛</div>
            <span className="lauth-brand__name">{t('luxuryAuth.brand')}</span>
          </div>
          <div className="lauth-left__main">
            <div className="lauth-left__stars">
              {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
            </div>
            <h2 className="lauth-left__headline">
              {line1}<br />{line2}
            </h2>
            <p className="lauth-left__sub">{t('forgotPassword.leftSub')}</p>
          </div>
          <blockquote className="lauth-left__quote">
            {t('forgotPassword.quote')}
          </blockquote>
        </div>
      </div>

      {/* Right panel */}
      <div className="lauth-right">
        <div className="lauth-form-wrap">

          <div className="lauth-mobile-brand">
            <div className="lauth-mobile-brand__icon">♛</div>
            <div className="lauth-mobile-brand__name">{t('luxuryAuth.brand')}</div>
          </div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div key="form"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>

                <div className="lauth-heading">
                  <h1 className="lauth-heading__title">{t('forgotPassword.title')}</h1>
                  <p className="lauth-heading__sub">{t('forgotPassword.subtitle')}</p>
                </div>

                {error && (
                  <div className="lauth-alert lauth-alert--error">⚠ {error}</div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="lauth-field">
                    <label className="lauth-field__label">{t('forgotPassword.emailLabel')}</label>
                    <div className="lauth-field__wrap">
                      <span className="lauth-field__icon">
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="16" height="12" rx="2"/>
                          <path d="M2 7l8 5 8-5"/>
                        </svg>
                      </span>
                      <input
                        type="email"
                        className="lauth-field__input"
                        placeholder={t('forgotPassword.emailPlaceholder')}
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError(''); }}
                        disabled={loading}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <button type="submit" className="lauth-submit" disabled={loading || !email}>
                    {loading
                      ? <><span className="lauth-spinner" /> {t('forgotPassword.sending')}</>
                      : t('forgotPassword.sendButton')}
                  </button>
                </form>

                <div className="lauth-footer">
                  {t('forgotPassword.rememberedPassword')}
                  <button className="lauth-footer__switch" onClick={() => navigate('/login')}>
                    {t('forgotPassword.signIn')}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="sent"
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                style={{ textAlign: 'center', padding: '1rem 0 2rem' }}>

                <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem',
                  filter: 'drop-shadow(0 0 12px rgba(200,169,106,0.5))' }}>✉</div>

                <div className="lauth-heading" style={{ textAlign: 'center' }}>
                  <h1 className="lauth-heading__title">{t('forgotPassword.successTitle')}</h1>
                  <p className="lauth-heading__sub">{t('forgotPassword.successSubtitle')}</p>
                </div>

                <div style={{
                  color: '#C8A96A', fontWeight: 700, fontSize: '0.95rem',
                  margin: '0.25rem 0 1.5rem', wordBreak: 'break-all'
                }}>
                  {email}
                </div>

                <div style={{
                  background: 'rgba(200,169,106,0.08)',
                  border: '1px solid rgba(200,169,106,0.2)',
                  borderRadius: '10px', padding: '1rem 1.25rem',
                  fontSize: '0.85rem', color: 'rgba(249,250,251,0.55)',
                  lineHeight: 1.65, marginBottom: '1.75rem'
                }}>
                  {t('forgotPassword.didntReceive')}{' '}
                  <button onClick={() => setSubmitted(false)}
                    style={{ background: 'none', border: 'none', color: '#C8A96A',
                      cursor: 'pointer', fontWeight: 700, padding: 0, fontFamily: 'inherit' }}>
                    {t('forgotPassword.tryAgain')}
                  </button>
                </div>

                <button className="lauth-submit" onClick={() => navigate('/login')}>
                  {t('forgotPassword.backToSignIn')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
