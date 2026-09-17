// Netflix-style profile square with a smiley
export default function Avatar() {
  return (
    <span className="avatar user-avatar" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
        <circle cx="8.5" cy="9.5" r="0.6" fill="#fff" />
        <circle cx="15.5" cy="9.5" r="0.6" fill="#fff" />
        <path d="M7 14.5c1.3 1.8 3 2.7 5 2.7s3.7-.9 5-2.7" />
      </svg>
    </span>
  );
}
