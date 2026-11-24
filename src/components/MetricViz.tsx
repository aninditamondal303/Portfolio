import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../hooks/motion';

/**
 * A small live picture of a real measured value, drawn from the value string
 * itself (nothing invented): "A vs B" becomes two bars on a 0–1 scale, a
 * percentage, a 0–1 score or an "a / b" fraction becomes a ring that fills.
 * Plain counts get no chart (there is no honest scale for them). The drawing
 * fills when it scrolls into view. Decorative: the number is always in text.
 */
type Parsed = { kind: 'vs'; a: number; b: number } | { kind: 'ring'; f: number } | null;

export function parseMetric(v: string): Parsed {
  const vs = v.match(/^\s*(0?\.\d+|1(?:\.0+)?)\s*vs\s*(0?\.\d+|1(?:\.0+)?)\s*$/);
  if (vs) return { kind: 'vs', a: Number(vs[1]), b: Number(vs[2]) };
  const pct = v.match(/^\s*(\d+(?:\.\d+)?)\s*%\s*$/);
  if (pct) return { kind: 'ring', f: Number(pct[1]) / 100 };
  const frac = v.match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
  if (frac && Number(frac[2]) > 0) return { kind: 'ring', f: Number(frac[1]) / Number(frac[2]) };
  const unit = v.match(/^\s*(0?\.\d+)\s*$/);
  if (unit) return { kind: 'ring', f: Number(unit[1]) };
  return null;
}

export default function MetricViz({ value, size = 'md' }: { value: string; size?: 'sm' | 'md' }) {
  const p = parseMetric(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    if (prefersReducedMotion()) return setOn(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  if (!p) return null;
  const ease = 'transition-[width,stroke-dashoffset] duration-[1400ms] ease-[var(--ease-editorial)]';
  if (p.kind === 'vs')
    return (
      <span
        ref={ref}
        aria-hidden
        className={`mviz mt-2 block ${size === 'sm' ? 'w-full max-w-[9rem]' : 'w-full max-w-[16rem]'}`}
      >
        {[p.a, p.b].map((x, i) => (
          <span key={i} className="mb-1 flex items-center gap-2">
            <span className={`relative block h-2 flex-1 ${i ? 'bg-current/10' : 'bg-current/15'}`}>
              <span
                className={`absolute inset-y-0 left-0 block ${i ? 'bg-current/40' : 'bg-current'} ${ease}`}
                style={{ width: on ? `${x * 100}%` : '0%', transitionDelay: `${i * 180}ms` }}
              />
            </span>
          </span>
        ))}
      </span>
    );
  const R = 15.9155;
  return (
    <span ref={ref} aria-hidden className={`mviz mt-2 inline-block ${size === 'sm' ? 'size-9' : 'size-14'}`}>
      <svg viewBox="0 0 36 36" className="size-full -rotate-90">
        <circle cx="18" cy="18" r={R} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth="3.2" />
        <circle
          cx="18"
          cy="18"
          r={R}
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="butt"
          strokeDasharray="100 100"
          className={ease}
          style={{ strokeDashoffset: on ? 100 - Math.min(1, p.f) * 100 : 100 }}
        />
      </svg>
    </span>
  );
}
