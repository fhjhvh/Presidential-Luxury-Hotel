import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { roomAPI, bookingAPI, parkingAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LuxuryButton from '../../components/common/LuxuryButton';
import './Booking.css';

const Booking = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const directBookingRoom = location.state?.selectedRoom;
  const isDirectBooking = !!directBookingRoom;

  useEffect(() => {
    if (!user) {
      navigate('/access', {
        state: { redirectMessage: t('booking.loginRequired'), from: '/booking' }
      });
    }
  }, [user, navigate]);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [directBookingStep, setDirectBookingStep] = useState(isDirectBooking ? 'parking' : null);
  const [formData, setFormData] = useState({
    guestType: 'individual',
    guests: directBookingRoom?.capacity || 1,
    roomType: directBookingRoom?.type || '',
    viewPreference: 'any',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    needsParking: null,
    parkingType: '',
    parkingTime: '',
    hasChildren: '',
    childrenCount: 1,
    childrenAges: ['', '', '', '']
  });
  const [rooms, setRooms] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(directBookingRoom || null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [pendingRoom, setPendingRoom] = useState(null);
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // ─── Questions ────────────────────────────────────────────
  const questions = [
    {
      id: 'guestType',
      question: t('booking.questions.guestType'),
      icon: '👨‍👩‍👧‍👦',
      type: 'select',
      options: [
        { value: 'individual', label: t('booking.options.individual'),   desc: t('booking.options.individualDesc') },
        { value: 'couple',     label: t('booking.options.couple'),       desc: t('booking.options.coupleDesc') },
        { value: 'family',     label: t('booking.options.family'),       desc: t('booking.options.familyDesc') },
        { value: 'group',      label: t('booking.options.group'),        desc: t('booking.options.groupDesc') }
      ]
    },
    {
      id: 'hasChildren',
      question: t('booking.questions.hasChildren'),
      icon: '👶',
      type: 'select',
      condition: () => formData.guestType === 'family',
      options: [
        { value: 'yes', label: t('booking.options.hasChildrenYes'), desc: t('booking.options.hasChildrenYesDesc') },
        { value: 'no',  label: t('booking.options.hasChildrenNo'),  desc: t('booking.options.hasChildrenNoDesc') }
      ]
    },
    {
      id: 'childrenInfo',
      question: t('booking.questions.childrenInfo'),
      icon: '🧒',
      type: 'children',
      condition: () => formData.guestType === 'family' && formData.hasChildren === 'yes'
    },
    {
      id: 'guests',
      question: t('booking.questions.guests'),
      icon: '🛎️',
      type: 'number',
      options: [1, 2, 3, 4, 5, 6, 7, 8]
    },
    {
      id: 'roomType',
      question: t('booking.questions.roomType'),
      icon: '🏨',
      type: 'select',
      options: [
        { value: 'STANDARD',     label: t('booking.options.standard'),     desc: t('booking.options.standardDesc') },
        { value: 'DELUXE',       label: t('booking.options.deluxe'),       desc: t('booking.options.deluxeDesc') },
        { value: 'SUITE',        label: t('booking.options.suite'),        desc: t('booking.options.suiteDesc') },
        { value: 'PRESIDENTIAL', label: t('booking.options.presidential'), desc: t('booking.options.presidentialDesc') }
      ]
    },
    {
      id: 'viewPreference',
      question: t('booking.questions.viewPreference'),
      icon: '🌅',
      type: 'select',
      options: [
        { value: 'city',   label: t('booking.options.cityView'),    desc: t('booking.options.cityViewDesc') },
        { value: 'garden', label: t('booking.options.gardenView'),  desc: t('booking.options.gardenViewDesc') },
        { value: 'pool',   label: t('booking.options.poolView'),    desc: t('booking.options.poolViewDesc') },
        { value: 'any',    label: t('booking.options.noPreference'),desc: t('booking.options.noPreferenceDesc') }
      ]
    },
    {
      id: 'dates',
      question: t('booking.questions.dates'),
      icon: '📅',
      type: 'dates'
    },
    {
      id: 'needsParking',
      question: t('booking.questions.needsParking'),
      icon: '🚗',
      type: 'select',
      options: [
        { value: true,  label: t('booking.options.parkingYes'), desc: t('booking.options.parkingYesDesc') },
        { value: false, label: t('booking.options.parkingNo'),  desc: t('booking.options.parkingNoDesc') }
      ]
    },
    {
      id: 'parkingType',
      question: t('booking.questions.parkingType'),
      icon: '🅿️',
      type: 'select',
      condition: () => formData.needsParking === true,
      options: [
        { value: 'valet', label: t('booking.options.valet'), desc: t('booking.options.valetDesc') },
        { value: 'self',  label: t('booking.options.self'),  desc: t('booking.options.selfDesc') },
        { value: 'vip',   label: t('booking.options.vip'),   desc: t('booking.options.vipDesc') },
        { value: 'ev',    label: t('booking.options.ev'),    desc: t('booking.options.evDesc') }
      ]
    }
  ];

  // ─── Helpers ──────────────────────────────────────────────
  const handleAnswer = (field, value) => {
    let updated = { ...formData, [field]: value };

    if (field === 'guestType') {
      if (value === 'individual') updated.guests = 1;
      else if (value === 'couple') updated.guests = 2;
      else if (updated.guests === 1) updated.guests = 2;

      // Reset children fields when changing type away from family
      if (value !== 'family') {
        updated.hasChildren = '';
        updated.childrenCount = 1;
        updated.childrenAges = ['', '', '', ''];
      }
    }

    if (field === 'hasChildren' && value === 'no') {
      updated.childrenCount = 0;
      updated.childrenAges = ['', '', '', ''];
    }

    setFormData(updated);
  };

  const handleChildrenCount = (count) => {
    setFormData(prev => ({ ...prev, childrenCount: count }));
  };

  const handleChildAge = (index, value) => {
    setFormData(prev => {
      const ages = [...prev.childrenAges];
      ages[index] = value;
      return { ...prev, childrenAges: ages };
    });
  };

  const getGuestOptions = () => {
    if (formData.guestType === 'individual') return [1];
    if (formData.guestType === 'couple') return [2];
    return [2, 3, 4, 5, 6, 7, 8];
  };

  const activeQuestions = questions.filter(q => !q.condition || q.condition());
  const currentQuestion = activeQuestions[step];

  const canProceed = () => {
    if (!currentQuestion) return false;
    const id = currentQuestion.id;
    if (id === 'guestType')     return formData.guestType !== '';
    if (id === 'hasChildren')   return formData.hasChildren !== '';
    if (id === 'childrenInfo')  return formData.childrenCount > 0;
    if (id === 'guests')        return formData.guests > 0;
    if (id === 'roomType')      return formData.roomType !== '';
    if (id === 'viewPreference') return formData.viewPreference !== '';
    if (id === 'dates')         return !!(formData.checkIn && formData.checkOut);
    if (id === 'needsParking')  return formData.needsParking !== null && formData.needsParking !== '';
    if (id === 'parkingType')   return !formData.needsParking || formData.parkingType !== '';
    return true;
  };

  const handleNext = () => {
    if (step < activeQuestions.length - 1) setStep(step + 1);
    else generateRecommendations();
  };

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1);
  };

  // ─── Recommendations ──────────────────────────────────────
  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const preferences = {
        guests:          formData.guests,
        roomType:        formData.roomType,
        viewPreference:  formData.viewPreference,
        checkIn:         formData.checkIn,
        checkOut:        formData.checkOut,
        hasChildren:     formData.hasChildren,
        childrenCount:   formData.childrenCount
      };

      const allRooms = await roomAPI.getAllRooms();
      let filtered = [];
      let fallbackLevel = 0;

      const effectiveGuests = preferences.hasChildren === 'yes'
        ? preferences.guests + (preferences.childrenCount || 0)
        : preferences.guests;

      filtered = allRooms.filter(r =>
        r.capacity >= effectiveGuests &&
        (preferences.roomType ? r.type === preferences.roomType : true) &&
        (preferences.viewPreference && preferences.viewPreference !== 'any' ? r.view === preferences.viewPreference : true) &&
        r.status === 'AVAILABLE'
      );

      if (filtered.length === 0) {
        fallbackLevel = 1;
        filtered = allRooms.filter(r =>
          r.capacity >= effectiveGuests &&
          (preferences.roomType ? r.type === preferences.roomType : true) &&
          r.status === 'AVAILABLE'
        );
      }
      if (filtered.length === 0) {
        fallbackLevel = 2;
        filtered = allRooms.filter(r => r.capacity >= effectiveGuests && r.status === 'AVAILABLE');
      }
      if (filtered.length === 0) {
        fallbackLevel = 3;
        filtered = allRooms.filter(r => r.status === 'AVAILABLE');
      }
      if (filtered.length === 0) {
        fallbackLevel = 4;
        filtered = allRooms.filter(r => r.status !== 'MAINTENANCE');
      }
      if (filtered.length === 0) {
        fallbackLevel = 5;
        filtered = [...allRooms];
      }

      const recs = filtered.map(room => ({
        ...room,
        accommodationType: room.type,
        suggestedFloor:    room.floor,
        roomCategory:      room.type,
        estimatedPrice:    room.currentPrice,
        matchScore:        calculateMatchScore(room, preferences),
        features:          room.features || {},
        amenities:         room.amenities || {},
        fallbackLevel
      })).sort((a, b) => b.matchScore - a.matchScore);

      setRecommendations(recs);
      setRooms(recs);
      setShowRecommendations(true);
    } catch (error) {
      try {
        const emergency = await roomAPI.getAllRooms();
        if (emergency?.length > 0) {
          const fallback = emergency.map(r => ({
            ...r, accommodationType: r.type, suggestedFloor: r.floor,
            roomCategory: r.type, estimatedPrice: r.currentPrice,
            matchScore: 50, features: r.features || {}, amenities: r.amenities || {}, fallbackLevel: 5
          }));
          setRecommendations(fallback);
          setRooms(fallback);
          setShowRecommendations(true);
          return;
        }
      } catch (_) {}
      alert('Error loading rooms: ' + error.message);
      setRecommendations([]);
      setRooms([]);
      setShowRecommendations(false);
    } finally {
      setLoading(false);
    }
  };

  const calculateMatchScore = (room, prefs) => {
    let score = 0;
    const effective = prefs.hasChildren === 'yes'
      ? prefs.guests + (prefs.childrenCount || 0)
      : prefs.guests;

    if (room.capacity === effective)    score += 50;
    else if (room.capacity > effective) score += 30;
    if (prefs.roomType && room.type === prefs.roomType) score += 40;
    if (room.status === 'AVAILABLE') score += 10;
    if (prefs.hasChildren === 'yes' && (room.type === 'SUITE' || room.type === 'PRESIDENTIAL')) score += 15;
    return score;
  };

  // ── Card display helpers ──────────────────────────────────
  // Suitability label from guest count + booking purpose + room type.
  const getSuitability = (room) => {
    const guests = Number(formData.guests) || room.capacity || 1;
    const type = String(room.type || '').toUpperCase();
    if (formData.guestType === 'family' || formData.hasChildren === 'yes' || guests >= 4)
      return t('booking.results.suitFamilies', { defaultValue: 'Suitable for Families' });
    if (type.includes('EXECUTIVE') || type.includes('BUSINESS'))
      return t('booking.results.suitBusiness', { defaultValue: 'Suitable for Business Guests' });
    if (formData.guestType === 'couple' || guests === 2)
      return t('booking.results.suitCouples', { defaultValue: 'Suitable for Couples' });
    if (guests >= 5)
      return t('booking.results.suitGroups', { defaultValue: 'Suitable for Groups' });
    return t('booking.results.suitSolo', { defaultValue: 'Suitable for Solo Travelers' });
  };

  // Resolve a readable "View" — prefer the room's actual view, fall back to
  // the guest's selected preference.
  const VIEW_LABELS = {
    city:   t('booking.options.cityView',   { defaultValue: 'City View' }),
    garden: t('booking.options.gardenView', { defaultValue: 'Garden View' }),
    pool:   t('booking.options.poolView',   { defaultValue: 'Pool View' }),
    sea:    t('booking.options.seaView',    { defaultValue: 'Sea View' }),
    ocean:  t('booking.options.oceanView',  { defaultValue: 'Ocean View' }),
  };
  const getViewLabel = (room) => {
    const fv = (typeof room.features === 'object' && room.features?.view) ? room.features.view : null;
    if (fv) return fv;
    if (room.view && VIEW_LABELS[room.view]) return VIEW_LABELS[room.view];
    if (formData.viewPreference && formData.viewPreference !== 'any' && VIEW_LABELS[formData.viewPreference])
      return VIEW_LABELS[formData.viewPreference];
    return null;
  };

  // ─── Booking Actions ──────────────────────────────────────
  const handleBookRoom = async (room) => {
    if (!user || !isAuthenticated) {
      navigate('/login', { state: { from: '/booking', message: t('booking.loginToBook') } });
      return;
    }
    await processBooking(room);
  };

  const processBooking = async (room) => {
    setLoading(true);
    setBookingError(null);

    const token = localStorage.getItem('plhms_token');
    if (!token) {
      setBookingError(t('booking.sessionExpired'));
      setLoading(false);
      navigate('/login', { state: { from: '/booking', message: t('booking.sessionExpired') } });
      return;
    }

    try {
      const checkInDate  = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)) || 1;
      const totalPrice = room.currentPrice * nights;

      const bookingPayload = {
        roomId:           room.id,
        checkInDate:      formData.checkIn,
        checkOutDate:     formData.checkOut,
        numberOfGuests:   formData.guests || 1,
        totalPrice,
        specialRequests:  formData.needsParking ? `Parking: ${formData.parkingType}` : '',
        guestPreferences: JSON.stringify({
          guestType:       formData.guestType || 'individual',
          viewPreference:  formData.viewPreference || 'any',
          parkingNeeded:   formData.needsParking,
          parkingType:     formData.parkingType,
          hasChildren:     formData.hasChildren,
          childrenCount:   formData.hasChildren === 'yes' ? formData.childrenCount : 0,
          childrenAges:    formData.hasChildren === 'yes'
                             ? formData.childrenAges.slice(0, formData.childrenCount).filter(Boolean)
                             : []
        })
      };

      const savedBooking = await bookingAPI.createBooking(bookingPayload);

      // Persist a linked parking reservation so it shows in the guest's Profile.
      // Non-fatal: a parking failure must not block the room booking.
      if (formData.needsParking === true) {
        try {
          await parkingAPI.reserve({
            parkingType:   formData.parkingType || 'self',
            roomBookingId: savedBooking?.id || savedBooking?.booking?.id,
          });
        } catch (parkErr) {
          console.warn('Parking reservation failed (non-fatal):', parkErr.message);
        }
      }

      setBookingData(savedBooking);
      setSelectedRoom(room);
      setBookingConfirmed(true);
      setShowGuestForm(false);
      setPendingRoom(null);
    } catch (error) {
      if (error.message?.includes('Authentication') || error.message?.includes('token')) {
        setBookingError(t('booking.sessionExpired'));
        setTimeout(() => navigate('/login', { state: { from: '/booking' } }), 2000);
      } else {
        setBookingError(error.message || 'Failed to complete booking. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSubmit = async (e) => {
    e.preventDefault();
    navigate('/login', { state: { from: '/booking', message: t('booking.loginToBook') } });
  };

  const cancelGuestForm = () => {
    setShowGuestForm(false);
    setPendingRoom(null);
    setGuestInfo({ firstName: '', lastName: '', email: '', phone: '' });
  };

  const handleNewBooking = () => {
    setStep(0);
    setFormData({
      guestType: '', guests: 1, roomType: '', viewPreference: '',
      checkIn: '', checkOut: '', needsParking: false, parkingType: '', parkingTime: '',
      hasChildren: '', childrenCount: 1, childrenAges: ['', '', '', '']
    });
    setRooms([]);
    setRecommendations([]);
    setShowRecommendations(false);
    setSelectedRoom(null);
    setBookingConfirmed(false);
  };

  // ─── Direct Booking Flow ──────────────────────────────────
  const handleDirectBookingParking = (hasParking) => {
    setFormData(prev => ({ ...prev, needsParking: hasParking }));
    setDirectBookingStep(hasParking ? 'parkingType' : 'dates');
  };

  const handleDirectBookingParkingType = (type) => {
    setFormData(prev => ({ ...prev, parkingType: type }));
    setDirectBookingStep('dates');
  };

  const handleDirectBookingDates = () => {
    if (formData.checkIn && formData.checkOut) handleBookRoom(directBookingRoom);
  };

  // ── Direct Booking: compute live price ───────────────────────
  const directNights = (() => {
    if (!formData.checkIn || !formData.checkOut) return 1;
    const diff = new Date(formData.checkOut) - new Date(formData.checkIn);
    return Math.max(1, Math.ceil(diff / 86400000));
  })();
  const directTotal = directBookingRoom ? directBookingRoom.currentPrice * directNights : 0;

  if (isDirectBooking && directBookingStep && !bookingConfirmed) {
    const room = directBookingRoom;
    const roomImg = Array.isArray(room.images) ? room.images[0] : (typeof room.images === 'string' ? JSON.parse(room.images || '[]')[0] : null);
    const roomFeatures = typeof room.features === 'object' ? room.features : (() => { try { return JSON.parse(room.features || '{}'); } catch { return {}; } })();

    const currentStepNum = directBookingStep === 'parking' ? 1 : directBookingStep === 'parkingType' ? 2 : formData.needsParking ? 3 : 2;

    const PARKING_OPTIONS = [
      { value: 'valet', icon: '🎩', label: t('booking.options.valet'), desc: t('booking.options.valetDesc') },
      { value: 'self',  icon: '🚙', label: t('booking.options.self'),  desc: t('booking.options.selfDesc') },
      { value: 'vip',   icon: '⭐', label: t('booking.options.vip'),   desc: t('booking.options.vipDesc') },
      { value: 'ev',    icon: '⚡', label: t('booking.options.ev'),    desc: t('booking.options.evDesc') },
    ];

    return (
      <div className="booking-page db-page">
        {/* ── Top header ── */}
        <div className="db-header">
          <span className="db-kicker">{t('booking.direct.kicker')}</span>
          <h1 className="db-title">{t('booking.direct.title')}</h1>
          <p className="db-sub">{t('booking.direct.subtitle')}</p>
        </div>

        <div className="db-layout">
          {/* ── Left: Room summary card ── */}
          <aside className="db-room-panel">
            {roomImg && (
              <div className="db-room-img-wrap">
                <img src={roomImg} alt={`Room ${room.roomNumber}`} className="db-room-img"
                  onError={e => e.target.style.display='none'} />
              </div>
            )}
            <div className="db-room-info">
              <div className="db-room-type-badge">
                {room.type?.replace(/_/g, ' ')}
              </div>
              <h2 className="db-room-name">
                {room.type?.includes('SUITE') ? room.type.replace(/_/g,' ') : `Room ${room.roomNumber}`}
              </h2>
              <div className="db-room-specs">
                <span>🏢 {t('booking.direct.floor')} {room.floor}</span>
                <span>👥 {t('booking.direct.upTo')} {room.capacity} {t('booking.direct.guests')}</span>
                {room.size && <span>📐 {room.size} m²</span>}
                {roomFeatures.bed_type && <span>🛏 {roomFeatures.bed_type}</span>}
                {roomFeatures.view && <span>🌅 {roomFeatures.view}</span>}
              </div>
              <div className="db-price-row">
                <div>
                  <span className="db-price">${room.currentPrice?.toLocaleString()}</span>
                  <span className="db-per-night">{t('booking.direct.perNight')}</span>
                </div>
                {formData.checkIn && formData.checkOut && (
                  <div className="db-total-preview">
                    <span className="db-nights">{directNights} {directNights > 1 ? t('booking.direct.nights') : t('booking.direct.night')}</span>
                    <span className="db-total">${directTotal.toLocaleString()} {t('booking.direct.totalSuffix')}</span>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* ── Right: Steps ── */}
          <main className="db-steps-panel">
            {/* Progress */}
            <div className="db-progress">
              {[1, 2, formData.needsParking !== false ? 3 : null].filter(Boolean).map((n) => (
                <div key={n} className={`db-step-dot ${currentStepNum >= n ? 'db-step-dot--done' : ''} ${currentStepNum === n ? 'db-step-dot--active' : ''}`}>
                  {currentStepNum > n ? '✓' : n}
                </div>
              ))}
              <div className="db-progress-bar">
                <div className="db-progress-fill" style={{ width: `${(currentStepNum / (formData.needsParking !== false ? 3 : 2)) * 100}%` }} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {directBookingStep === 'parking' && (
                <motion.div key="parking" className="db-step-card"
                  initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                  transition={{ duration:0.3 }}>
                  <div className="db-step-icon">🚗</div>
                  <h3 className="db-step-title">{t('booking.direct.parkingQuestion')}</h3>
                  <p className="db-step-sub">{t('booking.direct.parkingSubtitle')}</p>
                  <div className="db-two-options">
                    <button className="db-opt db-opt--yes" onClick={() => handleDirectBookingParking(true)}>
                      <span className="db-opt-icon">✅</span>
                      <span className="db-opt-label">{t('booking.direct.parkingYesLabel')}</span>
                      <span className="db-opt-desc">{t('booking.direct.parkingYesDesc')}</span>
                    </button>
                    <button className="db-opt db-opt--no" onClick={() => handleDirectBookingParking(false)}>
                      <span className="db-opt-icon">🚶</span>
                      <span className="db-opt-label">{t('booking.direct.parkingNoLabel')}</span>
                      <span className="db-opt-desc">{t('booking.direct.parkingNoDesc')}</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {directBookingStep === 'parkingType' && (
                <motion.div key="parkingType" className="db-step-card"
                  initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                  transition={{ duration:0.3 }}>
                  <div className="db-step-icon">🅿️</div>
                  <h3 className="db-step-title">{t('booking.direct.parkingPreference')}</h3>
                  <p className="db-step-sub">{t('booking.direct.parkingFree')}</p>
                  <div className="db-parking-grid">
                    {PARKING_OPTIONS.map(opt => (
                      <button key={opt.value}
                        className={`db-park-opt ${formData.parkingType === opt.value ? 'db-park-opt--active' : ''}`}
                        onClick={() => handleDirectBookingParkingType(opt.value)}>
                        <span className="db-park-icon">{opt.icon}</span>
                        <span className="db-park-label">{opt.label}</span>
                        <span className="db-park-desc">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {directBookingStep === 'dates' && (
                <motion.div key="dates" className="db-step-card"
                  initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                  transition={{ duration:0.3 }}>
                  <div className="db-step-icon">📅</div>
                  <h3 className="db-step-title">{t('booking.direct.selectDates')}</h3>
                  <p className="db-step-sub">{t('booking.direct.datesSubtitle')}</p>

                  <div className="db-date-row">
                    <div className="db-date-group">
                      <label className="db-date-label">{t('booking.direct.checkIn')}</label>
                      <input type="date" className="db-date-input"
                        value={formData.checkIn}
                        onChange={e => setFormData(p => ({ ...p, checkIn: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="db-date-arrow">→</div>
                    <div className="db-date-group">
                      <label className="db-date-label">{t('booking.direct.checkOut')}</label>
                      <input type="date" className="db-date-input"
                        value={formData.checkOut}
                        onChange={e => setFormData(p => ({ ...p, checkOut: e.target.value }))}
                        min={formData.checkIn || new Date().toISOString().split('T')[0]} />
                    </div>
                  </div>

                  {formData.checkIn && formData.checkOut && (
                    <motion.div className="db-price-summary"
                      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
                      <div className="db-price-row-detail">
                        <span>${room.currentPrice?.toLocaleString()} × {directNights} {directNights > 1 ? t('booking.direct.nights') : t('booking.direct.night')}</span>
                        <span>${directTotal.toLocaleString()}</span>
                      </div>
                      <div className="db-price-row-detail db-price-row-detail--total">
                        <span>{t('booking.direct.total')}</span>
                        <span>${directTotal.toLocaleString()}</span>
                      </div>
                    </motion.div>
                  )}

                  {bookingError && (
                    <div className="db-error">⚠️ {bookingError}</div>
                  )}

                  <button
                    className={`db-confirm-btn ${(!formData.checkIn || !formData.checkOut || loading) ? 'db-confirm-btn--disabled' : ''}`}
                    disabled={!formData.checkIn || !formData.checkOut || loading}
                    onClick={handleDirectBookingDates}
                  >
                    {loading ? (
                      <><span className="db-spinner" /> {t('booking.direct.processing')}</>
                    ) : (
                      t('booking.direct.confirmBtn')
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    );
  }

  if (bookingConfirmed && selectedRoom) {
    return (
      <div className="booking-page">
        <div className="booking-success-notification">
          <motion.div
            className="success-notification"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="success-icon">✓</span>
            <span className="success-message">{t('booking.success.message')}</span>
          </motion.div>
          <div className="success-actions">
            <LuxuryButton variant="primary" onClick={() => navigate('/profile')}>
              {t('booking.success.viewBookings')}
            </LuxuryButton>
            <LuxuryButton variant="secondary" onClick={() => navigate('/rooms')}>
              {t('booking.success.continueBrowsing')}
            </LuxuryButton>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Render ──────────────────────────────────────────
  return (
    <div className="booking-page">
      {/* Guest Information Modal */}
      {showGuestForm && pendingRoom && (
        <div className="guest-form-overlay">
          <motion.div
            className="guest-form-modal"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2>{t('booking.guestForm.title')}</h2>
            <p className="guest-form-subtitle">{t('booking.guestForm.subtitle')}</p>

            <div className="selected-room-summary">
              <h4>{t('roomDetail.roomTitle')} {pendingRoom.roomNumber} — {pendingRoom.type}</h4>
              <p>{t('booking.direct.floor')} {pendingRoom.floor} · {pendingRoom.capacity} {t('booking.direct.guests')} · ${pendingRoom.currentPrice}{t('booking.direct.perNight')}</p>
            </div>

            {bookingError && (
              <div className="form-error"><p>⚠️ {bookingError}</p></div>
            )}

            <form onSubmit={handleGuestSubmit} className="guest-info-form">
              <div className="form-row">
                <div className="form-group">
                  <label>{t('booking.guestForm.firstName')}</label>
                  <input type="text" value={guestInfo.firstName}
                    onChange={e => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
                    placeholder="John" required />
                </div>
                <div className="form-group">
                  <label>{t('booking.guestForm.lastName')}</label>
                  <input type="text" value={guestInfo.lastName}
                    onChange={e => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
                    placeholder="Doe" required />
                </div>
              </div>
              <div className="form-group">
                <label>{t('booking.guestForm.email')}</label>
                <input type="email" value={guestInfo.email}
                  onChange={e => setGuestInfo({ ...guestInfo, email: e.target.value })}
                  placeholder="john.doe@email.com" required />
              </div>
              <div className="form-group">
                <label>{t('booking.guestForm.phone')}</label>
                <input type="tel" value={guestInfo.phone}
                  onChange={e => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                  placeholder="+1 234 567 8900" />
              </div>
              <div className="form-actions">
                <LuxuryButton type="button" variant="secondary" onClick={cancelGuestForm}>{t('booking.guestForm.cancel')}</LuxuryButton>
                <LuxuryButton type="submit" variant="primary" disabled={loading}>
                  {loading ? t('booking.guestForm.processing') : t('booking.guestForm.confirm')}
                </LuxuryButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <div className="booking-header">
        <h1>{t('booking.pageTitle')}</h1>
        <p>{t('booking.pageSubtitle')}</p>
      </div>

      <div className="booking-container">
        {rooms.length === 0 ? (
          <div className="booking-chat">
            {/* Progress */}
            <div className="chat-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${((step + 1) / activeQuestions.length) * 100}%` }}
                />
              </div>
              <p className="progress-text">{t('booking.progress.step', { current: step + 1, total: activeQuestions.length })}</p>
            </div>

            {/* Question */}
            <motion.div
              key={step}
              className="chat-question"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.35 }}
            >
              {currentQuestion.icon && (
                <div className="question-icon">{currentQuestion.icon}</div>
              )}
              <h2>{currentQuestion.question}</h2>

              {/* Select options */}
              {currentQuestion.type === 'select' && (
                <div className="chat-options luxury-options">
                  {currentQuestion.options.map((option) => {
                    const val   = typeof option === 'object' ? option.value : option;
                    const label = typeof option === 'object' ? option.label : option;
                    const desc  = typeof option === 'object' ? option.desc  : null;
                    return (
                      <motion.button
                        key={String(val)}
                        className={`option-btn luxury-option ${formData[currentQuestion.id] === val ? 'selected' : ''}`}
                        onClick={() => handleAnswer(currentQuestion.id, val)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span className="option-label">{label}</span>
                        {desc && <span className="option-desc">{desc}</span>}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Number options */}
              {currentQuestion.type === 'number' && (
                <div className="chat-options number-options">
                  {(currentQuestion.id === 'guests' ? getGuestOptions() : currentQuestion.options).map(num => (
                    <motion.button
                      key={num}
                      className={`option-btn number-option ${formData[currentQuestion.id] === num ? 'selected' : ''}`}
                      onClick={() => handleAnswer(currentQuestion.id, num)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.93 }}
                    >
                      {num}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Date inputs */}
              {currentQuestion.type === 'dates' && (
                <div className="date-inputs luxury-dates">
                  <div className="input-group">
                    <label>{t('booking.dates.checkIn')}</label>
                    <input
                      type="date"
                      value={formData.checkIn}
                      onChange={e => handleAnswer('checkIn', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="input-group">
                    <label>{t('booking.dates.checkOut')}</label>
                    <input
                      type="date"
                      value={formData.checkOut}
                      onChange={e => handleAnswer('checkOut', e.target.value)}
                      min={formData.checkIn || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              )}

              {/* ── Children Info (custom type) ── */}
              {currentQuestion.type === 'children' && (
                <div className="children-info-block">
                  {/* Number of children */}
                  <div className="children-count-section">
                    <h4>{t('booking.children.howMany')}</h4>
                    <div className="number-options">
                      {[1, 2, 3, 4].map(n => (
                        <motion.button
                          key={n}
                          className={`option-btn number-option ${formData.childrenCount === n ? 'selected' : ''}`}
                          onClick={() => handleChildrenCount(n)}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.93 }}
                        >
                          {n}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Ages (optional) */}
                  <div className="children-ages-section">
                    <h4>{t('booking.children.agesTitle')} <span style={{ fontWeight: 400, opacity: 0.6 }}>{t('booking.children.agesHelper')}</span></h4>
                    <div className="age-inputs-grid">
                      {Array.from({ length: formData.childrenCount }).map((_, i) => (
                        <div key={i} className="age-input-group">
                          <label>{t('booking.children.child', { n: i + 1 })}</label>
                          <select
                            value={formData.childrenAges[i] || ''}
                            onChange={e => handleChildAge(i, e.target.value)}
                          >
                            <option value="">{t('booking.children.ageOptional')}</option>
                            <option value="under1">{t('booking.children.underOne')}</option>
                            {Array.from({ length: 17 }, (_, a) => a + 1).map(age => (
                              <option key={age} value={String(age)}>{t('booking.children.yearsOld', { age })}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Navigation */}
            <div className="chat-navigation">
              {step > 0 && (
                <LuxuryButton variant="secondary" onClick={handlePrevious}>
                  {t('booking.nav.previous')}
                </LuxuryButton>
              )}
              <LuxuryButton
                variant="primary"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                {step === activeQuestions.length - 1 ? t('booking.nav.findRooms') : t('booking.nav.next')}
              </LuxuryButton>
            </div>
          </div>

        ) : (
          /* ── Results ── */
          <div className="rooms-results">
            <div className="results-header">
              <h2>{showRecommendations ? t('booking.results.recommended') : t('booking.results.available')}</h2>
              <LuxuryButton variant="secondary" onClick={handleNewBooking}>
                {t('booking.results.newSearch')}
              </LuxuryButton>
            </div>

            {showRecommendations && recommendations.length > 0 && (
              <div className="recommendations-summary">
                <h3>{t('booking.results.basedOn')}</h3>
                <ul>
                  <li>👥 {formData.guests} guest{formData.guests > 1 ? 's' : ''}</li>
                  {formData.guestType === 'family' && formData.hasChildren === 'yes' && (
                    <li>👶 {formData.childrenCount} child{formData.childrenCount > 1 ? 'ren' : ''}</li>
                  )}
                  {formData.roomType && <li>🛏️ {formData.roomType}</li>}
                  <li>📅 {formData.checkIn} → {formData.checkOut}</li>
                </ul>
              </div>
            )}

            {bookingError && (
              <div className="booking-error">
                <p>⚠️ {bookingError}</p>
                <button onClick={() => setBookingError(null)}>{t('booking.results.dismiss')}</button>
              </div>
            )}

            {loading ? (
              <div className="loading">{t('booking.results.loading')}</div>
            ) : rooms.length > 0 ? (
              <div className="rooms-grid">
                {rooms.slice(0, 5).map((room, index) => (
                  <motion.div
                    key={room.id}
                    className="room-card room-card--specs-only"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    {showRecommendations && index < 3 && (
                      <div className="recommendation-badge">{t('booking.results.topMatch')}</div>
                    )}
                    <div className="room-header">
                      <h3>{t('roomDetail.roomTitle')} {room.roomNumber}</h3>
                      <span className="room-type">{room.type}</span>
                    </div>

                    <span className="room-suitability">{getSuitability(room)}</span>

                    <div className="room-details">
                      <div className="room-specs">
                        <div className="spec-item">
                          <span className="spec-label">{t('booking.results.capacityLabel')}</span>
                          <span className="spec-value">{room.capacity} {t('booking.results.guests')}</span>
                        </div>
                        {getViewLabel(room) && (
                          <div className="spec-item">
                            <span className="spec-label">{t('booking.results.viewLabel', { defaultValue: 'View' })}</span>
                            <span className="spec-value">{getViewLabel(room)}</span>
                          </div>
                        )}
                        <div className="spec-item">
                          <span className="spec-label">{t('booking.results.floorLabel')}</span>
                          <span className="spec-value">{room.floor}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">{t('booking.results.priceLabel')}</span>
                          <span className="spec-value price">${room.currentPrice}{t('booking.results.perNight')}</span>
                        </div>
                      </div>

                      {room.features && typeof room.features === 'object' &&
                        (room.features.bed_type || room.features.rating) && (
                        <div className="room-features-compact">
                          {room.features.bed_type  && <span className="feature-tag">🛏️ {room.features.bed_type}</span>}
                          {room.features.rating    && <span className="feature-tag">⭐ {room.features.rating}</span>}
                        </div>
                      )}
                    </div>
                    <div className="room-actions">
                      <LuxuryButton
                        variant="secondary"
                        onClick={() => navigate(`/rooms/${room.id}`)}
                        size="small"
                      >
                        {t('booking.results.viewDetails')}
                      </LuxuryButton>
                      <LuxuryButton
                        variant="primary"
                        onClick={() => handleBookRoom(room)}
                        disabled={loading}
                      >
                        {loading ? t('booking.guestForm.processing') : t('booking.results.bookNow')}
                      </LuxuryButton>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>{t('booking.results.noResults')}</p>
                <LuxuryButton variant="secondary" onClick={handleNewBooking}>
                  {t('booking.results.tryDifferent')}
                </LuxuryButton>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
