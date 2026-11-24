/* eslint-disable react-refresh/only-export-components */
/** Each work's own typographic voice, on top of its colour world (themes.ts). */
export const voice: Record<string, { title: string; rank: string; render: (t: string) => React.ReactNode }> = {
  'triscan-ai': {
    rank: 'Flagship',
    title: 'display uppercase text-[clamp(3.2rem,8.2vw,9.5rem)] leading-[0.8] tracking-[-0.065em]',
    render: (t) => {
      const [a, b] = t.split(' ');
      return (
        <>
          {a}
          <span className="block text-[#c3b4ff]">{b}</span>
        </>
      );
    },
  },
  'naad-ai': {
    rank: 'Featured',
    title: 'serif text-[clamp(3.6rem,9.5vw,10.5rem)] leading-[0.82] italic tracking-[-0.02em]',
    render: (t) => t,
  },
  'api-sentinel': {
    rank: 'Featured',
    title: 'font-mono text-[clamp(2.4rem,5.6vw,6.2rem)] leading-[0.9] font-medium tracking-[-0.06em] uppercase',
    render: (t) => {
      const [a, b] = t.split(' ');
      return (
        <>
          {a}/<span className="block">{b}_</span>
        </>
      );
    },
  },
};
