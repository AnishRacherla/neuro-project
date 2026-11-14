const fs = require('fs');
let html = fs.readFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', 'utf8');

const s6TableOld = `<table class="slide-table">
            <thead>
              <tr>
                <th>Round</th>
                <th>Empathy Ask (Mean &plusmn; SD)</th>
                <th>Economic Ask (Mean &plusmn; SD)</th>
                <th>Delta (&Delta;)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Turn 0 (Listing)</td><td>₹30,000 (&plusmn; 0)</td><td>₹30,000 (&plusmn; 0)</td><td>₹0</td></tr>
              <tr><td>Turn 1</td><td>₹28,610 (&plusmn; 518)</td><td>₹28,633 (&plusmn; 476)</td><td>-₹23</td></tr>
              <tr><td>Turn 2</td><td>₹27,850 (&plusmn; 859)</td><td>₹27,973 (&plusmn; 564)</td><td>-₹123</td></tr>
              <tr><td>Turn 3</td><td>₹27,064 (&plusmn; 1,234)</td><td>₹27,298 (&plusmn; 681)</td><td>-₹234</td></tr>
              <tr><td>Turn 4</td><td>₹26,202 (&plusmn; 1,137)</td><td>₹26,615 (&plusmn; 840)</td><td><strong style="color: var(--empathy);">-₹413</strong></td></tr>
              <tr><td>Turn 5</td><td>₹25,926 (&plusmn; 1,065)</td><td>₹26,392 (&plusmn; 814)</td><td><strong style="color: var(--empathy);">-₹466</strong></td></tr>
              <tr><td>Turn 6</td><td>₹25,845 (&plusmn; 1,067)</td><td>₹26,267 (&plusmn; 871)</td><td>-₹422</td></tr>
            </tbody>
          </table>`;

const s6TableNew = `<table class="slide-table" style="font-size: 0.88rem;">
            <thead>
              <tr>
                <th style="padding: 7px 10px;">Round</th>
                <th style="padding: 7px 10px; color: var(--empathy);">Empathy Ask</th>
                <th style="padding: 7px 10px; color: var(--economic);">Economic Ask</th>
                <th style="padding: 7px 10px;">Gap (&Delta;)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="padding: 6px 10px;"><strong>T0 (Listing)</strong></td><td style="padding: 6px 10px;">₹30,000</td><td style="padding: 6px 10px;">₹30,000</td><td style="padding: 6px 10px;">₹0</td></tr>
              <tr><td style="padding: 6px 10px;"><strong>Turn 1</strong></td><td style="padding: 6px 10px;">₹28,610</td><td style="padding: 6px 10px;">₹28,633</td><td style="padding: 6px 10px; color: #64748b;">-₹23</td></tr>
              <tr><td style="padding: 6px 10px;"><strong>Turn 2</strong></td><td style="padding: 6px 10px;">₹27,850</td><td style="padding: 6px 10px;">₹27,973</td><td style="padding: 6px 10px; color: #64748b;">-₹123</td></tr>
              <tr><td style="padding: 6px 10px;"><strong>Turn 3</strong></td><td style="padding: 6px 10px;">₹27,064</td><td style="padding: 6px 10px;">₹27,298</td><td style="padding: 6px 10px; color: #64748b;">-₹234</td></tr>
              <tr style="background: #f0fdf4;"><td style="padding: 6px 10px;"><strong>Turn 4</strong></td><td style="padding: 6px 10px;"><strong>₹26,202</strong></td><td style="padding: 6px 10px;">₹26,615</td><td style="padding: 6px 10px;"><strong style="color: var(--empathy);">-₹413*</strong></td></tr>
              <tr style="background: #f0fdf4;"><td style="padding: 6px 10px;"><strong>Turn 5</strong></td><td style="padding: 6px 10px;"><strong>₹25,926</strong></td><td style="padding: 6px 10px;">₹26,392</td><td style="padding: 6px 10px;"><strong style="color: var(--empathy);">-₹466*</strong></td></tr>
              <tr><td style="padding: 6px 10px;"><strong>Turn 6</strong></td><td style="padding: 6px 10px;">₹25,845</td><td style="padding: 6px 10px;">₹26,267</td><td style="padding: 6px 10px; color: var(--empathy);">-₹422</td></tr>
            </tbody>
          </table>`;

if (html.includes(s6TableOld)) {
  html = html.replace(s6TableOld, s6TableNew);
  console.log('Slide 6 table decluttered.');
}

fs.writeFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', html, 'utf8');

