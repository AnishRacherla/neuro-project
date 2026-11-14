const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

// Check print CSS
const printMatch = html.match(/@media\s+print\s*\{([\s\S]*?)\}(?=\s*\/[*]\s*SCROLL)/i);
console.log('Print CSS page rule:');
const pageMatch = printMatch ? printMatch[1].match(/@page\s*\{([\s\S]*?)\}/) : null;
console.log(pageMatch ? pageMatch[0] : 'None');

// Check slide-body styles in print
const slideBodyPrintMatch = printMatch ? printMatch[1].match(/\.slide-body\s*\{([\s\S]*?)\}/) : null;
console.log('Slide body in print:');
console.log(slideBodyPrintMatch ? slideBodyPrintMatch[0] : 'None');

// Check screen slide-body styles
const screenSlideBodyMatch = html.match(/\.slide-body\s*\{([\s\S]*?)\}/);
console.log('Slide body in screen:');
console.log(screenSlideBodyMatch ? screenSlideBodyMatch[0] : 'None');

