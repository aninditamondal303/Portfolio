import type { Metric } from '../content/projects';
import MetricViz from './MetricViz';

/** A row of measured results. Each says what it was measured on. */
export default function Metrics({
  metrics,
  tone = 'light',
  accent = 'border-coral',
}: {
  metrics: Metric[];
  tone?: 'light' | 'dark';
  accent?: string;
}) {
  const muted = tone === 'dark' ? 'text-ivory/65' : 'text-ink-muted';
  const body = tone === 'dark' ? 'text-ivory/85' : 'text-ink';
  return (
    <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((m) => (
        <div key={m.label} className={`flex flex-col border-t-2 pt-4 ${accent}`}>
          <dt className={`${body} order-2 mt-2 text-[0.98rem] leading-snug`}>{m.label}</dt>
          <dd className="contents">
            <span className="order-1 flex flex-wrap items-end justify-between gap-3">
              <span className="display block text-5xl">{m.value}</span>
              <MetricViz value={m.value} />
            </span>
            <span className={`label order-3 mt-3 block text-[0.68rem] leading-relaxed ${muted}`}>
              Measured on: {m.measuredOn}
            </span>
            {m.explain && (
              <span className={`order-4 mt-2 block text-[0.85rem] leading-snug ${muted}`}>{m.explain}</span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
