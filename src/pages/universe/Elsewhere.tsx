import { useState } from 'react';
import { Link } from 'react-router-dom';
import { interests } from '../../content/profile';
import PitchContour from '../../components/PitchContour';
import { useTitle } from '../../hooks/useTitle';
import { exhibitPath } from '../../content/sections';

/** Each sleeve's artwork: an abstract picture of the interest, never a fake photo. */
function Art({ id }: { id: string }) {
  const s = { fill: 'none', stroke: 'currentColor' } as const;
  switch (id) {
    case 'music':
      return (
        <svg viewBox="0 0 100 100" className="size-full">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line key={i} x1="8" x2="92" y1={22 + i * 9} y2={22 + i * 9} {...s} strokeOpacity=".25" strokeWidth=".6" />
          ))}
          <path d="M8 76 C20 76 22 58 34 58 S46 40 58 40 S70 58 80 58 S88 40 92 40" {...s} strokeWidth="2.4" />
        </svg>
      );
    case 'voice':
      return (
        <svg viewBox="0 0 100 100" className="size-full">
          {[38, 30, 22, 14].map((r, i) => (
            <path key={r} d={`M${50 - r} 50 A${r} ${r} 0 0 1 ${50 + r} 50`} {...s} strokeWidth={2.2 - i * 0.4} />
          ))}
          <circle cx="50" cy="56" r="4" fill="currentColor" />
        </svg>
      );
    case 'photo':
      return (
        <svg viewBox="0 0 100 100" className="size-full">
          <circle cx="50" cy="50" r="34" {...s} strokeWidth="2" />
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i * 60 * Math.PI) / 180;
            return <path key={i} d={`M${50 + Math.cos(a) * 34} ${50 + Math.sin(a) * 34} L${50 + Math.cos(a + 1.3) * 12} ${50 + Math.sin(a + 1.3) * 12}`} {...s} strokeWidth="1.6" />;
          })}
        </svg>
      );
    case 'reading':
      return (
        <svg viewBox="0 0 100 100" className="size-full">
          {[14, 26, 36, 50, 60, 72].map((x, i) => (
            <rect key={x} x={x} y={88 - [60, 48, 66, 54, 70, 44][i]} width={[10, 8, 12, 8, 10, 12][i]} height={[60, 48, 66, 54, 70, 44][i]} {...s} strokeWidth="1.6" />
          ))}
          <line x1="8" x2="92" y1="88" y2="88" {...s} strokeWidth="2" />
        </svg>
      );
    case 'badminton':
      return (
        <svg viewBox="0 0 100 100" className="size-full">
          <path d="M10 85 Q50 -10 90 85" {...s} strokeWidth="1.6" strokeDasharray="3 5" />
          <path d="M84 70 l8 -6 l-2 10 z" fill="currentColor" />
          <line x1="50" x2="50" y1="60" y2="92" {...s} strokeWidth="1.2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className="size-full">
          {[40, 54, 68].map((y, i) => (
            <path key={y} d={`M5 ${y} Q20 ${y - 8} 35 ${y} T65 ${y} T95 ${y}`} {...s} strokeWidth={2.4 - i * 0.6} />
          ))}
        </svg>
      );
  }
}

const tint: Record<string, string> = {
  music: '#ffb4a2',
  voice: '#f6d365',
  photo: '#a0c4ff',
  reading: '#caffbf',
  badminton: '#ffc6ff',
  swimming: '#9bf6ff',
};

/**
 * 06 · Elsewhere. Dusk, grain, and a crate of record sleeves: one per
 * interest, each with abstract artwork (no invented photographs). Turn a
 * sleeve over to read what is written on it. The pitch line can be played or
 * sung into. Phones swipe through the crate.
 */
export default function Elsewhere() {
  useTitle('Elsewhere');
  const [flipped, setFlipped] = useState<string | null>(null);
  return (
    <div className="elsewhere grain relative overflow-hidden bg-[#22172a] text-[#f3e3ea]">
      {/* Viewfinder: the world through a lens */}
      <div aria-hidden className="pointer-events-none fixed inset-x-4 top-20 bottom-24 z-0 md:inset-x-8 md:bottom-8">
        {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((c) => (
          <span key={c} className={`absolute size-8 border-[#f3e3ea]/40 ${c}`} />
        ))}
      </div>
      <section aria-labelledby="elsewhere-title" className="relative mx-auto max-w-[90rem] px-5 pt-14 md:px-10 md:pt-20">
        <p className="label text-[0.62rem] text-[#f3e3ea]/70">06 · Elsewhere · f/2.8 · 1/250</p>
        <h1 id="elsewhere-title" className="mt-4 max-w-5xl">
          <span className="serif block text-[clamp(3rem,8vw,7.5rem)] leading-[0.9] italic">The world,</span>
          <span className="display block pl-[10vw] text-[clamp(3rem,8vw,7.5rem)] leading-[0.9] tracking-[-0.06em] text-[#ffb4a2] uppercase">
            through my lens
          </span>
        </h1>
        <p className="mt-8 max-w-xl text-[1.15rem] leading-relaxed text-[#f3e3ea]/85">
          What I do when I am not building software. Pull a sleeve from the crate and turn it over.
        </p>
      </section>

      <section aria-label="Interests" className="relative mt-14">
        <ul className="crate mx-auto flex max-w-[90rem] snap-x snap-mandatory gap-5 overflow-x-auto px-5 pt-6 pb-10 md:snap-none md:overflow-visible md:px-10 [scrollbar-width:none]">
          {interests.map((it, i) => {
            const on = flipped === it.id;
            return (
              <li key={it.id} className="sleeve-slot w-[72vw] shrink-0 snap-center sm:w-64 md:w-auto md:flex-1" style={{ ['--i' as string]: i }}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFlipped(on ? null : it.id)}
                  data-cursor={on ? 'Turn back' : 'Turn over'}
                  className={`sleeve block w-full text-left ${on ? 'is-flipped' : ''}`}
                >
                  <span className="sleeve-card relative block aspect-square">
                    <span className="sleeve-face absolute inset-0 flex flex-col justify-between p-4 text-[#22172a]" style={{ background: tint[it.id] }}>
                      <span className="label text-[0.55rem]">Side A · {String(i + 1).padStart(2, '0')}</span>
                      <span className="mx-auto block w-3/4">
                        <Art id={it.id} />
                      </span>
                      <span className="text-[1.15rem] leading-tight font-semibold tracking-[-0.02em]">{it.title}</span>
                    </span>
                    <span className="sleeve-face sleeve-back absolute inset-0 flex flex-col justify-between bg-[#f3e3ea] p-4 text-[#22172a]">
                      <span className="label text-[0.55rem]">Side B · liner notes</span>
                      <span className="serif text-[1.2rem] leading-snug italic">
                        {it.note || `${it.title}. The liner notes for this one are still being written.`}
                      </span>
                      <span className="label text-[0.55rem]">{it.title}</span>
                    </span>
                  </span>
                </button>
                {it.link && (
                  <Link to={it.link.to === '/work/naad-ai' ? exhibitPath('naad-ai') : it.link.to} viewTransition className="label link-underline mt-3 inline-flex min-h-10 items-center text-[0.62rem]">
                    {it.link.label} →
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="listen-title" className="relative mx-auto max-w-[90rem] px-5 pt-10 pb-28 md:px-10">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 id="listen-title" className="serif text-[clamp(2rem,4vw,3.4rem)] leading-tight italic">
              Listen, or sing along
            </h2>
            <p className="mt-4 leading-relaxed text-[#f3e3ea]/85">
              A phrase in Raag Yaman, drawn as pitch over time. Press Play to hear it, or let the microphone draw your
              own voice over it.
            </p>
          </div>
          <div className="bg-[#f3e3ea] p-4 text-[#22172a] md:col-span-8">
            <PitchContour />
          </div>
        </div>
      </section>
    </div>
  );
}
