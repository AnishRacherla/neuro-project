const fs = require('fs');
let html = fs.readFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', 'utf8');

// --- SLIDE 7 CAVEAT CLEANUP ---
const s7OldCaveat = `<div class="callout callout-warn" style="margin-top: 16px; font-size: 0.96rem; line-height: 1.55;">
        <strong>Methodological Caveat:</strong> The indirect effect (-1,159) exceeds total effect (-561), indicating statistical suppression (direct effect <em>c'</em> = +598.35). Because warmth was appraised post-deal, this likely reflects retrospective justification of favorable prices.
      </div>`;

const s7NewCaveat = `<div class="grid-2" style="margin-top: 14px; gap: 14px;">
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 10px 14px; font-size: 0.88rem; color: #92400e; line-height: 1.45;">
          <strong>Statistical Suppression (c' = +598):</strong> Indirect effect (-1,159) exceeds total discount (-561), indicating opposing direct behavioral forces.
        </div>
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 10px 14px; font-size: 0.88rem; color: #92400e; line-height: 1.45;">
          <strong>Retrospective Rating Timing:</strong> Warmth was appraised post-deal, largely reflecting buyer satisfaction from winning a favorable price.
        </div>
      </div>`;

if (html.includes(s7OldCaveat)) {
  html = html.replace(s7OldCaveat, s7NewCaveat);
  console.log('Slide 7 caveat split into 2 clean boxes.');
}

// --- SLIDE 9 CLEANUP ---
const s9Old = `<div class="card">
          <strong style="color: #0f766e; font-size: 0.9rem;">Emergent Behavioral Paradoxes:</strong>
          <div style="margin-top: 6px; font-size: 0.8rem; color: #475569; line-height: 1.45;">
            <p style="margin: 0 0 6px 0;">
              <strong>1. Upward Concession Disparity:</strong> Economic buyers opened at an average of ₹24,476 and conceded upward by <strong>+₹1,584</strong> to close at ₹26,060. Empathy opened at ₹23,391 and conceded upward by <strong>+₹2,144</strong> to close at ₹25,535.
            </p>
            <p style="margin: 0 0 6px 0;">
              <strong>2. Haggle Comfort Paradox (r = +0.378):</strong> Confident hagglers paid ₹26,334 vs. ₹25,337 for hesitant hagglers. Combative bargaining triggered defensive ask-freezes.
            </p>
            <p style="margin: 0;">
              <strong>3. Guard Interventions:</strong> Empathy sessions triggered 0.33 programmatic guard interventions per session vs. 0.20 in Economic, pushing the LLM toward over-concession.
            </p>
          </div>
        </div>`;

const s9New = `<div class="card" style="padding: 16px 20px;">
          <div style="font-size: 1.05rem; font-weight: 700; color: #0f766e; margin-bottom: 12px;">Emergent Behavioral Paradoxes</div>
          
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="background: #f8fafc; border-left: 3px solid #2563eb; padding: 8px 12px; border-radius: 6px;">
              <strong style="color: #1e3a8a; font-size: 0.88rem;">1. Upward Concession Disparity:</strong>
              <div style="font-size: 0.84rem; color: #475569; margin-top: 2px;">
                Economic buyers opened at ₹24,476 and moved up <strong>+₹1,584</strong> to settle. Empathy opened at ₹23,391 and moved up <strong>+₹2,144</strong>.
              </div>
            </div>

            <div style="background: #f8fafc; border-left: 3px solid #d97706; padding: 8px 12px; border-radius: 6px;">
              <strong style="color: #b45309; font-size: 0.88rem;">2. Haggle Comfort Paradox (r = +0.378):</strong>
              <div style="font-size: 0.84rem; color: #475569; margin-top: 2px;">
                Overconfident hagglers paid higher prices (₹26,334 vs. ₹25,337) because aggressive ultimatums triggered defensive ask-freezes.
              </div>
            </div>

            <div style="background: #f8fafc; border-left: 3px solid #059669; padding: 8px 12px; border-radius: 6px;">
              <strong style="color: #065f46; font-size: 0.88rem;">3. Guard Interventions:</strong>
              <div style="font-size: 0.84rem; color: #475569; margin-top: 2px;">
                Empathy triggered 65% more programmatic guard interventions (0.33 vs. 0.20/session) where the LLM attempted to over-concede.
              </div>
            </div>
          </div>
        </div>`;

if (html.includes(s9Old)) {
  html = html.replace(s9Old, s9New);
  console.log('Slide 9 paradoxes updated to clean visual cards.');
}

// --- SLIDE 11 CLEANUP ---
const s11Old = `<div class="card" style="border-left:4px solid #10b981; padding:16px 20px; margin-bottom:14px;">
            <strong style="color:#065f46; font-size:1.02rem;">Informed Consent &amp; Debrief</strong>
            <p style="font-size:0.92rem; color:#475569; margin:6px 0 0 0; line-height:1.55;">
              All participants provided explicit digital consent before any task began. A full debrief page revealed the study's true purpose, the AI nature of "Max," and the fictional persona instruction — immediately after their session ended.
            </p>
          </div>

          <div class="card" style="border-left:4px solid #10b981; padding:16px 20px; margin-bottom:14px;">
            <strong style="color:#065f46; font-size:1.02rem;">Scripted Fictional Personas — No Real PII</strong>
            <p style="font-size:0.92rem; color:#475569; margin:6px 0 0 0; line-height:1.55;">
              Participants were explicitly told to <em>imagine</em> a fictional scenario (e.g., student, intern). Instructions prohibited sharing real personal details or sensitive life events. No actual personal information was collected.
            </p>
          </div>

          <div class="card" style="border-left:4px solid #10b981; padding:16px 20px;">
            <strong style="color:#065f46; font-size:1.02rem;">Data Minimization &amp; Zero-Retention API</strong>
            <p style="font-size:0.92rem; color:#475569; margin:6px 0 0 0; line-height:1.55;">
              GDPR-aligned: no names, emails, or device IDs logged. All chat transcripts passed automated regex PII scrubbing. The commercial LLM API was set to <em>zero data-retention</em> mode — no conversation stored server-side.
            </p>
          </div>`;

const s11New = `<div class="card" style="border-left:4px solid #10b981; padding:14px 16px; margin-bottom:10px;">
            <strong style="color:#065f46; font-size:0.96rem;">1. Informed Digital Consent &amp; Full Debrief</strong>
            <p style="font-size:0.86rem; color:#475569; margin:4px 0 0 0; line-height:1.45;">
              Pre-task explicit consent. Post-task educational debrief revealed the true hypothesis, AI nature of "Max", and fictional instructions.
            </p>
          </div>

          <div class="card" style="border-left:4px solid #10b981; padding:14px 16px; margin-bottom:10px;">
            <strong style="color:#065f46; font-size:0.96rem;">2. Scripted Fictional Roles — Zero Real PII</strong>
            <p style="font-size:0.86rem; color:#475569; margin:4px 0 0 0; line-height:1.45;">
              Participants adopted fictional student/intern personas. Instructions strictly forbade sharing real personal details or private events.
            </p>
          </div>

          <div class="card" style="border-left:4px solid #10b981; padding:14px 16px;">
            <strong style="color:#065f46; font-size:0.96rem;">3. Data Minimization &amp; Zero-Retention API</strong>
            <p style="font-size:0.86rem; color:#475569; margin:4px 0 0 0; line-height:1.45;">
              No names, emails, or device IDs stored. Transcripts cleaned with regex PII scrubbers; commercial API ran in zero-retention mode.
            </p>
          </div>`;

if (html.includes(s11Old)) {
  html = html.replace(s11Old, s11New);
  console.log('Slide 11 left column streamlined.');
}

const s11RightOld = `<div class="card" style="border-left:4px solid #f59e0b; padding:16px 20px; margin-bottom:14px;">
            <strong style="color:#b45309; font-size:1.02rem;">Bundled Intervention (Compound Manipulation)</strong>
            <p style="font-size:0.92rem; color:#475569; margin:6px 0 0 0; line-height:1.55;">
              Empathy participants were observed to open with lower anchors, warmer language, and urgency framing simultaneously. The ₹525 discount reflects this combined strategy — not any one element alone. A 2&times;2 factorial design could isolate individual levers.
            </p>
          </div>

          <div class="card" style="border-left:4px solid #f59e0b; padding:16px 20px; margin-bottom:14px;">
            <strong style="color:#b45309; font-size:1.02rem;">Effect Attenuates Under Full-Sample Analysis</strong>
            <p style="font-size:0.92rem; color:#475569; margin:6px 0 0 0; line-height:1.55;">
              The ₹525 gap is significant in completed deals (<em>p</em> = 0.0087, <em>d</em> = 0.56) but attenuates to marginal significance when impasses are included (<em>p</em> = 0.062). The effect is real but sensitive to who reached a deal.
            </p>
          </div>

          <div class="card" style="border-left:4px solid #f59e0b; padding:16px 20px;">
            <strong style="color:#b45309; font-size:1.02rem;">Single LLM &amp; Single-Item Context</strong>
            <p style="font-size:0.92rem; color:#475569; margin:6px 0 0 0; line-height:1.55;">
              Results are from one LLM (Llama-3) in one domain (used electronics). Generalization to other models, enterprise procurement systems, or high-stakes negotiations requires further study.
            </p>
          </div>`;

const s11RightNew = `<div class="card" style="border-left:4px solid #f59e0b; padding:14px 16px; margin-bottom:10px;">
            <strong style="color:#b45309; font-size:0.96rem;">1. Bundled Strategy (Compound Treatment)</strong>
            <p style="font-size:0.86rem; color:#475569; margin:4px 0 0 0; line-height:1.45;">
              Empathy bundled lower initial offers, warm language, and student urgency together. Future work requires a 2&times;2 factorial design to isolate levers.
            </p>
          </div>

          <div class="card" style="border-left:4px solid #f59e0b; padding:14px 16px; margin-bottom:10px;">
            <strong style="color:#b45309; font-size:0.96rem;">2. Sensitivity to Agreement Selection (ITT)</strong>
            <p style="font-size:0.86rem; color:#475569; margin:4px 0 0 0; line-height:1.45;">
              Significant in completed deals (p = 0.0087), but attenuates to marginal significance when impasses are factored in (p = 0.062).
            </p>
          </div>

          <div class="card" style="border-left:4px solid #f59e0b; padding:14px 16px;">
            <strong style="color:#b45309; font-size:0.96rem;">3. Model &amp; Domain Boundaries</strong>
            <p style="font-size:0.86rem; color:#475569; margin:4px 0 0 0; line-height:1.45;">
              Evaluated on Meta Llama-3 in peer-to-peer electronics. Corporate B2B procurement systems may enforce far tighter algorithmic constraints.
            </p>
          </div>`;

if (html.includes(s11RightOld)) {
  html = html.replace(s11RightOld, s11RightNew);
  console.log('Slide 11 right column streamlined.');
}

fs.writeFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', html, 'utf8');

