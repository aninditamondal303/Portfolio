import { useRef, useState } from 'react';
import type { FlowStage } from '../../content/projects';
import { prefersReducedMotion } from '../../hooks/motion';

/** Where each box of API Sentinel's real architecture sits, in % of the drawing. */
const layout = [
  { x: 10, y: 50 },
  { x: 33, y: 50 },
  { x: 58, y: 50 },
  { x: 82, y: 22 },
  { x: 82, y: 78 },
];

/**
 * API Sentinel's instrument: its real architecture (from the project data)
 * as a live schematic. Requests travel along the wires; every box can be
 * picked up and moved (mouse, finger, or focus it and use the arrow keys),
 * and the wiring follows. Nothing here is invented: the labels are the
 * project's own diagram.
 */
export default function Schematic({ stages, className = '' }: { stages: FlowStage[]; className?: string }) {
  const nodes = stages.flatMap((s) => s.boxes.map((b) => ({ ...b, where: s.where })));
  const [pos, setPos] = useState(() => nodes.map((_, i) => layout[i] ?? { x: 50, y: 50 }));
  const svg = useRef<HTMLDivElement>(null);
  const moving = !prefersReducedMotion();
  // Edges: each stage to the next; the last stage fans out from the one before.
  const edges: [number, number][] = [];
  let idx = 0;
  const firstOf: number[] = [];
  stages.forEach((s) => {
    firstOf.push(idx);
    idx += s.boxes.length;
  });
  stages.forEach((s, si) => {
    if (si === 0) return;
    const from = firstOf[si - 1];
    s.boxes.forEach((_, bi) => edges.push([from, firstOf[si] + bi]));
  });

  const drag = (i: number) => (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const r = svg.current!.getBoundingClientRect();
    const move = (ev: PointerEvent) =>
      setPos((p) =>
        p.map((q, k) =>
          k === i
            ? {
                x: Math.min(94, Math.max(6, ((ev.clientX - r.left) / r.width) * 100)),
                y: Math.min(90, Math.max(10, ((ev.clientY - r.top) / r.height) * 100)),
              }
            : q,
        ),
      );
    const up = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  };
  const key = (i: number) => (e: React.KeyboardEvent) => {
    const d = e.shiftKey ? 10 : 3;
    const m: Record<string, [number, number]> = {
      ArrowLeft: [-d, 0],
      ArrowRight: [d, 0],
      ArrowUp: [0, -d],
      ArrowDown: [0, d],
    };
    if (!m[e.key]) return;
    e.preventDefault();
    setPos((p) =>
      p.map((q, k) =>
        k === i
          ? { x: Math.min(94, Math.max(6, q.x + m[e.key][0])), y: Math.min(90, Math.max(10, q.y + m[e.key][1])) }
          : q,
      ),
    );
  };

  return (
    <div ref={svg} className={`relative overflow-hidden ${className}`}>
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full overflow-visible"
      >
        {edges.map(([a, b], k) => {
          const A = pos[a];
          const B = pos[b];
          const mx = (A.x + B.x) / 2;
          const d = `M${A.x} ${A.y} C${mx} ${A.y} ${mx} ${B.y} ${B.x} ${B.y}`;
          return (
            <g key={k}>
              <path
                d={d}
                fill="none"
                stroke="currentColor"
                strokeOpacity=".45"
                strokeWidth=".35"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={d}
                fill="none"
                stroke="var(--sig, #ffb000)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="2 14"
                className={moving ? 'wire-flow' : ''}
                style={{ animationDelay: `${-k * 0.4}s` }}
              />
            </g>
          );
        })}
      </svg>
      {nodes.map((n, i) => (
        <button
          key={n.label}
          type="button"
          onPointerDown={drag(i)}
          onKeyDown={key(i)}
          data-cursor="Drag the box"
          className="node absolute w-[clamp(6.2rem,15vw,11rem)] -translate-x-1/2 -translate-y-1/2 touch-none border border-current bg-[var(--panel,#0b0f14)] p-2.5 text-left shadow-[4px_4px_0_var(--sig,#ffb000)] select-none"
          style={{ left: `${pos[i].x}%`, top: `${pos[i].y}%` }}
        >
          {n.where && <span className="label block text-[0.55rem] opacity-60">{n.where}</span>}
          <span className="block font-mono text-[0.82rem] leading-tight font-medium">{n.label}</span>
          {n.detail && <span className="mt-1 hidden text-[0.68rem] leading-snug opacity-70 sm:block">{n.detail}</span>}
          <span className="sr-only"> (drag, or use the arrow keys, to move this box)</span>
        </button>
      ))}
    </div>
  );
}
