// ═══════════════════════════════════════════════════════════════
//  CONCIERGE SERVICE — Needs Extraction + Scoring Engine
// ═══════════════════════════════════════════════════════════════
import prisma from '../config/database.js';

// ── Language Detection (EN | AR | TR) ───────────────────────────
export function detectLanguage(text) {
  if (/[؀-ۿ]/.test(text)) return 'ar';
  // Turkish: specific diacritic chars OR Turkish root words (no \b — Turkish is agglutinative)
  if (/[çğışöüÇĞİŞÖÜ]/.test(text) ||
      /(merhaba|teşekkür|lütfen|günaydın|iyi akşam|nasılsın|evet|hayır|hizmet|fiyat|rezervasyon|havuz|masaj|restoran|yemek|menü|oda|kişi|misafir|giriş saati|çıkış|iptal|balayı|tatil|aile|çocuk|jimnastik|şoför|araç|istiyorum|var mı|ne kadar|kaç para|nasıl|nerede|ne zaman)/i.test(text))
    return 'tr';
  return 'en';
}

// ── Purpose Extraction (single text) ────────────────────────────
// Used both by extractNeeds (on full history) and by the controller to
// re-derive the purpose from JUST the latest user message when a fresh
// scenario starts — so honeymoon→business doesn't leave purpose stuck on
// honeymoon. First match wins, so order from most-specific occasion down.
const PURPOSE_MAP = [
  { value: 'birthday',  pattern: /birthday|birth.?day|happy birthday|عيد ميلاد|doğum günü/i },
  { value: 'honeymoon', pattern: /honeymoon|romantic|anniversary|couple|شهر العسل|رومانسي|عسل الشهر|للزوجين|balayı|romantik|evlilik yıldönümü|çift/i },
  { value: 'business',  pattern: /business|work trip|conference|meeting|corporate|أعمال|عمل|مؤتمر|اجتماع|iş seyahati|toplantı|konferans|kurumsal/i },
  { value: 'family',    pattern: /family|kids?|children|child|عائلة|أطفال|عيلة|أسرة|aile|çocuk|çocuklar/i },
  { value: 'vacation',  pattern: /vacation|holiday|leisure|relax|إجازة|عطلة|استجمام|راحة|tatil|dinlenme|rahatlama|gezinti/i },
  { value: 'vip',       pattern: /\bvip\b|presidential|finest|best available|أفخم|الأفضل|رئاسي|en iyi|özel|lüks oda/i },
];
export function extractPurpose(text) {
  if (!text) return null;
  for (const { pattern, value } of PURPOSE_MAP) {
    if (pattern.test(text)) return value;
  }
  return null;
}

// ── Emotion Extraction (semantic, finer-grained than purpose) ──
// Detects the QUALITY of the guest's wish so the experience generator can
// differentiate beyond purpose. First match wins — order from most specific
// physiological/mental state to broadest. Returns one of:
//   restorative — tired, exhausted, drained, burned out, needs rest
//   isolation   — disconnect, disappear, hide, alone, off-grid, invisible
//   silence     — peace, quiet, stillness, calm, no noise
//   healing     — heal, wellness, restore, renew, recover, detox
//   narrative   — story, cinematic, magical, fairy-tale, like a film
//   escape      — get away, switch off, unplug, breather, out of the world
const EMOTION_MAP = [
  { value: 'restorative', patterns: [
    /\b(exhaust(?:ed|ion)|drained|tired|worn ?out|burn(?:ed|t) ?out|weary|need(?: a)? rest|need to rest|low energy|sleep deprived|need to sleep|nap|recover(?:y)?|recharge(?: my batteries)?|knack(?:e|er)ed|spent|fatigue)\b/i,
    /(منهك|متعب|إنهاك|إرهاق|تعب|أحتاج راحة|تعافي|استعادة|إعياء|مرهق|نوم عميق)/,
    // Turkish stems — drop closing \b so "yorgun" matches "yorgunum"
    /\b(yorgun|bitkin|tükenmi|dinlen|enerjisiz|toparlan|şarj|uykusuz|halsiz|bitik|yenilen)/i,
  ]},
  { value: 'isolation', patterns: [
    /\b(disconnect|disappear|invisible|hide|hidden|alone|by myself|just (?:me|us)|no one|off.?grid|away from (?:everyone|people|the world)|nowhere|out of sight)\b/i,
    /(انفصال|اعتزال|اختفاء|وحدي|لوحدي|بعيداً عن|لا أحد|أختفي|نختفي|انعزال)/,
    // Turkish is agglutinative — drop closing \b so stems like "kop" match "kopmak"
    /\b(kop|kayb|saklan|yalnız|kimseyi|kimseden uzak|kaybol|göz önünden)/i,
  ]},
  { value: 'silence', patterns: [
    /\b(peace|peaceful|quiet|silen[tc]e|stillness|calm|tranquil|serenity|serene|no noise|hush|hushed|breath(?:ing)? space)\b/i,
    /(هدوء|سكون|سكينة|صمت|بدون ضجيج|هادئ|طمأنينة)/,
    /\b(sessiz|sessizlik|sakinlik|huzur|gürültüsüz|durgun|sükunet|dingin)\b/i,
  ]},
  { value: 'healing', patterns: [
    /\b(heal(?:ing)?|wellness|restore(?:d)?|renew|recover|nourish|mend|cleanse|detox|rebalance|wellbeing|reset my body|reset my mind)\b/i,
    /(شفاء|تعافي|صحة|تجديد|توازن|تطهير|رفاهية)/,
    /\b(iyileş|wellness|toparlanma|şifa|yenilenme|denge|arınma|detoks)\b/i,
  ]},
  { value: 'narrative', patterns: [
    /\b(stor(?:y|ies)|storytelling|narrative|cinematic|like a (?:film|movie|novel|book|scene)|fairy.?tale|magical|once upon|dreamlike|out of a movie|out of a film)\b/i,
    /(قصة|حكاية|سحري|سينمائي|كأنه فيلم|خرافي|كحلم|قصصي)/,
    /\b(hikaye|masal|büyülü|sinematik|peri.?masal|sanki film|rüya gibi|romansal)\b/i,
  ]},
  { value: 'escape', patterns: [
    /\b(get away|getaway|switch off|tune out|unplug|escape|breather|out of (?:the )?(?:office|town|world|everything)|break from|step away|change of scenery)\b/i,
    /(هروب|اعتزل|انفصل|أبتعد|راحة من|تغيير جو|بعيداً عن العالم)/,
    /\b(kaçış|kaç|kopuş|uzakla|ara ver|ortam değiş|dünyadan uzak)\b/i,
  ]},
];
export function extractEmotion(text) {
  if (!text) return null;
  for (const { value, patterns } of EMOTION_MAP) {
    if (patterns.some(p => p.test(text))) return value;
  }
  return null;
}

// ── Needs Extraction ────────────────────────────────────────────
// Reads the entire conversation to extract structured guest needs
export function extractNeeds(messages) {
  const userText = messages
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join(' ');

  const needs = {
    guests: null,
    budget: null,
    duration: null,
    checkIn: null,
    checkOut: null,
    purpose: null,     // honeymoon | business | family | vacation | vip
    preferences: [],   // spa | pool | gym | quiet | view | butler | balcony
    specialRequests: [],
  };

  // ── Guest Count ──────────────────────────────────────────────
  const guestMatch = userText.match(
    /(\d+)\s*(?:guests?|people|persons?|adults?|pax|أشخاص|شخص|نفر|ضيف|ضيوف|kişi|misafir|yetişkin|kişilik)/i
  );
  if (guestMatch) needs.guests = parseInt(guestMatch[1]);

  // Detect couple-related terms → 2 guests minimum
  if (!needs.guests && /couple|honeymoon|زوجين|شهر العسل|للزوجين|çift|balayı|iki kişi|ikimiz/i.test(userText)) {
    needs.guests = 2;
  }
  // Single person
  if (!needs.guests && /\b(solo|alone|single|tek kişi|yalnız|bir kişi)\b/i.test(userText)) {
    needs.guests = 1;
  }

  // ── Budget ───────────────────────────────────────────────────
  const budgetPatterns = [
    /budget[^\d]*\$?(\d[\d,]*)/i,
    /\$\s*(\d[\d,]*)\s*(?:per night|\/night|a night|لليلة|gecelik)?/,
    /(\d[\d,]+)\s*(?:dollars?|usd)(?:\s*per night)?/i,
    /up to\s*\$?\s*(\d[\d,]*)/i,
    /(?:max|maximum)\s*\$?\s*(\d[\d,]*)/i,
    /(\d[\d,]*)\s*دولار/,
    /ميزانية[^\d]*(\d[\d,]*)/,
    /(\d[\d,]+)\s*per night/i,
    /bütçe[^\d]*\$?(\d[\d,]*)/i,
    /(\d[\d,]+)\s*(?:dolar|usd)\s*(?:gecelik)?/i,
    /gecelik\s*\$?(\d[\d,]*)/i,
  ];
  for (const p of budgetPatterns) {
    const m = userText.match(p);
    if (m) { needs.budget = parseFloat(m[1].replace(/,/g, '')); break; }
  }

  // ── Duration ─────────────────────────────────────────────────
  const durationPatterns = [
    { p: /(\d+)\s*nights?/i, mult: 1 },
    { p: /(\d+)\s*(?:ليالٍ|ليلة)/i, mult: 1 },
    { p: /(\d+)\s*days?/i, mult: 1 },
    { p: /(\d+)\s*أيام/i, mult: 1 },
    { p: /(\d+)\s*weeks?/i, mult: 7 },
    { p: /(\d+)\s*أسابيع/i, mult: 7 },
    { p: /(\d+)\s*gece/i, mult: 1 },
    { p: /(\d+)\s*gün/i, mult: 1 },
    { p: /(\d+)\s*hafta/i, mult: 7 },
  ];
  for (const { p, mult } of durationPatterns) {
    const m = userText.match(p);
    if (m) { needs.duration = parseInt(m[1]) * mult; break; }
  }

  // ── Purpose ──────────────────────────────────────────────────
  needs.purpose = extractPurpose(userText);

  // ── Preferences ──────────────────────────────────────────────
  const prefMap = [
    { p: /spa|massage|wellness|سبا|مساج|علاج|masaj|terapi|hamam/i, v: 'spa' },
    { p: /pool|swim|مسبح|سباحة|havuz|yüzme/i, v: 'pool' },
    { p: /gym|fitness|workout|نادي رياضي|صالة رياضية|spor|jimnastik|egzersiz/i, v: 'gym' },
    { p: /quiet|peaceful|calm|هادئ|سكون|هدوء|sessiz|sakin/i, v: 'quiet' },
    { p: /view|panoramic|ocean view|city view|منظر|إطلالة|بانورامي|manzara|deniz manzarası/i, v: 'view' },
    { p: /butler|personal service|بتلر|خدمة شخصية|kişisel hizmet/i, v: 'butler' },
    { p: /balcony|terrace|شرفة|تراس|balkon|teras/i, v: 'balcony' },
    { p: /penthouse|بنتهاوس/i, v: 'penthouse' },
    { p: /suite|جناح|süit/i, v: 'suite' },
  ];
  for (const { p, v } of prefMap) {
    if (p.test(userText) && !needs.preferences.includes(v)) {
      needs.preferences.push(v);
    }
  }

  return needs;
}

// ── Scoring Algorithm ───────────────────────────────────────────
// Returns a numeric score for how well a room matches guest needs.
// Hard fail (return -100) if room cannot satisfy minimum requirements.
export function scoreRoom(room, needs) {
  let score = 0;
  let features = {};
  try { features = JSON.parse(room.features || '{}'); } catch { /* ignore */ }

  // ── Budget Match (weight: 5) ─────────────────────────────────
  if (needs.budget) {
    const ratio = room.currentPrice / needs.budget;
    if (ratio <= 1.0) {
      score += 5;
      if (ratio <= 0.75) score += 2;  // well within budget
      if (ratio <= 0.5) score += 1;   // great value bonus
    } else if (ratio <= 1.15) {
      score += 1;                      // slightly over — acceptable
    } else {
      score -= 4;                      // over budget
    }
  }

  // ── Capacity Match (weight: 4) — hard fail if too small ──────
  if (needs.guests) {
    if (room.capacity < needs.guests) return -100;
    score += 4;
    if (room.capacity <= needs.guests + 1) score += 1; // close fit bonus
  }

  // ── Purpose Match (weight: 3-5) ──────────────────────────────
  switch (needs.purpose) {
    case 'honeymoon':
      if (room.type === 'PENTHOUSE') score += 5;
      else if (room.type === 'SUITE') score += 3;
      else if (room.type === 'DELUXE') score += 1;
      if (features.balcony || features.private_terrace || features.rooftop_garden) score += 2;
      if (features.soaking_tub || features.jacuzzi || features.whirlpool) score += 2;
      if (/panoramic|ocean|sunset/i.test(features.view || '')) score += 1;
      break;

    case 'business':
      if (room.type === 'SUITE') score += 4;
      else if (room.type === 'DELUXE') score += 3;
      if (features.work_friendly || features.private_office) score += 3;
      if (features.video_conferencing || features.meeting_room) score += 2;
      if (features.city_view) score += 1;
      break;

    case 'family':
      if (room.capacity >= 4) score += 4;
      if (room.capacity >= 6) score += 2;
      if (room.type === 'SUITE' || room.type === 'PENTHOUSE') score += 3;
      if (features.separate_living_room || features.dining_area) score += 2;
      break;

    case 'vip':
      if (room.type === 'PENTHOUSE') score += 6;
      else if (room.type === 'SUITE') score += 4;
      if (features.butler_service || features.private_chef) score += 3;
      if (features.private_elevator || features.helipad_access) score += 2;
      if (features.private_pool || features.infinity_pool) score += 2;
      break;

    case 'vacation':
      if (room.type === 'DELUXE') score += 3;
      else if (room.type === 'SUITE') score += 2;
      if (features.balcony || features.panoramic_view) score += 2;
      if (features.pool_view || features.ocean_view) score += 1;
      break;
  }

  // ── Preference Match (weight: 2) ─────────────────────────────
  if (needs.preferences.includes('spa')) {
    const bathType = (features.bathroom?.type || '').toLowerCase();
    if (/spa|jacuzzi|whirlpool|turkish|hammam/i.test(bathType)) score += 2;
    if (features.steam_room || features.sauna || features.float_tank) score += 1;
  }

  if (needs.preferences.includes('view')) {
    if (features.floor_to_ceiling_windows || features.panoramic_view) score += 2;
    if (/panoramic|360|ocean|sunset|skyline/i.test(features.view || '')) score += 1;
  }

  if (needs.preferences.includes('butler')) {
    if (features.butler_service || features.personal_chef) score += 3;
  }

  if (needs.preferences.includes('balcony')) {
    if (features.balcony || features.private_terrace || features.rooftop_garden) score += 2;
  }

  if (needs.preferences.includes('quiet')) {
    if (features.quiet_zone) score += 2;
  }

  if (needs.preferences.includes('penthouse') || needs.preferences.includes('suite')) {
    if (room.type === 'PENTHOUSE') score += 4;
    else if (room.type === 'SUITE') score += 2;
  }

  // ── Rating Bonus ─────────────────────────────────────────────
  const rating = parseFloat(features.rating) || 0;
  if (rating >= 4.8) score += 2;
  else if (rating >= 4.5) score += 1;

  return score;
}

// ── Recommendation Engine ───────────────────────────────────────
// Queries available rooms, scores them, returns top N.
// options.excludeIds: UUID strings of rooms already shown — excluded from results.
export async function getRecommendations(needs, limit = 5, options = {}) {
  const { excludeIds = [] } = options;

  // Room IDs are UUID strings — keep them as strings, never parseInt
  const validExcludeIds = excludeIds.filter(id => typeof id === 'string' && id.length > 0);

  console.log(`[RecEngine] called — limit=${limit} excludeIds=[${validExcludeIds.join(', ')}]`);

  const where = { status: 'AVAILABLE' };

  // PRIMARY FILTER: never return already-shown rooms
  if (validExcludeIds.length > 0) {
    where.id = { notIn: validExcludeIds };
  }

  if (needs.guests) {
    where.capacity = { gte: needs.guests };
  }

  // Soft budget filter: up to 30% over (AI can explain and justify)
  if (needs.budget) {
    where.currentPrice = { lte: needs.budget * 1.3 };
  }

  // Purpose-based type hint — narrows the candidate pool before scoring
  if (needs.purpose === 'vip' || needs.preferences.includes('penthouse')) {
    where.type = { in: ['SUITE', 'PENTHOUSE'] };
  } else if (needs.purpose === 'honeymoon') {
    where.type = { in: ['DELUXE', 'SUITE', 'PENTHOUSE'] };
  } else if (needs.preferences.includes('suite')) {
    where.type = { in: ['SUITE', 'PENTHOUSE'] };
  }

  console.log(`[RecEngine] Prisma where: ${JSON.stringify({ ...where, id: where.id ? `notIn[${validExcludeIds.length}]` : 'any' })}`);

  let rooms = await prisma.room.findMany({
    where,
    take: 60,
    orderBy: { currentPrice: 'asc' },
  });

  if (!rooms.length) {
    console.log(`[RecEngine] No rooms with type/budget filters — relaxing to capacity+exclusion only`);
    // Fallback: drop budget + purpose type constraints, keep exclusion + capacity
    rooms = await prisma.room.findMany({
      where: {
        status: 'AVAILABLE',
        ...(validExcludeIds.length > 0 ? { id: { notIn: validExcludeIds } } : {}),
        ...(needs.guests ? { capacity: { gte: needs.guests } } : {}),
      },
      take: 20,
      orderBy: { currentPrice: 'asc' },
    });

    if (!rooms.length) {
      console.log(`[RecEngine] Still no rooms — all excluded or none available`);
      return [];
    }
  }

  console.log(`[RecEngine] candidate pool: ${rooms.length} rooms before scoring`);
  return _rankAndFormat(rooms, needs, limit);
}

function _rankAndFormat(rooms, needs, limit) {
  const scored = rooms
    .map(room => ({ room, score: scoreRoom(room, needs) }))
    .filter(r => r.score > -50)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ room, score }) => {
    let features = {};
    let images = [];
    let amenities = {};
    try { features = JSON.parse(room.features || '{}'); } catch { /* ignore */ }
    try { images = JSON.parse(room.images || '[]'); } catch { /* ignore */ }
    try { amenities = JSON.parse(room.amenities || '{}'); } catch { /* ignore */ }

    return {
      id: room.id,
      roomNumber: room.roomNumber,
      type: room.type,
      floor: room.floor,
      section: room.section,
      capacity: room.capacity,
      size: room.size,
      currentPrice: room.currentPrice,
      description: room.description,
      images,
      features,
      amenities,
      score,
    };
  });
}
