import { useRef } from "react";
import { LogoM } from "./Logo.jsx";
import { PALETTE } from "../rows.js";

function Card({ title, blurb, badge, colors, onClick }) {
  return (
    <button className="card" style={{ "--c1": colors[0], "--c2": colors[1] }} onClick={onClick}>
      <LogoM className="card-m" />
      {badge && <span className="card-badge">{badge}</span>}
      <span className="card-title">{title}</span>
      <span className="card-hover">
        <span className="card-play">▶</span>
        <span className="card-blurb">{blurb}</span>
      </span>
    </button>
  );
}

export default function Row({ title, items, paletteOffset = 0, onPick }) {
  const track = useRef(null);
  const scroll = (dir) =>
    track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <section className="row">
      <h2>{title}</h2>
      <div className="row-wrap">
        <button className="row-arrow left" onClick={() => scroll(-1)} aria-label="Scroll left">‹</button>
        <div className="row-track" ref={track}>
          {items.map((item, i) => (
            <Card
              key={item.title + i}
              {...item}
              colors={PALETTE[(i + paletteOffset) % PALETTE.length]}
              onClick={() => onPick(item)}
            />
          ))}
        </div>
        <button className="row-arrow right" onClick={() => scroll(1)} aria-label="Scroll right">›</button>
      </div>
    </section>
  );
}
