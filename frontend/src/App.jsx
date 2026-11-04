// App.jsx — Main app with multi-step flow (resumes after a page refresh)
import { useState, useEffect } from 'react';
import Consent from './pages/Consent';
import PreSurvey from './pages/PreSurvey';
import Instructions from './pages/Instructions';
import Chat from './pages/Chat';
import PostSurvey from './pages/PostSurvey';
import ThankYou from './pages/ThankYou';
import { getSession } from './api';
import './App.css';

const STEPS = ['consent', 'pre-survey', 'instructions', 'chat', 'post-survey', 'thankyou'];
const STORAGE_KEY = 'negotiation_study_pid';

function stepFor(s) {
  if (s.completed) return 'thankyou';
  if (s.chatEnded) return 'post-survey';
  if (s.preSurveyDone) return s.messages.length > 1 ? 'chat' : 'instructions';
  return 'pre-survey';
}

export default function App() {
  const [step, setStep] = useState('loading');
  const [session, setSession] = useState(null);   // server state for this participant

  useEffect(() => {
    let pid = null;
    try { pid = localStorage.getItem(STORAGE_KEY); } catch { /* storage blocked */ }
    if (!pid) { setStep('consent'); return; }
    getSession(pid)
      .then(res => { setSession(res.data); setStep(stepFor(res.data)); })
      .catch(() => setStep('consent'));
  }, []);

  const progress = Math.max(0, (STEPS.indexOf(step) / (STEPS.length - 1)) * 100);

  return (
    <div className="app">
      <div className="progress-bar" style={{ width: `${progress}%` }} />

      {step === 'loading' && <div className="page"><p>Loading…</p></div>}
      {step === 'consent' && (
        <Consent onNext={data => {
          try { localStorage.setItem(STORAGE_KEY, data.participantId); } catch { /* ignore */ }
          setSession(data); setStep('pre-survey');
        }} />
      )}
      {step === 'pre-survey' && (
        <PreSurvey session={session} onNext={() => setStep('instructions')} />
      )}
      {step === 'instructions' && (
        <Instructions session={session} onNext={() => setStep('chat')} />
      )}
      {step === 'chat' && (
        <Chat session={session} onNext={() => setStep('post-survey')} />
      )}
      {step === 'post-survey' && (
        <PostSurvey session={session} onNext={() => setStep('thankyou')} />
      )}
      {step === 'thankyou' && (
        <ThankYou session={session} />
      )}
    </div>
  );
}
