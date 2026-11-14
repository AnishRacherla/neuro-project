const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const slideBodies = html.split('<div class="slide-body');
console.log('Total slide bodies:', slideBodies.length - 1);

slideBodies.slice(1).forEach((body, idx) => {
  const catMatch = body.match(/data-category="([^"]*)"/);
  const notesMatch = body.match(/data-notes="([^"]*)"/);
  const h1Match = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  
  const cat = catMatch ? catMatch[1] : 'MISSING';
  const notes = notesMatch ? notesMatch[1].substring(0, 30) + '...' : 'MISSING';
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'NO H1 (Slide 1 Title)';
  
  console.log(`Slide ${idx + 1}: [${cat}] - "${h1}" (Notes: ${notes})`);
});

