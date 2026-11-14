const fs = require('fs');
const h = fs.readFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', 'utf8');
const bodies = h.split('<div class="slide-body');
for (let i = 1; i < bodies.length; i++) {
  const matches = bodies[i].match(/font-size:\s*0\.[678]\d*rem/g) || [];
  console.log(`Slide ${i}: ${matches.length} small tags: ${matches.slice(0, 6).join(', ')}`);
}

