import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { serviceAPI, bookingAPI, userAPI } from '../../services/api';
import { generateButlerPDF } from '../../utils/pdfExport';
import LuxuryButton from '../../components/common/LuxuryButton';
import './ServicePage.css';

const SERVICE_TYPES = [
  { value: 'basic',     price: 200 },
  { value: 'premium',   price: 300 },
  { value: 'exclusive', price: 400 },
];

const DURATIONS = [
  { value: '2hours',   multiplier: 1   },
  { value: '4hours',   multiplier: 1.8 },
  { value: 'half_day', multiplier: 2.5 },
  { value: 'full_day', multiplier: 4   },
];

const INTERACTION_KEYS = ['interactionMinimal', 'interactionModerate', 'interactionVerbose'];
const STYLE_KEYS       = ['styleFormal', 'styleCasual', 'styleDiscrete'];
const BUTLER_TIMES     = ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];
const LANGUAGE_KEYS   = ['english','arabic','french','spanish','german','italian','russian','chinese'];
const LANGUAGE_VALUES = ['English','Arabic','French','Spanish','German','Italian','Russian','Chinese'];

const ButlerService = () => {
  const { t }              = useTranslation();
  const navigate           = useNavigate();
  const { user, updateUser } = useAuth();
  const [step, setStep]               = useState(1);
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [error, setError]             = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [activeRoom, setActiveRoom]   = useState(null);

  // Inline edit state for Name and Phone
  const [editing, setEditing]       = useState({ name: false, phone: false });
  const [editValues, setEditValues] = useState({ name: '', phone: '' });
  const [saving, setSaving]         = useState({ name: false, phone: false });
  const [saveError, setSaveError]   = useState({ name: null, phone: null });

  useEffect(() => {
    if (!user) navigate('/login', { state: { returnTo: '/services/butler' } });
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      bookingAPI.getMyBookings().then(data => {
        const bookings = data.bookings || data || [];
        const active = bookings.find(b =>
          ['CONFIRMED', 'CHECKED_IN', 'PENDING'].includes(b.status)
        );
        if (active?.room?.roomNumber) setActiveRoom(active.room.roomNumber);
      }).catch(() => {});
    }
  }, [user]);

  const startEdit = (field) => {
    const currentVal = field === 'name'
      ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
      : user?.phone || '';
    setEditValues(prev => ({ ...prev, [field]: currentVal }));
    setEditing(prev => ({ ...prev, [field]: true }));
    setSaveError(prev => ({ ...prev, [field]: null }));
  };

  const cancelEdit = (field) => {
    setEditing(prev => ({ ...prev, [field]: false }));
    setSaveError(prev => ({ ...prev, [field]: null }));
  };

  const handleSaveField = async (field) => {
    setSaving(prev => ({ ...prev, [field]: true }));
    setSaveError(prev => ({ ...prev, [field]: null }));
    try {
      let payload = {};
      if (field === 'name') {
        const parts = editValues.name.trim().split(/\s+/);
        payload = { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') || '' };
      } else {
        payload = { phone: editValues.phone.trim() };
      }
      await userAPI.updateProfile(payload);
      updateUser(payload);
      setEditing(prev => ({ ...prev, [field]: false }));
    } catch (err) {
      setSaveError(prev => ({ ...prev, [field]: err.message || 'Save failed' }));
    } finally {
      setSaving(prev => ({ ...prev, [field]: false }));
    }
  };

  const taskOptions = t('butler.taskOptions', { returnObjects: true });

  const [formData, setFormData] = useState({
    serviceType: '', duration: '', language: '', date: '', time: '',
    interactionLevel: '', serviceStyle: '', leavingHotel: '',
    tasks: [], notes: ''
  });

  const handleChange  = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const toggleTask    = value => setFormData(prev => ({
    ...prev,
    tasks: prev.tasks.includes(value) ? prev.tasks.filter(v => v !== value) : [...prev.tasks, value]
  }));

  const calculatePrice = () => {
    const svc = SERVICE_TYPES.find(s => s.value === formData.serviceType);
    const dur = DURATIONS.find(d => d.value === formData.duration);
    if (!svc || !dur) return 0;
    return Math.round(svc.price * dur.multiplier);
  };

  const handleSubmit = async () => {
    setLoading(true); setError(null);
    try {
      const data = await serviceAPI.bookService({
        serviceType: 'butler',
        bookingDetails: { date: formData.date, time: formData.time, duration: formData.duration, serviceType: formData.serviceType, notes: formData.notes },
        formData: { language: formData.language, interactionLevel: formData.interactionLevel, serviceStyle: formData.serviceStyle, leavingHotel: formData.leavingHotel, tasks: formData.tasks }
      });
      setBookingData(data.booking);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (success && bookingData) {
    const svcData = t(`butler.serviceTypes.${formData.serviceType}`, { returnObjects: true });
    return (
      <div className="service-page butler-page">
        <div className="service-success">
          <motion.div className="success-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="success-icon">🎩</div>
            <h2>{t('butler.success.title')}</h2>
            <p className="booking-number">#{bookingData.bookingNumber}</p>
            <div className="booking-details">
              <p><strong>Guest</strong> {user?.firstName} {user?.lastName}</p>
              {user?.idNumber && <p><strong>ID Number</strong> {user.idNumber}</p>}
              {activeRoom && <p><strong>Room</strong> {activeRoom}</p>}
              <p><strong>{t('butler.step3.service')}</strong> {svcData?.label || formData.serviceType}</p>
              <p><strong>{t('butler.step3.duration')}</strong> {formData.duration ? t(`butler.durations.${formData.duration}`) : ''}</p>
              <p><strong>{t('butler.step3.date')}</strong> {formData.date} {formData.time}</p>
              <p><strong>{t('butler.step3.total')}</strong> ${bookingData.totalPrice}</p>
            </div>
            <div className="success-actions">
              <LuxuryButton variant="secondary" onClick={() => generateButlerPDF(bookingData, formData, user, activeRoom)}>
                📄 Download PDF
              </LuxuryButton>
              <LuxuryButton variant="primary" onClick={() => navigate('/services')}>
                {t('butler.success.backToServices')}
              </LuxuryButton>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="service-page butler-page">
      <div className="service-hero butler-hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>{t('butler.hero.title')}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {t('butler.hero.subtitle')}
          </motion.p>
        </div>
      </div>

      <div className="service-content">
        <div className="booking-progress">
          {[1,2,3].map(n => (
            <div key={n} className={`progress-step ${step >= n ? 'active' : ''}`}>
              {n}. {t(`butler.steps.${n}`)}
            </div>
          ))}
        </div>

        {error && <div className="form-error-banner"><p>⚠️ {error}</p><button onClick={() => setError(null)}>×</button></div>}

        {step === 1 && (
          <motion.div className="booking-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2>{t('butler.step1.title')}</h2>

            <div className="form-section">
              <h3>{t('butler.step1.serviceType')}</h3>
              <div className="option-cards">
                {SERVICE_TYPES.map(svc => {
                  const data = t(`butler.serviceTypes.${svc.value}`, { returnObjects: true });
                  return (
                    <div key={svc.value} className={`option-card ${formData.serviceType === svc.value ? 'selected' : ''}`}
                      onClick={() => handleChange('serviceType', svc.value)}>
                      <h4>{data.label}</h4>
                      <p>{data.desc}</p>
                      <span className="price">${svc.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('butler.step1.duration')}</h3>
              <div className="option-buttons">
                {DURATIONS.map(dur => (
                  <button key={dur.value} className={`option-btn ${formData.duration === dur.value ? 'selected' : ''}`}
                    onClick={() => handleChange('duration', dur.value)}>
                    {t(`butler.durations.${dur.value}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('butler.step1.language')}</h3>
              <div className="option-buttons wrap">
                {LANGUAGE_KEYS.map((key, i) => (
                  <button key={key} className={`option-btn ${formData.language === LANGUAGE_VALUES[i] ? 'selected' : ''}`}
                    onClick={() => handleChange('language', LANGUAGE_VALUES[i])}>
                    {t(`butler.languageLabels.${key}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('butler.step1.date')}</label>
                <input type="date" value={formData.date} onChange={e => handleChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label>{t('butler.step1.time')}</label>
                <select value={formData.time} onChange={e => handleChange('time', e.target.value)}>
                  <option value="">{t('spa.step1.selectTime')}</option>
                  {BUTLER_TIMES.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>

            {formData.serviceType && formData.duration && (
              <div className="price-summary">
                <span>{t('butler.step1.estimatedTotal')}</span>
                <strong>${calculatePrice()}</strong>
              </div>
            )}

            <div className="step-actions">
              <LuxuryButton variant="primary" onClick={() => setStep(2)}
                disabled={!formData.serviceType || !formData.duration || !formData.language || !formData.date || !formData.time}>
                {t('butler.continue')}
              </LuxuryButton>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div className="booking-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2>{t('butler.step2.title')}</h2>
            <p className="step-desc">{t('butler.step2.desc')}</p>

            <div className="form-section">
              <h3>{t('butler.step2.interaction')}</h3>
              <div className="option-buttons">
                {INTERACTION_KEYS.map(key => (
                  <button key={key} className={`option-btn ${formData.interactionLevel === key ? 'selected' : ''}`}
                    onClick={() => handleChange('interactionLevel', key)}>
                    {t(`butler.step2.${key}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('butler.step2.style')}</h3>
              <div className="option-buttons">
                {STYLE_KEYS.map(key => (
                  <button key={key} className={`option-btn ${formData.serviceStyle === key ? 'selected' : ''}`}
                    onClick={() => handleChange('serviceStyle', key)}>
                    {t(`butler.step2.${key}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('butler.step2.leaving')}</h3>
              <div className="option-buttons">
                {['leavingYes', 'leavingNo', 'leavingMaybe'].map(key => (
                  <button key={key} className={`option-btn ${formData.leavingHotel === key ? 'selected' : ''}`}
                    onClick={() => handleChange('leavingHotel', key)}>
                    {t(`butler.step2.${key}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('butler.step2.tasks')}</h3>
              <div className="checkbox-grid">
                {Array.isArray(taskOptions) && taskOptions.map(task => (
                  <label key={task} className="checkbox-item">
                    <input type="checkbox" checked={formData.tasks.includes(task)} onChange={() => toggleTask(task)} />
                    <span>{task}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>{t('butler.step3.notes')}</label>
              <textarea value={formData.notes} onChange={e => handleChange('notes', e.target.value)} rows="3" />
            </div>

            <div className="step-actions">
              <LuxuryButton variant="secondary" onClick={() => setStep(1)}>{t('butler.back')}</LuxuryButton>
              <LuxuryButton variant="primary" onClick={() => setStep(3)} disabled={!formData.interactionLevel || !formData.serviceStyle}>
                {t('butler.continue')}
              </LuxuryButton>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div className="booking-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2>{t('butler.step3.title')}</h2>

            {/* ── Auto-filled Guest Details (read-only) ── */}
            <div className="autofill-notice">
              <span className="autofill-icon">🔒</span>
              Your details are automatically filled from your account
            </div>

            <div className="form-row">
              {/* Name — editable */}
              <div className="form-group">
                <div className="detail-field-header">
                  <label>{t('butler.step3.name')}</label>
                  {!editing.name && (
                    <button className="edit-trigger" onClick={() => startEdit('name')}>✏ Edit</button>
                  )}
                </div>
                {editing.name ? (
                  <>
                    <div className="edit-field-row">
                      <input type="text" className="editable-field" value={editValues.name}
                        onChange={e => setEditValues(prev => ({ ...prev, name: e.target.value }))} />
                      <button className="btn-save-field" disabled={saving.name} onClick={() => handleSaveField('name')}>
                        {saving.name ? '…' : 'Save'}
                      </button>
                      <button className="btn-cancel-edit" onClick={() => cancelEdit('name')}>✕</button>
                    </div>
                    {saveError.name && <p className="save-field-error">{saveError.name}</p>}
                  </>
                ) : (
                  <input type="text" value={`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || '—'} readOnly className="readonly-field" />
                )}
              </div>

              {/* Email — always read-only */}
              <div className="form-group">
                <label>{t('butler.step3.email')}</label>
                <input type="email" value={user?.email || ''} readOnly className="readonly-field" />
              </div>
            </div>

            <div className="form-row">
              {/* Phone — editable */}
              <div className="form-group">
                <div className="detail-field-header">
                  <label>{t('butler.step3.phone')}</label>
                  {!editing.phone && (
                    <button className="edit-trigger" onClick={() => startEdit('phone')}>✏ Edit</button>
                  )}
                </div>
                {editing.phone ? (
                  <>
                    <div className="edit-field-row">
                      <input type="tel" className="editable-field" value={editValues.phone}
                        onChange={e => setEditValues(prev => ({ ...prev, phone: e.target.value }))} />
                      <button className="btn-save-field" disabled={saving.phone} onClick={() => handleSaveField('phone')}>
                        {saving.phone ? '…' : 'Save'}
                      </button>
                      <button className="btn-cancel-edit" onClick={() => cancelEdit('phone')}>✕</button>
                    </div>
                    {saveError.phone && <p className="save-field-error">{saveError.phone}</p>}
                  </>
                ) : (
                  <input type="tel" value={user?.phone || '—'} readOnly className="readonly-field" />
                )}
              </div>

              {/* ID Number — always read-only */}
              <div className="form-group">
                <label>Personal ID Number</label>
                <input type="text" value={user?.idNumber || '—'} readOnly className="readonly-field" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('butler.step3.room')}</label>
                <input type="text" value={activeRoom ? `Room ${activeRoom}` : 'No active booking'} readOnly className={`readonly-field ${!activeRoom ? 'readonly-field--warn' : ''}`} />
              </div>
            </div>

            <div className="booking-summary">
              <h3>{t('butler.step3.bookingSummary')}</h3>
              <div className="summary-items">
                <div className="summary-item">
                  <span>{t('butler.step3.service')}</span>
                  <span>{formData.serviceType ? t(`butler.serviceTypes.${formData.serviceType}`, { returnObjects: true })?.label : ''}</span>
                </div>
                <div className="summary-item">
                  <span>{t('butler.step3.duration')}</span>
                  <span>{formData.duration ? t(`butler.durations.${formData.duration}`) : ''}</span>
                </div>
                <div className="summary-item">
                  <span>{t('butler.step3.date')}</span>
                  <span>{formData.date} {formData.time}</span>
                </div>
                <div className="summary-item">
                  <span>Language</span>
                  <span>{formData.language}</span>
                </div>
                {formData.tasks.length > 0 && (
                  <div className="summary-item">
                    <span>{t('butler.step2.tasks')}</span>
                    <span>{formData.tasks.length} selected</span>
                  </div>
                )}
                <div className="summary-item total">
                  <span>{t('butler.step3.total')}</span>
                  <span>${calculatePrice()}</span>
                </div>
              </div>
            </div>

            <div className="step-actions">
              <LuxuryButton variant="secondary" onClick={() => setStep(2)}>{t('butler.back')}</LuxuryButton>
              <LuxuryButton variant="primary" onClick={handleSubmit} disabled={loading}>
                {loading ? t('butler.processing') : t('butler.confirm')}
              </LuxuryButton>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ButlerService;
