import { useEffect } from "react";
import { LogoM } from "./Logo.jsx";

// "More info" style modal
export default function HowItWorks({ model, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="How mini works" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="modal-hero">
          <LogoM />
          <h2>MINI</h2>
        </div>
        <div className="modal-body">
          <ul>
            <li><strong>Ask anything.</strong> Your message goes to the FastAPI backend, which calls <code>{model || "the model"}</code>.</li>
            <li><strong>Pick a title.</strong> Every card on the home page is a ready-made question.</li>
            <li><strong>Say hi.</strong> Greetings and playful prompts (jokes, games, riddles) trigger the special effects.</li>
            <li><strong>Play around.</strong> Click the giant M, the logo, or move your mouse over the hero.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
