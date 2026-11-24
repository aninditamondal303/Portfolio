import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { destinations } from '../../content/sections';
import { projects } from '../../content/projects';
import { useFinePointer } from '../../hooks/pointer';
import { useTitle } from '../../hooks/useTitle';

/** What each door looks like: a glyph that hints at the world behind it. */
function Glyph({ path }: { path: string }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.2 } as const;
  switch (path) {
    case '/identity':
      return (
        <svg viewBox="0 0 100 100" className="size-full">
          {[44, 36, 28, 20, 12].map((r, i) => (
            <ellipse key={r} cx={50 + i} cy={50 - i} rx={r} ry={r * 0.86} {...s} />
          ))}
        </svg>
      );
    case '/process':
      return (
        <svg viewBox="0 0 100 100" className="size-full">
          <path d="M20 35 L50 18 L80 35 L80 70 L50 87 L20 70 Z M20 35 L50 52 L80 35 M50 52 L50 87" {...s} />
          <path d="M50 18 L50 52 M20 70 L50 52 L80 70" {...s} strokeDasharray="3 4" />
        </svg>
      );
    case '/exhibition':
      return (
        <span className="relative block size-full">
          {projects.map((p, i) => (
            <img
              key={p.slug}
              src={p.screenshots[0].src}
              alt=""
              loading="lazy"
              className="absolute w-[62%] border-2 border-current object-cover object-top shadow-[0_12px_30px_rgba(0,0,0,.6)]"
              style={{ aspectRatio: '4 / 3', left: `${i * 18}%`, top: `${i * 16}%`, rotate: `${[-8, 3, 10][i]}deg` }}
            />
          ))}
        </span>
      );
    case '/elsewhere':
      return (
        <svg viewBox="0 0 100 100" className="size-full">
          <circle cx="50" cy="50" r="42" {...s} />
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i * 60 * Math.PI) / 180;
            return (
              <path
                key={i}
                d={`M${50 + Math.cos(a) * 42} ${50 + Math.sin(a) * 42} L${50 + Math.cos(a + 1.4) * 16} ${50 + Math.sin(a + 1.4) * 16}`}
                {...s}
              />
            );
          })}
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className="size-full">
          <path d="M25 92 V45 A25 25 0 0 1 75 45 V92" {...s} />
          <path d="M35 92 V50 A15 15 0 0 1 65 50 V92" {...s} strokeDasharray="2 4" />
        </svg>
      );
  }
}

/** Desktop composition: where each door stands and how deep it is in the room. */
const place: Record<string, { x: number; y: number; z: number; size: number }> = {
  '/identity': { x: 17, y: 34, z: 0.8, size: 10 },
  '/process': { x: 36, y: 74, z: 0.55, size: 9 },
  '/exhibition': { x: 60, y: 34, z: 1, size: 15 },
  '/elsewhere': { x: 82, y: 70, z: 0.7, size: 9.5 },
  '/contact': { x: 88, y: 24, z: 0.35, size: 6.5 },
};
const HERE = { x: 50, y: 58 };

/**
 * 02 · The Infinite Room. A room that never ends (a receding floor and
 * ceiling), five doors standing in it at different depths, and pathways from
 * "you are here" to each. With a mouse the room shifts with you and a door
 * lights its path; every door is a real link (keyboard and touch included).
 * On phones the doors line up along one winding path.
 */
export default function Universe() {
  useTitle('The Infinite Room');
  const fine = useFinePointer();
  const room = useRef<HTMLDivElement>(null);
  const [hot, setHot] = useState<string | null>(null);
  const [par, setPar] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!fine) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setPar({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 }),
      );
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  }, [fine]);
  const doors = destinations.filter((d) => place[d.path]);

  return (
    <section aria-labelledby="universe-title" className="universe relative isolate overflow-hidden bg-[#0b0d1a] text-[#dcdff5]">
      {/* The infinite room: floor and ceiling receding to a vanishing point */}
      <div aria-hidden className="room pointer-events-none absolute inset-0 -z-10">
        <div className="room-plane room-ceiling" />
        <div className="room-plane room-floor" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-[#c6f432]/40" />
      </div>

      <div className="relative mx-auto max-w-[90rem] px-5 pt-10 md:px-10">
        <p className="label text-[0.62rem] text-[#dcdff5]/70">02 · The Infinite Room</p>
        <h1 id="universe-title" className="serif mt-3 max-w-3xl text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.95] italic">
          Choose a door. Each one opens onto something real.
        </h1>
      </div>

      {/* Desktop: a spatial room */}
      <div ref={room} className="relative mx-auto hidden h-[min(78svh,52rem)] max-w-[90rem] md:block">
        <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
          {doors.map((d) => {
            const p = place[d.path];
            const x = p.x + par.x * 6 * p.z;
            const y = p.y + par.y * 6 * p.z;
            return (
              <path
                key={d.path}
                d={`M${HERE.x} ${HERE.y} Q${(HERE.x + x) / 2} ${Math.max(y, HERE.y) + 12} ${x} ${y}`}
                fill="none"
                stroke={hot === d.path ? '#c6f432' : 'rgba(220,223,245,.28)'}
                strokeWidth={hot === d.path ? 2 : 1}
                strokeDasharray={hot === d.path ? 'none' : '2 6'}
                vectorEffect="non-scaling-stroke"
                className="transition-[stroke] duration-300"
              />
            );
          })}
        </svg>
        <span
          aria-hidden
          className="label absolute -translate-x-1/2 -translate-y-1/2 text-[0.6rem] whitespace-nowrap text-[#c6f432]"
          style={{ left: `${HERE.x}%`, top: `${HERE.y}%` }}
        >
          <span className="mx-auto mb-1 block size-3 rounded-full border border-current">
            <span className="m-[3px] block size-1 rounded-full bg-current" />
          </span>
          You are here
        </span>
        <ul>
          {doors.map((d) => {
            const p = place[d.path];
            const dim = hot && hot !== d.path;
            return (
              <li
                key={d.path}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-[filter,opacity] duration-500"
                style={{
                  left: `calc(${p.x}% + ${par.x * 60 * p.z}px)`,
                  top: `calc(${p.y}% + ${par.y * 60 * p.z}px)`,
                  width: `${p.size}vw`,
                  opacity: dim ? 0.35 : 1,
                  filter: `blur(${dim ? 1.5 : (1 - p.z) * 1.2}px)`,
                }}
              >
                <Link
                  to={d.path}
                  viewTransition
                  onPointerEnter={() => setHot(d.path)}
                  onPointerLeave={() => setHot(null)}
                  onFocus={() => setHot(d.path)}
                  onBlur={() => setHot(null)}
                  data-cursor={`Into ${d.label}`}
                  className="door group block text-center"
                >
                  <span className="door-glyph block aspect-square text-[#dcdff5] transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-110 group-hover:text-[#c6f432] group-focus-visible:scale-110 group-focus-visible:text-[#c6f432]">
                    <Glyph path={d.path} />
                  </span>
                  <span className="label mt-3 block text-[0.6rem] text-[#dcdff5]/60">{d.n}</span>
                  <span className="mt-1 block text-[clamp(0.95rem,1.3vw,1.3rem)] leading-tight font-semibold tracking-[-0.02em] whitespace-nowrap">
                    {d.label}
                  </span>
                  <span className="mx-auto mt-1 block max-w-[15rem] text-[0.82rem] leading-snug text-[#dcdff5]/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    {d.line}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Phones: one winding path, doors along it */}
      <ol className="relative mx-auto mt-10 max-w-md px-5 pb-16 md:hidden">
        <svg aria-hidden viewBox="0 0 100 500" preserveAspectRatio="none" className="absolute inset-y-0 left-5 h-full w-16">
          <path d="M20 0 C80 60 -20 140 40 200 S80 320 20 380 S60 470 30 500" fill="none" stroke="#c6f432" strokeOpacity=".6" strokeDasharray="3 6" vectorEffect="non-scaling-stroke" />
        </svg>
        {doors.map((d, i) => (
          <li key={d.path} className={`relative ${i % 2 ? 'ml-16' : 'ml-8'} mb-8`}>
            <Link to={d.path} viewTransition className="door flex items-center gap-4">
              <span className="block w-20 shrink-0 text-[#dcdff5]">
                <span className="block aspect-square">
                  <Glyph path={d.path} />
                </span>
              </span>
              <span>
                <span className="label block text-[0.58rem] text-[#dcdff5]/60">{d.n}</span>
                <span className="block text-[1.3rem] leading-tight font-semibold tracking-[-0.02em]">{d.label}</span>
                <span className="block text-[0.88rem] leading-snug text-[#dcdff5]/75">{d.line}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
