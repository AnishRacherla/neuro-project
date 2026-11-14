const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

console.log('Slide 7 green stat-val empathy present:', html.includes('<div class="stat-val empathy">5.78'));
console.log('Slide 7 green box present:', html.includes('border: 2px solid var(--empathy)'));
console.log('Slide 10 red present:', html.includes('color: #f87171'));
console.log('Slide 10 yellow present:', html.includes('color: #fbbf24'));
console.log('Slide 10 green present:', html.includes('color: #34d399'));
console.log('Slide 10 purple present:', html.includes('color: #818cf8'));
console.log('Standard height slides count:', (html.match(/class="slide-body[^"]*standard-height/g) || []).length);
console.log('Longer slides count:', (html.match(/class="slide-body[^"]*longer-slide/g) || []).length);

