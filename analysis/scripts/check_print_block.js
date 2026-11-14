const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const printMatch = html.match(/@media\s+print\s*\{([\s\S]*?)\}(?=\s*\/[*]\s*SCROLL|\s*<\/style>)/i);
console.log(printMatch ? printMatch[0].substring(0, 1000) : 'None');
console.log('Total print CSS length:', printMatch ? printMatch[0].length : 0);

