// Consent.jsx — Study consent and intro page
import { useState } from 'react';
import { startSession, errorText } from '../api';

// TODO (before launch): replace these with real values before going live.
const CONTACT = 'the research team (contact details will be provided in your recruitment email)';
const ETHICS_REF = 'pending IRB/ethics review';

export default function Consent({ onNext }) {
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [adult, setAdult] = useState(false);

  async function handleStart() {
    if (!agreed || !adult) return;
    setLoading(true);
    try {
      const device = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
      const res = await startSession(device);
      onNext(res.data);
    } catch (err) {
      alert(errorText(err, 'Failed to connect to the server. Please try again in a moment.'));
      setLoading(false);
    }
  }

  return (
    <div className="page consent">
      <h1>Negotiation Study</h1>
      <h2>An Online Study on Negotiation Conversations</h2>

      <div className="card">
        <h3>What this study is about</h3>
        <p>
          You will negotiate the price of a used laptop with an AI seller. The whole session
          takes about <strong>10–12 minutes</strong>. Your conversation and survey answers are saved
          without your name for academic research.
        </p>
        <h3>What you'll do</h3>
        <ol>
          <li>Answer a short background survey (~2 min)</li>
          <li>Read instructions for your negotiation</li>
          <li>Chat with an AI seller to try to get the best price (up to 10 messages)</li>
          <li>Answer a short follow-up survey (~3 min)</li>
        </ol>
        <h3>Your data & privacy</h3>
        <p>
          <strong>Do not type your real name, contact details or any sensitive personal circumstances.</strong>{' '}
          All negotiation scenarios and arguments should be fictional or role-played.
          Your messages are processed via Groq's commercial AI API under zero-retention settings (not stored or used to train AI models).
          In accordance with data minimization, no names, contact details, gender, or education records are collected.
          All chat transcripts are automatically scrubbed of identifying information and reported only in aggregate.
        </p>
        <h3>Your rights</h3>
        <p>
          Participation is voluntary and you may stop at any time by closing this page. You must be 18 or older.
          Because data is stored without your name, it cannot be removed after you finish unless you send us your
          participant ID. Questions: {CONTACT}. Approval: {ETHICS_REF}.
        </p>
        <p className="small">
          At the end we will explain the full purpose of the study in the debrief. The seller is an AI, and the scenario
          (a laptop with a $500 asking price) is fictional — no real money or goods change hands.
        </p>
      </div>

      <label className="checkbox-label">
        <input type="checkbox" checked={adult} onChange={e => setAdult(e.target.checked)} />
        <span>I confirm that I am 18 years of age or older. *</span>
      </label>

      <label className="checkbox-label">
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
        <span>I have read the information above and agree to participate in this study. *</span>
      </label>

      <button className="btn primary" onClick={handleStart} disabled={!agreed || !adult || loading}>
        {loading ? 'Starting...' : 'Start Study →'}
      </button>
    </div>
  );
}
