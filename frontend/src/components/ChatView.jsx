import { useEffect, useRef } from "react";
import { LogoM } from "./Logo.jsx";
import Message from "./Message.jsx";
import Composer from "./Composer.jsx";

const QUICK = ["Hi mini!", "Tell me a joke", "Explain black holes like I'm 5", "Plan a 3-day trip to Goa"];

export default function ChatView({ messages, loading, onSend, onBack }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  return (
    <main className="chat">
      <div className="chat-bar">
        <button className="back" onClick={onBack}>
          <span aria-hidden="true">←</span> Browse
        </button>
      </div>

      <div className="chat-scroll">
        <div className="chat-inner" aria-live="polite">
          {messages.length === 0 && !loading && (
            <div className="chat-empty">
              <LogoM />
              <p>What are we watching… er, asking today?</p>
              <div className="chips">
                {QUICK.map((q) => (
                  <button key={q} className="chip" onClick={() => onSend(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <Message key={i} {...m} />
          ))}

          {loading && (
            <div className="msg assistant" aria-label="mini is typing">
              <span className="avatar bot-avatar" aria-hidden="true">
                <LogoM />
              </span>
              <div className="bubble typing">
                <span className="eq"><i /><i /><i /><i /></span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="chat-composer">
        <Composer onSend={onSend} disabled={loading} placeholder="Message mini…" autoFocus />
      </div>
    </main>
  );
}
