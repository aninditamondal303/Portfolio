import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { profile } from '../content/profile';
import { destinations, exhibitPath, exhibitRooms } from '../content/sections';
import { exhibited } from './exhibition';

interface Cmd {
  id: string;
  label: string;
  group: 'Destinations' | 'Exhibits' | 'Pages' | 'Actions' | 'Elsewhere';
  hint?: string;
  run: () => void;
}

export const openPalette = () => window.dispatchEvent(new CustomEvent('palette:open'));

/**
 * The index: the site's navigation as a full-screen editorial contents page.
 * Opened from the header, the bottom bar on phones, or Ctrl/⌘ K. Type to
 * filter; ↑ ↓ to move; Enter to go; Esc or the close button to leave. One
 * native <dialog> with combobox/listbox semantics.
 */
export default function CommandPalette() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const [note, setNote] = useState('');
  const navigate = useNavigate();

  const close = () => dialog.current?.close();
  const cmds: Cmd[] = useMemo(
    () => [
      ...destinations.map((d) => ({
        id: `d-${d.path === '/' ? 'threshold' : d.path.slice(1)}`,
        label: d.label,
        group: 'Destinations' as const,
        hint: d.n,
        run: () => navigate(d.path, { viewTransition: true }),
      })),
      ...exhibited.map((p) => ({
        id: `p-${p.slug}`,
        label: p.title,
        group: 'Exhibits' as const,
        hint: exhibitRooms[p.slug].room,
        run: () => navigate(exhibitPath(p.slug), { viewTransition: true }),
      })),
      {
        id: 'brief',
        label: 'Recruiter brief',
        group: 'Pages',
        hint: 'Everything on one page',
        run: () => navigate('/brief'),
      },
      {
        id: 'resume',
        label: 'Download resume (PDF)',
        group: 'Actions',
        run: () => {
          const a = document.createElement('a');
          a.href = profile.contact.resume;
          a.download = '';
          a.click();
        },
      },
      {
        id: 'email',
        label: 'Copy email address',
        group: 'Actions',
        hint: profile.contact.email,
        run: () => {
          navigator.clipboard?.writeText(profile.contact.email).catch(() => {});
        },
      },
      {
        id: 'play',
        label: 'Play the Raag Yaman phrase',
        group: 'Actions',
        run: () => {
          navigate('/elsewhere');
          setTimeout(() => window.dispatchEvent(new CustomEvent('pitch:play')), 600);
        },
      },
      {
        id: 'github',
        label: 'GitHub',
        group: 'Elsewhere',
        hint: profile.contact.githubLabel,
        run: () => window.open(profile.contact.github, '_blank', 'noopener'),
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        group: 'Elsewhere',
        run: () => window.open(profile.contact.linkedin, '_blank', 'noopener'),
      },
    ],
    [navigate],
  );

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? cmds.filter((c) => `${c.label} ${c.group} ${c.hint ?? ''}`.toLowerCase().includes(t)) : cmds;
  }, [q, cmds]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    const open = () => {
      setQ('');
      setNote('');
      if (!dialog.current?.open) dialog.current?.showModal();
      requestAnimationFrame(() => input.current?.focus());
    };
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (dialog.current?.open) close();
        else open();
      }
    };
    window.addEventListener('palette:open', open);
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('palette:open', open);
      window.removeEventListener('keydown', key);
    };
  }, []);

  const runCmd = (c: Cmd) => {
    c.run();
    if (c.id === 'email') {
      setNote('Email copied');
      setTimeout(close, 700);
    } else close();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, shown.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && shown[active]) {
      e.preventDefault();
      runCmd(shown[active]);
    }
  };

  useEffect(() => {
    document.getElementById(`cmd-${shown[active]?.id}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, shown]);

  const groups = (['Destinations', 'Exhibits', 'Pages', 'Actions', 'Elsewhere'] as const)
    .map((g) => ({ g, items: shown.filter((c) => c.group === g) }))
    .filter((x) => x.items.length);

  const option = (c: Cmd) => {
    const i = shown.indexOf(c);
    const on = i === active;
    const big = c.group === 'Destinations' || c.group === 'Exhibits';
    return (
      <div
        key={c.id}
        id={`cmd-${c.id}`}
        role="option"
        aria-selected={on}
        onMouseMove={() => setActive(i)}
        onClick={() => runCmd(c)}
        className={`group flex cursor-pointer items-baseline gap-4 border-b border-ivory/12 transition-colors ${big ? 'py-2' : 'py-2.5'} ${on ? 'text-coral' : 'text-ivory'}`}
      >
        {c.group === 'Destinations' && <span className="label w-12 shrink-0 text-ivory/55">{c.hint}</span>}
        <span
          className={`${big ? 'display text-[clamp(2.2rem,6vw,5rem)] leading-[0.95]' : 'text-lg'} transition-transform duration-300 ease-[var(--ease-editorial)] ${on ? 'translate-x-2' : ''}`}
        >
          {c.label}
        </span>
        {c.group !== 'Destinations' && c.hint && (
          <span className="label ml-auto hidden truncate text-[0.62rem] text-ivory/55 sm:inline">{c.hint}</span>
        )}
        {c.group === 'Elsewhere' && <ArrowUpRight aria-hidden size={16} className="ml-auto shrink-0 sm:ml-0" />}
      </div>
    );
  };

  return (
    <dialog
      ref={dialog}
      aria-label="Map of the universe"
      className="index-dialog no-print m-0 h-[100dvh] max-h-none w-screen max-w-none bg-plum p-0 text-ivory backdrop:bg-plum"
    >
      <div className="on-dark mx-auto flex h-full max-w-[90rem] flex-col px-5 md:px-10">
        <div className="flex items-center gap-3 border-b border-ivory/25 py-3">
          <span className="label hidden text-ivory/60 sm:inline">Map</span>
          <Search aria-hidden size={18} className="text-ivory/60 sm:ml-4" />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            role="combobox"
            aria-expanded="true"
            aria-controls="cmd-list"
            aria-activedescendant={shown[active] ? `cmd-${shown[active].id}` : undefined}
            aria-label="Filter the map"
            placeholder="Type to filter…"
            className="min-h-12 min-w-0 flex-1 bg-transparent text-xl text-ivory outline-none placeholder:text-ivory/45 focus-visible:outline-none"
          />
          <button
            type="button"
            onClick={close}
            className="label inline-flex min-h-11 items-center gap-2 border border-ivory/40 px-3 hover:border-ivory"
          >
            <X aria-hidden size={14} /> Close <kbd className="hidden text-ivory/55 sm:inline">Esc</kbd>
          </button>
        </div>

        <div
          id="cmd-list"
          role="listbox"
          aria-label="Map of the universe"
          className="grid flex-1 content-start gap-x-16 gap-y-10 overflow-y-auto overscroll-contain py-8 lg:grid-cols-12"
        >
          {shown.length === 0 && <p className="text-ivory/70 lg:col-span-12">Nothing matches “{q}”.</p>}
          {groups.map(({ g, items }) => (
            <div
              key={g}
              role="group"
              aria-label={g}
              className={
                g === 'Destinations' ? 'lg:col-span-6 lg:row-span-3' : g === 'Exhibits' ? 'lg:col-span-6' : 'lg:col-span-3'
              }
            >
              <p role="presentation" className="label mb-2 text-[0.65rem] text-coral">
                {g}
              </p>
              {items.map(option)}
            </div>
          ))}
        </div>

        <p
          className="label flex justify-between gap-4 border-t border-ivory/25 py-3 text-[0.62rem] text-ivory/60"
          aria-live="polite"
        >
          <span>↑ ↓ to move · Enter to open · Esc to close</span>
          <span>{note}</span>
        </p>
      </div>
    </dialog>
  );
}
