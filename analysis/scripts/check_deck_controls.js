const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const hasControls = html.includes('id="deck-controls"');
const hasDrawer = html.includes('id="notes-drawer"');
console.log('has deck-controls:', hasControls, 'has notes-drawer:', hasDrawer);

// Let's print the last 50 lines before <script>
const scriptIdx = html.indexOf('<script>');
console.log('Before script:');
console.log(html.substring(scriptIdx - 500, scriptIdx));

