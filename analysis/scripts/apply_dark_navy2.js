const fs = require('fs');
let html = fs.readFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', 'utf8');

// --- SLIDE 1: EXACT MATCH TO USER'S REFERENCE IMAGE ---
const s1Old = `<div style="text-align: center; padding: 20px 20px 10px 20px;">
        <span style="display: inline-block; padding: 6px 16px; border-radius: 9999px; background: #e0f2fe; color: #0369a1; font-weight: 800; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px; border: 1px solid #bae6fd;">
          Behavioral Economics &amp; Autonomous AI Systems
        </span>
        <h1 class="slide-title" style="font-size: 2.65rem; max-width: 1040px; margin: 0 auto 16px auto; line-height: 1.18;">
          Persuading the Machine: Empathy-Based Appeals, Economic Rationality, and Human–LLM Bargaining
        </h1>
        <h2 class="slide-subtitle" style="font-size: 1.25rem; max-width: 880px; margin: 0 auto 24px auto; color: #475569; line-height: 1.45;">
          Experimental Evidence from <em>N</em> = 101 Live Bargaining Exchanges Against an Autonomous LLM Seller
        </h2>

        <div style="display: flex; justify-content: center; gap: 24px; margin-top: 16px;">
          <div style="background: #ffffff; border: 1px solid var(--border-subtle); border-radius: 12px; padding: 18px 28px; text-align: left; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
            <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); font-weight: 800; letter-spacing: 0.06em;">Research Group</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 4px 0;">Team 4 — Neuro-Project Research Group</div>
            <div style="font-size: 0.90rem; color: #64748b;">Dept. of Computer Science &amp; Cognitive Science</div>
          </div>
          <div style="background: #ffffff; border: 1px solid var(--border-subtle); border-radius: 12px; padding: 18px 28px; text-align: left; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
            <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); font-weight: 800; letter-spacing: 0.06em;">Study Scope</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 4px 0;"><em>N</em> = 101 Recruits &bull; 1,007 Dialogue Turns</div>
            <div style="font-size: 0.90rem; color: #64748b;">Autonomous Counterparty: Meta Llama-3 via Groq</div>
          </div>
        </div>

        <div class="callout callout-info" style="max-width: 940px; margin: 26px auto 0 auto; text-align: left; font-size: 1.08rem; padding: 18px 24px; line-height: 1.55;">
          <strong>Core Research Question:</strong> When negotiating with an autonomous language model, does conversational empathy and human vulnerability elicit greater financial concessions than analytical market logic?
        </div>
      </div>`;

const s1New = `<div style="text-align: center; padding: 36px 20px 20px 20px;">
        <div style="color: #38bdf8; font-size: 0.82rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 20px;">
          BEHAVIORAL ECONOMICS &amp; AUTONOMOUS AI SYSTEMS
        </div>
        
        <h1 style="color: #ffffff; font-size: 2.85rem; font-weight: 800; max-width: 980px; margin: 0 auto 20px auto; line-height: 1.2; letter-spacing: normal;">
          Persuading the Machine: Empathy vs. Economic Rationality
        </h1>
        
        <h2 style="color: #94a3b8; font-size: 1.25rem; font-weight: 500; max-width: 860px; margin: 0 auto 36px auto; line-height: 1.5;">
          Experimental Evidence from <em>N</em> = 101 Live Bargaining Exchanges Against an Autonomous LLM Seller.
        </h2>

        <div style="display: flex; justify-content: center; gap: 48px; margin-top: 20px;">
          <div style="text-align: left;">
            <div style="font-size: 0.74rem; text-transform: uppercase; color: #64748b; font-weight: 800; letter-spacing: 0.08em; margin-bottom: 4px;">RESEARCH GROUP</div>
            <div style="font-size: 1.15rem; font-weight: 700; color: #ffffff;">Team 4 &mdash; Neuro-Project</div>
            <div style="font-size: 0.85rem; color: #94a3b8; margin-top: 2px;">Dept. of Computer Science &amp; Cognitive Science</div>
          </div>
          
          <div style="text-align: left;">
            <div style="font-size: 0.74rem; text-transform: uppercase; color: #64748b; font-weight: 800; letter-spacing: 0.08em; margin-bottom: 4px;">AGENT</div>
            <div style="font-size: 1.15rem; font-weight: 700; color: #38bdf8;">Meta Llama-3</div>
            <div style="font-size: 0.85rem; color: #94a3b8; margin-top: 2px;"><em>T</em> = 0.4, seed = 42 via Groq</div>
          </div>

          <div style="text-align: left;">
            <div style="font-size: 0.74rem; text-transform: uppercase; color: #64748b; font-weight: 800; letter-spacing: 0.08em; margin-bottom: 4px;">EVALUATED SAMPLE</div>
            <div style="font-size: 1.15rem; font-weight: 700; color: #ffffff;"><em>N</em> = 101 Recruits</div>
            <div style="font-size: 0.85rem; color: #94a3b8; margin-top: 2px;">1,007 Transcribed Dialogue Turns</div>
          </div>
        </div>

        <div style="max-width: 900px; margin: 34px auto 0 auto; text-align: left; font-size: 1.05rem; padding: 18px 24px; line-height: 1.55; background: #111c35; border: 1px solid rgba(56, 189, 248, 0.25); border-left: 4px solid #38bdf8; border-radius: 10px; color: #e0f2fe;">
          <strong style="color: #38bdf8;">Core Research Question:</strong> When negotiating with an autonomous language model, does conversational empathy and human vulnerability elicit greater financial concessions than analytical market logic?
        </div>
      </div>`;

html = html.replace(s1Old, s1New);
console.log('Slide 1 updated to exact match.');

// 3. SYSTEMATIC REPLACEMENT OF INLINE LIGHT-THEME COLORS:
// Replace white/light backgrounds
html = html.replace(/background:\s*(#ffffff|white|#f8fafc)/gi, 'background: #111c35');
html = html.replace(/background:\s*#f8fafc;/g, 'background: #0d1629;');
html = html.replace(/background:\s*#eff6ff;/g, 'background: rgba(56, 189, 248, 0.08);');
html = html.replace(/background:\s*#fffbeb;/g, 'background: rgba(251, 191, 36, 0.08);');
html = html.replace(/background:\s*#ecfdf5;/g, 'background: rgba(52, 211, 153, 0.08);');
html = html.replace(/background:\s*#f0fdf4;/g, 'background: rgba(52, 211, 153, 0.08);');

// Replace dark text colors with light text colors
html = html.replace(/color:\s*#0f172a;/gi, 'color: #ffffff;');
html = html.replace(/color:\s*#1e293b;/gi, 'color: #f1f5f9;');
html = html.replace(/color:\s*#334155;/gi, 'color: #cbd5e1;');
html = html.replace(/color:\s*#475569;/gi, 'color: #94a3b8;');
html = html.replace(/color:\s*#1e3a8a;/gi, 'color: #38bdf8;');
html = html.replace(/color:\s*#1e3a5f;/gi, 'color: #38bdf8;');
html = html.replace(/color:\s*#065f46;/gi, 'color: #34d399;');
html = html.replace(/color:\s*#064e3b;/gi, 'color: #34d399;');
html = html.replace(/color:\s*#b45309;/gi, 'color: #fbbf24;');
html = html.replace(/color:\s*#92400e;/gi, 'color: #fbbf24;');
html = html.replace(/color:\s*#0f766e;/gi, 'color: #38bdf8;');

// Replace light borders
html = html.replace(/border:\s*1px\s*solid\s*#e2e8f0;/gi, 'border: 1px solid rgba(255, 255, 255, 0.08);');
html = html.replace(/border:\s*1px\s*solid\s*#cbd5e1;/gi, 'border: 1px solid rgba(255, 255, 255, 0.12);');
html = html.replace(/border-color:\s*#cbd5e1/gi, 'border-color: rgba(255, 255, 255, 0.1)');

fs.writeFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', html, 'utf8');
console.log('Slide 1 and inline dark colors updated.');

