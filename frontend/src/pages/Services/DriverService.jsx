import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { serviceAPI, bookingAPI, userAPI } from '../../services/api';
import LuxuryButton from '../../components/common/LuxuryButton';
import './ServicePage.css';

const TRIP_TYPES = [
  { value: 'airport_transfer', price: 100 },
  { value: 'city_tour',        price: 200 },
  { value: 'full_day',         price: 400 },
  { value: 'hourly',           price: 50  },
];

const CAR_TYPES = [
  { value: 'sedan',     multiplier: 1   },
  { value: 'suv',       multiplier: 1.3 },
  { value: 'luxury',    multiplier: 2   },
  { value: 'limousine', multiplier: 3   },
];

const SERVICE_LEVEL_KEYS = ['serviceLevelOneWay', 'serviceLevelRound', 'serviceLevelDisposal'];
const DRIVER_STYLE_KEYS  = ['styleFormal', 'styleFriendly', 'styleSilent'];
const LANGUAGE_KEYS      = ['english', 'arabic', 'french', 'spanish', 'german', 'chinese'];
const LANGUAGE_VALUES    = ['English', 'Arabic', 'French', 'Spanish', 'German', 'Chinese'];
const HOURLY_OPTIONS     = [2, 3, 4, 5, 6, 8, 10, 12];
const WAITING_KEYS       = ['waitingNone', 'waiting30min', 'waiting1hour', 'waitingFlexible'];

const DriverService = () => {
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

  const purposeOptions = t('driver.step2.purposeOptions', { returnObjects: true });

  useEffect(() => {
    if (!user) navigate('/login', { state: { returnTo: '/services/driver' } });
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
    tripType: '', carType: '', date: '', time: '', duration: '',
    serviceType: '', preferredLanguage: '', driverStyle: '',
    tripPurpose: '', waitingTime: '', pickupLocation: '', dropoffLocation: '', notes: ''
  });

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const calculatePrice = () => {
    const trip = TRIP_TYPES.find(t => t.value === formData.tripType);
    const car  = CAR_TYPES.find(c => c.value === formData.carType);
    if (!trip || !car) return 0;
    let price = trip.price * car.multiplier;
    if (formData.tripType === 'hourly' && formData.duration) {
      price *= parseInt(formData.duration);
    }
    return Math.round(price);
  };

  const handleSubmit = async () => {
    setLoading(true); setError(null);
    try {
      const data = await serviceAPI.bookService({
        serviceType: 'driver',
        bookingDetails: { date: formData.date, time: formData.time, tripType: formData.tripType, carType: formData.carType, duration: formData.duration, notes: formData.notes },
        formData: { serviceType: formData.serviceType, preferredLanguage: formData.preferredLanguage, driverStyle: formData.driverStyle, tripPurpose: formData.tripPurpose, waitingTime: formData.waitingTime, pickupLocation: formData.pickupLocation, dropoffLocation: formData.dropoffLocation }
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
    const tripData = t(`driver.tripTypes.${formData.tripType}`, { returnObjects: true });
    const carData  = t(`driver.carTypes.${formData.carType}`,  { returnObjects: true });
    return (
      <div className="service-page driver-page">
        <div className="service-success">
          <motion.div className="success-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="success-icon">🚗</div>
            <h2>{t('driver.success.title')}</h2>
            <p className="booking-number">#{bookingData.bookingNumber}</p>
            <div className="booking-details">
              <p><strong>Guest</strong> {user?.firstName} {user?.lastName}</p>
              {user?.idNumber && <p><strong>ID Number</strong> {user.idNumber}</p>}
              {activeRoom && <p><strong>Room</strong> {activeRoom}</p>}
              <p><strong>{t('driver.step3.trip')}</strong> {tripData?.label || formData.tripType}</p>
              <p><strong>{t('driver.step3.vehicle')}</strong> {carData?.label || formData.carType}</p>
              <p><strong>{t('driver.step3.date')}</strong> {formData.date} {formData.time}</p>
              <p><strong>{t('driver.step3.total')}</strong> ${bookingData.totalPrice}</p>
            </div>
            <div className="success-actions">
              <LuxuryButton variant="primary" onClick={() => navigate('/services')}>
                {t('driver.success.backToServices')}
              </LuxuryButton>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="service-page driver-page">
      <div className="service-hero driver-hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>{t('driver.hero.title')}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {t('driver.hero.subtitle')}
          </motion.p>
        </div>
      </div>

      <div className="service-content">
        <div className="booking-progress">
          {[1,2,3].map(n => (
            <div key={n} className={`progress-step ${step >= n ? 'active' : ''}`}>
              {n}. {t(`driver.steps.${n}`)}
            </div>
          ))}
        </div>

        {error && <div className="form-error-banner"><p>⚠️ {error}</p><button onClick={() => setError(null)}>×</button></div>}

        {step === 1 && (
          <motion.div className="booking-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2>{t('driver.step1.title')}</h2>

            <div className="form-section">
              <h3>{t('driver.step1.tripType')}</h3>
              <div className="option-cards">
                {TRIP_TYPES.map(trip => {
                  const data = t(`driver.tripTypes.${trip.value}`, { returnObjects: true });
                  return (
                    <div key={trip.value} className={`option-card ${formData.tripType === trip.value ? 'selected' : ''}`}
                      onClick={() => handleChange('tripType', trip.value)}>
                      <h4>{data.label}</h4>
                      <p>{data.desc}</p>
                      <span className="price">${trip.price}{trip.value === 'hourly' ? '/hr' : ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('driver.step1.carType')}</h3>
              <div className="option-cards">
                {CAR_TYPES.map(car => {
                  const data = t(`driver.carTypes.${car.value}`, { returnObjects: true });
                  return (
                    <div key={car.value} className={`option-card ${formData.carType === car.value ? 'selected' : ''}`}
                      onClick={() => handleChange('carType', car.value)}>
                      <h4>{data.label}</h4>
                      <p>{data.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {formData.tripType === 'hourly' && (
              <div className="form-group">
                <label>{t('driver.step2.hourlyLabel')}</label>
                <select value={formData.duration} onChange={e => handleChange('duration', e.target.value)}>
                  <option value="">{t('driver.step2.hourlyPlaceholder')}</option>
                  {HOURLY_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>{t('driver.step1.date')}</label>
                <input type="date" value={formData.date} onChange={e => handleChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label>{t('driver.step1.time')}</label>
                <input type="time" value={formData.time} onChange={e => handleChange('time', e.target.value)} />
              </div>
            </div>

            {formData.tripType && formData.carType && (
              <div className="price-summary">
                <span>{t('driver.step1.estimatedTotal')}</span>
                <strong>${calculatePrice()}</strong>
              </div>
            )}

            <div className="step-actions">
              <LuxuryButton variant="secondary" onClick={() => navigate('/services')}>{t('driver.back')}</LuxuryButton>
              <LuxuryButton variant="primary" onClick={() => setStep(2)}
                disabled={!formData.tripType || !formData.carType || !formData.date || !formData.time}>
                {t('driver.continue')}
              </LuxuryButton>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div className="booking-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2>{t('driver.step2.title')}</h2>
            <p className="step-desc">{t('driver.step2.desc')}</p>

            <div className="form-section">
              <h3>{t('driver.step2.serviceLevel')}</h3>
              <div className="option-buttons">
                {SERVICE_LEVEL_KEYS.map(key => (
                  <button key={key} className={`option-btn ${formData.serviceType === key ? 'selected' : ''}`}
                    onClick={() => handleChange('serviceType', key)}>
                    {t(`driver.step2.${key}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('driver.step2.language')}</h3>
              <div className="option-buttons wrap">
                {LANGUAGE_KEYS.map((key, i) => (
                  <button key={key} className={`option-btn ${formData.preferredLanguage === LANGUAGE_VALUES[i] ? 'selected' : ''}`}
                    onClick={() => handleChange('preferredLanguage', LANGUAGE_VALUES[i])}>
                    {t(`driver.languageLabels.${key}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('driver.step2.style')}</h3>
              <div className="option-buttons">
                {DRIVER_STYLE_KEYS.map(key => (
                  <button key={key} className={`option-btn ${formData.driverStyle === key ? 'selected' : ''}`}
                    onClick={() => handleChange('driverStyle', key)}>
                    {t(`driver.step2.${key}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('driver.step2.purpose')}</h3>
              <div className="option-buttons wrap">
                {Array.isArray(purposeOptions) && purposeOptions.map(p => (
                  <button key={p} className={`option-btn ${formData.tripPurpose === p ? 'selected' : ''}`}
                    onClick={() => handleChange('tripPurpose', p)}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('driver.step2.pickup')}</label>
                <input type="text" value={formData.pickupLocation} onChange={e => handleChange('pickupLocation', e.target.value)}
                  placeholder={t('driver.step2.pickupPlaceholder')} />
              </div>
              <div className="form-group">
                <label>{t('driver.step2.dropoff')}</label>
                <input type="text" value={formData.dropoffLocation} onChange={e => handleChange('dropoffLocation', e.target.value)}
                  placeholder={t('driver.step2.dropoffPlaceholder')} />
              </div>
            </div>

            <div className="form-group">
              <label>{t('driver.step2.waiting')}</label>
              <select value={formData.waitingTime} onChange={e => handleChange('waitingTime', e.target.value)}>
                <option value="">{t('spa.step1.selectTime')}</option>
                {WAITING_KEYS.map(key => (
                  <option key={key} value={key}>{t(`driver.step2.${key}`)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{t('driver.step3.notes')}</label>
              <textarea value={formData.notes} onChange={e => handleChange('notes', e.target.value)} rows="3" />
            </div>

            <div className="step-actions">
              <LuxuryButton variant="secondary" onClick={() => setStep(1)}>{t('driver.back')}</LuxuryButton>
              <LuxuryButton variant="primary" onClick={() => setStep(3)} disabled={!formData.preferredLanguage || !formData.driverStyle}>
                {t('driver.continue')}
              </LuxuryButton>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div className="booking-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2>{t('driver.step3.title')}</h2>

            <div className="autofill-notice">
              <span className="autofill-icon">🔒</span>
              Your details are automatically filled from your account
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="detail-field-header">
                  <label>{t('driver.step3.name')}</label>
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
                <label>{t('driver.step3.email')}</label>
                <input type="email" value={user?.email || ''} readOnly className="readonly-field" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="detail-field-header">
                  <label>{t('driver.step3.phone')}</label>
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
              <h3>{t('driver.step3.bookingSummary')}</h3>
              <div className="summary-items">
                <div className="summary-item">
                  <span>{t('driver.step3.trip')}</span>
                  <span>{formData.tripType ? t(`driver.tripTypes.${formData.tripType}`, { returnObjects: true })?.label : ''}</span>
                </div>
                <div className="summary-item">
                  <span>{t('driver.step3.vehicle')}</span>
                  <span>{formData.carType ? t(`driver.carTypes.${formData.carType}`, { returnObjects: true })?.label : ''}</span>
                </div>
                <div className="summary-item">
                  <span>{t('driver.step3.date')}</span>
                  <span>{formData.date} {formData.time}</span>
                </div>
                {formData.pickupLocation && (
                  <div className="summary-item">
                    <span>{t('driver.step3.from')}</span>
                    <span>{formData.pickupLocation}</span>
                  </div>
                )}
                {formData.dropoffLocation && (
                  <div className="summary-item">
                    <span>{t('driver.step3.to')}</span>
                    <span>{formData.dropoffLocation}</span>
                  </div>
                )}
                <div className="summary-item total">
                  <span>{t('driver.step3.total')}</span>
                  <span>${calculatePrice()}</span>
                </div>
              </div>
            </div>

            <div className="step-actions">
              <LuxuryButton variant="secondary" onClick={() => setStep(2)}>{t('driver.back')}</LuxuryButton>
              <LuxuryButton variant="primary" onClick={handleSubmit} disabled={loading}>
                {loading ? t('driver.processing') : t('driver.confirm')}
              </LuxuryButton>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DriverService;
