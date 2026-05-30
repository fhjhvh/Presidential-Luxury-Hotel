import React, { useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import RoyalLogo from '../../components/common/RoyalLogo';
import './Auth.css';

/* ── SVG icon components ────────────────────────────────────── */
const IconEmail = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="16" height="12" rx="2"/>
    <path d="M2 7l8 5 8-5"/>
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="9" width="12" height="9" rx="2"/>
    <path d="M7 9V6a3 3 0 0 1 6 0v3"/>
  </svg>
);

const IconUser = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="6" r="3.5"/>
    <path d="M2.5 18c0-3.866 3.358-7 7.5-7s7.5 3.134 7.5 7"/>
  </svg>
);

const IconPhone = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 2h4l1.5 3.5-2 1.2a11 11 0 0 0 4.8 4.8l1.2-2L18 11v4a1 1 0 0 1-1 1A15 15 0 0 1 3 3a1 1 0 0 1 1-1h1z"/>
  </svg>
);

const IconId = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="18" height="13" rx="2"/>
    <circle cx="7" cy="10.5" r="2"/>
    <path d="M11 9h5M11 12h4"/>
  </svg>
);

const IconEyeOpen = () => (
  <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M1 10s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z"/>
    <circle cx="10" cy="10" r="2.5"/>
  </svg>
);

const IconEyeClosed = () => (
  <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M14.5 14.5A9.1 9.1 0 0 1 10 16c-5.5 0-9-6-9-6a16 16 0 0 1 4.5-5.2M8.1 4.2A9.3 9.3 0 0 1 10 4c5.5 0 9 6 9 6a16 16 0 0 1-1.9 2.8M1 1l18 18"/>
    <path d="M8.2 8.2a2.5 2.5 0 0 0 3.6 3.6"/>
  </svg>
);

const IconGoogle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const IconApple = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.19 1.28-2.17 3.83.03 3.02 2.65 4.03 2.68 4.04l-.06.21zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

/* ── Password strength helper ───────────────────────────────── */
const getStrength = (pwd) => {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
};

/* ── Reusable field component ───────────────────────────────── */
const Field = ({ label, optional, name, type = 'text', placeholder, value, onChange, onBlur,
                  icon, touched, error, success, disabled, hasToggle, showToggle, onToggle }) => {
  const { t } = useTranslation();
  const hasValue = Boolean(value);
  let cls = 'lauth-field__input';
  if (hasToggle) cls += ' lauth-field__input--has-toggle';
  if (touched && error) cls += ' lauth-field__input--err';
  else if (touched && !error && hasValue) cls += ' lauth-field__input--ok';

  return (
    <div className="lauth-field">
      <label className="lauth-field__label">
        {label}
        {optional && <span className="lauth-field__label-optional">{t('luxuryAuth.optional')}</span>}
      </label>
      <div className="lauth-field__wrap">
        <span className="lauth-field__icon">{icon}</span>
        <input
          type={showToggle !== undefined ? (showToggle ? 'text' : 'password') : type}
          name={name}
          className={cls}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          autoComplete={
            type === 'password' && name === 'confirm' ? 'new-password' :
            type === 'password' && name === 'password' ? (hasToggle ? 'new-password' : 'current-password') :
            type === 'email' ? 'email' :
            name === 'firstName' ? 'given-name' :
            name === 'lastName' ? 'family-name' :
            name === 'phone' ? 'tel' : 'off'
          }
        />
        {onToggle && (
          <button type="button" className="lauth-field__eye" onClick={onToggle} tabIndex={-1} aria-label="Toggle password">
            {showToggle ? <IconEyeOpen /> : <IconEyeClosed />}
          </button>
        )}
      </div>
      {touched && error && <div className="lauth-field__hint lauth-field__hint--err">{error}</div>}
      {touched && !error && success && <div className="lauth-field__hint lauth-field__hint--ok">{success}</div>}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const LuxuryAuth = ({ defaultMode = 'login' }) => {
  const { t } = useTranslation();
  const [mode, setMode]         = useState(defaultMode);
  const [showPwd, setShowPwd]   = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [remember, setRemember] = useState(false);
  const [terms, setTerms]       = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '', idNumber: '' });
  const [regForm, setRegForm]     = useState({
    firstName: '', lastName: '', email: '', phone: '', idNumber: '', password: '', confirm: ''
  });
  const [touched, setTouched]   = useState({});
  const [fieldErr, setFieldErr] = useState({});

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  const pwdStrength = getStrength(regForm.password);
  const STRENGTH_TEXT = ['', t('luxuryAuth.strength.weak'), t('luxuryAuth.strength.fair'), t('luxuryAuth.strength.good'), t('luxuryAuth.strength.strong')];

  /* ── Mode switch ── */
  const switchMode = (m) => {
    setMode(m);
    setError(''); setSuccess('');
    setTouched({}); setFieldErr({});
    setShowPwd(false); setShowConf(false);
  };

  /* ── Validation ── */
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const validate = useCallback((name, value) => {
    if (mode === 'login') {
      if (name === 'email'    && value && !isEmail(value))    return t('luxuryAuth.errors.fieldInvalidEmail');
      if (name === 'password' && value && value.length < 6)   return t('luxuryAuth.errors.fieldPassword6');
    } else {
      if (name === 'firstName' && value && value.trim().length < 2) return t('luxuryAuth.errors.fieldTooShort');
      if (name === 'lastName'  && value && value.trim().length < 2) return t('luxuryAuth.errors.fieldTooShort');
      if (name === 'email'     && value && !isEmail(value))          return t('luxuryAuth.errors.fieldInvalidEmail');
      if (name === 'password'  && value && value.length < 8)         return t('luxuryAuth.errors.fieldPassword8');
      if (name === 'confirm'   && value && value !== regForm.password) return t('luxuryAuth.errors.fieldPasswordsMatch');
    }
    return '';
  }, [mode, regForm.password, t]);

  /* ── Change handlers ── */
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(p => ({ ...p, [name]: value }));
    if (touched[name]) setFieldErr(p => ({ ...p, [name]: validate(name, value) }));
    setError('');
  };

  const handleRegChange = (e) => {
    const { name, value } = e.target;
    setRegForm(p => ({ ...p, [name]: value }));
    if (touched[name]) setFieldErr(p => ({ ...p, [name]: validate(name, value) }));
    if (name === 'password' && touched['confirm']) {
      setFieldErr(p => ({ ...p, confirm: value !== regForm.confirm ? t('luxuryAuth.errors.fieldPasswordsMatch') : '' }));
    }
    setError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    setFieldErr(p => ({ ...p, [name]: validate(name, value) }));
  };

  /* ── Submit ── */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isEmail(loginForm.email))       { setError(t('luxuryAuth.errors.validEmail'));     return; }
    if (loginForm.password.length < 6)   { setError(t('luxuryAuth.errors.passwordMin6')); return; }
    setLoading(true);
    try {
      const res = await login(loginForm.email, loginForm.password, loginForm.idNumber || undefined);
      if (res.success) {
        setSuccess(t('luxuryAuth.login.successMsg', { name: res.user?.firstName || 'Guest' }));
        setTimeout(() => navigate(from, { replace: true }), 1300);
      } else {
        setError(res.error || t('luxuryAuth.errors.invalidCredentials'));
      }
    } catch {
      setError(t('luxuryAuth.errors.connectionError'));
    } finally { setLoading(false); }
  };

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!regForm.firstName.trim() || !regForm.lastName.trim()) { setError(t('luxuryAuth.errors.fullName')); return; }
    if (!isEmail(regForm.email))     { setError(t('luxuryAuth.errors.validEmail')); return; }
    if (regForm.password.length < 8) { setError(t('luxuryAuth.errors.passwordMin8')); return; }
    if (regForm.password !== regForm.confirm) { setError(t('luxuryAuth.errors.passwordsMatch')); return; }
    if (!terms) { setError(t('luxuryAuth.errors.termsRequired')); return; }
    if (!regForm.idNumber.trim()) { setError('Personal ID Number is required'); return; }
    setLoading(true);
    try {
      const res = await register({
        firstName: regForm.firstName.trim(),
        lastName:  regForm.lastName.trim(),
        email:     regForm.email.trim(),
        password:  regForm.password,
        phone:     regForm.phone || undefined,
        idNumber:  regForm.idNumber.trim(),
        role:      'GUEST_NEW',
      });
      if (res.success) {
        setSuccess(t('luxuryAuth.register.successMsg'));
        setTimeout(() => navigate(from, { replace: true }), 1500);
      } else {
        setError(res.error || t('luxuryAuth.errors.registrationFailed'));
      }
    } catch {
      setError(t('luxuryAuth.errors.connectionError'));
    } finally { setLoading(false); }
  };

  /* ── Left panel ── */
  const LeftPanel = () => {
    const [line1, line2] = t('luxuryAuth.leftHeadline').split('\n');
    return (
      <div className="lauth-left">
        <div className="lauth-left__bg" />
        <div className="lauth-left__overlay" />
        <div className="lauth-left__content">
          <div className="lauth-brand">
            <RoyalLogo size="xl" layout="vertical" showTagline />
          </div>

          <div className="lauth-left__main">
            <div className="lauth-left__stars">
              {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
            </div>
            <h2 className="lauth-left__headline">
              {line1}<br />{line2}
            </h2>
            <p className="lauth-left__sub">{t('luxuryAuth.leftSub')}</p>
            <div className="lauth-left__divider" />
            <div className="lauth-left__badges">
              <span className="lauth-left__badge">{t('luxuryAuth.badge1')}</span>
              <span className="lauth-left__badge">{t('luxuryAuth.badge2')}</span>
              <span className="lauth-left__badge">{t('luxuryAuth.badge3')}</span>
            </div>
          </div>

          <blockquote className="lauth-left__quote">
            {t('luxuryAuth.quote')}
          </blockquote>
        </div>
      </div>
    );
  };

  /* ── Shared social block ── */
  const SocialBlock = () => (
    <>
      <div className="lauth-divider">{t('luxuryAuth.orContinueWith')}</div>
      <div className="lauth-social">
        <button type="button" className="lauth-social-btn">
          <IconGoogle /> Google
        </button>
        <button type="button" className="lauth-social-btn">
          <IconApple /> Apple
        </button>
      </div>
    </>
  );

  /* ── Render ── */
  return (
    <div className="lauth-page">
      <LeftPanel />

      <div className="lauth-right">
        <button className="lauth-back" onClick={handleBack} aria-label={t('luxuryAuth.back')}>
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4l-6 6 6 6"/>
          </svg>
          {t('luxuryAuth.back')}
        </button>
        <div className="lauth-form-wrap">

          {/* Mobile brand */}
          <div className="lauth-mobile-brand">
            <RoyalLogo size="sm" layout="horizontal" />
          </div>

          {/* Tabs */}
          <div className="lauth-tabs">
            <button className={`lauth-tab${mode === 'login' ? ' lauth-tab--active' : ''}`}
              onClick={() => switchMode('login')}>
              {t('luxuryAuth.tabs.signIn')}
            </button>
            <button className={`lauth-tab${mode === 'register' ? ' lauth-tab--active' : ''}`}
              onClick={() => switchMode('register')}>
              {t('luxuryAuth.tabs.createAccount')}
            </button>
          </div>

          <AnimatePresence mode="wait">

            {/* ── LOGIN ── */}
            {mode === 'login' && (
              <motion.div key="login"
                initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }} transition={{ duration: 0.25 }}>

                <div className="lauth-heading">
                  <h1 className="lauth-heading__title">{t('luxuryAuth.login.title')}</h1>
                  <p className="lauth-heading__sub">{t('luxuryAuth.login.subtitle')}</p>
                </div>

                {error && (
                  <motion.div className="lauth-alert lauth-alert--error"
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                    ⚠ {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div className="lauth-alert lauth-alert--success"
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                    ✓ {success}
                  </motion.div>
                )}

                <form onSubmit={handleLoginSubmit} noValidate>
                  <Field
                    label={t('luxuryAuth.login.email')} name="email" type="email"
                    placeholder={t('luxuryAuth.login.emailPlaceholder')} value={loginForm.email}
                    onChange={handleLoginChange} onBlur={handleBlur}
                    icon={<IconEmail />} touched={touched.email} error={fieldErr.email}
                    disabled={loading}
                  />
                  <Field
                    label="Personal ID Number" name="idNumber" optional
                    placeholder="Enter your personal ID" value={loginForm.idNumber}
                    onChange={handleLoginChange}
                    icon={<IconId />} disabled={loading}
                  />
                  <Field
                    label={t('luxuryAuth.login.password')} name="password" hasToggle
                    placeholder={t('luxuryAuth.login.passwordPlaceholder')} value={loginForm.password}
                    onChange={handleLoginChange} onBlur={handleBlur}
                    icon={<IconLock />} touched={touched.password} error={fieldErr.password}
                    disabled={loading} showToggle={showPwd} onToggle={() => setShowPwd(p => !p)}
                  />

                  <div className="lauth-extras">
                    <label className="lauth-remember">
                      <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                      {t('luxuryAuth.login.rememberMe')}
                    </label>
                    <Link to="/forgot-password" className="lauth-forgot">{t('luxuryAuth.login.forgotPassword')}</Link>
                  </div>

                  <button type="submit" className="lauth-submit" disabled={loading || !!success}>
                    {loading
                      ? <><span className="lauth-spinner" /> {t('luxuryAuth.login.submitting')}</>
                      : t('luxuryAuth.login.submit')}
                  </button>
                </form>

                <SocialBlock />

                <div className="lauth-footer">
                  {t('luxuryAuth.login.noAccount')}
                  <button className="lauth-footer__switch" onClick={() => switchMode('register')}>
                    {t('luxuryAuth.login.createOne')}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── REGISTER ── */}
            {mode === 'register' && (
              <motion.div key="register"
                initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.25 }}>

                <div className="lauth-heading">
                  <h1 className="lauth-heading__title">
                    {t('luxuryAuth.register.title').split('\n').map((line, i, arr) => (
                      <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
                    ))}
                  </h1>
                  <p className="lauth-heading__sub">{t('luxuryAuth.register.subtitle')}</p>
                </div>

                {error && (
                  <motion.div className="lauth-alert lauth-alert--error"
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                    ⚠ {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div className="lauth-alert lauth-alert--success"
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                    ✓ {success}
                  </motion.div>
                )}

                <form onSubmit={handleRegSubmit} noValidate>
                  <div className="lauth-row">
                    <Field
                      label={t('luxuryAuth.register.firstName')} name="firstName" placeholder="John"
                      value={regForm.firstName} onChange={handleRegChange} onBlur={handleBlur}
                      icon={<IconUser />} touched={touched.firstName} error={fieldErr.firstName}
                      disabled={loading}
                    />
                    <Field
                      label={t('luxuryAuth.register.lastName')} name="lastName" placeholder="Doe"
                      value={regForm.lastName} onChange={handleRegChange} onBlur={handleBlur}
                      icon={<IconUser />} touched={touched.lastName} error={fieldErr.lastName}
                      disabled={loading}
                    />
                  </div>

                  <Field
                    label={t('luxuryAuth.register.email')} name="email" type="email"
                    placeholder={t('luxuryAuth.register.emailPlaceholder')} value={regForm.email}
                    onChange={handleRegChange} onBlur={handleBlur}
                    icon={<IconEmail />} touched={touched.email} error={fieldErr.email}
                    disabled={loading}
                  />

                  <Field
                    label={t('luxuryAuth.register.phone')} name="phone" type="tel" optional
                    placeholder="+1 (555) 000-0000" value={regForm.phone}
                    onChange={handleRegChange}
                    icon={<IconPhone />} disabled={loading}
                  />

                  <Field
                    label="Personal ID Number" name="idNumber"
                    placeholder="Passport / National ID / Resident ID"
                    value={regForm.idNumber}
                    onChange={handleRegChange} onBlur={handleBlur}
                    icon={<IconId />}
                    touched={touched.idNumber}
                    error={touched.idNumber && !regForm.idNumber.trim() ? 'ID Number is required' : ''}
                    disabled={loading}
                  />

                  <Field
                    label={t('luxuryAuth.register.password')} name="password" hasToggle
                    placeholder={t('luxuryAuth.register.passwordPlaceholder')} value={regForm.password}
                    onChange={handleRegChange} onBlur={handleBlur}
                    icon={<IconLock />} touched={touched.password} error={fieldErr.password}
                    disabled={loading} showToggle={showPwd} onToggle={() => setShowPwd(p => !p)}
                  />

                  {/* Strength indicator */}
                  {regForm.password && (
                    <div className={`lauth-strength lauth-strength--${pwdStrength}`}>
                      <div className="lauth-strength__bars">
                        {[1,2,3,4].map(n => <div key={n} className="lauth-strength__bar" />)}
                      </div>
                      <span className="lauth-strength__text">{STRENGTH_TEXT[pwdStrength]}</span>
                    </div>
                  )}

                  <Field
                    label={t('luxuryAuth.register.confirmPassword')} name="confirm" hasToggle
                    placeholder={t('luxuryAuth.register.confirmPlaceholder')} value={regForm.confirm}
                    onChange={handleRegChange} onBlur={handleBlur}
                    icon={<IconLock />} touched={touched.confirm} error={fieldErr.confirm}
                    success={!fieldErr.confirm && regForm.confirm ? t('luxuryAuth.register.passwordsMatch') : ''}
                    disabled={loading} showToggle={showConf} onToggle={() => setShowConf(p => !p)}
                  />

                  <label className="lauth-terms">
                    <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} />
                    {t('luxuryAuth.register.termsAgree')}{' '}
                    <Link to="/terms" target="_blank" rel="noopener noreferrer">{t('luxuryAuth.register.termsOf')}</Link>
                    {' '}{t('luxuryAuth.register.and')}{' '}
                    <Link to="/privacy" target="_blank" rel="noopener noreferrer">{t('luxuryAuth.register.privacyPolicy')}</Link>
                  </label>

                  <button type="submit" className="lauth-submit" disabled={loading || !!success}>
                    {loading
                      ? <><span className="lauth-spinner" /> {t('luxuryAuth.register.submitting')}</>
                      : t('luxuryAuth.register.submit')}
                  </button>
                </form>

                <SocialBlock />

                <div className="lauth-footer">
                  {t('luxuryAuth.register.haveAccount')}
                  <button className="lauth-footer__switch" onClick={() => switchMode('login')}>
                    {t('luxuryAuth.register.signIn')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LuxuryAuth;
