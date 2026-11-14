const fs = require('fs');
let html = fs.readFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', 'utf8');

// --- SLIDE 2 REPLACEMENT ---
const s2Old = `<div class="grid-2">
        <div class="card" style="border-top: 5px solid var(--economic); padding: 24px 26px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div class="card-title" style="color: var(--economic); font-size: 1.2rem; margin-bottom: 12px;">
              <span>📉 Classical Game Theory / Economic Rationality</span>
            </div>
            <p class="card-desc" style="font-size: 1.02rem; line-height: 1.6;">
              In standard bargaining models (Nash, 1950; Rubinstein, 1982), an intelligent economic agent concedes price <strong>strictly in response to verifiable market alternatives (BATNA)</strong> and hardware depreciation.
            </p>
          </div>
          <div style="background: #f8fafc; border-radius: 10px; padding: 14px 16px; font-size: 0.94rem; color: #334155; border: 1px dashed #cbd5e1; margin-top: 18px; line-height: 1.5;">
            <strong>Economic Prediction:</strong> Emotional vulnerability is unverified "cheap talk" (0 economic value). Only factual price comparables and outside options will extract discounts.
          </div>
        </div>

        <div class="card" style="border-top: 5px solid var(--empathy); padding: 24px 26px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div class="card-title" style="color: var(--empathy); font-size: 1.2rem; margin-bottom: 12px;">
              <span>💚 AI Alignment &amp; RLHF Behavioral Hypothesis</span>
            </div>
            <p class="card-desc" style="font-size: 1.02rem; line-height: 1.6;">
              Modern Large Language Models undergo extensive <strong>Reinforcement Learning from Human Feedback</strong> (Ouyang et al., 2022). Human evaluators systematically penalize models that appear cold, unyielding, or combative when human users articulate distress.
            </p>
          </div>
          <div style="background: #f8fafc; border-radius: 10px; padding: 14px 16px; font-size: 0.94rem; color: #334155; border: 1px dashed #cbd5e1; margin-top: 18px; line-height: 1.5;">
            <strong>Empathy Prediction (H1):</strong> The LLM's prosocial alignment creates an agreeableness bias, yielding deeper financial discounts for vulnerable human buyers.
          </div>
        </div>
      </div>`;

const s2New = `<div class="grid-2" style="gap: 22px;">
        <div class="card" style="border-top: 5px solid var(--economic); padding: 22px 24px;">
          <div class="card-title" style="color: var(--economic); font-size: 1.15rem; margin-bottom: 14px;">
            <span>📉 Classical Game Theory (Rationality)</span>
          </div>
          <ul style="margin: 0; padding-left: 20px; font-size: 0.94rem; color: #334155; line-height: 1.65;">
            <li style="margin-bottom: 10px;"><strong>Axiomatic Framework:</strong> Concessions occur <em>strictly</em> in response to verifiable market alternatives (BATNA) and hardware depreciation (Nash, 1950; Rubinstein, 1982).</li>
            <li style="margin-bottom: 10px;"><strong>Emotion = Cheap Talk:</strong> Personal stories carry zero economic signal and should be completely ignored by an intelligent seller.</li>
            <li><strong>Core Prediction:</strong> Analytical market facts extract price cuts; emotional pleas extract ₹0.</li>
          </ul>
        </div>

        <div class="card" style="border-top: 5px solid var(--empathy); padding: 22px 24px;">
          <div class="card-title" style="color: var(--empathy); font-size: 1.15rem; margin-bottom: 14px;">
            <span>💚 RLHF Alignment Hypothesis (Emotion)</span>
          </div>
          <ul style="margin: 0; padding-left: 20px; font-size: 0.94rem; color: #334155; line-height: 1.65;">
            <li style="margin-bottom: 10px;"><strong>RLHF Agreeableness:</strong> Models are explicitly trained with human feedback to be polite, cooperative, and conflict-avoidant (Ouyang et al., 2022).</li>
            <li style="margin-bottom: 10px;"><strong>Vulnerability Penalty:</strong> Human evaluators penalize AI models that appear cold, rigid, or indifferent to human distress.</li>
            <li><strong>Core Prediction (H1):</strong> Human vulnerability triggers the LLM's helpfulness bias, yielding deeper discounts than factual logic.</li>
          </ul>
        </div>
      </div>`;

if (html.includes(s2Old)) {
  html = html.replace(s2Old, s2New);
  console.log('Slide 2 updated to scannable bullets.');
} else {
  console.log('Slide 2 target not found directly, checking partial.');
}

// --- SLIDE 3 REPLACEMENT (Wall of text -> 2x2 Clean Grid) ---
const s3Target = `<div class="card" style="margin-top: 16px;">
        <div class="card-title" style="color: #1e293b;">Autonomous Seller Mechanics &amp; Guardrails:</div>
        <ul style="margin: 0; padding-left: 22px; font-size: 0.95rem; color: #334155; line-height: 1.75;">
          <li><strong>Autonomous Counterparty:</strong> Meta Llama-3 (<code>openai/gpt-oss-120b</code> via Groq) at <em>T</em> = 0.4, seed = 42, generating conversational counter-proposals in real time (up to 10 rounds).</li>
          <li><strong>Turn Reservation Bands:</strong> Max was instructed to hold asks &ge; ₹27,500 in Turns 1–3, unlocking concessions down to ₹25,000 in Turns 4–7, and approaching ₹23,000 only in later turns. <em>Concession depth mechanically depended on turn count.</em></li>
          <li><strong>Safety &amp; Anti-Undercutting Guard:</strong> Server automatically intercepted and regenerated any response where Max proposed an ask lower than what the buyer had already offered to pay.</li>
          <li><strong>Autonomous Reasoning &amp; Concession Caps:</strong> Single-turn concession moves capped at ₹2,000, instructing the model to weigh the strength of buyer reasoning dynamically while protecting seller value.</li>
        </ul>
      </div>`;

const s3New = `<div class="grid-2" style="margin-top: 16px; gap: 16px;">
        <div class="card" style="padding: 16px 18px; border-left: 4px solid #2563eb;">
          <div style="font-weight: 700; color: #1e3a8a; font-size: 0.96rem; margin-bottom: 4px;">🤖 Autonomous Counterparty</div>
          <div style="font-size: 0.88rem; color: #475569; line-height: 1.5;">
            Meta Llama-3 (<code>gpt-oss-120b</code> via Groq) at <em>T</em> = 0.4, seed = 42. Generated conversational counter-proposals dynamically across up to 10 turns.
          </div>
        </div>

        <div class="card" style="padding: 16px 18px; border-left: 4px solid #d97706;">
          <div style="font-weight: 700; color: #b45309; font-size: 0.96rem; margin-bottom: 4px;">⏳ Turn Reservation Bands</div>
          <div style="font-size: 0.88rem; color: #475569; line-height: 1.5;">
            Asks strictly frozen &ge; ₹27,500 in Turns 1–3; unlocked concessions to ₹25,000 in Turns 4–7; and approached the ₹23,000 floor only in endgame rounds.
          </div>
        </div>

        <div class="card" style="padding: 16px 18px; border-left: 4px solid #059669;">
          <div style="font-weight: 700; color: #065f46; font-size: 0.96rem; margin-bottom: 4px;">🛡️ Anti-Undercutting Guard</div>
          <div style="font-size: 0.88rem; color: #475569; line-height: 1.5;">
            Programmatic server rule: automatically intercepted and regenerated any model reply where Max proposed a price lower than what the buyer had offered.
          </div>
        </div>

        <div class="card" style="padding: 16px 18px; border-left: 4px solid #7c3aed;">
          <div style="font-weight: 700; color: #5b21b6; font-size: 0.96rem; margin-bottom: 4px;">📉 Concession Bounds</div>
          <div style="font-size: 0.88rem; color: #475569; line-height: 1.5;">
            Concessions capped at max ₹2,000 per move. Instructed to weigh buyer reasoning dynamically while defending the seller's commercial value.
          </div>
        </div>
      </div>`;

if (html.includes(s3Target)) {
  html = html.replace(s3Target, s3New);
  console.log('Slide 3 updated to clean 2x2 grid.');
} else {
  console.log('Slide 3 target not found directly.');
}

// Save progress
fs.writeFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', html, 'utf8');

