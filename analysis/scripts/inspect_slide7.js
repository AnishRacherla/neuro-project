const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

// Check Slide 7 content around perceived warmth
const s7Idx = html.indexOf('Psychological Mechanism: Social Warmth');
console.log('Slide 7 snippet:');
console.log(html.substring(s7Idx, s7Idx + 1600));

