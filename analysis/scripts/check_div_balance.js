const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const slideBodies = html.split('<div class="slide-body');
slideBodies.slice(1).forEach((body, idx) => {
  const opens = (body.match(/<div(\s|>)/gi) || []).length + 1; // +1 for the slide-body div itself
  const closes = (body.match(/<\/div>/gi) || []).length;
  if (opens !== closes) {
    console.log(`Slide ${idx + 1} div imbalance: Open = ${opens}, Close = ${closes}`);
  }
});

