import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { projects, type Project, type Shot } from '../content/projects';
import ProjectLinks from '../components/ProjectLinks';
import Metrics from '../components/Metrics';
import Thread from '../components/Thread';
import FlowDiagram from '../components/FlowDiagram';
import { tint } from '../components/tints';
import { themeOf } from '../components/themes';
import ProjectMotif from '../components/ProjectMotif';
import LabScope from '../components/worlds/LabScope';
import SonicField from '../components/worlds/SonicField';
import Schematic from '../components/worlds/Schematic';
import { exhibitPath, exhibitRooms, exhibitSlugs } from '../content/sections';
import { exhibited } from '../components/exhibition';
import { voice } from '../components/voice';
import { useReveal } from '../hooks/motion';
import { useTitle } from '../hooks/useTitle';
import NotFound from './NotFound';

function Block({ id, n, label, children }: { id: string; n: string; label: string; children: React.ReactNode }) {
  return (
    <section
      aria-labelledby={id}
      className="cs-block grid grid-cols-12 gap-x-5 border-t border-plum/20 py-12 md:py-16"
      data-reveal
    >
      <h2
        id={id}
        className="cs-label label col-span-12 mb-6 self-start text-ink-muted md:sticky md:top-24 md:col-span-3 md:mb-0"
      >
        <span className="mr-3 text-coral-deep">{n}</span>
        {label}
      </h2>
      <div className="cs-body col-span-12 md:col-span-8 md:col-start-5">{children}</div>
    </section>
  );
}

/** What exists for this project, stated plainly: live demo or not, source, docs. */
function Evidence({ p, dark }: { p: Project; dark: boolean }) {
  const muted = dark ? 'text-ivory/70' : 'text-ink-muted';
  return (
    <dl
      className={`grid grid-cols-2 gap-x-6 gap-y-3 border-t pt-5 text-[0.95rem] sm:grid-cols-4 ${dark ? 'border-ivory/25' : 'border-plum/25'}`}
    >
      <div>
        <dt className={`label text-[0.65rem] ${muted}`}>Built by</dt>
        <dd>Me, individually</dd>
      </div>
      <div>
        <dt className={`label text-[0.65rem] ${muted}`}>Live demo</dt>
        <dd>
          {p.links.live ? (
            <a
              href={p.links.live}
              target="_blank"
              rel="noreferrer"
              className="link-underline inline-flex items-center gap-1"
            >
              Available <ArrowUpRight aria-hidden size={13} />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : (
            'Not hosted: runs locally'
          )}
        </dd>
      </div>
      <div>
        <dt className={`label text-[0.65rem] ${muted}`}>Source code</dt>
        <dd>
          <a
            href={p.links.github}
            target="_blank"
            rel="noreferrer"
            className="link-underline inline-flex items-center gap-1"
          >
            GitHub <ArrowUpRight aria-hidden size={13} />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </dd>
      </div>
      <div>
        <dt className={`label text-[0.65rem] ${muted}`}>Evidence here</dt>
        <dd>
          {p.screenshots.length} screenshots{p.demo ? ', a demo recording' : ''}, {p.docs.length} doc
          {p.docs.length === 1 ? '' : 's'}
        </dd>
      </div>
    </dl>
  );
}

/** Screenshots open full size in a native <dialog>, which handles focus and Escape. */
function Gallery({ shots }: { shots: Shot[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<Shot | null>(null);
  const show = (s: Shot) => {
    setOpen(s);
    dialog.current?.showModal();
  };
  return (
    <>
      <ul className="grid grid-cols-2 gap-4 md:gap-6">
        {shots.map((s, i) => {
          const tall = s.height > s.width;
          return (
            <li key={s.src} className={tall ? 'col-span-1' : i === 0 ? 'col-span-2' : 'col-span-2 sm:col-span-1'}>
              <button type="button" onClick={() => show(s)} className="group block w-full text-left">
                <span className="block overflow-hidden border border-plum/15 bg-ivory">
                  <img
                    src={s.src}
                    alt={s.alt}
                    width={s.width}
                    height={s.height}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-[1.02]"
                  />
                </span>
                <span className="mt-2 block text-sm text-ink-muted">
                  <span className="label mr-2">{String(i + 1).padStart(2, '0')}</span>
                  {s.alt}
                  <span className="sr-only"> (open larger)</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        className="m-auto max-h-[92vh] max-w-[94vw] bg-transparent p-0 backdrop:bg-plum/85"
        aria-label={open?.alt}
      >
        {open && (
          <figure className="relative">
            <img src={open.src} alt={open.alt} className="block max-h-[84vh] w-auto max-w-[94vw]" />
            <figcaption className="mt-3 text-ivory">{open.alt}</figcaption>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="label absolute -top-2 right-0 inline-flex min-h-10 -translate-y-full items-center gap-2 text-ivory"
            >
              <X aria-hidden size={16} /> Close
            </button>
          </figure>
        )}
      </dialog>
    </>
  );
}

export default function CaseStudy() {
  const { slug: param } = useParams();
  const slug = exhibitSlugs[param ?? ''] ?? param;
  const index = projects.findIndex((p) => p.slug === slug);
  const p = projects[index];
  const ref = useRef<HTMLDivElement>(null);
  useTitle(p?.title ?? 'Page not found');
  useReveal(ref, [slug]);

  if (!p) return <NotFound />;

  const t = tint[p.tint];
  const world = themeOf(p);
  const dark = world.dark;
  // Prev/next walk the three exhibited works; the other case studies (reached
  // from the recruiter brief) step into the exhibition.
  const ex = exhibited.findIndex((x) => x.slug === p.slug);
  const prev = ex >= 0 ? exhibited[(ex - 1 + exhibited.length) % exhibited.length] : exhibited[exhibited.length - 1];
  const next = ex >= 0 ? exhibited[(ex + 1) % exhibited.length] : exhibited[0];
  const v = voice[p.slug];
  const cover = p.screenshots[0];
  const [hardest, ...otherChallenges] = p.challenges;
  const accent = dark ? 'border-plum' : t.border;

  return (
    <article ref={ref} aria-labelledby="cs-title" data-world={p.slug} className="world-page">
      <header className={`grain relative isolate overflow-hidden bg-paper text-ink ${dark ? 'on-dark' : ''}`}>
        <ProjectMotif motif={world.motif} />
        <div className="relative mx-auto grid max-w-[90rem] grid-cols-12 gap-x-5 gap-y-10 px-5 pt-8 pb-16 md:px-10 md:pb-24">
          <nav aria-label="Breadcrumb" className="label col-span-12 flex flex-wrap items-center justify-between gap-3">
            <Link to="/exhibition" viewTransition className="link-underline inline-flex min-h-10 items-center gap-2">
              <ArrowLeft aria-hidden size={14} /> Back to the Exhibition
            </Link>
            <span className="opacity-75">
              {exhibitRooms[p.slug]?.room} · {ex >= 0 ? `${String(ex + 1).padStart(2, '0')} / ${String(exhibited.length).padStart(2, '0')} · ` : ''}
              {p.kind}
            </span>
          </nav>
          <div className="col-span-12 lg:col-span-6 lg:pt-10">
            <h1
              id="cs-title"
              className={v ? v.title : 'display text-[clamp(3.5rem,9vw,8rem)]'}
              style={{ viewTransitionName: `title-${p.slug}` }}
            >
              {v ? v.render(p.title) : p.title}
            </h1>
            <p className="mt-4 max-w-2xl text-2xl leading-snug" data-reveal>
              {p.tagline}
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-90" data-reveal>
              {p.summary}
            </p>
            <div className="mt-8" data-reveal>
              <ProjectLinks project={p} showCaseStudy={false} />
              {p.links.liveNote && <p className="mt-2 text-sm opacity-75">{p.links.liveNote}</p>}
              {p.repoNote && <p className="mt-3 max-w-xl text-sm leading-relaxed opacity-75">{p.repoNote}</p>}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="relative">
              <span
                aria-hidden
                className={`absolute inset-0 translate-x-4 translate-y-4 ${dark ? 'bg-coral' : t.bg}`}
              />
              <img
                src={cover.src}
                alt={cover.alt}
                width={cover.width}
                height={cover.height}
                fetchPriority="high"
                style={{ viewTransitionName: `shot-${p.slug}` }}
                className={`relative block w-full ${cover.height > cover.width ? 'mx-auto max-h-[70vh] w-auto' : ''}`}
              />
            </div>
          </div>
          <div className="col-span-12" data-reveal>
            <Evidence p={p} dark={dark} />
          </div>
        </div>
        <Thread
          seed={index + 3}
          className="relative -mb-5"
          color={dark ? 'var(--color-coral)' : 'var(--color-coral-deep)'}
        />
      </header>

      {/* The world's instrument, full width */}
      <section aria-label={`${p.title}: interactive`} className="border-y border-current/30">
        <div className="mx-auto max-w-[90rem] px-5 py-14 md:px-10">
          <p className="label mb-6 text-[0.62rem] opacity-75">
            {p.slug === 'triscan-ai'
              ? 'The instrument · move the crosshair over the app'
              : p.slug === 'naad-ai'
                ? 'The instrument · play across the seven notes of Raag Yaman'
                : 'The instrument · the real architecture, drag any box'}
          </p>
          {p.slug === 'triscan-ai' && (
            <div className="mx-auto max-w-[40rem]">
              <LabScope shot={p.screenshots[1] ?? p.screenshots[0]} label={`${p.title} workbench under the scope`} />
            </div>
          )}
          {p.slug === 'naad-ai' && (
            <div className="h-[clamp(14rem,28vw,20rem)]">
              <SonicField ink="#1d1630" accent="#d9480f" className="h-full" />
            </div>
          )}
          {p.slug === 'api-sentinel' && (
            <div className="h-[26rem] sm:h-[22rem]">
              <Schematic stages={p.diagram} className="size-full" />
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-[90rem] px-5 md:px-10">
        <Block id="cs-problem" n="01" label="The problem">
          <p className="display text-[clamp(1.8rem,3vw,2.6rem)] leading-tight">{p.problem}</p>
          <h3 className="label mt-10 mb-3 text-ink-muted">Why it is worth solving</h3>
          <p className="text-lg leading-relaxed">{p.whyItMatters}</p>
        </Block>

        <Block id="cs-arch" n="02" label="Architecture & workflow">
          <FlowDiagram stages={p.diagram} title={`${p.title}: how data flows through the system`} accent={accent} />
          <ol className="mt-10 space-y-0">
            {p.architecture.map((step, i) => (
              <li key={step} className="relative grid grid-cols-[3rem_1fr] pb-7 last:pb-0">
                {i < p.architecture.length - 1 && (
                  <span
                    aria-hidden
                    className={`absolute top-8 bottom-0 left-[0.95rem] w-px ${dark ? 'bg-plum/40' : t.bg}`}
                  />
                )}
                <span
                  className={`label relative z-10 flex size-8 items-center justify-center border-2 bg-paper ${accent}`}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <p className="pt-1 text-lg leading-relaxed">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </Block>

        <Block id="cs-tech" n="03" label="Technologies, and why">
          <dl className="divide-y divide-plum/15 border-y border-plum/15">
            {p.stackNotes.map((s) => (
              <div key={s.tech} className="grid gap-x-8 gap-y-1 py-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                <dt className="font-medium">{s.tech}</dt>
                <dd className="leading-relaxed text-ink-muted">{s.why}</dd>
              </div>
            ))}
          </dl>
          <p className="label mt-6 leading-relaxed text-ink-muted">Full stack: {p.stack.join(' · ')}</p>
          {p.decisions.length > 0 && (
            <>
              <h3 className="label mt-12 mb-5 text-ink-muted">Design decisions</h3>
              <dl className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                {p.decisions.map((d) => (
                  <div key={d.title} className="border-t-2 border-plum pt-4">
                    <dt className="display text-[1.75rem] leading-tight">{d.title}</dt>
                    <dd className="mt-3 leading-relaxed text-ink-muted">{d.text}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </Block>

        <Block id="cs-role" n="04" label="My contribution">
          <p className="label inline-block bg-plum px-2 py-1 text-ivory">Individual project</p>
          <p className="mt-4 text-xl leading-relaxed">{p.contribution}</p>
          <h3 className="label mt-10 mb-4 text-ink-muted">What I built</h3>
          <ul className="space-y-4">
            {p.highlights.map((h, i) => (
              <li key={h} className="grid grid-cols-[2.5rem_1fr] text-lg leading-relaxed">
                <span className="label pt-1.5 text-ink-muted">{String(i + 1).padStart(2, '0')}</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </Block>

        {hardest && (
          <Block id="cs-hardest" n="05" label="The hardest problem">
            <h3 className="display text-[clamp(2rem,3.5vw,3rem)] leading-tight">{hardest.title}</h3>
            <p className="mt-4 text-lg leading-relaxed">{hardest.text}</p>
            {otherChallenges.length > 0 && (
              <>
                <h3 className="label mt-12 mb-5 text-ink-muted">Other problems I solved</h3>
                <div className="space-y-8">
                  {otherChallenges.map((c) => (
                    <div key={c.title} className="border-l-2 border-coral pl-5">
                      <h4 className="text-xl font-medium">{c.title}</h4>
                      <p className="mt-2 leading-relaxed text-ink-muted">{c.text}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Block>
        )}

        <Block id="cs-testing" n="06" label="How it was tested">
          <p className="text-lg leading-relaxed">{p.testing.summary}</p>
          <dl className="mt-8 grid gap-6 md:grid-cols-2">
            {p.testing.suites.map((s) => (
              <div key={s.name} className={`border-t-2 pt-4 ${accent}`}>
                <dt className="font-medium">{s.name}</dt>
                <dd className="mt-2 leading-relaxed text-ink-muted">{s.detail}</dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block id="cs-results" n="07" label="Results, and what they were measured on">
          <Metrics metrics={p.metrics} accent={accent} />
        </Block>

        <Block id="cs-shots" n="08" label={p.demo ? 'Screenshots & demo' : 'Screenshots'}>
          {p.demo && (
            <figure className="mb-10 grid items-center gap-6 sm:grid-cols-[minmax(0,14rem)_1fr]">
              <video
                src={p.demo.src}
                poster={p.demo.poster}
                width={p.demo.width}
                height={p.demo.height}
                controls
                muted
                playsInline
                preload="none"
                className="block h-auto w-full max-w-56 border border-plum/20 bg-plum"
              />
              <figcaption className="text-ink-muted">{p.demo.caption}</figcaption>
            </figure>
          )}
          <Gallery shots={p.screenshots} />
        </Block>

        <Block id="cs-limits" n="09" label={p.future.length ? 'Limitations & what comes next' : 'Limitations'}>
          <ul className="space-y-3">
            {p.limitations.map((l) => (
              <li key={l} className="border-l-2 border-coral pl-4 text-lg leading-relaxed">
                {l}
              </li>
            ))}
          </ul>
          {p.future.length > 0 && (
            <>
              <h3 className="label mt-12 mb-4 text-ink-muted">Planned improvements</h3>
              <ul className="space-y-3">
                {p.future.map((f) => (
                  <li key={f} className="border-l-2 border-celadon pl-4 text-lg leading-relaxed">
                    {f}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Block>

        <Block id="cs-links" n="10" label="Code & documentation">
          <ProjectLinks project={p} showCaseStudy={false} />
          {!p.links.live && (
            <p className="mt-3 text-ink-muted">
              There is no hosted demo; the repository explains how to run it locally.
            </p>
          )}
          <ul className="mt-6 space-y-2">
            {p.docs.map((d) => (
              <li key={d.url}>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline inline-flex min-h-10 items-center gap-1.5"
                >
                  {d.label} <ArrowUpRight aria-hidden size={14} />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Block>
      </div>

      <nav aria-label="More projects" className="border-t border-plum/20">
        <div className="mx-auto grid max-w-[90rem] gap-px bg-plum/20 sm:grid-cols-2">
          <Link to={exhibitPath(prev.slug)} viewTransition className="group bg-paper px-5 py-10 md:px-10">
            <span className="label inline-flex items-center gap-2 text-ink-muted">
              <ArrowLeft aria-hidden size={14} /> Previous project
            </span>
            <span className="display mt-2 block text-4xl group-hover:text-coral-deep md:text-5xl">{prev.title}</span>
          </Link>
          <Link to={exhibitPath(next.slug)} viewTransition className="group bg-paper px-5 py-10 text-right md:px-10">
            <span className="label inline-flex items-center gap-2 text-ink-muted">
              Next project <ArrowRight aria-hidden size={14} />
            </span>
            <span className="display mt-2 block text-4xl group-hover:text-coral-deep md:text-5xl">{next.title}</span>
          </Link>
        </div>
      </nav>
    </article>
  );
}
