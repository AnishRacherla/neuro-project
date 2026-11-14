const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const slideBodies = html.split('<div class="slide-body');
slideBodies.slice(1).forEach((body, idx) => {
  const slideNum = idx + 1;
  const tagEnd = body.indexOf('>');
  const content = body.substring(tagEnd + 1);
  const endDiv = content.lastIndexOf('</div>');
  const inner = content.substring(0, endDiv);
  
  // Approximate content density: character length, number of lines, cards
  const cardCount = (inner.match(/class="card"/g) || []).length;
  const statCount = (inner.match(/class="stat-box"/g) || []).length;
  const tableCount = (inner.match(/class="slide-table"/g) || []).length;
  const svgCount = (inner.match(/<svg/g) || []).length;
  
  console.log(`Slide ${slideNum}: cards=${cardCount}, stats=${statCount}, tables=${tableCount}, svgs=${svgCount}, length=${inner.length}`);
});

