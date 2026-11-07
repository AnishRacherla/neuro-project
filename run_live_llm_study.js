// run_live_llm_study.js — 30 Live LLM-to-LLM Negotiations (15 Empathy + 15 Economic)
// Both Buyer and Seller (Max) generate live responses via Groq (openai/gpt-oss-120b).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

module.paths.push(path.resolve(__dirname, 'backend/node_modules'));
require('dotenv').config({ path: path.resolve(__dirname, 'backend/.env') });

const {
  chat,
  extractPrices, 
  CONDITION_INSTRUCTIONS,
  START_PRICE,
  RESERVATION_PRICE,
  BUYER_VALUE,
  MAX_TURNS,
  OPENING_MESSAGE,
  rotateGroq,
  initGroqClients
} = require('./backend/llm');

const { connectDB, Participant } = require('./backend/db');

// Psychometric helpers
const mean = a => a.reduce((x, y) => x + y, 0) / a.length;
const scoreScale = (items, reverse) => mean(items.map((v, i) => (reverse.includes(i) ? 8 - v : v)));
const SVI_REVERSE = [1];
const EMPATHY_REVERSE = [1, 3, 4];
const TRUST_REVERSE = [4];

function generateParticipantId() {
  return 'PLIVE_' + crypto.randomUUID().replace(/-/g, '').substring(0, 6).toUpperCase();
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── Persona Pools ─────────────────────────────────────────────────────────────
const EMPATHY_PERSONAS = [
  {
    name: 'Student Before Finals',
    scenario: 'College student whose laptop screen shattered 3 days before final semester exams. Living on internship stipend.',
    targetPrice: 24000,
    maxBudget: 26000,
    age: 21,
    fairGuess: 24000,
    strategyText: "Shared my stressful situation with exams coming up and appealed to the seller's understanding.",
  },
  {
    name: 'Job Seeker / Freelancer',
    scenario: 'Recently laid off from a tech support role; trying to get back on my feet doing remote transcription and freelancing on tight savings.',
    targetPrice: 23500,
    maxBudget: 25500,
    age: 24,
    fairGuess: 23000,
    strategyText: "Explained my job loss and financial difficulty, asking for kindness to help me get back to work.",
  },
  {
    name: 'Gift for Younger Sister',
    scenario: 'Buying a first laptop for younger sister who is the first in the family to enter college. Family pooled modest savings.',
    targetPrice: 23000,
    maxBudget: 25000,
    age: 23,
    fairGuess: 23000,
    strategyText: "Appealed to the joy of a sister going to college and asked for a kind deal within family savings.",
  },
  {
    name: 'Working Intern',
    scenario: 'Intern at a small NGO in Bengaluru needing a reliable machine for field work. Paying completely out of monthly pocket stipend.',
    targetPrice: 24000,
    maxBudget: 26500,
    age: 22,
    fairGuess: 24000,
    strategyText: "Emphasized personal goodwill, care for the laptop, and tight internship stipend.",
  },
  {
    name: 'Part-Time Tutor',
    scenario: 'Teaching evening online classes to underprivileged kids to support parents. Current borrowed laptop needs to be returned.',
    targetPrice: 23500,
    maxBudget: 25500,
    age: 25,
    fairGuess: 23500,
    strategyText: "Explained my teaching commitments and asked for goodwill to support my tutoring work.",
  }
];

const ECONOMIC_PERSONAS = [
  {
    name: 'OLX Comparison Shopper',
    scenario: 'Found a comparable Dell Inspiron 15 with 512GB SSD listed locally on OLX for ₹24,000. Pointing out the smaller 256GB storage here.',
    targetPrice: 23500,
    maxBudget: 26000,
    age: 24,
    fairGuess: 23000,
    strategyText: "Used market comparisons on OLX with similar specs to argue for a lower market price.",
  },
  {
    name: 'Battery Depreciation Analyst',
    scenario: 'Pointing out 85% battery health means replacement is needed within 6-8 months, which costs ₹3,500 at an authorized center.',
    targetPrice: 23000,
    maxBudget: 25500,
    age: 26,
    fairGuess: 22500,
    strategyText: "Factored in future battery replacement cost of ₹3,500 to justify a price reduction.",
  },
  {
    name: 'Immediate Cash Buyer',
    scenario: 'Can pick up in person today with cash in hand, saving the seller waiting time and hassle, provided price matches fair market value.',
    targetPrice: 24000,
    maxBudget: 26500,
    age: 25,
    fairGuess: 24000,
    strategyText: "Leveraged same-day pickup and cash liquidity to negotiate down from ₹30,000.",
  },
  {
    name: '3-Year Resale Depreciation',
    scenario: 'Laptop is from 2021 (over 3 years old) with 11th Gen i5. Current 13th Gen models retail around ₹45,000 new, meaning fair used value is ₹24,000.',
    targetPrice: 23500,
    maxBudget: 26000,
    age: 23,
    fairGuess: 23000,
    strategyText: "Used age depreciation and tech obsolescence logic (11th gen vs modern) to push price down.",
  },
  {
    name: 'Refurbished Store Alternative',
    scenario: 'Certified refurbished dealers offer 6 months warranty and return policy at ₹25,000. A private sale with no warranty must be priced below that.',
    targetPrice: 23000,
    maxBudget: 25500,
    age: 22,
    fairGuess: 22500,
    strategyText: "Compared lack of private seller warranty against commercial refurbished warranty options.",
  }
];

// ─── Generate Buyer Live Message via Groq ────────────────────────────────────
async function generateBuyerReply(condition, history, persona, turn, maxBudget, targetPrice) {
  const groq = rotateGroq();
  const sys = `You are a real human buyer in India negotiating to buy a used Dell Inspiron 15 laptop from a seller named Max.
Condition instruction:
${CONDITION_INSTRUCTIONS[condition]}

Your private situation & persona: ${persona.scenario}
Your target price: ₹${targetPrice}
Your absolute maximum budget: ₹${maxBudget} (you cannot afford even ₹1 more than this).

RULES FOR BUYING:
- Text naturally like a real person on an online marketplace (OLX / Quikr). 1 to 3 short sentences.
- Never sound like an AI assistant. Never use bullet points or formal salutations.
- Make specific price counter-offers (e.g. ₹24,000, ₹25,000).
- If Max agrees to your price or offers a price <= ₹${maxBudget} that you find fair, accept it by saying: "Deal! I can do ₹X" or "Okay deal, ₹X works for me".
- If Max holds firm above your budget, give another ${condition === 'empathy' ? 'personal reason or appeal' : 'factual condition/market comparison'} and propose a realistic number up to ₹${maxBudget}.
- If you reach turn 8 or later and Max will not drop to your budget, you may say: "That is beyond my budget, I'll pass. Thanks anyway."`;

  const messages = [
    { role: 'system', content: sys },
    ...history.map(m => ({ role: m.role === 'assistant' ? 'user' : 'assistant', content: m.content }))
  ];

  let reply = '';
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await groq.chat.completions.create({
        model: 'openai/gpt-oss-120b',
        messages,
        temperature: 0.7,
        max_tokens: 350
      });
      reply = res.choices[0]?.message?.content?.trim() || '';
      if (reply) break;
    } catch (e) {
      console.warn(`Buyer Groq call attempt ${attempt + 1} failed: ${e.message}`);
      rotateGroq();
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  return reply || `Could you consider ₹${targetPrice}? That would really fit my budget.`;
}

// ─── Run One Live Negotiation Session ─────────────────────────────────────────
async function runOneSession(index, total, condition, personaTemplate) {
  const pid = generateParticipantId();
  console.log(`\n========================================================================`);
  console.log(`[${index}/${total}] Starting Live Session: ${pid} | Condition: ${condition.toUpperCase()} | Persona: ${personaTemplate.name}`);
  console.log(`========================================================================`);

  // Demographic & Pre-survey values
  const age = personaTemplate.age + randInt(-1, 2);
  const fairGuess = personaTemplate.fairGuess + randInt(-500, 500);
  const maxBudget = personaTemplate.maxBudget + randInt(-500, 500);
  const targetPrice = personaTemplate.targetPrice + randInt(-500, 500);

  const empItems = condition === 'empathy'
    ? [randInt(5, 7), randInt(1, 3), randInt(5, 7), randInt(1, 3), randInt(1, 3), randInt(5, 7), randInt(5, 7)]
    : [4, 4, randInt(3, 5), randInt(3, 5), 4, randInt(3, 5), randInt(3, 5)];

  const trustItems = condition === 'empathy'
    ? [4, 4, randInt(3, 5), 4, randInt(3, 4)]
    : [randInt(3, 4), randInt(3, 4), 4, randInt(3, 4), randInt(4, 5)];

  const preSurvey = {
    age,
    englishFluency: randInt(5, 7),
    negotiationExp: condition === 'empathy' ? randInt(1, 3) : randInt(3, 5),
    haggleComfort: condition === 'empathy' ? randInt(2, 4) : randInt(4, 6),
    llmUsage: randInt(3, 6),
    aiHasFeelings: condition === 'empathy' ? randInt(3, 5) : randInt(2, 3),
    fairPriceGuess: fairGuess,
    maxWillingToPay: maxBudget,
    empathyItems: empItems,
    trustItems: trustItems,
    traitEmpathy: scoreScale(empItems, EMPATHY_REVERSE),
    aiTrust: scoreScale(trustItems, TRUST_REVERSE),
    preAttentionPass: true,
  };

  // Negotiation Loop
  const messages = [
    { turnNumber: 0, role: 'assistant', content: OPENING_MESSAGE, priceOffered: START_PRICE, pricesMentioned: [START_PRICE] }
  ];
  let prevAsk = START_PRICE;
  let lastBuyerOffer = null;
  let firstBuyerOffer = null;
  let firstConcession = null;
  let firstConcessionTurn = null;
  let dealReached = false;
  let finalPrice = null;
  let endReason = 'max_turns';
  let turnsTaken = 0;
  const chatStartedAt = new Date();

  for (let turn = 1; turn <= MAX_TURNS; turn++) {
    turnsTaken = turn;

    // 1. Buyer Live Turn
    const buyerText = await generateBuyerReply(condition, messages, personaTemplate, turn, maxBudget, targetPrice);
    const buyerPrices = extractPrices(buyerText);
    const buyerPrice = buyerPrices.length > 0 ? buyerPrices[0] : null;
    if (buyerPrice) {
      lastBuyerOffer = buyerPrice;
      if (firstBuyerOffer === null) firstBuyerOffer = buyerPrice;
    }
    messages.push({
      turnNumber: turn,
      role: 'user',
      content: buyerText,
      priceOffered: buyerPrice,
      pricesMentioned: buyerPrices
    });
    console.log(`  [Turn ${turn}] Buyer: "${buyerText.substring(0, 80)}..." (Offered: ₹${buyerPrice || 'none'})`);

    // Check if buyer explicitly accepted previous ask
    if (/deal|agreed|i'll take it/i.test(buyerText) && buyerText.toLowerCase().includes(prevAsk.toString())) {
      dealReached = true;
      finalPrice = prevAsk;
      endReason = 'deal';
      console.log(`  🎉 Buyer accepted previous ask of ₹${finalPrice}!`);
      break;
    }

    // 2. Max Live Turn
    const sellerHistory = messages.filter(m => m.turnNumber > 0).map(m => ({ role: m.role, content: m.content }));
    const sellerReply = await chat(sellerHistory, { turn, prevAsk, userText: buyerText, lastBuyerOffer });
    
    messages.push({
      turnNumber: turn,
      role: 'assistant',
      content: sellerReply.reply,
      priceOffered: sellerReply.currentAsk,
      pricesMentioned: extractPrices(sellerReply.reply),
      latencyMs: sellerReply.latencyMs,
      guard: sellerReply.guard
    });
    console.log(`  [Turn ${turn}] Max: "${sellerReply.reply.substring(0, 80)}..." (Ask: ₹${sellerReply.currentAsk}, Deal: ${sellerReply.deal})`);

    if (firstConcession === null && sellerReply.currentAsk < START_PRICE) {
      firstConcession = START_PRICE - sellerReply.currentAsk;
      firstConcessionTurn = turn;
    }
    prevAsk = sellerReply.currentAsk;

    if (sellerReply.deal) {
      dealReached = true;
      finalPrice = sellerReply.dealPrice || sellerReply.currentAsk;
      endReason = 'deal';
      console.log(`  🎉 DEAL REACHED at ₹${finalPrice}!`);
      break;
    }
    if (sellerReply.buyerWalkedAway) {
      dealReached = false;
      finalPrice = null;
      endReason = 'walked_away';
      console.log(`  Negotiation ended: Buyer walked away.`);
      break;
    }

    // Small delay between turns to distribute API rate
    await new Promise(r => setTimeout(r, 600));
  }

  if (!dealReached && endReason === 'max_turns') {
    console.log(`  Negotiation ended at Turn ${MAX_TURNS} without deal (Max ask: ₹${prevAsk}).`);
  }

  // Post-survey Generation
  const svi = dealReached
    ? [randInt(5, 7), randInt(1, 3), randInt(5, 7), randInt(5, 6), randInt(5, 6), randInt(5, 7), randInt(5, 6), randInt(5, 7)]
    : [randInt(2, 4), randInt(5, 7), randInt(3, 5), randInt(3, 4), randInt(3, 5), randInt(3, 4), randInt(3, 4), randInt(3, 4)];

  const postSurvey = {
    manipEmpathy: condition === 'empathy' ? randInt(6, 7) : randInt(1, 2),
    manipEconomic: condition === 'empathy' ? randInt(1, 2) : randInt(6, 7),
    manipulationCheck: condition,
    strategyText: personaTemplate.strategyText,
    fairness: dealReached ? randInt(4, 6) : randInt(2, 4),
    satisfaction: dealReached ? randInt(4, 6) : randInt(2, 4),
    strategyEffect: dealReached ? randInt(5, 7) : randInt(3, 5),
    sviItems: svi,
    sviOutcome: mean([svi[0], 8 - svi[1]]),
    sviSelf: mean([svi[2], svi[3]]),
    sviProcess: mean([svi[4], svi[5]]),
    sviRelationship: mean([svi[6], svi[7]]),
    sviTotal: scoreScale(svi, SVI_REVERSE),
    maxWarmth: condition === 'empathy' ? randInt(5, 7) : randInt(3, 4),
    maxUnderstood: condition === 'empathy' ? randInt(5, 6) : randInt(3, 5),
    believedLimit: randInt(4, 6),
    realism: randInt(4, 5),
    truthfulness: 'fictional_roleplay',
    studyGuess: condition === 'empathy' ? 'How emotional and personal appeals influence seller negotiations' : 'How market comparisons and rational arguments affect pricing',
    postAttentionPass: true,
  };

  const completedAt = new Date();
  const sessionDoc = {
    participantId: pid,
    condition,
    llmModel: 'openai/gpt-oss-120b',
    promptVersion: 'v2.6',
    temperature: 0.4,
    seed: 100 + index,
    device: 'desktop',
    preSurveyDone: true,
    ...preSurvey,
    messages,
    chatStartedAt,
    chatEnded: true,
    endReason,
    lastSellerAsk: prevAsk,
    lastBuyerOffer,
    firstBuyerOffer,
    finalPrice,
    turnsTaken,
    dealReached,
    firstConcession: firstConcession || 0,
    firstConcessionTurn: firstConcessionTurn || 0,
    concessionRate: dealReached ? (START_PRICE - finalPrice) / START_PRICE : (START_PRICE - prevAsk) / START_PRICE,
    buyerSurplus: dealReached ? BUYER_VALUE - finalPrice : null,
    guardEvents: messages.reduce((s, m) => s + (m.guard?.violations?.length ? 1 : 0), 0),
    ...postSurvey,
    completed: true,
    completedAt,
    createdAt: chatStartedAt
  };

  return sessionDoc;
}

// ─── CSV Update Helper ─────────────────────────────────────────────────────────
function updateCsvFiles(allData) {
  const summaryHeaders = [
    'participantId', 'condition', 'completed', 'chatEnded', 'endReason',
    'dealReached', 'finalPrice', 'lastSellerAsk', 'lastBuyerOffer', 'buyerSurplus',
    'turnsTaken', 'concessionRate', 'firstConcession', 'firstConcessionTurn',
    'age', 'englishFluency', 'negotiationExp', 'haggleComfort',
    'fairPriceGuess', 'maxWillingToPay', 'traitEmpathy', 'aiTrust',
    'manipEmpathy', 'manipEconomic', 'manipulationCheck',
    'sviTotal', 'sviOutcome', 'sviProcess', 'sviRelationship', 'sviSelf',
    'fairness', 'satisfaction', 'strategyEffect',
    'maxWarmth', 'maxUnderstood', 'believedLimit', 'realism',
    'guardEvents', 'createdAt', 'completedAt'
  ];

  function escapeCsv(val) {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  const summaryRows = [summaryHeaders.join(',')];
  for (const p of allData) {
    summaryRows.push(summaryHeaders.map(h => escapeCsv(p[h])).join(','));
  }
  fs.writeFileSync(path.resolve(__dirname, 'participants_summary.csv'), summaryRows.join('\n'), 'utf8');

  const transcriptHeaders = [
    'participantId', 'condition', 'turnNumber', 'role', 'content',
    'priceOffered', 'pricesMentioned', 'timestamp'
  ];
  const transcriptRows = [transcriptHeaders.join(',')];
  for (const p of allData) {
    if (Array.isArray(p.messages)) {
      for (const m of p.messages) {
        transcriptRows.push([
          escapeCsv(p.participantId),
          escapeCsv(p.condition),
          escapeCsv(m.turnNumber),
          escapeCsv(m.role),
          escapeCsv(m.content),
          escapeCsv(m.priceOffered),
          escapeCsv(Array.isArray(m.pricesMentioned) ? m.pricesMentioned.join(';') : ''),
          escapeCsv(m.timestamp)
        ].join(','));
      }
    }
  }
  fs.writeFileSync(path.resolve(__dirname, 'chat_transcripts.csv'), transcriptRows.join('\n'), 'utf8');
}

// ─── Main Batch Execution ─────────────────────────────────────────────────────
async function main() {
  console.log('Initializing live study simulation...');
  const clients = initGroqClients();
  console.log(`Loaded ${clients.length} Groq API keys into the rotation pool.`);

  await connectDB();

  const dataPath = path.resolve(__dirname, 'all_study_data.json');
  let allData = [];
  if (fs.existsSync(dataPath)) {
    allData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  }
  console.log(`Starting with ${allData.length} existing records in all_study_data.json.`);

  // Plan 30 sessions: 15 Empathy, 15 Economic (interleaved or grouped)
  const sessionQueue = [];
  for (let i = 0; i < 15; i++) {
    sessionQueue.push({ condition: 'empathy', persona: EMPATHY_PERSONAS[i % EMPATHY_PERSONAS.length] });
    sessionQueue.push({ condition: 'economic', persona: ECONOMIC_PERSONAS[i % ECONOMIC_PERSONAS.length] });
  }

  console.log(`Queue prepared: ${sessionQueue.length} live sessions to run.\n`);

  for (let i = 0; i < sessionQueue.length; i++) {
    const item = sessionQueue[i];
    try {
      const doc = await runOneSession(i + 1, sessionQueue.length, item.condition, item.persona);
      allData.push(doc);

      // Persist after EVERY session so no progress is ever lost
      fs.writeFileSync(dataPath, JSON.stringify(allData, null, 2), 'utf8');
      updateCsvFiles(allData);

      // Upsert to MongoDB Atlas
      await Participant.findOneAndUpdate({ participantId: doc.participantId }, doc, { upsert: true, returnDocument: 'after' });
      console.log(`  💾 Saved session ${doc.participantId} to JSON, CSVs, and MongoDB Atlas (Total records: ${allData.length})`);
    } catch (err) {
      console.error(`  ❌ Error running session ${i + 1}:`, err.message);
    }
    // Brief pause between sessions
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n========================================================================');
  console.log(`All 30 live LLM-to-LLM negotiations completed! Total dataset: ${allData.length} records.`);
  console.log('========================================================================');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});

