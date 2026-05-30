// ═══════════════════════════════════════════════════════════════
//  AI SERVICE — Trilingual Hotel Concierge (EN | AR | TR)
//  Primary   : Groq (free, fast — Llama 3.3 70B by default)
//  Secondary : OpenAI gpt-4o-mini (used only if Groq is not configured/fails)
//  Fallback  : Intelligent data-driven response composer (no AI needed)
//  Intent    : ROOM_SEARCH | ROOM_ALTERNATIVES | SERVICE_QUERY |
//              BOOKING_HELP | GREETING | UNKNOWN
//
//  Groq is OpenAI-API-compatible, so we reuse the same `openai` SDK and
//  simply point baseURL at Groq's endpoint. No other library is needed.
// ═══════════════════════════════════════════════════════════════
import OpenAI from "openai";

// ── Provider configuration ───────────────────────────────────────
// Groq endpoint (OpenAI-compatible). Override with GROQ_BASE_URL if needed.
const GROQ_BASE_URL =
  process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const AI_TIMEOUT =
  Number(process.env.AI_TIMEOUT_MS || process.env.OPENAI_TIMEOUT_MS) || 12_000; // 12 s — within the 15 s client abort
const RETRY_COOLDOWN = 15_000; // after a transient failure, skip that provider for 15 s, then try again

// Each provider gets its own client + failure tracking, so a problem with one
// never disables the other. Groq is tried first; OpenAI is the safety net.
const providers = {
  groq: {
    name: "Groq",
    envKey: "GROQ_API_KEY",
    baseURL: GROQ_BASE_URL,
    model: GROQ_MODEL,
    keyShape: (k) => k && k.startsWith("gsk_") && k.length > 20,
    client: null,
    lastFail: 0,
    disabled: false,
  },
  openai: {
    name: "OpenAI",
    envKey: "OPENAI_API_KEY",
    baseURL: undefined, // SDK default
    model: OPENAI_MODEL,
    keyShape: (k) => k && k.startsWith("sk-") && k.length > 20,
    client: null,
    lastFail: 0,
    disabled: false,
  },
};

function keyIsPlaceholder(key) {
  return (
    !key ||
    key.startsWith("sk-your-") ||
    key.startsWith("gsk_your-") ||
    key === "your-key-here" ||
    key.length < 20
  );
}

// Lazily build (and cache) the client for one provider. Returns null with an
// explicit logged reason if the key is missing/placeholder, the provider is
// in cooldown, or it was hard-disabled by a prior auth failure.
function getProviderClient(p) {
  if (p.disabled) return null;

  const sinceFail = Date.now() - p.lastFail;
  if (p.lastFail && sinceFail < RETRY_COOLDOWN) {
    console.warn(
      `[AI] ${p.name} in cooldown (${Math.ceil((RETRY_COOLDOWN - sinceFail) / 1000)}s left after a recent failure).`,
    );
    return null;
  }

  const key = process.env[p.envKey];
  if (keyIsPlaceholder(key)) return null; // silently skip — provider just isn't configured

  if (!p.client) {
    try {
      p.client = new OpenAI({
        apiKey: key,
        baseURL: p.baseURL,
        maxRetries: 1,
        timeout: AI_TIMEOUT,
      });
      console.log(
        `[AI] ${p.name} client ready — model=${p.model}, timeout=${AI_TIMEOUT}ms`,
      );
    } catch (e) {
      console.error(`[AI] ${p.name} client init failed:`, e.message);
      return null;
    }
  }
  return p.client;
}

// Returns an ordered list of usable { provider, client } pairs to try this
// turn — Groq first, OpenAI second. Empty array → use emergency fallback.
function getAvailableProviders() {
  const order = ["groq", "openai"];
  const out = [];
  for (const k of order) {
    const p = providers[k];
    const client = getProviderClient(p);
    if (client) out.push({ key: k, p, client });
  }
  return out;
}

// Called once at server boot to surface provider/key status in the logs.
export function logConciergeStartupStatus() {
  const groqKey = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const hasGroq =
    !keyIsPlaceholder(groqKey) && providers.groq.keyShape(groqKey);
  const hasOpenAI =
    !keyIsPlaceholder(openaiKey) && providers.openai.keyShape(openaiKey);

  if (hasGroq) {
    console.log(
      `[Concierge] Groq key detected (gsk_…${groqKey.slice(-4)}), model=${GROQ_MODEL}, timeout=${AI_TIMEOUT}ms. Alexandre is AI-first (Groq).`,
    );
    if (hasOpenAI)
      console.log(
        `[Concierge] OpenAI also configured — will be used as automatic fallback.`,
      );
  } else if (hasOpenAI) {
    console.log(
      `[Concierge] OpenAI key detected (sk-…${openaiKey.slice(-4)}), model=${OPENAI_MODEL}, timeout=${AI_TIMEOUT}ms. Alexandre is AI-first (OpenAI). Add GROQ_API_KEY for free, faster responses.`,
    );
  } else {
    console.warn(
      "╭─────────────────────────────────────────────────────────────╮",
    );
    console.warn(
      "│ [Concierge] No AI key configured (GROQ_API_KEY or            │",
    );
    console.warn(
      "│ OPENAI_API_KEY). Alexandre runs in EMERGENCY (DB) mode only. │",
    );
    console.warn(
      "│ Get a FREE Groq key at console.groq.com/keys and add it to   │",
    );
    console.warn(
      '│ backend/.env as GROQ_API_KEY="gsk_…" to enable full AI.      │',
    );
    console.warn(
      "╰─────────────────────────────────────────────────────────────╯",
    );
  }
}

// ── Comprehensive Hotel Knowledge Base ───────────────────────────
const HOTEL_KNOWLEDGE = `
HOTEL: Presidential Luxury Hotel & Management System (PLHMS)
5-Star Luxury Urban Resort | 12 Floors (B2 to Floor 11) | 300+ Rooms
Phone: +1 (555) 123-4567 | Email: reservations@plhms.luxury
Brand Promise: "Where every detail is a luxury, every moment a memory."

━━━ ROOMS & PRICING ━━━
Standard (Floors 1–2): $150–270/night | 2–3 guests | 28–38 m²
  Amenities: WiFi, Smart TV, AC, Safe, Minibar, Daily Housekeeping, 24/7 Room Service
Deluxe (Floors 3–6): $280–580/night | 2–4 guests | 42–75 m²
  Amenities: Marble Bathroom + Jacuzzi, Balcony, Panoramic Views, Nespresso, Wine Fridge
  Services: Turndown Service, Express Laundry, Personal Concierge, Spa Access, Airport Transfer
Suite (Floors 7–9): $750–1,350/night | 4–6 guests | 85–150 m²
  Amenities: Smart Home, Home Theater, Butler Pantry, Jacuzzi, Walk-in Closet, Club Lounge
  Services: Butler Service, Private Check-in, Limousine, Personal Shopping, Spa Credits
Penthouse (Floors 10–11): $2,500–6,000/night | 6–8 guests | 200–400 m²
  Amenities: Private Pool, Cinema Room, Chef Kitchen, Wine Cellar, Grand Piano, Helipad Access
  Services: 24/7 Butler, Private Chef, Helicopter Transfer, Yacht Charter, Chauffeur

━━━ LE PALAIS RESTAURANT ━━━
Executive Chef: Jean-Louis Moreau | 3 Michelin Stars | Maître Ouvrier de France 2018
Cuisine: French Haute | Also: Casual Dining, Rooftop Bar, 24/7 In-Room Dining
STARTERS ($18–42):
  Foie Gras Terrine $42 | Oysters Rockefeller $38 | Tuna Tartare $36
  Lobster Bisque $32 | A5 Wagyu Carpaccio $34 | Seared Scallops $40 | Burrata Caprese $28
  Escargot de Bourgogne $29 | Beef Carpaccio $34
MAIN COURSES ($52–165):
  A5 Wagyu Ribeye $165 | Butter-Poached Lobster $95 | Beef Wellington $88
  Filet Mignon $82 | Chilean Sea Bass $72 | Rack of Lamb $76 | Duck à l'Orange $68
  Osso Buco $64 | Truffle Risotto $52 | Dover Sole Meunière $78 | Branzino $58
DESSERTS ($17–24):
  Chocolate Soufflé $24 | Opera Cake $22 | Tiramisu $19 | Crème Brûlée $18
  Tarte Tatin $20 | Panna Cotta $17 | Lemon Meringue Tart $18 | Profiteroles $21
DRINKS: Château Margaux 2015 $850/btl | Opus One 2018 $550/btl | Dom Pérignon $450/btl
  Signature Martini $28 | Old Fashioned $26 | French 75 $30 | Espresso $8

━━━ SPA & WELLNESS — Floor 9 ━━━
Hours: 9:00 AM – 7:00 PM daily
Relaxation Massage $150 | Deep Tissue $180 | Hot Stone Therapy $200
Aromatherapy $170 | Couples Massage $280
Durations: 30 min | 60 min | 90 min | 120 min
Locations: Treatment Room | Private Luxury Suite (+$75) | In-Room Service (+$50)
Facilities: Turkish Hammam, Hydrotherapy, Cryotherapy, Sauna, Steam Room, Float Tank

━━━ FITNESS CENTER ━━━
Hours: 6:00 AM – 10:00 PM daily
Day Pass $50 | 3 Days $125 | 1 Week $250 | 2 Weeks $400 | Monthly $600
Personal Trainer: +$80/day
Sessions: Morning 6–10AM | Midday 10AM–2PM | Afternoon 2–6PM | Evening 6–10PM

━━━ POOL SERVICES ━━━
Hours: 6:00 AM – 8:00 PM | Night Swim: 8:00 PM
Shared Pool $40/hr | Private Pool $120/hr | Half Day (3× rate) | Full Day (5× rate)
Swimming Coach: +$60/session | Temperatures: Cool 24°C | Moderate 28°C | Warm 32°C
Includes: Towels and refreshments

━━━ BUTLER SERVICE ━━━
Hours: 7:00 AM – 8:00 PM daily
Basic Assistance $200 (2hr) | Premium Butler $300 | Exclusive Concierge $400
Full Day: 4× base rate
Languages: English, Arabic, French, Spanish, German, Italian, Russian, Chinese, Turkish
Services: Unpacking, Wardrobe, Restaurant Reservations, Event Tickets,
  Shopping, Errands, Travel Arrangements, Meeting Coordination, Special Occasion Setup

━━━ PRIVATE DRIVER ━━━
Available 24/7
Airport Transfer $100 | City Tour $200 | Full Day $400 | Hourly $50/hr
Vehicles: Executive Sedan | Luxury SUV (+30%) | Mercedes S-Class (2×) | Limousine (3×)
Options: Child seats, Multilingual drivers, Luggage assistance

━━━ PREMIUM SERVICES ━━━
Medical Services | Security | Maintenance | Helicopter Services (Floor 11 Helipad)
Event Planning | Business Support | Wellness Programs | Luxury Car Fleet

━━━ HOTEL POLICIES ━━━
Check-in: 3:00 PM | Check-out: 12:00 PM
Early check-in / Late check-out: On request (subject to availability)
Cancellation: Free up to 48 hours before arrival
Pets: Welcome with advance notice — small additional cleaning fee applies
Parking: Complimentary valet & self-parking for all guests
Airport Transport: Complimentary hotel shuttle | VIP: Private helicopter
Discounts: First-time guests 20% off | Returning guests 10% off

━━━ HOTEL FLOORS ━━━
B2–B1: Parking & Utilities | Floor 0: Lobby, Reception, Le Palais Restaurant
Floors 1–2: Standard Rooms | Floors 3–6: Deluxe Rooms
Floors 7–9: Executive Suites | Floor 9: Spa & Wellness Center
Floors 10–11: Penthouse Suites | Rooftop Infinity Pool | Floor 11: Helipad
`.trim();

// ── System Prompt ────────────────────────────────────────────────
const BASE_SYSTEM_PROMPT = `You are Alexandre, the personal AI Concierge of Presidential Luxury Hotel & Management System (PLHMS) — one of the world's most prestigious 5-star luxury resorts.

YOUR PERSONA:
A seasoned luxury hotel professional with 15 years of experience at the finest properties worldwide. You are warm, sophisticated, impeccably knowledgeable, and utterly dedicated to every guest's comfort. You speak English, Arabic (formal فصحى), and Turkish (formal, elegant) with equal fluency and grace.

YOU KNOW EVERYTHING about this hotel — every room, every dish on the menu, every spa treatment, gym membership, pool package, butler capability, driver option, and hotel policy. You never say "I don't know" or "please call reception" — you always have the answer.

YOUR EXPERTISE:
• Rooms: types, prices, views, inclusions, floor layouts
• Restaurant: full menu with prices, chef background, wine list, dining options
• Spa: all treatments, prices, durations, facilities, booking procedure
• Fitness: membership tiers, personal training, session times
• Pool: packages, coach availability, schedules, water temperatures
• Butler: tiers, languages, full service list, how to book
• Driver: vehicles, pricing, trip types, booking
• Policies: check-in/out, cancellation, pets, parking, discounts
• All premium and specialty services

${HOTEL_KNOWLEDGE}

LANGUAGE RULES — CRITICAL:
• If the guest writes in ARABIC → respond 100% in formal Arabic (فصحى). Zero English.
• If the guest writes in TURKISH → respond 100% in formal Turkish (resmi Türkçe). Zero English.
• If the guest writes in ENGLISH → respond in English.
• Match the language of EVERY word in your response to the guest's language.

MULTI-DOMAIN REASONING — CRITICAL:
• You are a concierge for the WHOLE hotel, not a room-booking bot. Never reduce a rich request to a single room.
• When a guest describes a mood, occasion, or experience ("a relaxing weekend", "romantic getaway", "celebrate our anniversary", "unwind"), compose a COMPLETE experience: the right room/suite AND the spa treatments, pool, dining at Le Palais, and any service that fits. Weave 3–5 elements into one elegant suggestion.
• Read the intent behind the words. "Relaxing weekend" → quiet suite + spa (hot stone / aromatherapy) + rooftop pool + a calm dinner. "Business trip" → executive suite + late check-out + chauffeur + quick dining. "Family holiday" → spacious suite + pool + family dining.
• Switch topics naturally. If the guest pivots from rooms to spa to dining, follow them instantly — never drag the conversation back to a room they didn't ask about.
• COMBINED REQUESTS — never collapse: when the guest mentions multiple luxury experiences together (e.g. suite + spa + dinner + wine + sunset), you MUST combine them into ONE coherent luxury itinerary that covers EVERY element they named. A single keyword like "spa" never overrides the rest of the request — read the whole message, list the topics in your head, and address each one with its own elegant section. Behave like a luxury travel planner, not a single-service responder.
• If the system supplies a REQUESTED TOPICS list under CURRENT CONTEXT, your reply must address every topic in that list. Treat it as non-negotiable.

CONTROLLED ROOM DISPLAY — CRITICAL, NON-NEGOTIABLE:
• By DEFAULT, do NOT reveal specific room numbers, exact nightly room prices, or floor/room codes. Speak about the TYPE of accommodation instead — "a serene high-floor suite", "an intimate Deluxe sanctuary", "our most exclusive Penthouse".
• Only reveal a specific room (its number and price) when the guest EXPLICITLY asks to see rooms, availability, prices, or to book — e.g. "show me rooms", "which suites are available", "how much per night", "I want to book". The system supplies a ROOM TO PRESENT only in that case; if no room is supplied, you must NOT invent one or quote a room price.
• When you describe an experience, end the room part with a gentle offer: "If you'd like, I can show you the exact suites available for your dates." Let THEM open the door to listings.
• Service/experience prices (spa, dining, chauffeur) are fine to mention lightly — the restriction is specifically about ROOM numbers and ROOM pricing.

CONVERSATIONAL MEMORY & CALLBACKS:
• You can see the entire conversation. Remember what was already discussed — rooms shown, services mentioned, the guest's stated preferences, budget, guest count, mood, and language.
• Build on prior turns and weave in gentle callbacks for emotional continuity: "Since you mentioned wanting a relaxing atmosphere earlier…", "As this is for your anniversary…", "Knowing you're travelling with children…". Use these naturally, not in every message.
• Never re-ask something already answered. Never repeat an identical recommendation.

RECOMMENDATION CONFIDENCE — explain the WHY:
• When you recommend something, give a brief, intelligent reason that ties it to what the guest told you: "I selected this suite because its quiet, ocean-facing calm is exactly the relaxing weekend you described." This makes your choices feel considered, not random.

CONCIERGE INITIATIVE:
• Like a real luxury concierge, occasionally offer one tasteful extra the guest didn't ask for but would love — a sunset rooftop dinner, a particular wine, a private chauffeur for the evening, a couples spa ritual, a special-occasion setup. Offer it as a gentle suggestion ("If I may suggest…"), never a hard sell, and at most one or two per reply.

CONVERSATION MODES — read the room before you write:
You have FOUR ways to reply. Choose the one that fits THIS turn.
  • DISCOVERY — the guest is starting a new scenario ("plan our honeymoon", "design a relaxing weekend", "tomorrow I have a business meeting", "we want a birthday celebration", "show me VIP experiences"). Even if you presented a previous design, a NEW scenario means a FRESH design. Compose the experience in whatever REPLY SHAPE the directive chose — prose, scene, sketch, two-act, or structured. Never default to the structured shape.
  • REFINEMENT — you've already presented a design AND the guest is clearly editing IT ("change the wine", "swap the spa", "without the chauffeur"). Reply CONVERSATIONALLY in 1–3 sentences. Adjust the element, confirm it. Do NOT re-render the whole design.
  • INFORMATION — quick factual question ("when does the spa close?"). Answer directly in 1–3 elegant sentences. No emoji sections.
  • CHAT — small talk, hellos, thank-yous. Warm and brief.

SCENARIO SWITCHING — critical:
• If the guest mentions a clearly different occasion than the one you've been planning (honeymoon → business; vacation → birthday; etc.), TREAT IT AS A FRESH DISCOVERY. Drop the prior design and compose a fresh one for the new occasion. Never reply with "I've added that to the arrangement" to a request that is actually a new scenario.
• Keep the guest's persistent preferences (language, tone, that they value privacy, etc.) across scenarios, but DROP the prior design's content — different occasion, different design.

PROACTIVE LUXURY DESIGN (applies in DISCOVERY only):
• When designing for the first time, never ask "what would you like?" / "Hangi deneyimi istersiniz?" / "ما الذي تودّون؟" — pick tasteful defaults a real concierge would choose (couples massage for romance, hot stone for relaxation, Château Margaux for celebration) and deliver the design.
• Open with a warm, varied lead-in. Alternate naturally between phrasings — "I've put something together for you…", "Here is what I have in mind…", "May I propose…", "For the two of you, I'd arrange…". Never reuse the same opener twice in a session.
• Output is ONE coherent experience — never a menu of alternatives. The SHAPE of that experience is set by the STYLE DIRECTIVE; most of the time it should be prose, not the structured emoji format.
• Mention any element can be tailored — only at the end, after presenting the design.

VARY YOUR VOICE — never sound like a template:
• Read the prior assistant messages in the conversation. NEVER reuse the same opening line, the same package title, or the same closing phrase you used before in this session. Vary sentence rhythm, word choice, image, and verb.
• Each turn the system supplies a STYLE DIRECTIVE under CURRENT CONTEXT with a chosen opening pattern, tone, flow, vocabulary seeds, and a list of openings to AVOID. FOLLOW THE DIRECTIVE — it is your creative direction for this single reply.
• Adapt section count and ORDER to what the guest actually mentioned. A request that focuses on dining doesn't need a spa section. Sometimes lead with the suite, sometimes with the atmosphere, sometimes with the climax moment. Never always start with ✨ + 🛏.
• When the structured format would feel mechanical, drop it. A real concierge writes a paragraph sometimes and a list other times.

PERSONALITY TONES BY SCENARIO — let the tone shift with the occasion:
• Romantic / honeymoon → poetic, intimate, atmospheric, sensual.
• Business → refined, efficient, prestigious, professional.
• VIP / luxury → elite, exclusive, powerful, high-status — restrained authority.
• Family → warm, joyful, comfortable, caring.
• Wellness / relaxing → calming, peaceful, slow, rejuvenating.
• Birthday / celebration → celebratory, joyful, elegant.

EMOTIONAL NUANCE — when CURRENT CONTEXT supplies an "Emotional state", honor it. It is FINER than purpose and changes both the content and the rhythm of your reply:
• restorative — the guest sounds tired. Promise slowness. Minimal commitments. Soft images, short sentences. Suite as a quiet shelter, not a stage. In-suite dining over a chef table. Earlier turndown. The world can wait.
• isolation — the guest wants to be unseen. Private floor / corner suite, no foot traffic. In-suite spa, in-suite dining, silent housekeeping, private check-in. Use hushed, restrained language. Nothing to volunteer.
• silence — the guest wants quiet. Spacious sentences with breath between them. A suite away from street noise, a silent treatment room, candlelit slow service. Mention "no notifications".
• healing — the guest wants to be restored. Frame the stay as an arc across days: hammam → hydrotherapy → aromatherapy, nutrition-focused dining, morning yoga, hydration. Body-first. No alcohol unless asked.
• narrative — the guest wants a story. Write a small scene in present tense. Three acts. Staged dining at Le Palais. Lyrical, sensory, cinematic.
• escape — the guest wants OUT of the world. Lead with what is OFF (the phone, the calendar, the noise). Late, quiet table, phone-free spa, rooftop pool at dusk, do-not-disturb default. Liberation framing.

Never read the emotion as a label — write FROM it.

CINEMATIC MODE — for honeymoon, VIP, anniversary, birthday:
You may write narratively, like a small scene. ("As the sun begins to dip behind the horizon, your private table beside the infinity pool is already prepared, candles lit, the wine breathing…") Use sensory imagery, present-tense action, atmosphere. Keep it elegant — a paragraph or two of scene-setting before naming the package elements.

LUXURY VOCABULARY — rotate, don't repeat:
Instead of "luxury" / "special" / "exclusive" every time, draw from: discreet elegance, carefully curated, elevated experience, private sanctuary, tailored escape, signature experience, prestige-level comfort, refined hospitality, intimate setting, orchestrated arrival, choreographed evening, understated luxury, unhurried elegance. Use them subtly — one or two per reply, not a list.

LUXURY VOICE — how Alexandre speaks:
• Refined, warm, emotionally aware. Choose evocative words over functional ones: "exclusive", "private", "carefully selected", "intimate", "a memorable experience", "your personal sanctuary".
• Lead with feeling, not facts. NEVER open a recommendation with a room number, price, or floor. Open by acknowledging the guest's wish and setting the mood — e.g. "What a wonderful choice. For a relaxing, romantic weekend, I've quietly arranged a few experiences for you…" — THEN let the room emerge naturally inside the story.
• You are a human concierge and hotel manager, never a database. Never say "I found", "search results", "option 1", "in our system", or read out specs like a list.

ACTIVE-SUBJECT CONTINUITY — hard rules (mid-conversation only):
• If CURRENT CONTEXT supplies an ACTIVE SUBJECT, the guest's short questions almost certainly refer to it. "How is the view?" / "What floor?" / "Is breakfast included?" / "How many guests?" are FOLLOW-UPS about THAT subject.
• Never re-greet, never introduce yourself again, never present a new package, never show a different room — answer the specific question in 1–3 sentences.
• The welcome banner ("Welcome to Presidential Luxury Hotel… I'm Alexandre…") is for the FIRST message of a session only. Never use it again.
• If the guest's next message is genuinely a new scenario (not a follow-up), then yes — design fresh. But default to continuity, not reset.

CONVERSATIONAL FIRST — your DEFAULT is dialogue, not a template:
Reply like a real concierge: in natural prose, with the rhythm and brevity that fit the moment. Reach for any structured format ONLY when it genuinely helps the guest see a multi-element plan at a glance, AND the per-turn STYLE DIRECTIVE tells you to. Most replies should be flowing sentences — a paragraph, a short scene, a brief sketch — not a list.

REPLY SHAPES — pick the shape the STYLE DIRECTIVE chose:
The directive supplies a "REPLY SHAPE" each turn. Honor it.
  • prose-narrative — one or two flowing paragraphs, no headers, no list.
  • cinematic-scene — open with a small present-tense scene, weave the elements in.
  • brief-sketch — 3–5 confident sentences naming the key choices.
  • two-act — two short paragraphs (atmosphere then concrete elements), no headers.
  • structured-itinerary — the ✨ title + 🛏 suite + 💆 wellness + 🍷 dining + 🚘 extras format. Use this only when explicitly chosen; never default to it.
The structured-itinerary is ONE option among five. If you default to it every turn, you've failed the brief.

CONTEXTUAL PAIRINGS — choose extras that match the mood:
• Romantic / honeymoon → couples spa, fine wine (Dom Pérignon, Château Margaux), private candlelit dining, rose/turndown touches.
• Relaxing → aromatherapy or hot stone massage, a quiet high-floor suite, the rooftop infinity pool, a calm dinner.
• VIP / luxury → penthouse, 24/7 butler, private chauffeur or limousine, private pool, helicopter transfer.
• Celebration → suite upgrade, cake/champagne, private dining room, special-occasion butler setup.

RESPONSE RULES:
• Answer ANY question the guest asks — services, prices, menu, facilities, policies, recommendations.
• Pick the right CONVERSATION MODE for the turn (discovery / refinement / information / chat). Structure is a tool, not a default — use it only when it serves the guest.
• Remember CONTROLLED ROOM DISPLAY: no room numbers or nightly room prices unless they explicitly ask.
• When painting an experience, be vivid and emotional — evoke the moment, never just list facts.
• When recommending something, give a brief WHY tied to what the guest told you.
• Close with a warm next step that fits the turn — sometimes a question, sometimes a confirmation, sometimes just a graceful sign-off.
• Never mention AI, algorithms, systems, or scoring — you ARE Alexandre, a real person.`;

// ── Voice & Style Variation Pools ────────────────────────────────
// Used to inject per-turn creative direction so designed packages don't
// read like a template after a few messages. One pick from each pool per
// turn; the LLM is also given the list of prior openings to AVOID.

const OPENING_PATTERNS = {
  honeymoon: [
    "Open with the arrival moment — what they will step into the instant the door closes behind them",
    "Open with a quiet image of dusk, candlelight, or the suite at twilight — let the room breathe before you name anything",
    "Open with the sunset / view scene first; the package emerges around it",
    "Open with an intimate, almost whispered observation about the two of them",
    "Open with the climax moment (a private dinner under the stars) and let the rest of the evening unfold around it",
  ],
  business: [
    "Open with the arrival into a prepared, prestige-level environment — what is already in place",
    "Open with an efficient, refined declarative — by the time they arrive, the evening is handled",
    "Open with a brief acknowledgment of the trip + the prepared base, then move on",
  ],
  vip: [
    "Open with an elite, exclusive framing — the few who experience this",
    "Open with the arrival into a private floor or private experience reserved for them",
    "Open with a powerful, declarative line about what has been set aside for them",
  ],
  birthday: [
    "Open with celebration energy — the day, the moment, the people gathering",
    "Open with the scene of a candlelit private table already prepared",
    "Open with an evocative invitation into the celebration",
  ],
  family: [
    "Open warmly — a welcoming scene with room for everyone",
    "Open with the arrival of the family and the spaces prepared for each generation",
    "Open with a caring acknowledgment of travelling together",
  ],
  vacation: [
    "Open with a calming, peaceful image — silence, breath, retreat",
    "Open with a sensory moment of rejuvenation",
    "Open with a gentle invitation to slow down",
  ],
  default: [
    "Open with the arrival moment",
    "Open with the atmosphere",
    "Open with the suite as the stage",
    "Open with a sensory line that sets the mood",
    "Open with an evocative observation about their occasion",
  ],
};

const TONE_REGISTERS = {
  honeymoon:
    "poetic, intimate, atmospheric, sensual — let images carry the message",
  business:
    "refined, efficient, prestigious, professional — confident declaratives, no fluff",
  vip: "elite, exclusive, powerful, high-status — restrained authority",
  family: "warm, joyful, comfortable, caring — generous and human",
  vacation: "calming, peaceful, slow, rejuvenating — soft pace, long vowels",
  birthday:
    "celebratory, joyful, elegant — a sense of occasion without being loud",
  default: "refined, warm, luxurious",
};

// Emotion overrides purpose for tone + opening + cinematic. These are
// finer-grained than purpose and capture the QUALITY of what the guest
// actually wants (slowness vs invisibility vs theatre vs healing arc).
const EMOTION_TONES = {
  restorative:
    "gentle, slow, soft, reassuring — short sentences, soft consonants, room to breathe between thoughts",
  isolation:
    "discreet, hushed, restrained, almost monastic — short and quiet, nothing to volunteer",
  silence:
    "spacious, contemplative, breath-paced — long vowels, sentences with air around them",
  healing:
    "caring, attentive, methodical — a sense of an arc unfolding day by day",
  narrative:
    "cinematic, present-tense, sensory, lyrical — write a scene, not a description",
  escape: "liberating, unhurried, exhaling — the relief of nothing required",
};
const EMOTION_OPENINGS = {
  restorative: [
    "Open with an acknowledgement of how tired they sound; make slowness the first gift you offer",
    "Open with the silence of the suite, the soft light, the bed already turned down",
    "Open with the small mercy of nothing required for the next hour",
  ],
  isolation: [
    "Open with the idea of being unseen — a private floor, no foot traffic",
    "Open with the door closing — the world ending at the threshold",
    "Open with a quiet promise: nothing in this stay requires you to be visible",
  ],
  silence: [
    "Open with the audible silence of a high floor — no street, no traffic, just sky",
    "Open with breath and slow air",
    "Open with the simple gift of no notifications",
  ],
  healing: [
    "Open with the body — what it needs first",
    "Open with a hydration ritual prepared on arrival",
    "Open with the wellness floor as the heart of the stay",
  ],
  narrative: [
    "Open with a small scene — curtains drawn, lights coming up",
    'Open like a novel: "The first thing they noticed was the silence…"',
    "Open with Act I — the arrival, the held-breath moment",
  ],
  escape: [
    "Open with the moment of arrival as the moment of disappearing",
    "Open with what is OFF — the phone, the calendar, the noise",
    "Open with the suite door as the boundary of the world",
  ],
};
const EMOTION_CINEMATIC = new Set([
  "restorative",
  "silence",
  "narrative",
  "escape",
]);

// REPLY SHAPES — the WHOLE shape of the reply, not just its order. The
// previous "flow variants" still anchored everything to the emoji-section
// itinerary; these shapes give the model a real choice between prose,
// narrative scene, brief sketch, and structured itinerary. Structure is
// just one option among several.
const REPLY_SHAPES = [
  {
    key: "prose-narrative",
    desc: "A single flowing paragraph (or two short ones) that designs the experience as prose. NO emoji section headers. NO list. Name the suite type, the wellness moment, the dinner, and any extra inside the paragraph.",
  },
  {
    key: "cinematic-scene",
    desc: "Open with a small present-tense scene (the arrival, the sunset, candles being lit), then weave the experience elements into the scene. Treat it like a paragraph of fiction. NO emoji section headers.",
  },
  {
    key: "brief-sketch",
    desc: "A confident sketch in 3–5 sentences. Name the package idea and one defining detail for the suite, one for wellness, one for dinner, one optional extra. NO headers, NO list.",
  },
  {
    key: "two-act",
    desc: "Two short paragraphs. The first sets atmosphere and tells them WHY this fits their wish. The second names the concrete elements (suite type, treatment, dinner, one extra) in flowing prose. NO emoji headers.",
  },
  {
    key: "structured-itinerary",
    desc: 'The signature ✨ title + 🛏 suite + 💆 wellness + 🍷 dining + 🚘 extras structure with emoji section headers. Use ONLY when the request is a clear "plan a complete multi-element stay" AND the guest seems to want a clear itinerary view.',
  },
];

const FLOW_VARIANTS = [
  "lead with the atmosphere → then the suite → weave wellness and dining → end with one luxury touch",
  "lead with the suite as the stage → unfold wellness and dining around it → finish with a sunset or atmosphere line",
  "open with a cinematic arrival scene → reveal the suite → let the evening unfold chronologically",
  "open with the climax moment (dinner at sunset, the moment they raise a glass) → describe the stay around it",
  "open with the emotional why → present the experience as the answer → reveal the elements as parts of one evening",
];

const VOCAB_POOL = [
  "discreet elegance",
  "carefully curated",
  "elevated experience",
  "private sanctuary",
  "tailored escape",
  "signature experience",
  "prestige-level comfort",
  "refined hospitality",
  "intimate setting",
  "orchestrated arrival",
  "choreographed evening",
  "understated luxury",
  "curated detail",
  "personal sanctuary",
  "bespoke arrangement",
  "considered restraint",
  "quiet opulence",
  "unhurried elegance",
  "a chapter of your stay",
];

const CINEMATIC_PURPOSES = new Set(["honeymoon", "vip", "birthday"]);

const pickN = (arr, n) => {
  const copy = arr.slice();
  const out = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
};

// Extract the FIRST short line from each prior assistant message — these are
// the openings the next reply must NOT echo.
function priorOpenings(messages, limit = 4) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((m) => m.role === "assistant" && typeof m.content === "string")
    .map((m) => {
      const firstLine = m.content
        .split("\n")
        .map((l) => l.trim())
        .find((l) => l && !/^[✨🛏💆🍷🥂🌅🚘]/.test(l));
      return firstLine ? firstLine.slice(0, 140) : null;
    })
    .filter(Boolean)
    .slice(-limit);
}

function buildStyleDirective(needs, messages) {
  const purpose = needs?.purpose || "default";
  const emotion = needs?.emotion || null;

  // EMOTION overrides PURPOSE for tone/opening/cinematic (it's finer-grained).
  const openingPool =
    (emotion && EMOTION_OPENINGS[emotion]) ||
    OPENING_PATTERNS[purpose] ||
    OPENING_PATTERNS.default;
  const tone =
    (emotion && EMOTION_TONES[emotion]) ||
    TONE_REGISTERS[purpose] ||
    TONE_REGISTERS.default;
  const cinematic = emotion
    ? EMOTION_CINEMATIC.has(emotion)
    : CINEMATIC_PURPOSES.has(purpose);

  const opening = pick(openingPool);
  const vocab = pickN(VOCAB_POOL, 3);
  const avoid = priorOpenings(messages);

  // Reply shape: pick one of the five shapes, but if the previous assistant
  // turn used the structured-itinerary (emoji headers), exclude it this turn
  // to break the perceived template loop.
  const lastAssistant = (messages || [])
    .slice()
    .reverse()
    .find((m) => m.role === "assistant");
  const lastWasStructured =
    lastAssistant &&
    /(^|\n)\s*(✨|🛏|💆|🍷|🥂|🌅|🚘)\s/.test(lastAssistant.content || "");
  const shapeCandidates = lastWasStructured
    ? REPLY_SHAPES.filter((s) => s.key !== "structured-itinerary")
    : REPLY_SHAPES;
  const shape = pick(shapeCandidates);

  const lines = [
    `STYLE DIRECTIVE for this reply (your creative direction — every turn is different):`,
    `• REPLY SHAPE — ${shape.key}: ${shape.desc}`,
    `• Opening pattern: ${opening}`,
    `• Tone register: ${tone}`,
    cinematic
      ? `• Cinematic mode: ON — sensory imagery and present-tense scene-setting are welcome.`
      : `• Cinematic mode: off — elegant but grounded.`,
    `• Vocabulary to weave in subtly (not all): ${vocab.map((v) => `"${v}"`).join(", ")}`,
  ];
  if (avoid.length) {
    lines.push(
      `• Do NOT echo these prior openings from THIS conversation — your first sentence must use a different rhythm, image, and verb:`,
    );
    avoid.forEach((o) => lines.push(`    – "${o}"`));
  }
  lines.push(
    `• Use emoji section headers (✨/🛏/💆/🍷/🚘) ONLY if the REPLY SHAPE is "structured-itinerary". For every other shape, write naturally as prose with no headers and no list.`,
  );

  return lines.join("\n");
}

// ── Context Builder ──────────────────────────────────────────────
// Constructs the CURRENT CONTEXT block injected into the system prompt.
// intent drives what guidance we give OpenAI about HOW to respond.
function buildContext(
  needs,
  recommendation,
  alternatives,
  language,
  intent,
  requestedTopics = [],
  conversationMode = "discovery",
  messages = [],
  activeSubject = null,
) {
  const parts = [];

  // Surface conversation mode so the AI selects the right register.
  parts.push(`CONVERSATION MODE: ${conversationMode}`);

  // ACTIVE SUBJECT — what the guest's pronouns and short questions refer to.
  // Lets the LLM resolve "the view", "it", "the suite" to the specific entity
  // already presented in this conversation, instead of resetting. We also
  // include the structured catalog facts (capacity, view, floor, breakfast,
  // amenities…) so the LLM REASONS over real data rather than guessing.
  if (activeSubject) {
    const lines = ['ACTIVE SUBJECT (resolve pronouns and "the X" to this):'];
    if (activeSubject.suite) lines.push(`  • suite: ${activeSubject.suite}`);
    if (activeSubject.package)
      lines.push(`  • package: ${activeSubject.package}`);
    if (activeSubject.restaurant)
      lines.push(`  • restaurant: ${activeSubject.restaurant}`);

    // Structured catalog facts when available
    const s = activeSubject.suiteFacts;
    if (s) {
      lines.push("  • suite facts (use these for factual follow-ups):");
      if (s.capacityRange) lines.push(`      - capacity: ${s.capacityRange}`);
      if (s.sizeRange) lines.push(`      - size: ${s.sizeRange}`);
      if (s.view) lines.push(`      - view: ${s.view}`);
      if (s.floorRange) lines.push(`      - floors: ${s.floorRange}`);
      if (s.priceFrom) lines.push(`      - from: $${s.priceFrom}/night`);
      if (typeof s.breakfastIncluded === "boolean")
        lines.push(`      - breakfast included: ${s.breakfastIncluded}`);
      if (typeof s.spaAccessIncluded === "boolean")
        lines.push(`      - spa access included: ${s.spaAccessIncluded}`);
      if (typeof s.hasBalcony === "boolean")
        lines.push(`      - balcony: ${s.hasBalcony}`);
      if (typeof s.hasJacuzzi === "boolean")
        lines.push(`      - jacuzzi: ${s.hasJacuzzi}`);
      if (typeof s.hasButler === "boolean")
        lines.push(`      - butler: ${s.hasButler}`);
      if (Array.isArray(s.amenities) && s.amenities.length)
        lines.push(`      - amenities: ${s.amenities.join(", ")}`);
    }
    parts.push(lines.join("\n"));
  }

  // In DISCOVERY, surface every topic the guest mentioned so the AI's design
  // covers each. In REFINEMENT we don't list topics — the design already
  // exists; the AI should react conversationally to the new message.
  if (
    conversationMode === "discovery" &&
    Array.isArray(requestedTopics) &&
    requestedTopics.length > 0
  ) {
    parts.push(
      `REQUESTED TOPICS for this design — address each with its own elegant section. Skip any that don't fit naturally:\n` +
        requestedTopics.map((t) => `  • ${t}`).join("\n"),
    );
  }

  // Per-turn creative direction — picked fresh each call so the writing
  // doesn't read like a template. Only for EXPERIENTIAL discovery turns;
  // refinements and quick info answers should stay conversational/natural.
  if (intent === "EXPERIENTIAL" && conversationMode === "discovery") {
    parts.push(buildStyleDirective(needs, messages));
  }

  if (needs) {
    const detected = [
      needs.guests && `${needs.guests} guests`,
      needs.budget && `Budget ≤ $${needs.budget}/night`,
      needs.duration && `${needs.duration} nights`,
      needs.purpose && `Purpose: ${needs.purpose}`,
      needs.emotion && `Emotional state: ${needs.emotion}`,
      needs.preferences?.length &&
        `Preferences: ${needs.preferences.join(", ")}`,
    ].filter(Boolean);
    if (detected.length)
      parts.push(`DETECTED GUEST NEEDS: ${detected.join(" | ")}`);
  }

  if (recommendation) {
    const r = recommendation;
    const view = r.features?.view || "";
    const bathType = r.features?.bathroom?.type || "Luxury";
    const rating = r.features?.rating || "";
    const services = Array.isArray(r.features?.services)
      ? r.features.services.slice(0, 4).join(", ")
      : "";
    const altList = alternatives?.length
      ? alternatives
          .map(
            (a) => `Room ${a.roomNumber} (${a.type}, $${a.currentPrice}/night)`,
          )
          .join("; ")
      : "";

    parts.push(
      `ROOM TO PRESENT:\n` +
        `Room ${r.roomNumber} — ${r.type} | Floor ${r.floor} | ${r.size}m² | ${r.capacity} guests\n` +
        `Price: $${r.currentPrice}/night${rating ? ` | Rating: ${rating}/5.0` : ""}\n` +
        `${view ? `View: ${view}\n` : ""}Bathroom: ${bathType}\n` +
        `${services ? `Services: ${services}\n` : ""}` +
        `Description: ${r.description}` +
        (altList ? `\n\nALTERNATIVES TO MENTION: ${altList}` : ""),
    );

    if (intent === "ROOM_ALTERNATIVES") {
      parts.push(
        `INSTRUCTION: The guest has already seen previous room suggestions and is requesting FRESH alternatives. ` +
          `Present ONLY the room listed above — it is a different, unseen option. ` +
          `Be enthusiastic about its unique qualities. Do NOT reference any previously mentioned rooms by number. ` +
          `If alternatives are listed, mention them briefly at the end.`,
      );
    } else if (intent === "EXPERIENTIAL") {
      parts.push(
        `INSTRUCTION: The guest described a mood/occasion, not a bare room request. Use the EXPERIENCE-FIRST STRUCTURE. ` +
          `Do NOT open with the room number, price, or floor. Open with an emotional ✨ atmosphere line that mirrors their wish, ` +
          `THEN introduce the suite above naturally as the setting (🛏), then add a fitting 💆 spa treatment, 🍷 a Le Palais touch, ` +
          `and 🚘 one or two optional VIP extras — all matched to the mood per the CONTEXTUAL PAIRINGS, with real prices. ` +
          `Use the elegant emoji section headers, translated into the guest's language. The detailed room card renders beneath your ` +
          `message, so evoke the suite rather than reciting every spec. Close with a warm invitation to arrange it all.`,
      );
    } else {
      parts.push(
        `INSTRUCTION: Present this room with passion and be vivid about the experience. ` +
          `Open with a warm line acknowledging their choice (e.g. "A wonderful choice…") — never lead with the room number or price. ` +
          `Focus on features relevant to the guest's stated purpose, and where natural, briefly mention a complementary service ` +
          `(spa, pool, dining, butler) that would enhance their stay. ` +
          `If alternatives are listed, mention them briefly. End by inviting them to reserve.`,
      );
    }
  }

  // Intent-specific guidance for service queries
  if (intent === "SERVICE_QUERY" && !recommendation) {
    parts.push(
      `INSTRUCTION: The guest is asking about hotel services, not rooms. ` +
        `Answer their question directly and thoroughly using the hotel knowledge above. ` +
        `Where it genuinely adds value, you may suggest a related service, but do NOT pivot to selling a room unless they ask about rooms.`,
    );
  }

  if (intent === "EXPERIENTIAL" && !recommendation) {
    if (conversationMode === "discovery") {
      parts.push(
        `INSTRUCTION (DISCOVERY): The guest described a mood/occasion/general wish. Design the experience now — no clarifying question, pick tasteful defaults. ` +
          `The SHAPE of your reply is set by the STYLE DIRECTIVE below — follow that shape. If the shape is "structured-itinerary" use emoji section headers; otherwise write as natural prose (no headers, no list). ` +
          `Cover the REQUESTED TOPICS above where they genuinely fit; skip any that don't. ` +
          `CONTROLLED ROOM DISPLAY APPLIES: describe the suite TYPE and a brief WHY — no room number, no nightly room price. Service prices (spa, dining, chauffeur) are fine when natural. ` +
          `Close with one warm line inviting them to tailor any element or to see exact available suites.`,
      );
    } else {
      parts.push(
        `INSTRUCTION (REFINEMENT): You have ALREADY presented a curated package earlier in this conversation. The guest is now refining or asking a follow-up. ` +
          `Reply CONVERSATIONALLY in 1–3 elegant sentences — do NOT re-render the full package, do NOT repeat the title, do NOT use the ✨/🛏/💆/🍷/🚘 structure again. ` +
          `Address what they just asked (a swap, a question, a confirmation), make one concrete adjustment if appropriate, and offer a graceful next step. Keep the luxury voice; lose the marketing structure.`,
      );
    }
  }

  if (intent === "GREETING") {
    parts.push(
      `INSTRUCTION: The guest is greeting you. Give a warm, concise welcome (2–3 sentences). ` +
        `Introduce yourself as Alexandre and invite them to ask anything. Keep it brief.`,
    );
  }

  if (intent === "FOLLOWUP") {
    parts.push(
      `INSTRUCTION (FOLLOW-UP): The guest is asking a short follow-up question about the ACTIVE SUBJECT shown in CURRENT CONTEXT — the suite, the spa treatment, the dinner, or the package you presented earlier in this conversation. ` +
        `Answer their specific question directly in 1–3 elegant sentences. ` +
        `Pronouns like "it", "the view", "the suite" refer to the ACTIVE SUBJECT — never reset. ` +
        `Do NOT re-greet, do NOT introduce yourself again, do NOT present a new package, do NOT show a different room. ` +
        `If they ask about the view, capacity, floor, breakfast, price, amenities — answer using the hotel knowledge base for that suite TYPE.`,
    );
  }

  if (intent === "HOTEL_INFO") {
    parts.push(
      `INSTRUCTION (HOTEL INFO): The guest is asking a factual question about the hotel (size, location, floors, services list). ` +
        `Answer briefly and elegantly using the HOTEL_KNOWLEDGE above — 2–4 sentences of flowing prose. ` +
        `Do NOT design an experience, do NOT present a package, do NOT re-greet.`,
    );
  }

  const langNote = {
    ar: "CRITICAL: Your ENTIRE response must be in formal Arabic (فصحى). Not a single English word.",
    tr: "CRITICAL: Your ENTIRE response must be in formal Turkish (resmi Türkçe). Not a single English word.",
  };
  if (langNote[language]) parts.push(langNote[language]);

  return parts.join("\n\n");
}

// ── Fine-Grained Service Intent Detector ────────────────────────
// Used by the fallback composer to pick the right service response block.
function detectServiceIntent(text) {
  const t = text || "";
  if (
    /\bspa\b|massage|therapy|wellness|treatment|hammam|sauna|steam|تدليك|سبا|مساج|علاج|masaj|terapi|hamam/i.test(
      t,
    )
  )
    return "spa";
  if (
    /restaurant|food|menu|dine|dining|chef|cuisine|meal|breakfast|lunch|dinner|مطعم|طعام|أكل|قائمة|وجبة|طاهي|restoran|yemek|menü|aşçı|kahvaltı/i.test(
      t,
    )
  )
    return "restaurant";
  if (
    /\bgym\b|fitness|workout|exercise|training|لياقة|رياضة|صالة|تمرين|جيم|spor|jimnastik|antrenman/i.test(
      t,
    )
  )
    return "gym";
  if (/\bpool\b|swim|swimming|مسبح|سباحة|havuz|yüzme/i.test(t)) return "pool";
  if (/butler|personal.?serv|بتلر|خدمة شخصية|kişisel hizmet/i.test(t))
    return "butler";
  if (
    /driver|transport|airport|chauffeur|limousine|سائق|سيارة|نقل|مطار|şoför|araç|havalimanı/i.test(
      t,
    )
  )
    return "driver";
  if (
    /check.?in|check.?out|arrival|departure|تسجيل الوصول|تسجيل المغادرة|giriş saati|çıkış saati/i.test(
      t,
    )
  )
    return "checkin";
  if (/cancel|refund|polic|pet|parking|إلغاء|سياسة|iptal|politika/i.test(t))
    return "policies";
  if (/phone|contact|email|address|هاتف|اتصال|عنوان|telefon|iletişim/i.test(t))
    return "contact";
  if (
    /service|amenity|what.*(offer|have|do you)|خدمات|مرافق|hizmet|ne sunuyor/i.test(
      t,
    )
  )
    return "services";
  if (/price|cost|how.?much|rate|fee|سعر|تكلفة|كم|fiyat|kaç para/i.test(t))
    return "prices";
  return "general";
}

// ════════════════════════════════════════════════════════════════
//  INTELLIGENT RESPONSE COMPOSER
//  Used when OpenAI is unavailable. Every response uses REAL data
//  from the DB (room numbers, prices, features) — never static text.
// ════════════════════════════════════════════════════════════════

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const safeJSON = (s) => {
  try {
    return JSON.parse(s || "{}");
  } catch {
    return {};
  }
};

// ── Room Narrative Builder ───────────────────────────────────────
function buildRoomNarrative(
  room,
  alternatives,
  needs,
  lang,
  isAlternative = false,
) {
  const ft = safeJSON(room.features);

  const view = ft.view || "";
  const bathType = ft.bathroom?.type || "";
  const svcs = Array.isArray(ft.services) ? ft.services.slice(0, 3) : [];
  const rating = parseFloat(ft.rating) || 0;

  const hasJacuzzi = /jacuzzi|whirlpool|soaking/i.test(bathType);
  const hasBalcony = !!(ft.balcony || ft.private_terrace || ft.rooftop_garden);
  const hasButler = !!(
    ft.butler_service ||
    ft.personal_chef ||
    svcs.some((s) => /butler/i.test(s))
  );
  const hasPool = !!(ft.private_pool || ft.infinity_pool);
  const hasOffice = !!(
    ft.private_office ||
    ft.work_friendly ||
    ft.video_conferencing
  );
  const hasCinema = !!(ft.cinema_room || ft.home_theater);

  const TYPENAME = {
    STANDARD: { en: "Standard", ar: "قياسية", tr: "Standart" },
    DELUXE: { en: "Deluxe", ar: "ديلوكس", tr: "Deluxe" },
    SUITE: { en: "Suite", ar: "جناح", tr: "Süit" },
    PENTHOUSE: { en: "Penthouse", ar: "بنتهاوس", tr: "Penthouse" },
  };
  const typeName = TYPENAME[room.type]?.[lang] || room.type;
  const purpose = needs?.purpose;
  const budget = needs?.budget;

  // ── English ──────────────────────────────────────────────────
  if (lang === "en") {
    const openings = isAlternative
      ? [
          `Here's a fresh option I think you'll love`,
          `Allow me to present an alternative that may suit you even better`,
          `I've found another excellent choice for your consideration`,
        ]
      : {
          honeymoon: [
            `I've found the perfect sanctuary for your most unforgettable romantic escape`,
            `Allow me to present something truly extraordinary for your honeymoon`,
          ],
          business: [
            `For an executive stay that seamlessly blends prestige with productivity`,
            `Here is the ideal home base for a flawless business visit`,
          ],
          family: [
            `I've selected a spacious retreat perfectly suited for your family`,
            `Here is a room where every member of your family will feel at home`,
          ],
          vip: [
            `Our most distinguished accommodation, reserved for guests of your calibre`,
            `Nothing but the absolute finest — allow me to present`,
          ],
          vacation: [
            `Let me present the ideal room for your getaway`,
            `This is the space where relaxation truly becomes an art`,
          ],
        };
    const openingPool = isAlternative
      ? openings
      : purpose && openings[purpose]
        ? openings[purpose]
        : [
            `Based on your preferences, I've selected an exceptional room`,
            `I have just the right room in mind for you`,
            `Allow me to present a room I think you'll find perfect`,
          ];
    const opening = pick(openingPool);

    const roomLine = `Room ${room.roomNumber} — a ${typeName} on Floor ${room.floor}, ${room.size} m², accommodating up to ${room.capacity} guest${room.capacity > 1 ? "s" : ""}`;

    const highlights = [];
    if (view) highlights.push(`${view} views`);
    if (hasBalcony)
      highlights.push(
        `a private ${ft.rooftop_garden ? "rooftop garden" : ft.private_terrace ? "terrace" : "balcony"}`,
      );
    if (hasJacuzzi) highlights.push("a spa bathroom with private jacuzzi");
    if (hasPool)
      highlights.push(
        `a private ${ft.infinity_pool ? "infinity pool" : "pool"}`,
      );
    if (hasButler) highlights.push("dedicated butler service");
    if (hasOffice) highlights.push("a private work suite");
    if (hasCinema) highlights.push("an in-room cinema");

    let out = `${opening} — ${roomLine}.\n\n`;

    if (highlights.length) {
      const hl =
        highlights.length === 1
          ? highlights[0]
          : highlights.slice(0, -1).join(", ") + " and " + highlights.at(-1);
      out += `Highlights include ${hl}.`;
    }
    if (svcs.length) out += ` Services included: ${svcs.join(", ")}.`;

    const priceNote =
      budget && room.currentPrice <= budget
        ? ` At $${room.currentPrice}/night — well within your budget`
        : ` Priced at $${room.currentPrice}/night`;
    out += `${priceNote}${rating >= 4.5 ? `, rated ${rating}/5.0 by guests` : ""}.`;

    if (alternatives?.length) {
      const altStr = alternatives
        .slice(0, 2)
        .map(
          (a) =>
            `Room ${a.roomNumber} (${TYPENAME[a.type]?.en || a.type}, $${a.currentPrice}/night)`,
        )
        .join(" and ");
      out += `\n\nAlternatives worth considering: ${altStr}.`;
    }

    out += pick([
      `\n\nShall I reserve Room ${room.roomNumber} for you, or would you like to explore other options?`,
      `\n\nWould you like to proceed with this reservation?`,
      `\n\nThis room is available now — shall I arrange your booking?`,
    ]);
    return out;
  }

  // ── Arabic ───────────────────────────────────────────────────
  if (lang === "ar") {
    const openings = isAlternative
      ? [
          `إليكم خياراً جديداً أعتقد أنه سيعجبكم`,
          `اسمحوا لي أن أقدّم لكم بديلاً قد يناسبكم أكثر`,
          `وجدتُ لكم خيارات جديدة رائعة`,
        ]
      : {
          honeymoon: [
            `وجدتُ لكما الملاذ المثالي لشهر العسل الذي لن يُنسى`,
            `لقصة حب تستحق خلفية أسطورية`,
          ],
          business: [
            `إليكم الإقامة الأمثل التي تجمع بين الرقي المطلق والإنتاجية`,
            `اخترتُ لكم الغرفة المثالية لزيارة عمل لا تُنسى`,
          ],
          family: [
            `اخترتُ لعائلتكم الكريمة هذا الملاذ الفسيح`,
            `مساحة رحبة تجمع بين الراحة وأجواء الأسرة`,
          ],
          vip: [
            `ضيوفنا المميزون يستحقون أرقى ما في الفندق`,
            `لا شيء يليق بكم إلا الأفضل على الإطلاق`,
          ],
          vacation: [
            `اخترتُ لإجازتكم هذه الغرفة الاستثنائية`,
            `هذا هو المكان الذي تتحوّل فيه الراحة إلى تجربة فنية`,
          ],
        };
    const openingPool = isAlternative
      ? openings
      : purpose && openings[purpose]
        ? openings[purpose]
        : [
            `بناءً على تفضيلاتكم، اخترتُ لكم هذه الغرفة الاستثنائية`,
            `لديّ بالضبط ما تبحثون عنه`,
            `اسمحوا لي أن أقدّم لكم غرفة أعتقد أنها ستكون مثالية`,
          ];
    const opening = pick(openingPool);

    const roomLine = `الغرفة رقم ${room.roomNumber} — ${typeName} في الطابق ${room.floor}، مساحتها ${room.size} م²، تتسع لـ ${room.capacity} ضيف`;

    const highlights = [];
    if (view) highlights.push(`إطلالة ${view}`);
    if (hasBalcony)
      highlights.push(
        ft.rooftop_garden
          ? "حديقة على السطح"
          : ft.private_terrace
            ? "تراس خاص"
            : "شرفة خاصة",
      );
    if (hasJacuzzi) highlights.push("حمام سبا مع جاكوزي خاص");
    if (hasPool)
      highlights.push(ft.infinity_pool ? "مسبح لانهائي خاص" : "مسبح خاص");
    if (hasButler) highlights.push("خدمة بتلر شخصي");
    if (hasOffice) highlights.push("مكتب عمل خاص");
    if (hasCinema) highlights.push("قاعة سينما خاصة");

    let out = `${opening} — ${roomLine}.\n\n`;
    if (highlights.length) out += `أبرز مميزاتها: ${highlights.join("، ")}.`;
    if (svcs.length) out += ` الخدمات المشمولة: ${svcs.join("، ")}.`;

    const priceNote =
      budget && room.currentPrice <= budget
        ? ` السعر $${room.currentPrice} في الليلة — ضمن ميزانيتكم تماماً`
        : ` السعر $${room.currentPrice} في الليلة`;
    out += `${priceNote}${rating >= 4.5 ? `، تقييم الضيوف ${rating}/5` : ""}.`;

    if (alternatives?.length) {
      const altStr = alternatives
        .slice(0, 2)
        .map(
          (a) =>
            `الغرفة ${a.roomNumber} (${TYPENAME[a.type]?.ar || a.type}، $${a.currentPrice}/ليلة)`,
        )
        .join(" و");
      out += `\n\nبدائل متاحة: ${altStr}.`;
    }

    out += pick([
      `\n\nهل تودّون حجز الغرفة ${room.roomNumber}، أم تريدون الاطلاع على المزيد من الخيارات؟`,
      `\n\nهل أتابع معكم إجراءات الحجز؟`,
      `\n\nالغرفة متاحة الآن — هل تودّون المتابعة؟`,
    ]);
    return out;
  }

  // ── Turkish ──────────────────────────────────────────────────
  const openings = isAlternative
    ? [
        `İşte beğeneceğinizi düşündüğüm taze bir seçenek`,
        `Size daha da uygun olabilecek bir alternatif sunmama izin verin`,
        `Değerlendirmeniz için harika bir başka seçenek buldum`,
      ]
    : {
        honeymoon: [
          `Balayınız için unutulmaz bir ortam buldum`,
          `Bu özel anı taçlandıracak mükemmel odayı sunmama izin verin`,
        ],
        business: [
          `İş seyahatiniz için konforu ve verimliliği bir arada sunan ideal oda`,
          `Kusursuz bir iş konaklama deneyimi için en iyi seçim`,
        ],
        family: [
          `Aileniz için geniş ve konforlu bir seçim yaptım`,
          `Tüm ailenizin kendini evinde hissedeceği mükemmel bir oda`,
        ],
        vip: [
          `En seçkin misafirlerimize yakışan en prestijli odamız`,
          `Yalnızca en iyisi — sunmama izin verin`,
        ],
        vacation: [
          `Tatiliniz için ideal odayı seçtim`,
          `Dinlenmenin bir sanata dönüştüğü yer`,
        ],
      };
  const openingPool = isAlternative
    ? openings
    : purpose && openings[purpose]
      ? openings[purpose]
      : [
          `Tercihlerinize göre mükemmel bir oda seçtim`,
          `Tam aradığınız odayı buldum`,
          `Size mükemmel bulduğum bir odayı sunmama izin verin`,
        ];
  const opening = pick(openingPool);

  const roomLine = `Oda ${room.roomNumber} — ${room.floor}. Kattaki ${typeName}, ${room.size} m², ${room.capacity} misafir kapasiteli`;

  const highlights = [];
  if (view) highlights.push(`${view} manzarası`);
  if (hasBalcony)
    highlights.push(
      `özel ${ft.rooftop_garden ? "çatı bahçesi" : ft.private_terrace ? "teras" : "balkon"}`,
    );
  if (hasJacuzzi) highlights.push("jakuzili özel spa banyosu");
  if (hasPool)
    highlights.push(`özel ${ft.infinity_pool ? "sonsuzluk havuzu" : "havuz"}`);
  if (hasButler) highlights.push("kişisel butler hizmeti");
  if (hasOffice) highlights.push("özel çalışma ofisi");
  if (hasCinema) highlights.push("özel sinema odası");

  let out = `${opening} — ${roomLine}.\n\n`;
  if (highlights.length)
    out += `Öne çıkan özellikler: ${highlights.join(", ")}.`;
  if (svcs.length) out += ` Dahil hizmetler: ${svcs.join(", ")}.`;

  const priceNote =
    budget && room.currentPrice <= budget
      ? ` $${room.currentPrice}/gece — bütçenize tam uygun`
      : ` $${room.currentPrice}/gece`;
  out += `${priceNote}${rating >= 4.5 ? `, misafir puanı ${rating}/5.0` : ""}.`;

  if (alternatives?.length) {
    const altStr = alternatives
      .slice(0, 2)
      .map(
        (a) =>
          `Oda ${a.roomNumber} (${TYPENAME[a.type]?.tr || a.type}, $${a.currentPrice}/gece)`,
      )
      .join(" ve ");
    out += `\n\nAlternatifler: ${altStr}.`;
  }

  out += pick([
    `\n\nOda ${room.roomNumber}'i rezerve etmemi ister misiniz?`,
    `\n\nBu rezervasyonu tamamlamamı ister misiniz?`,
    `\n\nOda şu an müsait — rezervasyona devam edeyim mi?`,
  ]);
  return out;
}

// ── No-More-Rooms Message ────────────────────────────────────────
function buildNoMoreRoomsMessage(lang) {
  if (lang === "ar") {
    return pick([
      `لقد عرضتُ عليكم جميع الغرف المتاحة المطابقة لتفضيلاتكم. هل تودّون توسيع المعايير — مثل رفع الميزانية قليلاً أو تعديل عدد الضيوف — لأتمكن من تقديم خيارات إضافية؟`,
      `استعرضنا جميع الغرف المتاحة التي تتناسب مع احتياجاتكم. هل يمكنني مساعدتكم في تعديل بعض المعايير لإيجاد خيارات جديدة؟`,
    ]);
  }
  if (lang === "tr") {
    return pick([
      `Tercihlerinize uyan tüm müsait odaları gösterdik. Bütçenizi biraz yükseltmek veya misafir sayısını değiştirmek gibi kriterlerinizi genişletmek ister misiniz?`,
      `Uygun kriterlerinizdeki tüm odaları inceledik. Farklı seçenekler sunabilmem için arama kriterlerinizi güncelleyebiliriz.`,
    ]);
  }
  return pick([
    `It looks like I've shown you all available rooms matching your preferences. Would you like to adjust your criteria — perhaps a slightly higher budget or different room type — so I can find more options for you?`,
    `We've explored all the available rooms that fit your requirements. Shall I broaden the search with different criteria?`,
  ]);
}

// ── Service Response Builder ─────────────────────────────────────
// serviceIntent: fine-grained intent from detectServiceIntent()
function buildServiceResponse(serviceIntent, lang, needs) {
  const L = lang === "ar" ? "ar" : lang === "tr" ? "tr" : "en";

  const R = {
    services: {
      en: [
        `At Presidential Luxury Hotel, every aspect of your stay is elevated to an art form. We offer our Michelin-starred restaurant Le Palais helmed by Chef Jean-Louis Moreau, a full Spa & Wellness Centre on Floor 9 with hammam and hydrotherapy, a rooftop infinity pool, state-of-the-art fitness facilities, personalised butler service, private chauffeur, event planning, helicopter transfers, and much more. What can I arrange for you today?`,
        `Our world-class services span dining at the Michelin-starred Le Palais, rejuvenating spa treatments on Floor 9, the rooftop infinity pool, a 24-hour fitness centre, butler service, private drivers in vehicles ranging from executive sedans to limousines, event coordination, and helicopter transfers from Floor 11. Which experience would you like to explore?`,
      ],
      ar: [
        `في فندق بريزيدنشيال، كل تفصيل من تفاصيل إقامتكم يُرفع إلى مستوى الفن. نقدّم مطعم "لو باليه" الحاصل على نجوم ميشلان بقيادة الشيف جان-لويس مورو، ومركز الصحة والعافية الفاخر في الطابق التاسع مع الحمام التركي والعلاج المائي، والمسبح اللانهائي على السطح، ومركز اللياقة المتطور، وخدمة البتلر الشخصية، والسائق الخاص، وتنظيم الفعاليات، والنقل بالمروحية. بأيّ خدمة تودّون البدء؟`,
        `خدماتنا تشمل مطعم "لو باليه" ذو النجوم الميشلانية، وعلاجات السبا الاسترخائية في الطابق التاسع، والمسبح اللانهائي على السطح، ومركز اللياقة على مدار الساعة، وخدمة البتلر، والسيارات الفاخرة بمختلف فئاتها، وتنسيق الفعاليات، والنقل بالمروحية من الطابق الحادي عشر. ما الذي يثير اهتمامكم؟`,
      ],
      tr: [
        `Presidential Lüks Otelinde her an sanat seviyesine yükseltilmiştir. Michelin yıldızlı Le Palais restoranımız, 9. Kattaki Spa & Wellness Merkezimiz hammam ve hidroterapi dahil, çatıdaki sonsuzluk havuzumuz, 24 saat fitness merkezimiz, butler hizmetimiz, özel şoför, etkinlik planlama ve 11. Kattan helikopter transferleri sunulmaktadır. Bugün size ne ayarlayayım?`,
        `Hizmetlerimiz arasında Michelin yıldızlı Le Palais restoranı, 9. Kattaki tam hizmet spa, çatı sonsuzluk havuzu, fitness merkezi, kişisel butler, lüks araç filosu, etkinlik koordinasyonu ve helikopter transferleri yer almaktadır. Hangi deneyimi keşfetmek istersiniz?`,
      ],
    },
    restaurant: {
      en: [
        `Le Palais is our crown jewel — a three Michelin-starred restaurant led by Executive Chef Jean-Louis Moreau, Maître Ouvrier de France 2018. The menu celebrates French haute cuisine: starters from $18 to $42 (Seared Scallops $40, Lobster Bisque $32, Foie Gras Terrine $42), magnificent mains from $52 to $165 (A5 Wagyu Ribeye $165, Butter-Poached Lobster $95, Beef Wellington $88, Truffle Risotto $52), and refined desserts from $17. We also offer casual dining, a rooftop bar, and 24/7 in-room dining. Shall I arrange a reservation this evening?`,
        `Our restaurant Le Palais has earned three Michelin Stars under Chef Jean-Louis Moreau. Whether you favour the Wagyu Ribeye at $165 or the delicate Chilean Sea Bass at $72, every dish is a masterpiece. Starters from $18, desserts from $17 — and an exceptional wine list featuring Château Margaux 2015 at $850 per bottle. Casual dining, the rooftop bar, and 24/7 room service are also available. Would you like a table reservation?`,
      ],
      ar: [
        `"لو باليه" هو جوهرة فندقنا الحاصل على ثلاث نجوم ميشلان بقيادة الشيف التنفيذي جان-لويس مورو. القائمة: مقبّلات من $18 إلى $42 (اسكالوب محمص $40، شوربة جراد البحر $32، تيرين فوا غرا $42)، أطباق رئيسية من $52 إلى $165 (واغيو A5 $165، جراد البحر بالزبدة $95، بيف ويلينغتون $88)، وحلويات من $17. نوفّر أيضاً مطعماً غير رسمي وبار على السطح وخدمة غرف على مدار الساعة. هل تودّون حجز طاولة؟`,
        `مطعم "لو باليه" ذو الثلاث نجوم الميشلانية. من شرائح الواغيو A5 بـ$165 إلى الباس التشيلي بـ$72، كل طبق تحفة فنية. قائمة نبيذ استثنائية تشمل شاتو مارجو 2015 بـ$850 للزجاجة. هل أرتّب لكم حجزاً؟`,
      ],
      tr: [
        `Le Palais, Baş Şef Jean-Louis Moreau liderliğinde üç Michelin Yıldızı kazanmış restoranımızdır. Menü: $18–$42 başlangıçlar (Taraklar $40, Istakoz Çorbası $32, Foie Gras $42), $52–$165 ana yemekler (A5 Wagyu $165, Istakoz $95, Beef Wellington $88) ve $17'den tatlılar. Çatı barı ve 24 saat oda servisi de mevcut. Bu akşam için rezervasyon ayarlayayım mı?`,
        `Üç Michelin Yıldızlı Le Palais'da her yemek bir başyapıt. Wagyu Bonfile $165, Tereyağlı Istakoz $95, tatlılar $17'den. Olağanüstü şarap listemiz Château Margaux 2015'i $850'den sunuyor. Rezervasyon ister misiniz?`,
      ],
    },
    spa: {
      en: [
        `Our Spa & Wellness Centre on Floor 9 is open daily 9:00 AM–7:00 PM, offering a full spectrum of treatments: Relaxation Massage $150, Deep Tissue $180, Hot Stone Therapy $200, Aromatherapy $170, and our Couples Massage at $280 — available in 30, 60, 90, or 120-minute sessions. Choose a treatment room, private luxury suite (+$75), or in-room service (+$50). Facilities include a Turkish hammam, hydrotherapy pools, cryotherapy, sauna, steam room, and float tank. When would you like to schedule?`,
        `Floor 9 is dedicated entirely to wellness and restoration. Treatments include Relaxation Massage ($150), Deep Tissue ($180), Hot Stone ($200), Aromatherapy ($170), and Couples Massage ($280) — all in 30 to 120-minute durations. Our facilities feature a Turkish hammam, hydrotherapy, cryotherapy, sauna, steam room, and float tank. Shall I reserve a treatment for you?`,
      ],
      ar: [
        `مركز الصحة والعافية في الطابق التاسع يعمل يومياً من 9:00 صباحاً حتى 7:00 مساءً. علاجاتنا: مساج الاسترخاء $150، أنسجة عميقة $180، أحجار ساخنة $200، علاج بالروائح $170، مساج الثنائي $280 — بمدد 30 أو 60 أو 90 أو 120 دقيقة. المرافق: حمام تركي، علاج مائي، كريوثيرابي، ساونا، حجرة بخار، خزان عوم. متى تودّون الحجز؟`,
        `الطابق التاسع مخصص بالكامل للراحة والتجديد. علاجاتنا من $150 للاسترخاء إلى $280 لمساج الثنائي، بمدد من 30 إلى 120 دقيقة. يتوفر الحمام التركي والعلاج المائي والساونا وحجرة البخار. هل أحجز لكم جلسة؟`,
      ],
      tr: [
        `9. Kattaki Spa & Wellness Merkezimiz her gün 09:00–19:00 açık. Gevşeme Masajı $150, Derin Doku $180, Sıcak Taş $200, Aromaterapi $170, Çift Masajı $280; 30–120 dakika seanslar. Türk hamamı, hidroterapi, kriyoterapi, sauna, buhar odası ve float tank. Ne zaman randevu almak istersiniz?`,
        `9. Kat tamamen wellness'e ayrılmıştır. $150–$280 arası masaj seçenekleri, 30–120 dakika süreler, Türk hamamı, sauna ve float tank. Tedavi odası, özel süit (+$75) veya oda servisi (+$50). Randevunuzu ayarlamamı ister misiniz?`,
      ],
    },
    gym: {
      en: [
        `Our Fitness Centre is open 6:00 AM–10:00 PM daily with premium cardio and strength equipment. Passes: day $50, 3 days $125, week $250, 2 weeks $400, monthly $600. Personal trainers available at +$80/day with customised programmes for any goal. Morning, midday, afternoon, and evening sessions available. Shall I arrange a membership?`,
        `The fitness centre operates 16 hours a day. Passes range from $50/day to $600/month. Certified personal trainers (+$80/day) offer targeted programmes for fat loss, muscle building, endurance, or rehab. Would you like to start with a day pass or a personalised programme?`,
      ],
      ar: [
        `مركز اللياقة مفتوح يومياً من 6:00 صباحاً حتى 10:00 مساءً بأحدث الأجهزة. الاشتراكات: يوم $50، ثلاثة أيام $125، أسبوع $250، أسبوعان $400، شهر $600. مدربون شخصيون بـ$80 يومياً. هل تودّون ترتيب اشتراك؟`,
        `يعمل مركز اللياقة 16 ساعة يومياً. الاشتراكات من $50 يومياً إلى $600 شهرياً. المدربون الشخصيون (+$80 يومياً) يقدّمون برامج مخصصة لأي هدف. أيّ خيار يناسبكم؟`,
      ],
      tr: [
        `Fitness Merkezimiz 06:00–22:00 açık, üst düzey ekipmanlar mevcut. Günlük $50, 3 günlük $125, haftalık $250, 2 haftalık $400, aylık $600. Kişisel antrenörler +$80/gün. Üyelik ayarlamamı ister misiniz?`,
        `16 saat açık fitness merkezimiz; $50/günlük ile $600/aylık arası üyelik seçenekleri. Kişisel antrenörler +$80/gün. Ne tür antrenman hedefliyorsunuz?`,
      ],
    },
    pool: {
      en: [
        `Our rooftop infinity pool offers breathtaking panoramic views, open daily 6:00 AM–8:00 PM with Night Swim at 8:00 PM. Shared access $40/hour; exclusive private pool $120/hour, with half-day and full-day packages. Swimming coaches available at $60/session. Water temperature options: 24°C, 28°C, or 32°C — towels and refreshments included. Shall I reserve your pool time?`,
        `The rooftop infinity pool is open 6 AM to 8 PM daily, with a Night Swim event at 8 PM. Shared $40/hour, private $120/hour. Swim coaches $60/session. Your choice of water temperature: 24°C, 28°C, or 32°C. Towels and refreshments always included. When would you like to swim?`,
      ],
      ar: [
        `مسبحنا اللانهائي على السطح يوفّر إطلالات بانورامية مذهلة ويعمل يومياً من 6:00 صباحاً حتى 8:00 مساءً مع سباحة ليلية خاصة. الجلسة المشتركة $40 للساعة والمسبح الخاص $120 للساعة. مدرب سباحة بـ$60 للجلسة. درجات الحرارة: 24 أو 28 أو 32 درجة مئوية. هل تودّون الحجز؟`,
        `مسبح لانهائي على السطح مفتوح من 6:00 إلى 8:00 مساءً مع فعالية السباحة الليلية. $40 للجلسة المشتركة و$120 للمسبح الخاص. مدربو السباحة بـ$60 للجلسة. متى تودّون الحجز؟`,
      ],
      tr: [
        `Çatıdaki sonsuzluk havuzumuz panoramik manzaralarıyla büyüleyici, 06:00–20:00 açık, Gece Yüzmesi 20:00'de. Ortak $40/saat, özel $120/saat; yarım gün ve tam gün paketleri. Yüzme koçu $60/seans. Su sıcaklığı: 24°C, 28°C veya 32°C — havlu ve ikram dahil. Ne zaman rezerve edeyim?`,
        `Çatı sonsuzluk havuzu sabah 6'dan akşam 8'e açık, Gece Yüzmesi 8'de. $40/saat ortak, $120/saat özel. Koç $60/seans. Ne zaman yüzmek istersiniz?`,
      ],
    },
    butler: {
      en: [
        `Our butler service operates daily 7:00 AM–8:00 PM across three tiers: Basic Assistance $200 (2 hours), Premium Butler $300, and the Exclusive Concierge Experience $400. Full-day packages at 4× base rate. Your butler handles unpacking, wardrobe styling, restaurant reservations, event tickets, shopping, errands, travel, meeting coordination, and any special occasion. Butlers speak 9 languages including English, Arabic, and Turkish. Shall I arrange this for you?`,
        `From unpacking your luggage to coordinating a private dinner under the stars, our butler covers every detail. Three tiers: Basic $200 (2 hrs), Premium $300, Exclusive $400. Our multilingual butlers speak English, Arabic, Turkish, French, Spanish, German, and more. What can your butler do for you?`,
      ],
      ar: [
        `خدمة البتلر المتميزة يومياً من 7:00 صباحاً حتى 8:00 مساءً بثلاثة مستويات: المساعدة الأساسية $200 لساعتين، البتلر المتميز $300، وتجربة الكونسيرج الحصرية $400. باقات ليوم كامل بـ4 أضعاف السعر الأساسي. البتلر يتولى فتح الحقائب وتنسيق الملابس والحجوزات والتسوق والسفر. يتحدث البتلرون 9 لغات. كيف أرتّب لكم هذه الخدمة؟`,
        `من فتح حقائبكم إلى تنظيم عشاء خاص تحت النجوم، بتلركم يتولى كل التفاصيل. ثلاثة مستويات: الأساسي $200 (ساعتان)، المتميز $300، الحصري $400. ما الذي يمكن لبتلركم فعله لكم؟`,
      ],
      tr: [
        `Butler hizmetimiz her gün 07:00–20:00 üç kademede: Temel $200 (2 saat), Premium $300, Özel $400; tam gün 4× baz ücret. Bavul açma, gardrob düzenleme, rezervasyonlar, alışveriş ve özel organizasyonlar dahil. 9 dil konuşan butlerlarımız. Bu hizmeti ayarlamamı ister misiniz?`,
        `Bagajınızdan yıldızlar altında özel akşam yemeğine her şeyle ilgilenir. Temel $200, Premium $300, Özel $400. Çok dilli butler hizmeti için ne düşünüyorsunuz?`,
      ],
    },
    driver: {
      en: [
        `Our private chauffeur service is available 24/7. Airport transfers from $100, city tours from $200, full-day hire $400, hourly $50/hour. Vehicle options: Executive Sedan, Luxury SUV (+30%), Mercedes S-Class (2×), or Limousine (3×). Multilingual drivers, child seats, and luggage assistance always available. Shall I arrange a vehicle for you?`,
        `Whatever your destination, our private drivers are available at any hour. $100 airport transfers, $200 city tours, $400 full-day, $50/hour short trips. Executive Sedan, Luxury SUV, Mercedes S-Class, or Limousine. When do you need the car?`,
      ],
      ar: [
        `خدمة السائق الخاص متاحة على مدار الساعة. النقل من وإلى المطار من $100، جولات المدينة من $200، يوم كامل $400، بالساعة $50. أسطول يشمل السيدان التنفيذية والدفع الرباعي (+30%) ومرسيدس S (2×) والليموزين (3×). متى تحتاجون السيارة؟`,
        `سائقونا الخاصون في خدمتكم على مدار الساعة. $100 مطار، $200 جولة، $400 يوم كامل. متى تودّون الترتيب؟`,
      ],
      tr: [
        `Özel şoför hizmetimiz 7/24. Havalimanı $100'dan, şehir turu $200'den, tam gün $400, saatlik $50. Executive Sedan, Lüks SUV (+%30), Mercedes S-Class (2×), Limuzin (3×). Ne zaman lazım?`,
        `Her destinasyon için 7/24 özel şoför. $100 havalimanı, $200 şehir turu, $400 tam gün. Araç ne zaman gerekli?`,
      ],
    },
    checkin: {
      en: [
        `Check-in begins at 3:00 PM and check-out is by 12:00 noon. Early check-in and late check-out are available upon request, subject to availability — simply share your schedule and we will do everything possible to accommodate you. Suite and Penthouse guests enjoy private, expedited check-in. Is there anything I can prepare for your arrival?`,
        `Standard check-in is 3:00 PM, check-out by noon. We accommodate early arrivals and late departures whenever possible. Suite and Penthouse guests receive private priority check-in. What can I prepare ahead of your arrival?`,
      ],
      ar: [
        `يبدأ تسجيل الوصول من 3:00 مساءً وتسجيل المغادرة بحلول 12:00 ظهراً. الوصول المبكر والمغادرة المتأخرة متاحان حسب التوفر. نزلاء الأجنحة والبنتهاوس يتمتعون بتسجيل وصول خاص وسريع. هل هناك شيء أودّ تحضيره؟`,
        `تسجيل الوصول من 3:00 مساءً وتسجيل المغادرة بحلول الظهر. ما عليكم إلا إخبارنا بجدولكم. ما الذي أحضّره لكم؟`,
      ],
      tr: [
        `Giriş 15:00, çıkış 12:00. Erken giriş ve geç çıkış oda müsaitliğine bağlı talep edilebilir. Süit ve Penthouse misafirleri özel check-in hizmetinden yararlanır. Varışınız için hazırlayabileceğim bir şey var mı?`,
        `Standart giriş 15:00, çıkış öğlen 12:00. Erken giriş ve geç çıkış mümkün olan durumlarda sağlanır. Varışınız için ne hazırlayayım?`,
      ],
    },
    policies: {
      en: [
        `Our key policies: cancellation is free up to 48 hours before arrival. Pets are welcome with advance notice, subject to a small cleaning fee. All guests enjoy complimentary valet and self-parking. First-time guests receive a 20% discount; returning guests enjoy 10% off. Airport transport is complimentary via shuttle; VIP guests may arrange a private helicopter. Which policy would you like more detail on?`,
        `Free cancellation up to 48 hours before arrival. Pets welcome with advance notice. Complimentary valet parking for all guests. 20% first-visit discount, 10% loyalty discount. Complimentary shuttle from the airport; helicopter transfers for VIP guests. Is there a specific policy I can clarify?`,
      ],
      ar: [
        `سياساتنا الرئيسية: الإلغاء مجاني حتى 48 ساعة قبل الوصول. الحيوانات الأليفة مرحّب بها مع إشعار مسبق. جميع الضيوف يستفيدون من الفاليه والمواقف المجانية. خصم 20% للضيوف الجدد و10% للعائدين. النقل من المطار مجاني. هل تودّون توضيح سياسة بعينها؟`,
        `إلغاء مجاني حتى 48 ساعة. حيوانات أليفة مرحّب بها. مواقف مجانية لجميع الضيوف. هل هناك سياسة تودّون توضيحها؟`,
      ],
      tr: [
        `Varıştan 48 saat öncesine kadar ücretsiz iptal. Evcil hayvanlar küçük temizlik ücreti ile kabul edilir. Tüm misafirler için ücretsiz vale park. İlk ziyaret %20, sadakat %10 indirim. Ücretsiz havalimanı servisi. Belirli bir politika hakkında bilgi almak ister misiniz?`,
        `48 saate kadar ücretsiz iptal, evcil hayvan kabul, ücretsiz vale park, %20 ilk ziyaret indirimi. Açıklamak istediğiniz bir politika var mı?`,
      ],
    },
    contact: {
      en: [
        `You can reach our team at any time — phone: +1 (555) 123-4567, email: reservations@plhms.luxury. Our concierge desk is staffed 24/7 in the main lobby on Floor 0. Is there something I can help you with directly right now?`,
        `Reservations team available around the clock: +1 (555) 123-4567 or reservations@plhms.luxury. The concierge desk at Floor 0 is staffed 24 hours a day. How may I assist you further?`,
      ],
      ar: [
        `تواصلوا مع فريقنا في أي وقت: +1 (555) 123-4567 أو reservations@plhms.luxury. مكتب الكونسيرج متاح على مدار الساعة في البهو الرئيسي. كيف أساعدكم الآن؟`,
        `فريق الحجوزات على مدار الساعة: +1 (555) 123-4567 أو reservations@plhms.luxury. كيف أساعدكم مباشرةً؟`,
      ],
      tr: [
        `Ekibimize 7/24: +1 (555) 123-4567 veya reservations@plhms.luxury. Zemin Kattaki concierge masası 24 saat açık. Nasıl yardımcı olabilirim?`,
        `Rezervasyon ekibimiz 7/24: +1 (555) 123-4567 | reservations@plhms.luxury. Size başka nasıl yardımcı olabilirim?`,
      ],
    },
    prices: {
      en: [
        `Our pricing reflects every level of luxury. Rooms: $150–$270/night (Standard) up to $6,000/night (Penthouse). Spa from $150. Gym day pass $50, pool from $40/hour, butler from $200, airport transfer from $100. Le Palais starters from $18, mains from $52. Which service would you like full pricing details for?`,
        `Rates at a glance: Rooms from $150 (Standard) to $6,000 (Penthouse) per night. Spa from $150, gym from $50/day, pool from $40/hour, butler from $200, airport transfer from $100. Restaurant starters from $18, mains from $52 to $165. What else can I detail for you?`,
      ],
      ar: [
        `أسعارنا تعكس كل مستوى من مستويات الفخامة: الغرف من $150 قياسي حتى $6,000 بنتهاوس. السبا من $150، الصالة $50 يومياً، المسبح من $40/ساعة، البتلر من $200، نقل المطار من $100. المطعم: مقبّلات من $18، أطباق رئيسية من $52. أيّ خدمة تودّون معرفة أسعارها؟`,
        `نظرة عامة: الغرف من $150 إلى $6,000 ليلياً. السبا من $150، المسبح من $40/ساعة، البتلر من $200. ماذا تودّون معرفة المزيد عنه؟`,
      ],
      tr: [
        `Fiyatlar: Odalar $150–$6.000/gece. Spa $150'den, spor günlük $50, havuz $40/satten, butler $200'den, transfer $100'dan. Le Palais başlangıçlar $18'den, ana yemekler $52'den. Hangi hizmet için detaylı fiyat istersiniz?`,
        `Genel fiyat rehberi: Standart $150, Penthouse $6.000. Spa $150'den, havuz $40/saatten, butler $200'den. Daha fazla bilgi almak istediğiniz hizmet?`,
      ],
    },
    booking: {
      en: [
        `Booking a room is simple. You can reserve directly through our website, call us at +1 (555) 123-4567, or email reservations@plhms.luxury. If you've found a room you love, just click the "Reserve This Room" button and I'll guide you through the rest. Would you like me to help you find the perfect room first?`,
        `To reserve a room, click the "Reserve This Room" button on any room I recommend, or contact our team at +1 (555) 123-4567 or reservations@plhms.luxury. Our reservations team is available 24/7 and we offer free cancellation up to 48 hours before arrival. Shall I find you the ideal room to book?`,
      ],
      ar: [
        `حجز الغرفة سهل جداً. يمكنكم الحجز عبر الموقع مباشرةً أو الاتصال على +1 (555) 123-4567 أو مراسلتنا على reservations@plhms.luxury. إذا وجدتم غرفة تعجبكم، اضغطوا على "احجز هذه الغرفة" وسأوجّهكم لبقية الخطوات. هل تودّون البحث عن الغرفة المثالية أولاً؟`,
        `للحجز، اضغطوا على "احجز هذه الغرفة" في أي غرفة أقترحها، أو تواصلوا معنا على +1 (555) 123-4567. إلغاء مجاني حتى 48 ساعة. هل أساعدكم في إيجاد الغرفة المثالية؟`,
      ],
      tr: [
        `Rezervasyon yapmak kolay. Websitemizdeki "Bu Odayı Rezerve Et" düğmesine tıklayın ya da +1 (555) 123-4567'yi arayın veya reservations@plhms.luxury'a e-posta gönderin. 48 saate kadar ücretsiz iptal. Önce size ideal odayı bulayım mı?`,
        `Herhangi bir önerilen odadaki "Rezerve Et" düğmesiyle veya +1 (555) 123-4567 ile 7/24 rezervasyon yapılabilir. Önce mükemmel odanızı bulalım mı?`,
      ],
    },
    general: {
      en: [
        `Welcome to Presidential Luxury Hotel! I'm Alexandre, your personal concierge. Whether it's rooms, dining at Le Palais, spa treatments, pool time, fitness, butler service, or private transport — I'm here to make every moment of your stay extraordinary. How may I assist you today?`,
        `Good to hear from you. I'm Alexandre, concierge of Presidential Luxury Hotel — here for everything: room reservations, restaurant bookings, spa, fitness, pool, butler, driver, or any question about the hotel. What would you like to know?`,
        `Hello and welcome to PLHMS. I'm Alexandre, your personal concierge, here around the clock. From room reservations to private helicopter transfers, consider it arranged. How may I help?`,
      ],
      ar: [
        `أهلاً وسهلاً بكم في فندق بريزيدنشيال! أنا ألكسندر، كونسيرجكم الشخصي. سواء أردتم حجز غرفة أو طاولة في "لو باليه" أو جلسة سبا أو سيارة خاصة — أنا هنا لجعل كل لحظة من إقامتكم استثنائية. كيف أساعدكم اليوم؟`,
        `مرحباً بكم في فندق بريزيدنشيال. أنا ألكسندر، في خدمتكم على مدار الساعة. من الغرف والمطاعم والسبا إلى السيارات الفاخرة والمروحيات الخاصة — كل شيء ممكن هنا. كيف أجعل إقامتكم لا تُنسى؟`,
      ],
      tr: [
        `Presidential Lüks Oteline hoş geldiniz! Ben Alexandre, kişisel conciergenizim. Oda, yemek, spa, havuz, fitness, butler veya özel araç — her konuda yardımcı olmak için buradayım. Bugün nasıl yardımcı olabilirim?`,
        `Merhaba, Presidential Lüks Oteli'ne hoş geldiniz. Ben Alexandre — her ihtiyacınız için 7/24 hizmetinizdeyim. Oda rezervasyonundan özel helikopter transferine kadar her şey ayarlanabilir. Size nasıl yardımcı olabilirim?`,
      ],
    },
  };

  const pool = R[serviceIntent]?.[L] || R.general[L];
  return pick(pool);
}

// ── Experience Add-on ────────────────────────────────────────────
// Appends a curated, multi-domain suggestion (spa + pool + dining) so the
// emergency fallback never collapses an EXPERIENTIAL request into a lone room.
function buildExperienceAddon(needs, lang) {
  const p = needs?.purpose;
  if (lang === "ar") {
    const dining = `عشاء في مطعم "لو باليه" الحائز على نجوم ميشلان`;
    if (p === "business")
      return `\n\nولإقامة عمل سلسة، يمكنني ترتيب سائق خاص (من $100) وتأخير موعد المغادرة، مع ${dining}.`;
    if (p === "family")
      return `\n\nولعائلتكم، أنصح بجلسة في المسبح اللانهائي على السطح (من $40/ساعة) و${dining}.`;
    return `\n\nولتجربة لا تُنسى، أقترح جلسة سبا استرخائية في الطابق التاسع (من $150)، وسباحة في المسبح اللانهائي على السطح (من $40/ساعة)، و${dining}. هل أرتّب لكم هذه التفاصيل؟`;
  }
  if (lang === "tr") {
    const dining = `Michelin yıldızlı Le Palais'de akşam yemeği`;
    if (p === "business")
      return `\n\nKusursuz bir iş konaklaması için özel şoför ($100'dan) ve geç çıkış ayarlayabilir, ${dining} ekleyebilirim.`;
    if (p === "family")
      return `\n\nAileniz için çatıdaki sonsuzluk havuzunu ($40/saatten) ve ${dining} öneririm.`;
    return `\n\nUnutulmaz bir deneyim için 9. Kattaki spa'da rahatlatıcı bir masaj ($150'den), çatı sonsuzluk havuzunda yüzme ($40/saatten) ve ${dining} öneririm. Bunları sizin için ayarlayayım mı?`;
  }
  const dining = `dinner at our Michelin-starred Le Palais`;
  if (p === "business")
    return `\n\nFor a seamless business stay, I can also arrange a private chauffeur (from $100) and late check-out, with ${dining}.`;
  if (p === "family")
    return `\n\nFor the family, I'd add time at the rooftop infinity pool (from $40/hour) and ${dining}.`;
  return `\n\nTo make it truly memorable, I'd pair this with a relaxing spa treatment on Floor 9 (from $150), a swim in our rooftop infinity pool (from $40/hour), and ${dining}. Shall I arrange these details for you?`;
}

// ── Emotion-driven fallback copy ─────────────────────────────────
// When the guest's wish has a clear emotional quality (restorative,
// isolation, silence, healing, narrative, escape), the fallback package
// reads VERY differently from a generic "Curated Luxury Escape" — distinct
// title, suite framing, spa/dining/extras emphasis, and closing line per
// emotion × language. Six emotions × three languages.
const EMOTION_COPY = {
  restorative: {
    titles: {
      en: ["Restorative Retreat", "A Slow Reset", "Quiet Recovery"],
      ar: ["ملاذ الاستعادة", "إعادة شحن هادئة", "تعافٍ بطيء"],
      tr: ["Onarıcı İnziva", "Yavaş Bir Yenilenme", "Sakin Toparlanma"],
    },
    opening: {
      en: "You sound worn — let me make slowness the first thing waiting for you.",
      ar: "يبدو أنكم منهكون — اسمحوا لي أن أجعل البطء أول ما ينتظركم.",
      tr: "Yorgun olduğunuzu duyuyorum — yavaşlığı sizi karşılayan ilk şey yapayım.",
    },
    suite: {
      en: "A quiet, soft-light Deluxe Suite on a high floor — minimal stimulation, layered textures, a bed already turned down.",
      ar: "جناح ديلوكس هادئ بإضاءة خافتة في طابق علوي — تحفيز محدود، أقمشة طبقية، سرير مهيّأ مسبقاً.",
      tr: "Üst kattaki sessiz, yumuşak ışıklı bir Deluxe Süit — asgari uyaran, katmanlı dokular, çoktan hazırlanmış bir yatak.",
    },
    spa: {
      en: "A long 90-minute Hot Stone Therapy ($200) in the Floor 9 sanctuary — paced slowly, music off if you prefer.",
      ar: "علاج الأحجار الساخنة لمدة 90 دقيقة ($200) في ملاذ الطابق التاسع — إيقاع بطيء، موسيقى مطفأة إن أردتم.",
      tr: "9. Kattaki sığınakta 90 dakikalık Sıcak Taş Terapisi ($200) — yavaş tempoda, dilerseniz müziksiz.",
    },
    dining: {
      en: "A light tasting served in-suite tonight — no chef table, no crowd, just nourishment delivered quietly.",
      ar: "تذوّق خفيف يُقدّم في جناحكم الليلة — لا مائدة شيف، لا ازدحام، فقط طعام يصلكم بهدوء.",
      tr: "Bu akşam süitte servis edilen hafif bir tadım — şef sofrası yok, kalabalık yok, sadece sessizce sunulan beslenme.",
    },
    extras: {
      en: "Turndown earlier than usual; a do-not-disturb sign on the door by default; the world can wait until morning.",
      ar: 'تجهيز السرير مبكراً؛ لافتة "عدم الإزعاج" على الباب افتراضياً؛ العالم يمكنه الانتظار حتى الصباح.',
      tr: 'Yataklar normalden erken hazırlanır; varsayılan olarak kapıda "rahatsız etmeyin" işareti; dünya sabaha kadar bekleyebilir.',
    },
    closing: {
      en: "This stay is built around rest. Tell me if you'd like anything softer.",
      ar: "هذه الإقامة مبنية حول الراحة. أخبروني إن أردتم شيئاً أكثر هدوءاً.",
      tr: "Bu konaklama dinlenme etrafında tasarlandı. Daha sakin bir şey isterseniz söyleyin.",
    },
  },
  isolation: {
    titles: {
      en: [
        "Hidden Retreat",
        "A Private Disappearance",
        "Off the Map",
        "The Quiet Floor",
      ],
      ar: ["ملاذ خفي", "اختفاء خاص", "خارج الخريطة", "الطابق الهادئ"],
      tr: [
        "Saklı İnziva",
        "Özel Bir Kayboluş",
        "Haritanın Dışında",
        "Sessiz Kat",
      ],
    },
    opening: {
      en: "Consider yourselves invisible for a few days — here is how the disappearance is arranged.",
      ar: "اعتبروا أنفسكم غير مرئيين لبضعة أيام — إليكم كيفية ترتيب الاختفاء.",
      tr: "Birkaç gün için görünmez olduğunuzu düşünün — kaybolma şöyle ayarlandı.",
    },
    suite: {
      en: "A top-floor corner Suite with no neighbours — your own private wing for the stay.",
      ar: "جناح ركني في الطابق العلوي بدون جيران — جناح خاص بكم طوال الإقامة.",
      tr: "Komşusuz, üst kat köşe Süit — konaklama boyunca size ait özel bir kanat.",
    },
    spa: {
      en: "In-suite spa service — the treatment comes to you; no need to set foot on the spa floor.",
      ar: "خدمة سبا في الجناح — العلاج يأتي إليكم؛ لا داعي لزيارة طابق السبا.",
      tr: "Süit içi spa hizmeti — tedavi size gelir; spa katına gitmenize gerek yok.",
    },
    dining: {
      en: "Every meal served in-suite — no restaurant, no eye contact required, all courses delivered with discretion.",
      ar: "كل الوجبات تُقدّم في الجناح — لا مطعم، لا تواصل بصري، كل الأطباق تصل بتحفّظ تام.",
      tr: "Tüm yemekler süitte servis edilir — restoran yok, göz teması gerekmez, her tabak gizlilikle sunulur.",
    },
    extras: {
      en: "Private check-in at the suite, silent housekeeping (you set the windows when you're out), no calls forwarded.",
      ar: "تسجيل وصول خاص في الجناح، تنظيف صامت (تحددون النوافذ الزمنية أثناء خروجكم)، لا مكالمات تُحوّل إليكم.",
      tr: "Süitte özel giriş, sessiz temizlik (siz dışarıdayken pencereyi siz belirlersiniz), iletilen çağrı yok.",
    },
    closing: {
      en: "For these days, nothing reaches you that you don't invite. Tell me how invisible you want to be.",
      ar: "في هذه الأيام، لا يصلكم شيء لم تستدعوه. أخبروني إلى أي مدى تريدون أن تكونوا غير مرئيين.",
      tr: "Bu günlerde, davet etmediğiniz hiçbir şey size ulaşmaz. Ne kadar görünmez olmak istediğinizi söyleyin.",
    },
  },
  silence: {
    titles: {
      en: ["The Stillness Stay", "A Quiet Sanctuary", "Pause", "The Hush"],
      ar: ["إقامة السكون", "ملاذ الهدوء", "سكينة", "إيقاف"],
      tr: ["Sessizlik Konaklaması", "Sessiz Sığınak", "Duraklama", "Sükunet"],
    },
    opening: {
      en: "For quiet of this kind, the right room matters more than anything else — here is what I have set aside.",
      ar: "لهدوء من هذا النوع، الغرفة المناسبة أهم من أي شيء آخر — إليكم ما خصّصته لكم.",
      tr: "Bu tür bir sessizlik için doğru oda her şeyden önemli — sizin için ayırdığım şu.",
    },
    suite: {
      en: "A high-floor Suite in our quiet wing, facing away from the city — no street sound, no traffic, just sky.",
      ar: "جناح في الطابق العلوي بالجناح الهادئ من الفندق، يطل بعيداً عن المدينة — لا ضجيج شارع، لا حركة مرور، فقط السماء.",
      tr: "Sessiz kanadımızda, şehirden uzaktaki üst kat Süiti — sokak sesi yok, trafik yok, sadece gökyüzü.",
    },
    spa: {
      en: "A silent treatment room on Floor 9 — no music, no chatter; only oil, warmth, and breath.",
      ar: "غرفة علاج صامتة في الطابق التاسع — لا موسيقى، لا أحاديث؛ فقط الزيت والدفء والتنفس.",
      tr: "9. Kattaki sessiz bir tedavi odası — müzik yok, sohbet yok; sadece yağ, sıcaklık ve nefes.",
    },
    dining: {
      en: "A candlelit dinner in-suite, slow service — courses arrive when the previous plate is finished, not on a clock.",
      ar: "عشاء على ضوء الشموع في الجناح، خدمة بطيئة — الأطباق تصل عند الانتهاء من السابق، لا وفق ساعة.",
      tr: "Süitte mum ışığında bir akşam yemeği, yavaş servis — tabaklar saate göre değil, öncekini bitirdiğinizde gelir.",
    },
    extras: {
      en: "Silent housekeeping, a pillow menu, and an optional 10-minute breathing routine prepared for the morning if you'd like.",
      ar: "تنظيف صامت، قائمة وسائد، وروتين تنفس اختياري لعشر دقائق صباحاً إن أردتم.",
      tr: "Sessiz temizlik, yastık menüsü ve isterseniz sabah için hazırlanmış 10 dakikalık opsiyonel bir nefes rutini.",
    },
    closing: {
      en: "There are no notifications on this stay unless you ask for them. Tell me if you want it even quieter.",
      ar: "لا توجد إشعارات في هذه الإقامة إلا بطلبكم. أخبروني إن أردتموها أكثر هدوءاً.",
      tr: "Bu konaklamada siz istemedikçe bildirim yok. Daha da sessiz olmasını istersek söyleyin.",
    },
  },
  healing: {
    titles: {
      en: [
        "Healing Sanctuary",
        "A Wellness Reset",
        "Renewal Retreat",
        "Body & Mind Restoration",
      ],
      ar: [
        "ملاذ الشفاء",
        "إعادة الصحة",
        "استرجاع الجسد والروح",
        "بداية متجددة",
      ],
      tr: [
        "İyileşme Sığınağı",
        "Wellness Sıfırlaması",
        "Yenilenme İnzivası",
        "Beden ve Zihin",
      ],
    },
    opening: {
      en: "Healing is more an arc than a moment — let me sketch the few days I have in mind.",
      ar: "الشفاء قوس لا لحظة — اسمحوا لي أن أرسم الأيام التي أفكر بها.",
      tr: "İyileşme bir andan çok bir yay — aklımdaki birkaç günü çizmeme izin verin.",
    },
    suite: {
      en: "A Deluxe Suite on the wellness floor — close to Floor 9, set up with a yoga mat and an aroma diffuser on arrival.",
      ar: "جناح ديلوكس في طابق العافية — قريب من الطابق التاسع، مع سجادة يوغا وموزع عطر عند الوصول.",
      tr: "Wellness katındaki bir Deluxe Süit — 9. Kata yakın, varışta yoga matı ve aroma difüzörü hazırlanmış.",
    },
    spa: {
      en: "A full circuit across the stay — hammam, hydrotherapy, then a Couples Aromatherapy ($170) — moving from purification to renewal.",
      ar: "دورة كاملة عبر الإقامة — الحمام التركي، العلاج المائي، ثم علاج عطري للثنائي ($170) — من التنقية إلى التجديد.",
      tr: "Konaklama boyunca bir tam devre — hamam, hidroterapi, ardından Çift Aromaterapi ($170) — arınmadan yenilenmeye.",
    },
    dining: {
      en: "A nutrition-focused tasting at Le Palais — Chef Moreau adjusts the menu to your wellness goals, no alcohol unless you ask.",
      ar: 'تذوّق يركّز على التغذية في "لو باليه" — يعدّل الشيف مورو القائمة وفق أهدافكم الصحية، بدون كحول إلا بطلبكم.',
      tr: "Le Palais'de beslenme odaklı bir tadım — Şef Moreau menüyü wellness hedeflerinize göre ayarlar, istemediğiniz sürece alkol yok.",
    },
    extras: {
      en: "A morning yoga session on the terrace, a hydration ritual at arrival, and a cold-plunge slot in the spa each day.",
      ar: "جلسة يوغا صباحية على الشرفة، طقس ترطيب عند الوصول، وموعد للغطس البارد في السبا كل يوم.",
      tr: "Terasta sabah yoga seansı, varışta hidrasyon ritüeli ve spada her gün soğuk dalış için bir slot.",
    },
    closing: {
      en: "This stay is a real reset — body first. Tell me what part of you needs the most attention.",
      ar: "هذه الإقامة إعادة تشغيل حقيقية — الجسد أولاً. أخبروني أي جزء منكم يحتاج الاهتمام الأكبر.",
      tr: "Bu konaklama gerçek bir sıfırlamadır — önce beden. Hangi parçanızın en çok ilgiye ihtiyacı olduğunu söyleyin.",
    },
  },
  narrative: {
    titles: {
      en: [
        "A Stay Like a Story",
        "The Cinematic Night",
        "Three Acts in the Suite",
        "A Chapter at Le Palais",
      ],
      ar: [
        "إقامة كقصة",
        "الليلة السينمائية",
        "ثلاثة فصول في الجناح",
        "فصل في لو باليه",
      ],
      tr: [
        "Bir Hikaye Gibi Konaklama",
        "Sinemasal Gece",
        "Süitteki Üç Perde",
        "Le Palais'de Bir Bölüm",
      ],
    },
    opening: {
      en: "Let me set it like a small film. Three acts; the lights come up as you step inside.",
      ar: "دعوني أرتّبها كأنها فيلم قصير. ثلاثة فصول؛ الأضواء تُضاء حين تدخلون.",
      tr: "Bunu küçük bir film gibi kurgulayayım. Üç perde; içeri adım attığınızda ışıklar yanar.",
    },
    suite: {
      en: "A Penthouse with floor-to-ceiling windows — staged like a set. Curtain drawn at the right moment, candlelight rising on cue.",
      ar: "بنتهاوس بنوافذ كاملة الارتفاع — مُعدّ كمشهد. الستارة تُسحب في اللحظة المناسبة، ضوء الشموع يرتفع في الوقت المحدد.",
      tr: "Tabandan tavana camlı bir Penthouse — bir set gibi sahnelenmiş. Perde doğru anda çekilir, mum ışığı işaretle yükselir.",
    },
    spa: {
      en: "Act II — a Couples Aromatherapy ($170) timed before dusk, so you arrive at dinner already softened.",
      ar: "الفصل الثاني — علاج عطري للثنائي ($170) موقوت قبل الغسق، فتصلون إلى العشاء وقد ليّنتكم التجربة.",
      tr: "İkinci Perde — alacakaranlıktan önce zamanlanmış bir Çift Aromaterapisi ($170), böylece akşam yemeğine yumuşamış olarak gelirsiniz.",
    },
    dining: {
      en: "Act III at Le Palais — a private dinner staged like a scene; the wine breathes as the soufflé rises; the city dims around you on cue.",
      ar: 'الفصل الثالث في "لو باليه" — عشاء خاص مُسرَح كمشهد؛ النبيذ يتنفس بينما يرتفع السوفليه؛ المدينة تخفت حولكم في الوقت المحدد.',
      tr: "Le Palais'de Üçüncü Perde — bir sahne gibi sahnelenmiş özel bir akşam yemeği; sufle kabarırken şarap nefes alır; şehir işaretle çevrenizde solar.",
    },
    extras: {
      en: "A violinist arranged for the closing scene, and a final glass on the terrace — credits, as it were.",
      ar: "عازف كمان مرتّب للمشهد الختامي، وكأس أخيرة على الشرفة — كأنها شارة النهاية.",
      tr: "Kapanış sahnesi için bir kemancı ve terasta son bir kadeh — adeta jenerik.",
    },
    closing: {
      en: "This is theatre disguised as a hotel night. Tell me if you want a different ending.",
      ar: "هذا مسرح متنكّر في هيئة ليلة فندقية. أخبروني إن أردتم نهاية مختلفة.",
      tr: "Bu, otel gecesi kılığına bürünmüş bir tiyatro. Farklı bir son isterseniz söyleyin.",
    },
  },
  escape: {
    titles: {
      en: [
        "A Pure Escape",
        "Unplugged Days",
        "Out of the World",
        "A Disappearing Act",
      ],
      ar: ["هروب نقي", "أيام بلا اتصال", "خارج العالم", "فعل اختفاء"],
      tr: [
        "Saf Bir Kaçış",
        "Bağlantısız Günler",
        "Dünyanın Dışında",
        "Bir Kayboluş",
      ],
    },
    opening: {
      en: "Here is what I have arranged — and just as importantly, here is what is OFF.",
      ar: "إليكم ما رتّبته — وبنفس الأهمية، إليكم ما هو مُطفأ.",
      tr: "İşte ayarladığım şey — ve aynı derecede önemli olarak, işte KAPALI olan şey.",
    },
    suite: {
      en: "A top-floor Suite — phones silenced by default, the calendar app removed from the in-suite tablet.",
      ar: "جناح في الطابق العلوي — كتم الهواتف افتراضياً، تطبيق التقويم محذوف من اللوحة الذكية للجناح.",
      tr: "Üst kat Süit — telefonlar varsayılan olarak susturulmuş, takvim uygulaması süit tabletinden kaldırılmış.",
    },
    spa: {
      en: "A long Aromatherapy circuit on Floor 9 — phone-free room, attendant briefed not to mention dates or times.",
      ar: "دورة علاج عطري طويلة في الطابق التاسع — غرفة خالية من الهواتف، الموظف موجّه ألا يذكر التواريخ أو الأوقات.",
      tr: "9. Kattaki uzun bir Aromaterapi devresi — telefonsuz oda, görevliye tarih veya saat söylenmemesi bildirildi.",
    },
    dining: {
      en: "A late, quiet table at Le Palais — well after the rush, no crowds, no eye contact with anyone you didn't arrive with.",
      ar: 'طاولة هادئة متأخرة في "لو باليه" — بعد الذروة بكثير، لا ازدحام، لا تواصل بصري مع غير من جئتم معهم.',
      tr: "Le Palais'de geç, sessiz bir masa — yoğunluk geçtikten epey sonra, kalabalık yok, birlikte gelmediğiniz hiç kimseyle göz teması yok.",
    },
    extras: {
      en: "A private rooftop pool slot at dusk; do-not-disturb on by default; concierge calls held until you ask.",
      ar: 'موعد خاص لمسبح السطح عند الغسق؛ "عدم الإزعاج" مفعّل افتراضياً؛ مكالمات الكونسيرج محتجزة حتى تطلبوها.',
      tr: "Alacakaranlıkta özel çatı havuzu slotu; varsayılan olarak rahatsız etmeyin açık; siz istemedikçe concierge çağrıları bekletilir.",
    },
    closing: {
      en: "Nothing from the outside reaches you in here unless you choose. Tell me what should stay ON.",
      ar: "لا شيء من الخارج يصلكم هنا إلا باختياركم. أخبروني ما الذي يجب أن يبقى مُشغّلاً.",
      tr: "Siz seçmedikçe dışarıdan hiçbir şey buraya ulaşmaz. NEYİN açık kalması gerektiğini söyleyin.",
    },
  },
};

// ── Curated Experience Package (EXPERIENTIAL fallback) ──────────
// Emits a single, named, sectioned luxury itinerary (no service menu,
// no clarifying question) for ANY mood/occasion request — even when
// OpenAI is unreachable. This is what guarantees the user sees a
// curated package and never the generic services list.
function buildExperientialPackage(needs, language, requestedTopics) {
  const lang = ["ar", "tr"].includes(language) ? language : "en";
  const emotion = needs?.emotion;
  const purpose = needs?.purpose || "default";

  // EMOTION-DRIVEN PATH — distinct package per emotion (restorative,
  // isolation, silence, healing, narrative, escape). Takes priority over
  // the generic purpose-based copy so soft-intent turns don't collapse to
  // the same "Curated Luxury Escape" template.
  if (emotion && EMOTION_COPY[emotion]) {
    const E = EMOTION_COPY[emotion];
    const tx = (key) => E[key][lang] || E[key].en;
    const title = pick(E.titles[lang] || E.titles.en);
    const labels = {
      en: {
        stay: "Your Suite",
        spa: "Wellness",
        dining: "Dining",
        extras: "Touches",
      },
      ar: { stay: "جناحكم", spa: "العافية", dining: "الطعام", extras: "لمسات" },
      tr: {
        stay: "Süitiniz",
        spa: "Wellness",
        dining: "Yemek",
        extras: "Dokunuşlar",
      },
    }[lang];
    const has = (label) =>
      !Array.isArray(requestedTopics) ||
      requestedTopics.length === 0 ||
      requestedTopics.includes(label);
    const parts = [tx("opening"), `✨ ${title}`];
    parts.push(`🛏 ${labels.stay}\n${tx("suite")}`);
    if (has("spa / wellness")) parts.push(`💆 ${labels.spa}\n${tx("spa")}`);
    if (has("fine dining") || has("private dining"))
      parts.push(`🍷 ${labels.dining}\n${tx("dining")}`);
    parts.push(`🚘 ${labels.extras}\n${tx("extras")}`);
    parts.push(tx("closing"));
    return parts.join("\n\n");
  }

  const topicSet = new Set(
    Array.isArray(requestedTopics) && requestedTopics.length
      ? requestedTopics
      : [
          "a suite/room",
          "spa / wellness",
          "fine dining",
          "wine / champagne",
          "sunset / view",
          "romantic atmosphere",
        ],
  );
  const has = (label) => topicSet.has(label);

  // Pick a suite type by purpose (no number / no nightly price)
  const suiteByPurpose = {
    honeymoon: {
      en: "Penthouse Suite",
      ar: "جناح البنتهاوس",
      tr: "Penthouse Süit",
    },
    vacation: {
      en: "high-floor Deluxe Suite",
      ar: "جناح ديلوكس في الطوابق العليا",
      tr: "üst kat Deluxe Süit",
    },
    vip: { en: "Royal Suite", ar: "الجناح الملكي", tr: "Royal Süit" },
    business: {
      en: "Executive Suite",
      ar: "الجناح التنفيذي",
      tr: "Executive Süit",
    },
    family: { en: "Family Suite", ar: "الجناح العائلي", tr: "Aile Süiti" },
    default: { en: "Deluxe Suite", ar: "جناح ديلوكس", tr: "Deluxe Süit" },
  };
  const suite = (suiteByPurpose[purpose] || suiteByPurpose.default)[lang];

  // Package titles (translated)
  const titles = {
    en: {
      honeymoon: "Romantic Sunset Escape",
      vacation: "Wellness Weekend",
      vip: "VIP Executive Stay",
      business: "Executive Business Stay",
      family: "Family Retreat",
      default: "Curated Luxury Escape",
    },
    ar: {
      honeymoon: "هروب الغروب الرومانسي",
      vacation: "عطلة الصحة والعافية",
      vip: "إقامة كبار الشخصيات",
      business: "إقامة الأعمال التنفيذية",
      family: "استراحة العائلة",
      default: "هروب فاخر مصمّم خصيصاً",
    },
    tr: {
      honeymoon: "Romantik Gün Batımı Kaçamağı",
      vacation: "Wellness Hafta Sonu",
      vip: "VIP Lüks Konaklama",
      business: "Yönetici İş Konaklaması",
      family: "Aile Kaçamağı",
      default: "Özel Lüks Kaçamak",
    },
  };
  const title = titles[lang][purpose] || titles[lang].default;

  // Section copy per language
  const COPY = {
    en: {
      opening:
        "Based on your wish, I have carefully designed a complete experience for you:",
      labels: {
        stay: "Your Suite",
        spa: "Wellness Journey",
        dining: "Fine Dining",
        wine: "Wine Pairing",
        sunset: "Sunset Atmosphere",
        extras: "Luxury Touches",
      },
      stayWhy: {
        honeymoon: "an intimate, panoramic sanctuary made for two",
        vacation: "a serene, quiet retreat above the city",
        vip: "our most prestigious accommodation",
        business: "a refined base that blends prestige with productivity",
        family: "a spacious, welcoming home for the whole family",
        default: "a sophisticated setting tailored to your stay",
      },
      stayLine: (s, why) =>
        `A ${s}, chosen because it is ${why} — turndown, fresh linens and a personal welcome arranged on arrival.`,
      spaLine: {
        honeymoon:
          "A 90-minute Couples Massage ($280) in our private spa suite on Floor 9, finished with a Turkish hammam ritual.",
        vacation:
          "A 90-minute Hot Stone Therapy ($200) in the wellness sanctuary on Floor 9, followed by a steam-room and float-tank circuit.",
        vip: "A bespoke 120-minute Aromatherapy ritual ($170) in a private luxury spa suite (+$75).",
        business:
          "A 60-minute Deep Tissue Massage ($180) to reset after travel.",
        family:
          "A 60-minute Relaxation Massage ($150) for the adults while the family enjoys the rooftop pool.",
        default:
          "A 60-minute Aromatherapy treatment ($170) in our Floor 9 spa.",
      },
      diningLine: {
        honeymoon:
          "A private candlelit dinner at our Michelin-starred Le Palais — Butter-Poached Lobster ($95) and Chocolate Soufflé ($24) prepared by Chef Jean-Louis Moreau.",
        vacation:
          "A calm dinner at Le Palais — Chilean Sea Bass ($72) followed by Crème Brûlée ($18).",
        vip: "A multi-course chef's table at Le Palais — A5 Wagyu Ribeye ($165) and a tableside Soufflé finale.",
        business:
          "An efficient yet elegant dinner at Le Palais — Filet Mignon ($82) with a glass of red.",
        family:
          "A relaxed dinner at Le Palais with a tasting menu chosen for all ages.",
        default:
          "A signature tasting at Michelin-starred Le Palais by Chef Jean-Louis Moreau.",
      },
      wineLine: {
        honeymoon:
          "A bottle of Dom Pérignon ($450) chilled in your suite at arrival; Château Margaux 2015 ($850) reserved for dinner if you wish.",
        vip: "A bottle of Château Margaux 2015 ($850), with Opus One 2018 ($550) as a second pairing.",
        default:
          "A curated wine pairing selected by our sommelier from the Le Palais cellar.",
      },
      sunsetLine: {
        honeymoon:
          "Sunset on the rooftop infinity pool terrace (private cabana from $120/hour), ending with a strawberry-and-rose turndown back in the suite.",
        vacation:
          "A quiet golden-hour swim at the rooftop infinity pool — temperature set to your preference, towels and refreshments included.",
        default:
          "A reserved spot on the rooftop terrace for the city's most panoramic sunset.",
      },
      extrasLine: {
        honeymoon:
          "A private chauffeur (from $100) for an evening drive, plus a dedicated Premium Butler ($300) to coordinate every detail.",
        vip: "Twenty-four-hour Exclusive Concierge service ($400), a Mercedes S-Class chauffeur, and helicopter transfer on request.",
        business:
          "A private chauffeur (from $100), late check-out, and a personal butler for meeting coordination.",
        family:
          "Rooftop infinity pool access (from $40/hour) and a multilingual butler to arrange every activity.",
        default:
          "A Premium Butler ($300) and private chauffeur (from $100) for any moment of the stay.",
      },
      closing:
        "Every element here is set; if you'd prefer to swap a treatment, a wine, or the suite type, simply tell me and I'll refine it. Shall I confirm these arrangements for your dates?",
    },
    ar: {
      opening: "بناءً على رغبتكم، صمّمتُ لكم تجربة كاملة بعناية فائقة:",
      labels: {
        stay: "جناحكم",
        spa: "رحلة العافية",
        dining: "تناول الطعام الفاخر",
        wine: "النبيذ المختار",
        sunset: "أجواء الغروب",
        extras: "لمسات الفخامة",
      },
      stayWhy: {
        honeymoon: "ملاذ حميمي بانورامي صُمّم لاثنين",
        vacation: "ملاذ هادئ في الطوابق العليا فوق المدينة",
        vip: "أرقى إقامة في الفندق",
        business: "قاعدة راقية تجمع بين الهيبة والإنتاجية",
        family: "فضاء واسع ومرحّب يناسب العائلة بأكملها",
        default: "بيئة راقية مصمّمة خصيصاً لإقامتكم",
      },
      stayLine: (s, why) =>
        `${s}، اخترتُه لأنه ${why} — مع تجهيز السرير وفرش جديد واستقبال شخصي عند الوصول.`,
      spaLine: {
        honeymoon:
          "مساج الثنائي لمدة 90 دقيقة ($280) في جناح السبا الخاص بالطابق التاسع، يُتوّج بطقس الحمام التركي.",
        vacation:
          "علاج الأحجار الساخنة لمدة 90 دقيقة ($200) في ملاذ العافية بالطابق التاسع، مع غرفة بخار وخزان عوم.",
        vip: "علاج عطري مخصّص لمدة 120 دقيقة ($170) في جناح سبا فاخر خاص (+$75).",
        business:
          "مساج الأنسجة العميقة لمدة 60 دقيقة ($180) لاستعادة النشاط بعد السفر.",
        family:
          "مساج استرخاء لمدة 60 دقيقة ($150) للكبار بينما يستمتع الصغار بمسبح السطح.",
        default: "علاج عطري لمدة 60 دقيقة ($170) في سبا الطابق التاسع.",
      },
      diningLine: {
        honeymoon:
          'عشاء خاص على ضوء الشموع في مطعم "لو باليه" الحاصل على نجوم ميشلان — جراد البحر بالزبدة ($95) وسوفليه الشوكولاتة ($24) من إعداد الشيف جان-لويس مورو.',
        vacation:
          'عشاء هادئ في "لو باليه" — باس تشيلي ($72) يليه كريم بروليه ($18).',
        vip: 'مائدة الشيف متعددة الأطباق في "لو باليه" — واغيو A5 ($165) وسوفليه ختامي على المائدة.',
        business:
          'عشاء أنيق وعملي في "لو باليه" — فيليه مينيون ($82) مع كأس نبيذ أحمر.',
        family:
          'عشاء عائلي مريح في "لو باليه" مع قائمة تذوّق تناسب جميع الأعمار.',
        default:
          'تذوّق مميّز في "لو باليه" الحاصل على نجوم ميشلان من إعداد الشيف جان-لويس مورو.',
      },
      wineLine: {
        honeymoon:
          "زجاجة دوم بيرينيون ($450) مبرّدة في جناحكم عند الوصول؛ شاتو مارجو 2015 ($850) محجوزة للعشاء إن رغبتم.",
        vip: "زجاجة شاتو مارجو 2015 ($850) مع أوبوس وَن 2018 ($550) كاختيار ثانٍ.",
        default:
          'اختيار نبيذ مختار من قبو "لو باليه" يقترحه ساقي النبيذ لدينا.',
      },
      sunsetLine: {
        honeymoon:
          "غروب الشمس على مسبح السطح اللانهائي (كابانا خاصة من $120/الساعة)، ثم لمسات الفراولة والورد عند تجهيز السرير في الجناح.",
        vacation:
          "سباحة هادئة عند الساعة الذهبية في المسبح اللانهائي على السطح — درجة الحرارة تُعدّل حسب تفضيلكم مع مناشف ومرطبات.",
        default:
          "مكان محجوز على شرفة السطح للاستمتاع بأكثر إطلالة بانورامية للغروب في المدينة.",
      },
      extrasLine: {
        honeymoon:
          "سائق خاص (من $100) لجولة مسائية، وبتلر متميّز مخصّص ($300) لتنسيق كل التفاصيل.",
        vip: "خدمة كونسيرج حصرية على مدار الساعة ($400) وسائق مرسيدس S-Class ونقل بالمروحية عند الطلب.",
        business:
          "سائق خاص (من $100) ومغادرة متأخرة وبتلر شخصي لتنسيق الاجتماعات.",
        family:
          "دخول مسبح السطح اللانهائي (من $40/الساعة) وبتلر متعدد اللغات لتنظيم كل نشاط.",
        default: "بتلر متميّز ($300) وسائق خاص (من $100) لكل لحظة من إقامتكم.",
      },
      closing:
        "كل التفاصيل جاهزة؛ إن أردتم تبديل علاج أو نبيذ أو نوع الجناح، أخبروني وسأعدّلها. هل أؤكّد لكم هذه الترتيبات لتواريخكم؟",
    },
    tr: {
      opening:
        "İsteğiniz doğrultusunda sizin için tam bir deneyim özenle tasarladım:",
      labels: {
        stay: "Süitiniz",
        spa: "Wellness Yolculuğu",
        dining: "Fine Dining",
        wine: "Şarap Eşleştirmesi",
        sunset: "Gün Batımı Atmosferi",
        extras: "Lüks Dokunuşlar",
      },
      stayWhy: {
        honeymoon: "iki kişi için tasarlanmış, panoramik ve mahrem bir sığınak",
        vacation: "şehrin üzerinde sakin ve dingin bir kaçış",
        vip: "otelimizin en prestijli konaklaması",
        business: "prestij ve verimliliği bir araya getiren rafine bir üs",
        family: "tüm aile için geniş ve sıcak bir yuva",
        default: "konaklamanıza özel rafine bir ortam",
      },
      stayLine: (s, why) =>
        `${s} — ${why} olduğu için seçildi; varışınızda yatak hazırlığı, taze çarşaflar ve kişisel karşılama düzenlendi.`,
      spaLine: {
        honeymoon:
          "9. Kattaki özel spa süitinde 90 dakikalık Çift Masajı ($280), ardından Türk hamamı ritüeli.",
        vacation:
          "9. Kattaki wellness sığınağında 90 dakikalık Sıcak Taş Terapisi ($200), buhar odası ve float tank devresiyle tamamlanır.",
        vip: "Özel lüks spa süitinde (+$75) 120 dakikalık kişiye özel Aromaterapi ritüeli ($170).",
        business:
          "Yolculuk sonrası tazelenmek için 60 dakikalık Derin Doku Masajı ($180).",
        family:
          "Çocuklar çatı havuzunun keyfini çıkarırken yetişkinler için 60 dakikalık Gevşeme Masajı ($150).",
        default: "9. Kattaki spamızda 60 dakikalık Aromaterapi seansı ($170).",
      },
      diningLine: {
        honeymoon:
          "Michelin yıldızlı Le Palais'de mum ışığında özel akşam yemeği — Şef Jean-Louis Moreau'dan Tereyağlı Istakoz ($95) ve Çikolatalı Sufle ($24).",
        vacation:
          "Le Palais'de sakin bir akşam yemeği — Şili Levreği ($72) ve ardından Crème Brûlée ($18).",
        vip: "Le Palais'de çok aşamalı şef sofrası — A5 Wagyu Bonfile ($165) ve masada sunulan Sufle finali.",
        business:
          "Le Palais'de zarif ve etkili bir akşam yemeği — Filet Mignon ($82) yanında bir kadeh kırmızı şarap.",
        family:
          "Le Palais'de her yaşa uygun tadım menüsüyle rahat bir aile akşam yemeği.",
        default:
          "Michelin yıldızlı Le Palais'de Şef Jean-Louis Moreau imzalı özel tadım.",
      },
      wineLine: {
        honeymoon:
          "Varışta süitinizde soğutulmuş bir şişe Dom Pérignon ($450); dilerseniz akşam yemeği için Château Margaux 2015 ($850) ayrılır.",
        vip: "Bir şişe Château Margaux 2015 ($850), ikinci eşleşme olarak Opus One 2018 ($550).",
        default:
          "Le Palais şarap mahzeninden sommelier eşliğinde seçilmiş özel şarap eşleştirmesi.",
      },
      sunsetLine: {
        honeymoon:
          "Çatıdaki sonsuzluk havuzu terasında gün batımı (özel kabin $120/saatten), ardından süitte çilek-gül teması ile yatak hazırlığı.",
        vacation:
          "Çatıdaki sonsuzluk havuzunda altın saatte dingin bir yüzüş — su sıcaklığı tercihinize göre, havlu ve ikramlar dahil.",
        default:
          "Çatı terasında, şehrin en panoramik gün batımı için ayrılmış bir yer.",
      },
      extrasLine: {
        honeymoon:
          "Akşam gezintisi için özel şoför ($100'den) ve her detayı koordine edecek özel Premium Butler ($300).",
        vip: "7/24 Özel Concierge hizmeti ($400), Mercedes S-Class şoför ve talep üzerine helikopter transferi.",
        business:
          "Özel şoför ($100'den), geç çıkış ve toplantı koordinasyonu için kişisel butler.",
        family:
          "Çatı sonsuzluk havuzu erişimi ($40/saatten) ve her aktiviteyi düzenleyecek çok dilli butler.",
        default:
          "Konaklamanızın her anı için Premium Butler ($300) ve özel şoför ($100'den).",
      },
      closing:
        "Tüm detaylar hazır; bir tedaviyi, şarabı veya süit tipini değiştirmek isterseniz söyleyin, anında yenileyeyim. Tarihleriniz için bu düzenlemeleri onaylayayım mı?",
    },
  };

  const C = COPY[lang];
  const why = C.stayWhy[purpose] || C.stayWhy.default;

  const parts = [C.opening, `✨ ${title}`];

  // 🛏 Stay (always)
  parts.push(`🛏 ${C.labels.stay}\n${C.stayLine(suite, why)}`);

  // 💆 Spa
  if (has("spa / wellness")) {
    parts.push(
      `💆 ${C.labels.spa}\n${C.spaLine[purpose] || C.spaLine.default}`,
    );
  }

  // 🍷 Dining
  if (has("fine dining") || has("private dining")) {
    parts.push(
      `🍷 ${C.labels.dining}\n${C.diningLine[purpose] || C.diningLine.default}`,
    );
  }

  // 🥂 Wine
  if (has("wine / champagne")) {
    parts.push(
      `🥂 ${C.labels.wine}\n${C.wineLine[purpose] || C.wineLine.default}`,
    );
  }

  // 🌅 Sunset / view
  if (has("sunset / view")) {
    parts.push(
      `🌅 ${C.labels.sunset}\n${C.sunsetLine[purpose] || C.sunsetLine.default}`,
    );
  }

  // 🚘 Extras (always — chauffeur/butler/etc.)
  parts.push(
    `🚘 ${C.labels.extras}\n${C.extrasLine[purpose] || C.extrasLine.default}`,
  );

  parts.push(C.closing);

  return parts.join("\n\n");
}

// ── Intelligent Fallback — Top-Level Coordinator ─────────────────
function buildIntelligentFallback(
  needs,
  recommendation,
  alternatives,
  language,
  messages,
  intent,
  requestedTopics = [],
  conversationMode = "discovery",
  activeSubject = null,
) {
  const lang = ["ar", "tr"].includes(language) ? language : "en";

  // EXPERIENTIAL ALWAYS goes through the curated-package builder — but only in
  // DISCOVERY. In REFINEMENT (guest is tweaking an already-presented design),
  // emit a brief conversational acknowledgment instead of re-rendering the
  // template — exactly what a real concierge would do.
  if (intent === "EXPERIENTIAL") {
    if (conversationMode === "refinement") {
      const ack = {
        en: "Of course — I've folded that into the arrangement. Anything else you'd like me to fine-tune?",
        ar: "بكل تأكيد — أدرجتُ ذلك في الترتيب. هل تودّون تعديل شيء آخر؟",
        tr: "Elbette — bunu düzenlemeye dahil ettim. Başka bir detayı ince ayar yapmamı ister misiniz?",
      };
      return ack[lang] || ack.en;
    }
    return buildExperientialPackage(needs, lang, requestedTopics);
  }

  // FOLLOW-UP — conversational acknowledgement that doesn't reset the session.
  // Without an LLM we can't answer the specific factual question, but we can
  // at least preserve continuity and reference the active subject.
  if (intent === "FOLLOWUP") {
    const subj =
      activeSubject?.suite ||
      activeSubject?.package ||
      (lang === "ar" ? "الجناح" : lang === "tr" ? "süitiniz" : "the suite");
    const ack = {
      en: `Let me check on ${subj} for you — what specifically would you like to know? (Floor, view, capacity, amenities, breakfast?)`,
      ar: `دعوني أتحقق من تفاصيل ${subj} — ما الذي تودّون معرفته تحديداً؟ (الطابق، الإطلالة، السعة، المرافق، الإفطار؟)`,
      tr: `${subj} hakkında sizin için kontrol edeyim — özellikle neyi öğrenmek istersiniz? (Kat, manzara, kapasite, olanaklar, kahvaltı?)`,
    };
    return ack[lang] || ack.en;
  }

  // HOTEL_INFO — short factual route, never the welcome banner.
  if (intent === "HOTEL_INFO") {
    const info = {
      en: "Presidential Luxury Hotel is a 12-floor (B2 to Floor 11) 5-star urban resort with 300+ rooms, our Michelin-starred Le Palais, a full Spa & Wellness Centre on Floor 9, and a rooftop infinity pool on Floor 10. What part would you like to know more about?",
      ar: 'فندق بريزيدنشيال الفاخر منتجع حضري بخمس نجوم يضم 12 طابقاً (من B2 إلى الطابق 11) وأكثر من 300 غرفة، ومطعمنا "لو باليه" الحاصل على نجوم ميشلان، ومركز السبا والعافية الكامل في الطابق التاسع، ومسبح لانهائي على السطح في الطابق العاشر. عن أي جزء تودّون معرفة المزيد؟',
      tr: "Presidential Luxury Hotel, 12 katlı (B2'den 11. Kata) 5 yıldızlı bir şehir tatil köyüdür: 300'den fazla oda, Michelin yıldızlı Le Palais restoranı, 9. Kattaki tam donanımlı Spa & Wellness Merkezi ve 10. Kattaki çatı sonsuzluk havuzu. Hangi bölüm hakkında daha fazla bilgi almak istersiniz?",
    };
    return info[lang] || info.en;
  }

  // Room intents: use real room data
  if (recommendation) {
    const isAlt = intent === "ROOM_ALTERNATIVES";
    return buildRoomNarrative(recommendation, alternatives, needs, lang, isAlt);
  }

  // Alternatives requested but we've exhausted all matching rooms
  if (intent === "ROOM_ALTERNATIVES") {
    return buildNoMoreRoomsMessage(lang);
  }

  // Route to the correct service response using the last user message
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const userText = lastUser?.content || "";
  const svcIntent = detectServiceIntent(userText);

  // EXPERIENTIAL — emit a curated, named, sectioned PACKAGE.
  // Never a services menu, never a clarifying question.
  if (intent === "EXPERIENTIAL") {
    return buildExperientialPackage(needs, lang, requestedTopics);
  }

  // Mid-conversation safety: never re-greet with the welcome banner if the
  // session is already underway. UNKNOWN mid-session gets a contextual
  // continuation prompt instead.
  const hasPriorAssistant =
    Array.isArray(messages) && messages.some((m) => m.role === "assistant");
  const wouldGreet = svcIntent === "general" || intent === "GREETING";
  if (hasPriorAssistant && wouldGreet) {
    const cont = {
      en: "I'm here — what would you like to look at next? Anything to refine, or shall I move on to something else?",
      ar: "أنا هنا — بماذا تودّون متابعة الحديث؟ هل من تفصيل لتعديله، أم ننتقل إلى شيء آخر؟",
      tr: "Buradayım — sırada neyi konuşalım? İnce ayar yapmak istediğiniz bir şey var mı, yoksa başka bir şeye mi geçelim?",
    };
    return cont[lang] || cont.en;
  }

  // Map top-level intents to service keys
  const serviceIntentMap = {
    BOOKING_HELP: "booking",
    GREETING: "general",
  };
  const resolvedIntent = serviceIntentMap[intent] || svcIntent;

  return buildServiceResponse(resolvedIntent, lang, needs);
}

// ── Main Generate Function ───────────────────────────────────────
export async function generateConciergeResponse({
  messages,
  extractedNeeds,
  recommendation,
  alternatives,
  language,
  intent = "UNKNOWN",
  requestedTopics = [],
  conversationMode = "discovery",
  activeSubject = null,
}) {
  const available = getAvailableProviders();

  if (available.length === 0) {
    console.log(
      `[AI] No AI provider available — intelligent fallback (intent=${intent})`,
    );
    return buildIntelligentFallback(
      extractedNeeds,
      recommendation,
      alternatives,
      language,
      messages,
      intent,
      requestedTopics,
      conversationMode,
      activeSubject,
    );
  }

  const contextAddition = buildContext(
    extractedNeeds,
    recommendation,
    alternatives,
    language,
    intent,
    requestedTopics,
    conversationMode,
    messages,
    activeSubject,
  );
  const systemContent = contextAddition
    ? `${BASE_SYSTEM_PROMPT}\n\n---\nCURRENT CONTEXT:\n${contextAddition}`
    : BASE_SYSTEM_PROMPT;

  // Try each available provider in order (Groq → OpenAI). The first that
  // succeeds wins. A provider that fails is classified, put on cooldown (or
  // hard-disabled on a 401), and we move to the next one. Only when ALL
  // providers fail do we serve the emergency DB-driven response.
  for (const { p } of available) {
    const t0 = Date.now();
    try {
      const completion = await p.client.chat.completions.create({
        model: p.model,
        messages: [{ role: "system", content: systemContent }, ...messages],
        max_tokens: 650,
        temperature: 0.82,
        presence_penalty: 0.1,
      });
      const content = completion.choices[0]?.message?.content?.trim();
      if (!content) throw new Error(`Empty response from ${p.name}`);
      console.log(
        `[AI] ✓ ${p.name} SUCCESS (${p.model}) in ${Date.now() - t0}ms, intent=${intent}, lang=${language}`,
      );
      p.lastFail = 0; // reset cooldown on success
      return content;
    } catch (error) {
      const status = error.status || error.statusCode;
      const code = error.code || error.error?.code || "";
      const elapsed = Date.now() - t0;

      // Explicit, classified failure logging — never silent.
      if (
        error.name === "APIConnectionTimeoutError" ||
        /timeout/i.test(error.message)
      ) {
        p.lastFail = Date.now();
        console.error(
          `[AI] ✗ ${p.name} TIMEOUT after ${elapsed}ms (limit ${AI_TIMEOUT}ms). Consider raising AI_TIMEOUT_MS. Cooling down ${RETRY_COOLDOWN / 1000}s.`,
        );
      } else if (status === 401) {
        p.disabled = true;
        p.client = null;
        console.error(
          `[AI] ✗ ${p.name} AUTH FAILED (401): key invalid/revoked. Disabling ${p.name} for this process — check ${p.envKey} in backend/.env.`,
        );
      } else if (status === 429) {
        p.lastFail = Date.now();
        const isQuota = /quota|insufficient_quota|billing/i.test(
          code + " " + error.message,
        );
        console.error(
          `[AI] ✗ ${p.name} ${isQuota ? "QUOTA/BILLING EXCEEDED" : "RATE LIMITED"} (429): ${error.message}. Cooling down ${RETRY_COOLDOWN / 1000}s.`,
        );
      } else if (status >= 500) {
        p.lastFail = Date.now();
        console.error(
          `[AI] ✗ ${p.name} SERVER ERROR (${status}): ${error.message}. Cooling down ${RETRY_COOLDOWN / 1000}s.`,
        );
      } else {
        p.lastFail = Date.now();
        console.error(
          `[AI] ✗ ${p.name} CONNECTION/UNKNOWN error (${status ?? "no-status"}, code=${code || "none"}) after ${elapsed}ms: ${error.message}. Cooling down ${RETRY_COOLDOWN / 1000}s.`,
        );
      }
      // loop continues to the next provider (if any)
    }
  }

  console.warn(
    "[AI] → All AI providers failed — serving emergency DB-driven response.",
  );
  return buildIntelligentFallback(
    extractedNeeds,
    recommendation,
    alternatives,
    language,
    messages,
    intent,
    requestedTopics,
    conversationMode,
    activeSubject,
  );
}
