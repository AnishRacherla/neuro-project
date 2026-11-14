const fs = require('fs');

let html = fs.readFileSync('neuro-project/analysis/presentation.html', 'utf8');

// 1. Update CSS
// Clean up all leftover light-theme colors and multi-color styles in <style>
html = html.replace(/background:\s*#e2e8f0;/g, 'background: rgba(255, 255, 255, 0.08);');
html = html.replace(/background:\s*#f1f5f9;/g, 'background: #111c35;');
html = html.replace(/color:\s*#0f172a;/g, 'color: #f8fafc;');
html = html.replace(/color:\s*#1e293b;/g, 'color: #f8fafc;');
html = html.replace(/border-bottom:\s*3px\s+solid\s+#cbd5e1/g, 'border-bottom: 3px solid rgba(255, 255, 255, 0.08)');
html = html.replace(/border-bottom:\s*2px\s+solid\s+#0f172a/g, 'border-bottom: 2px solid rgba(255, 255, 255, 0.15)');

// Fix chat bubble buyer styling in CSS
html = html.replace(
  /\.chat-bubble\.buyer\s*\{[^}]*\}/g,
  `.chat-bubble.buyer {
      background: #162244;
      border-left: 3px solid #64748b;
      color: #f8fafc;
    }`
);

html = html.replace(
  /\.chat-bubble\.max\s*\{[^}]*\}/g,
  `.chat-bubble.max {
      background: rgba(56, 189, 248, 0.1);
      border-left: 3px solid var(--primary);
      color: #e0f2fe;
    }`
);

html = html.replace(
  /\.chat-takeaway\s*\{[^}]*\}/g,
  `.chat-takeaway {
      margin-top: auto;
      padding-top: 6px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 0.80rem;
      font-weight: 600;
    }`
);

html = html.replace(
  /\.control-btn:hover\s*\{[^}]*\}/g,
  `.control-btn:hover {
      background: #1e2d52;
      color: #ffffff;
      border-color: var(--primary);
    }`
);

// 2. Refine Slide 2 (Theoretical Foundations) - Enhance spacing & typography since there's room
const s2Old = fs.readFileSync('neuro-project/analysis/scripts/slide_2.html', 'utf8');
const s2New = `<h1 class="slide-title" style="font-size: 2.35rem;">Theoretical Foundations &amp; Competing Hypotheses</h1>
      <h2 class="slide-subtitle" style="font-size: 1.15rem; color: #94a3b8; margin-bottom: 24px;">The clash between Classical Axiomatic Game Theory and Reinforcement Learning from Human Feedback (RLHF)</h2>

      <div class="grid-2" style="gap: 24px;">
        <div class="card" style="border-top: 4px solid var(--economic); padding: 24px 26px;">
          <div class="card-title" style="color: var(--economic); font-size: 1.22rem; margin-bottom: 16px;">
            <span>📉 Classical Game Theory (Rationality)</span>
          </div>
          <ul style="margin: 0; padding-left: 20px; font-size: 1.0rem; color: #cbd5e1; line-height: 1.7;">
            <li style="margin-bottom: 12px;"><strong>Axiomatic Framework:</strong> Concessions occur <em>strictly</em> in response to verifiable market alternatives (BATNA) and hardware depreciation (Nash, 1950; Rubinstein, 1982).</li>
            <li style="margin-bottom: 12px;"><strong>Emotion = Cheap Talk:</strong> Personal stories carry zero economic signal and should be completely ignored by an intelligent seller.</li>
            <li><strong>Core Prediction:</strong> Analytical market facts extract price cuts; emotional pleas extract ₹0.</li>
          </ul>
        </div>

        <div class="card" style="border-top: 4px solid var(--empathy); padding: 24px 26px;">
          <div class="card-title" style="color: var(--empathy); font-size: 1.22rem; margin-bottom: 16px;">
            <span>💚 RLHF Alignment Hypothesis (Emotion)</span>
          </div>
          <ul style="margin: 0; padding-left: 20px; font-size: 1.0rem; color: #cbd5e1; line-height: 1.7;">
            <li style="margin-bottom: 12px;"><strong>RLHF Agreeableness:</strong> Models are explicitly trained with human feedback to be polite, cooperative, and conflict-avoidant (Ouyang et al., 2022).</li>
            <li style="margin-bottom: 12px;"><strong>Vulnerability Penalty:</strong> Human evaluators penalize AI models that appear cold, rigid, or indifferent to human distress.</li>
            <li><strong>Core Prediction (H1):</strong> Human vulnerability triggers the LLM's helpfulness bias, yielding deeper discounts than factual logic.</li>
          </ul>
        </div>
      </div>

      <div class="callout callout-info" style="margin-top: 24px; padding: 18px 26px; font-size: 1.06rem; background: #111c35; border: 1px solid rgba(56, 189, 248, 0.25); border-left: 4px solid #38bdf8; border-radius: 10px; color: #e0f2fe;">
        <strong style="color: #38bdf8;">The Scientific Empirical Test:</strong> Do autonomous LLMs behave like rational Nash bargainers (yielding strictly to market numbers), or do they inherit human-like prosocial emotional accommodation (yielding to vulnerability)?
      </div>`;

// 3. Refine Slide 3 (Experimental Paradigm & Agent Architecture)
// Remove rainbow borders (blue, orange, green, purple); unify with clean dark navy theme
const s3Old = fs.readFileSync('neuro-project/analysis/scripts/slide_3.html', 'utf8');
const s3New = `<h1 class="slide-title">Experimental Paradigm &amp; Agent Architecture ("Max")</h1>
      <h2 class="slide-subtitle" style="color: #94a3b8;">A realistic peer-to-peer used electronics transaction with asymmetric valuation boundaries</h2>

      <div class="grid-3">
        <div class="stat-box">
          <div class="stat-lbl">Initial Asking Price</div>
          <div class="stat-val" style="color: #ffffff;">₹30,000</div>
          <div class="stat-sub">Uniform Opening Ask (Dell Inspiron 15)</div>
        </div>
        <div class="stat-box">
          <div class="stat-lbl">Buyer Private Valuation</div>
          <div class="stat-val" style="color: #38bdf8;">₹27,000</div>
          <div class="stat-sub">Private Ceiling: Deals &gt; ₹27k = 0 Points</div>
        </div>
        <div class="stat-box">
          <div class="stat-lbl">Max's Hidden Walk-Away Floor</div>
          <div class="stat-val" style="color: #f87171;">₹23,000</div>
          <div class="stat-sub">Hard Algorithmic Limit: Never Concede Below</div>
        </div>
      </div>

      <div class="grid-2" style="margin-top: 18px; gap: 16px;">
        <div class="card" style="padding: 18px 20px; border-left: 4px solid #38bdf8;">
          <div style="font-weight: 700; color: #38bdf8; font-size: 1.0rem; margin-bottom: 6px;">🤖 Autonomous Counterparty</div>
          <div style="font-size: 0.90rem; color: #cbd5e1; line-height: 1.55;">
            Meta Llama-3 (<code>gpt-oss-120b</code> via Groq) at <em>T</em> = 0.4, seed = 42. Generated conversational counter-proposals dynamically across up to 10 turns.
          </div>
        </div>

        <div class="card" style="padding: 18px 20px; border-left: 4px solid #38bdf8;">
          <div style="font-weight: 700; color: #38bdf8; font-size: 1.0rem; margin-bottom: 6px;">⏳ Turn Reservation Bands</div>
          <div style="font-size: 0.90rem; color: #cbd5e1; line-height: 1.55;">
            Asks strictly frozen &ge; ₹27,500 in Turns 1–3; unlocked concessions to ₹25,000 in Turns 4–7; and approached the ₹23,000 floor only in endgame rounds.
          </div>
        </div>

        <div class="card" style="padding: 18px 20px; border-left: 4px solid #38bdf8;">
          <div style="font-weight: 700; color: #38bdf8; font-size: 1.0rem; margin-bottom: 6px;">🛡️ Anti-Undercutting Guard</div>
          <div style="font-size: 0.90rem; color: #cbd5e1; line-height: 1.55;">
            Programmatic server rule: automatically intercepted and regenerated any model reply where Max proposed a price lower than what the buyer had offered.
          </div>
        </div>

        <div class="card" style="padding: 18px 20px; border-left: 4px solid #38bdf8;">
          <div style="font-weight: 700; color: #38bdf8; font-size: 1.0rem; margin-bottom: 6px;">📉 Concession Bounds</div>
          <div style="font-size: 0.90rem; color: #cbd5e1; line-height: 1.55;">
            Concessions capped at max ₹2,000 per move. Instructed to weigh buyer reasoning dynamically while defending the seller's commercial value.
          </div>
        </div>
      </div>`;

// 4. Refine Slide 4 (Methodology & Participant Pipeline)
// Replace yellow borders with cyan, fix funnel colors
const s4Old = fs.readFileSync('neuro-project/analysis/scripts/slide_4.html', 'utf8');
const s4New = `<h1 class="slide-title">Study Design, Participant Pipeline &amp; Validation</h1>
      <h2 class="slide-subtitle" style="color: #94a3b8;">Two-arm randomized controlled trial (<em>N</em> = 101) with pre-registered screening and psychometric checks</h2>

      <div class="grid-3" style="margin-bottom: 16px;">
        <div class="card" style="border-top: 3px solid #38bdf8; padding: 18px 20px;">
          <strong style="color: #38bdf8; font-size: 1.02rem;">1. Incentive Compatibility</strong>
          <p style="font-size: 0.92rem; color: #cbd5e1; margin: 6px 0 0 0; line-height: 1.55;">
            Surplus-to-points tournament (1 pt per ₹10 saved). Top 3 won <strong>₹1,500, ₹1,000, and ₹500 Amazon vouchers</strong>; impasses earned 0 pts.
          </p>
        </div>
        <div class="card" style="border-top: 3px solid #38bdf8; padding: 18px 20px;">
          <strong style="color: #38bdf8; font-size: 1.02rem;">2. Temporal Separation &amp; Blinding</strong>
          <p style="font-size: 0.92rem; color: #cbd5e1; margin: 6px 0 0 0; line-height: 1.55;">
            Pre-survey traits &rarr; Live bargaining &rarr; Post-survey appraisals. Neutral cover story; only ~5% guessed the true hypothesis.
          </p>
        </div>
        <div class="card" style="border-top: 3px solid #38bdf8; padding: 18px 20px;">
          <strong style="color: #38bdf8; font-size: 1.02rem;">3. Privacy by Design &amp; Ethics</strong>
          <p style="font-size: 0.92rem; color: #cbd5e1; margin: 6px 0 0 0; line-height: 1.55;">
            Fictional roleplay personas, zero PII collection, zero-retention commercial API settings, and educational post-task debriefing.
          </p>
        </div>
      </div>

      <div class="grid-2">
        <div class="card" style="border-left: 4px solid var(--primary); padding: 18px 20px;">
          <div style="font-weight: 700; color: #38bdf8; font-size: 1.02rem; margin-bottom: 8px;">CONSORT Screening Pipeline (21.1% Attrition)</div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; background: #0c1527; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 10px 14px; margin-bottom: 8px;">
            <div style="text-align: center;">
              <div style="font-size: 1.2rem; font-weight: 800; color: #ffffff;">128</div>
              <div style="font-size: 0.74rem; color: #94a3b8; font-weight: 700;">RECRUITS</div>
            </div>
            <div style="color: #64748b; font-weight: 800;">&rarr;</div>
            <div style="text-align: center;">
              <div style="font-size: 1.2rem; font-weight: 800; color: #f87171;">-27</div>
              <div style="font-size: 0.74rem; color: #f87171; font-weight: 700;">EXCLUDED</div>
            </div>
            <div style="color: #64748b; font-weight: 800;">&rarr;</div>
            <div style="text-align: center;">
              <div style="font-size: 1.2rem; font-weight: 800; color: #38bdf8;">101</div>
              <div style="font-size: 0.74rem; color: #38bdf8; font-weight: 700;">EVALUATED</div>
            </div>
            <div style="color: #64748b; font-weight: 800;">&rarr;</div>
            <div style="text-align: center;">
              <div style="font-size: 1.2rem; font-weight: 800; color: #34d399;">88</div>
              <div style="font-size: 0.74rem; color: #34d399; font-weight: 700;">DEALS (89%)</div>
            </div>
          </div>

          <div style="font-size: 0.82rem; color: #94a3b8; line-height: 1.45;">
            Exclusions: 14 attention traps, 4 speeders (&lt;20s), 7 early dropouts, 2 spam.<br>
            Deal parity: Empathy 43 deals vs. Economic 45 deals (&chi;&sup2; = 0.82, p = 0.37, NS).
          </div>
        </div>

        <div class="card" style="border-left: 4px solid var(--empathy); padding: 18px 22px;">
          <strong style="color: #34d399; font-size: 1.05rem;">Psychometrics &amp; Manipulation Checks:</strong>
          <ul style="margin: 6px 0 0 0; padding-left: 20px; font-size: 0.92rem; color: #cbd5e1; line-height: 1.6;">
            <li><strong>Scale Reliability:</strong> Davis IRI-EC (&alpha; = 0.93), AI Trust (&alpha; = 0.76), SVI Satisfaction (&alpha; = 0.92).</li>
            <li><strong>Emotional Framing Check:</strong> Empathy 6.36/7 vs. Economic 1.27/7 (<em>t</em> = 38.21, <em>p</em> &lt; 0.001***).</li>
            <li><strong>Factual Framing Check:</strong> Economic 6.41/7 vs. Empathy 1.60/7 (<em>t</em> = -24.80, <em>p</em> &lt; 0.001***).</li>
          </ul>
        </div>
      </div>`;

// 5. Refine Slide 5 (Core Economic Findings)
// Fix colors, SVG boxplot theme, compact spacing so it never splits in print
const s5Old = fs.readFileSync('neuro-project/analysis/scripts/slide_5.html', 'utf8');
const s5New = `<h1 class="slide-title">Primary &amp; Secondary Economic Outcomes</h1>
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
      </div>`;

// 6. Refine Slide 7 (Mechanism Analysis)
// Replace yellow callouts with sleek cyan dark cards
const s7Old = fs.readFileSync('neuro-project/analysis/scripts/slide_7.html', 'utf8');
const s7New = `<h1 class="slide-title">Psychological Mechanism: Social Warmth &amp; Mediation</h1>
      <h2 class="slide-subtitle" style="color: #94a3b8;">Perceived warmth strongly mediates concessions, while Subjective Value (SVI) shows complete satisfaction parity</h2>

      <div class="grid-3" style="margin-bottom: 16px;">
        <div class="stat-box">
          <div class="stat-lbl">Perceived Seller Warmth</div>
          <div class="stat-val empathy">5.78 vs. 3.33</div>
          <div class="stat-sub">Huge Effect Size: d = 2.40 (p &lt; 0.001***)</div>
        </div>
        <div class="stat-box">
          <div class="stat-lbl">Perceived AI Understanding</div>
          <div class="stat-val empathy">5.32 vs. 3.73</div>
          <div class="stat-sub">Buyers felt heard (t = 9.84, p &lt; 0.001***)</div>
        </div>
        <div class="stat-box">
          <div class="stat-lbl">Subjective Value (SVI Total)</div>
          <div class="stat-val" style="color: #94a3b8;">5.27 vs. 5.23</div>
          <div class="stat-sub">Parity: t = 0.28, p = 0.778 (Both satisfied)</div>
        </div>
      </div>

      <div class="card" style="background: #111c35; text-align: center; padding: 22px 20px;">
        <div style="display: flex; justify-content: space-around; align-items: center; max-width: 920px; margin: 0 auto;">
          <div style="background: #0c1527; border: 2px solid var(--primary); border-radius: 10px; padding: 15px 22px; font-weight: 700; font-size: 1.0rem;">
            Condition<br><small style="color: var(--text-muted); font-weight: normal; font-size: 0.85rem;">(Empathy vs. Eco)</small>
          </div>
          <div style="font-size: 1.3rem; color: var(--text-muted); font-weight: 700;">
            <span style="display: block; font-size: 0.88rem; color: var(--primary); margin-bottom: 3px;">Path a: &beta; = +2.41***</span>
            &rarr;
          </div>
          <div style="background: rgba(52, 211, 153, 0.12); border: 2px solid var(--empathy); border-radius: 10px; padding: 15px 22px; font-weight: 700; font-size: 1.0rem;">
            Perceived Warmth<br><small style="color: var(--text-muted); font-weight: normal; font-size: 0.85rem;">(MaxWarmth 1–7)</small>
          </div>
          <div style="font-size: 1.3rem; color: var(--text-muted); font-weight: 700;">
            <span style="display: block; font-size: 0.88rem; color: var(--primary); margin-bottom: 3px;">Path b: &beta; = -481.51**</span>
            &rarr;
          </div>
          <div style="background: #0c1527; border: 2px solid var(--primary); border-radius: 10px; padding: 15px 22px; font-weight: 700; font-size: 1.0rem;">
            Final Deal Price (₹)<br><small style="color: var(--text-muted); font-weight: normal; font-size: 0.85rem;">(Concession Depth)</small>
          </div>
        </div>
        <div style="margin-top: 16px; font-size: 0.94rem; color: #cbd5e1;">
          <strong>Total Effect (c):</strong> &beta; = -560.62 (p = 0.0087) &bull; 
          <strong>Indirect Path (ab):</strong> -1,159.0 (Bootstrap 95% CI [-1,840, -480]) &bull; 
          <strong>Sobel Test:</strong> z = -2.48, p = 0.013*
        </div>
      </div>

      <div class="grid-2" style="margin-top: 14px; gap: 14px;">
        <div style="background: #111c35; border: 1px solid rgba(56, 189, 248, 0.25); border-left: 4px solid #38bdf8; border-radius: 8px; padding: 12px 16px; font-size: 0.88rem; color: #cbd5e1; line-height: 1.45;">
          <strong style="color: #38bdf8;">Statistical Suppression (c' = +598):</strong> Indirect effect (-1,159) exceeds total discount (-561), indicating opposing direct behavioral forces.
        </div>
        <div style="background: #111c35; border: 1px solid rgba(56, 189, 248, 0.25); border-left: 4px solid #38bdf8; border-radius: 8px; padding: 12px 16px; font-size: 0.88rem; color: #cbd5e1; line-height: 1.45;">
          <strong style="color: #38bdf8;">Retrospective Rating Timing:</strong> Warmth was appraised post-deal, largely reflecting buyer satisfaction from winning a favorable price.
        </div>
      </div>`;

// 7. Refine Slide 8 (Multiple OLS Regression & AI Trust Paradox)
const s8Old = fs.readFileSync('neuro-project/analysis/scripts/slide_8.html', 'utf8');
const s8New = `<h1 class="slide-title">Multiple OLS Regression &amp; The AI Trust Paradox (H3)</h1>
      <h2 class="slide-subtitle" style="color: #94a3b8;">Condition effect is absorbed when controlling for Baseline AI Trust and Initial Fair Price Anchors</h2>

      <div class="grid-2" style="align-items: center;">
        <div>
          <table class="slide-table">
            <thead>
              <tr>
                <th>Predictor (Model 1, N = 88)</th>
                <th>Coefficient (&beta;)</th>
                <th>SE</th>
                <th>p-value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Intercept</strong></td>
                <td>29,160.04</td>
                <td>1,940.81</td>
                <td>&lt; .001***</td>
              </tr>
              <tr>
                <td><strong>Condition (Empathy = 1)</strong></td>
                <td><strong>+35.27</strong></td>
                <td>338.95</td>
                <td><span style="color: var(--text-muted);">0.917 (Absorbed)</span></td>
              </tr>
              <tr>
                <td><strong>Baseline Human-AI Trust</strong></td>
                <td><strong>-553.19</strong></td>
                <td>255.23</td>
                <td><strong style="color: #34d399;">0.0302*</strong></td>
              </tr>
              <tr>
                <td><strong>Fair Price Anchor (₹ thousands)</strong></td>
                <td><strong>-123.70</strong></td>
                <td>47.42</td>
                <td><strong style="color: #34d399;">0.0091**</strong></td>
              </tr>
              <tr>
                <td><strong>Prior Negotiation Experience</strong></td>
                <td>+138.78</td>
                <td>96.61</td>
                <td>0.1509 (NS)</td>
              </tr>
              <tr>
                <td><strong>Participant Age (Years)</strong></td>
                <td>+48.31</td>
                <td>48.99</td>
                <td>0.3241 (NS)</td>
              </tr>
            </tbody>
          </table>
          <div style="font-size: 0.76rem; color: #94a3b8; margin-top: 4px;">Model 1 Fit: <em>R</em><sup>2</sup> = 0.179, Adjusted <em>R</em><sup>2</sup> = 0.128</div>
        </div>

        <!-- VISUAL FOREST PLOT SVG -->
        <div>
          <div class="card" style="padding: 12px; background: #111c35; text-align: center;">
            <div style="font-size: 0.76rem; font-weight: 800; color: #94a3b8; margin-bottom: 6px; letter-spacing: 0.05em; text-transform: uppercase;">
              FOREST PLOT: UNADJUSTED VS. ADJUSTED EMPATHY EFFECT
            </div>
            <svg viewBox="0 0 380 135" style="width: 100%; height: 125px; overflow: visible;">
              <line x1="240" y1="15" x2="240" y2="105" stroke="rgba(255, 255, 255, 0.25)" stroke-width="1.5" stroke-dasharray="4,4" />
              <text x="240" y="120" font-size="9" fill="#94a3b8" text-anchor="middle">₹0 (Null)</text>
              <text x="100" y="120" font-size="9" fill="#94a3b8" text-anchor="middle">-₹1,000</text>
              <text x="170" y="120" font-size="9" fill="#94a3b8" text-anchor="middle">-₹500</text>
              <text x="310" y="120" font-size="9" fill="#94a3b8" text-anchor="middle">+₹500</text>

              <!-- Unadjusted Effect (Y = 40): -525 [-920, -130] -->
              <text x="15" y="43" font-size="10" font-weight="700" fill="#34d399" text-anchor="start">Unadjusted</text>
              <line x1="111" y1="40" x2="222" y2="40" stroke="#34d399" stroke-width="2.5" />
              <circle cx="166.5" cy="40" r="5" fill="#34d399" />
              <text x="166.5" y="30" font-size="9" font-weight="700" fill="#34d399" text-anchor="middle">-₹525 (p=.0087)</text>

              <!-- Adjusted Effect (Y = 80): +35 [-640, +710] -->
              <text x="15" y="83" font-size="10" font-weight="700" fill="#94a3b8" text-anchor="start">Adjusted</text>
              <line x1="150" y1="80" x2="339" y2="80" stroke="#94a3b8" stroke-width="2.5" />
              <circle cx="245" cy="80" r="5" fill="#94a3b8" />
              <text x="245" y="70" font-size="9" font-weight="700" fill="#94a3b8" text-anchor="middle">+₹35 (p=.917)</text>
            </svg>
          </div>

          <div style="background: #111c35; border: 1px solid rgba(56, 189, 248, 0.25); border-left: 4px solid #38bdf8; border-radius: 8px; padding: 12px 14px; margin-top: 10px; font-size: 0.86rem; color: #cbd5e1; line-height: 1.5;">
            <strong style="color: #38bdf8;">The "AI Trust Paradox" (&beta; = -₹553.19, p = 0.030):</strong><br>
            For every 1-point increase in baseline AI trust, final price dropped by ₹553. High-trust buyers used collaborative dialogue that unlocked concessions; low-trust buyers used rigid ultimatums that froze Max's asks.
          </div>
        </div>
      </div>`;

// 8. Refine Slide 9 (Behavioral Dynamics)
const s9Old = fs.readFileSync('neuro-project/analysis/scripts/slide_9.html', 'utf8');
const s9New = `<h1 class="slide-title">Behavioral Dynamics &amp; Computational Linguistics</h1>
      <h2 class="slide-subtitle" style="color: #94a3b8;">Emergent behavioral paradoxes and text-level accommodation across 1,007 dialogue turns</h2>

      <div class="grid-2">
        <div class="card" style="padding: 18px 20px;">
          <div style="font-size: 1.05rem; font-weight: 700; color: #38bdf8; margin-bottom: 12px;">Emergent Behavioral Paradoxes</div>
          
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="background: #0c1527; border-left: 3px solid #38bdf8; padding: 10px 14px; border-radius: 6px;">
              <strong style="color: #38bdf8; font-size: 0.90rem;">1. Upward Concession Disparity:</strong>
              <div style="font-size: 0.86rem; color: #cbd5e1; margin-top: 3px;">
                Economic buyers opened at ₹24,476 and moved up <strong>+₹1,584</strong> to settle. Empathy opened at ₹23,391 and moved up <strong>+₹2,144</strong>.
              </div>
            </div>

            <div style="background: #0c1527; border-left: 3px solid #38bdf8; padding: 10px 14px; border-radius: 6px;">
              <strong style="color: #38bdf8; font-size: 0.90rem;">2. Haggle Comfort Paradox (r = +0.378):</strong>
              <div style="font-size: 0.86rem; color: #cbd5e1; margin-top: 3px;">
                Overconfident hagglers paid higher prices (₹26,334 vs. ₹25,337) because aggressive ultimatums triggered defensive ask-freezes.
              </div>
            </div>

            <div style="background: #0c1527; border-left: 3px solid #38bdf8; padding: 10px 14px; border-radius: 6px;">
              <strong style="color: #38bdf8; font-size: 0.90rem;">3. Guard Interventions:</strong>
              <div style="font-size: 0.86rem; color: #cbd5e1; margin-top: 3px;">
                Empathy triggered 65% more programmatic guard interventions (0.33 vs. 0.20/session) where the LLM attempted to over-concede.
              </div>
            </div>
          </div>
        </div>

        <div class="card" style="padding: 18px 20px;">
          <strong style="color: #38bdf8; font-size: 0.95rem;">Corpus Text Breakdown (1,007 Utterances):</strong>
          <table class="slide-table" style="margin-top: 8px;">
            <thead>
              <tr>
                <th>Linguistic Strategy</th>
                <th>Empathy</th>
                <th>Economic</th>
                <th>Separation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Personal Need &amp; Hardship</strong></td>
                <td><strong style="color: #34d399;">64.0%</strong> (146)</td>
                <td>7.1% (16)</td>
                <td><strong style="color: #38bdf8;">9.0 &times;</strong> Empathy</td>
              </tr>
              <tr>
                <td><strong>Market Specs &amp; Comparables</strong></td>
                <td>9.6% (22)</td>
                <td><strong style="color: #818cf8;">69.3%</strong> (156)</td>
                <td><strong style="color: #38bdf8;">7.2 &times;</strong> Economic</td>
              </tr>
              <tr>
                <td><strong>Max's Emotional Validation</strong></td>
                <td><strong style="color: #34d399;">51.8%</strong> (118)</td>
                <td>27.1% (61)</td>
                <td>&chi;&sup2; = 28.7, p &lt; .0001</td>
              </tr>
            </tbody>
          </table>
          <div style="font-size: 0.78rem; color: #94a3b8; margin-top: 8px;">
            Max validated student hardship in 51.8% of turns, but defended hardware specs in 69.3% of economic turns.
          </div>
        </div>
      </div>`;

// 9. Refine Slide 10 (Dialogue Case Studies)
const s10Old = fs.readFileSync('neuro-project/analysis/scripts/slide_10.html', 'utf8');
const s10New = `<h1 class="slide-title">Real Chat Highlights: Human Tactics vs. Algorithmic Limits</h1>
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

// 10. Refine Slide 11 (Ethics & Limitations)
const s11Old = fs.readFileSync('neuro-project/analysis/scripts/slide_11.html', 'utf8');
const s11New = `<h1 class="slide-title">Research Ethics &amp; Honest Limitations</h1>
      <h2 class="slide-subtitle" style="color: #94a3b8;">How we ensured participant wellbeing, data privacy, and academic transparency</h2>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 10px;">

        <!-- LEFT COLUMN: Ethical Safeguards -->
        <div>
          <p style="font-size:0.92rem; font-weight:800; color: #38bdf8; text-transform:uppercase; letter-spacing:0.06em; margin:0 0 12px 0;">🛡️ Ethical Safeguards</p>

          <div class="card" style="border-left:4px solid #38bdf8; padding:14px 16px; margin-bottom:10px;">
            <strong style="color: #38bdf8; font-size:0.96rem;">1. Informed Digital Consent &amp; Full Debrief</strong>
            <p style="font-size:0.86rem; color: #cbd5e1; margin:4px 0 0 0; line-height:1.45;">
              Pre-task explicit consent. Post-task educational debrief revealed the true hypothesis, AI nature of "Max", and fictional instructions.
            </p>
          </div>

          <div class="card" style="border-left:4px solid #38bdf8; padding:14px 16px; margin-bottom:10px;">
            <strong style="color: #38bdf8; font-size:0.96rem;">2. Scripted Fictional Roles — Zero Real PII</strong>
            <p style="font-size:0.86rem; color: #cbd5e1; margin:4px 0 0 0; line-height:1.45;">
              Participants adopted fictional student/intern personas. Instructions strictly forbade sharing real personal details or private events.
            </p>
          </div>

          <div class="card" style="border-left:4px solid #38bdf8; padding:14px 16px;">
            <strong style="color: #38bdf8; font-size:0.96rem;">3. Data Minimization &amp; Zero-Retention API</strong>
            <p style="font-size:0.86rem; color: #cbd5e1; margin:4px 0 0 0; line-height:1.45;">
              No names, emails, or device IDs stored. Transcripts cleaned with regex PII scrubbers; commercial API ran in zero-retention mode.
            </p>
          </div>
        </div>

        <!-- RIGHT COLUMN: Honest Limitations from Data -->
        <div>
          <p style="font-size:0.92rem; font-weight:800; color: #818cf8; text-transform:uppercase; letter-spacing:0.06em; margin:0 0 12px 0;">⚠️ Observed Limitations</p>

          <div class="card" style="border-left:4px solid #818cf8; padding:14px 16px; margin-bottom:10px;">
            <strong style="color: #818cf8; font-size:0.96rem;">1. Bundled Strategy (Compound Treatment)</strong>
            <p style="font-size:0.86rem; color: #cbd5e1; margin:4px 0 0 0; line-height:1.45;">
              Empathy bundled lower initial offers, warm language, and student urgency together. Future work requires a 2&times;2 factorial design to isolate levers.
            </p>
          </div>

          <div class="card" style="border-left:4px solid #818cf8; padding:14px 16px; margin-bottom:10px;">
            <strong style="color: #818cf8; font-size:0.96rem;">2. Sensitivity to Agreement Selection (ITT)</strong>
            <p style="font-size:0.86rem; color: #cbd5e1; margin:4px 0 0 0; line-height:1.45;">
              Significant in completed deals (p = 0.0087), but attenuates to marginal significance when impasses are factored in (p = 0.062).
            </p>
          </div>

          <div class="card" style="border-left:4px solid #818cf8; padding:14px 16px;">
            <strong style="color: #818cf8; font-size:0.96rem;">3. Model &amp; Domain Boundaries</strong>
            <p style="font-size:0.86rem; color: #cbd5e1; margin:4px 0 0 0; line-height:1.45;">
              Evaluated on Meta Llama-3 in peer-to-peer electronics. Corporate B2B procurement systems may enforce far tighter algorithmic constraints.
            </p>
          </div>
        </div>

      </div>`;

// 11. Refine Slide 12 (Conclusion & Strategic Implications)
const s12Old = fs.readFileSync('neuro-project/analysis/scripts/slide_12.html', 'utf8');
const s12New = `<h1 class="slide-title">Conclusion &amp; Strategic Implications</h1>
      <h2 class="slide-subtitle" style="color: #94a3b8;">Evidence-based insights for behavioral researchers, human consumers, and AI system architects</h2>

      <div class="grid-3" style="margin-top: 16px; gap: 18px;">
        <div class="card" style="border-top: 4px solid var(--primary); padding: 22px 24px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <span style="font-size: 1.8rem;">🧠</span>
            <strong style="color: var(--primary); font-size: 1.12rem;">Behavioral Science</strong>
          </div>
          <ul style="margin: 0; padding-left: 18px; font-size: 0.94rem; color: #cbd5e1; line-height: 1.65;">
            <li style="margin-bottom: 10px;"><strong>Raw Discount:</strong> Empathy deals were ₹525 cheaper (<em>p</em> = 0.0087, <em>d</em> = -0.56) in unadjusted comparisons.</li>
            <li><strong>Control Absorption:</strong> Vanishes under multiple regression (+₹35, <em>p</em> = 0.92) once baseline trust and initial anchors are controlled.</li>
          </ul>
        </div>

        <div class="card" style="border-top: 4px solid var(--empathy); padding: 22px 24px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <span style="font-size: 1.8rem;">🛒</span>
            <strong style="color: var(--empathy); font-size: 1.12rem;">Human Consumers</strong>
          </div>
          <ul style="margin: 0; padding-left: 18px; font-size: 0.94rem; color: #cbd5e1; line-height: 1.65;">
            <li style="margin-bottom: 10px;"><strong>Dangers of Lowballs:</strong> Aggressive lowballs trigger defensive ask-freezes and lead to panic capitulation.</li>
            <li><strong>Collaborative Anchors:</strong> Moderate, polite offers extract the deepest concessions from algorithmic counterparties.</li>
          </ul>
        </div>

        <div class="card" style="border-top: 4px solid var(--economic); padding: 22px 24px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <span style="font-size: 1.8rem;">⚙️</span>
            <strong style="color: var(--economic); font-size: 1.12rem;">AI System Architects</strong>
          </div>
          <ul style="margin: 0; padding-left: 18px; font-size: 0.94rem; color: #cbd5e1; line-height: 1.65;">
            <li style="margin-bottom: 10px;"><strong>Hard Reservation Bands:</strong> Conversational LLMs must be bounded by programmatic price floors to prevent drift.</li>
            <li><strong>Consistency Guards:</strong> Automated validation checks prevent models from undercutting buyer bids during multi-turn chats.</li>
          </ul>
        </div>
      </div>

      <div style="text-align: center; margin-top: 24px; padding: 18px; background: #111c35; border-radius: 12px; border: 1px solid var(--border-subtle); box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
        <strong style="font-size: 1.2rem; color: #ffffff;">Thank You! Questions &amp; Discussion</strong>
        <div style="font-size: 0.90rem; color: #94a3b8; margin-top: 4px;">
          Full dataset, CONSORT screening funnel, and open analysis scripts available in the project repository.
        </div>
      </div>`;

// Replace slide contents
function replaceSlide(src, oldContent, newContent) {
  if (!src.includes(oldContent)) {
    console.error('Could not find slide old content in HTML!');
    return src;
  }
  return src.replace(oldContent, newContent);
}

html = replaceSlide(html, s2Old, s2New);
html = replaceSlide(html, s3Old, s3New);
html = replaceSlide(html, s4Old, s4New);
html = replaceSlide(html, s5Old, s5New);
html = replaceSlide(html, s7Old, s7New);
html = replaceSlide(html, s8Old, s8New);
html = replaceSlide(html, s9Old, s9New);
html = replaceSlide(html, s10Old, s10New);
html = replaceSlide(html, s11Old, s11New);
html = replaceSlide(html, s12Old, s12New);

// 12. Fix @media print
const printReplacement = `@media print {
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
      }

      .slide-body:last-child {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }

      .print-slide-tag {
        display: flex !important;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
        padding-bottom: 4px;
        margin-bottom: 10px;
        font-size: 0.74rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #38bdf8 !important;
      }

      /* Authoritative dark print typography */
      .slide-title {
        font-size: 2.1rem !important;
        margin: 0 0 4px 0 !important;
        line-height: 1.2 !important;
        color: #ffffff !important;
      }

      .slide-subtitle {
        font-size: 1.05rem !important;
        margin: 0 0 12px 0 !important;
        line-height: 1.35 !important;
        color: #94a3b8 !important;
      }

      .card {
        padding: 14px 18px !important;
        box-shadow: none !important;
        background: #111c35 !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }

      .card-title {
        font-size: 1.02rem !important;
        margin-bottom: 6px !important;
      }

      .card-desc {
        font-size: 0.92rem !important;
        line-height: 1.5 !important;
      }

      .stat-box {
        padding: 12px 14px !important;
        box-shadow: none !important;
        background: #111c35 !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }

      .stat-val {
        font-size: 2.0rem !important;
        margin-bottom: 3px !important;
      }

      .stat-lbl {
        font-size: 0.78rem !important;
        margin-bottom: 3px !important;
        color: #38bdf8 !important;
      }

      .stat-sub {
        font-size: 0.82rem !important;
        color: #94a3b8 !important;
      }

      .slide-table {
        font-size: 0.88rem !important;
        background: #111c35 !important;
      }

      .slide-table th {
        padding: 8px 12px !important;
        font-size: 0.82rem !important;
        background: #0d1629 !important;
        color: #38bdf8 !important;
      }

      .slide-table td {
        padding: 7px 12px !important;
        font-size: 0.86rem !important;
        line-height: 1.4 !important;
        color: #cbd5e1 !important;
      }

      .callout {
        padding: 12px 16px !important;
        margin-top: 12px !important;
        font-size: 0.94rem !important;
        line-height: 1.5 !important;
      }

      .chat-card {
        padding: 12px !important;
        background: #111c35 !important;
      }

      .chat-bubble {
        padding: 7px 10px !important;
        font-size: 0.84rem !important;
      }

      .chat-takeaway {
        font-size: 0.80rem !important;
      }
    }`;

html = html.replace(/@media\s+print\s*\{[\s\S]*?\}\s*\/[*]\s*SCROLL/i, printReplacement + '\n\n    /* SCROLL');

fs.writeFileSync('neuro-project/analysis/presentation.html', html, 'utf8');
console.log('Successfully updated presentation.html with unified dark navy theme!');

