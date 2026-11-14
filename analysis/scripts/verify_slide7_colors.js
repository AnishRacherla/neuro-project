const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const s7Start = html.indexOf('data-category="Mechanism Analysis"');
const s7End = html.indexOf('data-category="Statistical Modeling"');
const s7 = html.substring(s7Start, s7End);

console.log('Contains green in Slide 7 text:', s7.includes('#34d399') || s7.includes('#10b981') || s7.includes('var(--empathy)'));
const colors = s7.match(/#[0-9a-fA-F]{3,6}|rgb[a]?\([^)]*\)/g) || [];
console.log('Slide 7 unique colors:', [...new Set(colors)]);

