const fs = require('fs');
let html = fs.readFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', 'utf8');

// 1. Fix letter-spacing in CSS
html = html.replace(/letter-spacing:\s*-0\.025em;/g, 'letter-spacing: normal; word-spacing: 0.04em;');
html = html.replace(/letter-spacing:\s*-0\.03em;/g, 'letter-spacing: normal;');
html = html.replace(/\.slide-body\s*\{[^}]+\}/, `.slide-body {
      flex: 1;
      padding: 24px 54px 18px 54px;
      display: none;
      flex-direction: column;
      justify-content: flex-start;
      overflow-y: auto;
      max-width: 1320px;
      margin: 0 auto;
      width: 100%;
      letter-spacing: 0.01em;
    }`);

fs.writeFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', html, 'utf8');
console.log('Step 1: CSS spacing updated.');

