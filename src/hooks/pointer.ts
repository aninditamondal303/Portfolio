import { useEffect, useState } from 'react';
import { prefersReducedMotion } from './motion';

/** True on devices with a precise pointer (mouse, trackpad) and motion allowed. */
export function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFine(mq.matches && !prefersReducedMotion());
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return fine;
}

/**
 * Pointer-driven 3D tilt. Sets --rx / --ry (degrees) and --px / --py (-1..1)
 * on the element; CSS does the rest. No effect on touch or reduced motion.
 */
export function useTilt<T extends HTMLElement>(ref: React.RefObject<T | null>, max = 8) {
  const fine = useFinePointer();
  useEffect(() => {
    const el = ref.current;
    if (!el || !fine) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * 2 - 1;
      const py = ((e.clientY - r.top) / r.height) * 2 - 1;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${(-py * max).toFixed(2)}deg`);
        el.style.setProperty('--ry', `${(px * max).toFixed(2)}deg`);
        el.style.setProperty('--px', px.toFixed(3));
        el.style.setProperty('--py', py.toFixed(3));
      });
    };
    const leave = () => {
      cancelAnimationFrame(raf);
      ['--rx', '--ry', '--px', '--py'].forEach((p) => el.style.setProperty(p, '0'));
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, [ref, fine, max]);
}

/**
 * Magnetic element: when a mouse comes within reach, the element leans
 * towards it (up to `pull` px) and springs back when it leaves. Returns a
 * callback ref. No effect on touch or with reduced motion.
 */
export function useMagnetic<T extends HTMLElement>(pull = 10) {
  const [el, setEl] = useState<T | null>(null);
  useEffect(() => {
    if (!el || prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const reach = 70;
    let raf = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const near = Math.abs(dx) < r.width / 2 + reach && Math.abs(dy) < r.height / 2 + reach;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = near
          ? `translate(${(dx / (r.width / 2 + reach)) * pull}px, ${(dy / (r.height / 2 + reach)) * pull}px)`
          : '';
      });
    };
    el.style.transition = 'transform .35s cubic-bezier(.34,1.56,.64,1)';
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
      el.style.transform = '';
    };
  }, [el, pull]);
  return setEl;
}
