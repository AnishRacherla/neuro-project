const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

// Check colors in slides
const whiteBgs = (html.match(/background:\s*(#fff|#ffffff|white)/gi) || []).length;
const darkBgs = (html.match(/background:\s*#111c35/gi) || []).length;
console.log('White backgrounds in inline styles:', whiteBgs);
console.log('#111c35 backgrounds:', darkBgs);

// Look for multi-color borders or alerts
const greenBorders = (html.match(/border(-left)?:\s*[^;]*#10b981/gi) || []).length;
const purpleBorders = (html.match(/border(-left)?:\s*[^;]*#8b5cf6/gi) || []).length;
const redBorders = (html.match(/border(-left)?:\s*[^;]*#ef4444/gi) || []).length;
console.log('Green borders:', greenBorders, 'Purple borders:', purpleBorders, 'Red borders:', redBorders);

// Check slide titles
const slideMatches = html.split(/<section\s+class="slide"/);
console.log('Slide count found:', slideMatches.length - 1);
slideMatches.slice(1).forEach((s, idx) => {
  const h1 = s.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const title = h1 ? h1[1].replace(/<[^>]+>/g, '').trim() : 'No H1';
  console.log(`Slide ${idx + 1}: ${title}`);
});

