import type { Theme } from './themes';

/**
 * Decorative background for a project's world. Pure CSS/SVG, aria-hidden,
 * and never an image of the product.
 *   scan   – concentric scan rings and a crosshair (TriScan AI)
 *   staff  – eight evenly ruled lines, like a practice notebook (Naad AI)
 *   schema – cyanotype grid with JSON-pointer marks (API Sentinel)
 */
export default function ProjectMotif({ motif, className = '' }: { motif: Theme['motif']; className?: string }) {
  const base = `pointer-events-none absolute inset-0 overflow-hidden ${className}`;
  if (motif === 'scan')
    return (
      <div aria-hidden className={base}>
        <div
          className="absolute top-1/2 right-[-20vw] size-[90vw] max-w-[1400px] -translate-y-1/2 rounded-full opacity-60 md:right-[-10vw] md:size-[70vw]"
          style={{
            backgroundImage: 'repeating-radial-gradient(circle, rgba(169,155,193,.16) 0 1px, transparent 1px 34px)',
          }}
        />
        <div className="absolute top-0 bottom-0 left-[62%] w-px bg-lavender/15" />
        <div className="absolute right-0 left-0 top-[48%] h-px bg-lavender/15" />
      </div>
    );
  if (motif === 'staff')
    return (
      <div aria-hidden className={base}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="absolute right-0 left-0 border-t border-plum/10" style={{ top: `${10 + i * 11}%` }} />
        ))}
      </div>
    );
  if (motif === 'schema')
    return (
      <div
        aria-hidden
        className={base}
        style={{
          backgroundImage:
            'linear-gradient(rgba(230,238,247,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(230,238,247,.07) 1px, transparent 1px), linear-gradient(rgba(230,238,247,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(230,238,247,.035) 1px, transparent 1px)',
          backgroundSize: '120px 120px, 120px 120px, 24px 24px, 24px 24px',
        }}
      >
        <span className="label absolute top-6 right-6 text-[0.6rem] text-[#e6eef7]/40">#/paths/~1orders/post</span>
        <span className="label absolute bottom-6 left-6 text-[0.6rem] text-[#e6eef7]/40">openapi: 3.1.0</span>
      </div>
    );
  return null;
}
