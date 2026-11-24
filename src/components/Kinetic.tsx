import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../hooks/motion';
import { play } from '../hooks/sound';

export interface Line {
  text: string;
  className?: string;
  /** Extra style for the line (rotation, offsets). */
  style?: React.CSSProperties;
}

/**
 * Kinetic type. A heading whose letters are physical: they lean and stretch
 * away from a passing pointer or finger (harder the faster it moves), and a
 * click or tap throws them apart before they spring back into the word. The
 * whole heading also skews with scroll momentum (the --sv variable, see
 * Layout). Screen readers get the plain text; with reduced motion the letters
 * stay still.
 */
export default function Kinetic({
  as: Tag = 'h2',
  id,
  lines,
  className = '',
  note,
}: {
  as?: 'h1' | 'h2' | 'p';
  id?: string;
  lines: Line[];
  className?: string;
  note?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    const ls = Array.from(root.querySelectorAll<HTMLSpanElement>('[data-k]'));
    const st = ls.map(() => ({ x: 0, y: 0, s: 1, r: 0, vx: 0, vy: 0, vs: 0, vr: 0, tx: 0, ty: 0, ts: 1, tr: 0 }));
    let raf = 0;
    let visible = false;
    let last: { x: number; y: number; t: number } | null = null;

    const step = () => {
      raf = 0;
      let moving = false;
      st.forEach((p, i) => {
        p.vx = (p.vx + (p.tx - p.x) * 0.12) * 0.78;
        p.vy = (p.vy + (p.ty - p.y) * 0.12) * 0.78;
        p.vs = (p.vs + (p.ts - p.s) * 0.12) * 0.78;
        p.vr = (p.vr + (p.tr - p.r) * 0.12) * 0.78;
        p.x += p.vx;
        p.y += p.vy;
        p.s += p.vs;
        p.r += p.vr;
        if (Math.abs(p.vx) + Math.abs(p.vy) + Math.abs(p.vs) * 50 + Math.abs(p.vr) > 0.05) moving = true;
        ls[i].style.transform =
          `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) rotate(${p.r.toFixed(1)}deg) scaleY(${p.s.toFixed(3)})`;
      });
      if (moving) raf = requestAnimationFrame(step);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    const move = (e: PointerEvent) => {
      if (!visible) return;
      const now = performance.now();
      const speed = last
        ? Math.min(3, Math.hypot(e.clientX - last.x, e.clientY - last.y) / Math.max(8, now - last.t))
        : 0;
      last = { x: e.clientX, y: e.clientY, t: now };
      const gain = 1;
      let any = false;
      ls.forEach((l, i) => {
        const r = l.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const R = Math.max(90, r.height * 1.1);
        const dx = cx - e.clientX;
        const dy = cy - e.clientY;
        const d = Math.hypot(dx, dy) || 1;
        const p = st[i];
        if (d < R) {
          const k = (1 - d / R) * (0.4 + speed) * gain;
          p.tx = (dx / d) * 14 * k;
          p.ty = (dy / d) * 10 * k;
          p.ts = 1 + 0.35 * k;
          p.tr = (dx / d) * 9 * k;
          any = true;
        } else {
          p.tx = p.ty = p.tr = 0;
          p.ts = 1;
        }
      });
      if (any || raf === 0) wake();
    };
    const leave = () => {
      st.forEach((p) => {
        p.tx = p.ty = p.tr = 0;
        p.ts = 1;
      });
      wake();
    };
    const scatter = () => {
      const gain = 1;
      st.forEach((p) => {
        p.vx += (Math.random() - 0.5) * 70 * gain;
        p.vy += (Math.random() - 0.6) * 60 * gain;
        p.vr += (Math.random() - 0.5) * 60 * gain;
        p.vs += (Math.random() - 0.3) * 0.4;
      });
      play('gliss', 0.7);
      wake();
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(root);
    window.addEventListener('pointermove', move, { passive: true });
    root.addEventListener('pointerleave', leave);
    root.addEventListener('click', scatter);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', leave);
      root.removeEventListener('click', scatter);
    };
  }, []);

  const label = lines.map((l) => l.text).join(' ');
  return (
    <Tag
      ref={ref}
      id={id}
      aria-label={label}
      data-note={note}
      data-cursor="Tap to scatter"
      className={`kinetic cursor-pointer select-none ${className}`}
    >
      {lines.map((l, li) => (
        <span key={li} aria-hidden className={`block ${l.className ?? ''}`} style={l.style}>
          {l.text.split(/(\s+)/).map((word, wi) =>
            /^\s+$/.test(word) ? (
              ' '
            ) : (
              <span key={wi} className="inline-block whitespace-nowrap">
                {word.split('').map((ch, ci) => (
                  <span key={ci} data-k className="inline-block origin-bottom">
                    {ch}
                  </span>
                ))}
              </span>
            ),
          )}
        </span>
      ))}
    </Tag>
  );
}
