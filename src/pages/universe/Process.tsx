import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../../content/projects';
import { exhibitPath, exhibitRooms } from '../../content/sections';
import FlowDiagram from '../../components/FlowDiagram';
import { useTitle } from '../../hooks/useTitle';

const tabs = [
  { id: 'architecture', label: 'Architecture' },
  { id: 'decisions', label: 'Decisions' },
  { id: 'problems', label: 'Problems solved' },
  { id: 'stack', label: 'Stack, and why' },
  { id: 'tests', label: 'Testing' },
  { id: 'unfinished', label: 'Not finished yet' },
] as const;

/**
 * 04 · The Thinking Room. A research notebook on graph paper: pick a project,
 * then a layer of how it was figured out. Everything shown is the project's
 * own documented material (architecture, decisions, problems, stack notes,
 * tests, limitations), nothing invented. Tabs follow the WAI-ARIA pattern:
 * arrow keys move between them.
 */
export default function Process() {
  useTitle('The Thinking Room');
  const [pi, setPi] = useState(0);
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('architecture');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const p = projects[pi];
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + tabs.length) % tabs.length;
    setTab(tabs[n].id);
    tabRefs.current[n]?.focus();
  };

  return (
    <div className="process min-h-svh bg-[#f3f5f7] text-[#0f1a2a]">
      <div className="mx-auto max-w-[90rem] px-5 pt-12 pb-24 md:px-10 md:pt-16">
        <div className="grid grid-cols-12 gap-x-0 gap-y-8 lg:gap-x-6">
          <div className="col-span-12 lg:col-span-7">
            <p className="label text-[0.62rem] text-[#2557d6]">04 · The Thinking Room · research notebook</p>
            <h1 className="mt-4 font-mono text-[clamp(2.6rem,6.4vw,6rem)] leading-[0.9] font-medium tracking-[-0.06em]">
              How it was
              <br />
              <span className="text-[#2557d6]">figured out_</span>
            </h1>
          </div>
          <p className="col-span-12 self-end text-[1.08rem] leading-relaxed text-[#3b4a5e] lg:col-span-4 lg:col-start-9">
            The parts a finished screenshot hides: how each system is wired, the choices behind it, the problems that
            took longest, how it is tested, and what it still cannot do.
          </p>
        </div>

        {/* Choose a notebook */}
        <div role="group" aria-label="Choose a project" className="mt-12 flex flex-wrap gap-2 border-b-2 border-[#0f1a2a] pb-3">
          {projects.map((x, i) => (
            <button
              key={x.slug}
              type="button"
              aria-pressed={i === pi}
              onClick={() => setPi(i)}
              className={`min-h-11 px-4 font-mono text-[0.9rem] transition-colors ${i === pi ? 'bg-[#0f1a2a] text-[#f3f5f7]' : 'border border-[#0f1a2a]/30 hover:border-[#0f1a2a]'}`}
            >
              {String(i + 1).padStart(2, '0')} {x.title}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-12 gap-x-0 gap-y-8 lg:gap-x-8">
          <div className="col-span-12 lg:col-span-3">
            <p className="label text-[0.6rem] text-[#3b4a5e]">{exhibitRooms[p.slug].room}</p>
            <h2 className="mt-2 text-[1.8rem] leading-tight font-semibold tracking-[-0.03em]">{p.title}</h2>
            <p className="mt-3 leading-relaxed text-[#3b4a5e]">{p.problem}</p>
            <p className="mt-4 text-[0.92rem] leading-relaxed">{p.contribution}</p>
            <Link to={exhibitPath(p.slug)} viewTransition className="label link-underline mt-5 inline-flex min-h-11 items-center">
              See the finished exhibit →
            </Link>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <div role="tablist" aria-label="Layers" className="flex flex-wrap gap-x-1 gap-y-1">
              {tabs.map((t, i) => (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  tabIndex={tab === t.id ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`min-h-11 border-b-2 px-3 font-mono text-[0.82rem] transition-colors ${tab === t.id ? 'border-[#2557d6] text-[#2557d6]' : 'border-transparent text-[#3b4a5e] hover:text-[#0f1a2a]'}`}
                >
                  {String(i + 1).padStart(2, '0')}·{t.label}
                </button>
              ))}
            </div>

            <div
              role="tabpanel"
              id={`panel-${tab}`}
              aria-labelledby={`tab-${tab}`}
              tabIndex={0}
              key={p.slug + tab}
              className="notebook roll mt-6 min-h-[24rem] border border-[#0f1a2a]/20 bg-white/70 p-5 md:p-8"
            >
              {tab === 'architecture' && (
                <>
                  <FlowDiagram stages={p.diagram} title={`${p.title}: how the parts connect`} accent="border-[#2557d6]" />
                  <ol className="mt-8 space-y-3">
                    {p.architecture.map((a, i) => (
                      <li key={a} className="grid grid-cols-[2.5rem_1fr] gap-3 leading-relaxed">
                        <span className="font-mono text-[#2557d6]">{String(i + 1).padStart(2, '0')}</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ol>
                </>
              )}
              {tab === 'decisions' && (
                <ol className="grid gap-4 md:grid-cols-2">
                  {p.decisions.map((d, i) => (
                    <li key={d.title} className="border-l-2 border-[#2557d6] bg-[#f3f5f7] p-4">
                      <p className="font-mono text-[0.72rem] text-[#2557d6]">decision {String(i + 1).padStart(2, '0')}</p>
                      <h3 className="mt-1 font-semibold">{d.title}</h3>
                      <p className="mt-2 leading-relaxed text-[#3b4a5e]">{d.text}</p>
                    </li>
                  ))}
                </ol>
              )}
              {tab === 'problems' && (
                <div className="space-y-3">
                  {p.challenges.map((c, i) => (
                    <details key={c.title} open={i === 0} className="group border border-[#0f1a2a]/20 bg-white">
                      <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                        <span className="font-mono text-[#2557d6]">{i === 0 ? 'hardest' : `#${String(i + 1).padStart(2, '0')}`}</span>
                        <span className="font-semibold">{c.title}</span>
                        <span aria-hidden className="ml-auto font-mono transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="px-4 pb-4 leading-relaxed text-[#3b4a5e]">{c.text}</p>
                    </details>
                  ))}
                </div>
              )}
              {tab === 'stack' && (
                <table className="w-full text-left text-[0.95rem]">
                  <caption className="sr-only">Technologies and why they were used</caption>
                  <tbody>
                    {p.stackNotes.map((s) => (
                      <tr key={s.tech} className="border-b border-[#0f1a2a]/15 align-top">
                        <th scope="row" className="w-1/3 py-3 pr-4 font-mono font-medium text-[#2557d6]">
                          {s.tech}
                        </th>
                        <td className="py-3 leading-relaxed text-[#3b4a5e]">{s.why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {tab === 'tests' && (
                <>
                  <p className="text-[1.1rem] leading-relaxed">{p.testing.summary}</p>
                  <ul className="mt-6 grid gap-3 md:grid-cols-2">
                    {p.testing.suites.map((t) => (
                      <li key={t.name} className="border border-[#0f1a2a]/15 p-4">
                        <p className="font-mono text-[0.85rem] text-[#2557d6]">✓ {t.name}</p>
                        <p className="mt-1 leading-relaxed text-[#3b4a5e]">{t.detail}</p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {tab === 'unfinished' && (
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="font-mono text-[0.85rem] text-[#2557d6]">What it cannot do yet</h3>
                    <ul className="mt-3 space-y-2">
                      {p.limitations.map((l) => (
                        <li key={l} className="leading-relaxed">— {l}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-mono text-[0.85rem] text-[#2557d6]">What would come next</h3>
                    <ul className="mt-3 space-y-2">
                      {p.future.map((l) => (
                        <li key={l} className="leading-relaxed">→ {l}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
