const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

console.log('HTML Length:', html.length);
console.log('Contains #070d1e (Dark Navy):', html.includes('#070d1e'));
console.log('Contains #38bdf8 (Electric Cyan):', html.includes('#38bdf8'));
console.log('Contains #111c35 (Dark Slate Cards):', html.includes('#111c35'));
console.log('Contains #34d399 (Mint Empathy):', html.includes('#34d399'));
console.log('Contains #818cf8 (Indigo Economic):', html.includes('#818cf8'));
console.log('Contains old #f59e0b amber borders:', html.includes('solid #f59e0b'));
console.log('Contains old #7c3aed purple borders:', html.includes('solid #7c3aed'));
console.log('Contains old #059669 green borders:', html.includes('solid #059669'));

