const fs = require('fs');
const html = fs.readFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html','utf8');
const parts = html.split('<div class="slide-body');
// Print slide 11 full (index 11) with enough context to find exact replace targets
const s11 = parts[11];
// Find the end of slide 11 (start of slide 12 marker)
const endMarker = '<!-- ========================================================\n         SLIDE 12';
const endIdx = s11.indexOf(endMarker);
console.log('=== SLIDE 11 CONTENT ===');
console.log(s11.substring(0, endIdx > 0 ? endIdx + 10 : 6000));
console.log('\n=== END IDX:', endIdx);

