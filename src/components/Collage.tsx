import { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../hooks/motion';
import { play } from '../hooks/sound';

export type FragKind = 'paper' | 'tape' | 'stamp' | 'sticker' | 'halftone' | 'ink' | 'specimen';

export interface Frag {
  kind: FragKind;
  /** Accessible name: what the piece is. */
  label: string;
  /** Top-left anchor in % of the room. */
  x: number;
  y: number;
  /** Width in rem (pieces are sized in rem so text inside stays readable). */
  w: number;
  rot?: number;
  /** Front text (stamps, stickers, paper). */
  text?: string;
  /** What is written on the back: shown when the piece is flipped. */
  back?: string;
  bg?: string;
  fg?: string;
  /** Image for specimen pieces (a real project screenshot). */
  src?: string;
  /** Show on phones too (default: tablets and up only, so nothing covers text on small screens). */
  sm?: boolean;
  font?: 'display' | 'serif' | 'mono' | 'hand';
}

const torn = [
  'polygon(0% 6%, 7% 0%, 18% 4%, 29% 0%, 41% 5%, 55% 1%, 68% 5%, 80% 0%, 92% 4%, 100% 1%, 98% 22%, 100% 47%, 97% 71%, 100% 95%, 88% 100%, 74% 96%, 60% 100%, 46% 95%, 31% 100%, 17% 96%, 4% 100%, 0% 78%, 3% 52%, 0% 27%)',
  'polygon(2% 0%, 23% 3%, 47% 0%, 71% 4%, 100% 0%, 97% 30%, 100% 64%, 96% 100%, 70% 96%, 45% 100%, 21% 97%, 0% 100%, 3% 68%, 0% 34%)',
];

function Face({ f, side }: { f: Frag; side: 'front' | 'back' }) {
  const font =
    f.font === 'serif' ? 'serif italic' : f.font === 'mono' ? 'label' : f.font === 'hand' ? 'hand' : 'display';
  if (side === 'back')
    return (
      <span
        className="frag-face frag-back absolute inset-0 grid place-items-center bg-[#fff36b] p-3 text-center text-[0.95rem] leading-snug text-plum"
        style={{
          clipPath: f.kind === 'paper' ? torn[0] : undefined,
          borderRadius: f.kind === 'sticker' ? '9999px' : undefined,
        }}
      >
        <span className="serif italic">{f.back}</span>
      </span>
    );
  switch (f.kind) {
    case 'paper':
      return (
        <span
          className={`frag-face grain block p-4 ${font}`}
          style={{
            background: f.bg ?? '#f4f2ec',
            color: f.fg ?? '#121211',
            clipPath: torn[f.text && f.text.length > 30 ? 1 : 0],
          }}
        >
          {f.text}
        </span>
      );
    case 'tape':
      return (
        <span
          className="frag-face block h-8 w-full"
          style={{
            background: f.bg ?? 'rgba(242,201,76,.75)',
            clipPath:
              'polygon(0 10%, 4% 0, 8% 12%, 92% 0, 96% 10%, 100% 0, 100% 90%, 96% 100%, 92% 88%, 8% 100%, 4% 90%, 0 100%)',
          }}
        />
      );
    case 'stamp':
      return (
        <span
          className="frag-face label block border-[3px] border-double px-3 py-2 text-center text-[0.7rem] leading-tight"
          style={{ color: f.fg ?? '#b93416', borderColor: 'currentColor', background: f.bg ?? 'transparent' }}
        >
          {f.text}
        </span>
      );
    case 'sticker':
      return (
        <span
          className={`frag-face grid aspect-square place-items-center rounded-full p-3 text-center leading-[1.05] shadow-[3px_4px_0_rgba(0,0,0,.85)] ${font}`}
          style={{ background: f.bg ?? '#ff5b38', color: f.fg ?? '#121211', fontSize: `${Math.max(0.8, f.w / 9)}rem` }}
        >
          {f.text}
        </span>
      );
    case 'halftone':
      return (
        <span
          className="frag-face block aspect-square rounded-full"
          style={{
            backgroundImage: `radial-gradient(${f.bg ?? '#121211'} 30%, transparent 32%)`,
            backgroundSize: '9px 9px',
          }}
        />
      );
    case 'ink':
      return (
        <svg viewBox="0 0 300 80" className="frag-face block w-full overflow-visible">
          <path
            d="M8 52 C 50 18, 90 70, 140 38 S 230 12, 292 34"
            fill="none"
            stroke={f.bg ?? '#121211'}
            strokeWidth="14"
            strokeLinecap="round"
            style={{ filter: 'url(#ink-rough)' }}
          />
        </svg>
      );
    case 'specimen':
      return (
        <span className="frag-face block bg-white p-1.5 pb-6 shadow-[0_18px_40px_-18px_rgba(0,0,0,.7)]">
          <img src={f.src} alt="" className="block aspect-[4/3] w-full object-cover object-top" draggable={false} />
          <span className="hand absolute right-2 bottom-1 left-2 truncate text-[0.85rem] text-plum">{f.text}</span>
        </span>
      );
  }
}

interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  vr: number;
  held: boolean;
}

/**
 * Collage: cut-out pieces laid over a room. Each one can be picked up and
 * dragged with a mouse or a finger, tossed (it keeps the throw's momentum,
 * with friction and bounces off the room's walls), and flipped with a tap,
 * Enter or Space to read what is written on the back. Arrow keys nudge a
 * focused piece (Shift for bigger steps). "Tidy up" in the studio dock sends
 * every piece home. In weird mode gravity switches on and the pieces fall.
 */
export default function Collage({ frags, className = '' }: { frags: Frag[]; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLButtonElement | null)[]>([]);
  const bodies = useRef<Body[]>(frags.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, r: 0, vr: 0, held: false })));
  const raf = useRef(0);
  const [flipped, setFlipped] = useState<boolean[]>(() => frags.map(() => false));
  const still = useRef(false);

  const paint = useCallback(
    (i: number) => {
      const el = els.current[i];
      const b = bodies.current[i];
      if (!el) return;
      el.style.transform = `translate3d(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px, 0) rotate(${((frags[i].rot ?? 0) + b.r).toFixed(1)}deg)`;
    },
    [frags],
  );

  const step = useCallback(() => {
    raf.current = 0;
    const box = host.current?.getBoundingClientRect();
    if (!box) return;
    const weird = false;
    let moving = false;
    bodies.current.forEach((b, i) => {
      const el = els.current[i];
      if (!el || b.held || el.offsetParent === null) return;
      if (weird) b.vy += 0.55;
      b.x += b.vx;
      b.y += b.vy;
      b.r += b.vr;
      b.vx *= 0.94;
      b.vy *= weird ? 0.995 : 0.94;
      b.vr *= 0.9;
      // Walls: the room's edges, measured from the piece's home position.
      const ox = el.offsetLeft;
      const oy = el.offsetTop;
      const minX = -ox;
      const maxX = box.width - ox - el.offsetWidth;
      const minY = -oy;
      const maxY = box.height - oy - el.offsetHeight;
      const bounce = (v: number) => {
        if (Math.abs(v) > 3) play('pluck', Math.min(1, Math.abs(v) / 25), i % 7);
        return -v * 0.55;
      };
      if (b.x < minX) ((b.x = minX), (b.vx = bounce(b.vx)));
      if (b.x > maxX) ((b.x = maxX), (b.vx = bounce(b.vx)));
      if (b.y < minY) ((b.y = minY), (b.vy = bounce(b.vy)));
      if (b.y > maxY) {
        b.y = maxY;
        b.vy = bounce(b.vy);
        if (weird) b.vx *= 0.85;
      }
      if (Math.abs(b.vx) + Math.abs(b.vy) + Math.abs(b.vr) > 0.08 || (weird && b.y < maxY - 0.5)) moving = true;
      paint(i);
    });
    if (moving) raf.current = requestAnimationFrame(step);
  }, [paint]);

  const wake = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(step);
  }, [step]);

  useEffect(() => {
    still.current = prefersReducedMotion();
    const tidy = () => {
      bodies.current.forEach((b, i) => {
        // Home, with a spring: give each piece a push towards its anchor.
        if (still.current) {
          Object.assign(b, { x: 0, y: 0, vx: 0, vy: 0, r: 0, vr: 0 });
          paint(i);
        } else {
          const el = els.current[i];
          if (el) el.style.transition = 'transform 0.9s cubic-bezier(.34,1.56,.64,1)';
          Object.assign(b, { x: 0, y: 0, vx: 0, vy: 0, r: 0, vr: 0 });
          paint(i);
          setTimeout(() => el && (el.style.transition = ''), 950);
        }
      });
      setFlipped(frags.map(() => false));
    };
    window.addEventListener('collage:tidy', tidy);
    return () => {
      window.removeEventListener('collage:tidy', tidy);
      cancelAnimationFrame(raf.current);
    };
  }, [frags, paint, wake]);

  const flip = (i: number) => {
    setFlipped((f) => f.map((v, k) => (k === i ? !v : v)));
    play('tick', 0.6, i % 7);
  };

  const drag = (i: number) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const b = bodies.current[i];
    b.held = true;
    b.vx = b.vy = 0;
    const start = { x: e.clientX, y: e.clientY, bx: b.x, by: b.y };
    let last = { x: e.clientX, y: e.clientY, t: performance.now() };
    let moved = 0;
    el.classList.add('is-held');
    const move = (ev: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(8, now - last.t);
      const vx = ((ev.clientX - last.x) / dt) * 16;
      const vy = ((ev.clientY - last.y) / dt) * 16;
      b.vx = b.vx * 0.5 + vx * 0.5;
      b.vy = b.vy * 0.5 + vy * 0.5;
      b.x = start.bx + ev.clientX - start.x;
      b.y = start.by + ev.clientY - start.y;
      if (!still.current) b.r = Math.max(-28, Math.min(28, b.r * 0.8 + b.vx * 0.9));
      moved = Math.max(moved, Math.hypot(ev.clientX - start.x, ev.clientY - start.y));
      last = { x: ev.clientX, y: ev.clientY, t: now };
      paint(i);
    };
    const up = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.classList.remove('is-held');
      b.held = false;
      if (moved < 5) {
        flip(i);
        return;
      }
      play('thud', Math.min(1, Math.hypot(b.vx, b.vy) / 30));
      if (still.current) {
        b.vx = b.vy = 0;
        return;
      }
      b.vr = b.vx * 0.4;
      wake();
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  };

  const key = (i: number) => (e: React.KeyboardEvent) => {
    const d = e.shiftKey ? 96 : 24;
    const b = bodies.current[i];
    const map: Record<string, [number, number]> = {
      ArrowLeft: [-d, 0],
      ArrowRight: [d, 0],
      ArrowUp: [0, -d],
      ArrowDown: [0, d],
    };
    if (map[e.key]) {
      e.preventDefault();
      b.x += map[e.key][0];
      b.y += map[e.key][1];
      b.vx = b.vy = 0;
      paint(i);
      wake();
      play('tick', 0.4, i % 7);
    }
  };

  return (
    <div ref={host} className={`collage pointer-events-none absolute inset-0 z-20 ${className}`}>
      {frags.map((f, i) => (
        <button
          key={i}
          type="button"
          ref={(el) => {
            els.current[i] = el;
          }}
          aria-pressed={flipped[i]}
          onPointerDown={drag(i)}
          onKeyDown={key(i)}
          onClick={(e) => {
            // Keyboard activation (Enter/Space) flips; pointer taps are handled in pointerup.
            if (e.detail === 0) flip(i);
          }}
          data-cursor={flipped[i] ? 'Flip back' : 'Drag, toss, or tap'}
          className={`frag pointer-events-auto absolute touch-none select-none ${f.sm ? '' : 'hidden md:block'} ${flipped[i] ? 'is-flipped' : ''}`}
          style={{ left: `${f.x}%`, top: `${f.y}%`, width: `${f.w}rem`, transform: `rotate(${f.rot ?? 0}deg)` }}
        >
          <span className="frag-card relative block">
            <Face f={f} side="front" />
            {f.back && <Face f={f} side="back" />}
          </span>
          <span className="sr-only">
            {f.text ? '' : `${f.label}. `}(collage piece: drag to move, tap to flip{f.back ? ' and read the back' : ''};
            arrow keys move it)
          </span>
        </button>
      ))}
    </div>
  );
}

/** Send every collage piece home. */
export const tidyCollage = () => window.dispatchEvent(new CustomEvent('collage:tidy'));
