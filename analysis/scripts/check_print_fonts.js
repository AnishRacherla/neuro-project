const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

// Check print slide font sizes for tables and cards
const printStyles = html.match(/@media\s+print\s*\{([\s\S]*?)\}/)[1];
console.log('Print font sizes:');
const titles = printStyles.match(/\.slide-title\s*\{[^}]*\}/);
const tables = printStyles.match(/\.slide-table\s*\{[^}]*\}/);
const tableTd = printStyles.match(/\.slide-table\s+td\s*\{[^}]*\}/);
console.log('Title:', titles ? titles[0] : 'None');
console.log('Table:', tables ? tables[0] : 'None');
console.log('Table td:', tableTd ? tableTd[0] : 'None');

