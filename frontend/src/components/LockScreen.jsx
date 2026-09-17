import { useState } from "react";
import { login } from "../api.js";
import { LogoM, Wordmark } from "./Logo.jsx";

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3H9Z" />
    </svg>
  );
}

// Netflix "profile lock" style passkey screen
export default function LockScreen({ onUnlock, sparkles }) {
  const [passkey, setPasskey] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [attempt, setAttempt] = useState(0);

  async function submit(e) {
    e.preventDefault();
    if (!passkey || busy) return;
    setBusy(true);
    setError("");
    try {
      await login(passkey);
      sparkles.current?.burst(window.innerWidth / 2, window.innerHeight / 2, { count: 160, power: 1.3 });
      onUnlock();
    } catch (err) {
      setError(err.message);
      setPasskey("");
      setAttempt((n) => n + 1); // re-mounts the field so the shake replays
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="lock">
      <div className="lock-top">
        <Wordmark />
      </div>

      <form className="lock-card" onSubmit={submit}>
        <span className="lock-avatar">
          <LogoM />
          <span className="lock-badge"><LockIcon /></span>
        </span>
        <h1>Enter your passkey</h1>
        <p className="lock-sub">This mini is locked. Enter the passkey to start chatting.</p>

        <div key={attempt} className={`lock-field${attempt ? " shake" : ""}`}>
          <input
            type={show ? "text" : "password"}
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            placeholder="Passkey"
            aria-label="Passkey"
            autoComplete="current-password"
            autoFocus
          />
          <button type="button" className="lock-eye" onClick={() => setShow((s) => !s)}>
            {show ? "Hide" : "Show"}
          </button>
        </div>

        {error && <p className="lock-error" role="alert">{error}</p>}

        <button type="submit" className="lock-submit" disabled={busy || !passkey}>
          {busy ? "Checking…" : "Unlock"}
        </button>
      </form>
    </main>
  );
}
