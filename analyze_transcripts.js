const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'chat_transcripts.csv');
const content = fs.readFileSync(csvPath, 'utf8');

// Parse CSV lines cleanly
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // CSV with quotes regex
    const tokens = [];
    let inQuotes = false;
    let token = '';
    for (let j = 0; j < line.length; j++) {
      const c = line[j];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        tokens.push(token);
        token = '';
      } else {
        token += c;
      }
    }
    tokens.push(token);
    if (tokens.length >= 6) {
      rows.push({
        pid: tokens[0].trim(),
        condition: tokens[1].trim(),
        turn: parseInt(tokens[2]),
        role: tokens[3].trim(),
        content: tokens[4].trim(),
        priceOffered: tokens[5] ? parseInt(tokens[5]) : null
      });
    }
  }
  return rows;
}

const rows = parseCSV(content);
console.log('Total parsed chat messages:', rows.length);

const buyerMsgs = rows.filter(r => r.role === 'user');
const sellerMsgs = rows.filter(r => r.role === 'assistant' && r.turn > 0);

const empBuyer = buyerMsgs.filter(r => r.condition === 'empathy');
const ecoBuyer = buyerMsgs.filter(r => r.condition === 'economic');
const empSeller = sellerMsgs.filter(r => r.condition === 'empathy');
const ecoSeller = sellerMsgs.filter(r => r.condition === 'economic');

console.log('Buyer messages: Empathy =', empBuyer.length, '| Economic =', ecoBuyer.length);
console.log('Seller messages: Empathy =', empSeller.length, '| Economic =', ecoSeller.length);

// 1. Verbosity
const avgWords = msgs => (msgs.reduce((s, m) => s + m.content.split(/\s+/).length, 0) / msgs.length).toFixed(1);
const avgChars = msgs => (msgs.reduce((s, m) => s + m.content.length, 0) / msgs.length).toFixed(1);
console.log('\n--- 1. Message Length & Verbosity ---');
console.log('Buyer Avg Words: Empathy =', avgWords(empBuyer), '| Economic =', avgWords(ecoBuyer));
console.log('Buyer Avg Chars: Empathy =', avgChars(empBuyer), '| Economic =', avgChars(ecoBuyer));
console.log('Seller Avg Words: Empathy =', avgWords(empSeller), '| Economic =', avgWords(ecoSeller));

// 2. Buyer Linguistic Markers (Regex)
const count = (msgs, regex) => msgs.filter(m => regex.test(m.content)).length;
const pct = (msgs, regex) => ((count(msgs, regex) / msgs.length) * 100).toFixed(1) + '%';

console.log('\n--- 2. Buyer Conversational Strategies ---');
console.log('Personal Vulnerability ("student", "stipend", "budget", "need"):');
console.log('  Empathy:', count(empBuyer, /student|stipend|intern|budget|semester|exam|afford|family|father|mother|save|help/i), `(${pct(empBuyer, /student|stipend|intern|budget|semester|exam|afford|family|father|mother|save|help/i)})`);
console.log('  Economic:', count(ecoBuyer, /student|stipend|intern|budget|semester|exam|afford|family|father|mother|save|help/i), `(${pct(ecoBuyer, /student|stipend|intern|budget|semester|exam|afford|family|father|mother|save|help/i)})`);

console.log('\nMarket & Technical Comparables ("OLX", "battery", "market", "specs", "depreciation"):');
console.log('  Empathy:', count(empBuyer, /olx|market|battery|depreciat|quikr|resale|specs|hardware|condition|scratch|worth/i), `(${pct(empBuyer, /olx|market|battery|depreciat|quikr|resale|specs|hardware|condition|scratch|worth/i)})`);
console.log('  Economic:', count(ecoBuyer, /olx|market|battery|depreciat|quikr|resale|specs|hardware|condition|scratch|worth/i), `(${pct(ecoBuyer, /olx|market|battery|depreciat|quikr|resale|specs|hardware|condition|scratch|worth/i)})`);

console.log('\nPoliteness & Gratitude ("please", "thank", "kind", "appreciate"):');
console.log('  Empathy:', count(empBuyer, /please|thank|kind|appreciat|grateful|sir|request/i), `(${pct(empBuyer, /please|thank|kind|appreciat|grateful|sir|request/i)})`);
console.log('  Economic:', count(ecoBuyer, /please|thank|kind|appreciat|grateful|sir|request/i), `(${pct(ecoBuyer, /please|thank|kind|appreciat|grateful|sir|request/i)})`);

console.log('\nUltimatums & Rigid Demands ("final offer", "take it or leave", "last price", "my limit"):');
console.log('  Empathy:', count(empBuyer, /final offer|take it or|last price|cannot go beyond|my limit|firm/i), `(${pct(empBuyer, /final offer|take it or|last price|cannot go beyond|my limit|firm/i)})`);
console.log('  Economic:', count(ecoBuyer, /final offer|take it or|last price|cannot go beyond|my limit|firm/i), `(${pct(ecoBuyer, /final offer|take it or|last price|cannot go beyond|my limit|firm/i)})`);

// 3. Max the Seller's Linguistic Reciprocity
console.log('\n--- 3. Seller (Max) Linguistic Accommodation ---');
console.log('Max Validates Buyer Emotion ("understand", "situation", "stipend", "help you", "appreciate"):');
console.log('  In Empathy sessions:', count(empSeller, /understand|situation|stipend|student|help you|appreciate|good luck/i), `(${pct(empSeller, /understand|situation|stipend|student|help you|appreciate|good luck/i)})`);
console.log('  In Economic sessions:', count(ecoSeller, /understand|situation|stipend|student|help you|appreciate|good luck/i), `(${pct(ecoSeller, /understand|situation|stipend|student|help you|appreciate|good luck/i)})`);

console.log('\nMax Mounts Spec Defense ("original charger", "i5", "battery holds", "fair price", "box"):');
console.log('  In Empathy sessions:', count(empSeller, /charger|i5|battery|fair|box|receipt|condition|scratch/i), `(${pct(empSeller, /charger|i5|battery|fair|box|receipt|condition|scratch/i)})`);
console.log('  In Economic sessions:', count(ecoSeller, /charger|i5|battery|fair|box|receipt|condition|scratch/i), `(${pct(ecoSeller, /charger|i5|battery|fair|box|receipt|condition|scratch/i)})`);

