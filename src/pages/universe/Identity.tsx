import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { profile, education, experience, certifications } from '../../content/profile';
import { snapshot } from '../../content/skills';
import { prefersReducedMotion } from '../../hooks/motion';
import { useTitle } from '../../hooks/useTitle';
import Portrait from '../../components/Portrait';

/** True descriptions only; each is backed by the content on this site. */
const versions = ['a Computer Science student', 'a software developer', 'a Hindustani classical vocalist', 'a volunteer'];

/** There is no single version: the sentence keeps changing its ending. */
function Versions() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const t = window.setInterval(() => setI((x) => (x + 1) % versions.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <p className="serif text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.02] italic">
      I am{' '}
      <span className="relative inline-block min-w-[6ch] text-[#c2410c]">
        <span key={i} className="roll inline-block">
          {versions[i]}
        </span>
        <span className="sr-only">: {versions.join(', ')}</span>
      </span>
      .
    </p>
  );
}

/**
 * The constellation: each area of skill is a star; the tools I have used
 * orbit it (bright), familiar ones further out (faint). Choosing an area
 * brings its system forward. The same information is always listed in text
 * beside it, so nothing depends on the drawing.
 */
function Constellation() {
  const [on, setOn] = useState(0);
  const N = snapshot.length;
  const centre = (k: number) => {
    const a = (k / N) * Math.PI * 2 - Math.PI / 2;
    return { x: 50 + Math.cos(a) * 34, y: 50 + Math.sin(a) * 34 };
  };
  const s = snapshot[on];
  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="relative lg:col-span-7">
        <svg viewBox="0 0 100 100" className="w-full overflow-visible" role="img" aria-label="Constellation of technical skills by area">
          {snapshot.map((_, k) => {
            const c = centre(k);
            const next = centre((k + 1) % N);
            return <line key={`l${k}`} x1={c.x} y1={c.y} x2={next.x} y2={next.y} stroke="#1e1a16" strokeOpacity=".12" strokeWidth=".2" />;
          })}
          {snapshot.map((a, k) => {
            const c = centre(k);
            const active = k === on;
            const tools = [...a.used.map((t) => ({ t, used: true })), ...(a.familiar ?? []).map((t) => ({ t, used: false }))];
            return (
              <g key={a.area} className="transition-opacity duration-500" opacity={active ? 1 : 0.45}>
                {tools.map((tool, j) => {
                  const ang = (j / tools.length) * Math.PI * 2 + k;
                  const r = tool.used ? (active ? 11 : 6) : active ? 15 : 8;
                  const x = c.x + Math.cos(ang) * r;
                  const y = c.y + Math.sin(ang) * r;
                  return (
                    <g key={tool.t}>
                      <line x1={c.x} y1={c.y} x2={x} y2={y} stroke="#1e1a16" strokeOpacity={active ? 0.35 : 0.12} strokeWidth=".15" />
                      <circle cx={x} cy={y} r={tool.used ? 0.9 : 0.6} fill={tool.used ? '#1e1a16' : 'none'} stroke="#1e1a16" strokeWidth=".2" />
                      {active && (
                        <text x={x} y={y - 1.6} fontSize="2.1" textAnchor="middle" fill="#1e1a16" opacity={tool.used ? 1 : 0.6}>
                          {tool.t}
                        </text>
                      )}
                    </g>
                  );
                })}
                <circle cx={c.x} cy={c.y} r={active ? 2.6 : 1.8} fill={active ? '#c2410c' : '#1e1a16'} />
              </g>
            );
          })}
        </svg>
      </div>
      <div className="lg:col-span-5">
        <div role="group" aria-label="Choose an area of skill" className="flex flex-wrap gap-2">
          {snapshot.map((a, k) => (
            <button
              key={a.area}
              type="button"
              aria-pressed={k === on}
              onClick={() => setOn(k)}
              onPointerEnter={() => setOn(k)}
              className={`min-h-10 border px-3 text-left text-[0.9rem] transition-colors ${k === on ? 'border-[#1e1a16] bg-[#1e1a16] text-[#efe6d8]' : 'border-[#1e1a16]/25 hover:border-[#1e1a16]'}`}
            >
              {a.area}
            </button>
          ))}
        </div>
        <div className="mt-8 border-t-2 border-[#1e1a16] pt-4" aria-live="polite">
          <h3 className="text-[1.4rem] font-semibold tracking-[-0.02em]">{s.area}</h3>
          <p className="mt-3 text-[1.05rem] leading-relaxed">
            <span className="label mr-2 text-[0.6rem] text-[#6b5f54]">Used</span>
            {s.used.join(' · ')}
          </p>
          {s.familiar && s.familiar.length > 0 && (
            <p className="mt-2 text-[1.05rem] leading-relaxed text-[#6b5f54]">
              <span className="label mr-2 text-[0.6rem]">Familiar</span>
              {s.familiar.join(' · ')}
            </p>
          )}
          <p className="label mt-3 text-[0.62rem] text-[#6b5f54]">Where: {s.evidence}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * 03 · The Human Landscape. Organic, layered, editorial: warm paper, a
 * portrait frame that waits, a sentence that will not settle on one version,
 * the facts a recruiter needs in one block, a constellation of skills, and
 * the record of education and experience as a winding strip.
 */
export default function Identity() {
  useTitle('The Human Landscape');
  const facts: [string, string][] = [
    ['Studying', profile.study],
    ['At', profile.school],
    ['Graduating', profile.graduating],
    ['Based in', profile.location],
    ['Relocation', profile.relocation],
  ];
  return (
    <div className="identity bg-[#efe6d8] text-[#1e1a16]">
      <section aria-labelledby="identity-title" className="grain relative overflow-hidden">
        <p aria-hidden className="ghost pointer-events-none absolute -top-[4vw] -right-[3vw] text-[30vw] leading-none text-[#c2410c] opacity-[0.07]">
          many
        </p>
        <div className="relative mx-auto grid max-w-[90rem] grid-cols-12 gap-x-6 gap-y-10 px-5 pt-12 pb-20 md:px-10 md:pt-20">
          <div className="col-span-12 lg:col-span-8">
            <p className="label text-[0.62rem] text-[#6b5f54]">03 · The Human Landscape</p>
            <h1 id="identity-title" className="display mt-4 text-[clamp(3.6rem,10vw,9rem)] leading-[0.82] tracking-[-0.07em] uppercase">
              {profile.firstName}
              <span className="serif block text-[0.55em] tracking-[-0.01em] text-[#c2410c] normal-case italic">made of many things</span>
            </h1>
            <div className="mt-10">
              <Versions />
            </div>
            <p className="mt-8 max-w-2xl text-[1.2rem] leading-relaxed">{profile.about}</p>
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-[#6b5f54]">{profile.identity}</p>
          </div>
          <div className="col-span-8 col-start-3 sm:col-span-5 sm:col-start-8 lg:col-span-3 lg:col-start-10 lg:mt-24">
            <div className="rotate-2">
              <Portrait />
            </div>
          </div>
        </div>
      </section>

      {/* For recruiters: the facts in one place */}
      <section aria-labelledby="facts-title" className="border-y-2 border-[#1e1a16] bg-[#1e1a16] text-[#efe6d8]">
        <div className="mx-auto max-w-[90rem] px-5 py-12 md:px-10">
          <h2 id="facts-title" className="label text-[0.62rem] text-[#efe6d8]/70">
            In short
          </h2>
          <dl className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="label text-[0.6rem] text-[#f2b28f]">{k}</dt>
                <dd className="mt-1 text-[1.02rem] leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 max-w-4xl text-[1.1rem] leading-relaxed">{profile.openTo}</p>
        </div>
      </section>

      <section aria-labelledby="skills-title" className="mx-auto max-w-[90rem] px-5 py-24 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="skills-title" className="display text-[clamp(2.6rem,6vw,5rem)] leading-[0.9] uppercase">
            What I can build with
          </h2>
          <p className="max-w-sm text-[0.95rem] text-[#6b5f54]">
            Eight areas, each a small solar system. Bright stars are tools used in a project; faint ones are familiar.
          </p>
        </div>
        <div className="mt-12">
          <Constellation />
        </div>
      </section>

      <section aria-labelledby="record-title" className="bg-[#e4d8c5]">
        <div className="mx-auto max-w-[90rem] px-5 py-24 md:px-10">
          <h2 id="record-title" className="serif text-[clamp(2.4rem,5vw,4.4rem)] italic">
            The record, so far
          </h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              ...education.map((e) => ({ when: e.dates, title: e.award, where: `${e.school}, ${e.place}`, text: '', kind: 'Education' })),
              ...experience.map((x) => ({ when: x.dates, title: x.role, where: x.org, text: x.text, kind: 'Experience & activity' })),
            ].map((r, i) => (
              <li
                key={r.title}
                className="relative bg-[#f6efe3] p-6 shadow-[6px_6px_0_#1e1a16]"
                style={{ rotate: `${[-0.8, 0.6, -0.4, 0.9, -0.6, 0.4][i % 6]}deg` }}
              >
                <p className="label text-[0.58rem] text-[#c2410c]">{r.kind}</p>
                <h3 className="mt-2 text-[1.2rem] leading-snug font-semibold tracking-[-0.01em]">{r.title}</h3>
                <p className="mt-1">{r.where}</p>
                <p className="label mt-2 text-[0.58rem] text-[#6b5f54]">{r.when}</p>
                {r.text && <p className="mt-3 leading-relaxed text-[#3d342c]">{r.text}</p>}
              </li>
            ))}
          </ol>
          <h3 className="label mt-16 text-[0.62rem] text-[#574c42]">Certifications</h3>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {certifications.map((c) => (
              <li key={c} className="border-b border-[#1e1a16]/20 py-2">
                {c}
              </li>
            ))}
          </ul>
          <div className="mt-16 flex flex-wrap gap-6">
            <Link to="/exhibition" viewTransition className="label link-underline min-h-11 content-center">
              See what I built → The Exhibition
            </Link>
            <Link to="/elsewhere" viewTransition className="label link-underline min-h-11 content-center">
              Outside the work → Elsewhere
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
