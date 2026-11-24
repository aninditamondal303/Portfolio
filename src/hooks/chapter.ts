import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { destinations, exhibitRooms, exhibitSlugs } from '../content/sections';
import { projects } from '../content/projects';

/** Where the visitor is in the universe, for the persistent indicator. */
export function useDestination() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/exhibition/')) {
    const slug = exhibitSlugs[pathname.split('/')[2]];
    const p = projects.find((x) => x.slug === slug);
    return { n: '05', label: p ? `${exhibitRooms[p.slug].room} · ${p.title}` : 'The Exhibition' };
  }
  if (pathname.startsWith('/brief')) return { n: '—', label: 'Recruiter brief' };
  const d = destinations.find((x) => x.path === pathname);
  return d ? { n: d.n, label: d.label } : { n: '—', label: 'Between worlds' };
}

/** Scroll progress through the page, 0 to 1, written to a CSS variable on <html>. */
export function useScrollProgress() {
  useEffect(() => {
    let raf = 0;
    const set = () => {
      raf = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty('--progress', (window.scrollY / max).toFixed(4));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(set);
    };
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    set();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);
}
