const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const s7Idx = html.indexOf('Psychological Mechanism: Social Warmth');
console.log(html.substring(s7Idx + 600, s7Idx + 2000));

