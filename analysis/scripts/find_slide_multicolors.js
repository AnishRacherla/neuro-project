const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const slideRegex = /<div class="slide-body[^"]*"[^>]*>([\s\S]*?)(?=<div class="slide-body|<\/div>\s*<!-- End Presentation Deck)/g;
let match;
let slideNum = 0;

while ((match = slideRegex.exec(html)) !== null) {
  slideNum++;
  const slideContent = match[1];
  const colors = slideContent.match(/(border[^:]*:\s*[^;]*#[0-9a-fA-F]{3,6}|color:\s*#[0-9a-fA-F]{3,6}|background:\s*#[0-9a-fA-F]{3,6})/gi) || [];
  const multiColors = colors.filter(c => /fde68a|f59e0b|7c3aed|059669|d97706|dc2626|ef4444|2563eb|0f172a|1e293b|334155|475569/i.test(c));
  if (multiColors.length > 0) {
    console.log(`Slide ${slideNum}:`, multiColors);
  }
}

