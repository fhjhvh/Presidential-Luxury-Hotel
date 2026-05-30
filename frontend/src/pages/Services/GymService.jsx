import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { serviceAPI, bookingAPI, userAPI } from '../../services/api';
import LuxuryButton from '../../components/common/LuxuryButton';
import './ServicePage.css';

const DAY_OPTIONS = [
  { value: '1',  price: 50  },
  { value: '3',  price: 125 },
  { value: '7',  price: 250 },
  { value: '14', price: 400 },
  { value: '30', price: 600 },
];

const EXPERIENCE_KEYS = ['experienceBeginner', 'experienceIntermediate', 'experienceAdvanced', 'experienceProfessional'];
const TIME_KEYS       = ['timeMorning', 'timeMidday', 'timeAfternoon', 'timeEvening'];

const GymService = () => {
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

  const goalOptions   = t('gym.step2.goalOptions',   { returnObjects: true });
  const weeklyOptions = t('gym.step2.weeklyOptions', { returnObjects: true });
  const injuryOptions = t('gym.injuries',            { returnObjects: true });

  useEffect(() => {
    if (!user) navigate('/login', { state: { returnTo: '/services/gym' } });
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
    days: '', trainingHours: '', personalTrainer: '', startDate: '',
    goal: '', age: '', height: '', weight: '', weeklyHours: '',
    experienceLevel: '', previousInjuries: [], notes: ''
  });

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const toggleArray  = (field, value) => setFormData(prev => ({
    ...prev,
    [field]: prev[field].includes(value) ? prev[field].filter(v => v !== value) : [...prev[field], value]
  }));

  const calculatePrice = () => {
    const opt   = DAY_OPTIONS.find(d => d.value === formData.days);
    let price   = opt?.price || 0;
    if (formData.personalTrainer === 'yes') price += 80 * parseInt(formData.days || 1);
    return price;
  };

  const handleSubmit = async () => {
    setLoading(true); setError(null);
    try {
      const data = await serviceAPI.bookService({
        serviceType: 'gym',
        bookingDetails: { date: formData.startDate, days: formData.days, personalTrainer: formData.personalTrainer, notes: formData.notes },
        formData: { goal: formData.goal, age: formData.age, height: formData.height, weight: formData.weight, weeklyHours: formData.weeklyHours, experienceLevel: formData.experienceLevel, previousInjuries: formData.previousInjuries, preferredTime: formData.trainingHours }
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
    const selectedDay = DAY_OPTIONS.find(d => d.value === formData.days);
    return (
      <div className="service-page gym-page">
        <div className="service-success">
          <motion.div className="success-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="success-icon">💪</div>
            <h2>{t('gym.success.title')}</h2>
            <p className="booking-number">#{bookingData.bookingNumber}</p>
            <div className="booking-details">
              <p><strong>Guest</strong> {user?.firstName} {user?.lastName}</p>
              {user?.idNumber && <p><strong>ID Number</strong> {user.idNumber}</p>}
              {activeRoom && <p><strong>Room</strong> {activeRoom}</p>}
              {selectedDay && <p><strong>{t('gym.step3.package')}</strong> {t(`gym.dayOptions.${selectedDay.value}`)}</p>}
              <p><strong>{t('gym.step3.dateLabel')}</strong> {formData.startDate}</p>
              <p><strong>{t('gym.step3.trainer')}</strong> {formData.personalTrainer === 'yes' ? t('gym.step1.trainerYes') : t('gym.step1.trainerNo')}</p>
              <p><strong>{t('gym.step3.total')}</strong> ${bookingData.totalPrice}</p>
            </div>
            <div className="success-actions">
              <LuxuryButton variant="primary" onClick={() => navigate('/services')}>
                {t('gym.success.backToServices')}
              </LuxuryButton>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="service-page gym-page">
      <div className="service-hero gym-hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>{t('gym.hero.title')}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {t('gym.hero.subtitle')}
          </motion.p>
        </div>
      </div>

      <div className="service-content">
        <div className="booking-progress">
          {[1,2,3].map(n => (
            <div key={n} className={`progress-step ${step >= n ? 'active' : ''}`}>
              {n}. {t(`gym.steps.${n}`)}
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
            <h2>{t('gym.step1.title')}</h2>

            <div className="form-section">
              <h3>{t('gym.step1.duration')}</h3>
              <div className="option-cards">
                {DAY_OPTIONS.map(opt => (
                  <div key={opt.value} className={`option-card ${formData.days === opt.value ? 'selected' : ''}`}
                    onClick={() => handleChange('days', opt.value)}>
                    <h4>{t(`gym.dayOptions.${opt.value}`)}</h4>
                    <span className="price">${opt.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('gym.step2.preferredTime')}</h3>
              <div className="option-buttons">
                {TIME_KEYS.map(key => (
                  <button key={key} className={`option-btn ${formData.trainingHours === key ? 'selected' : ''}`}
                    onClick={() => handleChange('trainingHours', key)}>
                    {t(`gym.step2.${key}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('gym.step1.trainer')}</h3>
              <div className="option-cards horizontal">
                <div className={`option-card ${formData.personalTrainer === 'yes' ? 'selected' : ''}`}
                  onClick={() => handleChange('personalTrainer', 'yes')}>
                  <h4>{t('gym.step1.trainerYes')}</h4>
                </div>
                <div className={`option-card ${formData.personalTrainer === 'no' ? 'selected' : ''}`}
                  onClick={() => handleChange('personalTrainer', 'no')}>
                  <h4>{t('gym.step1.trainerNo')}</h4>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>{t('gym.step1.date')}</label>
              <input type="date" value={formData.startDate} onChange={e => handleChange('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]} />
            </div>

            {formData.days && (
              <div className="price-summary">
                <span>{t('gym.step1.estimatedTotal')}</span>
                <strong>${calculatePrice()}</strong>
              </div>
            )}

            <div className="step-actions">
              <LuxuryButton variant="secondary" onClick={() => navigate('/services')}>{t('gym.back')}</LuxuryButton>
              <LuxuryButton variant="primary" onClick={() => setStep(2)}
                disabled={!formData.days || !formData.personalTrainer || !formData.startDate}>
                {t('gym.continue')}
              </LuxuryButton>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div className="booking-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2>{t('gym.step2.title')}</h2>
            <p className="step-desc">{t('gym.step2.desc')}</p>

            <div className="form-section">
              <h3>{t('gym.step2.goal')}</h3>
              <div className="option-buttons wrap">
                {Array.isArray(goalOptions) && goalOptions.map(goal => (
                  <button key={goal} className={`option-btn ${formData.goal === goal ? 'selected' : ''}`}
                    onClick={() => handleChange('goal', goal)}>{goal}</button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('gym.step2.age')} <span className="field-unit">(years)</span></label>
                <input type="number" value={formData.age} onChange={e => handleChange('age', e.target.value)}
                  min="16" max="100" placeholder="e.g. 28" />
              </div>
              <div className="form-group">
                <label>{t('gym.step2.height')} <span className="field-unit">(cm)</span></label>
                <input type="number" value={formData.height} onChange={e => handleChange('height', e.target.value)}
                  min="100" max="250" placeholder="e.g. 175" />
              </div>
              <div className="form-group">
                <label>{t('gym.step2.weight')} <span className="field-unit">(kg)</span></label>
                <input type="number" value={formData.weight} onChange={e => handleChange('weight', e.target.value)}
                  min="30" max="250" placeholder="e.g. 70" />
              </div>
            </div>

            <div className="form-section">
              <h3>{t('gym.step2.experience')}</h3>
              <div className="option-buttons">
                {EXPERIENCE_KEYS.map(key => (
                  <button key={key} className={`option-btn ${formData.experienceLevel === key ? 'selected' : ''}`}
                    onClick={() => handleChange('experienceLevel', key)}>{t(`gym.step2.${key}`)}</button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('gym.step2.weeklyHours')}</h3>
              <div className="option-buttons">
                {Array.isArray(weeklyOptions) && weeklyOptions.map(opt => (
                  <button key={opt} className={`option-btn ${formData.weeklyHours === opt ? 'selected' : ''}`}
                    onClick={() => handleChange('weeklyHours', opt)}>{opt}</button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('gym.step2.injuries')}</h3>
              <div className="checkbox-grid">
                {Array.isArray(injuryOptions) && injuryOptions.map(injury => (
                  <label key={injury} className="checkbox-item">
                    <input type="checkbox" checked={formData.previousInjuries.includes(injury)}
                      onChange={() => toggleArray('previousInjuries', injury)} />
                    <span>{injury}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>{t('gym.step3.notes')}</label>
              <textarea value={formData.notes} onChange={e => handleChange('notes', e.target.value)} rows="3" />
            </div>

            <div className="step-actions">
              <LuxuryButton variant="secondary" onClick={() => setStep(1)}>{t('gym.back')}</LuxuryButton>
              <LuxuryButton variant="primary" onClick={() => setStep(3)} disabled={!formData.goal || !formData.experienceLevel}>
                {t('gym.continue')}
              </LuxuryButton>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div className="booking-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2>{t('gym.step3.title')}</h2>

            <div className="autofill-notice">
              <span className="autofill-icon">🔒</span>
              Your details are automatically filled from your account
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="detail-field-header">
                  <label>{t('gym.step3.name')}</label>
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
                <label>{t('gym.step3.email')}</label>
                <input type="email" value={user?.email || ''} readOnly className="readonly-field" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="detail-field-header">
                  <label>{t('gym.step3.phone')}</label>
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
              <h3>{t('gym.step3.bookingSummary')}</h3>
              <div className="summary-items">
                <div className="summary-item">
                  <span>{t('gym.step3.package')}</span>
                  <span>{formData.days ? t(`gym.dayOptions.${formData.days}`) : ''}</span>
                </div>
                <div className="summary-item">
                  <span>{t('gym.step3.trainer')}</span>
                  <span>{formData.personalTrainer === 'yes' ? t('gym.step1.trainerYes') : t('gym.step1.trainerNo')}</span>
                </div>
                <div className="summary-item">
                  <span>{t('gym.step3.dateLabel')}</span>
                  <span>{formData.startDate}</span>
                </div>
                <div className="summary-item total">
                  <span>{t('gym.step3.total')}</span>
                  <span>${calculatePrice()}</span>
                </div>
              </div>
            </div>

            <div className="step-actions">
              <LuxuryButton variant="secondary" onClick={() => setStep(2)}>{t('gym.back')}</LuxuryButton>
              <LuxuryButton variant="primary" onClick={handleSubmit} disabled={loading}>
                {loading ? t('gym.processing') : t('gym.confirm')}
              </LuxuryButton>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GymService;
