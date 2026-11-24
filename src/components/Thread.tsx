/**
 * The site's signature thread: a thin sung line that runs between sections.
 * Purely decorative. Each use passes a seed so no two look the same.
 */
export default function Thread({
  seed = 1,
  className = '',
  color = 'var(--color-coral-deep)',
}: {
  seed?: number;
  className?: string;
  color?: string;
}) {
  const pts: string[] = [];
  const levels = [0, 12, -10, 22, 6, -16, 18, 0];
  for (let i = 0; i <= 120; i++) {
    const t = i / 120;
    const seg = Math.min(levels.length - 2, Math.floor(t * (levels.length - 1)));
    const k = t * (levels.length - 1) - seg;
    const a = levels[(seg + seed) % levels.length];
    const b = levels[(seg + seed + 1) % levels.length];
    // Hold most of each step, then glide (a meend) to the next.
    const e = k < 0.65 ? 0 : 0.5 - 0.5 * Math.cos(Math.PI * ((k - 0.65) / 0.35));
    const v = a + (b - a) * e + 1.2 * Math.sin(i * 0.9 + seed);
    pts.push(`${(t * 1200).toFixed(1)},${(30 - v).toFixed(1)}`);
  }
  return (
    <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className={`block h-10 w-full ${className}`} aria-hidden>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
