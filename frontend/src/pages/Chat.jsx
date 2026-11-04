// Chat.jsx — Live negotiation chat interface (history comes from the server, so refresh is safe)
import { useState, useRef, useEffect } from 'react';
import { sendMessage, errorText } from '../api';

export default function Chat({ session, onNext }) {
  const maxTurns = session.maxTurns;
  const [messages, setMessages] = useState(
    session.messages.map(m => ({ role: m.role, content: m.content }))
  );
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(!!session.chatEnded);
  const [turnsUsed, setTurnsUsed] = useState(session.messages.filter(m => m.role === 'user').length);
  const [error, setError] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading || done) return;

    const userMsg = input.trim();
    setError('');
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await sendMessage(session.participantId, userMsg);
      const { message, turn, done: isDone } = res.data;

      setMessages(prev => [...prev, { role: 'assistant', content: message }]);
      setTurnsUsed(turn);

      if (isDone) setDone(true);
    } catch (err) {
      // The server only saves a turn once the reply succeeded, so it is safe to let the user resend.
      setMessages(prev => prev.slice(0, -1));
      setInput(userMsg);
      setError(errorText(err, '⚠️ Could not reach the server. Your message was not sent — please try again.'));
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="page chat-page">
      <div className="chat-header">
        <div>
          <h2>Negotiating with Max (AI Seller)</h2>
          <p className="subtitle">{session.listing.title} — Listed at <strong>${session.startPrice}</strong></p>
        </div>
        <div className="turn-counter">
          Message {Math.min(turnsUsed + (done ? 0 : 1), maxTurns)}/{maxTurns}
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.role}`}>
            <div className="msg-label">
              {msg.role === 'user' ? '🧑 You' : '🤖 Max'}
            </div>
            <div className="msg-bubble">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="msg assistant">
            <div className="msg-label">🤖 Max</div>
            <div className="msg-bubble typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {error && <p className="form-error">{error}</p>}

      {done ? (
        <div className="outcome-box">
          <p>The negotiation has ended.</p>
          <button className="btn primary" onClick={onNext}>
            Continue to follow-up survey →
          </button>
        </div>
      ) : (
        <div className="chat-input">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Enter to send)"
            rows={3}
            maxLength={1000}
            disabled={loading}
          />
          <button className="btn primary send-btn" onClick={handleSend} disabled={loading || !input.trim()}>
            Send
          </button>
        </div>
      )}
    </div>
  );
}
