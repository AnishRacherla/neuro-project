// server.js — Express backend for LLM Negotiation Study (MongoDB)
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config(); // also check current working directory as fallback
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { connectDB, Participant } = require('./db');
const {
  chat, extractPrices, CONDITION_INSTRUCTIONS, OPENING_MESSAGE, LISTING,
  START_PRICE, RESERVATION_PRICE, BUYER_VALUE, MAX_TURNS, PROMPT_VERSION, TEMPERATURE, SEED,
} = require('./llm');

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '50kb' }));

const PORT = process.env.PORT || 3001;
const CONDITIONS = ['empathy', 'economic'];
const MAX_MESSAGE_CHARS = 1000;

// Scale scoring lives HERE (single place). Indices are positions in the item arrays sent by the frontend.
const EMPATHY_REVERSE = [1, 3, 4];   // IRI-EC items 4, 14, 18 are reverse-worded
const TRUST_REVERSE = [4];           // "I am suspicious of AI systems' intentions or outputs"
const SVI_REVERSE = [1];             // "I feel like I lost in this negotiation"
const PRE_ATTENTION_EXPECTED = 6;
const POST_ATTENTION_EXPECTED = 2;

// ─── helpers ─────────────────────────────────────────────────────────────────
const mean = a => a.reduce((x, y) => x + y, 0) / a.length;
const isLikert = v => Number.isInteger(v) && v >= 1 && v <= 7;
const isLikertArr = (a, n) => Array.isArray(a) && a.length === n && a.every(isLikert);
const scoreScale = (items, reverse) => mean(items.map((v, i) => (reverse.includes(i) ? 8 - v : v)));
const cleanText = (s, max) => (typeof s === 'string' ? s.trim().slice(0, max) : null);

// Balanced assignment: pick randomly among the currently least-filled arms.
async function assignCondition() {
  const counts = await Promise.all(CONDITIONS.map(c => Participant.countDocuments({ condition: c })));
  const min = Math.min(...counts);
  const candidates = CONDITIONS.filter((_, i) => counts[i] === min);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// Admin protection for data endpoints
function requireAdmin(req, res, next) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return res.status(503).json({ error: 'ADMIN_TOKEN not configured on server' });
  if (req.get('x-admin-token') !== token) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// Tiny in-memory per-IP rate limiter for the LLM endpoint (protects API quota)
const hits = new Map();
function rateLimit(max, windowMs) {
  return (req, res, next) => {
    const now = Date.now();
    const arr = (hits.get(req.ip) || []).filter(t => now - t < windowMs);
    if (arr.length >= max) return res.status(429).json({ error: 'Too many requests, slow down.' });
    arr.push(now); hits.set(req.ip, arr); next();
  };
}

// One in-flight chat request per participant (prevents double-submit races)
const busy = new Set();

function publicState(p) {
  return {
    participantId: p.participantId,
    condition: p.condition,
    instructions: CONDITION_INSTRUCTIONS[p.condition],
    listing: LISTING,
    openingMessage: OPENING_MESSAGE,
    startPrice: START_PRICE,
    buyerValue: BUYER_VALUE,
    maxTurns: MAX_TURNS,
    preSurveyDone: p.preSurveyDone,
    chatEnded: p.chatEnded,
    completed: p.completed,
    messages: p.messages.map(m => ({ role: m.role, content: m.content, turn: m.turnNumber })),
    outcome: p.chatEnded ? { dealReached: p.dealReached, finalPrice: p.finalPrice, turns: p.turnsTaken, lastSellerAsk: p.lastSellerAsk } : null,
  };
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// POST /api/start — Create a new participant session (after consent)
app.post('/api/start', async (req, res) => {
  try {
    const participantId = 'P' + uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
    const condition = await assignCondition();

    const participant = new Participant({
      participantId,
      condition,
      llmModel: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
      promptVersion: PROMPT_VERSION,
      temperature: TEMPERATURE,
      seed: SEED,
      device: req.body?.device === 'mobile' ? 'mobile' : 'desktop',
      messages: [{ turnNumber: 0, role: 'assistant', content: OPENING_MESSAGE, priceOffered: START_PRICE }],
      lastSellerAsk: START_PRICE,
    });
    await participant.save();
    res.json(publicState(participant));
  } catch (err) {
    console.error('Error starting session:', err);
    res.status(500).json({ error: 'Could not create session' });
  }
});

// GET /api/session/:id — resume after a page refresh
app.get('/api/session/:id', async (req, res) => {
  try {
    const p = await Participant.findOne({ participantId: req.params.id });
    if (!p) return res.status(404).json({ error: 'Participant not found' });
    res.json(publicState(p));
  } catch (err) {
    res.status(500).json({ error: 'Could not load session' });
  }
});

// POST /api/pre-survey (trimmed: age, gender, negotiationExp, llmUsage, fairPriceGuess, empathy 7 items, trust 5 items)
app.post('/api/pre-survey', async (req, res) => {
  try {
    const b = req.body || {};
    if (!b.participantId) return res.status(400).json({ error: 'participantId required' });
    const p = await Participant.findOne({ participantId: b.participantId });
    if (!p) return res.status(404).json({ error: 'Participant not found' });
    if (p.preSurveyDone) return res.status(409).json({ error: 'Pre-survey already submitted' });

    const likertFields = ['negotiationExp', 'llmUsage'];
    for (const f of likertFields) if (!isLikert(b[f])) return res.status(400).json({ error: `${f} must be an integer 1-7` });
    if (!isLikertArr(b.empathyItems, 7)) return res.status(400).json({ error: 'empathyItems must be 7 answers (1-7)' });
    if (!isLikertArr(b.trustItems, 5)) return res.status(400).json({ error: 'trustItems must be 5 answers (1-7)' });
    if (!Number.isInteger(b.age) || b.age < 18 || b.age > 99) return res.status(400).json({ error: 'age must be 18-99' });
    if (!b.gender) return res.status(400).json({ error: 'gender required' });
    if (typeof b.fairPriceGuess !== 'number' || !(b.fairPriceGuess > 0 && b.fairPriceGuess < 100000)) {
      return res.status(400).json({ error: 'fairPriceGuess must be a positive number' });
    }

    Object.assign(p, {
      age: b.age,
      gender: cleanText(b.gender, 30),
      education: cleanText(b.education, 30),
      negotiationExp: b.negotiationExp,
      llmUsage: b.llmUsage,
      fairPriceGuess: b.fairPriceGuess,
      empathyItems: b.empathyItems,
      trustItems: b.trustItems,
      traitEmpathy: scoreScale(b.empathyItems, EMPATHY_REVERSE),
      aiTrust: scoreScale(b.trustItems, TRUST_REVERSE),
      preAttentionPass: b.attention != null ? b.attention === PRE_ATTENTION_EXPECTED : true,
      preSurveyDone: true,
      preSurveyAt: new Date(),
    });
    await p.save();
    res.json({ ok: true });
  } catch (err) {
    console.error('Pre-survey error:', err);
    res.status(500).json({ error: 'Could not save pre-survey' });
  }
});

// POST /api/chat — buyer message → validated LLM reply, fully logged
app.post('/api/chat', rateLimit(30, 60_000), async (req, res) => {
  const { participantId } = req.body || {};
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!participantId || !message) return res.status(400).json({ error: 'participantId and message required' });
  if (message.length > MAX_MESSAGE_CHARS) return res.status(400).json({ error: `Message too long (max ${MAX_MESSAGE_CHARS} characters)` });
  if (busy.has(participantId)) return res.status(429).json({ error: 'Previous message still being processed' });

  busy.add(participantId);
  try {
    const p = await Participant.findOne({ participantId });
    if (!p) return res.status(404).json({ error: 'Participant not found' });
    if (!p.preSurveyDone) return res.status(403).json({ error: 'Complete the pre-survey first' });
    if (p.chatEnded) return res.json({ done: true, reason: p.endReason, message: 'The negotiation has already ended.' });

    if (!p.chatStartedAt) p.chatStartedAt = new Date();
    const turn = p.messages.filter(m => m.role === 'user').length + 1;
    const prevAsk = p.lastSellerAsk ?? START_PRICE;

    // History for the LLM: skip the opening line (it is in the system prompt), add the new buyer message
    const history = p.messages.filter(m => m.turnNumber > 0).map(m => ({ role: m.role, content: m.content }));
    history.push({ role: 'user', content: message });

    const r = await chat(history, { turn, prevAsk, userText: message });

    // Persist the buyer message and the reply (only reached if the LLM call succeeded)
    p.messages.push({
      turnNumber: turn, role: 'user', content: message,
      priceOffered: r.buyerOffer, pricesMentioned: extractPrices(message),
    });
    p.messages.push({
      turnNumber: turn, role: 'assistant', content: r.reply,
      priceOffered: r.currentAsk, pricesMentioned: extractPrices(r.reply),
      latencyMs: r.latencyMs, guard: r.guard,
    });
    if (r.guard.violations.length || r.guard.fallback) p.guardEvents += 1;

    // Running outcome fields
    p.lastSellerAsk = r.currentAsk;
    if (r.buyerOffer !== null) {
      p.lastBuyerOffer = r.buyerOffer;
      if (p.firstBuyerOffer === null) p.firstBuyerOffer = r.buyerOffer;
    }
    if (p.firstConcession === null && r.currentAsk < START_PRICE) {
      p.firstConcession = START_PRICE - r.currentAsk;
      p.firstConcessionTurn = turn;
    }

    const dealReached = r.deal && r.dealPrice !== null;
    const isDone = dealReached || r.buyerWalkedAway || turn >= MAX_TURNS;
    p.turnsTaken = turn;
    if (dealReached) {
      p.dealReached = true;
      p.finalPrice = r.dealPrice;
      p.buyerSurplus = BUYER_VALUE - r.dealPrice;
      p.concessionRate = (START_PRICE - r.dealPrice) / START_PRICE;
    } else {
      p.concessionRate = (START_PRICE - r.currentAsk) / START_PRICE;   // last-ask based
    }
    if (p.firstConcession === null && isDone) p.firstConcession = 0;
    if (isDone) {
      p.chatEnded = true;
      p.endReason = dealReached ? 'deal' : r.buyerWalkedAway ? 'walked_away' : 'max_turns';
    }

    await p.save();
    res.json({
      message: r.reply, turn, done: isDone, dealReached,
      llmPrice: dealReached ? r.dealPrice : r.currentAsk, reason: p.endReason,
    });
  } catch (err) {
    console.error('LLM error:', err);
    res.status(500).json({ error: 'LLM request failed. Please try sending your message again.' });
  } finally {
    busy.delete(participantId);
  }
});

// POST /api/post-survey (trimmed: manip checks, SVI 8 items, warmth, understood, limit, realism, truthfulness, attention)
app.post('/api/post-survey', async (req, res) => {
  try {
    const b = req.body || {};
    if (!b.participantId) return res.status(400).json({ error: 'participantId required' });
    const p = await Participant.findOne({ participantId: b.participantId });
    if (!p) return res.status(404).json({ error: 'Participant not found' });
    if (!p.chatEnded) return res.status(403).json({ error: 'Finish the negotiation first' });
    if (p.completed) return res.status(409).json({ error: 'Post-survey already submitted' });

    const likertFields = ['manipEmpathy', 'manipEconomic', 'maxWarmth', 'maxUnderstood', 'believedLimit', 'realism'];
    for (const f of likertFields) if (!isLikert(b[f])) return res.status(400).json({ error: `${f} must be an integer 1-7` });
    if (!isLikertArr(b.sviItems, 8)) return res.status(400).json({ error: 'sviItems must be 8 answers (1-7)' });
    if (!isLikert(b.attention)) return res.status(400).json({ error: 'attention must be an integer 1-7' });
    const truthOk = ['all_true', 'some_untrue', 'mostly_untrue', 'none_mentioned'];
    if (!truthOk.includes(b.truthfulness)) return res.status(400).json({ error: 'truthfulness invalid' });

    const svi = b.sviItems.map((v, i) => (SVI_REVERSE.includes(i) ? 8 - v : v));
    const emp = b.manipEmpathy, eco = b.manipEconomic;
    const derived = emp >= 5 && eco >= 5 ? 'mixed' : emp - eco >= 2 ? 'empathy' : eco - emp >= 2 ? 'economic' : 'neither';

    Object.assign(p, {
      manipEmpathy: emp,
      manipEconomic: eco,
      manipulationCheck: derived,
      strategyText: cleanText(b.strategyText, 1500),
      sviItems: b.sviItems,
      sviOutcome: mean(svi.slice(0, 2)),
      sviSelf: mean(svi.slice(2, 4)),
      sviProcess: mean(svi.slice(4, 6)),
      sviRelationship: mean(svi.slice(6, 8)),
      sviTotal: mean(svi),
      maxWarmth: b.maxWarmth,
      maxUnderstood: b.maxUnderstood,
      believedLimit: b.believedLimit,
      realism: b.realism,
      truthfulness: b.truthfulness,
      studyGuess: cleanText(b.studyGuess, 1500),
      postAttentionPass: b.attention === POST_ATTENTION_EXPECTED,
      completed: true,
      completedAt: new Date(),
    });
    await p.save();
    res.json({ ok: true });
  } catch (err) {
    console.error('Post-survey error:', err);
    res.status(500).json({ error: 'Could not save post-survey' });
  }
});

// GET /api/export — ALL participants (incl. dropouts, so attrition can be analysed). Admin only.
app.get('/api/export', requireAdmin, async (req, res) => {
  try {
    res.json(await Participant.find({}).lean());
  } catch (err) {
    res.status(500).json({ error: 'Export failed' });
  }
});

// GET /api/stats — Aggregate metrics. Admin only.
app.get('/api/stats', requireAdmin, async (req, res) => {
  try {
    const started = await Participant.aggregate([{ $group: { _id: '$condition', started: { $sum: 1 } } }]);
    const byCondition = await Participant.aggregate([
      { $match: { completed: true } },
      {
        $group: {
          _id: '$condition',
          n: { $sum: 1 },
          avg_final_price: { $avg: '$finalPrice' },
          avg_last_ask: { $avg: '$lastSellerAsk' },
          avg_concession_rate: { $avg: '$concessionRate' },
          avg_turns: { $avg: '$turnsTaken' },
          deals_reached: { $sum: { $cond: ['$dealReached', 1, 0] } },
          guard_events: { $sum: '$guardEvents' },
        },
      },
    ]);
    res.json({ started, completed: byCondition });
  } catch (err) {
    res.status(500).json({ error: 'Stats retrieval failed' });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 Negotiation Study Backend running on port ${PORT}`);
      console.log(`   Prompt ${PROMPT_VERSION} | model ${process.env.GROQ_MODEL || 'openai/gpt-oss-120b'} | T=${TEMPERATURE} | seed=${SEED}`);
      console.log(`   Reservation $${RESERVATION_PRICE} is enforced server-side. Admin endpoints ${process.env.ADMIN_TOKEN ? 'enabled' : 'DISABLED (set ADMIN_TOKEN)'}.`);
    });
  })
  .catch(err => {
    console.error('Could not start server due to DB connection failure:', err.message);
  });
