import { exhibitPath } from '../../content/sections';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { projects, type Project } from '../../content/projects';
import ProjectLinks from '../../components/ProjectLinks';
import MetricViz from '../../components/MetricViz';
import LabScope from '../../components/worlds/LabScope';
import SonicField from '../../components/worlds/SonicField';
import Schematic from '../../components/worlds/Schematic';
import { useMagnetic } from '../../hooks/pointer';

const get = (slug: string) => projects.find((p) => p.slug === slug)!;

function Enter({ p, label, className = '' }: { p: Project; label: string; className?: string }) {
  const m = useMagnetic<HTMLAnchorElement>(12);
  return (
    <Link
      ref={m}
      to={exhibitPath(p.slug)}
      viewTransition
      data-cursor={label}
      className={`group inline-flex min-h-12 items-center gap-3 border-2 border-current px-5 text-[1.05rem] font-semibold tracking-[-0.01em] transition-colors ${className}`}
    >
      {label}
      <ArrowRight aria-hidden size={18} className="transition-transform duration-500 group-hover:translate-x-1.5" />
    </Link>
  );
}

/**
 * Installation 01 · The Signal Room (TriScan AI). Near-black clinic, phosphor-mint
 * type, monospace readouts. The real app is examined through a scope; the
 * measured results are pinned around it like instrument readings.
 */
export function Lab() {
  const p = get('triscan-ai');
  return (
    <section
      id="lab"
      aria-labelledby="lab-title" tabIndex={-1}
      data-world="triscan-ai"
      className="world-lab on-dark relative isolate overflow-hidden"
    >
      <div aria-hidden className="lab-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto max-w-[90rem] px-5 py-16 md:px-10 md:py-24">
        <div className="label flex flex-wrap justify-between gap-3 border-b border-current/30 pb-2 text-[0.62rem]">
          <span>Installation 01 / 03 · The Signal Room</span>
          <span>{p.kind}</span>
          <span className="hidden sm:inline">Status: published · running in the browser</span>
        </div>
        <div className="mt-10 grid grid-cols-12 gap-x-8 gap-y-12">
          <div className="col-span-12 lg:col-span-5">
            <h2
              id="lab-title"
              className="font-mono text-[clamp(3.6rem,9vw,8.5rem)] leading-[0.82] font-medium tracking-[-0.08em] uppercase"
            >
              Tri
              <br />
              <span className="text-[var(--sig)]">Scan</span>
              <span className="ml-3 align-top text-[0.3em] tracking-normal">AI</span>
            </h2>
            <p className="mt-6 max-w-md text-[1.25rem] leading-snug">{p.tagline}</p>
            <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed opacity-80">{p.repoNote}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Enter p={p} label="Enter the Signal Room" className="hover:bg-[var(--sig)] hover:text-[#04080c]" />
              <ProjectLinks project={p} showCaseStudy={false} />
            </div>
          </div>
          <div className="relative col-span-12 lg:col-span-7">
            <div className="mx-auto max-w-[34rem]">
              <LabScope shot={p.screenshots[0]} label={`${p.title} under the scope`} />
            </div>
            <dl className="mt-8 grid gap-px bg-current/25 sm:grid-cols-2 lg:absolute lg:inset-x-0 lg:top-0 lg:mt-0 lg:block lg:bg-transparent">
              {p.metrics.slice(0, 4).map((m, i) => (
                <div
                  key={m.label}
                  className={`flex flex-col-reverse bg-[#04080c] p-3 lg:absolute lg:w-48 lg:border lg:border-current/40 lg:bg-[#04080c]/90 ${['lg:top-[4%] lg:-left-2', 'lg:top-[8%] lg:-right-2', 'lg:top-[62%] lg:-left-6', 'lg:top-[70%] lg:-right-4'][i]}`}
                >
                  <dt className="mt-1 text-[0.72rem] leading-snug opacity-75">
                    {m.label}
                    <span className="label block pt-1 text-[0.55rem] opacity-80">on: {m.measuredOn}</span>
                  </dt>
                  <dd className="flex items-end justify-between gap-2 font-mono text-[1.3rem] leading-none text-[var(--sig)]">
                    {m.value}
                    <MetricViz value={m.value} size="sm" />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Installation 02 · The Frequency Room (Naad AI). Warm paper, ink and saffron; the type
 * is a serif that sings. A field of sound you can play runs across the
 * spread; the phone screens hang along a phrase.
 */
export function Sonic() {
  const p = get('naad-ai');
  const phones = p.screenshots.filter((s) => s.height > s.width).slice(0, 3);
  return (
    <section
      id="sonic"
      aria-labelledby="sonic-title"
      data-world="naad-ai"
      className="world-sonic relative isolate overflow-hidden"
    >
      <div className="mx-auto max-w-[90rem] px-5 py-16 md:px-10 md:py-24">
        <div className="label flex flex-wrap justify-between gap-3 border-b border-current pb-2 text-[0.62rem]">
          <span>Installation 02 / 03 · The Frequency Room</span>
          <span>{p.kind}</span>
        </div>
        <div className="mt-8 grid grid-cols-12 gap-x-8 gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <h2 id="sonic-title" className="serif text-[clamp(5rem,15vw,14rem)] leading-[0.78] italic">
              Naad
              <span className="ml-[0.1em] align-super text-[0.25em] not-italic tracking-[0.2em] uppercase">AI</span>
            </h2>
            <p className="mt-6 max-w-lg text-[1.35rem] leading-snug">{p.tagline}</p>
            <p className="mt-4 max-w-lg text-[1rem] leading-relaxed opacity-80">{p.summary}</p>
          </div>
          <div
            className="col-span-12 flex items-end justify-center gap-3 lg:col-span-5"
            aria-label="Phone screens of the app"
          >
            {phones.map((s, i) => (
              <img
                key={s.src}
                src={s.src}
                alt={s.alt}
                width={s.width}
                height={s.height}
                loading="lazy"
                className={`w-[30%] max-w-40 border-[5px] border-[var(--ink)] shadow-[8px_8px_0_var(--sig)] ${['lg:-translate-y-[10%]', 'lg:-translate-y-[34%]', 'lg:-translate-y-[4%]'][i]}`}
                style={{ rotate: `${[-4, 2, 5][i]}deg` }}
              />
            ))}
          </div>
        </div>
        <div className="mt-12 h-[clamp(14rem,30vw,22rem)] border-y border-current">
          <SonicField ink="#1d1630" accent="#d9480f" className="h-full" />
        </div>
        <div className="mt-16 grid grid-cols-12 gap-x-8 gap-y-8">
          <dl className="col-span-12 grid grid-cols-2 gap-x-6 gap-y-6 lg:col-span-7">
            {p.metrics.slice(0, 4).map((m) => (
              <div key={m.label} className="flex flex-col-reverse border-t border-current pt-3">
                <dt className="mt-1 text-[0.9rem] leading-snug">
                  {m.label}
                  <span className="label block pt-1 text-[0.58rem] opacity-70">Measured on: {m.measuredOn}</span>
                </dt>
                <dd className="serif flex items-end justify-between text-[2.6rem] leading-none text-[var(--sig)] italic">
                  {m.value}
                  <MetricViz value={m.value} size="sm" />
                </dd>
              </div>
            ))}
          </dl>
          <div className="col-span-12 flex flex-col items-start gap-5 lg:col-span-4 lg:col-start-9">
            <Enter p={p} label="Enter the Frequency Room" className="hover:bg-[var(--ink)] hover:text-[#f3ead8]" />
            <ProjectLinks project={p} showCaseStudy={false} />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Installation 03 · The Control Room (API Sentinel). A monitoring room: slate,
 * amber alerts, monospace everything. The architecture is a live schematic;
 * a terminal replays the example from the app's own landing page.
 */
export function System() {
  const p = get('api-sentinel');
  return (
    <section
      id="system"
      aria-labelledby="system-title"
      data-world="api-sentinel"
      className="world-system on-dark relative isolate overflow-hidden"
    >
      <div className="mx-auto max-w-[90rem] px-5 py-16 md:px-10 md:py-24">
        <div className="label flex flex-wrap justify-between gap-3 border-b border-current/30 pb-2 text-[0.62rem]">
          <span>Installation 03 / 03 · The Control Room</span>
          <span>{p.kind}</span>
          <span className="flex items-center gap-2">
            <span aria-hidden className="status-dot size-2 rounded-full bg-[var(--ok)]" /> monitoring
          </span>
        </div>
        <div className="mt-10 grid grid-cols-12 gap-x-8 gap-y-10">
          <div className="col-span-12 lg:col-span-6">
            <h2
              id="system-title"
              className="font-mono text-[clamp(2.8rem,6.6vw,6.4rem)] leading-[0.88] font-medium tracking-[-0.06em]"
            >
              <span className="text-[var(--sig)]">$</span> api
              <br />
              sentinel<span className="caret">_</span>
            </h2>
            <p className="mt-6 max-w-md text-[1.2rem] leading-snug">{p.tagline}</p>
          </div>
          <figure className="col-span-12 border border-current/40 bg-black/40 font-mono text-[0.82rem] leading-relaxed lg:col-span-6">
            <figcaption className="label flex justify-between border-b border-current/30 px-3 py-2 text-[0.6rem] opacity-80">
              <span>compare · orders-api</span>
              <span>Illustrative example from the live app’s landing page</span>
            </figcaption>
            <div className="term space-y-1 px-4 py-4">
              <p>
                <span className="opacity-60">-</span> DELETE /orders/{'{orderId}'}{' '}
                <span className="bg-[var(--alert)] px-1 text-black">CRITICAL</span> endpoint removed
              </p>
              <p>
                <span className="opacity-60">~</span> POST /orders required [items] → [items, channel]{' '}
                <span className="bg-[var(--sig)] px-1 text-black">HIGH</span>
              </p>
              <p className="pt-2">
                <span className="opacity-60">decision</span> fail-on HIGH →{' '}
                <span className="font-bold text-[var(--alert)]">FAIL</span>
              </p>
            </div>
          </figure>
        </div>
        <div className="mt-12 h-[26rem] border border-current/30 bg-[repeating-linear-gradient(0deg,transparent_0_23px,rgba(215,226,234,.06)_23px_24px),repeating-linear-gradient(90deg,transparent_0_23px,rgba(215,226,234,.06)_23px_24px)] sm:h-[22rem]">
          <Schematic stages={p.diagram} className="size-full" />
        </div>
        <p className="label mt-2 text-[0.6rem] opacity-70">The real architecture · drag any box; the wiring follows</p>
        <div className="mt-12 grid grid-cols-12 gap-x-8 gap-y-8">
          <ul className="col-span-12 font-mono text-[0.9rem] lg:col-span-7">
            {p.metrics.slice(0, 4).map((m) => (
              <li key={m.label} className="flex flex-wrap items-baseline gap-x-3 border-b border-current/20 py-2">
                <span className="text-[var(--ok)]">✓</span>
                <span className="text-[1.25rem] text-[var(--sig)]">{m.value}</span>
                <span>{m.label}</span>
                <span className="label text-[0.58rem] opacity-60">· {m.measuredOn}</span>
              </li>
            ))}
          </ul>
          <div className="col-span-12 flex flex-col items-start gap-5 lg:col-span-4 lg:col-start-9">
            <Enter p={p} label="Enter the Control Room" className="hover:bg-[var(--sig)] hover:text-black" />
            <ProjectLinks project={p} showCaseStudy={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
