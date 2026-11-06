// ThankYou.jsx — Full post-study debrief
export default function ThankYou({ session }) {
  return (
    <div className="page thankyou">
      <div className="thankyou-icon">🎉</div>
      <h1>Thank You!</h1>
      <p>Your responses have been saved. You have completed the study.</p>
      <p><strong>Participant ID:</strong> {session?.participantId}</p>
      <p className="hint">Save this ID if you wish to request deletion of your data later.</p>

      <div className="card">
        <h3>Study Debrief</h3>
        <p>
          Now that you have finished, we can tell you what this study was really about.
        </p>
        <h4>What we were testing</h4>
        <p>
          This study investigates how the <em>type of persuasive appeal</em> a human uses affects
          how an AI seller negotiates. Specifically, we compare two styles:
        </p>
        <ul>
          <li>
            <strong>Empathy-based appeals</strong> — using personal circumstances, goodwill,
            and relationship-building language to try to get a lower price.
          </li>
          <li>
            <strong>Economic / rational appeals</strong> — using market price comparisons,
            the laptop's condition, comparable listings, or the option to buy elsewhere.
          </li>
        </ul>
        <p>
          You were randomly assigned to one of these two styles at the start. The instructions
          you read before chatting reflected your assigned condition.
        </p>
        <h4>About "Max"</h4>
        <p>
          Max is an AI language model (not a human). The laptop listing, the $500 asking price,
          and the negotiation scenario were entirely fictional — no money or goods changed hands,
          and you were not evaluated on how well you negotiated. Max had a hidden "walk-away"
          reservation price it was not allowed to go below; this was part of the experimental design
          to make the negotiation realistic.
        </p>
        <h4>Why we could not tell you this upfront</h4>
        <p>
          Knowing your assigned style in advance might have changed how you used it, which would
          have made the results less informative. This is standard practice in behavioral research,
          and your consent covered participation in a study where not all details were revealed
          until after completion.
        </p>
        <h4>What happens to your data</h4>
        <p>
          Your chat transcript and survey answers are stored without your name and reported only in aggregate.
          Your messages were processed by Groq's commercial AI API under zero-retention settings (not stored or used to train models).
          In accordance with research ethics standards, chat transcripts are scrubbed of any identifying details,
          and unnecessary demographic identifiers (such as gender and education) were not collected.
          If you have questions or wish to withdraw your data, contact the research team using
          your participant ID above.
        </p>
      </div>

      <p className="small">You may now close this window.</p>
    </div>
  );
}
