import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, MicOff } from 'lucide-react';

export function AiAssistant({ lang, onTriggerSOS, onNavigateTab }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'GraminCare Clinical AI active. Ask symptom questions in Marathi, Hindi, or English.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isThinking]);

  const toggleListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition not supported.'); return; }
    if (isListening) { setIsListening(false); return; }
    const r = new SR();
    r.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    r.onresult = e => { setInputQuery(e.results[0][0].transcript); setIsListening(false); };
    r.onerror = () => setIsListening(false);
    r.onend = () => setIsListening(false);
    r.start(); setIsListening(true);
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputQuery.trim()) return;
    const userText = inputQuery;
    setMessages(m => [...m, { sender: 'user', text: userText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      const q = userText.toLowerCase();
      let reply = 'Based on ICMR rural health protocols, stay hydrated and monitor symptoms. If condition worsens after 24h, book a PHC teleconsultation.';
      if (q.includes('chest') || q.includes('bleeding') || q.includes('breathing')) reply = '⚠️ CRITICAL: Tap Emergency SOS immediately to dispatch 108 PHC ambulance.';
      else if (q.includes('pregnant') || q.includes('anc') || q.includes('गर्भ')) reply = 'For 3rd trimester pregnancy, weekly BP monitoring and daily IFA supplement are essential.';
      else if (q.includes('fever') || q.includes('ताप')) reply = 'For mild fever: Paracetamol 500mg twice daily after meals. Maintain ORS hydration.';

      setMessages(m => [...m, { sender: 'bot', text: reply, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsThinking(false);
    }, 700);
  };

  const quickPrompts = ['Headache in 32nd week of pregnancy', 'How to take Iron & Folic Acid?', 'Child has fever and cough'];

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid #27272a', borderRadius: 16, padding: '1.5rem', display: 'flex', flexDirection: 'column', height: 560 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.85rem', borderBottom: '1px solid #27272a', marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bot size={18} color="var(--green-primary)" />
          <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>Clinical AI Assistant</h3>
        </div>
        <span style={{ background: 'rgba(16,185,129,.12)', color: '#10b981', border: '1px solid rgba(16,185,129,.35)', borderRadius: '9999px', padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontWeight: 700 }}>ICMR Guidelines</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {messages.map((msg, i) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={i} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '75%', padding: '0.75rem 1rem', borderRadius: 12,
                background: isUser ? 'var(--green-primary)' : 'var(--bg-subtle)',
                color: isUser ? '#000000' : 'var(--text-main)',
                fontWeight: isUser ? 700 : 500,
                border: isUser ? 'none' : '1px solid #27272a',
                fontSize: '0.85rem'
              }}>
                <div>{msg.text}</div>
                <div style={{ fontSize: '0.62rem', color: isUser ? 'rgba(0,0,0,0.6)' : 'var(--text-muted)', textAlign: 'right', marginTop: '0.25rem' }}>{msg.timestamp}</div>
              </div>
            </div>
          );
        })}
        {isThinking && (
          <div style={{ background: 'var(--bg-subtle)', border: '1px solid #27272a', borderRadius: '9999px', padding: '0.3rem 0.85rem', fontSize: '0.75rem', color: 'var(--text-muted)', width: 'fit-content' }}>
            AI is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', padding: '0.6rem 0', borderTop: '1px solid #27272a' }}>
        {quickPrompts.map((p, i) => (
          <button key={i} onClick={() => setInputQuery(p)} style={{ background: 'var(--bg-subtle)', border: '1px solid #27272a', borderRadius: '9999px', color: 'var(--text-muted)', padding: '0.3rem 0.75rem', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}>
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button type="button" onClick={toggleListening} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #27272a', background: isListening ? 'rgba(239,68,68,0.1)' : 'var(--bg-subtle)', color: isListening ? '#f87171' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isListening ? <MicOff size={15} /> : <Mic size={15} />}
        </button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--bg-subtle)', border: '1px solid #27272a', borderRadius: '9999px', padding: '0.5rem 1rem' }}>
          <input type="text" placeholder="Type your medical query..." value={inputQuery} onChange={e => setInputQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '0.88rem', width: '100%' }} />
        </div>
        <button type="submit" className="btn-green-primary" style={{ width: 40, height: 40, borderRadius: '50%', padding: 0 }}>
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
