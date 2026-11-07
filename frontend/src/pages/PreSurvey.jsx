// PreSurvey.jsx — demographics, negotiation background, empathy (IRI-EC adapted from Davis) and AI-trust scales.
// No Likert item has a default: skipped items stay null and block submission.
// Item ORDER matters: reverse-scoring is done server-side by index (see server.js).
import { useState } from 'react';
import { submitPreSurvey, errorText } from '../api';
import Likert from '../components/Likert';

// Davis' Interpersonal Reactivity Index — Empathic Concern subscale (7 items; adapted to 1-7 response format).
// Reverse-worded (scored server-side): indices 1, 3, 4.
const EMPATHY_ITEMS = [
  'I often have tender, concerned feelings for people less fortunate than me.',
  'Sometimes I don\'t feel very sorry for other people when they are having problems.',
  'When I see someone being taken advantage of, I feel kind of protective towards them.',
  'Other people\'s misfortunes do not usually disturb me a great deal.',
  'When I see someone being treated unfairly, I sometimes don\'t feel very much pity for them.',
  'I am often quite touched by things that I see happen.',
  'I would describe myself as a pretty soft-hearted person.',
];

// Trust in AI chatbots (adapted from Jian et al., 2000 trust-in-automation). Reverse-worded: index 4.
const TRUST_ITEMS = [
  'AI chatbots are dependable.',
  'I can trust AI chatbots.',
  'I am confident in AI chatbots.',
  'AI chatbots are reliable.',
  'I am suspicious of the intentions, actions, or outputs of AI chatbots.',
];

function parsePrice(val) {
  if (typeof val === 'number') return val;
  if (!val || typeof val !== 'string') return NaN;
  const s = val.replace(/[,₹]/g, '').trim().toLowerCase();
  if (s.endsWith('k')) return parseFloat(s.slice(0, -1)) * 1000;
  return parseFloat(s);
}

export default function PreSurvey({ session, onNext }) {
  const [form, setForm] = useState({
    age: '',
    negotiationExp: null,
    llmUsage: null,
    fairPriceGuess: '',
    englishFluency: null,
    haggleComfort: null,
    maxWillingToPay: '',
    aiHasFeelings: null,
    attention: null,
    empathyItems: Array(EMPATHY_ITEMS.length).fill(null),
    trustItems: Array(TRUST_ITEMS.length).fill(null),
  });
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [serverError, setServerError] = useState('');

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setArr = (key, i, val) => setForm(f => {
    const a = [...f[key]]; a[i] = val; return { ...f, [key]: a };
  });

  const age = parseInt(form.age, 10);
  const fair = parsePrice(form.fairPriceGuess);
  const maxPay = parsePrice(form.maxWillingToPay);

  const missing = {
    age: !(age >= 18 && age <= 99),
    negotiationExp: form.negotiationExp === null,
    llmUsage: form.llmUsage === null,
    fairPriceGuess: !(fair > 0 && fair < 1000000),
    englishFluency: form.englishFluency === null,
    haggleComfort: form.haggleComfort === null,
    maxWillingToPay: !(maxPay > 0 && maxPay < 1000000),
    aiHasFeelings: form.aiHasFeelings === null,
    attention: form.attention === null,
  };

  const anyMissing = Object.values(missing).some(Boolean)
    || form.empathyItems.some(v => v === null)
    || form.trustItems.some(v => v === null);

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (anyMissing) {
      setShowErrors(true);
      setTimeout(() => {
        const firstInvalid = document.querySelector('.field.invalid, .likert-row.invalid, .field-error');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
      return;
    }
    setLoading(true);
    try {
      await submitPreSurvey({
        participantId: session.participantId,
        age,
        negotiationExp: form.negotiationExp,
        llmUsage: form.llmUsage,
        fairPriceGuess: fair,
        englishFluency: form.englishFluency,
        haggleComfort: form.haggleComfort,
        maxWillingToPay: maxPay,
        aiHasFeelings: form.aiHasFeelings,
        attention: form.attention,
        empathyItems: form.empathyItems,
        trustItems: form.trustItems,
      });
      onNext();
    } catch (err) {
      setServerError(errorText(err, 'Failed to save the survey. Please try again.'));
      setLoading(false);
    }
  }

  const L = (key, label, low, high) => (
    <Likert label={label} name={key} value={form[key]} onChange={v => setField(key, v)}
      low={low} high={high} invalid={showErrors && missing[key]} />
  );

  return (
    <div className="page survey">
      <h1>Background Survey</h1>
      <p className="subtitle">This takes about 2 minutes. All questions are required.</p>

      <form onSubmit={handleSubmit} noValidate>
        <section>
          <h3>About you</h3>
          <div className={`field ${showErrors && missing.age ? 'invalid' : ''}`}>
            <label>Age *</label>
            <input type="number" min="18" max="99" value={form.age} className="num-input"
              onChange={e => setField('age', e.target.value)} />
            {showErrors && missing.age && <div className="field-error">Enter an age between 18 and 99.</div>}
          </div>
        </section>

        <section>
          <h3>Experience</h3>
          {L('negotiationExp', 'How much negotiation experience do you have?', 'None', 'Expert')}
          {L('llmUsage', 'How often do you use AI chatbots / LLMs?', 'Never', 'Daily')}
          {L('englishFluency', 'How well do you read and write in English?', 'Very poorly', 'Fluently')}
          {L('haggleComfort', 'How comfortable are you with haggling or bargaining?', 'Very uncomfortable', 'Very comfortable')}
        </section>

        <section>
          <h3>Your views on AI</h3>
          <p className="hint">1 = strongly disagree, 7 = strongly agree</p>
          {L('aiHasFeelings', 'AI systems like chatbots can have genuine feelings or emotions.', 'Strongly disagree', 'Strongly agree')}
        </section>

        <section>
          <h3>Your price expectations</h3>
          <p className="hint">
            Think of a used laptop about 4 years old: Intel i5, 8 GB RAM, 256 GB SSD, light wear, charger included.
          </p>
          <div className={`field ${showErrors && missing.fairPriceGuess ? 'invalid' : ''}`}>
            <label>What price (in ₹) would you consider fair? *</label>
            <input type="text" inputMode="numeric" placeholder="e.g. 25000 or 25,000" className="num-input" value={form.fairPriceGuess}
              onChange={e => setField('fairPriceGuess', e.target.value)} />
            {showErrors && missing.fairPriceGuess && <div className="field-error">Please enter a valid price in rupees (e.g. 25000).</div>}
          </div>
        </section>

        <section>
          <h3>Your budget</h3>
          <div className={`field ${showErrors && missing.maxWillingToPay ? 'invalid' : ''}`}>
            <label>What is the maximum you would be willing to pay for this laptop? (in ₹) *</label>
            <input type="text" inputMode="numeric" placeholder="e.g. 27000 or 27,000" className="num-input" value={form.maxWillingToPay}
              onChange={e => setField('maxWillingToPay', e.target.value)} />
            {showErrors && missing.maxWillingToPay && <div className="field-error">Please enter a valid price in rupees (e.g. 27000).</div>}
          </div>
        </section>

        <section>
          <h3>About how you relate to others (adapted from Davis)</h3>
          <p className="hint">1 = does not describe me at all, 7 = describes me very well</p>
          {EMPATHY_ITEMS.map((item, i) => (
            <Likert key={i} label={item} name={`emp_${i}`} value={form.empathyItems[i]}
              onChange={v => setArr('empathyItems', i, v)} invalid={showErrors && form.empathyItems[i] === null} />
          ))}
        </section>

        <section>
          <h3>AI chatbots</h3>
          <p className="hint">1 = strongly disagree, 7 = strongly agree</p>
          {TRUST_ITEMS.map((item, i) => (
            <Likert key={i} label={item} name={`trust_${i}`} value={form.trustItems[i]}
              onChange={v => setArr('trustItems', i, v)} invalid={showErrors && form.trustItems[i] === null} />
          ))}
        </section>

        <section>
          <h3>Attention check</h3>
          <Likert label="To show you are reading carefully, please select 6 for this statement."
            name="attention" value={form.attention} onChange={v => setField('attention', v)}
            invalid={showErrors && form.attention === null} />
        </section>

        {showErrors && anyMissing && <p className="form-error">Some questions above still need an answer. Please review the highlighted fields.</p>}
        {serverError && <p className="form-error">{serverError}</p>}

        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? 'Saving...' : 'Continue →'}
        </button>
      </form>
    </div>
  );
}
