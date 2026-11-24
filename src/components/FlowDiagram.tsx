import type { FlowStage } from '../content/projects';

/**
 * Architecture / workflow diagram drawn from content data. Left to right on
 * wide screens, top to bottom on phones. It is an ordered list, so screen
 * readers get the same flow as sighted visitors.
 */
export default function FlowDiagram({
  stages,
  title,
  accent = 'border-plum',
  tone = 'light',
}: {
  stages: FlowStage[];
  title: string;
  accent?: string;
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';
  // Long flows need more width before they can run left to right.
  const many = stages.length > 5;
  const row = many
    ? {
        ol: '2xl:flex-row 2xl:items-stretch 2xl:gap-0',
        li: '2xl:flex-1 2xl:flex-row 2xl:items-stretch',
        arrow: '2xl:w-8 2xl:pt-6 2xl:pb-0',
        svg: '2xl:rotate-0',
      }
    : {
        ol: 'lg:flex-row lg:items-stretch lg:gap-0',
        li: 'lg:flex-1 lg:flex-row lg:items-stretch',
        arrow: 'lg:w-8 lg:pt-6 lg:pb-0',
        svg: 'lg:rotate-0',
      };
  return (
    <figure
      className={
        dark ? 'border border-white/15 bg-white/[0.04] p-4 md:p-6' : 'border border-plum/20 bg-ivory/60 p-4 md:p-6'
      }
    >
      <ol aria-label={title} className={`flex flex-col gap-2 ${row.ol}`}>
        {stages.map((st, i) => (
          <li key={i} className={`flex min-w-0 flex-col ${row.li}`}>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className={`label mb-2 min-h-4 text-[0.65rem] ${dark ? 'opacity-70' : 'text-ink-muted'}`}>
                {st.where ?? ' '}
              </p>
              <div className="flex flex-1 flex-col gap-2">
                {st.boxes.map((b) => (
                  <div
                    key={b.label}
                    className={`flex flex-1 flex-col justify-center border-l-4 px-3 py-2.5 ${dark ? 'bg-white/[0.07]' : 'bg-paper'} ${accent}`}
                  >
                    <span
                      className={`text-[0.95rem] leading-tight font-medium break-words hyphens-auto ${many ? '2xl:text-[0.86rem]' : ''}`}
                    >
                      {b.label}
                    </span>
                    {b.detail && (
                      <span
                        className={`mt-1 text-[0.8rem] leading-snug break-words hyphens-auto ${dark ? 'opacity-70' : 'text-ink-muted'}`}
                      >
                        {b.detail}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {i < stages.length - 1 && (
              <span
                aria-hidden
                className={`flex shrink-0 items-center justify-center py-1 ${dark ? 'text-coral' : 'text-coral-deep'} ${row.arrow}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`size-5 rotate-90 ${row.svg}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </li>
        ))}
      </ol>
      <figcaption className={`label mt-4 text-[0.68rem] ${dark ? 'opacity-70' : 'text-ink-muted'}`}>{title}</figcaption>
    </figure>
  );
}
