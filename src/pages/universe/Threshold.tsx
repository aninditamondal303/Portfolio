import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { profile } from '../../content/profile';
import FieldCanvas from '../../components/FieldCanvas';
import { prefersReducedMotion } from '../../hooks/motion';
import { useMagnetic } from '../../hooks/pointer';
import { useTitle } from '../../hooks/useTitle';

const KEY = 'aam-seen-threshold';
const tc = (ms: number) => {
  const f = Math.floor((ms / 1000) * 24) % 24;
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
};

/** Each letter arrives from somewhere else; the name assembles itself. */
function Assemble({ text, on, className = '', delay = 0 }: { text: string; on: boolean; className?: string; delay?: number }) {
  return (
    <span aria-hidden className={`block ${className}`}>
      {text.split('').map((ch, i) => {
        const dx = ((i * 73) % 11) - 5;
        const dy = ((i * 37) % 9) - 4;
        return (
          <span
            key={i}
            className="assemble inline-block"
            style={{
              transform: on ? 'none' : `translate(${dx * 0.4}em, ${dy * 0.5}em) rotate(${dx * 6}deg)`,
              opacity: on ? 1 : 0,
              filter: on ? 'none' : 'blur(8px)',
              transitionDelay: `${delay + i * 70}ms`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
}

/**
 * 01 · The Threshold. The opening titles of a film that never stops: a living
 * field of lines, a running timecode, and the name assembling out of the
 * noise, letter by letter. Moving over the field brings it to order. The
 * sequence takes about two seconds; any key, a click on "Skip", or a return
 * visit in the same session shows everything at once. Enter opens the
 * universe from the point you click.
 */
export default function Threshold() {
  useTitle();
  const navigate = useNavigate();
  const [step, setStep] = useState(() => {
    try {
      if (sessionStorage.getItem(KEY) || prefersReducedMotion()) return 3;
    } catch {
      /* ignore */
    }
    return 0;
  });
  const [ms, setMs] = useState(0);
  const enter = useMagnetic<HTMLAnchorElement>(16);

  useEffect(() => {
    const timers = [300, 1100, 2200].map((t, i) => window.setTimeout(() => setStep((s) => Math.max(s, i + 1)), t));
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* ignore */
    }
    const start = performance.now();
    const clock = window.setInterval(() => setMs(performance.now() - start), 1000 / 12);
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && step >= 3 && document.activeElement === document.body) navigate('/universe', { viewTransition: true });
      setStep(3);
    };
    window.addEventListener('keydown', key);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(clock);
      window.removeEventListener('keydown', key);
    };
  }, [navigate, step]);

  return (
    <section
      aria-labelledby="threshold-title"
      className="threshold relative isolate flex min-h-[calc(100svh-3.5rem)] flex-col overflow-hidden bg-[#050505] text-[#ece8df] max-md:min-h-[calc(100svh-7.5rem)]"
    >
      <FieldCanvas />
      {/* Letterbox and slate */}
      <div className="label relative z-10 flex items-center justify-between gap-4 border-b border-[#ece8df]/20 px-5 py-3 text-[0.62rem] md:px-10">
        <span>Scene 01 · The Threshold</span>
        <span className="tabular-nums" aria-hidden>
          TC {tc(ms)}
        </span>
        {step < 3 ? (
          <button type="button" onClick={() => setStep(3)} className="min-h-10 underline underline-offset-4">
            Skip intro
          </button>
        ) : (
          <Link to="/brief" className="min-h-10 content-center underline underline-offset-4">
            Skip to the recruiter brief
          </Link>
        )}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 flex-col justify-center px-5 py-10 md:px-10">
        <p
          className={`label text-[0.7rem] text-[#ece8df]/70 transition-opacity duration-700 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}
        >
          A portfolio without a fixed reality
        </p>
        <h1 id="threshold-title" aria-label={profile.name} className="mt-6">
          <Assemble
            text="ANINDITA"
            on={step >= 2}
            className="display text-[clamp(4.2rem,19vw,19rem)] leading-[0.8] tracking-[-0.07em]"
          />
          <Assemble
            text="Mondal"
            on={step >= 2}
            delay={420}
            className="serif -mt-[0.12em] pl-[12vw] text-[clamp(3.6rem,13vw,13rem)] leading-[0.85] text-[#ff5b38] italic md:pl-[34vw]"
          />
        </h1>

        <div
          className={`mt-10 grid gap-8 transition-[opacity,transform] duration-700 md:mt-14 md:grid-cols-12 ${step >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          <p className="max-w-md text-[1.15rem] leading-snug md:col-span-5">
            {profile.study}, {profile.schoolShort}. Graduating {profile.graduating}. Building software across
            engineering, data and AI.
          </p>
          <div className="flex flex-wrap items-center gap-5 md:col-span-6 md:col-start-7 md:justify-end">
            <Link
              ref={enter}
              to="/universe"
              viewTransition
              data-cursor="Enter"
              className="group inline-flex min-h-14 items-center gap-4 bg-[#ece8df] px-6 text-[1.1rem] font-semibold tracking-[-0.02em] text-[#050505] transition-colors hover:bg-[#ff5b38]"
            >
              Enter the universe
              <ArrowRight aria-hidden size={20} className="transition-transform duration-500 group-hover:translate-x-1.5" />
            </Link>
            <Link to="/exhibition" viewTransition className="label min-h-11 content-center underline underline-offset-4">
              Straight to the projects
            </Link>
          </div>
        </div>
      </div>

      <p className="label relative z-10 border-t border-[#ece8df]/20 px-5 py-3 text-[0.6rem] text-[#ece8df]/60 md:px-10">
        Move across the lines: they come to order where you are.
      </p>
    </section>
  );
}
