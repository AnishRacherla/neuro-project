const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const style = html.match(/<style>([\s\S]*?)<\/style>/i)[1];
fs.writeFileSync('neuro-project/analysis/scripts/current_style.css', style, 'utf8');
console.log('Saved current CSS to scripts/current_style.css');

