const fs = require('fs');

let html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

// Specific CSS rules for Slide 5 (Core Economic Findings) in both screen and print modes
const slide5Rules = `
    /* SLIDE 5 COMPACT TUNING: PREVENTS ROW 4 CLIPPING */
    .slide-body[data-category="Core Economic Findings"] {
      padding: 16px 36px 12px 36px !important;
    }
    .slide-body[data-category="Core Economic Findings"] .slide-title {
      font-size: 1.8rem !important;
      margin: 0 0 2px 0 !important;
    }
    .slide-body[data-category="Core Economic Findings"] .slide-subtitle {
      font-size: 0.92rem !important;
      margin: 0 0 6px 0 !important;
    }
    .slide-body[data-category="Core Economic Findings"] .grid-4 {
      margin-bottom: 6px !important;
      gap: 10px !important;
    }
    .slide-body[data-category="Core Economic Findings"] .stat-box {
      padding: 6px 8px !important;
    }
    .slide-body[data-category="Core Economic Findings"] .stat-val {
      font-size: 1.65rem !important;
      margin-bottom: 1px !important;
    }
    .slide-body[data-category="Core Economic Findings"] .stat-lbl {
      font-size: 0.72rem !important;
      margin-bottom: 1px !important;
    }
    .slide-body[data-category="Core Economic Findings"] .stat-sub {
      font-size: 0.74rem !important;
    }
    .slide-body[data-category="Core Economic Findings"] .grid-2 {
      gap: 12px !important;
    }
    .slide-body[data-category="Core Economic Findings"] .slide-table {
      font-size: 0.78rem !important;
    }
    .slide-body[data-category="Core Economic Findings"] .slide-table th {
      padding: 4px 6px !important;
      font-size: 0.72rem !important;
    }
    .slide-body[data-category="Core Economic Findings"] .slide-table td {
      padding: 4px 6px !important;
      font-size: 0.75rem !important;
      line-height: 1.25 !important;
    }
    .slide-body[data-category="Core Economic Findings"] .card {
      padding: 6px 10px !important;
    }
    .slide-body[data-category="Core Economic Findings"] svg {
      height: 95px !important;
    }
`;

// Insert into main styles right before @media print
html = html.replace('/* PRINT / PDF EXPORT ENGINE', slide5Rules + '\n    /* PRINT / PDF EXPORT ENGINE');

// Now also add the print-specific overrides inside @media print:
const printSlide5Rules = `
      /* PRINT OVERRIDES SPECIFICALLY FOR SLIDE 5 TO PREVENT CLIPPING */
      .slide-body[data-category="Core Economic Findings"] {
        padding: 6mm 14mm 6mm 14mm !important;
      }
      .slide-body[data-category="Core Economic Findings"] .print-slide-tag {
        margin-bottom: 4px !important;
      }
      .slide-body[data-category="Core Economic Findings"] .slide-title {
        font-size: 1.7rem !important;
        margin: 0 0 2px 0 !important;
      }
      .slide-body[data-category="Core Economic Findings"] .slide-subtitle {
        font-size: 0.90rem !important;
        margin: 0 0 6px 0 !important;
      }
      .slide-body[data-category="Core Economic Findings"] .grid-4 {
        margin-bottom: 6px !important;
        gap: 8px !important;
      }
      .slide-body[data-category="Core Economic Findings"] .stat-box {
        padding: 5px 8px !important;
      }
      .slide-body[data-category="Core Economic Findings"] .stat-val {
        font-size: 1.55rem !important;
        margin-bottom: 1px !important;
      }
      .slide-body[data-category="Core Economic Findings"] .stat-lbl {
        font-size: 0.70rem !important;
        margin-bottom: 1px !important;
      }
      .slide-body[data-category="Core Economic Findings"] .stat-sub {
        font-size: 0.72rem !important;
      }
      .slide-body[data-category="Core Economic Findings"] .grid-2 {
        gap: 10px !important;
      }
      .slide-body[data-category="Core Economic Findings"] .slide-table {
        font-size: 0.76rem !important;
      }
      .slide-body[data-category="Core Economic Findings"] .slide-table th {
        padding: 4px 6px !important;
        font-size: 0.70rem !important;
      }
      .slide-body[data-category="Core Economic Findings"] .slide-table td {
        padding: 3.5px 6px !important;
        font-size: 0.74rem !important;
        line-height: 1.25 !important;
      }
      .slide-body[data-category="Core Economic Findings"] .card {
        padding: 6px 8px !important;
      }
      .slide-body[data-category="Core Economic Findings"] svg {
        height: 90px !important;
      }
`;

// Insert inside @media print right before .callout
html = html.replace('.callout {', printSlide5Rules + '\n      .callout {');

fs.writeFileSync('neuro-project/analysis/presentation.html', html, 'utf8');
console.log('Successfully added targeted Slide 5 compact rules for both screen and print!');

