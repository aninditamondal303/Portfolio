import type { Motif as M } from '../content/profile';

/** Small line drawings, one per interest. Original and decorative. */
export default function Motif({ id, className = '' }: { id: M; className?: string }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <svg viewBox="0 0 96 64" className={className} aria-hidden>
      {id === 'music' && (
        // A tanpura's four strings over a gourd
        <g {...common}>
          <circle cx="30" cy="44" r="14" />
          <path d="M40 34 L88 8" />
          {[0, 3, 6, 9].map((o) => (
            <path key={o} d={`M${22 + o} ${50 - o * 0.4} L${86 + o * 0.3} ${4 + o * 0.6}`} strokeWidth={0.7} />
          ))}
        </g>
      )}
      {id === 'voice' && (
        // A held note with andolan
        <g {...common}>
          <path d="M4 40 C14 40 16 24 26 24 L44 24 C50 24 52 20 56 20 C60 20 60 28 64 28 C68 28 68 20 72 20 C76 20 76 28 80 28 L92 28" />
          <path d="M4 52 H92" strokeWidth={0.6} strokeDasharray="2 4" />
        </g>
      )}
      {id === 'photo' && (
        // A viewfinder with a thirds grid
        <g {...common}>
          <rect x="14" y="8" width="68" height="48" />
          <path d="M36.7 8 V56 M59.3 8 V56 M14 24 H82 M14 40 H82" strokeWidth={0.5} />
          <circle cx="59.3" cy="24" r="4" />
        </g>
      )}
      {id === 'reading' && (
        // An open book
        <g {...common}>
          <path d="M48 16 C38 10 22 10 10 14 V54 C22 50 38 50 48 56 C58 50 74 50 86 54 V14 C74 10 58 10 48 16 Z" />
          <path d="M48 16 V56" />
          {[24, 31, 38].map((y) => (
            <path key={y} d={`M18 ${y} C26 ${y - 2} 34 ${y - 2} 41 ${y}`} strokeWidth={0.6} />
          ))}
        </g>
      )}
      {id === 'badminton' && (
        // A shuttle's flight arc
        <g {...common}>
          <path d="M6 56 C26 2 62 2 84 40" strokeDasharray="1 4" />
          <path d="M84 40 l6 8 M84 40 l9 3 M84 40 l2 9" />
          <circle cx="83" cy="39" r="2.4" />
        </g>
      )}
      {id === 'swimming' && (
        // Lane lines and a wake
        <g {...common}>
          {[16, 32, 48].map((y) => (
            <path key={y} d={`M4 ${y} H92`} strokeWidth={0.6} strokeDasharray="6 3" />
          ))}
          <path d="M8 24 C16 20 20 28 28 24 C36 20 40 28 48 24 C56 20 60 28 68 24" />
        </g>
      )}
    </svg>
  );
}
