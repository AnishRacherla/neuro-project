const fs = require('fs');
let html = fs.readFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', 'utf8');

// 1. REVISE CSS VARIABLES & GLOBAL THEME
const cssOld = `<style>
    :root {
      --bg: #090d16;
      --surface-main: #f8fafc;
      --card-bg: #ffffff;
      --text-dark: #0f172a;
      --text-muted: #64748b;
      --text-light: #94a3b8;
      --border-subtle: #e2e8f0;
      --border-strong: #cbd5e1;
      
      /* Primary Academic Accent */
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --primary-subtle: #eff6ff;

      /* Empathy Condition Palette */
      --empathy: #059669;
      --empathy-light: #ecfdf5;
      --empathy-dark: #064e3b;

      /* Economic Condition Palette */
      --economic: #4f46e5;
      --economic-light: #eef2ff;
      --economic-dark: #312e81;

      /* Highlights & Warnings */
      --amber: #d97706;
      --amber-light: #fffbeb;
      --rose: #e11d48;
      --rose-light: #fff1f2;
    }`;

const cssNew = `<style>
    :root {
      --bg: #070d1e;
      --surface-main: #0b1329;
      --card-bg: #111c35;
      --text-dark: #f8fafc;
      --text-muted: #94a3b8;
      --text-light: #64748b;
      --border-subtle: rgba(255, 255, 255, 0.09);
      --border-strong: rgba(255, 255, 255, 0.18);
      
      /* Primary Academic Accent (Electric Sky Blue / Cyan) */
      --primary: #38bdf8;
      --primary-hover: #0284c7;
      --primary-subtle: rgba(56, 189, 248, 0.12);

      /* Empathy Condition Palette (Ice Emerald) */
      --empathy: #34d399;
      --empathy-light: rgba(52, 211, 153, 0.12);
      --empathy-dark: #10b981;

      /* Economic Condition Palette (Cool Indigo / Ice Slate) */
      --economic: #818cf8;
      --economic-light: rgba(129, 140, 248, 0.12);
      --economic-dark: #6366f1;

      /* Highlights & Warnings */
      --amber: #fbbf24;
      --amber-light: rgba(251, 191, 36, 0.12);
      --rose: #f87171;
      --rose-light: rgba(248, 113, 113, 0.12);
    }`;

html = html.replace(cssOld, cssNew);

// 2. UPDATE DECK CONTAINER AND HEADER
html = html.replace('#deck-container {\n      flex: 1;\n      display: flex;\n      flex-direction: column;\n      position: relative;\n      background: #f1f5f9;\n      overflow: hidden;\n    }',
`#deck-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      background: #0b1329;
      overflow: hidden;
    }`);

html = html.replace('.slide-header {\n      height: 52px;\n      background: #ffffff;\n      border-bottom: 1px solid var(--border-subtle);',
`.slide-header {
      height: 52px;
      background: #080e1e;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);`);

html = html.replace('.slide-badge {\n      font-size: 0.82rem;\n      font-weight: 700;\n      background: #f8fafc;\n      color: #475569;\n      padding: 4px 12px;\n      border-radius: 9999px;\n      border: 1px solid var(--border-subtle);\n    }',
`.slide-badge {
      font-size: 0.82rem;
      font-weight: 700;
      background: #111c35;
      color: #94a3b8;
      padding: 4px 12px;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }`);

html = html.replace('.project-pill {\n      font-size: 0.72rem;\n      font-weight: 800;\n      text-transform: uppercase;\n      letter-spacing: 0.08em;\n      padding: 4px 10px;\n      border-radius: 6px;\n      background: #0f172a;\n      color: #ffffff;\n    }',
`.project-pill {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 4px 10px;
      border-radius: 6px;
      background: #111c35;
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.25);
    }`);

html = html.replace('.slide-title {\n      font-size: 2.2rem;\n      font-weight: 800;\n      color: #0f172a;',
`.slide-title {
      font-size: 2.2rem;
      font-weight: 800;
      color: #ffffff;`);

html = html.replace('.card {\n      background: #ffffff;\n      border: 1px solid var(--border-subtle);\n      border-radius: 12px;\n      padding: 20px 22px;\n      box-shadow: 0 2px 4px rgba(15, 23, 42, 0.03);\n      position: relative;\n    }',
`.card {
      background: #111c35;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 20px 22px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      position: relative;
    }`);

html = html.replace('.card-title {\n      font-size: 1.08rem;\n      font-weight: 700;\n      color: #0f172a;',
`.card-title {
      font-size: 1.08rem;
      font-weight: 700;
      color: #ffffff;`);

html = html.replace('.card-desc {\n      font-size: 0.96rem;\n      color: #475569;',
`.card-desc {
      font-size: 0.96rem;
      color: #cbd5e1;`);

html = html.replace('.stat-box {\n      background: #ffffff;\n      border: 1px solid var(--border-subtle);\n      border-radius: 12px;\n      padding: 18px 16px;\n      text-align: center;\n      box-shadow: 0 2px 4px rgba(15, 23, 42, 0.03);',
`.stat-box {
      background: #111c35;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 18px 16px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);`);

html = html.replace('.stat-val {\n      font-size: 2.3rem;\n      font-weight: 800;\n      letter-spacing: normal;\n      line-height: 1.15;\n      margin-bottom: 5px;\n      color: #0f172a;',
`.stat-val {
      font-size: 2.3rem;
      font-weight: 800;
      letter-spacing: normal;
      line-height: 1.15;
      margin-bottom: 5px;
      color: #ffffff;`);

html = html.replace('.stat-lbl {\n      font-size: 0.84rem;\n      font-weight: 800;\n      text-transform: uppercase;\n      letter-spacing: 0.06em;\n      color: var(--text-muted);',
`.stat-lbl {
      font-size: 0.84rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #38bdf8;`);

html = html.replace('.slide-table {\n      width: 100%;\n      border-collapse: collapse;\n      font-size: 0.92rem;\n      background: #ffffff;\n      border-radius: 10px;\n      overflow: hidden;\n      border: 1px solid var(--border-subtle);\n    }',
`.slide-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.92rem;
      background: #111c35;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }`);

html = html.replace('.slide-table th {\n      background: #f8fafc;\n      padding: 11px 14px;\n      text-align: left;\n      font-weight: 700;\n      color: #334155;\n      border-bottom: 1px solid var(--border-subtle);',
`.slide-table th {
      background: #0d1629;
      padding: 11px 14px;
      text-align: left;
      font-weight: 700;
      color: #38bdf8;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);`);

html = html.replace('.slide-table td {\n      padding: 10px 14px;\n      border-bottom: 1px solid #f1f5f9;\n      color: #334155;',
`.slide-table td {
      padding: 10px 14px;\n      border-bottom: 1px solid rgba(255, 255, 255, 0.06);\n      color: #cbd5e1;`);

html = html.replace('.slide-table tr:hover td { background-color: #f8fafc; }',
`.slide-table tr:hover td { background-color: #162444; }`);

html = html.replace('.callout-info {\n      background: var(--primary-subtle);\n      border-left: 4px solid var(--primary);\n      color: #1e3a8a;\n    }',
`.callout-info {
      background: rgba(56, 189, 248, 0.09);
      border-left: 4px solid #38bdf8;
      color: #e0f2fe;
    }`);

html = html.replace('#deck-controls {\n      height: 60px;\n      background: #ffffff;\n      border-top: 1px solid var(--border-subtle);',
`#deck-controls {
      height: 60px;
      background: #080e1e;
      border-top: 1px solid rgba(255, 255, 255, 0.08);`);

html = html.replace('.control-btn {\n      padding: 8px 14px;\n      border-radius: 8px;\n      border: 1px solid var(--border-subtle);\n      background: #ffffff;\n      color: #334155;',
`.control-btn {
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: #111c35;
      color: #cbd5e1;`);

html = html.replace('#notes-drawer {\n      position: absolute;\n      bottom: 60px;\n      left: 0;\n      width: 100%;\n      background: #0f172a;\n      color: #e2e8f0;',
`#notes-drawer {
      position: absolute;
      bottom: 60px;
      left: 0;
      width: 100%;
      background: #0d1629;
      color: #cbd5e1;
      border-top: 1px solid rgba(255, 255, 255, 0.1);`);

fs.writeFileSync('c:/Users/Anish/OneDrive/Desktop/neuro_project/neuro-project/analysis/presentation.html', html, 'utf8');
console.log('Global dark navy theme applied.');

