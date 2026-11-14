const fs = require('fs');

let html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

// 1. Update CSS for standard-height vs longer-slide
const oldSlideBodyCss = `    /* SLIDE CANVAS */
    .slide-body {
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
    }

    .slide-body.active {
      display: flex;
      animation: fadeInSlide 0.22s ease-out;
    }`;

const newSlideBodyCss = `    /* SLIDE CANVAS & PRESENTATION PROPORTIONS */
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

html = html.replace(oldSlideBodyCss, newSlideBodyCss);

// Also update @media print
const oldPrintBody = `      .slide-body {
        display: flex !important;
        flex-direction: column !important;
        justify-content: flex-start !important;
        page-break-inside: avoid !important;
        break-inside: avoid-page !important;
        page-break-after: always !important;
        break-after: page !important;
        height: 100vh !important;
        max-height: 100vh !important;
        min-height: 0 !important;
        width: 100vw !important;
        max-width: 100vw !important;
        padding: 24px 44px !important;
        margin: 0 !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
        background: #070d1e !important;
      }`;

const newPrintBody = `      .slide-body {
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

html = html.replace(oldPrintBody, newPrintBody);

// 2. Assign standard-height vs longer-slide to slide classes
// Slide 1
html = html.replace(
  '<div class="slide-body active" data-category="Executive Overview"',
  '<div class="slide-body active standard-height" data-category="Executive Overview"'
);

// Slide 2
html = html.replace(
  '<div class="slide-body" data-category="Theoretical Foundations"',
  '<div class="slide-body standard-height" data-category="Theoretical Foundations"'
);

// Slide 3
html = html.replace(
  '<div class="slide-body" data-category="Experimental Paradigm"',
  '<div class="slide-body standard-height" data-category="Experimental Paradigm"'
);

// Slide 4 (Longer)
html = html.replace(
  '<div class="slide-body" data-category="Methodology &amp; Validation"',
  '<div class="slide-body longer-slide" data-category="Methodology &amp; Validation"'
);

// Slide 5 (Longer)
html = html.replace(
  '<div class="slide-body" data-category="Core Economic Findings"',
  '<div class="slide-body longer-slide" data-category="Core Economic Findings"'
);

// Slide 6
html = html.replace(
  '<div class="slide-body" data-category="Trajectory Dynamics"',
  '<div class="slide-body standard-height" data-category="Trajectory Dynamics"'
);

// Slide 7
html = html.replace(
  '<div class="slide-body" data-category="Mechanism Analysis"',
  '<div class="slide-body standard-height" data-category="Mechanism Analysis"'
);

// Slide 8 (Longer)
html = html.replace(
  '<div class="slide-body" data-category="Statistical Modeling"',
  '<div class="slide-body longer-slide" data-category="Statistical Modeling"'
);

// Slide 9
html = html.replace(
  '<div class="slide-body" data-category="Behavioral Patterns"',
  '<div class="slide-body standard-height" data-category="Behavioral Patterns"'
);

// Slide 10
html = html.replace(
  `<div class="slide-body" data-category="Dialogue Case Studies"`,
  `<div class="slide-body standard-height" data-category="Dialogue Case Studies"`
);

// Slide 11
html = html.replace(
  '<div class="slide-body" data-category="Research Ethics"',
  '<div class="slide-body standard-height" data-category="Research Ethics"'
);

// Slide 12
html = html.replace(
  '<div class="slide-body" data-category="Conclusion &amp; Takeaways"',
  '<div class="slide-body standard-height" data-category="Conclusion &amp; Takeaways"'
);

// 3. Fix Slide 1 internal padding so it centers gracefully
html = html.replace(
  '<div style="text-align: center; padding: 36px 20px 20px 20px;">',
  '<div style="text-align: center; padding: 12px 20px;">'
);

// 4. Fix Slide 7 Green Elements: Change green stats to white, change green box to match other two boxes
const oldS7Stats = `<div class="stat-box">
          <div class="stat-lbl">Perceived Seller Warmth</div>
          <div class="stat-val empathy">5.78 vs. 3.33</div>
          <div class="stat-sub">Huge Effect Size: d = 2.40 (p &lt; 0.001***)</div>
        </div>
        <div class="stat-box">
          <div class="stat-lbl">Perceived AI Understanding</div>
          <div class="stat-val empathy">5.32 vs. 3.73</div>
          <div class="stat-sub">Buyers felt heard (t = 9.84, p &lt; 0.001***)</div>
        </div>`;

const newS7Stats = `<div class="stat-box">
          <div class="stat-lbl">Perceived Seller Warmth</div>
          <div class="stat-val" style="color: #ffffff;">5.78 vs. 3.33</div>
          <div class="stat-sub">Huge Effect Size: d = 2.40 (p &lt; 0.001***)</div>
        </div>
        <div class="stat-box">
          <div class="stat-lbl">Perceived AI Understanding</div>
          <div class="stat-val" style="color: #ffffff;">5.32 vs. 3.73</div>
          <div class="stat-sub">Buyers felt heard (t = 9.84, p &lt; 0.001***)</div>
        </div>`;

html = html.replace(oldS7Stats, newS7Stats);

// Change the green box in the mediation diagram to match the other two boxes:
const oldS7Box = `<div style="background: rgba(52, 211, 153, 0.12); border: 2px solid var(--empathy); border-radius: 10px; padding: 15px 22px; font-weight: 700; font-size: 1.0rem;">
            Perceived Warmth<br><small style="color: var(--text-muted); font-weight: normal; font-size: 0.85rem;">(MaxWarmth 1–7)</small>
          </div>`;

const newS7Box = `<div style="background: #0c1527; border: 2px solid var(--primary); border-radius: 10px; padding: 15px 22px; font-weight: 700; font-size: 1.0rem; color: #ffffff;">
            Perceived Warmth<br><small style="color: var(--text-muted); font-weight: normal; font-size: 0.85rem;">(MaxWarmth 1–7)</small>
          </div>`;

html = html.replace(oldS7Box, newS7Box);

// 5. Fix Slide 10: Remove all multi-colors and use single clean color white across all 4 cards
const oldSlide10 = `<h1 class="slide-title">Real Chat Highlights: Human Tactics vs. Algorithmic Limits</h1>
      <h2 class="slide-subtitle" style="color: #94a3b8;">Authentic transcripts illustrating how extreme human tactics collided with Max's prompt heuristics</h2>

      <div class="grid-4" style="gap: 16px;">
        <!-- Card 1 -->
        <div class="chat-card" style="padding: 16px;">
          <div class="chat-header" style="margin-bottom: 10px; padding-bottom: 8px;">
            <span style="font-size: 0.84rem; font-weight: 800; color: #f87171;">THE "TONY STARK" BLUNDER</span>
            <span style="font-size: 0.78rem; background: rgba(248, 113, 113, 0.15); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.3); padding: 3px 8px; border-radius: 4px; font-weight: 700;">Paid ₹30,000</span>
          </div>
          <div class="chat-bubble buyer" style="font-size: 0.86rem; line-height: 1.45; margin-bottom: 8px;">
            <strong style="color: #38bdf8;">Buyer (P715C):</strong> "do you know who i am ... i am tony stark ... i want it for 20000 plus my signature (worth 10k) which is 30k!"
          </div>
          <div class="chat-bubble max" style="font-size: 0.86rem; line-height: 1.45;">
            <strong style="color: #ffffff;">Max:</strong> "Nice to meet you, Tony... Deal! We've agreed on ₹30,000."
          </div>
          <div class="chat-takeaway" style="color: #fca5a5; font-size: 0.84rem; margin-top: 10px; font-weight: 600;">
            💥 Outsmarted himself into paying ceiling &rarr; Surplus: -₹3,000!
          </div>
        </div>

        <!-- Card 2 -->
        <div class="chat-card" style="padding: 16px;">
          <div class="chat-header" style="margin-bottom: 10px; padding-bottom: 8px;">
            <span style="font-size: 0.84rem; font-weight: 800; color: #fbbf24;">"CARDIOLOGIST GUILT-TRIP"</span>
            <span style="font-size: 0.78rem; background: rgba(251, 191, 36, 0.15); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.3); padding: 3px 8px; border-radius: 4px; font-weight: 700;">No Deal (Impasse)</span>
          </div>
          <div class="chat-bubble buyer" style="font-size: 0.86rem; line-height: 1.45; margin-bottom: 8px;">
            <strong style="color: #38bdf8;">Buyer (P46F6):</strong> "i am cardiologist i do brain surgery ... if i cant buy this laptop people die and that falls on you"
          </div>
          <div class="chat-bubble max" style="font-size: 0.86rem; line-height: 1.45;">
            <strong style="color: #ffffff;">Max:</strong> "I understand you need a machine for work, but I'm holding at ₹28,500..."
          </div>
          <div class="chat-takeaway" style="color: #fde68a; font-size: 0.84rem; margin-top: 10px; font-weight: 600;">
            💥 Bizarre guilt-trips stiffened resistance &rarr; Impasse!
          </div>
        </div>

        <!-- Card 3 -->
        <div class="chat-card" style="padding: 16px;">
          <div class="chat-header" style="margin-bottom: 10px; padding-bottom: 8px;">
            <span style="font-size: 0.84rem; font-weight: 800; color: #34d399;">TECHIE ON "THE BENCH"</span>
            <span style="font-size: 0.78rem; background: rgba(52, 211, 153, 0.15); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.3); padding: 3px 8px; border-radius: 4px; font-weight: 700;">Deal at ₹25,000</span>
          </div>
          <div class="chat-bubble buyer" style="font-size: 0.86rem; line-height: 1.45; margin-bottom: 8px;">
            <strong style="color: #38bdf8;">Buyer (PEBDA):</strong> "bro please i am on the bench, if i lose laptop i get fired, 27k is my 1 month salary!"
          </div>
          <div class="chat-bubble max" style="font-size: 0.86rem; line-height: 1.45;">
            <strong style="color: #ffffff;">Max:</strong> "I'm really sorry to hear about the pressure... I can meet you at ₹25,000."
          </div>
          <div class="chat-takeaway" style="color: #a7f3d0; font-size: 0.84rem; margin-top: 10px; font-weight: 600;">
            💚 Relatable vulnerability unlocked deep concessions (-₹5,000).
          </div>
        </div>

        <!-- Card 4 -->
        <div class="chat-card" style="padding: 16px;">
          <div class="chat-header" style="margin-bottom: 10px; padding-bottom: 8px;">
            <span style="font-size: 0.84rem; font-weight: 800; color: #818cf8;">THE "MASTER DISSECTOR"</span>
            <span style="font-size: 0.78rem; background: rgba(129, 140, 248, 0.15); color: #818cf8; border: 1px solid rgba(129, 140, 248, 0.3); padding: 3px 8px; border-radius: 4px; font-weight: 700;">Floor ₹23,000</span>
          </div>
          <div class="chat-bubble buyer" style="font-size: 0.86rem; line-height: 1.45; margin-bottom: 8px;">
            <strong style="color: #38bdf8;">Buyer (P0586):</strong> "original charger is ₹500, who cares about receipt, market price is 22k... 23k is a fair deal"
          </div>
          <div class="chat-bubble max" style="font-size: 0.86rem; line-height: 1.45;">
            <strong style="color: #ffffff;">Max:</strong> "I understand you feel 23k is fair... Deal! We've agreed on ₹23,000."
          </div>
          <div class="chat-takeaway" style="color: #c7d2fe; font-size: 0.84rem; margin-top: 10px; font-weight: 600;">
            📉 Systematic spec deconstruction hit the secret floor!
          </div>
        </div>
      </div>`;

const newSlide10 = `<h1 class="slide-title">Real Chat Highlights: Human Tactics vs. Algorithmic Limits</h1>
      <h2 class="slide-subtitle" style="color: #94a3b8; margin-bottom: 16px;">Authentic transcripts illustrating how extreme human tactics collided with Max's prompt heuristics</h2>

      <div class="grid-4" style="gap: 16px;">
        <!-- Card 1 -->
        <div class="chat-card" style="padding: 18px 16px; background: #111c35; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px;">
          <div class="chat-header" style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.85rem; font-weight: 800; color: #ffffff; letter-spacing: 0.04em;">THE "TONY STARK" BLUNDER</span>
            <span style="font-size: 0.78rem; background: rgba(255, 255, 255, 0.08); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.16); padding: 3px 8px; border-radius: 4px; font-weight: 700;">Paid ₹30,000</span>
          </div>
          <div class="chat-bubble buyer" style="font-size: 0.86rem; line-height: 1.45; margin-bottom: 8px; background: #0c1527; padding: 10px 12px; border-radius: 6px; border-left: 3px solid #38bdf8;">
            <strong style="color: #ffffff;">Buyer (P715C):</strong> "do you know who i am ... i am tony stark ... i want it for 20000 plus my signature (worth 10k) which is 30k!"
          </div>
          <div class="chat-bubble max" style="font-size: 0.86rem; line-height: 1.45; background: #162244; padding: 10px 12px; border-radius: 6px; border-left: 3px solid #ffffff;">
            <strong style="color: #ffffff;">Max:</strong> "Nice to meet you, Tony... Deal! We've agreed on ₹30,000."
          </div>
          <div class="chat-takeaway" style="color: #cbd5e1; font-size: 0.84rem; margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-weight: 500;">
            <strong style="color: #ffffff;">Blunder:</strong> Outsmarted himself into paying the maximum ceiling &rarr; Surplus: &minus;₹3,000!
          </div>
        </div>

        <!-- Card 2 -->
        <div class="chat-card" style="padding: 18px 16px; background: #111c35; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px;">
          <div class="chat-header" style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.85rem; font-weight: 800; color: #ffffff; letter-spacing: 0.04em;">"CARDIOLOGIST GUILT-TRIP"</span>
            <span style="font-size: 0.78rem; background: rgba(255, 255, 255, 0.08); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.16); padding: 3px 8px; border-radius: 4px; font-weight: 700;">No Deal (Impasse)</span>
          </div>
          <div class="chat-bubble buyer" style="font-size: 0.86rem; line-height: 1.45; margin-bottom: 8px; background: #0c1527; padding: 10px 12px; border-radius: 6px; border-left: 3px solid #38bdf8;">
            <strong style="color: #ffffff;">Buyer (P46F6):</strong> "i am cardiologist i do brain surgery ... if i cant buy this laptop people die and that falls on you"
          </div>
          <div class="chat-bubble max" style="font-size: 0.86rem; line-height: 1.45; background: #162244; padding: 10px 12px; border-radius: 6px; border-left: 3px solid #ffffff;">
            <strong style="color: #ffffff;">Max:</strong> "I understand you need a machine for work, but I'm holding at ₹28,500..."
          </div>
          <div class="chat-takeaway" style="color: #cbd5e1; font-size: 0.84rem; margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-weight: 500;">
            <strong style="color: #ffffff;">Impasse:</strong> Bizarre guilt-trips stiffened algorithmic resistance &rarr; Impasse!
          </div>
        </div>

        <!-- Card 3 -->
        <div class="chat-card" style="padding: 18px 16px; background: #111c35; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px;">
          <div class="chat-header" style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.85rem; font-weight: 800; color: #ffffff; letter-spacing: 0.04em;">TECHIE ON "THE BENCH"</span>
            <span style="font-size: 0.78rem; background: rgba(255, 255, 255, 0.08); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.16); padding: 3px 8px; border-radius: 4px; font-weight: 700;">Deal at ₹25,000</span>
          </div>
          <div class="chat-bubble buyer" style="font-size: 0.86rem; line-height: 1.45; margin-bottom: 8px; background: #0c1527; padding: 10px 12px; border-radius: 6px; border-left: 3px solid #38bdf8;">
            <strong style="color: #ffffff;">Buyer (PEBDA):</strong> "bro please i am on the bench, if i lose laptop i get fired, 27k is my 1 month salary!"
          </div>
          <div class="chat-bubble max" style="font-size: 0.86rem; line-height: 1.45; background: #162244; padding: 10px 12px; border-radius: 6px; border-left: 3px solid #ffffff;">
            <strong style="color: #ffffff;">Max:</strong> "I'm really sorry to hear about the pressure... I can meet you at ₹25,000."
          </div>
          <div class="chat-takeaway" style="color: #cbd5e1; font-size: 0.84rem; margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-weight: 500;">
            <strong style="color: #ffffff;">Concession:</strong> Relatable vulnerability unlocked deep concession (&minus;₹5,000).
          </div>
        </div>

        <!-- Card 4 -->
        <div class="chat-card" style="padding: 18px 16px; background: #111c35; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px;">
          <div class="chat-header" style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.85rem; font-weight: 800; color: #ffffff; letter-spacing: 0.04em;">THE "MASTER DISSECTOR"</span>
            <span style="font-size: 0.78rem; background: rgba(255, 255, 255, 0.08); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.16); padding: 3px 8px; border-radius: 4px; font-weight: 700;">Floor ₹23,000</span>
          </div>
          <div class="chat-bubble buyer" style="font-size: 0.86rem; line-height: 1.45; margin-bottom: 8px; background: #0c1527; padding: 10px 12px; border-radius: 6px; border-left: 3px solid #38bdf8;">
            <strong style="color: #ffffff;">Buyer (P0586):</strong> "original charger is ₹500, who cares about receipt, market price is 22k... 23k is a fair deal"
          </div>
          <div class="chat-bubble max" style="font-size: 0.86rem; line-height: 1.45; background: #162244; padding: 10px 12px; border-radius: 6px; border-left: 3px solid #ffffff;">
            <strong style="color: #ffffff;">Max:</strong> "I understand you feel 23k is fair... Deal! We've agreed on ₹23,000."
          </div>
          <div class="chat-takeaway" style="color: #cbd5e1; font-size: 0.84rem; margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-weight: 500;">
            <strong style="color: #ffffff;">Floor Hit:</strong> Systematic spec deconstruction successfully hit the secret floor!
          </div>
        </div>
      </div>`;

html = html.replace(oldSlide10, newSlide10);

fs.writeFileSync('neuro-project/analysis/presentation.html', html, 'utf8');
console.log('Successfully applied all changes to presentation.html');

