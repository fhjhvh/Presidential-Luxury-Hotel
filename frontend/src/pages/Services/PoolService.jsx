import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { serviceAPI, bookingAPI, userAPI } from '../../services/api';
import LuxuryButton from '../../components/common/LuxuryButton';
import './ServicePage.css';

const POOL_TYPES = [
  { value: 'shared',  price: 40  },
  { value: 'private', price: 120 },
];

const DURATIONS = [
  { value: '1hour',    multiplier: 1   },
  { value: '2hours',   multiplier: 1.8 },
  { value: 'half_day', multiplier: 3   },
  { value: 'full_day', multiplier: 5   },
];

const ABILITY_KEYS = ['abilityBeginner', 'abilityIntermediate', 'abilityAdvanced'];
const TEMP_KEYS    = ['tempCool', 'tempModerate', 'tempWarm'];
const SWIM_TIMES   = ['06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00'];

const PoolService = () => {
  const { t }              = useTranslation();
  const navigate           = useNavigate();
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

  useEffect(() => {
    if (!user) navigate('/login', { state: { returnTo: '/services/pool' } });
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
    poolType: '', duration: '', swimmingCoach: '', date: '', time: '',
    swimmingAbility: '', goal: '', waterTemperature: '', numberOfPeople: '1', notes: ''
  });

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const calculatePrice = () => {
    const pool     = POOL_TYPES.find(p => p.value === formData.poolType);
    const duration = DURATIONS.find(d => d.value === formData.duration);
    let price      = (pool?.price || 0) * (duration?.multiplier || 1);
    if (formData.swimmingCoach === 'yes') price += 60;
    return Math.round(price);
  };

  const handleSubmit = async () => {
    setLoading(true); setError(null);
    try {
      const data = await serviceAPI.bookService({
        serviceType: 'pool',
        bookingDetails: { date: formData.date, time: formData.time, duration: formData.duration, poolType: formData.poolType, swimmingCoach: formData.swimmingCoach, notes: formData.notes },
        formData: { swimmingAbility: formData.swimmingAbility, goal: formData.goal, waterTemperature: formData.waterTemperature, numberOfPeople: formData.numberOfPeople }
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
    return (
      <div className="service-page pool-page">
        <div className="service-success">
          <motion.div className="success-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="success-icon">🏊</div>
            <h2>{t('pool.success.title')}</h2>
            <p className="booking-number">#{bookingData.bookingNumber}</p>
            <div className="booking-details">
              <p><strong>Guest</strong> {user?.firstName} {user?.lastName}</p>
              {user?.idNumber && <p><strong>ID Number</strong> {user.idNumber}</p>}
              {activeRoom && <p><strong>Room</strong> {activeRoom}</p>}
              <p><strong>{t('pool.step3.poolType')}</strong> {formData.poolType ? t(`pool.poolTypes.${formData.poolType}.label`) : ''}</p>
              <p><strong>{t('pool.step3.duration')}</strong> {formData.duration ? t(`pool.durations.${formData.duration}`) : ''}</p>
              <p><strong>{t('pool.step3.date')}</strong> {formData.date} {formData.time}</p>
              <p><strong>{t('pool.step3.total')}</strong> ${bookingData.totalPrice}</p>
            </div>
            <div className="success-actions">
              <LuxuryButton variant="primary" onClick={() => navigate('/services')}>
                {t('pool.success.backToServices')}
              </LuxuryButton>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="service-page pool-page">
      <div className="service-hero pool-hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>{t('pool.hero.title')}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {t('pool.hero.subtitle')}
          </motion.p>
        </div>
      </div>

      <div className="service-content">
        <div className="booking-progress">
          {[1,2,3].map(n => (
            <div key={n} className={`progress-step ${step >= n ? 'active' : ''}`}>
              {n}. {t(`pool.steps.${n}`)}
            </div>
          ))}
        </div>

        {error && <div className="form-error-banner"><p>⚠️ {error}</p><button onClick={() => setError(null)}>×</button></div>}

        {step === 1 && (
          <motion.div className="booking-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2>{t('pool.step1.title')}</h2>

            <div className="form-section">
              <h3>{t('pool.step1.poolType')}</h3>
              <div className="option-cards horizontal">
                {POOL_TYPES.map(pool => {
                  const data = t(`pool.poolTypes.${pool.value}`, { returnObjects: true });
                  return (
                    <div key={pool.value} className={`option-card ${formData.poolType === pool.value ? 'selected' : ''}`}
                      onClick={() => handleChange('poolType', pool.value)}>
                      <h4>{data.label}</h4>
                      <p>{data.desc}</p>
                      <span className="price">${pool.price}/hr</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('pool.step1.duration')}</h3>
              <div className="option-buttons">
                {DURATIONS.map(dur => (
                  <button key={dur.value} className={`option-btn ${formData.duration === dur.value ? 'selected' : ''}`}
                    onClick={() => handleChange('duration', dur.value)}>
                    {t(`pool.durations.${dur.value}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('pool.step1.coach')}</h3>
              <div className="option-cards horizontal">
                <div className={`option-card ${formData.swimmingCoach === 'yes' ? 'selected' : ''}`}
                  onClick={() => handleChange('swimmingCoach', 'yes')}>
                  <h4>{t('pool.step1.coachYes')}</h4>
                </div>
                <div className={`option-card ${formData.swimmingCoach === 'no' ? 'selected' : ''}`}
                  onClick={() => handleChange('swimmingCoach', 'no')}>
                  <h4>{t('pool.step1.coachNo')}</h4>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('pool.step1.date')}</label>
                <input type="date" value={formData.date} onChange={e => handleChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label>{t('pool.step1.time')}</label>
                <select value={formData.time} onChange={e => handleChange('time', e.target.value)}>
                  <option value="">{t('spa.step1.selectTime')}</option>
                  {SWIM_TIMES.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>

            {formData.poolType && formData.duration && (
              <div className="price-summary">
                <span>{t('pool.step1.estimatedTotal')}</span>
                <strong>${calculatePrice()}</strong>
              </div>
            )}

            <div className="step-actions">
              <LuxuryButton variant="secondary" onClick={() => navigate('/services')}>{t('pool.back')}</LuxuryButton>
              <LuxuryButton variant="primary" onClick={() => setStep(2)}
                disabled={!formData.poolType || !formData.duration || !formData.date || !formData.time}>
                {t('pool.continue')}
              </LuxuryButton>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div className="booking-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2>{t('pool.step2.title')}</h2>
            <p className="step-desc">{t('pool.step2.desc')}</p>

            <div className="form-section">
              <h3>{t('pool.step2.ability')}</h3>
              <div className="option-buttons">
                {ABILITY_KEYS.map(key => (
                  <button key={key} className={`option-btn ${formData.swimmingAbility === key ? 'selected' : ''}`}
                    onClick={() => handleChange('swimmingAbility', key)}>{t(`pool.step2.${key}`)}</button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('pool.step2.goal')}</h3>
              <div className="option-buttons wrap">
                {t('pool.step2.goalOptions', { returnObjects: true }).map((goal, i) => (
                  <button key={i} className={`option-btn ${formData.goal === goal ? 'selected' : ''}`}
                    onClick={() => handleChange('goal', goal)}>{goal}</button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('pool.step2.temperature')}</h3>
              <div className="option-buttons">
                {TEMP_KEYS.map(key => (
                  <button key={key} className={`option-btn ${formData.waterTemperature === key ? 'selected' : ''}`}
                    onClick={() => handleChange('waterTemperature', key)}>{t(`pool.step2.${key}`)}</button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>{t('pool.step1.people')}</label>
              <select value={formData.numberOfPeople} onChange={e => handleChange('numberOfPeople', e.target.value)}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>{t('pool.step3.notes')}</label>
              <textarea value={formData.notes} onChange={e => handleChange('notes', e.target.value)} rows="3" />
            </div>

            <div className="step-actions">
              <LuxuryButton variant="secondary" onClick={() => setStep(1)}>{t('pool.back')}</LuxuryButton>
              <LuxuryButton variant="primary" onClick={() => setStep(3)} disabled={!formData.swimmingAbility || !formData.goal}>
                {t('pool.continue')}
              </LuxuryButton>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div className="booking-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2>{t('pool.step3.title')}</h2>

            <div className="autofill-notice">
              <span className="autofill-icon">🔒</span>
              Your details are automatically filled from your account
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="detail-field-header">
                  <label>{t('pool.step3.name')}</label>
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
                <label>{t('pool.step3.email')}</label>
                <input type="email" value={user?.email || ''} readOnly className="readonly-field" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="detail-field-header">
                  <label>{t('pool.step3.phone')}</label>
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
              <h3>{t('pool.step3.bookingSummary')}</h3>
              <div className="summary-items">
                <div className="summary-item">
                  <span>{t('pool.step3.poolType')}</span>
                  <span>{formData.poolType ? t(`pool.poolTypes.${formData.poolType}.label`) : ''}</span>
                </div>
                <div className="summary-item">
                  <span>{t('pool.step3.duration')}</span>
                  <span>{formData.duration ? t(`pool.durations.${formData.duration}`) : ''}</span>
                </div>
                <div className="summary-item">
                  <span>{t('pool.step3.date')}</span>
                  <span>{formData.date} {formData.time}</span>
                </div>
                <div className="summary-item total">
                  <span>{t('pool.step3.total')}</span>
                  <span>${calculatePrice()}</span>
                </div>
              </div>
            </div>

            <div className="step-actions">
              <LuxuryButton variant="secondary" onClick={() => setStep(2)}>{t('pool.back')}</LuxuryButton>
              <LuxuryButton variant="primary" onClick={handleSubmit} disabled={loading}>
                {loading ? t('pool.processing') : t('pool.confirm')}
              </LuxuryButton>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PoolService;
