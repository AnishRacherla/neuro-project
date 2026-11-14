const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const s5Start = html.indexOf('data-category="Core Economic Findings"');
const s6Start = html.indexOf('data-category="Trajectory Dynamics"');
const s5 = html.substring(s5Start, s6Start);

console.log('Slide 5 length:', s5.length);
console.log(s5);

