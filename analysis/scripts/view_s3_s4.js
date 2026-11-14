const fs = require('fs');
const h = fs.readFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', 'utf8');
const bodies = h.split('<div class="slide-body');
console.log('=== SLIDE 3 ===');
console.log(bodies[3].substring(0, 1500));
console.log('=== SLIDE 4 ===');
console.log(bodies[4].substring(0, 2000));

