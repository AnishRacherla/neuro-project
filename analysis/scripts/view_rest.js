const fs = require('fs');
const h = fs.readFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', 'utf8');
const bodies = h.split('<div class="slide-body');
console.log('=== REST OF SLIDE 4 ===');
console.log(bodies[4].substring(1500));
console.log('=== SLIDE 8 ===');
console.log(bodies[8]);
console.log('=== SLIDE 10 ===');
console.log(bodies[10]);

