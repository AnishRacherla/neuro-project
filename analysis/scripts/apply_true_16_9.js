const fs = require('fs');

let html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

// 1. Remove .standard-height and .longer-slide class variations so ALL 12 slides have uniform slide-body
html = html.replace(/class="slide-body active standard-height"/g, 'class="slide-body active"');
html = html.replace(/class="slide-body standard-height"/g, 'class="slide-body"');
html = html.replace(/class="slide-body longer-slide"/g, 'class="slide-body"');

// 2. Update CSS for true 16:9 standard slide sizing on screen and in print
const oldDeckContainerCss = `    /* SLIDE CANVAS & PRESENTATION PROPORTIONS */
    #deck-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      background: #0b1329;
      overflow: hidden;
      justify-content: center;
      align-items: center;
    }

    .slide-body {
      padding: 20px 48px;
      display: none;
      flex-direction: column;
      overflow-y: auto;
      max-width: 1260px;
      margin: 0 auto;
      width: 100%;
      letter-spacing: 0.01em;
      box-sizing: border-box;
    }

    .slide-body.active {
      display: flex;
      animation: fadeInSlide 0.22s ease-out;
    }

    /* Standard Height Slides: Proportional 16:9 presentation framing, vertically centered */
    .slide-body.standard-height {
      height: 100%;
      max-height: 660px;
      justify-content: center;
    }

    /* Longer Slides: Preserves full height for dense data, CONSORT pipelines & regression tables */
    .slide-body.longer-slide {
      height: 100%;
      max-height: none;
      justify-content: flex-start;
      padding-top: 14px;
      padding-bottom: 14px;
    }`;

const newDeckContainerCss = `    /* SLIDE CANVAS & STANDARD 16:9 WIDESCREEN PRESENTATION FRAMING */
    #deck-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      background: #070d1e;
      overflow: hidden;
      justify-content: center;
      align-items: center;
      padding: 16px 24px;
      box-sizing: border-box;
    }

    /* UNIFORM STANDARD 16:9 PRESENTATION SLIDE FOR ALL 12 SLIDES */
    .slide-body {
      width: 100%;
      max-width: 1180px;
      aspect-ratio: 16 / 9;
      max-height: 664px;
      height: 100%;
      background: #0b1329;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.45);
      padding: 26px 42px;
      display: none;
      flex-direction: column;
      justify-content: flex-start;
      margin: auto;
      letter-spacing: 0.01em;
      box-sizing: border-box;
      overflow: hidden;
    }

    .slide-body.active {
      display: flex;
      animation: fadeInSlide 0.22s ease-out;
    }`;

html = html.replace(oldDeckContainerCss, newDeckContainerCss);

// 3. Update @media print to strictly output true 16:9 widescreen presentation slides
const oldPrintSection = `@media print {
      @page {
        size: landscape;
        margin: 0;
      }

      html, body {
        background: #070d1e !important;
        color: #f8fafc !important;
        overflow: visible !important;
        height: auto !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      #deck-container {
        display: block !important;
        background: #070d1e !important;
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
        page-break-inside: avoid !important;
        break-inside: avoid-page !important;
        page-break-after: always !important;
        break-after: page !important;
        height: 100vh !important;
        max-height: 100vh !important;
        min-height: 0 !important;
        width: 100vw !important;
        max-width: 100vw !important;
        padding: 20px 40px !important;
        margin: 0 !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
        background: #070d1e !important;
      }

      .slide-body.standard-height {
        justify-content: center !important;
      }

      .slide-body.longer-slide {
        justify-content: flex-start !important;
        padding-top: 12px !important;
      }`;

const newPrintSection = `@media print {
      @page {
        /* Standard 16:9 widescreen presentation slide size (297mm x 167mm) */
        size: 297mm 167.06mm;
        margin: 0;
      }

      html, body {
        width: 297mm !important;
        height: 167.06mm !important;
        background: #070d1e !important;
        color: #f8fafc !important;
        overflow: visible !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      #deck-container {
        display: block !important;
        background: #070d1e !important;
        overflow: visible !important;
        height: auto !important;
        padding: 0 !important;
      }

      .slide-header,
      .progress-bar-container,
      #deck-controls,
      #notes-drawer {
        display: none !important;
      }

      /* Each slide strictly maps 1:1 to a standard 16:9 presentation slide */
      .slide-body {
        display: flex !important;
        flex-direction: column !important;
        justify-content: flex-start !important;
        page-break-inside: avoid !important;
        break-inside: avoid-page !important;
        page-break-after: always !important;
        break-after: page !important;
        width: 297mm !important;
        height: 167.06mm !important;
        max-height: 167.06mm !important;
        min-height: 167.06mm !important;
        aspect-ratio: auto !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        padding: 12mm 18mm !important;
        margin: 0 !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
        background: #070d1e !important;
      }`;

html = html.replace(oldPrintSection, newPrintSection);

// 4. In Slide 1, make sure it fills the 16:9 presentation frame comfortably
html = html.replace(
  '<div style="text-align: center; padding: 12px 20px;">',
  '<div style="text-align: center; padding: 6px 12px; margin: auto 0;">'
);

// 5. In Slide 4, ensure the cards and font sizes are tuned to fit smoothly within the 16:9 standard slide
// Let's check Slide 4 padding and margins
html = html.replace(
  '<div class="grid-3" style="margin-bottom: 16px;">',
  '<div class="grid-3" style="margin-bottom: 12px;">'
);

// 6. In Slide 8, ensure padding and margins are tuned
html = html.replace(
  '<div style="background: #111c35; border: 1px solid rgba(56, 189, 248, 0.25); border-left: 4px solid #38bdf8; border-radius: 8px; padding: 12px 14px; margin-top: 10px;',
  '<div style="background: #111c35; border: 1px solid rgba(56, 189, 248, 0.25); border-left: 4px solid #38bdf8; border-radius: 8px; padding: 8px 12px; margin-top: 8px;'
);

fs.writeFileSync('neuro-project/analysis/presentation.html', html, 'utf8');
console.log('Successfully applied true 16:9 standard slide sizing across all 12 slides!');

