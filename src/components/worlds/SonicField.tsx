import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { prefersReducedMotion } from '../../hooks/motion';
import { play, toggleSound, useSound } from '../../hooks/sound';

const SWARA = ['Sa', 'Re', 'Ga', 'Ma♯', 'Pa', 'Dha', 'Ni'];

/**
 * Naad's instrument: a field of sound you can play with. Across the width sit
 * the seven notes of Raag Yaman; moving over the field (or a finger, or the
 * arrow keys) chooses a note and how strongly to sing it, and the waves redraw
 * around it. With sound on (it starts off) each new note is plucked, tuned to
 * the raag. The canvas sleeps when nothing changes.
 */
export default function SonicField({
  ink,
  accent,
  className = '',
}: {
  ink: string;
  accent: string;
  className?: string;
}) {
  const cv = useRef<HTMLCanvasElement>(null);
  const [note, setNote] = useState(0);
  const [amp, setAmp] = useState(0.55);
  const sound = useSound();
  const state = useRef({ note: 0, amp: 0.55, t: 0, target: 0.55 });

  useEffect(() => {
    const c = cv.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const still = prefersReducedMotion();
    let raf = 0;
    let W = 0;
    let H = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      const r = c.getBoundingClientRect();
      W = r.width;
      H = r.height;
      c.width = W * dpr;
      c.height = H * dpr;
      draw();
    };
    const draw = () => {
      const s = state.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const mid = H / 2;
      const focus = ((s.note + 0.5) / 7) * W;
      for (let layer = 0; layer < 5; layer++) {
        ctx.beginPath();
        const f = 0.012 + layer * 0.006 + s.note * 0.0016;
        for (let x = 0; x <= W; x += 3) {
          const env = Math.exp(-Math.pow((x - focus) / (W * 0.22), 2));
          const y =
            mid +
            Math.sin(x * f + s.t * (1 + layer * 0.35) + layer) * (H * 0.36) * s.amp * env * (1 - layer * 0.15) +
            Math.sin(x * 0.004 + s.t * 0.3) * 4;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = layer === 0 ? accent : ink;
        ctx.globalAlpha = layer === 0 ? 1 : 0.5 - layer * 0.08;
        ctx.lineWidth = layer === 0 ? 2.2 : 1;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    const loop = () => {
      const s = state.current;
      s.t += 0.045;
      s.amp += (s.target - s.amp) * 0.08;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting && !still) raf = requestAnimationFrame(loop);
      else draw();
    });
    io.observe(c);
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    const redraw = () => still && draw();
    window.addEventListener('sonic:redraw', redraw);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('sonic:redraw', redraw);
    };
  }, [ink, accent]);

  const choose = (n: number, a: number) => {
    const nn = Math.max(0, Math.min(6, n));
    const aa = Math.max(0.1, Math.min(1, a));
    if (nn !== state.current.note) play('pluck', aa, nn);
    state.current.note = nn;
    state.current.target = aa;
    if (prefersReducedMotion()) state.current.amp = aa;
    setNote(nn);
    setAmp(aa);
    window.dispatchEvent(new CustomEvent('sonic:redraw'));
  };
  const fromEvent = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    choose(Math.floor(((e.clientX - r.left) / r.width) * 7), 1 - (e.clientY - r.top) / r.height);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const k: Record<string, () => void> = {
      ArrowLeft: () => choose(note - 1, amp),
      ArrowRight: () => choose(note + 1, amp),
      ArrowUp: () => choose(note, amp + 0.1),
      ArrowDown: () => choose(note, amp - 0.1),
    };
    if (k[e.key]) {
      e.preventDefault();
      k[e.key]();
    }
  };

  return (
    <div className={className}>
      <div
        tabIndex={0}
        role="group"
        aria-label={`A sound field with the seven notes of Raag Yaman. Now on ${SWARA[note]}. Move across it, or use the arrow keys: left and right change the note, up and down how strongly it sounds.`}
        onPointerMove={fromEvent}
        onPointerDown={fromEvent}
        onKeyDown={onKey}
        data-cursor="Play"
        className="relative h-full min-h-56 w-full touch-none outline-offset-4"
      >
        <canvas ref={cv} aria-hidden className="absolute inset-0 size-full" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 grid grid-cols-7">
          {SWARA.map((s, i) => (
            <span
              key={s}
              className={`label border-l border-current/25 pt-1 pl-2 text-[0.62rem] transition-opacity ${i === note ? 'opacity-100' : 'opacity-40'}`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        aria-pressed={sound}
        onClick={toggleSound}
        className="label mt-3 inline-flex min-h-11 items-center gap-2 border border-current px-3 hover:bg-current/10"
      >
        {sound ? <Volume2 aria-hidden size={14} /> : <VolumeX aria-hidden size={14} />}
        Sound {sound ? 'on' : 'off'}
      </button>
    </div>
  );
}
