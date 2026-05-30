import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI, vipAPI } from '../../services/api';
import './LuxuryVIP.css';

// ── Data ──────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: 'comfort',
    title: 'Customize Your Comfort',
    subtitle: 'Tailor every detail of your room atmosphere to perfection',
    tagline: 'ROOM EXPERIENCE',
    icon: '✨',
    color: '#C8A96A',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&auto=format&fit=crop&q=80',
    basePrice: 299,
    badge: 'DELUXE & ABOVE',
    highlights: ['Custom lighting mood', 'Signature room fragrance', 'Bedding color & pillow type', 'Ambient music & temperature', 'Premium room extras'],
    compatibleTypes: ['DELUXE', 'JUNIOR_SUITE', 'EXECUTIVE', 'EXECUTIVE_SUITE', 'FAMILY_SUITE', 'PRESIDENTIAL', 'PRESIDENTIAL_SUITE', 'ROYAL_SUITE', 'VIP'],
    incompatibleMsg: 'Room Comfort Customization is available for Deluxe rooms and above. Your current room may not qualify.',
    categories: [
      {
        id: 'lighting', label: 'Lighting Mood', icon: '💡', type: 'single',
        desc: 'Set the perfect ambiance with custom lighting',
        options: [
          { id: 'warm_gold',    label: 'Warm Gold',      desc: 'Cozy amber warmth',       icon: '🌟', price: 0  },
          { id: 'soft_white',   label: 'Soft White',     desc: 'Clean modern glow',       icon: '⚪', price: 0  },
          { id: 'romantic_dim', label: 'Romantic Dim',   desc: 'Pink & gold tones',       icon: '🌹', price: 25 },
          { id: 'cool_blue',    label: 'Cool Blue',      desc: 'Serene & calming',        icon: '🔵', price: 0  },
        ],
      },
      {
        id: 'fragrance', label: 'Signature Fragrance', icon: '🌸', type: 'single',
        desc: 'Fill your room with a handcrafted luxury scent',
        options: [
          { id: 'lavender', label: 'Lavender',     desc: 'Relaxing & calming',   icon: '💜', price: 30 },
          { id: 'vanilla',  label: 'Vanilla',      desc: 'Warm & comforting',    icon: '🤍', price: 30 },
          { id: 'oud',      label: 'Royal Oud',    desc: 'Luxury Arabic scent',  icon: '🟤', price: 45 },
          { id: 'citrus',   label: 'Fresh Citrus', desc: 'Energizing & bright',  icon: '🍋', price: 30 },
          { id: 'rose',     label: 'Rose',         desc: 'Romantic & elegant',   icon: '🌹', price: 35 },
        ],
      },
      {
        id: 'bedding', label: 'Bedding Color', icon: '🛏️', type: 'single',
        desc: 'Select your preferred linen palette',
        options: [
          { id: 'white',    label: 'Classic White', desc: 'Timeless luxury',   icon: '🤍', price: 0  },
          { id: 'beige',    label: 'Soft Beige',    desc: 'Calm & refined',    icon: '🟡', price: 0  },
          { id: 'navy',     label: 'Dark Navy',     desc: 'Royal & bold',      icon: '💙', price: 15 },
          { id: 'burgundy', label: 'Burgundy',      desc: 'Romantic & rich',   icon: '❤️', price: 15 },
        ],
      },
      {
        id: 'pillows', label: 'Pillow Preference', icon: '☁️', type: 'single',
        desc: 'Choose the pillow firmness that suits you',
        options: [
          { id: 'soft',        label: 'Soft',        desc: 'Fluffy cloud feel',     icon: '🌤️', price: 0  },
          { id: 'medium',      label: 'Medium',      desc: 'Balanced support',      icon: '⚖️', price: 0  },
          { id: 'firm',        label: 'Firm',        desc: 'Strong neck support',   icon: '💪', price: 0  },
          { id: 'memory_foam', label: 'Memory Foam', desc: 'Premium contouring',    icon: '✨', price: 20 },
        ],
      },
      {
        id: 'music', label: 'Ambient Music', icon: '🎵', type: 'single',
        desc: 'Set the soundtrack for your stay',
        options: [
          { id: 'none',     label: 'No Music',          desc: 'Peaceful silence',    icon: '🔇', price: 0  },
          { id: 'piano',    label: 'Piano',             desc: 'Elegant classical',   icon: '🎹', price: 20 },
          { id: 'ambient',  label: 'Deep Relaxation',   desc: 'Stress-melting calm', icon: '🎶', price: 20 },
          { id: 'romantic', label: 'Romantic Playlist', desc: 'Soft & intimate',     icon: '💕', price: 20 },
          { id: 'nature',   label: 'Nature Sounds',     desc: 'Birdsong & streams',  icon: '🌿', price: 20 },
        ],
      },
      {
        id: 'temperature', label: 'Room Temperature', icon: '🌡️', type: 'single',
        desc: 'Your ideal climate awaits',
        options: [
          { id: 'cool',     label: 'Cool',     desc: '18–20 °C',  icon: '❄️', price: 0 },
          { id: 'moderate', label: 'Moderate', desc: '21–23 °C',  icon: '🌤️', price: 0 },
          { id: 'warm',     label: 'Warm',     desc: '24–26 °C',  icon: '☀️', price: 0 },
        ],
      },
      {
        id: 'extras', label: 'Premium Extras', icon: '🎁', type: 'multi',
        desc: 'Add special touches to make your room extraordinary',
        options: [
          { id: 'candles',       label: 'Aromatic Candles',   desc: 'Hand-poured luxury',   icon: '🕯️', price: 40 },
          { id: 'flowers',       label: 'Fresh Flowers',      desc: 'Seasonal bouquet',      icon: '💐', price: 55 },
          { id: 'chocolate',     label: 'Chocolates & Sweets',desc: 'Premium assortment',    icon: '🍫', price: 65 },
          { id: 'welcome_drink', label: 'Welcome Drink',      desc: 'Fresh juice or mocktail',icon: '🥤', price: 35 },
        ],
      },
    ],
  },
  {
    id: 'honeymoon',
    title: 'Honeymoon & Romantic',
    subtitle: 'An unforgettable romantic experience crafted just for two',
    tagline: 'COUPLES EXPERIENCE',
    icon: '💑',
    color: '#E8A0B0',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&auto=format&fit=crop&q=80',
    basePrice: 499,
    badge: 'COUPLES & SUITES',
    highlights: ['Rose petal & candle setup', 'Private romantic dining', 'Champagne & fruits', 'Professional photographer', 'Luxury gift box'],
    compatibleTypes: ['COUPLE', 'JUNIOR_SUITE', 'EXECUTIVE', 'EXECUTIVE_SUITE', 'PRESIDENTIAL', 'PRESIDENTIAL_SUITE', 'ROYAL_SUITE', 'VIP'],
    incompatibleMsg: 'Honeymoon & Romantic Experience is available for Couple rooms, Suites, and VIP rooms only.',
    categories: [
      {
        id: 'decorations', label: 'Room Decorations', icon: '🌹', type: 'multi',
        desc: 'Transform your room into a romantic sanctuary',
        options: [
          { id: 'rose_petals',   label: 'Rose Petals on Bed',  desc: 'Hundreds of red roses',    icon: '🌹', price: 80  },
          { id: 'candle_pathway',label: 'Candle Pathway',      desc: 'Guided entrance of light', icon: '🕯️', price: 120 },
          { id: 'balloons',      label: 'Balloon Decoration',  desc: 'Red, gold & white',        icon: '🎈', price: 95  },
          { id: 'just_married',  label: '"Just Married" Banner',desc: 'Elegant gold script',     icon: '🎊', price: 45  },
        ],
      },
      {
        id: 'lighting', label: 'Romantic Lighting', icon: '✨', type: 'single',
        desc: 'Lighting that sets the mood perfectly',
        options: [
          { id: 'warm_romantic', label: 'Warm Romantic',  desc: 'Soft amber glow',    icon: '🌟', price: 0  },
          { id: 'candle_style',  label: 'Candle-Style',   desc: 'Flickering warmth',  icon: '🕯️', price: 35 },
        ],
      },
      {
        id: 'food', label: 'Private Dining', icon: '🍽️', type: 'multi',
        desc: 'Gourmet meals served in the privacy of your suite',
        options: [
          { id: 'dinner_italian', label: 'Italian Dinner',      desc: 'Pasta, risotto & tiramisu', icon: '🍝', price: 180 },
          { id: 'dinner_arabic',  label: 'Arabian Dinner',      desc: 'Traditional luxury flavors', icon: '🫕', price: 160 },
          { id: 'dinner_intl',    label: 'International Dinner',desc: 'Chef\'s grand selection',   icon: '🍱', price: 200 },
          { id: 'cake_chocolate', label: 'Chocolate Cake',      desc: 'With custom message',        icon: '🎂', price: 85  },
          { id: 'cake_vanilla',   label: 'Vanilla Cake',        desc: 'Delicate & sweet',           icon: '🍰', price: 85  },
          { id: 'fruit_platter',  label: 'Fruit Platter',       desc: 'Seasonal premium fruits',    icon: '🍓', price: 65  },
        ],
      },
      {
        id: 'drinks', label: 'Beverages', icon: '🥂', type: 'multi',
        desc: 'Premium drinks to complete your romantic evening',
        options: [
          { id: 'fresh_juice', label: 'Fresh Juice Selection', desc: 'Seasonal pressed juices',   icon: '🍊', price: 40 },
          { id: 'sparkling',   label: 'Sparkling Mocktails',   desc: 'Premium celebratory bottles', icon: '🥂', price: 55 },
        ],
      },
      {
        id: 'extras', label: 'Special Experiences', icon: '💎', type: 'multi',
        desc: 'Once-in-a-lifetime moments to remember forever',
        options: [
          { id: 'photographer',       label: 'Private Photo Session',  desc: '30-min professional shoot', icon: '📸', price: 250 },
          { id: 'music_setup',        label: 'Romantic Music Setup',   desc: 'Curated playlist & speakers', icon: '🎵', price: 75  },
          { id: 'late_checkout',      label: 'Late Checkout',          desc: 'Checkout until 3 PM',         icon: '⏰', price: 60  },
          { id: 'gift_box',           label: 'Luxury Gift Box',        desc: 'Curated premium presents',    icon: '🎁', price: 150 },
          { id: 'private_celebration',label: 'In-Room Celebration',    desc: 'Full setup inside your room', icon: '🥳', price: 200 },
        ],
      },
    ],
  },
  {
    id: 'events',
    title: 'Events & Celebrations',
    subtitle: 'Grand celebrations orchestrated to perfection in our luxury spaces',
    tagline: 'PRIVATE EVENTS',
    icon: '🎉',
    color: '#8B9DC3',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&auto=format&fit=crop&q=80',
    basePrice: 799,
    badge: 'SUITES & VIP',
    highlights: ['Fully decorated event space', 'Custom catering & buffet', 'DJ or live band', 'Professional photography & video', 'Stage & lighting effects'],
    compatibleTypes: ['FAMILY', 'FAMILY_SUITE', 'JUNIOR_SUITE', 'EXECUTIVE_SUITE', 'PRESIDENTIAL', 'PRESIDENTIAL_SUITE', 'ROYAL_SUITE', 'VIP'],
    incompatibleMsg: 'Events & Celebrations are available for Suites, VIP rooms, and family accommodations.',
    categories: [
      {
        id: 'event_type', label: 'Event Type', icon: '🎊', type: 'single',
        desc: 'What are we celebrating?',
        options: [
          { id: 'birthday',     label: 'Birthday',      desc: 'Your special day',     icon: '🎂', price: 0   },
          { id: 'wedding',      label: 'Wedding',       desc: 'The most sacred day',  icon: '💍', price: 200 },
          { id: 'engagement',   label: 'Engagement',    desc: 'A new beginning',      icon: '💑', price: 150 },
          { id: 'private_party',label: 'Private Party', desc: 'Custom gathering',     icon: '🥳', price: 50  },
        ],
      },
      {
        id: 'hall', label: 'Event Hall Size', icon: '🏛️', type: 'single',
        desc: 'Choose the space that fits your guests',
        options: [
          { id: 'small',  label: 'Intimate Hall',  desc: '10–20 guests',   icon: '🏠', price: 0   },
          { id: 'medium', label: 'Standard Hall',  desc: '20–50 guests',   icon: '🏢', price: 250 },
          { id: 'large',  label: 'Grand Ballroom', desc: '50–150 guests',  icon: '🏛️', price: 600 },
        ],
      },
      {
        id: 'decoration', label: 'Decoration Theme', icon: '🎨', type: 'single',
        desc: 'Set the visual tone for your celebration',
        options: [
          { id: 'classic',       label: 'Classic Elegance', desc: 'Timeless & refined',    icon: '🤍', price: 150 },
          { id: 'luxury_gold',   label: 'Luxury Gold',      desc: 'Opulent & grand',       icon: '✨', price: 350 },
          { id: 'floral',        label: 'Floral Garden',    desc: 'Blooms & freshness',    icon: '🌸', price: 250 },
          { id: 'modern_minimal',label: 'Modern Minimal',   desc: 'Clean sophistication',  icon: '◻️', price: 200 },
        ],
      },
      {
        id: 'catering', label: 'Catering Style', icon: '🍽️', type: 'single',
        desc: 'Select how your guests will be served',
        options: [
          { id: 'buffet',          label: 'Grand Buffet',    desc: 'Full spread for all', icon: '🍱', price: 180 },
          { id: 'open_menu',       label: 'À la Carte Menu', desc: 'Individual orders',   icon: '📋', price: 220 },
          { id: 'custom_catering', label: 'Private Chef',    desc: 'Bespoke menu design', icon: '👨‍🍳', price: 350 },
        ],
      },
      {
        id: 'photography', label: 'Photography & Video', icon: '📸', type: 'single',
        desc: 'Capture every precious memory',
        options: [
          { id: 'none',     label: 'Personal Only',      desc: 'No pro coverage',          icon: '🔇', price: 0   },
          { id: 'basic',    label: 'Photo Coverage',     desc: 'Key moments captured',     icon: '📷', price: 300 },
          { id: 'full_pro', label: 'Full Media Team',    desc: 'Photo + Cinematic video',  icon: '🎥', price: 800 },
        ],
      },
      {
        id: 'entertainment', label: 'Entertainment', icon: '🎵', type: 'single',
        desc: 'Set the energy level for your event',
        options: [
          { id: 'calm_bg',   label: 'Background Music', desc: 'Soft curated playlist', icon: '🎶', price: 100  },
          { id: 'dj',        label: 'Professional DJ',  desc: 'Live mixing & beats',   icon: '🎧', price: 500  },
          { id: 'live_band', label: 'Live Band',         desc: 'Full band performance', icon: '🎸', price: 1200 },
        ],
      },
      {
        id: 'extras', label: 'Additional Services', icon: '⭐', type: 'multi',
        desc: 'Extra touches that elevate every detail',
        options: [
          { id: 'cake_design',      label: 'Custom Cake Design',   desc: 'Personalized artistry',   icon: '🎂', price: 120 },
          { id: 'stage_setup',      label: 'Stage & Podium Setup', desc: 'Raised platform & draping',icon: '🎭', price: 300 },
          { id: 'lighting_effects', label: 'Lighting Effects',     desc: 'LED patterns & spotlights', icon: '💡', price: 200 },
          { id: 'welcome_service',  label: 'Guest Welcome Team',   desc: 'Dedicated greeters',       icon: '👋', price: 150 },
          { id: 'laundry',          label: 'Express Laundry',      desc: 'Same-day service',          icon: '👔', price: 80  },
          { id: 'post_cleaning',    label: 'Post-Event Cleaning',  desc: 'Full venue restoration',    icon: '✨', price: 180 },
        ],
      },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const calcTotal = (service, sel = {}) => {
  if (!service) return 0;
  let total = service.basePrice;
  service.categories.forEach(cat => {
    const v = sel[cat.id];
    if (!v) return;
    const ids = Array.isArray(v) ? v : [v];
    ids.forEach(id => {
      const o = cat.options.find(x => x.id === id);
      if (o) total += o.price;
    });
  });
  return total;
};

const fadeSlide = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const staggerGrid = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardAnim = {
  hidden:  { opacity: 0, y: 32, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
};

// ── OptionCard ────────────────────────────────────────────────────────────────

const OptionCard = ({ option, selected, onSelect, multiSelect }) => (
  <motion.button
    className={`lvip-opt${selected ? ' lvip-opt--sel' : ''}`}
    onClick={onSelect}
    whileHover={{ y: -2, scale: 1.02 }}
    whileTap={{ scale: 0.96 }}
    transition={{ type: 'spring', stiffness: 420, damping: 28 }}
    type="button"
  >
    <span className="lvip-opt__ico">{option.icon}</span>
    <span className="lvip-opt__lbl">{option.label}</span>
    <span className="lvip-opt__dsc">{option.desc}</span>
    {option.price > 0 && <span className="lvip-opt__prc">+${option.price}</span>}
    <span className={`lvip-opt__chk${selected ? ' on' : ''}`}>
      {multiSelect ? (selected ? '✓' : '') : (selected ? '◉' : '○')}
    </span>
  </motion.button>
);

// ── SummaryPanel ──────────────────────────────────────────────────────────────

const SummaryPanel = ({ service, sel, total, onNext }) => {
  const lines = [];
  service?.categories.forEach(cat => {
    const v = sel?.[cat.id];
    if (!v) return;
    const ids = Array.isArray(v) ? v : [v];
    ids.forEach(id => {
      if (id === 'none') return;
      const o = cat.options.find(x => x.id === id);
      if (o) lines.push({ icon: o.icon, label: o.label, price: o.price });
    });
  });

  return (
    <div className="lvip-sum">
      <div className="lvip-sum__head">
        <span className="lvip-sum__svc-icon">{service?.icon}</span>
        <div>
          <p className="lvip-sum__svc-name">{service?.title}</p>
          <p className="lvip-sum__base">Base package · ${service?.basePrice}</p>
        </div>
      </div>

      <div className="lvip-sum__sep" />

      {lines.length === 0 ? (
        <p className="lvip-sum__empty">Select options to build your summary</p>
      ) : (
        <ul className="lvip-sum__list">
          {lines.map((l, i) => (
            <li key={i} className="lvip-sum__row">
              <span>{l.icon} {l.label}</span>
              <span className="lvip-sum__row-prc">{l.price > 0 ? `+$${l.price}` : 'Free'}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="lvip-sum__sep" />

      <div className="lvip-sum__total">
        <span>Total Estimate</span>
        <span className="lvip-sum__total-num">${total}</span>
      </div>

      <motion.button
        className="lvip-btn-primary lvip-sum__cta"
        onClick={onNext}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        type="button"
      >
        Review &amp; Reserve →
      </motion.button>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const LuxuryVIP = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const topRef = useRef(null);

  const [activeId, setActiveId] = useState(null);
  const [step, setStep] = useState(0);        // 0 cards · 1 customize · 2 review · 3 success
  const [sel, setSel] = useState({});          // { [serviceId]: { [catId]: val } }
  const [eventDate, setEventDate] = useState('');
  const [notes, setNotes] = useState('');
  const [userBooking, setUserBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!user) return;
    bookingAPI.getMyBookings()
      .then(data => {
        const list = Array.isArray(data) ? data : (data.bookings || []);
        const active = list.find(b =>
          ['CONFIRMED', 'PENDING', 'CHECKED_IN'].includes(b.status) &&
          new Date(b.checkOutDate) >= new Date()
        );
        setUserBooking(active || null);
      })
      .catch(() => {});
  }, [user]);

  const service = useMemo(() => SERVICES.find(s => s.id === activeId), [activeId]);
  const serviceSel = useMemo(() => sel[activeId] || {}, [sel, activeId]);
  const total = useMemo(() => calcTotal(service, serviceSel), [service, serviceSel]);

  const isCompatible = useMemo(() => {
    if (!userBooking || !service) return true;
    const rt = (userBooking.room?.type || userBooking.roomType || '').toUpperCase();
    return service.compatibleTypes.some(t => rt.includes(t) || t.includes(rt));
  }, [userBooking, service]);

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth' });

  const pickService = (id) => { setActiveId(id); setStep(1); scrollTop(); };
  const goBack = () => { if (step === 2) setStep(1); else { setStep(0); setActiveId(null); } scrollTop(); };

  const setSingle = useCallback((catId, optId) => {
    setSel(p => ({ ...p, [activeId]: { ...(p[activeId] || {}), [catId]: optId } }));
  }, [activeId]);

  const toggleMulti = useCallback((catId, optId) => {
    setSel(p => {
      const cur = p[activeId]?.[catId] || [];
      const next = cur.includes(optId) ? cur.filter(x => x !== optId) : [...cur, optId];
      return { ...p, [activeId]: { ...(p[activeId] || {}), [catId]: next } };
    });
  }, [activeId]);

  const isSel = useCallback((catId, optId, multi) => {
    const v = serviceSel[catId];
    return multi ? (Array.isArray(v) && v.includes(optId)) : v === optId;
  }, [serviceSel]);

  const goReview = () => {
    if (!user) { navigate('/access'); return; }
    setStep(2); scrollTop();
  };

  const handleSubmit = async () => {
    if (!user) { navigate('/access'); return; }
    if (!userBooking) {
      setError('You need an active room booking to use VIP services. Please book a room first.');
      return;
    }
    setSubmitting(true); setError(null);
    try {
      const res = await vipAPI.bookVipService({
        serviceType: `vip_${activeId}`,
        roomBookingId: userBooking.id,
        bookingDetails: { date: eventDate || new Date().toISOString().split('T')[0], notes },
        formData: { service: activeId, serviceTitle: service?.title, selections: serviceSel, totalPrice: total },
      });
      setResult(res.booking);
      setStep(3); scrollTop();
    } catch (err) {
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Summary lines helper ────────────────────────────────────────
  const summaryLines = useMemo(() => {
    const lines = [];
    service?.categories.forEach(cat => {
      const v = serviceSel[cat.id];
      if (!v) return;
      const ids = Array.isArray(v) ? v : [v];
      ids.forEach(id => {
        if (id === 'none') return;
        const o = cat.options.find(x => x.id === id);
        if (o) lines.push({ cat: cat.label, catIcon: cat.icon, opt: o });
      });
    });
    return lines;
  }, [service, serviceSel]);

  // ─────────────────────────────────────────────────────────────────
  // RENDER: STEP 0 — Service Selection
  // ─────────────────────────────────────────────────────────────────
  const renderCards = () => (
    <motion.div variants={fadeSlide} initial="hidden" animate="visible" exit="exit" key="step0">
      <div className="lvip-sec-hd">
        <span className="lvip-kicker">Choose Your Exclusive Experience</span>
        <h2 className="lvip-sec-title">Three Signature Packages</h2>
        <p className="lvip-sec-sub">
          Each experience is fully customizable. Select a package below to begin building
          your perfect luxury stay — every detail crafted to your preference.
        </p>
      </div>

      <div className="lvip-grid3">
        {SERVICES.map((svc, i) => (
          <motion.article
            key={svc.id}
            className="lvip-svc-card"
            variants={cardAnim}
            initial="hidden"
            animate="visible"
            transition={{ delay: i * 0.12 }}
            whileHover={{ y: -10, transition: { type: 'spring', stiffness: 280 } }}
          >
            {/* Image */}
            <div className="lvip-svc-card__img-wrap">
              <img src={svc.image} alt={svc.title} className="lvip-svc-card__img" loading="lazy" />
              <div className="lvip-svc-card__img-grad" />
              <span className="lvip-svc-card__badge">{svc.badge}</span>
              <div className="lvip-svc-card__price-tag">
                <span className="lvip-svc-card__price-from">from</span>
                <span className="lvip-svc-card__price-num">${svc.basePrice}</span>
              </div>
              <span className="lvip-svc-card__big-icon">{svc.icon}</span>
            </div>

            {/* Body */}
            <div className="lvip-svc-card__body">
              <span className="lvip-svc-card__tagline">{svc.tagline}</span>
              <h3 className="lvip-svc-card__title">{svc.title}</h3>
              <p className="lvip-svc-card__sub">{svc.subtitle}</p>

              <div className="lvip-svc-card__sep" />

              <ul className="lvip-svc-card__hi">
                {svc.highlights.map(h => (
                  <li key={h}><span className="lvip-svc-card__tick">✓</span>{h}</li>
                ))}
              </ul>

              <motion.button
                className="lvip-btn-primary lvip-svc-card__btn"
                onClick={() => pickService(svc.id)}
                whileTap={{ scale: 0.95 }}
                type="button"
              >
                Customize &amp; Reserve →
              </motion.button>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Info strip */}
      <div className="lvip-info-strip">
        <div className="lvip-info-strip__item">
          <span className="lvip-info-strip__icon">🔒</span>
          <div>
            <strong>Secure Booking</strong>
            <span>Your details are always protected</span>
          </div>
        </div>
        <div className="lvip-info-strip__div" />
        <div className="lvip-info-strip__item">
          <span className="lvip-info-strip__icon">⏱️</span>
          <div>
            <strong>2-Hour Confirmation</strong>
            <span>Our concierge confirms swiftly</span>
          </div>
        </div>
        <div className="lvip-info-strip__div" />
        <div className="lvip-info-strip__item">
          <span className="lvip-info-strip__icon">🎯</span>
          <div>
            <strong>100% Customizable</strong>
            <span>Every detail tailored to you</span>
          </div>
        </div>
        <div className="lvip-info-strip__div" />
        <div className="lvip-info-strip__item">
          <span className="lvip-info-strip__icon">👑</span>
          <div>
            <strong>VIP Concierge</strong>
            <span>Dedicated personal service</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // ─────────────────────────────────────────────────────────────────
  // RENDER: STEP 1 — Customize
  // ─────────────────────────────────────────────────────────────────
  const renderCustomize = () => (
    <motion.div variants={fadeSlide} initial="hidden" animate="visible" exit="exit" key="step1">
      {/* Top bar */}
      <div className="lvip-topbar">
        <button className="lvip-back" onClick={goBack} type="button">← Back</button>
        <div className="lvip-topbar__info">
          <span className="lvip-topbar__icon">{service?.icon}</span>
          <div>
            <span className="lvip-topbar__tagline">{service?.tagline}</span>
            <h2 className="lvip-topbar__title">{service?.title}</h2>
          </div>
        </div>
        <div className="lvip-topbar__price">
          <span className="lvip-topbar__price-label">Current Total</span>
          <span className="lvip-topbar__price-num">${total}</span>
        </div>
      </div>

      {/* Compatibility notice */}
      {user && userBooking && !isCompatible && (
        <motion.div className="lvip-compat" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <span>⚠️</span>
          <div>
            <strong>Room Compatibility Notice</strong>
            <p>{service?.incompatibleMsg}</p>
          </div>
        </motion.div>
      )}

      {/* Step progress */}
      <div className="lvip-progress">
        <div className="lvip-progress__step lvip-progress__step--done">1 Service Selected</div>
        <div className="lvip-progress__line lvip-progress__line--active" />
        <div className="lvip-progress__step lvip-progress__step--active">2 Customize</div>
        <div className="lvip-progress__line" />
        <div className="lvip-progress__step">3 Review</div>
        <div className="lvip-progress__line" />
        <div className="lvip-progress__step">4 Confirm</div>
      </div>

      {/* 2-column layout */}
      <div className="lvip-cust-layout">
        {/* Options column */}
        <div className="lvip-opts-col">
          {service?.categories.map((cat, ci) => (
            <motion.div
              key={cat.id}
              className="lvip-cat-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.06, duration: 0.4 }}
            >
              <div className="lvip-cat-block__hd">
                <div className="lvip-cat-block__icon-wrap">{cat.icon}</div>
                <div>
                  <h3 className="lvip-cat-block__title">{cat.label}</h3>
                  <p className="lvip-cat-block__desc">{cat.desc}</p>
                </div>
                <span className="lvip-cat-block__type">
                  {cat.type === 'multi' ? '☑ Multiple' : '◉ One choice'}
                </span>
              </div>

              <div className={`lvip-opts-grid${cat.options.length <= 3 ? ' lvip-opts-grid--sm' : ''}`}>
                {cat.options.map(opt => (
                  <OptionCard
                    key={opt.id}
                    option={opt}
                    selected={isSel(cat.id, opt.id, cat.type === 'multi')}
                    multiSelect={cat.type === 'multi'}
                    onSelect={() =>
                      cat.type === 'multi'
                        ? toggleMulti(cat.id, opt.id)
                        : setSingle(cat.id, opt.id)
                    }
                  />
                ))}
              </div>
            </motion.div>
          ))}

          {/* Mobile CTA */}
          <div className="lvip-mobile-bar">
            <div className="lvip-mobile-bar__total">
              <span>Your estimate</span>
              <strong>${total}</strong>
            </div>
            <button className="lvip-btn-primary" onClick={goReview} type="button">
              Review &amp; Reserve →
            </button>
          </div>
        </div>

        {/* Sticky summary */}
        <SummaryPanel service={service} sel={serviceSel} total={total} onNext={goReview} />
      </div>
    </motion.div>
  );

  // ─────────────────────────────────────────────────────────────────
  // RENDER: STEP 2 — Review
  // ─────────────────────────────────────────────────────────────────
  const renderReview = () => {
    const grouped = {};
    summaryLines.forEach(({ cat, catIcon, opt }) => {
      if (!grouped[cat]) grouped[cat] = { icon: catIcon, items: [] };
      grouped[cat].items.push(opt);
    });

    return (
      <motion.div variants={fadeSlide} initial="hidden" animate="visible" exit="exit" key="step2">
        <button className="lvip-back" onClick={goBack} type="button">← Back to Options</button>

        {/* Step progress */}
        <div className="lvip-progress">
          <div className="lvip-progress__step lvip-progress__step--done">1 Service</div>
          <div className="lvip-progress__line lvip-progress__line--active" />
          <div className="lvip-progress__step lvip-progress__step--done">2 Customize</div>
          <div className="lvip-progress__line lvip-progress__line--active" />
          <div className="lvip-progress__step lvip-progress__step--active">3 Review</div>
          <div className="lvip-progress__line" />
          <div className="lvip-progress__step">4 Confirm</div>
        </div>

        <div className="lvip-review-layout">
          {/* Left: selections */}
          <div>
            <div className="lvip-review-svc-hd">
              <span>{service?.icon}</span>
              <div>
                <h3>{service?.title}</h3>
                <p>{service?.subtitle}</p>
              </div>
            </div>

            {Object.keys(grouped).length > 0 ? (
              Object.entries(grouped).map(([catName, { icon, items }]) => (
                <div key={catName} className="lvip-review-group">
                  <p className="lvip-review-group__hd">{icon} {catName}</p>
                  {items.map(opt => (
                    <div key={opt.id} className="lvip-review-row">
                      <span>{opt.icon} {opt.label}</span>
                      <span className="lvip-review-row__prc">{opt.price > 0 ? `$${opt.price}` : 'Included'}</span>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="lvip-review-empty">
                <span>📋</span>
                <p>No additional options selected. Base package will be applied.</p>
              </div>
            )}

            {/* Date & notes */}
            <div className="lvip-review-form">
              <h4 className="lvip-review-form__title">📅 Booking Details</h4>

              {userBooking && (
                <div className="lvip-review-room-chip">
                  <span>🏨</span>
                  <div>
                    <strong>Room {userBooking.room?.roomNumber || '—'}</strong>
                    <span>{userBooking.room?.type || 'Standard'}</span>
                  </div>
                </div>
              )}

              {!user && (
                <div className="lvip-notice lvip-notice--warn">
                  Please{' '}
                  <button onClick={() => navigate('/access')} type="button">sign in</button>{' '}
                  to complete your VIP reservation.
                </div>
              )}

              {user && !userBooking && (
                <div className="lvip-notice lvip-notice--warn">
                  ⚠️ An active room booking is required.{' '}
                  <button onClick={() => navigate('/booking')} type="button">Book a room first</button>
                </div>
              )}

              <label className="lvip-label">
                Preferred Service Date
                <input
                  type="date"
                  className="lvip-input"
                  value={eventDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setEventDate(e.target.value)}
                />
              </label>

              <label className="lvip-label">
                Special Notes <small>(optional)</small>
                <textarea
                  className="lvip-input"
                  rows={4}
                  placeholder="Dietary requirements, personal preferences, surprise requests…"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </label>
            </div>
          </div>

          {/* Right: price card + CTA */}
          <div className="lvip-review-aside">
            <div className="lvip-price-card">
              <p className="lvip-price-card__tag">PRICE SUMMARY</p>
              <div className="lvip-price-card__row">
                <span>Base package</span>
                <span>${service?.basePrice}</span>
              </div>
              {summaryLines.filter(l => l.opt.price > 0).map((l, i) => (
                <div key={i} className="lvip-price-card__row lvip-price-card__row--extra">
                  <span>{l.opt.icon} {l.opt.label}</span>
                  <span>+${l.opt.price}</span>
                </div>
              ))}
              <div className="lvip-price-card__sep" />
              <div className="lvip-price-card__total">
                <span>Total</span>
                <span className="lvip-price-card__total-num">${total}</span>
              </div>
              <p className="lvip-price-card__note">Price confirmed after concierge review</p>
            </div>

            {error && (
              <motion.div className="lvip-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <span>⚠️</span> {error}
              </motion.div>
            )}

            <motion.button
              className="lvip-btn-primary lvip-btn-xl"
              onClick={handleSubmit}
              disabled={submitting || !user || !userBooking}
              whileHover={{ scale: (!user || !userBooking || submitting) ? 1 : 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="button"
            >
              {submitting ? (
                <><span className="lvip-spin" /> Processing…</>
              ) : (
                'Confirm & Reserve ✦'
              )}
            </motion.button>

            <p className="lvip-review-note">
              🔒 Secure booking · Our team confirms within 2 hours
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  // ─────────────────────────────────────────────────────────────────
  // RENDER: STEP 3 — Success
  // ─────────────────────────────────────────────────────────────────
  const renderSuccess = () => (
    <motion.div
      className="lvip-success"
      key="step3"
      initial={{ opacity: 0, scale: 0.88, y: 40 }}
      animate={{ opacity: 1, scale: 1,    y: 0  }}
      transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.05 }}
    >
      <motion.div
        className="lvip-success__badge"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 320, damping: 18 }}
      >
        ✦
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h2 className="lvip-success__title">Experience Reserved!</h2>
        <p className="lvip-success__num">Booking #{result?.bookingNumber}</p>
        <p className="lvip-success__sub">
          Your <strong>{service?.title}</strong> has been confirmed.
          Our luxury concierge team will contact you within 2 hours to finalize every detail.
        </p>
      </motion.div>

      <motion.div className="lvip-success__details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <div className="lvip-success__row"><span>🎯 Service</span><span>{service?.title}</span></div>
        <div className="lvip-success__row"><span>💰 Total</span><span>${total}</span></div>
        {eventDate && <div className="lvip-success__row"><span>📅 Date</span><span>{eventDate}</span></div>}
        {userBooking?.room?.roomNumber && (
          <div className="lvip-success__row"><span>🏨 Room</span><span>{userBooking.room.roomNumber}</span></div>
        )}
      </motion.div>

      <motion.div className="lvip-success__actions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <button
          className="lvip-btn-primary"
          onClick={() => { setStep(0); setActiveId(null); setResult(null); scrollTop(); }}
          type="button"
        >
          Add Another Experience
        </button>
        <button className="lvip-btn-ghost" onClick={() => navigate('/my-bookings')} type="button">
          View My Bookings
        </button>
      </motion.div>
    </motion.div>
  );

  // ─────────────────────────────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="lvip" ref={topRef}>
      {/* ── Hero ── */}
      <section className="lvip-hero">
        <div className="lvip-hero__bg" />
        <div className="lvip-hero__overlay" />
        <div className="lvip-hero__particles" />
        <motion.div
          className="lvip-hero__body container"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <span className="lvip-hero__kicker">Presidential Luxury Hotel · Exclusive VIP Collection</span>
          <h1 className="lvip-hero__title">
            Luxury &amp; <em>VIP</em><br />Services
          </h1>
          <p className="lvip-hero__sub">
            Redefine your stay with bespoke experiences crafted exclusively for our most
            discerning guests. Every detail, every moment — tailored to perfection.
          </p>
          <div className="lvip-hero__stats">
            {[
              { n: '3',   l: 'Signature Experiences' },
              { n: '50+', l: 'Customizable Options'  },
              { n: '24/7',l: 'Dedicated Concierge'   },
              { n: '★ 5', l: 'Guest Rating'          },
            ].map((s, i) => (
              <React.Fragment key={s.n}>
                {i > 0 && <div className="lvip-hero__stat-sep" />}
                <div className="lvip-hero__stat">
                  <strong>{s.n}</strong>
                  <span>{s.l}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          <motion.button
            className="lvip-hero__scroll-btn"
            onClick={() => document.querySelector('.lvip-main')?.scrollIntoView({ behavior: 'smooth' })}
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            type="button"
          >
            ↓ Explore Packages
          </motion.button>
        </motion.div>
      </section>

      {/* ── Content ── */}
      <main className="lvip-main container">
        <AnimatePresence mode="wait">
          {step === 0 && renderCards()}
          {step === 1 && renderCustomize()}
          {step === 2 && renderReview()}
          {step === 3 && renderSuccess()}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default LuxuryVIP;
