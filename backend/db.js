// db.js — MongoDB connection using Mongoose
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  turnNumber: { type: Number, required: true },          // 0 = Max's opening line
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  // assistant: Max's ask after this reply. user: buyer's explicit offer (null if none).
  priceOffered: { type: Number, default: null },
  pricesMentioned: { type: [Number], default: [] },      // every $ amount in the message (regex)
  latencyMs: { type: Number, default: null },            // LLM latency (assistant)
  guard: { type: mongoose.Schema.Types.Mixed, default: null }, // {attempts, violations, fallback}
  timestamp: { type: Date, default: Date.now },
});

const participantSchema = new mongoose.Schema({
  participantId: { type: String, required: true, unique: true },
  condition: { type: String, enum: ['empathy', 'economic', 'control'], required: true },
  createdAt: { type: Date, default: Date.now },

  // Reproducibility: exact LLM setup used for this participant
  llmModel: { type: String, default: null },
  promptVersion: { type: String, default: null },
  temperature: { type: Number, default: null },
  seed: { type: Number, default: null },
  device: { type: String, default: null },               // 'mobile' | 'desktop'

  // Pre-survey
  preSurveyDone: { type: Boolean, default: false },
  preSurveyAt: { type: Date, default: null },
  age: { type: Number, default: null },
  gender: { type: String, default: null },
  education: { type: String, default: null },
  englishFluency: { type: Number, default: null },       // 1-7
  negotiationExp: { type: Number, default: null },       // 1-7
  haggleComfort: { type: Number, default: null },        // 1-7
  usedElectronicsFreq: { type: Number, default: null },  // 1-7
  llmUsage: { type: Number, default: null },             // 1-7
  aiHasFeelings: { type: Number, default: null },        // 1-7
  fairPriceGuess: { type: Number, default: null },       // $ before chat
  maxWillingToPay: { type: Number, default: null },      // $ before chat
  empathyItems: { type: [Number], default: [] },         // raw responses (IRI-EC 7 items)
  trustItems: { type: [Number], default: [] },           // raw responses (5 items)
  traitEmpathy: { type: Number, default: null },         // mean after reverse-scoring
  aiTrust: { type: Number, default: null },              // mean after reverse-scoring
  preAttentionPass: { type: Boolean, default: null },

  // Chat conversation
  messages: [messageSchema],
  chatStartedAt: { type: Date, default: null },
  chatEnded: { type: Boolean, default: false },
  endReason: { type: String, enum: ['deal', 'walked_away', 'max_turns', null], default: null },

  // Outcome (updated every turn so no-deal participants still have a final position)
  lastSellerAsk: { type: Number, default: null },
  lastBuyerOffer: { type: Number, default: null },
  firstBuyerOffer: { type: Number, default: null },
  finalPrice: { type: Number, default: null },           // only if deal
  turnsTaken: { type: Number, default: null },
  dealReached: { type: Boolean, default: false },
  firstConcession: { type: Number, default: null },      // $ drop of Max's first ask below $500
  firstConcessionTurn: { type: Number, default: null },
  concessionRate: { type: Number, default: null },       // (500 - ask)/500 ; final price if deal else last ask
  buyerSurplus: { type: Number, default: null },         // BUYER_VALUE - finalPrice (deal only)
  guardEvents: { type: Number, default: 0 },             // # of turns where a validation rule fired

  // Post-survey
  manipEmpathy: { type: Number, default: null },         // 1-7 "I used emotional/personal arguments"
  manipEconomic: { type: Number, default: null },        // 1-7 "I used rational/economic arguments"
  manipulationCheck: { type: String, default: null },    // derived label from the two items
  strategyText: { type: String, default: null },
  fairness: { type: Number, default: null },
  satisfaction: { type: Number, default: null },
  strategyEffect: { type: Number, default: null },
  sviItems: { type: [Number], default: [] },             // raw 8 items
  sviOutcome: { type: Number, default: null },
  sviSelf: { type: Number, default: null },
  sviProcess: { type: Number, default: null },
  sviRelationship: { type: Number, default: null },
  sviTotal: { type: Number, default: null },
  maxWarmth: { type: Number, default: null },
  maxUnderstood: { type: Number, default: null },
  believedLimit: { type: Number, default: null },
  realism: { type: Number, default: null },
  effort: { type: Number, default: null },
  truthfulness: { type: String, default: null },         // all_true | some_untrue | mostly_untrue | none_mentioned
  studyGuess: { type: String, default: null },
  postAttentionPass: { type: Boolean, default: null },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
});

const Participant = mongoose.model('Participant', participantSchema);

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set in environment variables / .env');
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB successfully.');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
}

module.exports = { connectDB, Participant };
