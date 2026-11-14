const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const hasMainRule = html.includes('.slide-body[data-category="Core Economic Findings"] .stat-val');
const hasPrintRule = html.includes('/* PRINT OVERRIDES SPECIFICALLY FOR SLIDE 5 TO PREVENT CLIPPING */');

console.log('Main rule present:', hasMainRule);
console.log('Print override present:', hasPrintRule);

