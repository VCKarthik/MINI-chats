// Giant glowing word that zooms across the screen for greetings and fun prompts.
export default function VibeSplash({ word, onDone }) {
  return (
    <div
      className="vibe-splash"
      aria-hidden="true"
      onAnimationEnd={(e) => e.animationName === "splash-life" && onDone()}
    >
      <span className="vibe-word" data-text={word}>
        {word}
      </span>
    </div>
  );
}
