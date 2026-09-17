import { useEffect, useState } from "react";
import { LogoM, Wordmark } from "./Logo.jsx";
import Avatar from "./Avatar.jsx";

export default function Navbar({ view, hasChat, onLogo, onHome, onChat, onNewChat, onLock }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled || view === "chat" ? "solid" : ""}`}>
      <button className="nav-logo" onClick={onLogo} aria-label="mini home">
        <Wordmark />
        <LogoM />
      </button>
      <div className="nav-links">
        <button className={view === "home" ? "active" : ""} onClick={onHome}>
          Home
        </button>
        <button className={view === "chat" ? "active" : ""} onClick={onChat}>
          Chat
          {hasChat && view !== "chat" && <span className="dot" />}
        </button>
      </div>
      <div className="nav-right">
        <button className="nav-new" onClick={onNewChat} aria-label="New chat">
          + <span className="label">New chat</span>
        </button>
        {onLock && (
          <button className="nav-new" onClick={onLock} aria-label="Lock mini">
            🔒 <span className="label">Lock</span>
          </button>
        )}
        <Avatar />
      </div>
    </nav>
  );
}
