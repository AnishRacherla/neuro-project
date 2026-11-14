const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const printIdx = html.indexOf('@media print');
console.log(html.substring(printIdx, printIdx + 800));

