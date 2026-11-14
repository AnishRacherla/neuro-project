const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const printMatch = html.match(/@media\s+print\s*\{([\s\S]*?)\}(?=\s*<\/style>|\s*@media|\s*\/\*)/);
console.log('Print CSS:');
console.log(printMatch ? printMatch[0] : 'No print CSS found');

