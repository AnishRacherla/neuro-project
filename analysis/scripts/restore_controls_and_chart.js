const fs = require('fs');

let html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

// The bottom of Slide 12 should be:
// </div> <!-- closes slide-body -->
// </div> <!-- closes deck-container -->
// <div id="notes-drawer">...</div>
// <div id="deck-controls">...</div>

const targetStr = `<div style="text-align: center; margin-top: 24px; padding: 18px; background: #111c35; border-radius: 12px; border: 1px solid var(--border-subtle); box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
        <strong style="font-size: 1.2rem; color: #ffffff;">Thank You! Questions &amp; Discussion</strong>
        <div style="font-size: 0.90rem; color: #94a3b8; margin-top: 4px;">
          Full dataset, CONSORT screening funnel, and open analysis scripts available in the project repository.
        </div>
      </div>`;

const restoredBottom = targetStr + `
    </div> <!-- End Slide 12 -->
  </div> <!-- End Deck Container -->

  <!-- ========================================================
       DECK CONTROLS & SPEAKER NOTES
       ======================================================== -->
  <div id="notes-drawer">
    <strong style="color: #38bdf8;">Speaker Notes:</strong> <span id="notes-text">Welcome everyone...</span>
  </div>

  <div id="deck-controls">
    <div style="display: flex; gap: 8px;">
      <button class="control-btn" onclick="prevSlide()">◀ Previous</button>
      <button class="control-btn" onclick="nextSlide()">Next ▶</button>
    </div>

    <div style="color: var(--text-muted); font-size: 0.82rem;">
      Navigate: <strong>&larr;</strong> / <strong>&rarr;</strong> or <strong>Space</strong> &bull; Fullscreen: <strong>F</strong> &bull; Notes: <strong>N</strong>
    </div>

    <div style="display: flex; gap: 8px;">
      <button class="control-btn" id="btn-scroll-mode" onclick="toggleScrollMode()">📑 View All 12 Slides</button>
      <button class="control-btn primary" onclick="exportPDF()">🖨️ Save All as PDF</button>
    </div>
  </div>`;

// Replace from targetStr to <script>
const beforeScript = html.substring(0, html.indexOf('<script>'));
const scriptPart = html.substring(html.indexOf('<script>'));

const targetIdx = beforeScript.lastIndexOf(targetStr);
if (targetIdx !== -1) {
  html = beforeScript.substring(0, targetIdx) + restoredBottom + '\n\n  ' + scriptPart;
} else {
  console.error('targetStr not found!');
}

// Now update the Chart.js script to dark navy theme:
const oldChartJs = `function renderSlideTrajectoryChart() {
      const canvas = document.getElementById('slideTrajectoryChart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
          datasets: [
            {
              label: 'Empathy (LOCF Ask ₹)',
              data: [30000, 28610, 27850, 27064, 26202, 25926, 25845],
              borderColor: '#059669',
              backgroundColor: 'rgba(5, 150, 105, 0.08)',
              borderWidth: 2.5,
              pointRadius: 4,
              pointBackgroundColor: '#059669',
              tension: 0.15
            },
            {
              label: 'Economic (LOCF Ask ₹)',
              data: [30000, 28633, 27973, 27298, 26615, 26392, 26267],
              borderColor: '#4f46e5',
              backgroundColor: 'rgba(79, 70, 229, 0.08)',
              borderWidth: 2.5,
              pointRadius: 4,
              pointBackgroundColor: '#4f46e5',
              tension: 0.15
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 12, font: { size: 10, weight: 'bold' } } },
            tooltip: {
              callbacks: {
                label: ctx => ctx.dataset.label + ': ₹' + ctx.parsed.y.toLocaleString('en-IN')
              }
            }
          },
          scales: {
            y: {
              min: 25000,
              max: 30500,
              ticks: { callback: v => '₹' + v.toLocaleString('en-IN'), font: { size: 9 } },
              title: { display: true, text: 'Seller Asking Price (₹)', font: { size: 10, weight: 'bold' } }
            },
            x: {
              title: { display: true, text: 'Negotiation Turn (Round)', font: { size: 10, weight: 'bold' } }
            }
          }
        }
      });
    }`;

const newChartJs = `function renderSlideTrajectoryChart() {
      const canvas = document.getElementById('slideTrajectoryChart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
          datasets: [
            {
              label: 'Empathy (LOCF Ask ₹)',
              data: [30000, 28610, 27850, 27064, 26202, 25926, 25845],
              borderColor: '#34d399',
              backgroundColor: 'rgba(52, 211, 153, 0.12)',
              borderWidth: 3,
              pointRadius: 5,
              pointBackgroundColor: '#34d399',
              pointBorderColor: '#070d1e',
              pointBorderWidth: 2,
              tension: 0.15
            },
            {
              label: 'Economic (LOCF Ask ₹)',
              data: [30000, 28633, 27973, 27298, 26615, 26392, 26267],
              borderColor: '#818cf8',
              backgroundColor: 'rgba(129, 140, 248, 0.12)',
              borderWidth: 3,
              pointRadius: 5,
              pointBackgroundColor: '#818cf8',
              pointBorderColor: '#070d1e',
              pointBorderWidth: 2,
              tension: 0.15
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { 
              position: 'top', 
              labels: { 
                boxWidth: 14, 
                color: '#f8fafc',
                font: { size: 11, weight: 'bold', family: 'Plus Jakarta Sans' } 
              } 
            },
            tooltip: {
              backgroundColor: '#070d1e',
              titleColor: '#38bdf8',
              bodyColor: '#ffffff',
              borderColor: 'rgba(56, 189, 248, 0.3)',
              borderWidth: 1,
              callbacks: {
                label: ctx => ctx.dataset.label + ': ₹' + ctx.parsed.y.toLocaleString('en-IN')
              }
            }
          },
          scales: {
            y: {
              min: 25000,
              max: 30500,
              grid: { color: 'rgba(255, 255, 255, 0.08)' },
              ticks: { 
                callback: v => '₹' + v.toLocaleString('en-IN'), 
                color: '#94a3b8',
                font: { size: 10 } 
              },
              title: { 
                display: true, 
                text: 'Seller Asking Price (₹)', 
                color: '#cbd5e1',
                font: { size: 11, weight: 'bold' } 
              }
            },
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.08)' },
              ticks: { color: '#94a3b8', font: { size: 10 } },
              title: { 
                display: true, 
                text: 'Negotiation Turn (Round)', 
                color: '#cbd5e1',
                font: { size: 11, weight: 'bold' } 
              }
            }
          }
        }
      });
    }`;

html = html.replace(oldChartJs, newChartJs);

fs.writeFileSync('neuro-project/analysis/presentation.html', html, 'utf8');
console.log('Successfully restored controls and updated Chart.js');

