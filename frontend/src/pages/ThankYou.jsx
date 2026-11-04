// ThankYou.jsx — Debrief
export default function ThankYou({ session }) {
  return (
    <div className="page thankyou">
      <div className="thankyou-icon">🎉</div>
      <h1>Thank You!</h1>
      <p>Your responses have been saved. You've completed the study.</p>
      <div className="card">
        <p><strong>Participant ID:</strong> {session?.participantId}</p>
        <h3>About the study</h3>
        <p>
          You were randomly assigned to negotiate using an empathy-based style, an economic/rational style,
          or your own natural style. We are comparing how an AI seller's price and concessions change with the
          type of argument used. Max is an AI; the laptop, the $500 price and any "lowest price" were part of a
          fictional scenario — nothing was bought or sold, and you were not evaluated on how well you negotiated.
        </p>
        <p>
          Your chat is stored without your name and will be reported only in aggregate. Your messages were processed by
          Google's Gemini service to generate Max's replies. Keep your participant ID if you want to ask about your data.
        </p>
      </div>
      <p className="small">You may close this window now.</p>
    </div>
  );
}
