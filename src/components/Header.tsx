import { Link, useLocation } from 'react-router-dom';
import { Download } from 'lucide-react';
import { openPalette } from './CommandPalette';
import { profile } from '../content/profile';
import { useDestination, useScrollProgress } from '../hooks/chapter';
import { useMagnetic } from '../hooks/pointer';

/** Which destination the visitor is in; rolls over when it changes. */
function Where({ className = '' }: { className?: string }) {
  const d = useDestination();
  return (
    <span aria-hidden className={`label items-center gap-3 overflow-hidden ${className}`}>
      <span key={d.n} className="roll inline-block tabular-nums">
        {d.n}
      </span>
      <span className="hidden h-px w-6 bg-current sm:block" />
      <span key={d.label} className="roll inline-block truncate">
        {d.label}
      </span>
    </span>
  );
}

function MapButton({ className = '' }: { className?: string }) {
  const m = useMagnetic<HTMLButtonElement>();
  return (
    <button
      ref={m}
      type="button"
      onClick={openPalette}
      aria-haspopup="dialog"
      data-cursor="Open the map"
      className={`label group min-h-11 items-center gap-3 border border-current px-4 transition-colors hover:bg-[var(--hdr-fg)] hover:text-[var(--hdr-bg)] ${className}`}
    >
      <svg aria-hidden viewBox="0 0 16 16" className="size-4 transition-transform duration-500 group-hover:rotate-90">
        <circle cx="8" cy="8" r="2" fill="currentColor" />
        {[0, 72, 144, 216, 288].map((a) => (
          <circle
            key={a}
            cx={8 + Math.cos((a * Math.PI) / 180) * 6}
            cy={8 + Math.sin((a * Math.PI) / 180) * 6}
            r="1.2"
            fill="currentColor"
          />
        ))}
      </svg>
      Map<span className="sr-only">: every destination (Control or Command K)</span>
    </button>
  );
}

/**
 * The persistent navigation: thin, and coloured by whichever world it floats
 * over (each destination sets --hdr-bg / --hdr-fg). The name always returns
 * to the Infinite Room; the map reaches every destination; the recruiter
 * brief and the resume are always one click away. On phones the controls
 * move to a bar in the thumb zone.
 */
export default function Header() {
  const { pathname } = useLocation();
  const quick = pathname.startsWith('/brief');
  useScrollProgress();

  return (
    <>
      <header className="site-header no-print sticky top-0 z-40 border-b border-current/25 bg-[var(--hdr-bg)] text-[var(--hdr-fg)]">
        <div className="mx-auto flex h-14 max-w-[90rem] items-center justify-between gap-3 px-4 min-[380px]:px-5 md:px-10">
          <Link to="/universe" viewTransition className="group flex min-h-11 items-center gap-3" data-cursor="The Infinite Room">
            <span aria-hidden className="relative grid size-7 place-items-center">
              <span className="absolute inset-0 rounded-full border border-current transition-transform duration-700 group-hover:scale-125" />
              <span className="size-1.5 rounded-full bg-current" />
            </span>
            <span className="leading-none">
              <span className="block text-[0.95rem] font-semibold tracking-[-0.02em] whitespace-nowrap">{profile.name}</span>
              <span className="label hidden text-[0.55rem] opacity-70 sm:block">The unfinished universe</span>
            </span>
            <span className="sr-only">: go to the Infinite Room</span>
          </Link>

          {!quick && <Where className="hidden min-w-0 md:inline-flex" />}

          <div className="flex items-center gap-2">
            <a
              href={profile.contact.resume}
              download
              className="label hidden min-h-11 items-center gap-1.5 px-2 link-underline lg:inline-flex"
            >
              <Download aria-hidden size={14} /> Resume
            </a>
            <a
              href={profile.contact.resume}
              download
              className={`${quick ? 'hidden sm:inline-flex' : 'inline-flex'} size-11 items-center justify-center border border-current/30 lg:hidden`}
            >
              <Download aria-hidden size={16} />
              <span className="sr-only">Download resume (PDF)</span>
            </a>
            {quick ? (
              <Link
                to="/universe"
                className="label inline-flex min-h-11 items-center border border-current px-2.5 whitespace-nowrap sm:px-4 hover:bg-[var(--hdr-fg)] hover:text-[var(--hdr-bg)]"
              >
                <span className="sm:hidden">Portfolio</span>
                <span className="hidden sm:inline">Full portfolio</span>
              </Link>
            ) : (
              <Link
                to="/brief"
                data-cursor="Everything on one page"
                className="label hidden min-h-11 items-center px-3 link-underline md:inline-flex"
              >
                Recruiter brief
              </Link>
            )}
            <MapButton className="hidden md:inline-flex" />
          </div>
        </div>
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-[var(--hdr-accent)]"
          style={{ transform: 'scaleX(var(--progress, 0))' }}
        />
      </header>

      {!quick && (
        <nav
          aria-label="Quick navigation"
          className="site-header no-print fixed inset-x-0 bottom-0 z-40 border-t border-current/25 bg-[var(--hdr-bg)] pb-[env(safe-area-inset-bottom)] text-[var(--hdr-fg)] md:hidden"
        >
          <div className="flex h-16 items-center justify-between gap-2 px-3">
            <MapButton className="inline-flex" />
            <Where className="inline-flex min-w-0 text-[0.62rem]" />
            <Link
              to="/brief"
              className="label inline-flex min-h-11 shrink-0 items-center border border-current px-3"
            >
              Brief
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
