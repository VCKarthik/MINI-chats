import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LogoM } from "./Logo.jsx";
import Avatar from "./Avatar.jsx";

function Twinkles() {
  return (
    <>
      <span className="twinkle t1" aria-hidden="true">✦</span>
      <span className="twinkle t2" aria-hidden="true">✦</span>
      <span className="twinkle t3" aria-hidden="true">✦</span>
    </>
  );
}

export default function Message({ role, content, meta, vibe }) {
  const cls = `msg ${role}${vibe ? " vibe" : ""}`;

  if (role === "user") {
    return (
      <div className={cls}>
        <div className="bubble">
          {content}
          {vibe && <Twinkles />}
        </div>
        <Avatar />
      </div>
    );
  }

  return (
    <div className={cls}>
      <span className="avatar bot-avatar" aria-hidden="true">
        <LogoM />
      </span>
      <div className="bubble">
        {role === "error" ? (
          <>⚠ {content}</>
        ) : (
          <div className="markdown">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{ a: (props) => <a {...props} target="_blank" rel="noreferrer" /> }}
            >
              {content}
            </Markdown>
          </div>
        )}
        {meta && <span className="meta">{meta}</span>}
        {vibe && <Twinkles />}
      </div>
    </div>
  );
}
