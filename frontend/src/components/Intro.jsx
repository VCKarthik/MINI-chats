import { useEffect, useRef } from "react";
import { LogoM } from "./Logo.jsx";

// Netflix-style "ta-dum" opening. Click anywhere to skip.
export default function Intro({ onDone }) {
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const t = setTimeout(() => done.current(), 2700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="intro" onClick={() => done.current()} role="button" aria-label="Skip intro">
      <div className="intro-streaks" aria-hidden="true">
        {Array.from({ length: 24 }, (_, i) => (
          <i key={i} style={{ "--i": i }} />
        ))}
      </div>
      <LogoM className="intro-m" />
      <span className="intro-skip">Click to skip</span>
    </div>
  );
}
