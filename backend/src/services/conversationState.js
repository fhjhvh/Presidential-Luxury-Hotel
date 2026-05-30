// ═══════════════════════════════════════════════════════════════
//  CONVERSATION STATE ENGINE — single source of truth per request
//
//  Replaces the ad-hoc state computations scattered through the
//  controller. Every chat turn:
//    1. buildConversationState(messages)  → structured state object
//    2. decideMode(state, intent, cues)   → reasoning mode
//    3. tryDirectAnswer(state, text)      → optional LLM-less reply for
//                                            simple follow-up facts
//    4. AI service receives state and reasons over structured data
//
//  Frontend is the source of truth for messages, so state is REBUILT
//  every turn from the message history. No persistence layer required;
//  no stale-state class of bugs.
// ═══════════════════════════════════════════════════════════════

// ── SUITE CATALOG ────────────────────────────────────────────────
// Canonical, structured facts for every suite TYPE the AI can mention.
// When the assistant says "Executive Suite", we look up this row so the
// next turn's follow-ups ("how is the view?", "breakfast?") are answered
// from REAL DATA, not hallucinated prose.
export const SUITE_CATALOG = {
  STANDARD: {
    type: 'STANDARD', label: 'Standard Room',
    capacityRange: '2–3 guests', capacityNumeric: { min: 2, max: 3 },
    sizeRange: '28–38 m²', view: 'City view', floorRange: '1–2',
    priceFrom: 150, breakfastIncluded: false, spaAccessIncluded: false,
    hasBalcony: false, hasJacuzzi: false, hasButler: false,
    amenities: ['Wi-Fi', 'Smart TV', 'Air conditioning', 'Safe', 'Minibar', 'Daily housekeeping'],
    atmosphere: 'comfortable and quiet, modern essentials',
  },
  DELUXE: {
    type: 'DELUXE', label: 'Deluxe Suite',
    capacityRange: '2–4 guests', capacityNumeric: { min: 2, max: 4 },
    sizeRange: '42–75 m²', view: 'Panoramic city or pool', floorRange: '3–6',
    priceFrom: 280, breakfastIncluded: false, spaAccessIncluded: true,
    hasBalcony: true, hasJacuzzi: true, hasButler: false,
    amenities: ['Marble bathroom with jacuzzi', 'Private balcony', 'Nespresso', 'Wine fridge', 'Panoramic views'],
    atmosphere: 'sophisticated, panoramic, generous',
  },
  JUNIOR_SUITE: {
    type: 'JUNIOR_SUITE', label: 'Junior Suite',
    capacityRange: '2–3 guests', capacityNumeric: { min: 2, max: 3 },
    sizeRange: '60 m²', view: 'Panoramic', floorRange: '7–9',
    priceFrom: 600, breakfastIncluded: true, spaAccessIncluded: true,
    hasBalcony: true, hasJacuzzi: true, hasButler: false,
    amenities: ['Separate sitting area', 'Marble bathroom', 'Premium linens', 'Balcony'],
    atmosphere: 'elegant, intimate, refined',
  },
  EXECUTIVE_SUITE: {
    type: 'EXECUTIVE_SUITE', label: 'Executive Suite',
    capacityRange: '2–4 guests', capacityNumeric: { min: 2, max: 4 },
    sizeRange: '85–100 m²', view: 'Panoramic city or skyline', floorRange: '7–9',
    priceFrom: 750, breakfastIncluded: true, spaAccessIncluded: true,
    hasBalcony: true, hasJacuzzi: true, hasButler: true,
    amenities: ['Private office area', 'Butler pantry', 'Club lounge access', 'Smart-home controls', 'Premium toiletries'],
    atmosphere: 'prestige with productivity, refined and efficient',
  },
  FAMILY_SUITE: {
    type: 'FAMILY_SUITE', label: 'Family Suite',
    capacityRange: '4–6 guests', capacityNumeric: { min: 4, max: 6 },
    sizeRange: '120 m²', view: 'Pool or city panorama', floorRange: '7–9',
    priceFrom: 900, breakfastIncluded: true, spaAccessIncluded: true,
    hasBalcony: true, hasJacuzzi: true, hasButler: true,
    amenities: ['Multiple bedrooms', 'Family lounge', 'Dining area', 'Kid-friendly amenities'],
    atmosphere: 'spacious, warm, welcoming',
  },
  PRESIDENTIAL_SUITE: {
    type: 'PRESIDENTIAL_SUITE', label: 'Presidential Suite',
    capacityRange: '4–6 guests', capacityNumeric: { min: 4, max: 6 },
    sizeRange: '180 m²', view: '360° panorama / skyline', floorRange: '10–11',
    priceFrom: 2500, breakfastIncluded: true, spaAccessIncluded: true,
    hasBalcony: true, hasJacuzzi: true, hasButler: true,
    amenities: ['Private pool', 'Cinema room', '24/7 butler', 'Walk-in closet', 'Smart home', 'Home theater'],
    atmosphere: 'most distinguished, exclusive, powerful',
  },
  ROYAL_SUITE: {
    type: 'ROYAL_SUITE', label: 'Royal Suite',
    capacityRange: '6–8 guests', capacityNumeric: { min: 6, max: 8 },
    sizeRange: '250–400 m²', view: '360° / sunset / helipad access', floorRange: '10–11',
    priceFrom: 4500, breakfastIncluded: true, spaAccessIncluded: true,
    hasBalcony: true, hasJacuzzi: true, hasButler: true,
    amenities: ['Private pool', 'Cinema room', 'Chef kitchen', 'Wine cellar', 'Grand piano', 'Helipad access'],
    atmosphere: 'royal, theatrical, the absolute finest',
  },
  PENTHOUSE: {
    type: 'PENTHOUSE', label: 'Penthouse',
    capacityRange: '6–8 guests', capacityNumeric: { min: 6, max: 8 },
    sizeRange: '200–400 m²', view: '360° panorama / sunset / helipad', floorRange: '10–11',
    priceFrom: 4000, breakfastIncluded: true, spaAccessIncluded: true,
    hasBalcony: true, hasJacuzzi: true, hasButler: true,
    amenities: ['Private pool', 'Chef kitchen', 'Wine cellar', 'Grand piano', 'Cinema', 'Helipad access'],
    atmosphere: 'cinematic, panoramic, intimate at the top of the city',
  },
};

// Resolve a free-text suite label to a catalog row (or null).
export function resolveSuiteType(label) {
  if (!label) return null;
  const l = String(label).toLowerCase();
  if (/penthouse/.test(l))      return SUITE_CATALOG.PENTHOUSE;
  if (/royal/.test(l))          return SUITE_CATALOG.ROYAL_SUITE;
  if (/presidential/.test(l))   return SUITE_CATALOG.PRESIDENTIAL_SUITE;
  if (/family/.test(l))         return SUITE_CATALOG.FAMILY_SUITE;
  if (/executive/.test(l))      return SUITE_CATALOG.EXECUTIVE_SUITE;
  if (/junior/.test(l))         return SUITE_CATALOG.JUNIOR_SUITE;
  if (/deluxe/.test(l))         return SUITE_CATALOG.DELUXE;
  if (/standard/.test(l))       return SUITE_CATALOG.STANDARD;
  return null;
}

// ── REASONING MODES ─────────────────────────────────────────────
// Replaces the ad-hoc "conversationMode" string. Six distinct modes,
// each maps to its own LLM instruction block (added in aiService).
export const MODE = {
  DISCOVERY:   'DISCOVERY',     // designing a new experience
  FOLLOW_UP:   'FOLLOW_UP',     // question about the active entity
  REFINEMENT:  'REFINEMENT',    // modifying the current design
  COMPARISON:  'COMPARISON',    // comparing two options
  HOTEL_INFO:  'HOTEL_INFO',    // factual hotel facts
  TRANSACTION: 'TRANSACTION',   // booking / confirmation / upgrade
};

// ── extractors used by buildConversationState ──────────────────
const SUITE_RE = /\b(Penthouse(?:\s+Suite)?|Royal\s+Suite|Presidential\s+Suite|Family\s+Suite|Executive\s+Suite|Junior\s+Suite|Deluxe\s+Suite|Deluxe|Standard\s+Room)\b/i;
const SPA_RE   = /\b(Couples\s+Massage|Couples\s+Aromatherapy|Aromatherapy|Hot\s+Stone(?:\s+Therapy)?|Deep\s+Tissue|Relaxation\s+Massage|Turkish\s+Hammam)\b/i;
const TITLE_RE = /✨\s*([^\n]+)/;

// ── State builder ──────────────────────────────────────────────
// Walks the message history and produces ONE structured state object.
// Pure function — no mutation, no I/O, safe to call on every request.
export function buildConversationState({ messages, sessionToken = null, language = 'en' } = {}) {
  const state = {
    sessionId: sessionToken,
    language,
    turn: 0,

    // Active structured entities (the things "it / the suite" refer to)
    activeSuite:      null,     // { label, type, capacityRange, view, ... } from SUITE_CATALOG
    activeSpa:        null,     // { label }
    activeRestaurant: null,     // { label }
    activePackage:    null,     // { title }

    // History of entities discussed this session
    discussedSuites: [],

    // Memory timeline — what happened, in order
    timeline: [],

    // Boolean signals derived from history
    designedCount: 0,
  };

  for (const m of messages || []) {
    state.turn++;
    if (m.role !== 'assistant') continue;
    const content = (m.content || '');

    // A structured package was emitted?
    if (/(^|\n)\s*(✨|🛏|💆|🍷|🥂|🌅|🚘)\s/.test(content)) {
      state.designedCount++;
    }

    // Active suite (most-recent assistant mention wins)
    const suiteMatch = content.match(SUITE_RE);
    if (suiteMatch) {
      const label = suiteMatch[1].replace(/\s+/g, ' ').trim();
      const canonical = resolveSuiteType(label) || {};
      state.activeSuite = { label, ...canonical };
      if (!state.discussedSuites.find(s => s.label === label)) {
        state.discussedSuites.push(state.activeSuite);
      }
      state.timeline.push({ turn: state.turn, type: 'suite', value: label });
    }

    const spaMatch = content.match(SPA_RE);
    if (spaMatch) {
      const label = spaMatch[1].replace(/\s+/g, ' ').trim();
      state.activeSpa = { label };
      state.timeline.push({ turn: state.turn, type: 'spa', value: label });
    }

    if (/\bLe\s+Palais\b/i.test(content)) {
      state.activeRestaurant = { label: 'Le Palais' };
    }

    const titleMatch = content.match(TITLE_RE);
    if (titleMatch) {
      const title = titleMatch[1].trim();
      state.activePackage = { title };
      state.timeline.push({ turn: state.turn, type: 'package', value: title });
    }
  }

  return state;
}

// ── Mode decider ───────────────────────────────────────────────
// Maps an intent + observed cues to a reasoning MODE. Centralises the
// previously scattered conversationMode logic. Returns a string from MODE.
export function decideMode({ intent, state, refinementCue, freshScenarioCue, lastUserText = '' }) {
  if (intent === 'HOTEL_INFO')   return MODE.HOTEL_INFO;
  if (intent === 'BOOKING_HELP') return MODE.TRANSACTION;
  if (intent === 'FOLLOWUP')     return MODE.FOLLOW_UP;
  if (/\b(compare|comparison|vs\.?|versus|better than|over (?:the|that)|قارن|مقارنة|kıyas|karşılaştır)\b/i.test(lastUserText)) return MODE.COMPARISON;
  if (state?.designedCount > 0 && refinementCue && !freshScenarioCue)  return MODE.REFINEMENT;
  return MODE.DISCOVERY;
}

// ── Direct-from-state Q&A ──────────────────────────────────────
// For simple FOLLOW_UP factual questions about the active suite, answer
// directly from the catalog — no LLM call, no hallucination, instant
// response. Returns a string answer or null (let the LLM handle it).
//
// Covers: view, capacity, size, floor, breakfast, spa access, price,
// balcony, jacuzzi, butler, amenities — across EN/AR/TR.
export function tryDirectAnswer(state, text, language = 'en') {
  if (!state?.activeSuite) return null;
  const t = String(text || '').toLowerCase();
  const s = state.activeSuite;
  const lang = ['ar', 'tr'].includes(language) ? language : 'en';

  const yesNo = {
    en: { yes: 'Yes', no: 'No, not by default — but I can arrange it for you' },
    ar: { yes: 'نعم', no: 'لا، ليس بشكل افتراضي — لكن يمكنني ترتيبها لكم' },
    tr: { yes: 'Evet', no: 'Hayır, varsayılan olarak değil — ama sizin için ayarlayabilirim' },
  };
  const Y = yesNo[lang].yes;
  const N = yesNo[lang].no;

  // Tiny helper — ASCII words use \b, non-ASCII substrings don't (JS \b
  // doesn't work reliably around non-ASCII letters in agglutinated forms).
  const m = (asciiPat, nonAsciiPats = []) =>
    asciiPat.test(t) || nonAsciiPats.some(p => p.test(t));

  // VIEW
  if (m(/\b(view|panorama|outlook|manzara)\b/i, [/إطلالة|منظر|المنظر|الإطلالة/])) {
    return ({
      en: `Your ${s.label} offers a ${s.view?.toLowerCase() || 'panoramic'} outlook — it sits on floors ${s.floorRange}, well above the street.`,
      ar: `${s.label} يوفر إطلالة ${s.view ? s.view : 'بانورامية'} — يقع في الطوابق ${s.floorRange}، عالياً فوق مستوى الشارع.`,
      tr: `${s.label} ${s.view?.toLowerCase() || 'panoramik'} bir manzara sunar — ${s.floorRange}. katlarda, sokak seviyesinin epey üzerinde yer alır.`,
    })[lang];
  }

  // CAPACITY
  if (m(/\b(how many|capacity|guests|people|fits?|sleeps?)\b/i, [/kaç\s+(?:kişi|misafir)|kapasite/i, /كم\s*(?:شخص|ضيف)|سعة|يتسع/])) {
    return ({
      en: `The ${s.label} comfortably accommodates ${s.capacityRange}.`,
      ar: `${s.label} يتسع بشكل مريح لـ ${s.capacityRange}.`,
      tr: `${s.label} rahatça ${s.capacityRange} ağırlar.`,
    })[lang];
  }

  // SIZE
  if (m(/\b(how big|how large|size|square|sqm|m2|m²)\b/i, [/kaç\s+metre|metrekare|büyüklük/i, /متر|مساحة/])) {
    return ({
      en: `The ${s.label} is ${s.sizeRange} in size.`,
      ar: `مساحة ${s.label} ${s.sizeRange}.`,
      tr: `${s.label} ${s.sizeRange} büyüklüğündedir.`,
    })[lang];
  }

  // FLOOR
  if (m(/\b(what floor|which floor|on what floor|floor (?:is|number))\b/i, [/kaç(?:ıncı)?\s+kat|hangi\s+kat/i, /أي\s*طابق|الطابق|طابق/])) {
    return ({
      en: `It's located on floors ${s.floorRange} of the hotel.`,
      ar: `يقع في الطوابق ${s.floorRange} من الفندق.`,
      tr: `Otelin ${s.floorRange}. katlarında yer alır.`,
    })[lang];
  }

  // BREAKFAST
  if (m(/\b(breakfast)\b/i, [/kahvaltı/i, /إفطار|الإفطار|فطور/])) {
    return ({
      en: `${s.breakfastIncluded ? Y : N} — ${s.breakfastIncluded ? `breakfast is included with the ${s.label}.` : `breakfast isn't bundled with the ${s.label} by default.`}`,
      ar: `${s.breakfastIncluded ? Y : N} — ${s.breakfastIncluded ? `الإفطار مشمول مع ${s.label}.` : `الإفطار غير مشمول افتراضياً مع ${s.label}.`}`,
      tr: `${s.breakfastIncluded ? Y : N} — ${s.breakfastIncluded ? `${s.label} ile kahvaltı dahildir.` : `${s.label} ile kahvaltı varsayılan olarak gelmez.`}`,
    })[lang];
  }

  // SPA ACCESS
  if (m(/\b(spa access|spa included)\b/i, [/spa\s+girişi|spa\s+dahil/i, /دخول\s+السبا|السبا\s+مشمول/])) {
    return ({
      en: `${s.spaAccessIncluded ? Y : N} — ${s.spaAccessIncluded ? `spa access is included with the ${s.label}.` : `spa access isn't included by default.`}`,
      ar: `${s.spaAccessIncluded ? Y : N} — ${s.spaAccessIncluded ? `دخول السبا مشمول مع ${s.label}.` : `دخول السبا غير مشمول افتراضياً.`}`,
      tr: `${s.spaAccessIncluded ? Y : N} — ${s.spaAccessIncluded ? `${s.label} ile spa girişi dahildir.` : `Spa girişi varsayılan olarak dahil değildir.`}`,
    })[lang];
  }

  // PRICE
  if (m(/\b(price|cost|rate|how much|per night|nightly)\b/i, [/fiyat|ne kadar|gecelik/i, /سعر|تكلفة|كم.*ليلة|سعرها/])) {
    return ({
      en: `The ${s.label} starts from $${s.priceFrom} per night.`,
      ar: `${s.label} يبدأ من $${s.priceFrom} في الليلة.`,
      tr: `${s.label} gecelik $${s.priceFrom}'dan başlar.`,
    })[lang];
  }

  // BALCONY
  if (m(/\b(balcony|terrace)\b/i, [/balkon|teras/i, /شرفة|تراس/])) {
    return ({
      en: `${s.hasBalcony ? Y : N} — ${s.hasBalcony ? `the ${s.label} has a private balcony.` : `the ${s.label} doesn't include a balcony.`}`,
      ar: `${s.hasBalcony ? Y : N} — ${s.hasBalcony ? `يحتوي ${s.label} على شرفة خاصة.` : `لا يحتوي ${s.label} على شرفة.`}`,
      tr: `${s.hasBalcony ? Y : N} — ${s.hasBalcony ? `${s.label} özel balkona sahiptir.` : `${s.label} balkon içermez.`}`,
    })[lang];
  }

  // JACUZZI
  if (m(/\b(jacuzzi|whirlpool)\b/i, [/jakuzi/i, /جاكوزي/])) {
    return ({
      en: `${s.hasJacuzzi ? Y : N} — ${s.hasJacuzzi ? `the ${s.label} includes a jacuzzi.` : `the ${s.label} doesn't include a jacuzzi.`}`,
      ar: `${s.hasJacuzzi ? Y : N} — ${s.hasJacuzzi ? `يحتوي ${s.label} على جاكوزي.` : `لا يحتوي ${s.label} على جاكوزي.`}`,
      tr: `${s.hasJacuzzi ? Y : N} — ${s.hasJacuzzi ? `${s.label} jakuzi içerir.` : `${s.label} jakuzi içermez.`}`,
    })[lang];
  }

  // BUTLER
  if (m(/\b(butler)\b/i, [/بتلر/])) {
    return ({
      en: `${s.hasButler ? Y : N} — ${s.hasButler ? `butler service is included with the ${s.label}.` : `butler service isn't included by default; I can arrange it.`}`,
      ar: `${s.hasButler ? Y : N} — ${s.hasButler ? `خدمة البتلر مشمولة مع ${s.label}.` : `خدمة البتلر غير مشمولة افتراضياً؛ يمكنني ترتيبها.`}`,
      tr: `${s.hasButler ? Y : N} — ${s.hasButler ? `${s.label} ile butler hizmeti dahildir.` : `Butler hizmeti varsayılan olarak dahil değildir; ayarlayabilirim.`}`,
    })[lang];
  }

  // AMENITIES (broad) — stem match (no trailing \b)
  if (m(/\b(amenit|feature|include)/i, [/olanak|özellik|içerir/i, /مرافق|يشمل|ميزات/])) {
    const list = (s.amenities || []).join(', ');
    return ({
      en: `The ${s.label} comes with ${list}.`,
      ar: `يأتي ${s.label} مع ${list}.`,
      tr: `${s.label} şunlarla gelir: ${list}.`,
    })[lang];
  }

  return null;
}

// ── FACTUAL ANSWERS (no state, no OpenAI) ───────────────────────
// Common factual questions about the hotel itself — answered from
// structured data so they're correct and consistent every time. Covers:
//   • Room types list      — uses SUITE_CATALOG
//   • Parking              — valet + self-park
//   • Events / weddings    — event team + venues
//   • Wifi / internet      — included everywhere
//   • Pets                 — pet policy
//   • Pool / gym / spa hours
// EN / AR / TR. Returns a string or null.
export function tryFactualAnswer(text, language = 'en') {
  const lang = ['ar', 'tr'].includes(language) ? language : 'en';
  const t = String(text || '').toLowerCase();
  const m = (asciiPat, nonAsciiPats = []) =>
    asciiPat.test(t) || nonAsciiPats.some(p => p.test(t));

  // ── ROOM TYPES ───────────────────────────────────────────────
  // Catches "what types/kinds of rooms", "ما أنواع الغرف", "hangi oda tipleri"
  if (m(
    /\b(what|which|how many|types?\s+of|kinds?\s+of|categor)\s.{0,30}\b(rooms?|suites?|accommodation)\b/i,
    [/(?:ما|أي|كم)\s*(?:هي\s+)?(?:انواع|أنواع|نوع|أصناف|اصناف|تصنيفات)\s*(?:من\s+)?(?:الغرف|غرف|الأجنحة|أجنحة)/, /(?:hangi|ne|kaç)\s+(?:tip|tür|çeşit)\s*(?:oda|süit)/i]
  )) {
    return ({
      en: `We offer 8 accommodation types across the hotel:

• Standard Room ($150+) — 28–38 m², 2–3 guests, floors 1–2
• Deluxe Suite ($280+) — 42–75 m², 2–4 guests, panoramic, jacuzzi, balcony
• Junior Suite ($600+) — 60 m², elegant separate sitting area
• Executive Suite ($750+) — 85–100 m², butler, club lounge access
• Family Suite ($900+) — 120 m², multi-bedroom, 4–6 guests
• Presidential Suite ($2,500+) — 180 m², private pool, 24/7 butler
• Royal Suite ($4,500+) — up to 400 m², the finest in the hotel
• Penthouse ($4,000+) — 360° panorama, chef kitchen, helipad access

Would you like me to suggest one for a specific occasion?`,
      ar: `لدينا 8 أنواع من الإقامة في الفندق:

• الغرفة القياسية ($150+) — 28–38 م²، 2–3 ضيوف، الطوابق 1–2
• جناح ديلوكس ($280+) — 42–75 م²، 2–4 ضيوف، إطلالة بانورامية وجاكوزي وشرفة
• جناح جونيور ($600+) — 60 م²، منطقة جلوس أنيقة منفصلة
• الجناح التنفيذي ($750+) — 85–100 م²، خدمة بتلر، صالة الكلوب
• الجناح العائلي ($900+) — 120 م²، غرف نوم متعددة، 4–6 ضيوف
• الجناح الرئاسي ($2,500+) — 180 م²، مسبح خاص، بتلر على مدار الساعة
• الجناح الملكي ($4,500+) — حتى 400 م²، الأرقى في الفندق
• البنتهاوس ($4,000+) — بانوراما 360°، مطبخ شيف، مهبط مروحية

هل تودّون اقتراحاً لمناسبة معينة؟`,
      tr: `Otelde 8 farklı konaklama tipimiz var:

• Standart Oda ($150+) — 28–38 m², 2–3 misafir, 1–2. katlar
• Deluxe Süit ($280+) — 42–75 m², 2–4 misafir, panoramik, jakuzi, balkon
• Junior Süit ($600+) — 60 m², ayrı zarif oturma alanı
• Executive Süit ($750+) — 85–100 m², butler, club lounge erişimi
• Aile Süiti ($900+) — 120 m², çoklu yatak odası, 4–6 misafir
• Başkanlık Süiti ($2,500+) — 180 m², özel havuz, 7/24 butler
• Royal Süit ($4,500+) — 400 m²'ye kadar, otelin en lüksü
• Penthouse ($4,000+) — 360° panorama, şef mutfağı, helikopter pisti

Özel bir vesile için süit önereyim mi?`,
    })[lang];
  }

  // ── PARKING ─────────────────────────────────────────────────
  if (m(
    /\b(parking|valet|garage|park\s+(?:my\s+|the\s+)?car)\b/i,
    [/(?:موقف|مواقف|ركن|باركينج)\s*(?:سيارات|السيارة|سيارة|للسيارات)?|اين\s+اركن|أين\s+أركن/, /(?:otopark|park\s*yeri|vale|araç\s+park)/i]
  )) {
    return ({
      en: `Yes — we offer complimentary valet and self-parking for all guests. The valet stand is at the lobby entrance on Floor 0, and the self-park garage occupies floors B1–B2. Electric vehicle charging is available. Would you like the valet team notified of your arrival?`,
      ar: `نعم — نوفّر مجاناً خدمة الفاليه وموقف السيارات الذاتي لجميع نزلائنا. مكتب الفاليه عند مدخل البهو في الطابق الأرضي، وموقف الخدمة الذاتية يشغل الطوابق B1–B2. يتوفّر شحن للسيارات الكهربائية. هل تودّون إبلاغ فريق الفاليه بموعد وصولكم؟`,
      tr: `Evet — tüm misafirlerimize ücretsiz vale ve self-park hizmeti sunuyoruz. Vale standı Zemin Kattaki lobi girişindedir; self-park garajı B1–B2 katlarında yer alır. Elektrikli araç şarjı mevcuttur. Vale ekibine varış saatinizi bildirmemi ister misiniz?`,
    })[lang];
  }

  // ── EVENTS / WEDDINGS / PARTIES ─────────────────────────────
  if (m(
    /\b(event|wedding|party|celebration|gala|function|venue|conference|banquet)s?\b/i,
    [/(?:تجهيز|تنظيم|إقامة|قاعة|قاعات)\s*(?:الحفلات|حفلة|حفل|الأعراس|عرس|المناسبات|مناسبة|الفعاليات|فعالية|الأفراح|مؤتمر)/, /(?:düğün|etkinlik|parti|toplantı|kutlama|davet|gala|konferans)\s*(?:organizasyonu|salon|alan|düzenleme)?/i]
  )) {
    return ({
      en: `Yes — our events team handles weddings, private celebrations, galas, and corporate functions. Venues available:

• Skylight Hall (rooftop) — up to 300 guests
• Le Palais private dining room — up to 60 guests
• Suite-based intimate gatherings — up to 20 guests

Each event includes a dedicated event manager, Chef Moreau's tailored menu, floral & lighting design, sound, and personalised staff. Shall I have our event manager contact you with options for your specific occasion?`,
      ar: `نعم — فريق الفعاليات لدينا يتولّى الأعراس والاحتفالات الخاصة والحفلات الكبرى والفعاليات المؤسسية. القاعات المتاحة:

• قاعة Skylight (السطح) — حتى 300 ضيف
• غرفة الطعام الخاصة في "لو باليه" — حتى 60 ضيفاً
• لقاءات حميمية داخل الأجنحة — حتى 20 ضيفاً

كل فعالية تتضمّن مدير فعاليات مخصّصاً، وقائمة طعام مفصّلة من الشيف مورو، وتصميم الزهور والإضاءة، ونظام الصوت، وطاقم شخصي. هل أطلب من مدير الفعاليات التواصل معكم بخيارات تناسب مناسبتكم؟`,
      tr: `Evet — etkinlik ekibimiz düğünleri, özel kutlamaları, galaları ve kurumsal etkinlikleri organize eder. Mevcut mekânlar:

• Skylight Salonu (çatı) — 300 misafire kadar
• Le Palais özel yemek odası — 60 misafire kadar
• Süit içi samimi toplantılar — 20 misafire kadar

Her etkinlik özel bir etkinlik yöneticisi, Şef Moreau'nun özel menüsü, çiçek ve aydınlatma tasarımı, ses sistemi ve kişisel personel içerir. Etkinlik yöneticimizin size özel vesileniz için seçeneklerle ulaşmasını ister misiniz?`,
    })[lang];
  }

  // ── WIFI / INTERNET ─────────────────────────────────────────
  if (m(
    /\b(wifi|wi-fi|internet|network|connection)\b/i,
    [/(?:واي\s*فاي|واي-فاي|انترنت|إنترنت|شبكة)/, /(?:wi-?fi|internet|ağ|bağlantı)/i]
  )) {
    return ({
      en: `Complimentary high-speed Wi-Fi is included in every room, suite, and public area. Premium gigabit fiber is standard in all suites and penthouses for streaming and video calls. The network name and password are pre-set in your in-suite tablet on arrival.`,
      ar: `خدمة الواي-فاي عالي السرعة مشمولة مجاناً في كل الغرف والأجنحة والمناطق العامة. شبكة فايبر جيجابت ممتازة قياسية في جميع الأجنحة والبنتهاوس للبث ومكالمات الفيديو. اسم الشبكة وكلمة المرور معدّان مسبقاً في الجهاز اللوحي بالجناح عند وصولكم.`,
      tr: `Yüksek hızlı Wi-Fi tüm odalarda, süitlerde ve ortak alanlarda ücretsiz olarak sunulur. Tüm süit ve penthouse'larda yayın ve video görüşmesi için gigabit fiber standarttır. Ağ adı ve şifresi varışınızda süit tabletinde önceden ayarlanmıştır.`,
    })[lang];
  }

  // ── PETS ────────────────────────────────────────────────────
  if (m(
    /\b(pet|dog|cat|animal)s?\b/i,
    [/(?:حيوان|حيوانات|كلب|قطة|أليف)/, /(?:evcil\s+hayvan|köpek|kedi)/i]
  )) {
    return ({
      en: `Pets are warmly welcome with advance notice. There's a small cleaning fee per stay. We provide a pet bed, bowls, and a welcome treat on arrival. Floors 1–6 are pet-friendly; suites and penthouses on floors 7+ are pet-free for guest comfort.`,
      ar: `الحيوانات الأليفة مرحّب بها مع إشعار مسبق. هناك رسم تنظيف بسيط لكل إقامة. نوفّر سريراً للحيوان وأطباقاً وضيافة ترحيبية عند الوصول. الطوابق 1–6 صديقة للحيوانات؛ الأجنحة والبنتهاوس من الطابق 7 فما فوق خالية من الحيوانات لراحة الضيوف.`,
      tr: `Evcil hayvanlar önceden haber verilmek kaydıyla memnuniyetle kabul edilir. Konaklama başına küçük bir temizlik ücreti vardır. Varışta evcil hayvan yatağı, mama kapları ve karşılama ikramı sağlıyoruz. 1–6. katlar evcil hayvan dostudur; 7. kat ve üzeri süit/penthouse'lar misafir konforu için evcil hayvansızdır.`,
    })[lang];
  }

  return null;
}
