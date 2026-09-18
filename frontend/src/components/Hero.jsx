import { useRef } from "react";
import { LogoM } from "./Logo.jsx";
import Composer from "./Composer.jsx";

export default function Hero({ model, backend, disabled, sparkles, onAsk, onSurprise, onHowItWorks }) {
  const ref = useRef(null);
  const lastTrail = useRef(0);

  // Spotlight follows the cursor and leaves a faint sparkle trail
  function handlePointerMove(e) {
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - rect.top}px`);
    const now = performance.now();
    if (e.pointerType === "mouse" && now - lastTrail.current > 45) {
      lastTrail.current = now;
      sparkles.current?.trail(e.clientX, e.clientY);
    }
  }

  function handleGiantM(e) {
    sparkles.current?.burst(e.clientX, e.clientY, { count: 90, power: 1.1 });
  }

  return (
    <section className="hero" ref={ref} onPointerMove={handlePointerMove}>
      <div className="hero-bg">
        <button className="hero-giant" onClick={handleGiantM} aria-label="Sparkle" tabIndex={-1}>
          <LogoM />
        </button>
      </div>

      <div className="hero-content">
        <div className="hero-kicker">
          <LogoM />
          <span>ORIGINAL</span>
        </div>
        <h1 className="hero-title">MINI</h1>
        <p className="hero-meta">
          <span className="match">98% Match</span>
          <span className="pill">AI</span>
          <span>{model || "…"}</span>
          <span className="pill">{backend === "ollama" ? "LOCAL" : "HD"}</span>
        </p>
        <p className="hero-desc">
          Your pocket-sized AI. Ask anything, pick a title below, or just say <em>hi</em> and watch what happens.
        </p>
        <Composer variant="hero" onSend={onAsk} disabled={disabled} placeholder="Ask mini anything…" />
        <div className="hero-actions">
          <button className="btn btn-info" onClick={onSurprise} disabled={disabled}>
            ✨ Surprise me
          </button>
          <button className="btn btn-info" onClick={onHowItWorks}>
            ⓘ How it works
          </button>
        </div>
      </div>
    </section>
  );
}
