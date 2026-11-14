const fs = require('fs');
const h = fs.readFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', 'utf8');
const bodies = h.split('<div class="slide-body');
console.log('Total Slides:', bodies.length - 1);
for (let i = 1; i < bodies.length; i++) {
  const b = bodies[i];
  const catMatch = b.match(/data-category="([^"]+)"/);
  const titleMatch = b.match(/<h1 class="slide-title">([^<]+)<\/h1>/);
  console.log('Slide ' + i + ': [' + (catMatch ? catMatch[1] : 'No Category') + '] ' + (titleMatch ? titleMatch[1] : 'Title Slide'));
}

