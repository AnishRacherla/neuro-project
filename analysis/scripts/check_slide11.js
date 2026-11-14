const fs = require('fs');
const html = fs.readFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html','utf8');
const parts = html.split('<div class="slide-body');
console.log('Total parts:', parts.length);
// Slide 11 = index 11
const s11 = parts[11];
if (s11) {
  console.log(s11.substring(0, 4000));
} else {
  console.log('Slide 11 not found');
}

