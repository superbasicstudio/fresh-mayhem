// 8-bit pixelated arcs (top-left) colliding with smooth modern arcs (bottom-right)

export default function HackRFIcon({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Top-left  -  8-bit stepped arcs (pixelated quarter circles) */}
      <path d="M2 12 h2 v-2 h2 v-2 h2 v-2 h2 v-2 h2" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" opacity="0.2" />
      <path d="M5 12 h1 v-1 h2 v-2 h2 v-2 h2" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" opacity="0.4" />
      <path d="M8 12 h1 v-1 h1 v-1 h2" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" opacity="0.6" />

      {/* Center point */}
      <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.9" />

      {/* Bottom-right  -  smooth modern arcs */}
      <path d="M12 16a4 4 0 0 1 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M12 19a7 7 0 0 1 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M12 22a10 10 0 0 1 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.2" />
    </svg>
  );
}
