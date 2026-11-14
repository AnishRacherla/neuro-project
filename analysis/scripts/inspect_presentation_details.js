const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

// Check style block
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
if (styleMatch) {
  console.log('Style block length:', styleMatch[1].length);
  // Check :root
  const rootMatch = styleMatch[1].match(/:root\s*\{([\s\S]*?)\}/);
  if (rootMatch) console.log(':root:', rootMatch[1]);
}

// Check if any slide has remaining inline dark text colors like color: #0f172a, color: #1e293b, color: #334155, color: #475569
const darkTextMatches = html.match(/color:\s*(#0f172a|#1e293b|#334155|#475569|#1e1e1e|#111827|#000|#000000|black)/gi);
console.log('Inline dark text colors found:', darkTextMatches ? darkTextMatches.length : 0);

// Check if any slide has border-left with multi-colors (e.g. pink, green, yellow)
const borderMatches = html.match(/border(-left)?:\s*[^;]*#[0-9a-fA-F]{3,6}/gi);
console.log('Border color sample:', borderMatches ? borderMatches.slice(0, 10) : 'none');

