import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../hooks/motion';

/**
 * A living field of contour lines: layered sine "noise" that drifts slowly,
 * like a landscape breathing. Near the pointer (or a finger) the lines are
 * pulled straight: order out of the noise. Runs at most ~30 fps, only while
 * visible; with reduced motion it draws a single still frame.
 */
export default function FieldCanvas({
  color = 'rgba(236,232,223,.5)',
  accent = '#ff5b38',
  lines = 46,
  className = '',
}: {
  color?: string;
  accent?: string;
  lines?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const still = prefersReducedMotion();
    let W = 0,
      H = 0,
      raf = 0,
      last = 0,
      t = Math.random() * 100,
      visible = true;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const p = { x: -9999, y: -9999, sx: -9999, sy: -9999 };
    const resize = () => {
      const r = cv.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cv.width = W * dpr;
      cv.height = H * dpr;
      draw();
    };
    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      p.sx += (p.x - p.sx) * 0.12;
      p.sy += (p.y - p.sy) * 0.12;
      const gap = H / lines;
      for (let i = 0; i < lines; i++) {
        const base = i * gap + gap / 2;
        ctx.beginPath();
        let near = 0;
        for (let x = 0; x <= W; x += 8) {
          const n =
            Math.sin(x * 0.006 + t * 0.6 + i * 0.35) * 14 +
            Math.sin(x * 0.013 - t * 0.9 + i * 0.8) * 7 +
            Math.sin(x * 0.0021 + i * 0.12 + t * 0.2) * 22;
          const d = Math.hypot(x - p.sx, base - p.sy);
          const calm = Math.max(0, 1 - d / 220);
          near = Math.max(near, calm);
          const y = base + n * (1 - calm * 0.95);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = near > 0.55 ? accent : color;
        ctx.lineWidth = near > 0.55 ? 1.2 : 0.7;
        ctx.stroke();
      }
    };
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || now - last < 33) return;
      last = now;
      t += 0.012;
      draw();
    };
    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      p.x = e.clientX - r.left;
      p.y = e.clientY - r.top;
      if (still) {
        p.sx = p.x;
        p.sy = p.y;
        draw();
      }
    };
    const leave = () => {
      p.x = p.y = -9999;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(cv);
    const host = cv.parentElement!;
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerdown', move);
    host.addEventListener('pointerleave', leave);
    resize();
    if (!still) raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerdown', move);
      host.removeEventListener('pointerleave', leave);
    };
  }, [color, accent, lines]);
  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 size-full ${className}`} />;
}
