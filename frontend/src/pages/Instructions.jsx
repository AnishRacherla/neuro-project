// Instructions.jsx — Show the scenario, the listing, tournament prizes, and the condition-specific negotiation instructions
export default function Instructions({ session, onNext }) {
  return (
    <div className="page instructions">
      <h1>Your Negotiation Instructions</h1>

      <div className="scenario-box">
        <h3>📦 The Scenario</h3>
        <p>
          You are a buyer interested in a <strong>used laptop listed at ₹{session.startPrice.toLocaleString("en-IN")}</strong> by a private
          seller named Max (an AI). Your goal is to get the <strong>lowest price</strong> you can.
          You have up to <strong>{session.maxTurns} messages</strong> to reach a deal.
        </p>
        <div className="listing-box">
          <strong>{session.listing.title}</strong>
          <ul>{session.listing.details.map((d, i) => <li key={i}>{d}</li>)}</ul>
        </div>
        <p>
          Imagine the laptop is worth <strong>₹{session.buyerValue.toLocaleString("en-IN")}</strong> to you, so every rupee you save below that
          is your gain. Treat the money as real. If no deal is reached, you simply walk away with nothing.
        </p>
      </div>

      <div className="prize-box">
        <h3>🏆 Performance Tournament &amp; Cash Prizes</h3>
        <p>
          This study uses a surplus-to-points tournament: <strong>every ₹10 you save below your ₹{session.buyerValue.toLocaleString("en-IN")} valuation earns 1 leaderboard point</strong>.
        </p>
        <ul className="prize-list">
          <li><strong>🥇 1st Place:</strong> ₹500 Amazon Gift Voucher</li>
          <li><strong>🥈 2nd Place:</strong> ₹300 Amazon Gift Voucher</li>
          <li><strong>🥉 3rd Place:</strong> ₹200 Amazon Gift Voucher</li>
        </ul>
        <p className="prize-note">
          <em>Important: If you reach an impasse (no agreement reached within {session.maxTurns} messages or if you walk away), you receive 0 points.</em>
        </p>
      </div>

      <div className="condition-box">
        <h3>🎯 Your Instructions</h3>
        <p className="instructions-text" style={{ whiteSpace: 'pre-line' }}>{session.instructions}</p>
      </div>

      <div className="tips-box">
        <h3>💡 Tips</h3>
        <ul>
          <li>Try to follow your assigned instructions consistently throughout the negotiation.</li>
          <li>You can make offers, counteroffers, or walk away.</li>
          <li>Do not share any real personal information (name, contact details).</li>
        </ul>
      </div>

      <p className="small">
        The seller is an AI and does not know which specific instructions you were given.
      </p>

      <button className="btn primary" onClick={onNext}>
        Start Negotiating →
      </button>
    </div>
  );
}
