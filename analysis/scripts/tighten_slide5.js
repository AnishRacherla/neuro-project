const fs = require('fs');

let html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

// The old Slide 5 block:
const oldSlide5 = `<div class="slide-body" data-category="Core Economic Findings" style="padding: 18px 48px 12px 48px;" data-notes="Present the main result: Empathy achieved a ₹525 discount in completed deals (p = 0.0087; Mann-Whitney p = 0.00034). Show the boxplot. Then summarize the secondary tests: surplus +55.8% and all-session ITT p = 0.0041.">
      <h1 class="slide-title">Primary &amp; Secondary Economic Outcomes</h1>
      <h2 class="slide-subtitle" style="color: #94a3b8; margin-bottom: 12px;">Empathy achieved significant price discounts across completed deals (<em>N</em> = 88) and full ITT positions (<em>N</em> = 99)</h2>

      <div class="grid-4" style="margin-bottom: 12px;">
        <div class="stat-box" style="padding: 12px 14px;">
          <div class="stat-lbl" style="font-size: 0.82rem;">Empathy Mean Deal</div>
          <div class="stat-val empathy" style="font-size: 2.25rem; margin-bottom: 2px;">₹25,535</div>
          <div class="stat-sub" style="font-size: 0.86rem;">SD = ₹988.27 (<em>N</em> = 43)</div>
        </div>
        <div class="stat-box" style="padding: 12px 14px;">
          <div class="stat-lbl" style="font-size: 0.82rem;">Economic Mean Deal</div>
          <div class="stat-val economic" style="font-size: 2.25rem; margin-bottom: 2px;">₹26,060</div>
          <div class="stat-sub" style="font-size: 0.86rem;">SD = ₹884.13 (<em>N</em> = 45)</div>
        </div>
        <div class="stat-box" style="padding: 12px 14px;">
          <div class="stat-lbl" style="font-size: 0.82rem;">Price Discount (&Delta;)</div>
          <div class="stat-val" style="color: #34d399; font-size: 2.25rem; margin-bottom: 2px;">-₹525.18</div>
          <div class="stat-sub" style="font-size: 0.86rem;">Welch t(83.9) = -2.62, p = 0.0087**</div>
        </div>
        <div class="stat-box" style="padding: 12px 14px;">
          <div class="stat-lbl" style="font-size: 0.82rem;">Buyer Surplus Gain</div>
          <div class="stat-val" style="color: #38bdf8; font-size: 2.25rem; margin-bottom: 2px;">+55.8%</div>
          <div class="stat-sub" style="font-size: 0.86rem;">₹1,465 vs. ₹940 (p = 0.0087**)</div>
        </div>
      </div>

      <div class="grid-2" style="align-items: center; gap: 16px;">
        <table class="slide-table" style="font-size: 0.90rem;">
          <thead>
            <tr>
              <th style="padding: 8px 12px;">Evaluation Cohort &amp; Test</th>
              <th style="padding: 8px 12px;">Empathy</th>
              <th style="padding: 8px 12px;">Economic</th>
              <th style="padding: 8px 12px;">Statistical Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 7px 12px;"><strong>Primary Deal Price (N = 88)</strong></td>
              <td style="padding: 7px 12px;">₹25,534.56</td>
              <td style="padding: 7px 12px;">₹26,059.73</td>
              <td style="padding: 7px 12px;"><strong style="color: #34d399;">t = -2.62, p = 0.0087**</strong> (d = -0.561)</td>
            </tr>
            <tr>
              <td style="padding: 7px 12px;"><strong>Rank-Sum Non-Parametric Check</strong></td>
              <td style="padding: 7px 12px;">Rank: 34.51</td>
              <td style="padding: 7px 12px;">Rank: 54.04</td>
              <td style="padding: 7px 12px;"><strong style="color: #34d399;">U = 538.0, p = 0.00034***</strong> (r<sub>rb</sub> = -0.444)</td>
            </tr>
            <tr>
              <td style="padding: 7px 12px;"><strong>Full-Sample ITT Position (N = 99)</strong></td>
              <td style="padding: 7px 12px;">₹25,809.72</td>
              <td style="padding: 7px 12px;">₹26,187.51</td>
              <td style="padding: 7px 12px;"><strong>MW U = 794.0, p = 0.0041**</strong> (Welch p = 0.062)</td>
            </tr>
            <tr>
              <td style="padding: 7px 12px;"><strong>Seller Concession Rate &amp; Turns</strong></td>
              <td style="padding: 7px 12px;">14.88% (5.5 turns)</td>
              <td style="padding: 7px 12px;">13.13% (5.1 turns)</td>
              <td style="padding: 7px 12px;">Concession: p = 0.0087** (Duration Parity)</td>
            </tr>
          </tbody>
        </table>

        <!-- VISUAL BOXPLOT SVG -->
        <div class="card" style="padding: 12px; background: #111c35; text-align: center;">
          <div style="font-size: 0.78rem; font-weight: 800; color: #94a3b8; margin-bottom: 6px; letter-spacing: 0.05em; text-transform: uppercase;">
            FINAL DEAL PRICE DISTRIBUTION (N = 88)
          </div>
          <svg viewBox="0 0 420 140" style="width: 100%; height: 125px; overflow: visible;">
            <line x1="50" y1="110" x2="400" y2="110" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" />
            <text x="50" y="125" font-size="9" fill="#94a3b8" text-anchor="middle">₹23k</text>
            <text x="120" y="125" font-size="9" fill="#94a3b8" text-anchor="middle">₹24k</text>
            <text x="190" y="125" font-size="9" fill="#94a3b8" text-anchor="middle">₹25k</text>
            <text x="260" y="125" font-size="9" fill="#94a3b8" text-anchor="middle">₹26k</text>
            <text x="330" y="125" font-size="9" fill="#94a3b8" text-anchor="middle">₹27k</text>
            <text x="400" y="125" font-size="9" fill="#94a3b8" text-anchor="middle">₹28k</text>

            <!-- Empathy Boxplot -->
            <text x="40" y="38" font-size="10" font-weight="700" fill="#34d399" text-anchor="end">Empathy</text>
            <line x1="120" y1="35" x2="365" y2="35" stroke="#34d399" stroke-width="1.5" stroke-dasharray="3,3" />
            <line x1="120" y1="26" x2="120" y2="44" stroke="#34d399" stroke-width="1.5" />
            <line x1="365" y1="26" x2="365" y2="44" stroke="#34d399" stroke-width="1.5" />
            <rect x="190" y="22" width="66.5" height="26" fill="rgba(52, 211, 153, 0.2)" stroke="#34d399" stroke-width="2" rx="3" />
            <line x1="225" y1="22" x2="225" y2="48" stroke="#34d399" stroke-width="3" />
            <text x="225" y="17" font-size="9" font-weight="700" fill="#34d399" text-anchor="middle">Mdn ₹25,500</text>

            <!-- Economic Boxplot -->
            <text x="40" y="78" font-size="10" font-weight="700" fill="#818cf8" text-anchor="end">Economic</text>
            <line x1="50" y1="75" x2="365" y2="75" stroke="#818cf8" stroke-width="1.5" stroke-dasharray="3,3" />
            <line x1="50" y1="66" x2="50" y2="84" stroke="#818cf8" stroke-width="1.5" />
            <line x1="365" y1="66" x2="365" y2="84" stroke="#818cf8" stroke-width="1.5" />
            <rect x="225" y="62" width="84" height="26" fill="rgba(129, 140, 248, 0.2)" stroke="#818cf8" stroke-width="2" rx="3" />
            <line x1="260" y1="62" x2="260" y2="88" stroke="#818cf8" stroke-width="3" />
            <text x="260" y="57" font-size="9" font-weight="700" fill="#818cf8" text-anchor="middle">Mdn ₹26,000</text>
          </svg>
        </div>
      </div>
    </div>`;

const newSlide5 = `<div class="slide-body" data-category="Core Economic Findings" style="padding: 16px 36px 14px 36px;" data-notes="Present the main result: Empathy achieved a ₹525 discount in completed deals (p = 0.0087; Mann-Whitney p = 0.00034). Show the boxplot. Then summarize the secondary tests: surplus +55.8% and all-session ITT p = 0.0041.">
      <h1 class="slide-title" style="font-size: 1.95rem; margin-bottom: 2px;">Primary &amp; Secondary Economic Outcomes</h1>
      <h2 class="slide-subtitle" style="color: #94a3b8; font-size: 0.98rem; margin-bottom: 8px;">Empathy achieved significant price discounts across completed deals (<em>N</em> = 88) and full ITT positions (<em>N</em> = 99)</h2>

      <div class="grid-4" style="margin-bottom: 8px; gap: 12px;">
        <div class="stat-box" style="padding: 8px 10px;">
          <div class="stat-lbl" style="font-size: 0.74rem; margin-bottom: 2px;">Empathy Mean Deal</div>
          <div class="stat-val empathy" style="font-size: 1.85rem; margin-bottom: 1px;">₹25,535</div>
          <div class="stat-sub" style="font-size: 0.78rem;">SD = ₹988.27 (<em>N</em> = 43)</div>
        </div>
        <div class="stat-box" style="padding: 8px 10px;">
          <div class="stat-lbl" style="font-size: 0.74rem; margin-bottom: 2px;">Economic Mean Deal</div>
          <div class="stat-val economic" style="font-size: 1.85rem; margin-bottom: 1px;">₹26,060</div>
          <div class="stat-sub" style="font-size: 0.78rem;">SD = ₹884.13 (<em>N</em> = 45)</div>
        </div>
        <div class="stat-box" style="padding: 8px 10px;">
          <div class="stat-lbl" style="font-size: 0.74rem; margin-bottom: 2px;">Price Discount (&Delta;)</div>
          <div class="stat-val" style="color: #34d399; font-size: 1.85rem; margin-bottom: 1px;">-₹525.18</div>
          <div class="stat-sub" style="font-size: 0.78rem;">Welch t(83.9) = -2.62, p = 0.0087**</div>
        </div>
        <div class="stat-box" style="padding: 8px 10px;">
          <div class="stat-lbl" style="font-size: 0.74rem; margin-bottom: 2px;">Buyer Surplus Gain</div>
          <div class="stat-val" style="color: #38bdf8; font-size: 1.85rem; margin-bottom: 1px;">+55.8%</div>
          <div class="stat-sub" style="font-size: 0.78rem;">₹1,465 vs. ₹940 (p = 0.0087**)</div>
        </div>
      </div>

      <div class="grid-2" style="align-items: center; gap: 14px;">
        <table class="slide-table" style="font-size: 0.82rem;">
          <thead>
            <tr>
              <th style="padding: 5px 8px; font-size: 0.76rem;">Evaluation Cohort &amp; Test</th>
              <th style="padding: 5px 8px; font-size: 0.76rem;">Empathy</th>
              <th style="padding: 5px 8px; font-size: 0.76rem;">Economic</th>
              <th style="padding: 5px 8px; font-size: 0.76rem;">Statistical Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 5px 8px;"><strong>Primary Deal Price (N = 88)</strong></td>
              <td style="padding: 5px 8px;">₹25,534.56</td>
              <td style="padding: 5px 8px;">₹26,059.73</td>
              <td style="padding: 5px 8px;"><strong style="color: #34d399;">t = -2.62, p = 0.0087**</strong> (d = -0.561)</td>
            </tr>
            <tr>
              <td style="padding: 5px 8px;"><strong>Rank-Sum Non-Parametric Check</strong></td>
              <td style="padding: 5px 8px;">Rank: 34.51</td>
              <td style="padding: 5px 8px;">Rank: 54.04</td>
              <td style="padding: 5px 8px;"><strong style="color: #34d399;">U = 538.0, p = 0.00034***</strong> (r<sub>rb</sub> = -0.444)</td>
            </tr>
            <tr>
              <td style="padding: 5px 8px;"><strong>Full-Sample ITT Position (N = 99)</strong></td>
              <td style="padding: 5px 8px;">₹25,809.72</td>
              <td style="padding: 5px 8px;">₹26,187.51</td>
              <td style="padding: 5px 8px;"><strong>MW U = 794.0, p = 0.0041**</strong> (Welch p = 0.062)</td>
            </tr>
            <tr>
              <td style="padding: 5px 8px;"><strong>Seller Concession Rate &amp; Turns</strong></td>
              <td style="padding: 5px 8px;">14.88% (5.5 turns)</td>
              <td style="padding: 5px 8px;">13.13% (5.1 turns)</td>
              <td style="padding: 5px 8px;">Concession: p = 0.0087** (Duration Parity)</td>
            </tr>
          </tbody>
        </table>

        <!-- VISUAL BOXPLOT SVG -->
        <div class="card" style="padding: 8px 12px; background: #111c35; text-align: center;">
          <div style="font-size: 0.74rem; font-weight: 800; color: #94a3b8; margin-bottom: 4px; letter-spacing: 0.05em; text-transform: uppercase;">
            FINAL DEAL PRICE DISTRIBUTION (N = 88)
          </div>
          <svg viewBox="0 0 420 130" style="width: 100%; height: 110px; overflow: visible;">
            <line x1="50" y1="102" x2="400" y2="102" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" />
            <text x="50" y="116" font-size="9" fill="#94a3b8" text-anchor="middle">₹23k</text>
            <text x="120" y="116" font-size="9" fill="#94a3b8" text-anchor="middle">₹24k</text>
            <text x="190" y="116" font-size="9" fill="#94a3b8" text-anchor="middle">₹25k</text>
            <text x="260" y="116" font-size="9" fill="#94a3b8" text-anchor="middle">₹26k</text>
            <text x="330" y="116" font-size="9" fill="#94a3b8" text-anchor="middle">₹27k</text>
            <text x="400" y="116" font-size="9" fill="#94a3b8" text-anchor="middle">₹28k</text>

            <!-- Empathy Boxplot -->
            <text x="40" y="36" font-size="10" font-weight="700" fill="#34d399" text-anchor="end">Empathy</text>
            <line x1="120" y1="33" x2="365" y2="33" stroke="#34d399" stroke-width="1.5" stroke-dasharray="3,3" />
            <line x1="120" y1="24" x2="120" y2="42" stroke="#34d399" stroke-width="1.5" />
            <line x1="365" y1="24" x2="365" y2="42" stroke="#34d399" stroke-width="1.5" />
            <rect x="190" y="20" width="66.5" height="26" fill="rgba(52, 211, 153, 0.2)" stroke="#34d399" stroke-width="2" rx="3" />
            <line x1="225" y1="20" x2="225" y2="46" stroke="#34d399" stroke-width="3" />
            <text x="225" y="15" font-size="9" font-weight="700" fill="#34d399" text-anchor="middle">Mdn ₹25,500</text>

            <!-- Economic Boxplot -->
            <text x="40" y="74" font-size="10" font-weight="700" fill="#818cf8" text-anchor="end">Economic</text>
            <line x1="50" y1="71" x2="365" y2="71" stroke="#818cf8" stroke-width="1.5" stroke-dasharray="3,3" />
            <line x1="50" y1="62" x2="50" y2="80" stroke="#818cf8" stroke-width="1.5" />
            <line x1="365" y1="62" x2="365" y2="80" stroke="#818cf8" stroke-width="1.5" />
            <rect x="225" y="58" width="84" height="26" fill="rgba(129, 140, 248, 0.2)" stroke="#818cf8" stroke-width="2" rx="3" />
            <line x1="260" y1="58" x2="260" y2="84" stroke="#818cf8" stroke-width="3" />
            <text x="260" y="53" font-size="9" font-weight="700" fill="#818cf8" text-anchor="middle">Mdn ₹26,000</text>
          </svg>
        </div>
      </div>
    </div>`;

if (!html.includes(oldSlide5)) {
  console.error('Could not find oldSlide5 in HTML!');
} else {
  html = html.replace(oldSlide5, newSlide5);
  fs.writeFileSync('neuro-project/analysis/presentation.html', html, 'utf8');
  console.log('Successfully updated Slide 5 with compact font size and space!');
}

