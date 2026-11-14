const fs = require('fs');

// Let's test the dimensions of slides 4, 5, 8
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const s4Match = html.match(/<div class="slide-body[^"]*" data-category="Methodology[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div class="slide-body/);
const s5Match = html.match(/<div class="slide-body[^"]*" data-category="Core Economic[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div class="slide-body/);
const s8Match = html.match(/<div class="slide-body[^"]*" data-category="Statistical Modeling[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div class="slide-body/);

console.log('Slide 4 found:', !!s4Match);
console.log('Slide 5 found:', !!s5Match);
console.log('Slide 8 found:', !!s8Match);

