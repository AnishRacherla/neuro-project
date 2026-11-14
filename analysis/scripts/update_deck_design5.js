const fs = require('fs');
let html = fs.readFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', 'utf8');

// --- SLIDE 4 PIPELINE UPGRADE ---
const s4ConsortOld = `<div class="card" style="border-left: 5px solid var(--primary); padding: 20px 22px;">
          <strong style="color: #1e3a8a; font-size: 1.05rem;">CONSORT Screening Pipeline (21.1% Attrition):</strong>
          <p style="font-size: 0.93rem; color: #334155; margin: 6px 0 8px 0; line-height: 1.55;">
            <strong>128 recruits &rarr; 27 excluded</strong> (14 attention traps, 4 speeders &lt; 20s, 7 premature dropouts, 2 spam) &rarr; <strong>101 evaluated</strong> &rarr; <strong>99 completed protocols</strong> (88 deals + 11 impasses; <strong>88.9% deal completion rate</strong>).
          </p>
          <div style="font-size: 0.88rem; color: var(--text-muted); background: #f8fafc; padding: 8px 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
            Empathy: 43 deals, 7 impasses &bull; Economic: 45 deals, 4 impasses (&chi;&sup2; = 0.816, <em>p</em> = 0.366, NS).
          </div>
        </div>`;

const s4ConsortNew = `<div class="card" style="border-left: 5px solid var(--primary); padding: 18px 20px;">
          <div style="font-weight: 700; color: #1e3a8a; font-size: 1.02rem; margin-bottom: 8px;">CONSORT Screening Pipeline (21.1% Attrition)</div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; margin-bottom: 8px;">
            <div style="text-align: center;">
              <div style="font-size: 1.2rem; font-weight: 800; color: #0f172a;">128</div>
              <div style="font-size: 0.74rem; color: #64748b; font-weight: 700;">RECRUITS</div>
            </div>
            <div style="color: #94a3b8; font-weight: 800;">&rarr;</div>
            <div style="text-align: center;">
              <div style="font-size: 1.2rem; font-weight: 800; color: #dc2626;">-27</div>
              <div style="font-size: 0.74rem; color: #dc2626; font-weight: 700;">EXCLUDED</div>
            </div>
            <div style="color: #94a3b8; font-weight: 800;">&rarr;</div>
            <div style="text-align: center;">
              <div style="font-size: 1.2rem; font-weight: 800; color: #2563eb;">101</div>
              <div style="font-size: 0.74rem; color: #2563eb; font-weight: 700;">EVALUATED</div>
            </div>
            <div style="color: #94a3b8; font-weight: 800;">&rarr;</div>
            <div style="text-align: center;">
              <div style="font-size: 1.2rem; font-weight: 800; color: #059669;">88</div>
              <div style="font-size: 0.74rem; color: #059669; font-weight: 700;">DEALS (89%)</div>
            </div>
          </div>

          <div style="font-size: 0.82rem; color: #64748b; line-height: 1.45;">
            Exclusions: 14 attention traps, 4 speeders (&lt;20s), 7 early dropouts, 2 spam.<br>
            Deal parity: Empathy 43 deals vs. Economic 45 deals (&chi;&sup2; = 0.82, p = 0.37, NS).
          </div>
        </div>`;

if (html.includes(s4ConsortOld)) {
  html = html.replace(s4ConsortOld, s4ConsortNew);
  console.log('Slide 4 CONSORT pipeline updated to visual step flow.');
}

// --- SLIDE 8 TRUST PARADOX UPGRADE ---
const s8OldTrust = `<div style="font-size: 0.78rem; color: #475569; margin-top: 8px; line-height: 1.45;">
            <strong>The "AI Trust Paradox":</strong> Every 1-point increase in pre-task AI trust lowered final price by <strong>₹553.19</strong> (<em>p</em> = 0.030). High-trust buyers negotiated cooperatively; low-trust buyers used rigid ultimatums that froze Max's asks.
          </div>`;

const s8NewTrust = `<div style="background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 8px; padding: 10px 14px; margin-top: 10px; font-size: 0.86rem; color: #1e3a8a; line-height: 1.5;">
            <strong>The "AI Trust Paradox" (&beta; = -₹553.19, p = 0.030):</strong><br>
            For every 1-point increase in baseline AI trust, final price dropped by ₹553. High-trust buyers used collaborative dialogue that unlocked concessions; low-trust buyers used rigid ultimatums that froze Max's asks.
          </div>`;

if (html.includes(s8OldTrust)) {
  html = html.replace(s8OldTrust, s8NewTrust);
  console.log('Slide 8 Trust Paradox callout upgraded.');
}

fs.writeFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', html, 'utf8');

