import { useEffect, type RefObject } from 'react';

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Reveals every [data-reveal] element inside `scope` as it scrolls into view.
 * One IntersectionObserver adds `is-in`; the motion itself is CSS (see
 * global.css). [data-reveal="lines"] slides its [data-line] children up.
 *
 * This replaced GSAP ScrollTrigger: the result looks the same, but measured
 * main-thread time on a throttled phone dropped by several hundred ms.
 */
export function useReveal(scope: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'));
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
