const fs = require('fs');
const html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

const s12Index = html.lastIndexOf('Slide 12 of 12');
const afterS12 = html.substring(s12Index);
console.log('After Slide 12 text:');
console.log(afterS12.substring(afterS12.indexOf('Thank You! Questions')));

