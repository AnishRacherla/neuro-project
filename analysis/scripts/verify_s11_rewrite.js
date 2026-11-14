const fs = require('fs');
const html = fs.readFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html','utf8');

// 1. Count slides
const bodies = html.split('<div class="slide-body');
console.log('Slide bodies (incl header):', bodies.length - 1);

// 2. Check for raw latex
const latexMatches = html.match(/\$[^$]+\$/g) || [];
const badLatex = latexMatches.filter(m => !m.includes('₹'));
console.log('Raw LaTeX matches (bad):', badLatex.length, badLatex.slice(0,5));

// 3. Check for "calibration prompt" or "conceded ₹1,000 for student"
const calibCheck = html.includes('calibration prompt') || html.includes('conceded \u20b91,000 for student');
console.log('Calibration prompt mention removed:', !calibCheck);

// 4. Check new title
console.log('New slide title present:', html.includes('Research Ethics &amp; Honest Limitations'));

// 5. Ethical safeguards present
console.log('Informed Consent mention:', html.includes('Informed Consent'));
console.log('Zero-Retention mention:', html.includes('zero data-retention') || html.includes('Zero-Retention'));
console.log('Scripted Fictional mention:', html.includes('Scripted Fictional'));

// 6. Div balance
const openDivs = (html.match(/<div[\s>]/g) || []).length;
const closeDivs = (html.match(/<\/div>/g) || []).length;
console.log('Open divs:', openDivs, '| Close divs:', closeDivs, '| Balanced:', openDivs === closeDivs);

console.log('\nALL CHECKS DONE');

