import { useId } from "react";

// The red "M" mark
export function LogoM({ className = "" }) {
  return (
    <span className={`logo-m ${className}`} aria-hidden="true">
      M
    </span>
  );
}

// "MINI" wordmark, set on a slight arc
export function Wordmark() {
  const id = useId();
  return (
    <svg className="wordmark" viewBox="0 0 120 46" role="img" aria-label="mini">
      <defs>
        <path id={id} d="M4,42 Q60,34 116,42" />
      </defs>
      <text>
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          MINI
        </textPath>
      </text>
    </svg>
  );
}
