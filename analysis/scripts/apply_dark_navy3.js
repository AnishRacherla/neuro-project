const fs = require('fs');
let html = fs.readFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', 'utf8');

// 1. UPDATE CHART.JS TO DARK NAVY THEME
const chartOld = `function renderSlideTrajectoryChart() {
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

const chartNew = `function renderSlideTrajectoryChart() {
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
              backgroundColor: 'rgba(52, 211, 153, 0.15)',
              borderWidth: 2.5,
              pointRadius: 4,
              pointBackgroundColor: '#34d399',
              tension: 0.15
            },
            {
              label: 'Economic (LOCF Ask ₹)',
              data: [30000, 28633, 27973, 27298, 26615, 26392, 26267],
              borderColor: '#38bdf8',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              borderWidth: 2.5,
              pointRadius: 4,
              pointBackgroundColor: '#38bdf8',
              tension: 0.15
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 12, color: '#f8fafc', font: { size: 11, weight: 'bold' } } },
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
              grid: { color: 'rgba(255, 255, 255, 0.08)' },
              ticks: { color: '#94a3b8', callback: v => '₹' + v.toLocaleString('en-IN'), font: { size: 10 } },
              title: { display: true, text: 'Seller Asking Price (₹)', color: '#cbd5e1', font: { size: 11, weight: 'bold' } }
            },
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.08)' },
              ticks: { color: '#94a3b8', font: { size: 10 } },
              title: { display: true, text: 'Negotiation Turn (Round)', color: '#cbd5e1', font: { size: 11, weight: 'bold' } }
            }
          }
        }
      });
    }`;

if (html.includes(chartOld)) {
  html = html.replace(chartOld, chartNew);
  console.log('Chart.js dark navy theme applied.');
}

// 2. UPDATE PRINT ENGINE TO DARK NAVY
const printOldStart = '/* PRINT / PDF EXPORT ENGINE';
const printOldEnd = '/* SCROLL VIEW MODE';
const p1 = html.indexOf(printOldStart);
const p2 = html.indexOf(printOldEnd);

const printNew = `/* PRINT / PDF EXPORT ENGINE: DARK NAVY EXECUTIVE THEME */
    @media print {
      @page {
        size: landscape;
        margin: 5mm 8mm;
      }

      html, body {
        background: #0b1329 !important;
        color: #f8fafc !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        overflow: visible !important;
        height: auto !important;
      }

      #deck-container {
        display: block !important;
        background: #0b1329 !important;
        overflow: visible !important;
        height: auto !important;
      }

      .slide-header,
      .progress-bar-container,
      #deck-controls,
      #notes-drawer {
        display: none !important;
      }

      .slide-body {
        display: flex !important;
        flex-direction: column !important;
        justify-content: flex-start !important;
        background: #0b1329 !important;
        color: #f8fafc !important;
        page-break-inside: avoid !important;
        break-inside: avoid-page !important;
        page-break-after: always !important;
        break-after: page !important;
        height: 100vh !important;
        max-height: 100vh !important;
        min-height: 0 !important;
        max-width: 100% !important;
        padding: 6mm 10mm !important;
        margin: 0 !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
      }

      .slide-body:last-child {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }

      .print-slide-tag {
        display: flex !important;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid rgba(56, 189, 248, 0.4);
        padding-bottom: 4px;
        margin-bottom: 10px;
        font-size: 0.74rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #38bdf8;
      }

      .slide-title {
        font-size: 2.05rem !important;
        color: #ffffff !important;
        margin: 0 0 4px 0 !important;
      }

      .slide-subtitle {
        font-size: 1.05rem !important;
        color: #94a3b8 !important;
        margin: 0 0 12px 0 !important;
      }

      .card, .stat-box, .slide-table, .chat-card {
        background: #111c35 !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
        box-shadow: none !important;
      }

      .stat-val {
        color: #ffffff !important;
      }
    }

    `;

if (p1 > -1 && p2 > -1) {
  html = html.substring(0, p1) + printNew + html.substring(p2);
  console.log('Print engine dark navy updated.');
}

fs.writeFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', html, 'utf8');

