const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const s10Idx = html.indexOf('Real Chat Highlights: Human Tactics');
console.log(html.substring(s10Idx, s10Idx + 2000));

