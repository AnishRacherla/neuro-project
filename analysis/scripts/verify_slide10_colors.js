const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const s10Start = html.indexOf('data-category="Dialogue Case Studies"');
const s10End = html.indexOf('data-category="Research Ethics"');
const s10 = html.substring(s10Start, s10End);

const colors = s10.match(/#[0-9a-fA-F]{3,6}|rgb[a]?\([^)]*\)/g) || [];
console.log('Slide 10 unique colors:', [...new Set(colors)]);

