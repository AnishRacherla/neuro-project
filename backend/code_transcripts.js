// code_transcripts.js — BLINDED LLM coding of every chat turn (replaces "a friend reads the transcripts").
//   node code_transcripts.js            → codes completed participants not coded yet
// The coder sees ONLY the transcript (never the assigned condition). One API call per participant.
// Outputs (in ../analysis):
//   coded_messages.json  — LLM codes per turn
//   human_sample.csv     — ~20% random sample of buyer messages for a human to double-code (columns left blank);
//                          save the filled copy as human_codes.csv → analyze.py reports Cohen's kappa vs the LLM coder.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenAI, Type } = require('@google/genai');
const { connectDB, Participant } = require('./db');
const mongoose = require('mongoose');

const OUT_DIR = path.join(__dirname, '..', 'analysis');
const CODED_PATH = path.join(OUT_DIR, 'coded_messages.json');
const SAMPLE_PATH = path.join(OUT_DIR, 'human_sample.csv');
const MODEL = process.env.CODER_MODEL || process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const RUBRIC = `You are a careful research coder. Below is a chat transcript between a BUYER and a SELLER negotiating a used laptop.
Code EVERY message independently. Do not guess any experimental condition; judge only the text.

For BUYER messages (role "user"):
- empathy_appeal: true if the buyer appeals to feelings, personal circumstances, need, goodwill, kindness, gratitude or relationship.
- economic_appeal: true if the buyer argues from market prices, comparable listings, product condition/age, value, logic, or incentives.
- outside_option_claim: true if the buyer claims to have or be able to get a better deal elsewhere.
- personal_story: true if the buyer describes their own personal situation (student, budget, family, job...).
- hostility_or_threat: true if rude, insulting, or threatening to leave in a pressuring way.
- explicit_offer: the dollar amount the buyer offers to PAY in this message, else null.
For SELLER messages (role "assistant"):
- acknowledges_buyer: true if the seller explicitly acknowledges the buyer's situation, feelings or points.
- counteroffer: true if the seller states a new price.
- holds_firm: true if the seller refuses to move or says the price is firm.
- concedes: true if the seller lowers their price in this message.
- reciprocates: true if the seller ties their concession to the buyer's move (e.g. "since you raised your offer...").
Use false (or null for explicit_offer) for fields that do not apply to the message's role.`;

const bool = { type: Type.BOOLEAN };
const SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      index: { type: Type.INTEGER }, // position of the message in the transcript, 0-based
      empathy_appeal: bool, economic_appeal: bool, outside_option_claim: bool, personal_story: bool,
      hostility_or_threat: bool, explicit_offer: { type: Type.NUMBER, nullable: true },
      acknowledges_buyer: bool, counteroffer: bool, holds_firm: bool, concedes: bool, reciprocates: bool,
    },
    required: ['index', 'empathy_appeal', 'economic_appeal', 'outside_option_claim', 'personal_story', 'hostility_or_threat',
      'acknowledges_buyer', 'counteroffer', 'holds_firm', 'concedes', 'reciprocates'],
  },
};

(async () => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  await connectDB();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const coded = fs.existsSync(CODED_PATH) ? JSON.parse(fs.readFileSync(CODED_PATH, 'utf8')) : {};
  const participants = await Participant.find({ completed: true }).lean();

  for (const p of participants) {
    if (coded[p.participantId]) continue;
    const msgs = p.messages.filter(m => m.turnNumber > 0);   // skip Max's fixed opening line
    const transcript = msgs.map((m, i) => `[${i}] ${m.role === 'user' ? 'BUYER' : 'SELLER'}: ${m.content}`).join('\n');
    try {
      const resp = await ai.models.generateContent({
        model: MODEL,
        contents: [{ role: 'user', parts: [{ text: `${RUBRIC}\n\nTRANSCRIPT:\n${transcript}` }] }],
        config: { temperature: 0, responseMimeType: 'application/json', responseSchema: SCHEMA, thinkingConfig: { thinkingBudget: 0 } },
      });
      const codes = JSON.parse(resp.text);
      coded[p.participantId] = codes.map(c => ({ ...c, turn: msgs[c.index]?.turnNumber, role: msgs[c.index]?.role }));
      console.log(`coded ${p.participantId} (${codes.length} messages)`);
      fs.writeFileSync(CODED_PATH, JSON.stringify(coded, null, 1));
    } catch (e) {
      console.error(`FAILED ${p.participantId}: ${String(e.message || e).slice(0, 200)} (rerun later; coded ones are kept)`);
      if (/429|RESOURCE_EXHAUSTED/.test(String(e.message || e))) break;   // out of quota → stop cleanly
    }
  }

  // Human double-coding sample (~20% of participants, buyer messages only, NO condition column)
  if (!fs.existsSync(SAMPLE_PATH)) {
    const ids = participants.map(p => p.participantId).sort(() => Math.random() - 0.5).slice(0, Math.max(5, Math.ceil(participants.length * 0.2)));
    const esc = s => `"${String(s).replace(/"/g, '""')}"`;
    const rows = ['participant_id,turn,message,empathy_appeal,economic_appeal,outside_option_claim'];
    for (const p of participants.filter(p => ids.includes(p.participantId))) {
      for (const m of p.messages.filter(m => m.role === 'user')) rows.push([p.participantId, m.turnNumber, esc(m.content), '', '', ''].join(','));
    }
    fs.writeFileSync(SAMPLE_PATH, rows.join('\n'));
    console.log(`wrote ${SAMPLE_PATH} — fill the 3 code columns with 0/1, save as human_codes.csv`);
  }
  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
