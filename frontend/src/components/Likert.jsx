// Likert.jsx — 1-7 scale with NO preselected value (a skipped item stays null and fails validation)
const POINTS = [1, 2, 3, 4, 5, 6, 7];

export default function Likert({ label, name, value, onChange, low, high, invalid, hint }) {
  return (
    <div className={`field ${invalid ? 'invalid' : ''}`}>
      <label>{label}</label>
      {hint && <p className="hint">{hint}</p>}
      <div className="likert">
        {POINTS.map(n => (
          <label key={n} className={value === n ? 'selected' : ''}>
            <input type="radio" name={name} value={n} checked={value === n} onChange={() => onChange(n)} />
            {n}
          </label>
        ))}
      </div>
      {(low || high) && <div className="scale-labels"><span>{low}</span><span>{high}</span></div>}
      {invalid && <div className="field-error">Please answer this question.</div>}
    </div>
  );
}
