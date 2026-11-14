const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const slideBodies = html.split('<div class="slide-body');
console.log('Found slides:', slideBodies.length - 1);

slideBodies.slice(1).forEach((body, idx) => {
  const slideNum = idx + 1;
  const tagEnd = body.indexOf('>');
  const content = body.substring(tagEnd + 1);
  const endDiv = content.lastIndexOf('</div>');
  const inner = content.substring(0, endDiv);
  
  // Extract titles and headers
  const title = (inner.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || 'No Title';
  const cleanTitle = title.replace(/<[^>]+>/g, '').trim();
  
  // Look for any inline styles with bright/clashing colors
  const inlineStyles = inner.match(/style="([^"]*)"/gi) || [];
  const colorStyles = inlineStyles.filter(s => /#|rgb/i.test(s));
  
  console.log(`\n=== SLIDE ${slideNum}: ${cleanTitle} ===`);
  console.log(`Color styles count: ${colorStyles.length}`);
  if (colorStyles.length > 0) {
    console.log(colorStyles.slice(0, 5));
  }
});

