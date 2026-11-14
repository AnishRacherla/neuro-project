const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const printMatch = html.match(/@media\s+print\s*\{([\s\S]*?)\}(?=\s*\/[*]\s*SCROLL|\s*<\/style>)/i);
console.log(printMatch ? printMatch[0] : 'None');

