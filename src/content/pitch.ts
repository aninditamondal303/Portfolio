/**
 * The vocal pitch contour drawn in the About section.
 *
 * It is a phrase described note by note, positioned in cents from Sa on a
 * sargam grid, the way Naad AI draws a sung take. The contour is generated
 * from these notes with meends (glides) between them.
 *
 * DRAFT: the phrase is the commonly taught pakad of Raag Yaman,
 *   N̲i Re Ga · Re Sa · P̲a Re · N̲i Re Sa
 * Anindita should check the phrase, or replace it with her own.
 *
 * To use a real recording of her voice instead, export the pitch line from
 * Naad AI and fill `recorded` with [seconds, centsFromSa] pairs. When
 * `recorded` has points, it is drawn instead of the generated phrase.
 */

export interface PhraseNote {
  /** Swara name as shown on the grid. */
  swara: string;
  /** Cents from Sa. Mandra (lower) octave is negative. */
  cents: number;
  /** Seconds held. */
  hold: number;
  /** Glide into the next note over this many seconds (a meend). */
  glide?: number;
  /** Slow oscillation on the held note (andolan), in cents. */
  andolan?: number;
  /** Silence after the note, in seconds (a breath between phrases). */
  rest?: number;
}

export const pitch = {
  title: 'Pakad of Raag Yaman',
  /** Reference Sa for the play button, in Hz (C♯4). */
  saHz: 277.18,
  saLabel: 'C♯',
  phrase: [
    { swara: 'Ni', cents: -100, hold: 0.42, glide: 0.32 },
    { swara: 'Re', cents: 200, hold: 0.36, glide: 0.3 },
    { swara: 'Ga', cents: 400, hold: 1.05, glide: 0.42, andolan: 6 },
    { swara: 'Re', cents: 200, hold: 0.32, glide: 0.38 },
    { swara: 'Sa', cents: 0, hold: 0.85, rest: 0.4 },
    { swara: 'Pa', cents: -500, hold: 0.5, glide: 0.75 },
    { swara: 'Re', cents: 200, hold: 0.75, rest: 0.35 },
    { swara: 'Ni', cents: -100, hold: 0.4, glide: 0.34 },
    { swara: 'Re', cents: 200, hold: 0.36, glide: 0.48 },
    { swara: 'Sa', cents: 0, hold: 1.5, andolan: 10 },
  ] as PhraseNote[],
  /** Optional real recording: [seconds, cents from Sa]. Empty = use the phrase. */
  recorded: [] as [number, number][],
  /** Grid lines: swara name and cents. Mandra swaras are marked with a dot below. */
  grid: [
    { swara: 'Pa', cents: -500, mandra: true },
    { swara: 'Dha', cents: -300, mandra: true },
    { swara: 'Ni', cents: -100, mandra: true },
    { swara: 'Sa', cents: 0 },
    { swara: 'Re', cents: 200 },
    { swara: 'Ga', cents: 400 },
    { swara: 'Ma′', cents: 600 },
    { swara: 'Pa', cents: 700 },
  ],
};
