const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('#f87171')) {
    console.log(`Line ${idx + 1}: ${l.trim()}`);
  }
});

