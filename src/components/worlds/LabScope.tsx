import { useRef, useState } from 'react';
import type { Shot } from '../../content/projects';

/**
 * TriScan's instrument: a real screenshot of the app seen through a circular
 * scope. A sweep line turns slowly (CSS; still with reduced motion); a
 * crosshair follows the pointer or finger, magnifies what is under it 2.5×
 * and reads out its position. With the keyboard, focus the scope and use the
 * arrow keys. Decorative magnification only: the full screenshot is on the
 * case study page.
 */
export default function LabScope({ shot, label, className = '' }: { shot: Shot; label: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [p, setP] = useState({ x: 0.5, y: 0.45 });
  const [active, setActive] = useState(false);
  const set = (x: number, y: number) =>
    setP({ x: Math.min(0.98, Math.max(0.02, x)), y: Math.min(0.98, Math.max(0.02, y)) });
  const fromEvent = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    set((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    setActive(true);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const d = e.shiftKey ? 0.1 : 0.03;
    const m: Record<string, [number, number]> = {
      ArrowLeft: [-d, 0],
      ArrowRight: [d, 0],
      ArrowUp: [0, -d],
      ArrowDown: [0, d],
    };
    if (!m[e.key]) return;
    e.preventDefault();
    setActive(true);
    set(p.x + m[e.key][0], p.y + m[e.key][1]);
  };
  const Z = 2.5;
  return (
    <div className={`relative ${className}`}>
      <div
        ref={box}
        tabIndex={0}
        role="group"
        aria-label={`${label}. A scope over a screenshot of the app: move the crosshair with the pointer, a finger, or the arrow keys.`}
        onPointerMove={fromEvent}
        onPointerDown={fromEvent}
        onPointerLeave={() => setActive(false)}
        onKeyDown={onKey}
        onBlur={() => setActive(false)}
        data-cursor="Inspect"
        className="scope relative aspect-square w-full touch-none overflow-hidden rounded-full border border-current/40 bg-black outline-offset-8"
      >
        <img
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover object-left-top opacity-80 [filter:grayscale(.6)_contrast(1.15)]"
        />
        {/* scan lines */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,.28) 0 1px, transparent 1px 3px)' }}
        />
        <span aria-hidden className="scope-sweep pointer-events-none absolute inset-0 rounded-full" />
        {/* rings */}
        <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 size-full">
          {[48, 36, 24, 12].map((r) => (
            <circle
              key={r}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="currentColor"
              strokeOpacity=".35"
              strokeWidth=".25"
            />
          ))}
          {Array.from({ length: 72 }, (_, i) => {
            const a = (i * 5 * Math.PI) / 180;
            const l = i % 6 === 0 ? 4 : 1.6;
            return (
              <line
                key={i}
                x1={50 + Math.cos(a) * 49.5}
                y1={50 + Math.sin(a) * 49.5}
                x2={50 + Math.cos(a) * (49.5 - l)}
                y2={50 + Math.sin(a) * (49.5 - l)}
                stroke="currentColor"
                strokeOpacity=".7"
                strokeWidth=".3"
              />
            );
          })}
        </svg>
        {/* crosshair + loupe */}
        <span aria-hidden className="pointer-events-none absolute inset-0">
          <span className="absolute inset-y-0 w-px bg-current/60" style={{ left: `${p.x * 100}%` }} />
          <span className="absolute inset-x-0 h-px bg-current/60" style={{ top: `${p.y * 100}%` }} />
          <span
            className={`absolute size-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-current shadow-[0_0_0_1px_rgba(0,0,0,.6)] transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}
            style={{
              left: `${p.x * 100}%`,
              top: `${p.y * 100}%`,
              backgroundImage: `url(${shot.src})`,
              backgroundSize: `${Z * 100}% auto`,
              backgroundPosition: `${p.x * 100}% ${p.y * 100}%`,
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#000',
            }}
          />
        </span>
      </div>
      <p aria-hidden className="label mt-3 flex justify-between gap-3 text-[0.62rem] tabular-nums opacity-80">
        <span>X {String(Math.round(p.x * shot.width)).padStart(4, '0')}</span>
        <span>Y {String(Math.round(p.y * shot.height)).padStart(4, '0')}</span>
        <span>Mag {active ? '2.5×' : '1.0×'}</span>
      </p>
    </div>
  );
}
