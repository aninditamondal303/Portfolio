import { projects } from '../content/projects';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Cursor from './Cursor';
import CommandPalette from './CommandPalette';

/** Scrolls to the top on page change, or to #section when the URL has one. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // Wait for components that measure themselves (the pitch contour) and for
    // lazily loaded pages (case studies), then scroll. Gives up after ~2 s.
    // Timers rather than animation frames, so it also works in a tab that
    // opened in the background.
    let timer = 0;
    let tries = 0;
    let settle = 0;
    const id = hash ? decodeURIComponent(hash.slice(1)) : '';
    const userScroll = () => (settle = 99);
    const attempt = () => {
      tries += 1;
      const el = id ? document.getElementById(id) : null;
      if (tries > 2 && !id) return window.scrollTo(0, 0);
      if (tries > 2 && el) {
        // Jump without smooth scrolling, then hold the target for ~0.6 s while
        // sections above it finish laying out. Any wheel, touch or key from
        // the visitor stops the correction at once.
        const top = el.getBoundingClientRect().top;
        if (Math.abs(top - 80) > 4) el.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
        if (++settle > 36) return;
      } else if (tries > 120) return;
      timer = window.setTimeout(attempt, 16);
    };
    timer = window.setTimeout(attempt, 16);
    const opts = { passive: true, once: true } as const;
    window.addEventListener('wheel', userScroll, opts);
    window.addEventListener('touchstart', userScroll, opts);
    window.addEventListener('keydown', userScroll, opts);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('wheel', userScroll);
      window.removeEventListener('touchstart', userScroll);
      window.removeEventListener('keydown', userScroll);
    };
  }, [pathname, hash]);
  return null;
}

/**
 * Scroll momentum as a CSS variable (--sv, -1 to 1, easing back to 0), so
 * kinetic headings can lean with the scroll. Off with reduced motion.
 */
function useScrollMomentum() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const html = document.documentElement;
    let last = window.scrollY;
    let v = 0;
    let raf = 0;
    const tick = () => {
      const y = window.scrollY;
      v = v * 0.85 + Math.max(-1, Math.min(1, (y - last) / 60)) * 0.15;
      last = y;
      html.style.setProperty('--sv', v.toFixed(3));
      raf = Math.abs(v) > 0.002 ? requestAnimationFrame(tick) : 0;
      if (!raf) html.style.setProperty('--sv', '0');
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => {
      window.removeEventListener('scroll', on);
      cancelAnimationFrame(raf);
    };
  }, []);
}

/** Each destination's colours for the floating navigation and the page edge. */
const skins: [RegExp, string, string, string][] = [
  [/^\/$/, '#050505', '#ece8df', '#ff5b38'],
  [/^\/universe/, '#0b0d1a', '#dcdff5', '#c6f432'],
  [/^\/identity/, '#efe6d8', '#1e1a16', '#c2410c'],
  [/^\/process/, '#f3f5f7', '#0f1a2a', '#2557d6'],
  [/^\/exhibition\/triscan/, '#04080c', '#d6f5ec', '#5cffc4'],
  [/^\/exhibition\/naadai/, '#f3ead8', '#1d1630', '#a8360a'],
  [/^\/exhibition\/api-sentinel/, '#0b0f14', '#d7e2ea', '#ffb000'],
  [/^\/exhibition/, '#d8d5ce', '#141414', '#141414'],
  [/^\/elsewhere/, '#22172a', '#f3e3ea', '#ffb4a2'],
  [/^\/contact/, '#fbfaf7', '#111111', '#111111'],
];
function useSkin() {
  const { pathname } = useLocation();
  useEffect(() => {
    const s = skins.find(([r]) => r.test(pathname)) ?? [null, '#f4f2ec', '#121211', '#b93416'];
    const h = document.documentElement.style;
    h.setProperty('--hdr-bg', s[1]);
    h.setProperty('--hdr-fg', s[2]);
    h.setProperty('--hdr-accent', s[3]);
    document.body.style.backgroundColor = s[1];
  }, [pathname]);
}

/** Remember where a link was clicked, so the next destination opens from that point. */
function usePortalOrigin() {
  useEffect(() => {
    const down = (e: PointerEvent) => {
      const h = document.documentElement.style;
      h.setProperty('--vt-x', `${e.clientX}px`);
      h.setProperty('--vt-y', `${e.clientY}px`);
    };
    window.addEventListener('pointerdown', down, { passive: true, capture: true });
    return () => window.removeEventListener('pointerdown', down, { capture: true });
  }, []);
}


const descriptions: [RegExp, string][] = [
  [/^\/universe/, 'The Infinite Room: every part of Anindita Mondal\'s portfolio, reachable from one spatial map.'],
  [/^\/identity/, 'Education, skills, experience and interests of Anindita Mondal, Computer Science (AI & ML) undergraduate at SRMIST.'],
  [/^\/process/, 'How TriScan AI, Naad AI and API Sentinel were built: architecture, decisions, problems, stack and tests.'],
  [/^\/exhibition\/triscan/, `TriScan AI, the Signal Room. ${projects[0].tagline}`],
  [/^\/exhibition\/naadai/, `Naad AI, the Frequency Room. ${projects[1].tagline}`],
  [/^\/exhibition\/api-sentinel/, `API Sentinel, the Control Room. ${projects[2].tagline}`],
  [/^\/exhibition/, 'Three projects by Anindita Mondal, shown as three installations: TriScan AI, Naad AI and API Sentinel.'],
  [/^\/elsewhere/, 'Music, photography, reading, badminton and swimming: what Anindita Mondal does away from code.'],
  [/^\/contact/, 'Email, LinkedIn, GitHub and the resume of Anindita Mondal.'],
  [/^\/brief/, 'A one-page recruiter brief for Anindita Mondal.'],
];
const defaultDescription =
  'Anindita Mondal, Computer Science (AI & ML) undergraduate at SRM Institute of Science and Technology. An interactive portfolio of software, data and AI projects.';

/** Per-route description for search engines and link previews. */
function useMetaDescription() {
  const { pathname } = useLocation();
  useEffect(() => {
    const d = descriptions.find(([r]) => r.test(pathname))?.[1] ?? defaultDescription;
    for (const sel of ['meta[name="description"]', 'meta[property="og:description"]']) {
      document.querySelector(sel)?.setAttribute('content', d);
    }
  }, [pathname]);
}

export default function Layout() {
  useMetaDescription();
  useScrollMomentum();
  useSkin();
  usePortalOrigin();
  return (
    <>
      <a
        href="#main"
        className="no-print sr-only z-50 bg-plum px-4 py-2 text-ivory focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <ScrollManager />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      <Cursor />
      <CommandPalette />
      {/* Shared filter: a rough, inky edge for brush strokes. */}
      <svg aria-hidden width="0" height="0" className="absolute">
        <filter id="ink-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="9" />
        </filter>
      </svg>
    </>
  );
}
