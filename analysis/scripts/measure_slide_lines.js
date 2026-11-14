const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

// Let's inspect Slides 4, 5, 8 heights and contents
const slideBodies = html.split('<div class="slide-body');

slideBodies.slice(1).forEach((body, idx) => {
  const slideNum = idx + 1;
  const tagEnd = body.indexOf('>');
  const content = body.substring(tagEnd + 1);
  const endDiv = content.lastIndexOf('</div>');
  const inner = content.substring(0, endDiv);
  
  // Count elements
  const lines = inner.split('\n').length;
  console.log(`Slide ${slideNum}: ${lines} lines, length: ${inner.length}`);
});

