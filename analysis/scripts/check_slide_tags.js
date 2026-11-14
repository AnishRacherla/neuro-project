const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const matches = html.match(/<section[^>]*class="[^"]*"[^>]*>/gi) || html.match(/<div[^>]*class="[^"]*slide[^"]*"[^>]*>/gi);
console.log('Slide tag matches:', matches ? matches.slice(0, 15) : 'none');

