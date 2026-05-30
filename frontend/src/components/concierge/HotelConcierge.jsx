import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './HotelConcierge.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Language Helpers ────────────────────────────────────────────
function detectLang(text) {
  if (/[؀-ۿ]/.test(text)) return 'ar';
  if (
    /[çğışöüÇĞİŞÖÜ]/.test(text) ||
    /(merhaba|teşekkür|lütfen|günaydın|hizmet|fiyat|rezervasyon|havuz|masaj|restoran|yemek|menü|oda|kişi|misafir|giriş saati|çıkış|iptal|balayı|tatil|aile|çocuk|jimnastik|şoför|araç|istiyorum|var mı|ne kadar|kaç para|nasıl|nerede|ne zaman)/i.test(text)
  ) return 'tr';
  return 'en';
}

const UI = {
  en: {
    init:         "Welcome to Presidential Luxury Hotel. I'm Alexandre, your personal concierge.\n\nI'm here for everything — rooms, dining, spa, pool, gym, butler, transport, or any question about the hotel. How may I assist you today?",
    placeholder:  'Ask anything about the hotel…',
    altLabel:     'Other options:',
    footer:       '✦ PLHMS · 5-Star Luxury · Available 24/7',
    tooltip:      'AI Concierge',
    perNight:     '/night',
    preparing:    'Alexandre is preparing your experience…',
    error:        (msg) => `I apologize — ${msg || 'a brief connection issue occurred'}. Please try again.`,
    quick: [
      'What services do you offer?',
      'Room for 2 — honeymoon',
      "What's on the restaurant menu?",
      'How much is the spa?',
    ],
  },
  ar: {
    init:         'أهلاً وسهلاً بكم في فندق بريزيدنشيال! أنا ألكسندر، كونسيرجكم الشخصي.\n\nأنا هنا لمساعدتكم في كل شيء — الغرف، والمطاعم، والسبا، والمسبح، واللياقة، والبتلر، والنقل، وأي سؤال عن الفندق. كيف أساعدكم اليوم؟',
    placeholder:  'اسأل عن أي شيء في الفندق…',
    altLabel:     'خيارات أخرى:',
    footer:       '✦ فندق بريزيدنشيال — خدمة ٢٤/٧',
    tooltip:      'كونسيرج الذكاء الاصطناعي',
    perNight:     '/ليلة',
    preparing:    'يقوم ألكسندر بإعداد تجربتكم…',
    error:        () => 'عذراً، حدث خطأ مؤقت. يُرجى المحاولة مرة أخرى.',
    quick: [
      'ما هي الخدمات المتوفرة لديكم؟',
      'غرفة لزوجين — شهر العسل',
      'ما هي قائمة طعام المطعم؟',
      'كم سعر السبا؟',
    ],
  },
  tr: {
    init:         "Presidential Lüks Oteline hoş geldiniz! Ben Alexandre, kişisel conciergenizim.\n\nOdalar, yemek, spa, havuz, fitness, butler, ulaşım veya otel hakkındaki her türlü soru için buradayım. Bugün size nasıl yardımcı olabilirim?",
    placeholder:  'Otel hakkında her şeyi sorabilirsiniz…',
    altLabel:     'Diğer seçenekler:',
    footer:       '✦ PLHMS · 5 Yıldızlı Lüks · 7/24 Hizmetinizde',
    tooltip:      'AI Concierge',
    perNight:     '/gece',
    preparing:    'Alexandre deneyiminizi hazırlıyor…',
    error:        () => 'Özür dileriz — geçici bir bağlantı sorunu oluştu. Lütfen tekrar deneyin.',
    quick: [
      'Hizmetleriniz neler?',
      'İki kişilik oda — balayı',
      'Restoran menüsü nedir?',
      'Spa fiyatları ne kadar?',
    ],
  },
};

// ── Dynamic Greeting ────────────────────────────────────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function timeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

// Varied, time-aware luxury openers so the concierge never greets the same way twice.
const GREETINGS = {
  en: {
    morning:   ['Good morning', 'A bright good morning to you'],
    afternoon: ['Good afternoon', 'A warm welcome this afternoon'],
    evening:   ['Good evening', 'A gracious good evening to you'],
  },
  ar: {
    morning:   ['صباح الخير', 'صباح النور والسرور'],
    afternoon: ['طاب يومكم', 'نهاركم سعيد'],
    evening:   ['مساء الخير', 'مساء النور والسعادة'],
  },
  tr: {
    morning:   ['Günaydın', 'Hayırlı sabahlar'],
    afternoon: ['İyi günler', 'Keyifli öğleden sonraları'],
    evening:   ['İyi akşamlar', 'Zarif bir akşam dileriz'],
  },
};

function buildGreeting(lang = 'en') {
  const L = UI[lang] ? lang : 'en';
  const opener = pick(GREETINGS[L][timeOfDay()]);
  return `${opener} — ${UI[L].init}`;
}

const INITIAL_MESSAGE = (lang = 'en') => ({
  id: 'init',
  role: 'assistant',
  content: buildGreeting(lang),
  timestamp: new Date(),
});

// ── Room Type Labels & Colors ───────────────────────────────────
const TYPE_LABELS = { STANDARD: 'Standard', DELUXE: 'Deluxe', SUITE: 'Suite', PENTHOUSE: 'Penthouse' };
const TYPE_COLORS = { STANDARD: '#6B7280', DELUXE: '#2563EB', SUITE: '#7C3AED', PENTHOUSE: '#C8A96A' };

// ── Recommendation Card ─────────────────────────────────────────
function RecommendationCard({ room, onBook, language }) {
  const u   = UI[language] || UI.en;
  const img = room.images?.[0];
  const view    = room.features?.view;
  const bath    = room.features?.bathroom?.type;
  const services = room.features?.services?.slice(0, 3) || [];

  return (
    <div className="concierge-rec-card">
      {img && (
        <div className="concierge-rec-image">
          <img src={img} alt={`Room ${room.roomNumber}`} loading="lazy" />
          <span className="concierge-rec-badge" style={{ background: TYPE_COLORS[room.type] || '#6B7280' }}>
            {TYPE_LABELS[room.type] || room.type}
          </span>
        </div>
      )}
      <div className="concierge-rec-body">
        <div className="concierge-rec-header">
          <div>
            <h4>Room {room.roomNumber}</h4>
            <p className="concierge-rec-sub">
              Floor {room.floor} · {room.capacity} Guests · {room.size}m²
            </p>
          </div>
          <div className="concierge-rec-price">
            <span className="concierge-rec-amount">${room.currentPrice}</span>
            <span className="concierge-rec-per">{u.perNight}</span>
          </div>
        </div>
        {(view || bath) && (
          <div className="concierge-rec-features">
            {view && <span className="concierge-rec-feature"><span>◎</span> {view}</span>}
            {bath && <span className="concierge-rec-feature"><span>⬡</span> {bath}</span>}
          </div>
        )}
        {services.length > 0 && (
          <div className="concierge-rec-services">
            {services.map((s, i) => <span key={i} className="concierge-rec-service-tag">{s}</span>)}
          </div>
        )}
        <button className="concierge-rec-book-btn" onClick={() => onBook(room)}>
          {language === 'ar' ? 'احجز هذه الغرفة ←' : language === 'tr' ? 'Bu Odayı Rezerve Et →' : 'Reserve This Room →'}
        </button>
      </div>
    </div>
  );
}

// ── Typing Indicator ────────────────────────────────────────────
function TypingIndicator({ label }) {
  return (
    <div className="concierge-msg concierge-msg--ai">
      <div className="concierge-avatar">A</div>
      <div className="concierge-bubble concierge-bubble--ai concierge-typing">
        <span className="concierge-typing-dots"><span /><span /><span /></span>
        {label && <span className="concierge-typing-label">{label}</span>}
      </div>
    </div>
  );
}

// ── Message Renderer ────────────────────────────────────────────
// Detects emoji-led section headers (e.g. "✨ Romantic Escape") and renders
// them as elegant headings with soft separators, so structured experience
// replies feel premium and readable.
const SECTION_EMOJI_RE = /^\s*(?:[←-⇿⌀-➿⬀-⯿☀-⛿️]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDC00-\uDFFF])/;

function renderMessageContent(content) {
  const lines = content.split('\n');
  const blocks = [];
  let headerSeen = false;

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed === '') return; // spacing handled by block margins
    const isHeader = SECTION_EMOJI_RE.test(trimmed) && trimmed.length <= 52;
    if (isHeader) {
      blocks.push(
        <div key={i} className={`concierge-section-head${headerSeen ? ' concierge-section-head--divided' : ''}`}>
          {trimmed}
        </div>
      );
      headerSeen = true;
    } else {
      blocks.push(<p key={i} className="concierge-line">{line}</p>);
    }
  });

  return blocks;
}

// ── Main Component ──────────────────────────────────────────────
export default function HotelConcierge() {
  const navigate = useNavigate();
  const [isOpen,    setIsOpen]    = useState(false);
  const [language,  setLanguage]  = useState('en');
  const [messages,  setMessages]  = useState(() => [INITIAL_MESSAGE('en')]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const [sessionToken] = useState(() => {
    const stored = sessionStorage.getItem('concierge_session_token');
    if (stored) return stored;
    const token = `cs_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem('concierge_session_token', token);
    return token;
  });

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setHasUnread(false);
    }
  }, [isOpen]);

  // Unread badge after 8s when closed
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => setHasUnread(true), 8000);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleToggle = useCallback(() => setIsOpen(prev => !prev), []);

  // ── Send Message ──────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    if (!text?.trim() || isLoading) return;

    const detectedFrontend = detectLang(text);
    setLanguage(detectedFrontend);

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputValue('');
    setIsLoading(true);

    const reqStart   = Date.now();
    const MIN_TYPING = 700; // keep the typing indicator visible briefly even on fast responses, for realism
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 30000); // 15 s hard limit

    try {
      const apiMessages = nextMessages
        .filter(m => m.id !== 'init')
        .map(m => ({ role: m.role, content: m.content }));

      // Collect IDs of every room already shown so the backend can exclude them on alternatives requests
      const shownRoomIds = messages
        .filter(m => m.role === 'assistant' && m.recommendation)
        .flatMap(m => [
          m.recommendation.id,
          ...(m.alternatives || []).map(a => a.id),
        ])
        .filter(Boolean);

      const res = await fetch(`${API_URL}/concierge/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, sessionToken, shownRoomIds }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();

      if (!data?.message) throw new Error('Empty response from concierge');

      const serverLang = data.language || detectedFrontend;
      setLanguage(serverLang);

      const elapsed = Date.now() - reqStart;
      if (elapsed < MIN_TYPING) await new Promise(r => setTimeout(r, MIN_TYPING - elapsed));

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        recommendation: data.recommendation || null,
        alternatives:   data.alternatives   || [],
        extractedNeeds: data.extractedNeeds,
      }]);

    } catch (err) {
      const u = UI[detectedFrontend] || UI.en;
      const isTimeout = err.name === 'AbortError';
      const msg = isTimeout
        ? (detectedFrontend === 'ar'
            ? 'عذراً، انتهت مهلة الاتصال. يُرجى المحاولة مرة أخرى.'
            : detectedFrontend === 'tr'
              ? 'Bağlantı zaman aşımına uğradı. Lütfen tekrar deneyin.'
              : 'The request timed out. Please try again.')
        : u.error(err.message);

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: msg,
        timestamp: new Date(),
        isError: true,
      }]);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, [messages, isLoading, sessionToken]);

  const handleSubmit  = useCallback((e) => { e.preventDefault(); sendMessage(inputValue); }, [inputValue, sendMessage]);
  const handleKeyDown = useCallback((e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(inputValue); } }, [inputValue, sendMessage]);

  const handleBook = useCallback((room) => {
    fetch(`${API_URL}/concierge/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionToken,
        eventType: 'booking_initiated',
        eventData: { roomId: room.id, roomNumber: room.roomNumber, roomType: room.type },
      }),
    }).catch(() => {});
    navigate('/booking', { state: { selectedRoom: room } });
    setIsOpen(false);
  }, [navigate, sessionToken]);

  const handleQuickMessage = useCallback((text) => sendMessage(text), [sendMessage]);

  const u              = UI[language] || UI.en;
  const isFirstMessage = messages.length === 1 && messages[0].id === 'init';
  const isRTL          = language === 'ar';

  return (
    <>
      {/* ── Panel ─────────────────────────────────────────────── */}
      {isOpen && (
        <div className={`concierge-panel${isRTL ? ' concierge-panel--rtl' : ''}`}>

          {/* Header */}
          <div className="concierge-header">
            <div className="concierge-header-left">
              <div className="concierge-header-avatar">A</div>
              <div>
                <h3>Alexandre</h3>
                <p>
                  {language === 'ar' ? 'كونسيرج شخصي · PLHMS'
                  : language === 'tr' ? 'Kişisel Concierge · PLHMS'
                  : 'Personal Concierge · PLHMS'}
                </p>
              </div>
            </div>
            <div className="concierge-header-actions">
              <div className="concierge-status-dot" title="Online" />
              <button className="concierge-close-btn" onClick={handleToggle} aria-label="Close">✕</button>
            </div>
          </div>

          {/* Language indicator */}
          <div className="concierge-lang-bar">
            <span className={`concierge-lang-tag ${language === 'en' ? 'active' : ''}`}>EN</span>
            <span className={`concierge-lang-tag ${language === 'ar' ? 'active' : ''}`}>عربي</span>
            <span className={`concierge-lang-tag ${language === 'tr' ? 'active' : ''}`}>TR</span>
          </div>

          {/* Messages */}
          <div className="concierge-messages" role="log" aria-live="polite">
            {messages.map(msg => (
              <React.Fragment key={msg.id}>
                <div className={`concierge-msg ${msg.role === 'user' ? 'concierge-msg--user' : 'concierge-msg--ai'}`}>
                  {msg.role === 'assistant' && <div className="concierge-avatar">A</div>}
                  <div className={`concierge-bubble ${msg.role === 'user' ? 'concierge-bubble--user' : 'concierge-bubble--ai'} ${msg.isError ? 'concierge-bubble--error' : ''}`}>
                    {msg.role === 'assistant'
                      ? renderMessageContent(msg.content)
                      : msg.content.split('\n').map((line, i, arr) => (
                          <React.Fragment key={i}>
                            {line}
                            {i < arr.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                    <span className="concierge-time">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Room recommendation card */}
                {msg.role === 'assistant' && msg.recommendation && (
                  <div className="concierge-rec-wrapper">
                    <RecommendationCard room={msg.recommendation} onBook={handleBook} language={language} />
                    {msg.alternatives?.length > 0 && (
                      <div className="concierge-alternatives">
                        <p className="concierge-alternatives-label">{u.altLabel}</p>
                        <div className="concierge-alt-list">
                          {msg.alternatives.map(alt => (
                            <button key={alt.id} className="concierge-alt-btn" onClick={() => handleBook(alt)}>
                              <span>Room {alt.roomNumber}</span>
                              <span className="concierge-alt-price">${alt.currentPrice}{u.perNight}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}

            {isLoading && <TypingIndicator label={u.preparing} />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions (first message only) */}
          {isFirstMessage && (
            <div className="concierge-suggestions">
              {u.quick.map((msg, i) => (
                <button key={i} className="concierge-suggestion-btn" onClick={() => handleQuickMessage(msg)}>
                  {msg}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form className="concierge-input-area" onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              className="concierge-input"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={u.placeholder}
              rows={1}
              disabled={isLoading}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            <button
              type="submit"
              className="concierge-send-btn"
              disabled={!inputValue.trim() || isLoading}
              aria-label="Send"
            >
              {isLoading ? (
                <span className="concierge-send-spinner" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </form>

          <div className="concierge-footer-note">{u.footer}</div>
        </div>
      )}

      {/* ── Toggle Button ──────────────────────────────────────── */}
      {!isOpen && (
        <button
          className="concierge-toggle"
          onClick={handleToggle}
          aria-label="Open AI Concierge"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.477 2 2 6.477 2 12C2 13.89 2.525 15.657 3.432 17.168L2 22L6.832 20.568C8.343 21.475 10.11 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 10H16M8 14H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {hasUnread && <span className="concierge-badge" aria-label="New message">1</span>}
        </button>
      )}

      {/* Tooltip */}
      {!isOpen && <div className="concierge-tooltip">{u.tooltip}</div>}
    </>
  );
}
