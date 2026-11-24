import { useEffect, useRef, useState } from 'react';
import { useFinePointer } from '../hooks/pointer';

/**
 * A ring that follows the pointer and says what a click will do. It reads
 * data-cursor="Label" from the element under the pointer. The normal cursor
 * stays visible; this is an extra layer, hidden on touch and reduced motion.
 */
export default function Cursor() {
  const fine = useFinePointer();
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!fine) return;
    let x = -100,
      y = -100,
      cx = -100,
      cy = -100,
      raf = 0;
    const loop = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      if (ring.current) ring.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      setVisible(true);
      const t = (e.target as Element | null)?.closest?.('[data-cursor]');
      setLabel(t ? t.getAttribute('data-cursor') : null);
    };
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [fine]);

  if (!fine) return null;
  return (
    <div
      ref={ring}
      aria-hidden
      className={`no-print pointer-events-none fixed top-0 left-0 z-[60] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-300 ease-[var(--ease-editorial)] ${
          label ? 'h-auto w-auto border-plum bg-plum px-3 py-1.5' : 'size-7 border-coral-deep/70'
        }`}
      >
        {label && <span className="label text-[0.62rem] whitespace-nowrap text-ivory">{label}</span>}
      </div>
    </div>
  );
}
