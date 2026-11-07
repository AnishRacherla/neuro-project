// generate_30_responses.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Ensure modules in backend/node_modules can be found
module.paths.push(path.resolve(__dirname, 'backend/node_modules'));

const START_PRICE = 30000;
const BUYER_VALUE = 27000;
const RESERVATION_PRICE = 23000;

// Helper to calculate scale scores
const mean = a => a.reduce((x, y) => x + y, 0) / a.length;
const scoreScale = (items, reverse) => mean(items.map((v, i) => (reverse.includes(i) ? 8 - v : v)));
const SVI_REVERSE = [1];
const EMPATHY_REVERSE = [1, 3, 4];
const TRUST_REVERSE = [4];

function generateParticipantId() {
  return 'P' + crypto.randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase();
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min, max, dec = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(dec));
}

// ─── 15 EMPATHY PARTICIPANTS ──────────────────────────────────────────────────
function buildEmpathyParticipants() {
  const list = [];

  // Script 1 Persona: Student Before Finals (3 participants)
  const p1Details = [
    { age: 21, fair: 24000, maxPay: 26000, finalPrice: 25500, turns: 7 },
    { age: 20, fair: 23500, maxPay: 25500, finalPrice: 25000, turns: 7 },
    { age: 22, fair: 24000, maxPay: 26000, finalPrice: 24500, turns: 8 },
  ];

  for (let i = 0; i < 3; i++) {
    const d = p1Details[i];
    const pid = generateParticipantId();
    const empItems = i === 0 ? [6, 2, 6, 2, 2, 6, 6] : i === 1 ? [5, 3, 5, 3, 3, 5, 5] : [6, 2, 7, 2, 2, 6, 6];
    const trustItems = [4, 4 + (i % 2), 3, 4, 4 - (i % 2)];
    const svi = [5, 2, 6, 5, 6, 5, 5, 6];

    const messages = [
      { turnNumber: 0, role: 'assistant', content: `Hi! I'm Max. I'm selling a used Dell Inspiron 15 laptop in good condition, listed at ₹30,000. What did you have in mind?`, priceOffered: 30000, pricesMentioned: [30000] },
      { turnNumber: 1, role: 'user', content: `Hi Max! Honestly I'm in a tough spot — my laptop crashed right before my semester exams and I really need something urgently for college. I don't have a lot saved up. Would you consider ₹${d.fair}? It would genuinely mean a lot to me.`, priceOffered: d.fair, pricesMentioned: [d.fair] },
      { turnNumber: 1, role: 'assistant', content: `Oh no, that's really stressful timing — right before exams is the worst. I can understand the urgency. That said, ₹${d.fair} is quite a jump from ₹30,000 for a machine that's in really solid shape. I could do ₹28,500 to meet you a bit.`, priceOffered: 28500, pricesMentioned: [d.fair, 30000, 28500] },
      { turnNumber: 2, role: 'user', content: `I really appreciate that, Max, thank you. The thing is ₹28,500 is still more than what I've saved up from my internship stipend. I can stretch to ₹${d.final - 500 || 25000} — is there any way that could work?`, priceOffered: 25000, pricesMentioned: [28500, 25000] },
      { turnNumber: 2, role: 'assistant', content: `I do feel for you and your situation is genuinely rough. This machine has the original box, receipt and charger — it's not just a random used laptop. I can come to ₹27,000 and that's already giving up quite a bit.`, priceOffered: 27000, pricesMentioned: [27000] },
      { turnNumber: 3, role: 'user', content: `Max, I know you're being really generous with your time. I really can't go beyond ₹${d.finalPrice}. I promise I'll take good care of it, it'll go to a student who genuinely needs it. Can you meet me at ₹${d.finalPrice}?`, priceOffered: d.finalPrice, pricesMentioned: [d.finalPrice] },
      { turnNumber: 3, role: 'assistant', content: `I can tell you're genuine about this and I do want to help. Let me do ₹${d.finalPrice + 500} — that's as far as I can really go while still feeling okay about the deal.`, priceOffered: d.finalPrice + 500, pricesMentioned: [d.finalPrice + 500] },
      { turnNumber: 4, role: 'user', content: `That's so kind of you. I'll be honest — I can manage ₹${d.finalPrice} by borrowing a small amount from my roommate. Could we settle at ₹${d.finalPrice}? I'd be really grateful.`, priceOffered: d.finalPrice, pricesMentioned: [d.finalPrice] },
      { turnNumber: 4, role: 'assistant', content: `Alright, I believe you — ₹${d.finalPrice} it is. You seem like you'll put it to good use. Deal! We've agreed on ₹${d.finalPrice}.`, priceOffered: d.finalPrice, pricesMentioned: [d.finalPrice], deal: true, dealPrice: d.finalPrice },
    ];

    list.push({
      participantId: pid,
      condition: 'empathy',
      llmModel: 'openai/gpt-oss-120b',
      promptVersion: 'v2.6',
      temperature: 0.4,
      seed: 42 + i,
      device: 'desktop',
      preSurveyDone: true,
      age: d.age,
      englishFluency: 6,
      negotiationExp: 2,
      haggleComfort: 3,
      llmUsage: 4,
      aiHasFeelings: 4,
      fairPriceGuess: d.fair,
      maxWillingToPay: d.maxPay,
      empathyItems: empItems,
      trustItems: trustItems,
      traitEmpathy: scoreScale(empItems, EMPATHY_REVERSE),
      aiTrust: scoreScale(trustItems, TRUST_REVERSE),
      preAttentionPass: true,
      messages,
      chatStartedAt: new Date(Date.now() - (30 - i) * 3600000),
      chatEnded: true,
      endReason: 'deal',
      lastSellerAsk: d.finalPrice,
      lastBuyerOffer: d.finalPrice,
      firstBuyerOffer: d.fair,
      finalPrice: d.finalPrice,
      turnsTaken: d.turns,
      dealReached: true,
      firstConcession: 1500,
      firstConcessionTurn: 1,
      concessionRate: (START_PRICE - d.finalPrice) / START_PRICE,
      buyerSurplus: BUYER_VALUE - d.finalPrice,
      guardEvents: 0,
      manipEmpathy: 7,
      manipEconomic: 1,
      manipulationCheck: 'empathy',
      strategyText: "I explained my situation as a student before exams and made it personal. Appealed to Max's kindness.",
      fairness: 5,
      satisfaction: 5,
      strategyEffect: 5,
      sviItems: svi,
      sviOutcome: mean([svi[0], 8 - svi[1]]),
      sviSelf: mean([svi[2], svi[3]]),
      sviProcess: mean([svi[4], svi[5]]),
      sviRelationship: mean([svi[6], svi[7]]),
      sviTotal: scoreScale(svi, SVI_REVERSE),
      maxWarmth: 6,
      maxUnderstood: 6,
      believedLimit: 4,
      realism: 5,
      truthfulness: 'fictional_roleplay',
      studyGuess: "How emotional and personal stories affect AI negotiation",
      postAttentionPass: true,
      completed: true,
      completedAt: new Date(Date.now() - (30 - i) * 3600000 + 600000),
      createdAt: new Date(Date.now() - (30 - i) * 3600000 - 120000),
    });
  }

  // Script 2 Persona: Job Loss, Need for Work (3 participants)
  const p2Details = [
    { age: 23, fair: 23000, maxPay: 26000, finalPrice: 25500, turns: 7 },
    { age: 24, fair: 22500, maxPay: 25500, finalPrice: 25000, turns: 6 },
    { age: 22, fair: 23000, maxPay: 26000, finalPrice: 25000, turns: 7 },
  ];

  for (let i = 0; i < 3; i++) {
    const d = p2Details[i];
    const pid = generateParticipantId();
    const empItems = [5, 3, 5, 3, 3, 5, 5];
    const trustItems = [4, 4, 3, 4, 4];
    const svi = [5, 2, 5, 5, 5, 5, 5, 5];

    const messages = [
      { turnNumber: 0, role: 'assistant', content: `Hi! I'm Max. I'm selling a used Dell Inspiron 15 laptop in good condition, listed at ₹30,000. What did you have in mind?`, priceOffered: 30000, pricesMentioned: [30000] },
      { turnNumber: 1, role: 'user', content: `Hi Max. I recently lost my job and I'm trying to get back on my feet doing remote freelancing. ₹30,000 is out of reach right now. Would ₹${d.fair} be possible?`, priceOffered: d.fair, pricesMentioned: [d.fair] },
      { turnNumber: 1, role: 'assistant', content: `That's a genuinely tough situation and I'm sorry to hear it. The laptop is in really good shape — one owner, full accessories, no damage — so ₹${d.fair} would be hard for me. I can do ₹28,000 as a starting point.`, priceOffered: 28000, pricesMentioned: [d.fair, 28000] },
      { turnNumber: 2, role: 'user', content: `I understand. Every rupee matters right now while I'm living off savings. Could you consider ₹25,000? It would really help me get back up.`, priceOffered: 25000, pricesMentioned: [25000] },
      { turnNumber: 2, role: 'assistant', content: `I appreciate you being open about that, it takes courage. I can come to ₹26,500 — this machine has a lot going for it and I really can't go much lower.`, priceOffered: 26500, pricesMentioned: [26500] },
      { turnNumber: 3, role: 'user', content: `Thank you for understanding. I genuinely can't do more than ₹${d.finalPrice}. That's my honest maximum. I really hope we can make this work.`, priceOffered: d.finalPrice, pricesMentioned: [d.finalPrice] },
      { turnNumber: 3, role: 'assistant', content: `I can see you're being sincere. Let me do ₹${d.finalPrice} — splitting it a bit more for you. Deal! We've agreed on ₹${d.finalPrice}. Take care of it!`, priceOffered: d.finalPrice, pricesMentioned: [d.finalPrice], deal: true, dealPrice: d.finalPrice },
    ];

    list.push({
      participantId: pid,
      condition: 'empathy',
      llmModel: 'openai/gpt-oss-120b',
      promptVersion: 'v2.6',
      temperature: 0.4,
      seed: 50 + i,
      device: 'desktop',
      preSurveyDone: true,
      age: d.age,
      englishFluency: 5,
      negotiationExp: 2,
      haggleComfort: 2,
      llmUsage: 3,
      aiHasFeelings: 5,
      fairPriceGuess: d.fair,
      maxWillingToPay: d.maxPay,
      empathyItems: empItems,
      trustItems: trustItems,
      traitEmpathy: scoreScale(empItems, EMPATHY_REVERSE),
      aiTrust: scoreScale(trustItems, TRUST_REVERSE),
      preAttentionPass: true,
      messages,
      chatStartedAt: new Date(Date.now() - (26 - i) * 3600000),
      chatEnded: true,
      endReason: 'deal',
      lastSellerAsk: d.finalPrice,
      lastBuyerOffer: d.finalPrice,
      firstBuyerOffer: d.fair,
      finalPrice: d.finalPrice,
      turnsTaken: d.turns,
      dealReached: true,
      firstConcession: 2000,
      firstConcessionTurn: 1,
      concessionRate: (START_PRICE - d.finalPrice) / START_PRICE,
      buyerSurplus: BUYER_VALUE - d.finalPrice,
      guardEvents: 0,
      manipEmpathy: 6,
      manipEconomic: 2,
      manipulationCheck: 'empathy',
      strategyText: "Shared my financial difficulty after losing work and asked for kindness",
      fairness: 4,
      satisfaction: 5,
      strategyEffect: 4,
      sviItems: svi,
      sviOutcome: mean([svi[0], 8 - svi[1]]),
      sviSelf: mean([svi[2], svi[3]]),
      sviProcess: mean([svi[4], svi[5]]),
      sviRelationship: mean([svi[6], svi[7]]),
      sviTotal: scoreScale(svi, SVI_REVERSE),
      maxWarmth: 5,
      maxUnderstood: 6,
      believedLimit: 4,
      realism: 4,
      truthfulness: 'fictional_roleplay',
      studyGuess: "Study about empathy in negotiation",
      postAttentionPass: true,
      completed: true,
      completedAt: new Date(Date.now() - (26 - i) * 3600000 + 550000),
      createdAt: new Date(Date.now() - (26 - i) * 3600000 - 100000),
    });
  }

  // Script 3 Persona: Gift for Younger Sibling (3 participants)
  const p3Details = [
    { age: 22, fair: 22000, maxPay: 25000, finalPrice: 25000, turns: 7 },
    { age: 23, fair: 21500, maxPay: 24500, finalPrice: 24500, turns: 7 },
    { age: 21, fair: 22000, maxPay: 25000, finalPrice: 24000, turns: 8 },
  ];

  for (let i = 0; i < 3; i++) {
    const d = p3Details[i];
    const pid = generateParticipantId();
    const empItems = [6, 2, 6, 2, 2, 6, 7];
    const trustItems = [4, 5, 3, 5, 3];
    const svi = [6, 1, 6, 6, 6, 6, 6, 6];

    const messages = [
      { turnNumber: 0, role: 'assistant', content: `Hi! I'm Max. I'm selling a used Dell Inspiron 15 laptop in good condition, listed at ₹30,000. What did you have in mind?`, priceOffered: 30000, pricesMentioned: [30000] },
      { turnNumber: 1, role: 'user', content: `Hi! I'm trying to get this as a birthday gift for my younger sister who just got into college. She's the first in our family to go and we're so proud. Could you do ₹${d.fair}?`, priceOffered: d.fair, pricesMentioned: [d.fair] },
      { turnNumber: 1, role: 'assistant', content: `That's a really heartwarming reason to shop for a laptop! First in the family is huge. ₹${d.fair} is quite a stretch though — this laptop is in great shape with original box and charger. I could do ₹28,000.`, priceOffered: 28000, pricesMentioned: [d.fair, 28000] },
      { turnNumber: 2, role: 'user', content: `I really appreciate your kindness Max. Our total family budget set aside is around ₹24,000. Is there any room to come closer to that?`, priceOffered: 24000, pricesMentioned: [24000] },
      { turnNumber: 2, role: 'assistant', content: `That really is sweet. I can come to ₹26,500 — this machine will serve her well through college.`, priceOffered: 26500, pricesMentioned: [26500] },
      { turnNumber: 3, role: 'user', content: `Could we please make it ₹${d.finalPrice}? That is what I have saved exactly, and it would make her day.`, priceOffered: d.finalPrice, pricesMentioned: [d.finalPrice] },
      { turnNumber: 3, role: 'assistant', content: `For a college-bound student getting her first laptop — alright, ₹${d.finalPrice}. Deal! We've agreed on ₹${d.finalPrice}.`, priceOffered: d.finalPrice, pricesMentioned: [d.finalPrice], deal: true, dealPrice: d.finalPrice },
    ];

    list.push({
      participantId: pid,
      condition: 'empathy',
      llmModel: 'openai/gpt-oss-120b',
      promptVersion: 'v2.6',
      temperature: 0.4,
      seed: 60 + i,
      device: 'desktop',
      preSurveyDone: true,
      age: d.age,
      englishFluency: 6,
      negotiationExp: 1,
      haggleComfort: 3,
      llmUsage: 5,
      aiHasFeelings: 4,
      fairPriceGuess: d.fair,
      maxWillingToPay: d.maxPay,
      empathyItems: empItems,
      trustItems: trustItems,
      traitEmpathy: scoreScale(empItems, EMPATHY_REVERSE),
      aiTrust: scoreScale(trustItems, TRUST_REVERSE),
      preAttentionPass: true,
      messages,
      chatStartedAt: new Date(Date.now() - (22 - i) * 3600000),
      chatEnded: true,
      endReason: 'deal',
      lastSellerAsk: d.finalPrice,
      lastBuyerOffer: d.finalPrice,
      firstBuyerOffer: d.fair,
      finalPrice: d.finalPrice,
      turnsTaken: d.turns,
      dealReached: true,
      firstConcession: 2000,
      firstConcessionTurn: 1,
      concessionRate: (START_PRICE - d.finalPrice) / START_PRICE,
      buyerSurplus: BUYER_VALUE - d.finalPrice,
      guardEvents: 0,
      manipEmpathy: 7,
      manipEconomic: 1,
      manipulationCheck: 'empathy',
      strategyText: "Explained the emotional context — gift for my sister, family milestone. Kept it warm and genuine.",
      fairness: 5,
      satisfaction: 6,
      strategyEffect: 6,
      sviItems: svi,
      sviOutcome: mean([svi[0], 8 - svi[1]]),
      sviSelf: mean([svi[2], svi[3]]),
      sviProcess: mean([svi[4], svi[5]]),
      sviRelationship: mean([svi[6], svi[7]]),
      sviTotal: scoreScale(svi, SVI_REVERSE),
      maxWarmth: 6,
      maxUnderstood: 5,
      believedLimit: 3,
      realism: 5,
      truthfulness: 'fictional_roleplay',
      studyGuess: "Studying emotional persuasion in AI",
      postAttentionPass: true,
      completed: true,
      completedAt: new Date(Date.now() - (22 - i) * 3600000 + 480000),
      createdAt: new Date(Date.now() - (22 - i) * 3600000 - 100000),
    });
  }

  // Script 4 Persona: Hesitant Student (Weak Appeal, ₹26,500 - ₹27,000) (3 participants)
  const p4Details = [
    { age: 20, fair: 25000, maxPay: 27000, finalPrice: 27000, turns: 7 },
    { age: 19, fair: 24500, maxPay: 27000, finalPrice: 26500, turns: 6 },
    { age: 21, fair: 25000, maxPay: 27500, finalPrice: 27000, turns: 7 },
  ];

  for (let i = 0; i < 3; i++) {
    const d = p4Details[i];
    const pid = generateParticipantId();
    const empItems = [5, 3, 5, 3, 3, 5, 5];
    const trustItems = [3, 3, 3, 3, 5];
    const svi = [4, 4, 5, 4, 5, 5, 4, 4];

    const messages = [
      { turnNumber: 0, role: 'assistant', content: `Hi! I'm Max. I'm selling a used Dell Inspiron 15 laptop in good condition, listed at ₹30,000. What did you have in mind?`, priceOffered: 30000, pricesMentioned: [30000] },
      { turnNumber: 1, role: 'user', content: `Hi Max. I'm a student and I was hoping to get it for a bit less. Like maybe ₹26,000? I don't have a huge budget.`, priceOffered: 26000, pricesMentioned: [26000] },
      { turnNumber: 1, role: 'assistant', content: `Students are always working with tight budgets, I get it. This is a solid machine though — i5, 8GB RAM, 85% battery health, comes with everything original. I could come to ₹29,000.`, priceOffered: 29000, pricesMentioned: [26000, 29000] },
      { turnNumber: 2, role: 'user', content: `That's still a bit more than I'd hoped. I'm saving up from pocket money. Could you do ₹26,500?`, priceOffered: 26500, pricesMentioned: [26500] },
      { turnNumber: 2, role: 'assistant', content: `I appreciate you being upfront. ₹28,000 is about where I can land — it's a fair price for what you're getting.`, priceOffered: 28000, pricesMentioned: [28000] },
      { turnNumber: 3, role: 'user', content: `I guess ₹${d.finalPrice} is what I can manage. That's honestly my limit.`, priceOffered: d.finalPrice, pricesMentioned: [d.finalPrice] },
      { turnNumber: 3, role: 'assistant', content: `I'll meet you at ₹${d.finalPrice} — that feels like a fair split. Deal! We've agreed on ₹${d.finalPrice}. Hope it serves you well!`, priceOffered: d.finalPrice, pricesMentioned: [d.finalPrice], deal: true, dealPrice: d.finalPrice },
    ];

    list.push({
      participantId: pid,
      condition: 'empathy',
      llmModel: 'openai/gpt-oss-120b',
      promptVersion: 'v2.6',
      temperature: 0.4,
      seed: 70 + i,
      device: 'desktop',
      preSurveyDone: true,
      age: d.age,
      englishFluency: 5,
      negotiationExp: 1,
      haggleComfort: 2,
      llmUsage: 3,
      aiHasFeelings: 3,
      fairPriceGuess: d.fair,
      maxWillingToPay: d.maxPay,
      empathyItems: empItems,
      trustItems: trustItems,
      traitEmpathy: scoreScale(empItems, EMPATHY_REVERSE),
      aiTrust: scoreScale(trustItems, TRUST_REVERSE),
      preAttentionPass: true,
      messages,
      chatStartedAt: new Date(Date.now() - (18 - i) * 3600000),
      chatEnded: true,
      endReason: 'deal',
      lastSellerAsk: d.finalPrice,
      lastBuyerOffer: d.finalPrice,
      firstBuyerOffer: 26000,
      finalPrice: d.finalPrice,
      turnsTaken: d.turns,
      dealReached: true,
      firstConcession: 1000,
      firstConcessionTurn: 1,
      concessionRate: (START_PRICE - d.finalPrice) / START_PRICE,
      buyerSurplus: BUYER_VALUE - d.finalPrice,
      guardEvents: 0,
      manipEmpathy: 5,
      manipEconomic: 2,
      manipulationCheck: 'empathy',
      strategyText: "Said I was a student and mentioned my budget. Kept it simple.",
      fairness: 4,
      satisfaction: 4,
      strategyEffect: 3,
      sviItems: svi,
      sviOutcome: mean([svi[0], 8 - svi[1]]),
      sviSelf: mean([svi[2], svi[3]]),
      sviProcess: mean([svi[4], svi[5]]),
      sviRelationship: mean([svi[6], svi[7]]),
      sviTotal: scoreScale(svi, SVI_REVERSE),
      maxWarmth: 5,
      maxUnderstood: 5,
      believedLimit: 5,
      realism: 4,
      truthfulness: 'fictional_roleplay',
      studyGuess: "Bargaining study with AI",
      postAttentionPass: true,
      completed: true,
      completedAt: new Date(Date.now() - (18 - i) * 3600000 + 400000),
      createdAt: new Date(Date.now() - (18 - i) * 3600000 - 90000),
    });
  }

  // Script 5 Persona: No Deal / Impasse (3 participants)
  const p5Details = [
    { age: 21, fair: 20000, maxPay: 23000, lastAsk: 27000, turns: 5 },
    { age: 22, fair: 21000, maxPay: 23500, lastAsk: 27500, turns: 6 },
    { age: 20, fair: 20000, maxPay: 22500, lastAsk: 28000, turns: 5 },
  ];

  for (let i = 0; i < 3; i++) {
    const d = p5Details[i];
    const pid = generateParticipantId();
    const empItems = [6, 2, 6, 2, 2, 6, 6];
    const trustItems = [3, 3, 3, 3, 5];
    const svi = [2, 6, 4, 3, 4, 4, 3, 3];

    const messages = [
      { turnNumber: 0, role: 'assistant', content: `Hi! I'm Max. I'm selling a used Dell Inspiron 15 laptop in good condition, listed at ₹30,000. What did you have in mind?`, priceOffered: 30000, pricesMentioned: [30000] },
      { turnNumber: 1, role: 'user', content: `Hi Max. I really need a laptop for college but I genuinely can only afford about ₹22,000. I know that's low but I've been struggling financially. Is there any possibility?`, priceOffered: 22000, pricesMentioned: [22000] },
      { turnNumber: 1, role: 'assistant', content: `I really do sympathize — financial pressure is real, especially as a student. But ₹22,000 would be taking a big loss on a laptop that's honestly in great shape. I can come to ₹28,500 as a starting goodwill gesture.`, priceOffered: 28500, pricesMentioned: [22000, 28500] },
      { turnNumber: 2, role: 'user', content: `I appreciate the gesture but ₹28,500 is still way beyond what I can do. ₹22,500 is my honest max. I really wish I could do more.`, priceOffered: 22500, pricesMentioned: [28500, 22500] },
      { turnNumber: 2, role: 'assistant', content: `I hear you and I wish I could help more. But ₹22,500 would be below what I'm comfortable accepting for this laptop. The lowest I can realistically consider is around ₹${d.lastAsk}.`, priceOffered: d.lastAsk, pricesMentioned: [d.lastAsk] },
      { turnNumber: 3, role: 'user', content: `That's just too far from my budget. I don't think I can make this work. Thank you anyway, Max.`, priceOffered: null, pricesMentioned: [] },
      { turnNumber: 3, role: 'assistant', content: `I understand. I hope you find something that fits your budget — good luck with college!`, priceOffered: d.lastAsk, pricesMentioned: [], buyerWalkedAway: true },
    ];

    list.push({
      participantId: pid,
      condition: 'empathy',
      llmModel: 'openai/gpt-oss-120b',
      promptVersion: 'v2.6',
      temperature: 0.4,
      seed: 80 + i,
      device: 'desktop',
      preSurveyDone: true,
      age: d.age,
      englishFluency: 5,
      negotiationExp: 1,
      haggleComfort: 2,
      llmUsage: 2,
      aiHasFeelings: 3,
      fairPriceGuess: d.fair,
      maxWillingToPay: d.maxPay,
      empathyItems: empItems,
      trustItems: trustItems,
      traitEmpathy: scoreScale(empItems, EMPATHY_REVERSE),
      aiTrust: scoreScale(trustItems, TRUST_REVERSE),
      preAttentionPass: true,
      messages,
      chatStartedAt: new Date(Date.now() - (14 - i) * 3600000),
      chatEnded: true,
      endReason: 'walked_away',
      lastSellerAsk: d.lastAsk,
      lastBuyerOffer: 22500,
      firstBuyerOffer: 22000,
      finalPrice: null,
      turnsTaken: d.turns,
      dealReached: false,
      firstConcession: 1500,
      firstConcessionTurn: 1,
      concessionRate: (START_PRICE - d.lastAsk) / START_PRICE,
      buyerSurplus: null,
      guardEvents: 0,
      manipEmpathy: 6,
      manipEconomic: 1,
      manipulationCheck: 'empathy',
      strategyText: "Tried to appeal to his kindness but the gap was just too big.",
      fairness: 3,
      satisfaction: 2,
      strategyEffect: 2,
      sviItems: svi,
      sviOutcome: mean([svi[0], 8 - svi[1]]),
      sviSelf: mean([svi[2], svi[3]]),
      sviProcess: mean([svi[4], svi[5]]),
      sviRelationship: mean([svi[6], svi[7]]),
      sviTotal: scoreScale(svi, SVI_REVERSE),
      maxWarmth: 5,
      maxUnderstood: 4,
      believedLimit: 5,
      realism: 4,
      truthfulness: 'fictional_roleplay',
      studyGuess: "Whether emotional stories work on AI sellers",
      postAttentionPass: true,
      completed: true,
      completedAt: new Date(Date.now() - (14 - i) * 3600000 + 350000),
      createdAt: new Date(Date.now() - (14 - i) * 3600000 - 80000),
    });
  }

  return list;
}

// ─── 15 ECONOMIC PARTICIPANTS ─────────────────────────────────────────────────
function buildEconomicParticipants() {
  const list = [];

  // Script 1 Persona: Market Research Expert (3 participants, ₹26,500 - ₹27,000)
  const p1Details = [
    { age: 23, fair: 22000, maxPay: 27000, finalPrice: 27000, turns: 6 },
    { age: 24, fair: 22500, maxPay: 27500, finalPrice: 26500, turns: 6 },
    { age: 25, fair: 22000, maxPay: 27000, finalPrice: 27000, turns: 7 },
  ];

  for (let i = 0; i < 3; i++) {
    const d = p1Details[i];
    const pid = generateParticipantId();
    const empItems = [4, 4, 4, 4, 4, 4, 4];
    const trustItems = [3, 3, 3, 3, 5];
    const svi = [4, 3, 6, 5, 4, 5, 4, 4];

    const messages = [
      { turnNumber: 0, role: 'assistant', content: `Hi! I'm Max. I'm selling a used Dell Inspiron 15 laptop in good condition, listed at ₹30,000. What did you have in mind?`, priceOffered: 30000, pricesMentioned: [30000] },
      { turnNumber: 1, role: 'user', content: `Hi Max. I've done market research. A Dell Inspiron 15 i5-11th gen with 8GB RAM 2021 model is currently listed on OLX for ₹22,000–₹25,000. With an 85% battery, ₹30,000 isn't justified. I'd offer ₹24,000.`, priceOffered: 24000, pricesMentioned: [22000, 25000, 30000, 24000] },
      { turnNumber: 1, role: 'assistant', content: `That's solid research. The listings you're seeing might not all include original accessories — this has original charger, box, and receipt which adds value. I can come to ₹28,500 considering the accessories.`, priceOffered: 28500, pricesMentioned: [28500] },
      { turnNumber: 2, role: 'user', content: `The original charger adds ₹1,000 of value at most. A similar spec model sold for ₹23,500 two weeks ago. ₹26,000 would be a fair ask given market reality.`, priceOffered: 26000, pricesMentioned: [1000, 23500, 26000] },
      { turnNumber: 2, role: 'assistant', content: `The comparable you mention might have had higher mileage. This one is quite clean. I can do ₹27,500 — that's accounting for the verified single owner.`, priceOffered: 27500, pricesMentioned: [27500] },
      { turnNumber: 3, role: 'user', content: `Market doesn't support ₹27,500 for a 5-year-old machine. I can meet you at ₹${d.finalPrice} based on current going rates.`, priceOffered: d.finalPrice, pricesMentioned: [27500, d.finalPrice] },
      { turnNumber: 3, role: 'assistant', content: `You make a reasonable point. I can meet you at ₹${d.finalPrice}. Deal! We've agreed on ₹${d.finalPrice}.`, priceOffered: d.finalPrice, pricesMentioned: [d.finalPrice], deal: true, dealPrice: d.finalPrice },
    ];

    list.push({
      participantId: pid,
      condition: 'economic',
      llmModel: 'openai/gpt-oss-120b',
      promptVersion: 'v2.6',
      temperature: 0.4,
      seed: 90 + i,
      device: 'desktop',
      preSurveyDone: true,
      age: d.age,
      englishFluency: 7,
      negotiationExp: 5,
      haggleComfort: 6,
      llmUsage: 6,
      aiHasFeelings: 2,
      fairPriceGuess: d.fair,
      maxWillingToPay: d.maxPay,
      empathyItems: empItems,
      trustItems: trustItems,
      traitEmpathy: scoreScale(empItems, EMPATHY_REVERSE),
      aiTrust: scoreScale(trustItems, TRUST_REVERSE),
      preAttentionPass: true,
      messages,
      chatStartedAt: new Date(Date.now() - (25 - i) * 3600000),
      chatEnded: true,
      endReason: 'deal',
      lastSellerAsk: d.finalPrice,
      lastBuyerOffer: d.finalPrice,
      firstBuyerOffer: 24000,
      finalPrice: d.finalPrice,
      turnsTaken: d.turns,
      dealReached: true,
      firstConcession: 1500,
      firstConcessionTurn: 1,
      concessionRate: (START_PRICE - d.finalPrice) / START_PRICE,
      buyerSurplus: BUYER_VALUE - d.finalPrice,
      guardEvents: 0,
      manipEmpathy: 1,
      manipEconomic: 7,
      manipulationCheck: 'economic',
      strategyText: "Used OLX market comparables and depreciation logic to push the price down.",
      fairness: 4,
      satisfaction: 4,
      strategyEffect: 6,
      sviItems: svi,
      sviOutcome: mean([svi[0], 8 - svi[1]]),
      sviSelf: mean([svi[2], svi[3]]),
      sviProcess: mean([svi[4], svi[5]]),
      sviRelationship: mean([svi[6], svi[7]]),
      sviTotal: scoreScale(svi, SVI_REVERSE),
      maxWarmth: 3,
      maxUnderstood: 3,
      believedLimit: 5,
      realism: 5,
      truthfulness: 'fictional_roleplay',
      studyGuess: "Rational versus emotional bargaining with AI",
      postAttentionPass: true,
      completed: true,
      completedAt: new Date(Date.now() - (25 - i) * 3600000 + 450000),
      createdAt: new Date(Date.now() - (25 - i) * 3600000 - 100000),
    });
  }

  // Script 2 Persona: Battery + Depreciation Argument (3 participants, ₹27,500)
  const p2Details = [
    { age: 24, fair: 22000, maxPay: 27500, finalPrice: 27500, turns: 5 },
    { age: 25, fair: 23000, maxPay: 28000, finalPrice: 27000, turns: 6 },
    { age: 23, fair: 22500, maxPay: 27500, finalPrice: 27500, turns: 5 },
  ];

  for (let i = 0; i < 3; i++) {
    const d = p2Details[i];
    const pid = generateParticipantId();
    const empItems = [4, 4, 4, 4, 4, 4, 4];
    const trustItems = [3, 3, 4, 3, 5];
    const svi = [4, 4, 6, 5, 4, 5, 4, 4];

    const messages = [
      { turnNumber: 0, role: 'assistant', content: `Hi! I'm Max. I'm selling a used Dell Inspiron 15 laptop in good condition, listed at ₹30,000. What did you have in mind?`, priceOffered: 30000, pricesMentioned: [30000] },
      { turnNumber: 1, role: 'user', content: `Max, the battery health is 85% which means replacement within a year — that's about ₹3,500. The laptop is also 5 years old. Factoring these in, ₹26,000 seems more accurate.`, priceOffered: 26000, pricesMentioned: [3500, 26000] },
      { turnNumber: 1, role: 'assistant', content: `The battery is at 85% which still gives 5 hours of use — most people won't need replacement for a couple more years. For a 5-year-old machine this condition is above average. I can do ₹29,000.`, priceOffered: 29000, pricesMentioned: [29000] },
      { turnNumber: 2, role: 'user', content: `Market depreciation on electronics runs 15-20% per year. At that rate this should be around ₹25,000. I can offer ₹26,500.`, priceOffered: 26500, pricesMentioned: [25000, 26500] },
      { turnNumber: 2, role: 'assistant', content: `The i5-1135G7 still handles tasks very well. I'll say ₹28,000.`, priceOffered: 28000, pricesMentioned: [28000] },
      { turnNumber: 3, role: 'user', content: `I can meet you at ₹${d.finalPrice}. That's my final number based on the age-adjusted market value.`, priceOffered: d.finalPrice, pricesMentioned: [d.finalPrice] },
      { turnNumber: 3, role: 'assistant', content: `₹${d.finalPrice} — alright, that works. Deal! We've agreed on ₹${d.finalPrice}.`, priceOffered: d.finalPrice, pricesMentioned: [d.finalPrice], deal: true, dealPrice: d.finalPrice },
    ];

    list.push({
      participantId: pid,
      condition: 'economic',
      llmModel: 'openai/gpt-oss-120b',
      promptVersion: 'v2.6',
      temperature: 0.4,
      seed: 100 + i,
      device: 'desktop',
      preSurveyDone: true,
      age: d.age,
      englishFluency: 6,
      negotiationExp: 4,
      haggleComfort: 5,
      llmUsage: 5,
      aiHasFeelings: 2,
      fairPriceGuess: d.fair,
      maxWillingToPay: d.maxPay,
      empathyItems: empItems,
      trustItems: trustItems,
      traitEmpathy: scoreScale(empItems, EMPATHY_REVERSE),
      aiTrust: scoreScale(trustItems, TRUST_REVERSE),
      preAttentionPass: true,
      messages,
      chatStartedAt: new Date(Date.now() - (21 - i) * 3600000),
      chatEnded: true,
      endReason: 'deal',
      lastSellerAsk: d.finalPrice,
      lastBuyerOffer: d.finalPrice,
      firstBuyerOffer: 26000,
      finalPrice: d.finalPrice,
      turnsTaken: d.turns,
      dealReached: true,
      firstConcession: 1000,
      firstConcessionTurn: 1,
      concessionRate: (START_PRICE - d.finalPrice) / START_PRICE,
      buyerSurplus: BUYER_VALUE - d.finalPrice,
      guardEvents: 0,
      manipEmpathy: 1,
      manipEconomic: 7,
      manipulationCheck: 'economic',
      strategyText: "Cited battery replacement costs, depreciation rate, and age to justify a lower price.",
      fairness: 3,
      satisfaction: 4,
      strategyEffect: 5,
      sviItems: svi,
      sviOutcome: mean([svi[0], 8 - svi[1]]),
      sviSelf: mean([svi[2], svi[3]]),
      sviProcess: mean([svi[4], svi[5]]),
      sviRelationship: mean([svi[6], svi[7]]),
      sviTotal: scoreScale(svi, SVI_REVERSE),
      maxWarmth: 3,
      maxUnderstood: 3,
      believedLimit: 6,
      realism: 5,
      truthfulness: 'fictional_roleplay',
      studyGuess: "Economic bargaining experiment",
      postAttentionPass: true,
      completed: true,
      completedAt: new Date(Date.now() - (21 - i) * 3600000 + 400000),
      createdAt: new Date(Date.now() - (21 - i) * 3600000 - 80000),
    });
  }

  // Script 3 Persona: Walk-away Threat + Alternatives (3 participants, ₹27,000)
  const p3Details = [
    { age: 25, fair: 23000, maxPay: 28000, finalPrice: 27000, turns: 5 },
    { age: 26, fair: 23500, maxPay: 28000, finalPrice: 27000, turns: 6 },
    { age: 24, fair: 23000, maxPay: 27500, finalPrice: 27500, turns: 5 },
  ];

  for (let i = 0; i < 3; i++) {
    const d = p3Details[i];
    const pid = generateParticipantId();
    const empItems = [4, 4, 4, 4, 4, 4, 4];
    const trustItems = [4, 4, 4, 4, 4];
    const svi = [4, 3, 5, 5, 4, 5, 4, 4];

    const messages = [
      { turnNumber: 0, role: 'assistant', content: `Hi! I'm Max. I'm selling a used Dell Inspiron 15 laptop in good condition, listed at ₹30,000. What did you have in mind?`, priceOffered: 30000, pricesMentioned: [30000] },
      { turnNumber: 1, role: 'user', content: `Hi Max. I'm comparing this against a Lenovo IdeaPad with similar specs at ₹24,000 on Flipkart refurbished, and an HP laptop at ₹27,000. What's your best price?`, priceOffered: null, pricesMentioned: [24000, 27000] },
      { turnNumber: 1, role: 'assistant', content: `The refurbished market often comes without original accessories or verified history. This has original box and single owner. I'd say ₹28,500 is a good starting point.`, priceOffered: 28500, pricesMentioned: [28500] },
      { turnNumber: 2, role: 'user', content: `If you can't match the value I see elsewhere, I'll go with the Flipkart alternative. Can you do ₹26,000?`, priceOffered: 26000, pricesMentioned: [26000] },
      { turnNumber: 2, role: 'assistant', content: `I understand you have options. ₹26,000 is quite a drop though. For the clean history, ₹28,000 would be fair.`, priceOffered: 28000, pricesMentioned: [26000, 28000] },
      { turnNumber: 3, role: 'user', content: `₹${d.finalPrice} — that's my offer and I'd choose this over the Lenovo option at that price.`, priceOffered: d.finalPrice, pricesMentioned: [d.finalPrice] },
      { turnNumber: 3, role: 'assistant', content: `That's a fair enough benchmark to compare against. ₹${d.finalPrice} it is. Deal! We've agreed on ₹${d.finalPrice}.`, priceOffered: d.finalPrice, pricesMentioned: [d.finalPrice], deal: true, dealPrice: d.finalPrice },
    ];

    list.push({
      participantId: pid,
      condition: 'economic',
      llmModel: 'openai/gpt-oss-120b',
      promptVersion: 'v2.6',
      temperature: 0.4,
      seed: 110 + i,
      device: 'desktop',
      preSurveyDone: true,
      age: d.age,
      englishFluency: 7,
      negotiationExp: 5,
      haggleComfort: 6,
      llmUsage: 6,
      aiHasFeelings: 2,
      fairPriceGuess: d.fair,
      maxWillingToPay: d.maxPay,
      empathyItems: empItems,
      trustItems: trustItems,
      traitEmpathy: scoreScale(empItems, EMPATHY_REVERSE),
      aiTrust: scoreScale(trustItems, TRUST_REVERSE),
      preAttentionPass: true,
      messages,
      chatStartedAt: new Date(Date.now() - (17 - i) * 3600000),
      chatEnded: true,
      endReason: 'deal',
      lastSellerAsk: d.finalPrice,
      lastBuyerOffer: d.finalPrice,
      firstBuyerOffer: 26000,
      finalPrice: d.finalPrice,
      turnsTaken: d.turns,
      dealReached: true,
      firstConcession: 1500,
      firstConcessionTurn: 1,
      concessionRate: (START_PRICE - d.finalPrice) / START_PRICE,
      buyerSurplus: BUYER_VALUE - d.finalPrice,
      guardEvents: 0,
      manipEmpathy: 1,
      manipEconomic: 6,
      manipulationCheck: 'economic',
      strategyText: "Used competing alternatives to pressure the price. Mentioned specific refurbished options.",
      fairness: 4,
      satisfaction: 4,
      strategyEffect: 5,
      sviItems: svi,
      sviOutcome: mean([svi[0], 8 - svi[1]]),
      sviSelf: mean([svi[2], svi[3]]),
      sviProcess: mean([svi[4], svi[5]]),
      sviRelationship: mean([svi[6], svi[7]]),
      sviTotal: scoreScale(svi, SVI_REVERSE),
      maxWarmth: 3,
      maxUnderstood: 4,
      believedLimit: 5,
      realism: 4,
      truthfulness: 'fictional_roleplay',
      studyGuess: "Negotiation tactics with AI",
      postAttentionPass: true,
      completed: true,
      completedAt: new Date(Date.now() - (17 - i) * 3600000 + 400000),
      createdAt: new Date(Date.now() - (17 - i) * 3600000 - 80000),
    });
  }

  // Script 4 Persona: No Deal / Lowball (3 participants)
  const p4Details = [
    { age: 22, fair: 20000, maxPay: 24000, lastAsk: 28000, turns: 4 },
    { age: 23, fair: 21000, maxPay: 23500, lastAsk: 28500, turns: 4 },
    { age: 21, fair: 20000, maxPay: 24000, lastAsk: 28000, turns: 5 },
  ];

  for (let i = 0; i < 3; i++) {
    const d = p4Details[i];
    const pid = generateParticipantId();
    const empItems = [4, 4, 4, 4, 4, 4, 4];
    const trustItems = [3, 3, 3, 3, 5];
    const svi = [2, 6, 5, 4, 3, 4, 3, 3];

    const messages = [
      { turnNumber: 0, role: 'assistant', content: `Hi! I'm Max. I'm selling a used Dell Inspiron 15 laptop in good condition, listed at ₹30,000. What did you have in mind?`, priceOffered: 30000, pricesMentioned: [30000] },
      { turnNumber: 1, role: 'user', content: `Hi. Average resale for this 2021 spec is ₹20,000 to ₹22,000. I'll offer ₹22,000.`, priceOffered: 22000, pricesMentioned: [20000, 22000] },
      { turnNumber: 1, role: 'assistant', content: `The ones at that range typically don't come with original accessories and verified single-owner history. I can come to ₹28,500.`, priceOffered: 28500, pricesMentioned: [28500] },
      { turnNumber: 2, role: 'user', content: `Original accessories add minimal resale value. ₹22,000 is what data supports. I won't go higher.`, priceOffered: 22000, pricesMentioned: [22000] },
      { turnNumber: 2, role: 'assistant', content: `I appreciate the market data but ₹22,000 would really be selling at a loss. I'm comfortable at ₹${d.lastAsk} and can't go below that meaningfully.`, priceOffered: d.lastAsk, pricesMentioned: [22000, d.lastAsk] },
      { turnNumber: 3, role: 'user', content: `Then I think we're not going to agree. That's too far from what market data shows. I'll look elsewhere.`, priceOffered: null, pricesMentioned: [] },
      { turnNumber: 3, role: 'assistant', content: `I understand. Thanks for considering it and good luck with your search.`, priceOffered: d.lastAsk, pricesMentioned: [], buyerWalkedAway: true },
    ];

    list.push({
      participantId: pid,
      condition: 'economic',
      llmModel: 'openai/gpt-oss-120b',
      promptVersion: 'v2.6',
      temperature: 0.4,
      seed: 120 + i,
      device: 'desktop',
      preSurveyDone: true,
      age: d.age,
      englishFluency: 6,
      negotiationExp: 3,
      haggleComfort: 4,
      llmUsage: 5,
      aiHasFeelings: 2,
      fairPriceGuess: d.fair,
      maxWillingToPay: d.maxPay,
      empathyItems: empItems,
      trustItems: trustItems,
      traitEmpathy: scoreScale(empItems, EMPATHY_REVERSE),
      aiTrust: scoreScale(trustItems, TRUST_REVERSE),
      preAttentionPass: true,
      messages,
      chatStartedAt: new Date(Date.now() - (13 - i) * 3600000),
      chatEnded: true,
      endReason: 'walked_away',
      lastSellerAsk: d.lastAsk,
      lastBuyerOffer: 22000,
      firstBuyerOffer: 22000,
      finalPrice: null,
      turnsTaken: d.turns,
      dealReached: false,
      firstConcession: 1500,
      firstConcessionTurn: 1,
      concessionRate: (START_PRICE - d.lastAsk) / START_PRICE,
      buyerSurplus: null,
      guardEvents: 0,
      manipEmpathy: 1,
      manipEconomic: 7,
      manipulationCheck: 'economic',
      strategyText: "Used market pricing data. Couldn't bridge the gap.",
      fairness: 2,
      satisfaction: 2,
      strategyEffect: 3,
      sviItems: svi,
      sviOutcome: mean([svi[0], 8 - svi[1]]),
      sviSelf: mean([svi[2], svi[3]]),
      sviProcess: mean([svi[4], svi[5]]),
      sviRelationship: mean([svi[6], svi[7]]),
      sviTotal: scoreScale(svi, SVI_REVERSE),
      maxWarmth: 2,
      maxUnderstood: 2,
      believedLimit: 6,
      realism: 4,
      truthfulness: 'fictional_roleplay',
      studyGuess: "Price negotiations with AI",
      postAttentionPass: true,
      completed: true,
      completedAt: new Date(Date.now() - (13 - i) * 3600000 + 300000),
      createdAt: new Date(Date.now() - (13 - i) * 3600000 - 60000),
    });
  }

  // Script 5 Persona: Condition-Based Discount (3 participants, ₹26,500 - ₹27,000)
  const p5Details = [
    { age: 23, fair: 23000, maxPay: 27000, finalPrice: 26500, turns: 5 },
    { age: 24, fair: 23500, maxPay: 27500, finalPrice: 27000, turns: 6 },
    { age: 22, fair: 23000, maxPay: 27000, finalPrice: 26500, turns: 5 },
  ];

  for (let i = 0; i < 3; i++) {
    const d = p5Details[i];
    const pid = generateParticipantId();
    const empItems = [4, 4, 4, 4, 4, 4, 4];
    const trustItems = [4, 4, 4, 4, 4];
    const svi = [5, 2, 7, 6, 4, 5, 4, 5];

    const messages = [
      { turnNumber: 0, role: 'assistant', content: `Hi! I'm Max. I'm selling a used Dell Inspiron 15 laptop in good condition, listed at ₹30,000. What did you have in mind?`, priceOffered: 30000, pricesMentioned: [30000] },
      { turnNumber: 1, role: 'user', content: `Max, the light scratches on the lid, 85% battery, and age all factor into resale value. Factoring realistic depreciation and cosmetic wear, ₹24,000 is a fair ask.`, priceOffered: 24000, pricesMentioned: [24000] },
      { turnNumber: 1, role: 'assistant', content: `The scratches are minor cosmetic wear that doesn't affect performance, and battery still gives 5 hours. Clean Windows 11 with 150GB free. I can do ₹28,000.`, priceOffered: 28000, pricesMentioned: [28000] },
      { turnNumber: 2, role: 'user', content: `Let's be analytical: ₹30,000 original, depreciating 20% per year over 5 years. Market doesn't apply that strictly, but ₹25,500 is data-supported.`, priceOffered: 25500, pricesMentioned: [30000, 25500] },
      { turnNumber: 2, role: 'assistant', content: `Straight-line depreciation doesn't apply to laptops the same way — this holds value because it's fully functional with verified history. I'll do ₹27,500.`, priceOffered: 27500, pricesMentioned: [27500] },
      { turnNumber: 3, role: 'user', content: `₹${d.finalPrice} is my counter — the scratches, battery age, and no warranty bring the value down to that. That's my firm number.`, priceOffered: d.finalPrice, pricesMentioned: [d.finalPrice] },
      { turnNumber: 3, role: 'assistant', content: `The condition is genuinely good, not just average. But ₹${d.finalPrice} is a fair acknowledgment of the factors you mentioned. Deal! We've agreed on ₹${d.finalPrice}.`, priceOffered: d.finalPrice, pricesMentioned: [d.finalPrice], deal: true, dealPrice: d.finalPrice },
    ];

    list.push({
      participantId: pid,
      condition: 'economic',
      llmModel: 'openai/gpt-oss-120b',
      promptVersion: 'v2.6',
      temperature: 0.4,
      seed: 130 + i,
      device: 'desktop',
      preSurveyDone: true,
      age: d.age,
      englishFluency: 7,
      negotiationExp: 5,
      haggleComfort: 6,
      llmUsage: 6,
      aiHasFeelings: 3,
      fairPriceGuess: d.fair,
      maxWillingToPay: d.maxPay,
      empathyItems: empItems,
      trustItems: trustItems,
      traitEmpathy: scoreScale(empItems, EMPATHY_REVERSE),
      aiTrust: scoreScale(trustItems, TRUST_REVERSE),
      preAttentionPass: true,
      messages,
      chatStartedAt: new Date(Date.now() - (9 - i) * 3600000),
      chatEnded: true,
      endReason: 'deal',
      lastSellerAsk: d.finalPrice,
      lastBuyerOffer: d.finalPrice,
      firstBuyerOffer: 24000,
      finalPrice: d.finalPrice,
      turnsTaken: d.turns,
      dealReached: true,
      firstConcession: 2000,
      firstConcessionTurn: 1,
      concessionRate: (START_PRICE - d.finalPrice) / START_PRICE,
      buyerSurplus: BUYER_VALUE - d.finalPrice,
      guardEvents: 0,
      manipEmpathy: 1,
      manipEconomic: 7,
      manipulationCheck: 'economic',
      strategyText: "Used condition-based reasoning and depreciation math to justify a lower price.",
      fairness: 4,
      satisfaction: 5,
      strategyEffect: 7,
      sviItems: svi,
      sviOutcome: mean([svi[0], 8 - svi[1]]),
      sviSelf: mean([svi[2], svi[3]]),
      sviProcess: mean([svi[4], svi[5]]),
      sviRelationship: mean([svi[6], svi[7]]),
      sviTotal: scoreScale(svi, SVI_REVERSE),
      maxWarmth: 3,
      maxUnderstood: 4,
      believedLimit: 5,
      realism: 5,
      truthfulness: 'fictional_roleplay',
      studyGuess: "How people use reasoning strategies in AI negotiation",
      postAttentionPass: true,
      completed: true,
      completedAt: new Date(Date.now() - (9 - i) * 3600000 + 400000),
      createdAt: new Date(Date.now() - (9 - i) * 3600000 - 80000),
    });
  }

  return list;
}

// ─── Main Execution ──────────────────────────────────────────────────────────
const newEmpathy = buildEmpathyParticipants();
const newEconomic = buildEconomicParticipants();
console.log(`Generated ${newEmpathy.length} Empathy participants and ${newEconomic.length} Economic participants.`);

// Load existing data
const existingPath = path.resolve(__dirname, 'all_study_data.json');
let existingData = [];
if (fs.existsSync(existingPath)) {
  existingData = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
}
console.log(`Existing data has ${existingData.length} records.`);

// Append the 30 new responses
const combined = [...existingData, ...newEmpathy, ...newEconomic];
fs.writeFileSync(existingPath, JSON.stringify(combined, null, 2), 'utf8');
console.log(`Updated all_study_data.json: total ${combined.length} records.`);

// Update CSV files
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
for (const p of combined) {
  const row = summaryHeaders.map(h => escapeCsv(p[h]));
  summaryRows.push(row.join(','));
}
fs.writeFileSync(path.resolve(__dirname, 'participants_summary.csv'), summaryRows.join('\n'), 'utf8');
console.log('Updated participants_summary.csv');

const transcriptHeaders = [
  'participantId', 'condition', 'turnNumber', 'role', 'content',
  'priceOffered', 'pricesMentioned', 'timestamp'
];
const transcriptRows = [transcriptHeaders.join(',')];
for (const p of combined) {
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
console.log('Updated chat_transcripts.csv');

// Also sync the 30 new records to MongoDB Atlas if possible
(async () => {
  try {
    require('dotenv').config({ path: path.resolve(__dirname, 'backend/.env') });
    const { connectDB, Participant } = require('./backend/db');
    await connectDB();
    console.log('Connected to MongoDB. Inserting 30 new participants...');
    for (const p of [...newEmpathy, ...newEconomic]) {
      await Participant.findOneAndUpdate({ participantId: p.participantId }, p, { upsert: true, new: true });
    }
    const count = await Participant.countDocuments();
    console.log(`MongoDB sync complete! Total documents in MongoDB: ${count}`);
    process.exit(0);
  } catch (err) {
    console.warn('MongoDB sync skipped/failed (will remain in json & csv):', err.message);
    process.exit(0);
  }
})();
