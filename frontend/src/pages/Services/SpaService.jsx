import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { serviceAPI, bookingAPI, userAPI } from '../../services/api';
import LuxuryButton from '../../components/common/LuxuryButton';
import './ServicePage.css';

const SESSION_TYPES = [
  { value: 'relaxation',   price: 150 },
  { value: 'deep_tissue',  price: 180 },
  { value: 'hot_stone',    price: 200 },
  { value: 'aromatherapy', price: 170 },
  { value: 'couples',      price: 280 },
];

const DURATIONS = [
  { value: '30min',  multiplier: 0.5 },
  { value: '60min',  multiplier: 1   },
  { value: '90min',  multiplier: 1.4 },
  { value: '120min', multiplier: 1.8 },
];

const LOCATIONS = [
  { value: 'spa_room',      extra: 0  },
  { value: 'private_suite', extra: 75 },
  { value: 'in_room',       extra: 50 },
];

const PRESSURE_KEYS  = ['pressureLight', 'pressureSoft', 'pressureMedium', 'pressureFirm', 'pressureDeep'];
const THERAPIST_KEYS = ['therapistMale', 'therapistFemale', 'therapistNoPreference'];
const STYLE_KEYS     = ['styleSilent', 'styleMusic', 'styleNature'];

const SpaService = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [step, setStep]               = useState(1);
  const [activeRoom, setActiveRoom]   = useState(null);
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [error, setError]             = useState(null);
  const [bookingData, setBookingData] = useState(null);

  const [editing, setEditing]       = useState({ name: false, phone: false });
  const [editValues, setEditValues] = useState({ name: '', phone: '' });
  const [saving, setSaving]         = useState({ name: false, phone: false });
  const [saveError, setSaveError]   = useState({ name: null, phone: null });

  const goalOptions   = t('spa.step2.goalOptions',  { returnObjects: true });
  const focusAreaOpts = t('spa.focusAreas',         { returnObjects: true });
  const medicalOpts   = t('spa.medicalIssues',      { returnObjects: true });

  useEffect(() => {
    if (!user) navigate('/access', { state: { from: '/services/spa' } });
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    bookingAPI.getMyBookings().then(data => {
      const bookings = data.bookings || data || [];
      const active = bookings.find(b =>
        ['CONFIRMED', 'CHECKED_IN', 'PENDING'].includes(b.status)
      );
      if (active?.room?.roomNumber) setActiveRoom(active.room.roomNumber);
    }).catch(() => {});
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

  const [formData, setFormData] = useState({
    sessionType: '', duration: '', location: '', date: '', time: '',
    hasExperience: '', sessionGoal: '', focusAreas: [], medicalIssues: [],
    pressureLevel: '', therapistPreference: '', sessionStyle: '', notes: ''
  });

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const toggleArray  = (field, value) => setFormData(prev => ({
    ...prev,
    [field]: prev[field].includes(value) ? prev[field].filter(v => v !== value) : [...prev[field], value]
  }));

  const calculatePrice = () => {
    const session  = SESSION_TYPES.find(s => s.value === formData.sessionType);
    const duration = DURATIONS.find(d => d.value === formData.duration);
    const location = LOCATIONS.find(l => l.value === formData.location);
    if (!session || !duration) return 0;
    return Math.round(session.price * duration.multiplier + (location?.extra || 0));
  };

  const handleSubmit = async () => {
    setLoading(true); setError(null);
    try {
      const data = await serviceAPI.bookService({
        serviceType: 'spa',
        bookingDetails: { date: formData.date, time: formData.time, duration: formData.duration, sessionType: formData.sessionType, location: formData.location, notes: formData.notes },
        formData: { hasExperience: formData.hasExperience, sessionGoal: formData.sessionGoal, focusAreas: formData.focusAreas, medicalIssues: formData.medicalIssues, pressureLevel: formData.pressureLevel, therapistPreference: formData.therapistPreference, sessionStyle: formData.sessionStyle }
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
    const selectedType = SESSION_TYPES.find(s => s.value === formData.sessionType);
    const selectedDur  = DURATIONS.find(d => d.value === formData.duration);
    return (
      <div className="service-page spa-page">
        <div className="service-success">
          <motion.div className="success-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="success-icon">✨</div>
            <h2>{t('spa.success.title')}</h2>
            <p className="booking-number">#{bookingData.bookingNumber}</p>
            <div className="booking-details">
              <p><strong>Guest</strong> {user?.firstName} {user?.lastName}</p>
              {user?.idNumber && <p><strong>ID Number</strong> {user.idNumber}</p>}
              {activeRoom && <p><strong>Room</strong> {activeRoom}</p>}
              <p><strong>{t('spa.success.service')}:</strong> {t('spa.success.serviceValue')}</p>
              {selectedType && <p><strong>{t('spa.success.type')}:</strong> {t(`spa.sessionTypes.${selectedType.value}.label`)}</p>}
              <p><strong>{t('spa.success.date')}:</strong> {formData.date}</p>
              <p><strong>{t('spa.success.time')}:</strong> {formData.time}</p>
              {selectedDur && <p><strong>{t('spa.success.duration')}:</strong> {t(`spa.durations.${selectedDur.value}`)}</p>}
              <p><strong>{t('spa.success.total')}:</strong> ${bookingData.totalPrice}</p>
            </div>
            <div className="success-actions">
              <LuxuryButton variant="primary" onClick={() => navigate('/services')}>
                {t('spa.success.backToServices')}
              </LuxuryButton>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="service-page spa-page">
      <div className="service-hero spa-hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            {t('spa.hero.title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {t('spa.hero.subtitle')}
          </motion.p>
        </div>
      </div>

      <div className="service-content">
        <div className="booking-progress">
          {[1,2,3].map(n => (
            <div key={n} className={`progress-step ${step >= n ? 'active' : ''}`}>
              {n}. {t(`spa.steps.${n}`)}
            </div>
          ))}
        </div>

        {error && (
          <div className="form-error-banner">
            <p>⚠️ {error}</p>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {step === 1 && (
          <motion.div className="booking-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2>{t('spa.step1.title')}</h2>

            <div className="form-section">
              <h3>{t('spa.step1.sessionType')}</h3>
              <div className="option-cards">
                {SESSION_TYPES.map(type => {
                  const typeData = t(`spa.sessionTypes.${type.value}`, { returnObjects: true });
                  return (
                    <div key={type.value} className={`option-card ${formData.sessionType === type.value ? 'selected' : ''}`}
                      onClick={() => handleChange('sessionType', type.value)}>
                      <h4>{typeData.label}</h4>
                      <p>{typeData.desc}</p>
                      <span className="price">{t('spa.from')}{type.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('spa.step1.duration')}</h3>
              <div className="option-buttons">
                {DURATIONS.map(dur => (
                  <button key={dur.value} className={`option-btn ${formData.duration === dur.value ? 'selected' : ''}`}
                    onClick={() => handleChange('duration', dur.value)}>
                    {t(`spa.durations.${dur.value}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('spa.step1.location')}</h3>
              <div className="option-cards horizontal">
                {LOCATIONS.map(loc => (
                  <div key={loc.value} className={`option-card ${formData.location === loc.value ? 'selected' : ''}`}
                    onClick={() => handleChange('location', loc.value)}>
                    <h4>{t(`spa.locations.${loc.value}`)}</h4>
                    {loc.extra > 0 && <span className="extra">+${loc.extra}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('spa.step1.date')}</label>
                <input type="date" value={formData.date} onChange={e => handleChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label>{t('spa.step1.time')}</label>
                <select value={formData.time} onChange={e => handleChange('time', e.target.value)}>
                  <option value="">{t('spa.step1.selectTime')}</option>
                  {['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00','19:00'].map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>

            {formData.sessionType && formData.duration && (
              <div className="price-summary">
                <span>{t('spa.step1.estimatedTotal')}</span>
                <strong>${calculatePrice()}</strong>
              </div>
            )}

            <div className="step-actions">
              <LuxuryButton variant="secondary" onClick={() => navigate('/services')}>{t('spa.back')}</LuxuryButton>
              <LuxuryButton variant="primary" onClick={() => setStep(2)}
                disabled={!formData.sessionType || !formData.duration || !formData.location || !formData.date || !formData.time}>
                {t('spa.continue')}
              </LuxuryButton>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div className="booking-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2>{t('spa.step2.title')}</h2>
            <p className="step-desc">{t('spa.step2.desc')}</p>

            <div className="form-section">
              <h3>{t('spa.step2.experienceQuestion')}</h3>
              <div className="option-buttons">
                <button className={`option-btn ${formData.hasExperience === 'yes' ? 'selected' : ''}`}
                  onClick={() => handleChange('hasExperience', 'yes')}>{t('spa.step2.experienceYes')}</button>
                <button className={`option-btn ${formData.hasExperience === 'no' ? 'selected' : ''}`}
                  onClick={() => handleChange('hasExperience', 'no')}>{t('spa.step2.experienceNo')}</button>
              </div>
            </div>

            <div className="form-section">
              <h3>{t('spa.step2.goal')}</h3>
              <div className="option-buttons wrap">
                {Array.isArray(goalOptions) && goalOptions.map(goal => (
                  <button key={goal} className={`option-btn ${formData.sessionGoal === goal ? 'selected' : ''}`}
                    onClick={() => handleChange('sessionGoal', goal)}>{goal}</button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('spa.step2.focusAreas')}</h3>
              <div className="checkbox-grid">
                {Array.isArray(focusAreaOpts) && focusAreaOpts.map(area => (
                  <label key={area} className="checkbox-item">
                    <input type="checkbox" checked={formData.focusAreas.includes(area)}
                      onChange={() => toggleArray('focusAreas', area)} />
                    <span>{area}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('spa.step2.medicalIssues')}</h3>
              <div className="checkbox-grid">
                {Array.isArray(medicalOpts) && medicalOpts.map(issue => (
                  <label key={issue} className="checkbox-item">
                    <input type="checkbox" checked={formData.medicalIssues.includes(issue)}
                      onChange={() => toggleArray('medicalIssues', issue)} />
                    <span>{issue}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('spa.step2.pressure')}</h3>
              <div className="option-buttons">
                {PRESSURE_KEYS.map(key => (
                  <button key={key} className={`option-btn ${formData.pressureLevel === key ? 'selected' : ''}`}
                    onClick={() => handleChange('pressureLevel', key)}>{t(`spa.step2.${key}`)}</button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-section half">
                <h3>{t('spa.step2.therapist')}</h3>
                <div className="option-buttons">
                  {THERAPIST_KEYS.map(key => (
                    <button key={key} className={`option-btn ${formData.therapistPreference === key ? 'selected' : ''}`}
                      onClick={() => handleChange('therapistPreference', key)}>{t(`spa.step2.${key}`)}</button>
                  ))}
                </div>
              </div>
              <div className="form-section half">
                <h3>{t('spa.step2.style')}</h3>
                <div className="option-buttons">
                  {STYLE_KEYS.map(key => (
                    <button key={key} className={`option-btn ${formData.sessionStyle === key ? 'selected' : ''}`}
                      onClick={() => handleChange('sessionStyle', key)}>{t(`spa.step2.${key}`)}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>{t('spa.step3.notes')}</label>
              <textarea value={formData.notes} onChange={e => handleChange('notes', e.target.value)} rows="3" />
            </div>

            <div className="step-actions">
              <LuxuryButton variant="secondary" onClick={() => setStep(1)}>{t('spa.back')}</LuxuryButton>
              <LuxuryButton variant="primary" onClick={() => setStep(3)}
                disabled={!formData.sessionGoal || !formData.pressureLevel}>
                {t('spa.continue')}
              </LuxuryButton>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div className="booking-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2>{t('spa.step3.title')}</h2>

            <div className="autofill-notice">
              <span className="autofill-icon">🔒</span>
              Your details are automatically filled from your account
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="detail-field-header">
                  <label>{t('spa.step3.name')}</label>
                  {!editing.name && <button className="edit-trigger" onClick={() => startEdit('name')}>✏ Edit</button>}
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

              <div className="form-group">
                <label>{t('spa.step3.email')}</label>
                <input type="email" value={user?.email || ''} readOnly className="readonly-field" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="detail-field-header">
                  <label>{t('spa.step3.phone')}</label>
                  {!editing.phone && <button className="edit-trigger" onClick={() => startEdit('phone')}>✏ Edit</button>}
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

              <div className="form-group">
                <label>Personal ID Number</label>
                <input type="text" value={user?.idNumber || '—'} readOnly className="readonly-field" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Room</label>
                <input type="text" value={activeRoom ? `Room ${activeRoom}` : 'No active booking'} readOnly
                  className={`readonly-field ${!activeRoom ? 'readonly-field--warn' : ''}`} />
              </div>
            </div>

            <div className="booking-summary">
              <h3>{t('spa.step3.bookingSummary')}</h3>
              <div className="summary-items">
                <div className="summary-item">
                  <span>{t('spa.step3.service')}</span>
                  <span>{t('spa.success.serviceValue')}</span>
                </div>
                <div className="summary-item">
                  <span>{t('spa.step3.duration')}</span>
                  <span>{formData.duration ? t(`spa.durations.${formData.duration}`) : ''}</span>
                </div>
                <div className="summary-item">
                  <span>{t('spa.step3.location')}</span>
                  <span>{formData.location ? t(`spa.locations.${formData.location}`) : ''}</span>
                </div>
                <div className="summary-item">
                  <span>{t('spa.step3.dateTime')}</span>
                  <span>{formData.date} {t('spa.step3.at')} {formData.time}</span>
                </div>
                <div className="summary-item total">
                  <span>{t('spa.step3.total')}</span>
                  <span>${calculatePrice()}</span>
                </div>
              </div>
            </div>

            <div className="step-actions">
              <LuxuryButton variant="secondary" onClick={() => setStep(2)}>{t('spa.back')}</LuxuryButton>
              <LuxuryButton variant="primary" onClick={handleSubmit} disabled={loading}>
                {loading ? t('spa.processing') : t('spa.confirm')}
              </LuxuryButton>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SpaService;
