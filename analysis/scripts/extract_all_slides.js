const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const slideBodies = html.split('<div class="slide-body');

slideBodies.slice(1).forEach((body, idx) => {
  const slideNum = idx + 1;
  const tagEnd = body.indexOf('>');
  const content = body.substring(tagEnd + 1);
  const endDiv = content.lastIndexOf('</div>');
  const inner = content.substring(0, endDiv);
  
  fs.writeFileSync(`neuro-project/analysis/scripts/slide_${slideNum}.html`, inner.trim(), 'utf8');
});

console.log('Saved all 12 slides to scripts/slide_*.html');

