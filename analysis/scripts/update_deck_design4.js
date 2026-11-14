const fs = require('fs');
let html = fs.readFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', 'utf8');

const s12Old = `<div class="grid-3" style="margin-top: 16px;">
        <div class="card" style="border-top: 5px solid var(--primary); text-align: center; padding: 26px 22px; display: flex; flex-direction: column; justify-content: flex-start;">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">🧠</div>
          <strong style="color: var(--primary); font-size: 1.15rem; display: block; margin-bottom: 10px;">For Behavioral Science</strong>
          <p style="font-size: 0.95rem; color: #475569; margin: 0; line-height: 1.6;">
            Emotional appeals achieved a significant unadjusted price discount in completed deals (₹525, <em>p</em> = 0.0087). However, the gap vanishes after adjusting for baseline trust and anchors (+₹35, <em>p</em> = 0.92).
          </p>
        </div>

        <div class="card" style="border-top: 5px solid var(--empathy); text-align: center; padding: 26px 22px; display: flex; flex-direction: column; justify-content: flex-start;">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">🛒</div>
          <strong style="color: var(--empathy-dark); font-size: 1.15rem; display: block; margin-bottom: 10px;">For Human Consumers</strong>
          <p style="font-size: 0.95rem; color: #475569; margin: 0; line-height: 1.6;">
            Avoid combative opening lowballs against algorithmic sellers. Extreme lowballs activate defensive ask-freezes. Moderate opening anchors paired with cooperative dialogue yield deeper concessions.
          </p>
        </div>

        <div class="card" style="border-top: 5px solid var(--economic); text-align: center; padding: 26px 22px; display: flex; flex-direction: column; justify-content: flex-start;">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">⚙️</div>
          <strong style="color: var(--economic-dark); font-size: 1.15rem; display: block; margin-bottom: 10px;">For AI System Architects</strong>
          <p style="font-size: 0.95rem; color: #475569; margin: 0; line-height: 1.6;">
            Seller bots should pair natural language fluency with programmatic reservation bands and multi-turn consistency checks to prevent unintended concession drift.
          </p>
        </div>
      </div>`;

const s12New = `<div class="grid-3" style="margin-top: 16px; gap: 18px;">
        <div class="card" style="border-top: 5px solid var(--primary); padding: 20px 22px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <span style="font-size: 1.8rem;">🧠</span>
            <strong style="color: var(--primary); font-size: 1.08rem;">Behavioral Science</strong>
          </div>
          <ul style="margin: 0; padding-left: 18px; font-size: 0.90rem; color: #334155; line-height: 1.6;">
            <li style="margin-bottom: 8px;"><strong>Raw Discount:</strong> Empathy deals were ₹525 cheaper (<em>p</em> = 0.0087, <em>d</em> = -0.56) in unadjusted comparisons.</li>
            <li><strong>Control Absorption:</strong> Vanishes under multiple regression (+₹35, <em>p</em> = 0.92) once baseline trust and initial anchors are controlled.</li>
          </ul>
        </div>

        <div class="card" style="border-top: 5px solid var(--empathy); padding: 20px 22px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <span style="font-size: 1.8rem;">🛒</span>
            <strong style="color: var(--empathy-dark); font-size: 1.08rem;">Human Consumers</strong>
          </div>
          <ul style="margin: 0; padding-left: 18px; font-size: 0.90rem; color: #334155; line-height: 1.6;">
            <li style="margin-bottom: 8px;"><strong>Dangers of Lowballs:</strong> Aggressive lowballs trigger defensive ask-freezes and lead to panic capitulation.</li>
            <li><strong>Collaborative Anchors:</strong> Moderate, polite offers extract the deepest concessions from algorithmic counterparties.</li>
          </ul>
        </div>

        <div class="card" style="border-top: 5px solid var(--economic); padding: 20px 22px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <span style="font-size: 1.8rem;">⚙️</span>
            <strong style="color: var(--economic-dark); font-size: 1.08rem;">AI System Architects</strong>
          </div>
          <ul style="margin: 0; padding-left: 18px; font-size: 0.90rem; color: #334155; line-height: 1.6;">
            <li style="margin-bottom: 8px;"><strong>Hard Reservation Bands:</strong> Conversational LLMs must be bounded by programmatic price floors to prevent drift.</li>
            <li><strong>Consistency Guards:</strong> Automated validation checks prevent models from undercutting buyer bids during multi-turn chats.</li>
          </ul>
        </div>
      </div>`;

if (html.includes(s12Old)) {
  html = html.replace(s12Old, s12New);
  console.log('Slide 12 upgraded to scannable bullet points.');
}

fs.writeFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', html, 'utf8');

