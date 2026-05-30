// ═══════════════════════════════════════════════════════════════
//  CONCIERGE CONTROLLER — Intent-Aware Chat + Analytics
// ═══════════════════════════════════════════════════════════════
import prisma from '../config/database.js';
import {
  extractNeeds,
  extractPurpose,
  extractEmotion,
  getRecommendations,
  detectLanguage,
} from '../services/conciergeService.js';
import { generateConciergeResponse } from '../services/aiService.js';
import {
  buildConversationState,
  decideMode,
  tryDirectAnswer,
  tryFactualAnswer,
  MODE,
} from '../services/conversationState.js';

// ── Intent Classification ────────────────────────────────────────
// Reads the LAST user message only — not the full history.
// This ensures topic switches (room → spa) are respected instantly.
export const INTENT = {
  ROOM_SEARCH:       'ROOM_SEARCH',       // wants a room recommendation
  ROOM_ALTERNATIVES: 'ROOM_ALTERNATIVES', // wants DIFFERENT rooms from what was shown
  EXPERIENTIAL:      'EXPERIENTIAL',      // mood/occasion ("relaxing weekend") — recommend a full experience (room + spa + pool + dining)
  SERVICE_QUERY:     'SERVICE_QUERY',     // asking about spa, restaurant, gym, pool, etc.
  BOOKING_HELP:      'BOOKING_HELP',      // asking how to book / reserve
  GREETING:          'GREETING',          // opening message — only at first interaction
  FOLLOWUP:          'FOLLOWUP',          // short follow-up about the active subject ("how is the view?", "what floor?")
  HOTEL_INFO:        'HOTEL_INFO',        // factual hotel info ("how many floors?", "where is the hotel?")
  UNKNOWN:           'UNKNOWN',           // fall back to extracted needs
};

// EXPERIENTIAL cues: a vibe, occasion, mood, emotional state, or experiential
// aspiration — not a specific service ask. Triggers a HOLISTIC design.
// Covers explicit occasion words AND semantic synonyms for rest, peace,
// disconnection, healing, storytelling, escape — across EN/AR/TR.
const EXPERIENTIAL_PATTERNS = [
  // English — mood, occasion, romance
  /relax(?:ing|ation)?|unwind|de-?stress|rejuvenat|pamper|spoil|treat (?:my|our)self|getaway|escape|retreat|romantic|anniversary|honeymoon|celebrat|special occasion|propos(?:e|al)|memorable|perfect (?:weekend|trip|stay|evening)|weekend away|me ?time|recharge/i,
  // English — semantic: rest, peace, disconnect, story, sanctuary, healing
  /\b(disconnect|unplug|decompress|switch off|tune out|get away|peace|peaceful|quiet|stillness|calm|tranquil|serenity|serene|rest|tired|exhausted|drained|burn(?:ed|t) ?out|weary|story|storytelling|narrative|dream|dreamy|immersive|fairy.?tale|magical|sanctuary|hideaway|refresh|renew|restore|healing|slow ?down|breathe|mindful|gentle|cozy|reset|self ?care|nourish|soulful|soothing|recharge my batteries)\b/i,
  // Arabic — original + couple cues ("for two", "for two people", "for the couple")
  /استرخاء|استجمام|راحة|تدليل|إجازة رومانسية|شهر العسل|ذكرى|احتفال|مناسبة خاصة|هروب|عطلة نهاية الأسبوع|تجديد النشاط|دلل|لشخصين|للزوجين|شخصين|زوجين|للاثنين|اثنين/,
  // Arabic — semantic
  /انفصال|انعزال|هدوء|سكون|سكينة|تعب|إنهاك|إرهاق|قصة|حكاية|حلم|تنفس|شفاء|تجديد|بطء|سحري|دفء|ملاذ|انفصل|اعتزل|أحتاج راحة/,
  // Turkish — original
  /rahatla|dinlen|huzur|kaçamak|romantik|yıldönümü|balayı|kutlama|özel (?:gün|an)|şımart|hafta sonu kaçamağı|yenilen/i,
  // Turkish — semantic
  /\b(kop|kopuş|sessizlik|sakinlik|yorgun|bitkin|tükenmi|hikaye|masal|nefes|yenile|kaçış|sığına|ruh|zihin|büyülü|dingin|huzurlu|şarj|kendime zaman|nefes alma)\b/i,
];

function isExperientialQuery(text) {
  return EXPERIENTIAL_PATTERNS.some(p => p.test(text));
}

// SOFT INTENT — semantic safety net. First-person desire/feeling/need
// expressions ("I want…", "I feel…", "أحتاج…", "istiyorum…") that don't
// match a specific intent imply the guest is opening up about a wish or
// mood. Better to engage in design mode than fall to UNKNOWN/receptionist.
const SOFT_INTENT_PATTERNS = [
  // English first-person desire / feeling / need / recommendation request
  /\b(i (?:just )?(?:want|need|feel|wish|would (?:like|love)|am looking|am hoping|crave|long for|could use|am dreaming|am after)|we (?:just )?(?:want|need|feel|wish|would (?:like|love)|are looking|are hoping|are dreaming)|i'?m (?:in need of|looking for|craving|hoping for|after)|can i (?:have|get)|can we (?:have|get)|i fancy|we fancy|something (?:for|like|to)|(?:suggest|recommend|advise) (?:me|us|something))\b/i,
  // Arabic — desires + "your advice", "suggest to me", "what do you recommend"
  /(أريد|أرغب|أحتاج|أشعر|أتمنى|أتطلع|نريد|نحتاج|نرغب|نشعر|نتمنى|نتطلع|أبحث عن|نبحث عن|أحلم|نحلم|في حاجة|بحاجة|نصيحتك|نصيحتكم|اقترح|اقترحوا|اقتراحك|تنصح|تنصحون|توصية|توصيتك|اعطني|أعطني|اعطوني|أعطوني)/,
  // Turkish — istiyorum, hissediyorum, "öner", "tavsiye"…
  /\b(istiyor(?:um|uz)|hissediyor(?:um|uz)|ihtiyaç(?:ım|ımız) var|arıyor(?:um|uz)|umuyor(?:um|uz)|özlüyor(?:um|uz)|hayalim(?:iz)?|bana (?:bir|bir şey)|bize (?:bir|bir şey)|öner(?:ir|ebilir|in)|tavsiye(?:n|niz)?)\b/i,
];
function isSoftIntent(text) {
  if (!text || text.trim().length < 10) return false;
  return SOFT_INTENT_PATTERNS.some(p => p.test(text));
}

// OCCASION/PURPOSE cues (business, family, vacation, vip) — also experience-first,
// so a "family holiday" or "business trip" is framed as a curated stay, not a room dump.
const OCCASION_PATTERNS = [
  /business|work trip|conference|corporate|family|with (?:my )?(?:kids|children|family)|vacation|holiday|leisure|\bvip\b|presidential|luxury (?:stay|experience|getaway)/i,
  /أعمال|عمل|مؤتمر|عائلة|أطفال|إجازة|عطلة|استجمام|كبار الشخصيات|رئاسي/,
  /iş seyahati|toplantı|konferans|kurumsal|aile|çocuk|tatil|dinlence/i,
];
function isOccasionQuery(text) {
  return OCCASION_PATTERNS.some(p => p.test(text));
}

// FOLLOW-UP detector: short questions/clarifications about the ACTIVE
// SUBJECT (the suite, the spa, the dinner, the package the AI just
// presented). Must NEVER reset to greeting or trigger a new room fetch.
//
// Triggers when ALL hold:
//   • prior assistant turn presented a structured package (alreadyDesigned)
//   • the new message is short (≤ 120 chars) and not a fresh scenario
//   • the message either ends with '?' / starts with a WH/aux word, OR
//     references an entity ("the view", "it", "the suite", "breakfast"…)
const FOLLOWUP_REFERENCE_PATTERNS = [
  /\b(it|this|that|its|they|them|the (view|room|suite|spa|treatment|dinner|wine|extras?|chauffeur|butler|package|setup|floor|price|breakfast|menu|champagne|massage|table))\b/i,
  /\b(الجناح|الغرفة|السبا|العشاء|النبيذ|البتلر|الباقة|الإطلالة|المنظر|الإفطار|القائمة|السعر|الطابق|المساج|التدليك|الشمبانيا)\b/,
  /\b(süiti?|odayı?|spaya?|akşam yemeği|paketi?|manzara|kahvaltı|menü|fiyat|katı?|şarabı?|şampanyayı?|masajı?|masayı?)\b/i,
];
const QUESTION_OPENERS = /^(how|what|where|when|why|which|does|do|is|are|am|can|could|will|would|may|might|should|كيف|كم|أين|متى|لماذا|ماذا|هل|nasıl|ne|nerede|niye|hangi|var mı|olur mu)\b/i;

function isFollowUp(text, ctx) {
  if (!ctx?.alreadyDesigned) return false;
  if (ctx.freshScenarioCue) return false;
  const t = (text || '').trim();
  if (t.length === 0 || t.length > 120) return false;
  // Defer to HOTEL_INFO when the question is clearly about the hotel as a
  // whole (mentions "hotel" or asks for counts of floors/rooms/suites).
  // Prevents "how many floors does the hotel have?" from being mis-routed.
  if (isHotelInfoQuery(t)) return false;
  const isQuestion = /\?$/.test(t) || QUESTION_OPENERS.test(t);
  const referencesEntity = FOLLOWUP_REFERENCE_PATTERNS.some(p => p.test(t));
  return isQuestion || referencesEntity;
}

// HOTEL INFO detector: factual questions about the hotel itself (size,
// location, history, floor count) — answered with information, never with
// an experience design.
const HOTEL_INFO_PATTERNS = [
  /\b(how many|count of|number of|total)\s+(floors?|rooms?|suites?|restaurants?|pools?|gyms?|stars?|beds?)\b/i,
  /\bwhat\s+floors?\s+(?:does|do|are|exist)/i,
  /\bwhere\s+(?:is|are)\s+(?:the\s+)?hotel\b/i,
  /\btell me about (?:the )?hotel\b/i,
  /\bhotel\s+(location|address|history|facts|info|information)\b/i,
  /\b(how (?:big|large)|how many stars|star rating)\b/i,
  // Arabic
  /(?:كم|ما)\s+(?:عدد\s+)?(الطوابق|الغرف|الأجنحة|المطاعم|النجوم)/,
  /(أين يقع|موقع الفندق|عنوان الفندق|عن الفندق|تاريخ الفندق)/,
  // Turkish
  /\b(kaç|kaç tane|sayısı)\s+(kat|oda|süit|restoran|yıldız)/i,
  /(otel nerede|otelin konumu|otel hakkında|otel adresi|otel tarihi)/i,
];
function isHotelInfoQuery(text) {
  return HOTEL_INFO_PATTERNS.some(p => p.test(text));
}

// ACTIVE SUBJECT extractor: looks at the most recent assistant turn and
// pulls out what the guest is most likely referring to in a follow-up.
// Returns null when nothing recognisable was offered. The result is sent
// to the AI so "how is the view?" anchors to the correct suite.
const SUITE_TYPE_RE = /\b(Penthouse(?:\s+Suite)?|Royal\s+Suite|Executive\s+Suite|Family\s+Suite|Junior\s+Suite|Deluxe\s+Suite|Deluxe|Standard\s+Room)\b/i;
const SPA_TREATMENT_RE = /\b(Couples\s+Massage|Couples\s+Aromatherapy|Aromatherapy|Hot\s+Stone(?:\s+Therapy)?|Deep\s+Tissue|Relaxation\s+Massage|Turkish\s+Hammam)\b/i;
function extractActiveSubject(messages) {
  if (!Array.isArray(messages)) return null;
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== 'assistant') continue;
    const content = m.content || '';
    const subject = {};
    const suite = content.match(SUITE_TYPE_RE);
    if (suite) subject.suite = suite[1].replace(/\s+/g, ' ').trim();
    const spa = content.match(SPA_TREATMENT_RE);
    if (spa) subject.spa = spa[1].replace(/\s+/g, ' ').trim();
    if (/Le Palais/i.test(content)) subject.restaurant = 'Le Palais';
    const titleMatch = content.match(/✨\s*([^\n]+)/);
    if (titleMatch) subject.package = titleMatch[1].trim();
    if (Object.keys(subject).length > 0) return subject;
  }
  return null;
}

// EXPLICIT room-display intent: the guest is actually asking to SEE, PRICE, or BOOK
// specific rooms. ONLY these requests should ever surface room numbers / prices / cards.
//
// Tightened from earlier: "view" is no longer in the verb list because it's
// commonly used as a NOUN ("the view from the suite") which led to false
// room-search routing on follow-up questions. Verbs now require imperative-
// adjacent positioning.
const ROOM_DISPLAY_PATTERNS = [
  // Imperatives: "show me rooms", "list the suites", "browse penthouses"
  /\b(show|list|display|browse)\s+(?:me\s+|us\s+)?(?:the\s+|some\s+|your\s+|any\s+)?(?:rooms?|suites?|penthouses?|availability|options?|vacanc)/i,
  // "I want to see / I'd like to see / let me see" + rooms
  /\b(?:want|like|love|let me|i'?d like)\s+to\s+see\s+(?:the\s+|some\s+|your\s+|any\s+)?(?:rooms?|suites?|penthouses?)/i,
  // "what rooms / which suites / are there any / do you have any"
  /^(?:what|which)\s+(?:kind\s+of\s+|type\s+of\s+|\w+\s+)?(?:rooms?|suites?|penthouses?)\b/i,
  /\b(?:are there any|do you have any|are there)\s+(?:rooms?|suites?|penthouses?|availability|options?)/i,
  /\b(available|vacant)\s+(?:rooms?|suites?|penthouses?)\b/i,
  // Booking a room/suite
  /\b(book|reserve|reservation)\s+(?:a |an |the )?(?:room|suite|penthouse|night|stay)\b/i,
  // Specific room number
  /\broom\s*(?:number\s*|no\.?\s*|#)?\d{2,4}\b/i,
  // Price queries explicitly bound to room/night
  /\b(?:price|cost|rate|how much|per night|nightly)\s+(?:for|of|per)?\s*(?:a |an |the )?(?:room|suite|penthouse|night|stay)\b/i,
  /\b(?:room|suite|penthouse|night|stay)\s+(?:price|cost|rate|how much|per night|nightly)\b/i,
  // Arabic — explicit
  /(?:^|\s)(أرني|اعرض|أظهر|أعطني|قائمة|المتاح|المتوفر)\s+\S{0,30}(غرف|أجنحة|الغرف|الأجنحة|بنتهاوس)/,
  /(?:احجز|أحجز|حجز)\s+\S{0,20}(غرفة|جناح|بنتهاوس|ليلة)/,
  /(?:سعر|كم سعر|تكلفة|كم تكلفة|كم ثمن)\s+\S{0,25}(غرفة|جناح|بنتهاوس|الليلة|ليلة)/,
  // Turkish — explicit
  /(?:^|\s)(göster|listele|mevcut|müsait|boş)\s+\S{0,30}(oda|süit|odalar|penthouse)/i,
  /(rezerve|rezervasyon)\s+\S{0,20}(oda|süit|gece)/i,
  /(fiyat|ne kadar|ücret|gecelik)\s+\S{0,25}(oda|süit|gece|konaklama)/i,
];
function wantsRoomDisplay(text) {
  return ROOM_DISPLAY_PATTERNS.some(p => p.test(text));
}

// SERVICE keywords that BLOCK room fetching — no matter what else is in the message
const SERVICE_PATTERNS = [
  /\bspa\b|massage|therapy|wellness|treatment|hammam|sauna|steam room|float tank/i,
  /تدليك|مساج|سبا|علاج|حمام تركي|رفاهية|صحة.?وعافية/,
  /masaj|terapi|hamam|spa.*hizmet/i,
  /restaurant|food|menu|dine|dining|chef|cuisine|meal|breakfast|lunch|dinner/i,
  /مطعم|طعام|أكل|قائمة طعام|وجبة|طاهي|فطور|عشاء|غداء/,
  /restoran|yemek|menü|aşçı|kahvaltı|öğle yemeği|akşam yemeği/i,
  /\bgym\b|fitness|workout|exercise|weight.?training/i,
  /لياقة|رياضة|صالة رياضية|تمرين|جيم/,
  /jimnastik|antrenman|egzersiz|spor salonu/i,
  /\bpool\b|swim(?:ming)?|aqua/i,
  /مسبح|سباحة/,
  /\bhavuz\b|yüzme/i,
  /butler|personal.?serv|personal.?assist/i,
  /بتلر|خدمة شخصية/,
  /kişisel hizmet|butler hizmet/i,
  /\bdriver\b|chauffeur|airport.?transfer|limousine/i,
  /سائق|نقل.?مطار|ليموزين/,
  /\bşoför\b|\btransfer\b|havalimanı.?transfer/i,
  /cancel|refund|cancellation.?polic/i,
  /إلغاء|سياسة.?الإلغاء/,
  /iptal.?polit/i,
  /pet.?polic|parking.?polic/i,
];

function isServiceQuery(text) {
  return SERVICE_PATTERNS.some(p => p.test(text));
}

// Per-domain patterns — used to count how many distinct service domains the
// guest mentioned. 2+ domains means a multi-domain experience, not a single
// service query, so we route to EXPERIENTIAL even without an explicit mood word.
const SERVICE_DOMAINS = {
  spa:        /\bspa\b|massage|therapy|wellness|treatment|hammam|sauna|float tank|تدليك|سبا|مساج|علاج|masaj|terapi|hamam/i,
  restaurant: /restaurant|food|menu|dine|dining|dinner|breakfast|lunch|chef|cuisine|meal|مطعم|طعام|أكل|قائمة|عشاء|فطور|غداء|طاهي|restoran|yemek|menü|aşçı|kahvaltı|akşam yemeği|öğle yemeği/i,
  gym:        /\bgym\b|fitness|workout|exercise|weight.?training|لياقة|رياضة|تمرين|جيم|jimnastik|antrenman|egzersiz/i,
  pool:       /\bpool\b|swim(?:ming)?|aqua|سباحة|مسبح|havuz|yüzme/i,
  butler:     /butler|personal.?serv|بتلر|خدمة شخصية|kişisel hizmet/i,
  driver:     /\bdriver\b|chauffeur|airport.?transfer|limousine|سائق|نقل.?مطار|ليموزين|şoför|havalimanı.?transfer/i,
};
function countServiceDomains(text) {
  return Object.values(SERVICE_DOMAINS).reduce((n, re) => n + (re.test(text) ? 1 : 0), 0);
}

// REQUESTED TOPICS — broader than service domains. Every topic the guest
// mentions explicitly. The AI receives this list and MUST address each item
// in its reply. Covers experiential cues (sunset, atmosphere, wine, romance)
// that aren't "service domains" but matter to the experience.
const TOPIC_PATTERNS = {
  suite:         { en: 'a suite/room',     re: /\b(suite|room|stay|accommodat|penthouse|deluxe)\b|جناح|غرفة|إقامة|بنتهاوس|süit|oda|konaklama|penthouse/i },
  spa:           { en: 'spa / wellness',   re: SERVICE_DOMAINS.spa },
  dining:        { en: 'fine dining',      re: SERVICE_DOMAINS.restaurant },
  wine:          { en: 'wine / champagne', re: /\b(wine|champagne|bubbly|cocktail|sommelier|prosecco)\b|نبيذ|شامبانيا|şarap|şampanya|kokteyl/i },
  pool:          { en: 'pool',             re: SERVICE_DOMAINS.pool },
  gym:           { en: 'fitness',          re: SERVICE_DOMAINS.gym },
  butler:        { en: 'butler service',   re: SERVICE_DOMAINS.butler },
  chauffeur:     { en: 'private chauffeur',re: SERVICE_DOMAINS.driver },
  sunset:        { en: 'sunset / view',    re: /\b(sunset|sundown|view|panoramic|skyline|terrace|balcony)\b|غروب|إطلالة|شرفة|تراس|gün batımı|manzara|teras|balkon/i },
  romance:       { en: 'romantic atmosphere', re: /\b(romantic|romance|intimate|candle|candlelit|honeymoon|anniversary)\b|روماني|رومانسي|شهر العسل|ذكرى|romantik|balayı|yıldönümü/i },
  privateDining: { en: 'private dining',   re: /\bprivate\s+(dinner|dining|chef|table)\b|عشاء خاص|طاولة خاصة|özel akşam yemeği|özel masa/i },
};
function extractRequestedTopics(text) {
  const labels = [];
  for (const [key, def] of Object.entries(TOPIC_PATTERNS)) {
    if (def.re.test(text)) labels.push(def.en);
  }
  return labels;
}

// REFINEMENT signals: the guest is tweaking the current package (swap, add,
// remove, upgrade…) — NOT starting a fresh scenario. Combined with a prior
// package AND no fresh-scenario cue, this routes to REFINEMENT mode.
const REFINEMENT_PATTERNS = [
  /\b(change|swap|replace|remove|drop|add|include|upgrade|downgrade|instead of|without|also|earlier|later|cheaper|more expensive)\b/i,
  /\b(the (wine|suite|spa|dinner|package|room|chauffeur|butler|treatment|massage|champagne))\b/i,
  /\b(what about|how about|could we|can we|may we|maybe also|let's also)\b/i,
  /\b(yes|no|sure|okay|ok|perfect|sounds good|that works|let's do it|confirm|good)\b/i,
  // Arabic
  /(غيّر|بدّل|أزل|احذف|أضف|بدلاً|بدون|أيضاً|أبكر|أبعد|أرخص|أغلى|ماذا عن|هل يمكن|نعم|لا|حسناً|ممتاز|أكّد)/,
  /(النبيذ|الجناح|السبا|العشاء|الباقة|الغرفة|السائق|البتلر|العلاج|التدليك|الشمبانيا)/,
  // Turkish
  /\b(değiştir|çıkar|kaldır|ekle|onun yerine|olmadan|da|de|daha erken|daha geç|daha ucuz|daha pahalı|tamam|evet|hayır|harika|onayla|peki|ya|olabilir mi)\b/i,
  /\b(şarabı|süiti|spayı|akşam yemeğini|paketi|odayı|şoförü|butler'ı|tedaviyi|şampanyayı)\b/i,
];
function isRefinementSignal(text) {
  return REFINEMENT_PATTERNS.some(p => p.test(text));
}

// Default itinerary topics by inferred purpose. Used when the guest says
// "romantic weekend" without naming spa/dinner/wine explicitly — the
// concierge still assembles the full package proactively (no clarifying Qs).
function defaultTopicsForPurpose(purpose) {
  switch (purpose) {
    case 'honeymoon':
      return ['a suite/room', 'spa / wellness', 'fine dining', 'wine / champagne', 'sunset / view', 'romantic atmosphere', 'private dining'];
    case 'vacation':
      return ['a suite/room', 'spa / wellness', 'pool', 'fine dining', 'sunset / view'];
    case 'business':
      return ['a suite/room', 'private chauffeur', 'fine dining', 'butler service'];
    case 'family':
      return ['a suite/room', 'pool', 'fine dining'];
    case 'vip':
      return ['a suite/room', 'butler service', 'private chauffeur', 'spa / wellness', 'fine dining', 'wine / champagne'];
    default:
      return ['a suite/room', 'spa / wellness', 'fine dining'];
  }
}

function mergeTopics(explicit, defaults) {
  const out = [...explicit];
  for (const t of defaults) if (!out.includes(t)) out.push(t);
  return out;
}

function classifyMessage(text, ctx = {}) {
  const t = (text || '').trim();

  // ── 1. Alternatives ─────────────────────────────────────────
  // Most specific user intent — always wins.
  if (
    /other.?room|different.?room|another.?room|more.?option|show.?me.?more|something.?else|not.?this|not.?that|change.?room/i.test(t) ||
    /غرف.?أخرى|غرف.?اخرى|غيرها|خيارات.?أخرى|شيء.?آخر|غرفة.?أخرى|بدائل.?أخرى|غير.?ذلك/.test(t) ||
    /başka.?oda|farklı.?oda|diğer.?oda|başka.?seçenek|daha.?fazla.?seçenek/i.test(t)
  ) return INTENT.ROOM_ALTERNATIVES;

  // ── 2. FOLLOW-UP about the active subject ───────────────────
  // CRITICAL: short questions during an active session ("how is the view?",
  // "what floor?", "is breakfast included?") must inherit context, NOT
  // reset to greeting or trigger a new room search. Requires alreadyDesigned
  // AND no fresh-scenario cue. Computed in the handler before classify.
  if (isFollowUp(t, ctx)) return INTENT.FOLLOWUP;

  // ── 3. EXPLICIT room display ────────────────────────────────
  // ONLY when the guest actually asks to see / price / book specific rooms.
  // This is the single gate that allows room numbers, prices, and cards.
  if (wantsRoomDisplay(t)) return INTENT.ROOM_SEARCH;

  // ── 4. Factual hotel info ───────────────────────────────────
  // "How many floors?" / "Where is the hotel?" / "Tell me about the hotel".
  // These get an informational answer, never an experience design.
  if (isHotelInfoQuery(t)) return INTENT.HOTEL_INFO;

  // ── 5. Experiential / multi-domain — checked BEFORE service ─
  // CRITICAL: experiential/occasion cues OR a request spanning multiple
  // service domains (spa + dinner, pool + dining + butler, etc.) must be
  // routed to EXPERIENTIAL — never to SERVICE_QUERY. Otherwise a single
  // keyword like "spa" hijacks the whole request and the AI produces a
  // generic spa response, ignoring romance/dinner/wine/sunset context.
  const expCue        = isExperientialQuery(t) || isOccasionQuery(t);
  const domainCount   = countServiceDomains(t);
  if (expCue || domainCount >= 2) return INTENT.EXPERIENTIAL;

  // ── 4. Check-in / check-out policies (pure policy queries) ──
  if (/check.?in.?time|check.?out.?time|arrival.?time|departure.?time/i.test(t)) return INTENT.SERVICE_QUERY;
  if (/تسجيل.?الوصول|تسجيل.?المغادرة/.test(t)) return INTENT.SERVICE_QUERY;
  if (/giriş.?saati|çıkış.?saati/i.test(t)) return INTENT.SERVICE_QUERY;

  // ── 5. SINGLE-domain service queries ────────────────────────
  // Only here, AFTER experiential/multi-domain checks have passed, do we
  // treat the message as a bare service query. domainCount is at most 1.
  if (isServiceQuery(t)) return INTENT.SERVICE_QUERY;

  // ── 6. General "what services" questions ────────────────────
  // CAREFUL: this used to also match "(ما|ماذا).*(لديكم)" which was a
  // disaster — "ما أنواع الغرف لديكم" routed to a generic prices reply.
  // Require the actual word "خدمة/خدمات/تقدمون" — not just "لديكم".
  if (/what (service|do you offer|have you got|can you do)|tell me about.*(service|facilit)/i.test(t)) return INTENT.SERVICE_QUERY;
  if (/(?:ما|ماذا).*(?:خدمات|الخدمات|خدمة|تقدمون|تقدّمون|تقدم)/.test(t)) return INTENT.SERVICE_QUERY;
  if (/(ne|neler).*(sunuyor|hizmet|olanaklar)/i.test(t)) return INTENT.SERVICE_QUERY;

  // ── 7. Price queries (non-room) ──────────────────────────────
  if (/\b(price|cost|how.?much|rate|fee|charge)\b/i.test(t) && !/\b(room|suite|penthouse|oda|غرفة)\b/i.test(t)) return INTENT.SERVICE_QUERY;
  if (/(سعر|تكلفة|كم يكلف|كم ثمن)/.test(t) && !/غرفة/.test(t)) return INTENT.SERVICE_QUERY;
  if (/(fiyat|kaç para|ne kadar)/i.test(t) && !/oda/.test(t)) return INTENT.SERVICE_QUERY;

  // ── 8. Booking ───────────────────────────────────────────────
  if (/\b(book|reserve|reservation)\b/i.test(t)) return INTENT.BOOKING_HELP;
  if (/(أحجز|احجز|حجز الغرفة)/.test(t)) return INTENT.BOOKING_HELP;
  if (/rezerv(asyon)?\s*(yap|et|istiyorum)/i.test(t)) return INTENT.BOOKING_HELP;

  // ── 9. Greetings — ONLY at first interaction ────────────────
  // Mid-conversation hellos should be handled conversationally, never with
  // the welcome banner that resets the session feel.
  if (!ctx.alreadyDesigned) {
    if (/^(hi+|hello|hey|good\s+(morning|afternoon|evening))[\s!,.]*$/i.test(t)) return INTENT.GREETING;
    if (/^(مرحبا|أهلاً|اهلا|السلام عليكم|صباح الخير|مساء الخير)[\s!,.]*$/.test(t)) return INTENT.GREETING;
    if (/^(merhaba|günaydın|iyi\s+(akşam|günler|sabahlar))[\s!,.]*$/i.test(t)) return INTENT.GREETING;
  }

  // ── 10. Bare room-type mention without an explicit display request →
  // still experience-first. The guest hasn't asked to SEE rooms, so we
  // describe the suite type within an experience rather than listing one.
  if (/\b(room|suite|penthouse|deluxe|standard)\b/i.test(t) ||
      /\b(غرفة|جناح|بنتهاوس)\b/.test(t) ||
      /\b(oda|süit|penthouse)\b/i.test(t) ||
      /\d+\s*(guests?|people|persons?|kişi|misafir|أشخاص|شخص)/i.test(t)) {
    return INTENT.EXPERIENTIAL;
  }

  // ── 11. SOFT INTENT — semantic safety net ───────────────────
  // Any substantive first-person desire/feeling/need ("I want to disconnect",
  // "I feel exhausted, I need rest", "نحتاج هدوء") that doesn't match a
  // specific intent above is treated as a vague EXPERIENTIAL request.
  // Keeps the concierge in design mode instead of falling to receptionist.
  if (isSoftIntent(t)) return INTENT.EXPERIENTIAL;

  return INTENT.UNKNOWN;
}

// ── Session Analytics ────────────────────────────────────────────
function needsToSessionFields(needs) {
  return {
    detectedGuests:   needs.guests   ?? undefined,
    detectedBudget:   needs.budget   ?? undefined,
    detectedDuration: needs.duration ?? undefined,
    detectedPurpose:  needs.purpose  ?? undefined,
    prefSpa:     needs.preferences.includes('spa'),
    prefView:    needs.preferences.includes('view'),
    prefButler:  needs.preferences.includes('butler'),
    prefQuiet:   needs.preferences.includes('quiet'),
    prefBalcony: needs.preferences.includes('balcony'),
    prefPool:    needs.preferences.includes('pool'),
    prefSuite:   needs.preferences.includes('suite'),
  };
}

async function logSession(sessionToken, { language, messageCount, needs, recommendation, newEventType, newEventData }) {
  try {
    const existing = await prisma.conciergeSession.findUnique({ where: { sessionToken } });
    const sessionFields = {
      language,
      totalMessages: messageCount,
      ...needsToSessionFields(needs),
      ...(recommendation ? {
        recommendedRoomId:   recommendation.id,
        recommendedRoomNum:  recommendation.roomNumber,
        recommendedRoomType: recommendation.type,
        recommendedScore:    recommendation.score,
        recommendationShown: true,
      } : {}),
    };
    let session;
    if (!existing) {
      session = await prisma.conciergeSession.create({ data: { sessionToken, ...sessionFields } });
    } else {
      session = await prisma.conciergeSession.update({ where: { id: existing.id }, data: sessionFields });
    }
    if (newEventType) {
      if (newEventType === 'recommendation_shown') {
        const already = await prisma.conciergeEvent.findFirst({
          where: { sessionId: session.id, eventType: 'recommendation_shown' },
        });
        if (already) return;
      }
      await prisma.conciergeEvent.create({
        data: {
          sessionId: session.id,
          eventType:  newEventType,
          eventData:  newEventData ? JSON.stringify(newEventData) : null,
        },
      });
    }
  } catch (err) {
    console.warn('[Concierge] analytics log failed (non-fatal):', err.message);
  }
}

// Safely run a function; on any throw, log it and return a fallback value.
// Critical for the concierge pipeline: one bad regex or undefined property in
// a helper must NEVER tear down the whole reply. Each stage degrades to a
// known-good default and the request continues.
function safe(label, fn, fallback) {
  try {
    return fn();
  } catch (err) {
    console.error(`[Concierge][safe] ${label} threw: ${err?.message || err}`);
    if (DEBUG_CONCIERGE) console.error(err?.stack);
    return fallback;
  }
}
const DEBUG_CONCIERGE = String(process.env.DEBUG_CONCIERGE || '').toLowerCase() === 'true' ||
                        process.env.DEBUG_CONCIERGE === '1';

// ── POST /api/concierge/chat ─────────────────────────────────────
export async function chat(req, res) {
  const t0 = Date.now();
  let stage = 'init';
  try {
    stage = 'parse body';
    const { messages, sessionToken, shownRoomIds = [] } = req.body || {};

    if (!Array.isArray(messages) || !messages.length) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    stage = 'sanitize messages';
    const sanitized = (messages || [])
      .filter(m => m && m.role && m.content && typeof m.content === 'string')
      .slice(-20)
      .map(m => ({ role: m.role, content: String(m.content).slice(0, 1000) }));

    const lastUser     = [...sanitized].reverse().find(m => m.role === 'user');
    const lastUserText = lastUser?.content || '';

    stage = 'detect language';
    const language = safe('detectLanguage', () => detectLanguage(lastUserText), 'en');

    // ── EARLY FACTUAL SHORT-CIRCUIT ────────────────────────────────
    // Common factual questions ("what room types", "do you have parking",
    // "do you host weddings", "wifi?", "pets?") get correct, structured
    // answers FROM CODE — no OpenAI required, no intent-routing risk.
    // Fires before classify so a bad regex elsewhere can't ruin them.
    stage = 'factual short-circuit';
    const factual = safe('tryFactualAnswer', () => tryFactualAnswer(lastUserText, language), null);
    if (factual) {
      console.log(`[Concierge] ★ factual answer (no LLM)`);
      console.log(`[Concierge] responded in ${Date.now() - t0}ms`);
      console.log(`[Concierge] ───────────────────────────────────────\n`);
      return res.json({
        message: factual,
        language,
        intent: INTENT.HOTEL_INFO,
        extractedNeeds: { guests:null, budget:null, duration:null, purpose:null, preferences:[] },
        recommendation: null,
        alternatives: [],
      });
    }

    // ── Build the single ConversationState object for this turn ─────
    // Replaces the previous ad-hoc state computations. State is rebuilt
    // from message history (frontend = source of truth), so we never have
    // stale-state bugs. All downstream stages read from this object.
    stage = 'build conversation state';
    const state = safe('buildConversationState',
      () => buildConversationState({ messages: sanitized, sessionToken, language }),
      { sessionId: sessionToken, language, turn: 0, activeSuite: null, activeSpa: null,
        activeRestaurant: null, activePackage: null, discussedSuites: [], timeline: [], designedCount: 0 });

    const alreadyDesigned  = state.designedCount > 0;
    const freshScenarioCue = safe('freshScenarioCue', () =>
      isExperientialQuery(lastUserText) || isOccasionQuery(lastUserText), false);
    // Backwards-compatible activeSubject view derived from state. Includes
    // the structured catalog facts (capacity, view, floor, amenities…) so
    // the AI can REASON over real data instead of hallucinating.
    const activeSubject = state.activeSuite
      ? {
          suite:      state.activeSuite.label,
          package:    state.activePackage?.title,
          restaurant: state.activeRestaurant?.label,
          suiteFacts: {
            capacityRange:       state.activeSuite.capacityRange,
            sizeRange:           state.activeSuite.sizeRange,
            view:                state.activeSuite.view,
            floorRange:          state.activeSuite.floorRange,
            priceFrom:           state.activeSuite.priceFrom,
            breakfastIncluded:   state.activeSuite.breakfastIncluded,
            spaAccessIncluded:   state.activeSuite.spaAccessIncluded,
            hasBalcony:          state.activeSuite.hasBalcony,
            hasJacuzzi:          state.activeSuite.hasJacuzzi,
            hasButler:           state.activeSuite.hasButler,
            amenities:           state.activeSuite.amenities,
          },
        }
      : (state.activePackage ? { package: state.activePackage.title } : null);

    stage = 'classify intent';
    const intent = safe('classifyMessage',
      () => classifyMessage(lastUserText, { alreadyDesigned, freshScenarioCue, activeSubject }),
      INTENT.UNKNOWN);

    stage = 'extract needs';
    const needs = safe('extractNeeds', () => extractNeeds(sanitized), {
      guests: null, budget: null, duration: null, checkIn: null, checkOut: null,
      purpose: null, preferences: [], specialRequests: [],
    });

    // ── Normalise shownRoomIds ───────────────────────────────────
    // Room IDs are UUID strings (VarChar 36). Keep them as-is — never parseInt.
    const cleanShownIds = Array.isArray(shownRoomIds)
      ? shownRoomIds.filter(id => typeof id === 'string' && id.length > 0)
      : [];

    console.log(`\n[Concierge] ─── New Request ───────────────────────`);
    console.log(`[Concierge] session    : ${sessionToken?.slice(0, 12) ?? 'none'}`);
    console.log(`[Concierge] intent     : ${intent}`);
    console.log(`[Concierge] language   : ${language}`);
    console.log(`[Concierge] needs      : guests=${needs.guests ?? '-'} budget=${needs.budget ?? '-'} purpose=${needs.purpose ?? '-'} prefs=[${needs.preferences.join(',')}]`);
    console.log(`[Concierge] shownRoomIds (${cleanShownIds.length}): [${cleanShownIds.join(', ')}]`);

    // ── EXPLICIT GUARD: these intents NEVER fetch rooms ──────────
    // Hard block, not a soft condition. Follow-ups and hotel-info questions
    // must not trigger a new room search even if a room word appears.
    const isServiceIntent =
      intent === INTENT.SERVICE_QUERY ||
      intent === INTENT.BOOKING_HELP  ||
      intent === INTENT.GREETING      ||
      intent === INTENT.FOLLOWUP      ||
      intent === INTENT.HOTEL_INFO;

    let recommendations = [];
    let recommendation  = null;

    if (!isServiceIntent) {
      // Determine whether this request even warrants a DB room lookup.
      // ONLY explicit room intents surface specific rooms (numbers/prices/cards).
      // EXPERIENTIAL and UNKNOWN deliberately do NOT — they stay experience-first
      // until the guest explicitly asks to see rooms.
      const shouldFetchRooms =
        intent === INTENT.ROOM_SEARCH ||
        intent === INTENT.ROOM_ALTERNATIVES;

      if (shouldFetchRooms) {
        // Pass exclusion list ONLY for alternatives request
        const excludeIds = intent === INTENT.ROOM_ALTERNATIVES ? cleanShownIds : [];
        console.log(`[Concierge] excludeIds (${excludeIds.length}): [${excludeIds.join(', ')}]`);

        recommendations = await getRecommendations(needs, 5, { excludeIds });

        // ── Secondary defence: post-query filter ─────────────────
        // If any shown room somehow slipped through (edge case), remove it here.
        if (cleanShownIds.length > 0) {
          const shownSet   = new Set(cleanShownIds);
          const beforeLen  = recommendations.length;
          const trulyNew   = recommendations.filter(r => !shownSet.has(r.id));
          if (trulyNew.length < beforeLen) {
            console.warn(`[Concierge] Secondary filter removed ${beforeLen - trulyNew.length} already-shown rooms`);
          }
          // Use filtered list only if it has results; otherwise keep original (no rooms left)
          if (trulyNew.length > 0) {
            recommendations = trulyNew;
          }
        }

        recommendation = recommendations[0] ?? null;

        console.log(`[Concierge] DB returned ${recommendations.length} room(s): [${recommendations.map(r => `${r.roomNumber}($${r.currentPrice})`).join(', ')}]`);
        console.log(`[Concierge] selected   : ${recommendation ? `Room ${recommendation.roomNumber} ($${recommendation.currentPrice}/night, score=${recommendation.score})` : 'none'}`);
      }
    } else {
      console.log(`[Concierge] service/greeting intent — room fetch SKIPPED`);
    }

    stage = 'requestedTopics';
    let requestedTopics = safe('extractRequestedTopics',
      () => (intent === INTENT.EXPERIENTIAL || intent === INTENT.ROOM_SEARCH)
        ? extractRequestedTopics(lastUserText)
        : [],
      []);
    if (intent === INTENT.EXPERIENTIAL) {
      requestedTopics = safe('mergeTopics',
        () => mergeTopics(requestedTopics, defaultTopicsForPurpose(needs.purpose)),
        requestedTopics);
    }

    stage = 'conversation mode';
    const refinementCue    = safe('isRefinementSignal', () => isRefinementSignal(lastUserText), false);
    const conversationMode = (alreadyDesigned && refinementCue && !freshScenarioCue) ? 'refinement' : 'discovery';

    stage = 'scenario switch';
    if (freshScenarioCue) {
      safe('scenarioSwitch', () => {
        const freshPurpose = extractPurpose(lastUserText);
        if (freshPurpose && freshPurpose !== needs.purpose) {
          console.log(`[Concierge] scenario switch: ${needs.purpose ?? '-'} → ${freshPurpose}`);
          needs.purpose = freshPurpose;
          requestedTopics = mergeTopics(
            extractRequestedTopics(lastUserText),
            defaultTopicsForPurpose(freshPurpose),
          );
        }
      }, null);
    }

    stage = 'emotion';
    needs.emotion = safe('extractEmotion', () => extractEmotion(lastUserText), null);

    if (requestedTopics.length) {
      console.log(`[Concierge] requestedTopics : [${requestedTopics.join(', ')}]`);
    }
    console.log(`[Concierge] mode       : ${conversationMode} (designed=${alreadyDesigned}, refineCue=${refinementCue}, freshCue=${freshScenarioCue})`);
    if (needs.emotion) console.log(`[Concierge] emotion    : ${needs.emotion}`);
    if (activeSubject) console.log(`[Concierge] activeSubject: ${JSON.stringify(activeSubject)}`);

    // ── DIRECT-FROM-STATE SHORT CIRCUIT ─────────────────────────────
    // For FOLLOW-UP turns with an active suite in state, try to answer the
    // factual question from the structured catalog. If we can, return
    // INSTANTLY without an LLM call — no hallucination, sub-second reply.
    if (intent === INTENT.FOLLOWUP && state.activeSuite) {
      const directAnswer = safe('tryDirectAnswer',
        () => tryDirectAnswer(state, lastUserText, language),
        null);
      if (directAnswer) {
        console.log(`[Concierge] ★ direct-from-state answer (no LLM) for suite=${state.activeSuite.label}`);
        console.log(`[Concierge] responded in ${Date.now() - t0}ms`);
        console.log(`[Concierge] ───────────────────────────────────────\n`);
        return res.json({
          message: directAnswer,
          language,
          intent,
          extractedNeeds: needs,
          recommendation: null,
          alternatives: [],
        });
      }
    }

    // Map intent + cues to a reasoning MODE for the AI (replaces ad-hoc
    // conversationMode string). Logged but currently passed via the existing
    // conversationMode plumbing — full mode-aware prompt instructions are a
    // deferred follow-on.
    stage = 'decide reasoning mode';
    const reasoningMode = safe('decideMode',
      () => decideMode({ intent, state, refinementCue, freshScenarioCue, lastUserText }),
      MODE.DISCOVERY);
    console.log(`[Concierge] reasoningMode: ${reasoningMode}`);

    if (DEBUG_CONCIERGE) {
      console.log(`[Concierge][DEBUG] full state:`, JSON.stringify({
        language, intent, conversationMode,
        needs, requestedTopics, activeSubject,
        alreadyDesigned, freshScenarioCue, refinementCue,
        recommendationRoomNumber: recommendation?.roomNumber ?? null,
      }, null, 2));
    }

    stage = 'generateConciergeResponse';
    let message;
    try {
      message = await generateConciergeResponse({
        messages:       sanitized,
        extractedNeeds: needs,
        recommendation,
        alternatives:   recommendations.slice(1, 3),
        language,
        intent,
        requestedTopics,
        conversationMode,
        activeSubject,
      });
    } catch (genErr) {
      console.error(`[Concierge] generateConciergeResponse threw at stage=${stage}:`, genErr?.message, genErr?.stack);
      // Last-resort graceful response per language so we NEVER return 500
      // for a generation error — the user always gets something readable.
      const lastResort = {
        en: 'I\'m here — could you tell me a little more about what you have in mind, and I\'ll arrange it from there?',
        ar: 'أنا في خدمتكم — هل يمكنكم أن تخبروني المزيد عمّا تودّونه، وسأرتّب لكم الباقي؟',
        tr: 'Buradayım — aklınızdakini biraz daha anlatır mısınız? Gerisini ben düzenlerim.',
      };
      message = lastResort[language] || lastResort.en;
    }

    // Analytics (fire-and-forget)
    if (sessionToken) {
      const userMsgCount = sanitized.filter(m => m.role === 'user').length;
      logSession(sessionToken, {
        language,
        messageCount: userMsgCount,
        needs,
        recommendation,
        newEventType: recommendation ? 'recommendation_shown' : null,
        newEventData: recommendation
          ? { roomId: recommendation.id, roomNum: recommendation.roomNumber, score: recommendation.score }
          : null,
      });
    }

    console.log(`[Concierge] responded in ${Date.now() - t0}ms`);
    console.log(`[Concierge] ───────────────────────────────────────\n`);

    res.json({
      message,
      language,
      intent,
      extractedNeeds: needs,
      recommendation,
      alternatives: recommendations.slice(1, 3),
    });

  } catch (error) {
    // Full diagnostic logging — exact stage, message, stack.
    console.error(`\n[Concierge] ✗ FATAL at stage="${stage}" after ${Date.now() - t0}ms`);
    console.error(`[Concierge]   message: ${error?.message || error}`);
    console.error(`[Concierge]   name   : ${error?.name || 'Error'}`);
    if (error?.stack) console.error(`[Concierge]   stack  :\n${error.stack}`);

    // When DEBUG_CONCIERGE is enabled, return the diagnostic to the client.
    // Otherwise return a generic message but still log everything server-side.
    if (DEBUG_CONCIERGE) {
      return res.status(500).json({
        error: 'Concierge service error.',
        stage,
        debug: {
          message: error?.message || String(error),
          name:    error?.name || 'Error',
          stack:   error?.stack,
        },
      });
    }
    res.status(500).json({ error: 'Concierge service error. Please try again.' });
  }
}

// ── POST /api/concierge/event ────────────────────────────────────
export async function logEvent(req, res) {
  const { sessionToken, eventType, eventData } = req.body;

  if (!sessionToken || !eventType) {
    return res.status(400).json({ error: 'sessionToken and eventType required' });
  }

  try {
    const session = await prisma.conciergeSession.findUnique({ where: { sessionToken } });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const sessionUpdate = {};
    if (eventType === 'booking_initiated') sessionUpdate.bookingInitiated = true;
    if (Object.keys(sessionUpdate).length) {
      await prisma.conciergeSession.update({ where: { id: session.id }, data: sessionUpdate });
    }

    await prisma.conciergeEvent.create({
      data: {
        sessionId: session.id,
        eventType,
        eventData: eventData ? JSON.stringify(eventData) : null,
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('[Concierge] event log error:', err.message);
    res.status(500).json({ error: 'Failed to log event' });
  }
}
