import { useEffect, useRef, useState } from "react";

export default function Composer({ onSend, disabled, placeholder, variant = "chat", autoFocus = false }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  // Grow the textarea with its content, up to the CSS max-height
  useEffect(() => {
    const el = inputRef.current;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [text]);

  useEffect(() => {
    if (autoFocus && !disabled) inputRef.current?.focus();
  }, [autoFocus, disabled]);

  function submit(e) {
    e?.preventDefault();
    const message = text.trim();
    if (!message || disabled) return;
    onSend(message);
    setText("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) submit(e);
  }

  return (
    <form className={`composer composer--${variant}`} onSubmit={submit}>
      <textarea
        ref={inputRef}
        rows={1}
        value={text}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="submit" className="composer-send" disabled={disabled || !text.trim()} aria-label="Send">
        {variant === "hero" ? (
          <>▶ Ask</>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M3.4 20.4 21 12 3.4 3.6 3.4 10.1 15 12 3.4 13.9z" />
          </svg>
        )}
      </button>
    </form>
  );
}
