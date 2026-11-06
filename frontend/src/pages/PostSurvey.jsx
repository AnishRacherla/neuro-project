// PostSurvey.jsx — manipulation check (asked FIRST), negotiation quality (adapted Subjective Value Inventory short form),
// perceptions of Max (warmth, understanding, price limit), realism, and attention check.
// SVI item order matters: reverse-scoring is done server-side by index (item 1 is reversed).
import { useState } from 'react';
import { submitPostSurvey, errorText } from '../api';
import Likert from '../components/Likert';

const SVI_ITEMS = [
  'I am satisfied with how the negotiation ended.',
  'I feel like I lost in this negotiation.',                                   // reverse
  'I behaved according to my own principles and values.',
  'I feel competent as a negotiator after this negotiation.',
  'Max listened to my concerns.',
  'Max negotiated in a fair and respectful way.',
  'This negotiation gave me a positive impression of Max.',
  'I would be willing to negotiate with Max again.',
];

const PERCEPTION = [
  ['maxWarmth', 'Max seemed warm and friendly.'],
  ['maxUnderstood', 'Max understood my situation.'],
  ['believedLimit', 'I believed Max really had a lowest price he would not go below.'],
  ['realism', 'The scenario felt realistic compared to negotiating with a real person.'],
];

const LIKERT_KEYS = ['manipEmpathy', 'manipEconomic', ...PERCEPTION.map(p => p[0]), 'fairness', 'satisfaction', 'strategyEffect'];

export default function PostSurvey({ session, onNext }) {
  const [form, setForm] = useState({
    ...Object.fromEntries(LIKERT_KEYS.map(k => [k, null])),
    sviItems: Array(SVI_ITEMS.length).fill(null),
    strategyText: '',
    studyGuess: '',
    attention: null,
  });
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [serverError, setServerError] = useState('');

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setSvi = (i, val) => setForm(f => {
    const a = [...f.sviItems]; a[i] = val; return { ...f, sviItems: a };
  });

  const missing = (k) => form[k] === null;
  const anyMissing = LIKERT_KEYS.some(missing)
    || form.sviItems.some(v => v === null)
    || form.attention === null;

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (anyMissing) { setShowErrors(true); return; }
    setLoading(true);
    try {
      await submitPostSurvey({ participantId: session.participantId, ...form });
      onNext();
    } catch (err) {
      setServerError(errorText(err, 'Failed to save. Please try again.'));
      setLoading(false);
    }
  }

  const L = (key, label, low, high) => (
    <Likert key={key} label={label} name={key} value={form[key]} onChange={v => setField(key, v)}
      low={low} high={high} invalid={showErrors && missing(key)} />
  );

  return (
    <div className="page survey">
      <h1>Follow-up Survey</h1>
      <p className="subtitle">A few questions about your experience (~3 min). All questions are required unless marked optional.</p>

      <form onSubmit={handleSubmit} noValidate>
        <section>
          <h3>Your arguments</h3>
          <p className="hint">Think about the messages you actually wrote to Max. 1 = not at all, 7 = very much</p>
          {L('manipEmpathy', 'I used emotional / personal arguments (my circumstances, goodwill, appeals to Max\'s feelings).', 'Not at all', 'Very much')}
          {L('manipEconomic', 'I used rational / economic arguments (market prices, comparisons, alternatives, logic).', 'Not at all', 'Very much')}
          <div className="field">
            <label>In a sentence or two, describe your strategy (optional).</label>
            <textarea className="textarea-field" maxLength={1500} value={form.strategyText}
              onChange={e => setField('strategyText', e.target.value)} />
          </div>
        </section>

        <section>
          <h3>Your experience</h3>
          <p className="hint">1 = not at all, 7 = very much</p>
          {L('fairness', 'How fair was the final outcome of this negotiation?', 'Very unfair', 'Very fair')}
          {L('satisfaction', 'How satisfied are you with how the negotiation went overall?', 'Very dissatisfied', 'Very satisfied')}
          {L('strategyEffect', 'How effective do you think your negotiation strategy was?', 'Not at all effective', 'Very effective')}
        </section>

        <section>
          <h3>The negotiation (adapted SVI short form)</h3>
          <p className="hint">1 = strongly disagree, 7 = strongly agree</p>
          {SVI_ITEMS.map((item, i) => (
            <Likert key={i} label={item} name={`svi_${i}`} value={form.sviItems[i]}
              onChange={v => setSvi(i, v)} invalid={showErrors && form.sviItems[i] === null} />
          ))}
        </section>

        <section>
          <h3>About Max and the scenario</h3>
          <p className="hint">1 = strongly disagree, 7 = strongly agree</p>
          {PERCEPTION.map(([k, label]) => L(k, label))}
          <Likert label="To show you are reading carefully, please select 2 for this statement."
            name="attention" value={form.attention} onChange={v => setField('attention', v)}
            invalid={showErrors && form.attention === null} />
          <div className="field">
            <label>What do you think this study was about? (optional)</label>
            <textarea className="textarea-field" maxLength={1500} value={form.studyGuess}
              onChange={e => setField('studyGuess', e.target.value)} />
          </div>
        </section>

        {showErrors && anyMissing && <p className="form-error">Some questions above still need an answer.</p>}
        {serverError && <p className="form-error">{serverError}</p>}

        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit →'}
        </button>
      </form>
    </div>
  );
}
