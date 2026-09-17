import { useCallback, useEffect, useRef, useState } from "react";
import { getInfo, sendMessage } from "./api.js";
import { detectVibe, splashWord } from "./vibe.js";
import { ROWS, SURPRISES } from "./rows.js";
import Intro from "./components/Intro.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Row from "./components/Row.jsx";
import ChatView from "./components/ChatView.jsx";
import Sparkles from "./components/Sparkles.jsx";
import VibeSplash from "./components/VibeSplash.jsx";
import HowItWorks from "./components/HowItWorks.jsx";

function shouldPlayIntro() {
  try {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;
    return !sessionStorage.getItem("mini-intro-seen");
  } catch {
    return true;
  }
}

export default function App() {
  const [showIntro, setShowIntro] = useState(shouldPlayIntro);
  const [view, setView] = useState("home"); // "home" | "chat"
  // Each message: { role: "user" | "assistant" | "error", content, meta?, vibe? }
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("");
  const [splash, setSplash] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const sparkles = useRef(null);

  useEffect(() => {
    getInfo()
      .then((info) => setModel(info.model))
      .catch(() => setModel("backend offline"));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  function finishIntro() {
    try {
      sessionStorage.setItem("mini-intro-seen", "1");
    } catch {
      // storage blocked: intro just plays again next time
    }
    setShowIntro(false);
  }

  const celebrate = useCallback((vibe, text) => {
    setSplash({ word: splashWord(vibe, text), key: Date.now() });
    const s = sparkles.current;
    if (!s) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (vibe === "greeting") {
      // big central burst, then fireworks around the screen
      s.burst(w / 2, h / 2, { count: 170, power: 1.4 });
      for (let i = 0; i < 5; i++) {
        setTimeout(
          () => s.burst(w * (0.12 + Math.random() * 0.76), h * (0.12 + Math.random() * 0.55), { count: 70 }),
          260 + i * 200
        );
      }
    } else {
      // fountains from both bottom corners, then a pop in the middle
      s.burst(0, h, { count: 130, angle: -Math.PI / 3, spread: 0.7, power: 1.7 });
      s.burst(w, h, { count: 130, angle: (-2 * Math.PI) / 3, spread: 0.7, power: 1.7 });
      setTimeout(() => s.burst(w / 2, h * 0.4, { count: 130, power: 1.2 }), 380);
    }
  }, []);

  async function ask(text) {
    if (loading) return;
    const vibe = detectVibe(text);
    // Only real turns go to the API as history, not error bubbles
    const history = messages
      .filter((m) => m.role !== "error")
      .map(({ role, content }) => ({ role, content }));

    setView("chat");
    setMessages((prev) => [...prev, { role: "user", content: text, vibe }]);
    setLoading(true);
    if (vibe) celebrate(vibe, text);
    const started = performance.now();

    try {
      const reply = await sendMessage(text, history);
      const secs = ((performance.now() - started) / 1000).toFixed(1);
      setMessages((prev) => [...prev, { role: "assistant", content: reply, meta: `${secs}s`, vibe }]);
      if (vibe) sparkles.current?.burst(60, window.innerHeight - 160, { count: 50, angle: -Math.PI / 4, spread: 1.2 });
    } catch (err) {
      setMessages((prev) => [...prev, { role: "error", content: err.message }]);
    } finally {
      setLoading(false);
    }
  }

  const recent = messages
    .filter((m) => m.role === "user")
    .slice(-6)
    .reverse()
    .map((m) => ({ title: m.content.length > 40 ? m.content.slice(0, 40) + "…" : m.content, blurb: "Jump back in" }));

  return (
    <>
      <Sparkles ref={sparkles} />
      {splash && <VibeSplash key={splash.key} word={splash.word} onDone={() => setSplash(null)} />}
      {showIntro && <Intro onDone={finishIntro} />}
      {showInfo && <HowItWorks model={model} onClose={() => setShowInfo(false)} />}

      <Navbar
        view={view}
        hasChat={messages.length > 0}
        onLogo={() => {
          setView("home");
          sparkles.current?.burst(70, 34, { count: 45, power: 0.6 });
        }}
        onHome={() => setView("home")}
        onChat={() => setView("chat")}
        onNewChat={() => {
          setMessages([]);
          setView("chat");
        }}
      />

      {view === "home" ? (
        <main className="home">
          <Hero
            model={model}
            disabled={loading}
            sparkles={sparkles}
            onAsk={ask}
            onSurprise={() => ask(SURPRISES[Math.floor(Math.random() * SURPRISES.length)])}
            onHowItWorks={() => setShowInfo(true)}
          />
          <div className="rows">
            {recent.length > 0 && (
              <Row title="Continue Chatting" items={recent} paletteOffset={5} onPick={() => setView("chat")} />
            )}
            {ROWS.map((row, i) => (
              <Row key={row.title} title={row.title} items={row.items} paletteOffset={i * 3} onPick={(item) => ask(item.prompt)} />
            ))}
          </div>
          <footer className="foot">
            mini · powered by {model || "…"}
          </footer>
        </main>
      ) : (
        <ChatView messages={messages} loading={loading} onSend={ask} onBack={() => setView("home")} />
      )}
    </>
  );
}
