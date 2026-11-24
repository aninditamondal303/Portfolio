import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Mail, Printer } from 'lucide-react';
import { profile, education, experience, certifications, interests } from '../content/profile';
import { projects, type Role } from '../content/projects';
import { snapshot } from '../content/skills';
import RoleFilter, { roleLabels, sortByRole } from '../components/RoleFilter';
import ProjectLinks from '../components/ProjectLinks';
import { CopyEmail } from '../components/CopyEmail';
import { useTitle } from '../hooks/useTitle';

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="label mb-5 border-b border-plum/25 pb-2 text-ink-muted">
      {children}
    </h2>
  );
}

/**
 * The recruiter view: one plain page with everything a recruiter checks first.
 * No animation code loads here, and it prints as a clean document.
 */
export default function Brief() {
  useTitle('Quick view');
  const [role, setRole] = useState<Role | null>(null);
  const sorted = sortByRole(projects, role);
  const c = profile.contact;

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-14">
        {/* Who, what, where: the 60-second answers */}
        <header>
          <p className="label text-ink-muted">Quick view · one page</p>
          <h1 className="display mt-3 text-[clamp(3rem,9vw,5rem)]">{profile.name}</h1>
          <p className="mt-3 max-w-3xl text-xl leading-snug">{profile.identity}</p>
          <div className="mt-5 max-w-3xl border-l-4 border-coral bg-ivory/70 py-3 pr-3 pl-4">
            <p className="label text-[0.65rem] text-plum">Availability</p>
            <p className="mt-1 leading-relaxed">{profile.openTo}</p>
            <p className="mt-1 leading-relaxed text-ink-muted">{profile.relocation}</p>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-plum/25 py-5 lg:grid-cols-4">
            <div>
              <dt className="label text-ink-muted">Studying</dt>
              <dd className="mt-1 leading-snug">B.Tech CSE (AI & ML)</dd>
            </div>
            <div>
              <dt className="label text-ink-muted">University</dt>
              <dd className="mt-1 leading-snug">{profile.schoolShort}</dd>
            </div>
            <div>
              <dt className="label text-ink-muted">Graduating</dt>
              <dd className="mt-1 leading-snug">{profile.graduating}</dd>
            </div>
            <div>
              <dt className="label text-ink-muted">Based in</dt>
              <dd className="mt-1 leading-snug">Kolkata, India</dd>
            </div>
          </dl>

          <div className="no-print mt-6 flex flex-wrap gap-2">
            <a
              href={c.resume}
              download
              className="label inline-flex min-h-11 items-center gap-2 bg-plum px-4 text-ivory hover:bg-coral-deep"
            >
              <Download aria-hidden size={14} /> Resume (PDF)
            </a>
            <a
              href={`mailto:${c.email}`}
              className="label inline-flex min-h-11 items-center gap-2 border border-plum px-4 hover:bg-plum hover:text-ivory"
            >
              <Mail aria-hidden size={14} /> Email me
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="label hidden min-h-11 items-center gap-2 border border-plum/40 px-4 hover:border-plum sm:inline-flex"
            >
              <Printer aria-hidden size={14} /> Print
            </button>
          </div>

          <ul className="mt-6 grid gap-x-8 gap-y-2 text-[0.98rem] sm:grid-cols-2">
            <li className="flex flex-wrap items-baseline gap-x-3">
              <span className="label w-20 shrink-0 text-ink-muted">Email</span>
              <a href={`mailto:${c.email}`} className="link-underline min-w-0 [overflow-wrap:anywhere]">
                {c.email}
              </a>
              <CopyEmail className="no-print text-ink-muted" />
            </li>
            {[
              ['LinkedIn', c.linkedin, c.linkedinLabel],
              ['GitHub', c.github, c.githubLabel],
            ].map(([k, href, text]) => (
              <li key={k} className="flex items-baseline gap-x-3">
                <span className="label w-20 shrink-0 text-ink-muted">{k}</span>
                <a
                  href={href}
                  className="link-underline min-w-0 [overflow-wrap:anywhere]"
                  target="_blank"
                  rel="noreferrer"
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </header>

        {/* Projects at a glance: one line each, so phones reach them quickly */}
        <section aria-labelledby="b-glance" className="mt-10">
          <H2 id="b-glance">Projects at a glance</H2>
          <ol className="space-y-3">
            {projects.map((p, i) => (
              <li key={p.slug} className="grid grid-cols-[2rem_1fr] gap-x-2">
                <span className="label pt-1 text-ink-muted">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <Link to={`/work/${p.slug}`} className="link-underline font-medium">
                    {p.title}
                  </Link>
                  <span className="text-ink-muted"> · {p.kind}</span>
                  <span className="block text-[0.95rem] leading-snug">{p.tagline}</span>
                </span>
              </li>
            ))}
          </ol>
          <a href="#b-projects" className="label link-underline mt-4 inline-flex min-h-10 items-center">
            Details, results and links below
          </a>
        </section>

        {/* Technical snapshot */}
        <section aria-labelledby="b-snapshot" className="mt-12">
          <H2 id="b-snapshot">Technical snapshot</H2>
          <p className="mb-5 text-[0.95rem] text-ink-muted">
            <strong className="font-medium text-ink">Used</strong> = used in the projects below.{' '}
            <strong className="font-medium text-ink">Familiar</strong> = coursework or certification, not yet in a
            published project.
            {snapshot.some((r) => r.exploring?.length) && (
              <>
                {' '}
                <strong className="font-medium text-ink">Exploring</strong> = currently learning.
              </>
            )}
          </p>
          <dl className="divide-y divide-plum/15 border-y border-plum/15">
            {snapshot.map((r) => (
              <div key={r.area} className="grid gap-x-6 gap-y-1 py-3 md:grid-cols-[13rem_1fr]">
                <dt className="font-medium leading-snug">{r.area}</dt>
                <dd className="leading-relaxed">
                  <span className="label mr-2 text-[0.65rem] text-coral-deep">Used</span>
                  {r.used.join(' · ')}
                  {r.familiar?.length ? (
                    <span className="block text-ink-muted">
                      <span className="label mr-2 text-[0.65rem]">Familiar</span>
                      {r.familiar.join(' · ')}
                    </span>
                  ) : null}
                  {r.exploring?.length ? (
                    <span className="block text-ink-muted">
                      <span className="label mr-2 text-[0.65rem]">Exploring</span>
                      {r.exploring.join(' · ')}
                    </span>
                  ) : null}
                  <span className="sr-only">. Evidence: {r.evidence}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Projects */}
        <section aria-labelledby="b-projects" className="mt-12">
          <H2 id="b-projects">Projects</H2>
          <RoleFilter value={role} onChange={setRole} label="Hiring for" />
          <p className="label mt-3 min-h-4 text-ink-muted" aria-live="polite">
            {role ? `Projects with ${roleLabels[role]} work are listed first.` : ''}
          </p>
          <ol className="mt-4 divide-y divide-plum/15">
            {sorted.map((p) => {
              const relevant = !!role && p.roles.includes(role);
              return (
                <li key={p.slug} className="py-6">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="display text-3xl">
                      <Link to={`/work/${p.slug}`} className="hover:text-coral-deep">
                        {p.title}
                      </Link>
                    </h3>
                    {(p.tier === 'flagship' || p.tier === 'featured') && (
                      <span className="label text-coral-deep">{p.tier === 'flagship' ? 'Flagship' : 'Featured'}</span>
                    )}
                    {relevant && (
                      <span className="label bg-coral px-2 py-0.5 text-[0.7rem] text-plum">{roleLabels[role!]}</span>
                    )}
                  </div>
                  <p className="mt-1">{p.tagline}</p>
                  <p className="label mt-2 leading-relaxed text-ink-muted">{p.stack.slice(0, 7).join(' · ')}</p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-[0.98rem] text-ink-muted marker:text-coral-deep">
                    {p.metrics.slice(0, 3).map((m) => (
                      <li key={m.label}>
                        <strong className="font-medium text-ink">{m.value}</strong>{' '}
                        {m.label.charAt(0).toLowerCase() + m.label.slice(1)}{' '}
                        <span className="text-sm">({m.measuredOn})</span>
                      </li>
                    ))}
                  </ul>
                  <div className="no-print mt-3">
                    <ProjectLinks project={p} />
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <section aria-labelledby="b-edu">
            <H2 id="b-edu">Education</H2>
            <ul className="space-y-5">
              {education.map((e) => (
                <li key={e.school}>
                  <p className="font-medium">{e.school}</p>
                  <p>
                    {e.award}
                    {e.detail && ` · ${e.detail}`}
                  </p>
                  <p className="text-sm text-ink-muted">{e.dates}</p>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="b-exp">
            <H2 id="b-exp">Experience & activities</H2>
            <ul className="space-y-5">
              {experience.map((x) => (
                <li key={x.org}>
                  <p className="font-medium">{x.org}</p>
                  <p>{x.role}</p>
                  <p className="text-sm text-ink-muted">{x.dates}</p>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="b-cert">
            <H2 id="b-cert">Certifications</H2>
            <ul className="list-disc space-y-1 pl-5">
              {certifications.map((cert) => (
                <li key={cert}>{cert}</li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="b-int">
            <H2 id="b-int">Interests</H2>
            <p>{interests.map((i) => i.title).join(' · ')}</p>
          </section>
        </div>

        <p className="no-print mt-14 border-t border-plum/20 pt-6 text-ink-muted">
          Want the longer version?{' '}
          <Link to="/" className="link-underline inline-flex items-center gap-1 text-ink">
            See the full site <ArrowRight aria-hidden size={14} />
          </Link>
        </p>
      </div>
    </div>
  );
}
