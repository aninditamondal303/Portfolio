/**
 * The universe's destinations. The persistent map, the Infinite Room's
 * portals and the destination indicator all read from this list.
 */
export const destinations = [
  { path: '/', n: '01', label: 'The Threshold', line: 'Where the universe begins' },
  { path: '/universe', n: '02', label: 'The Infinite Room', line: 'Every way in, from one room' },
  { path: '/identity', n: '03', label: 'The Human Landscape', line: 'Who I am, what I know, where I studied' },
  { path: '/process', n: '04', label: 'The Thinking Room', line: 'How the projects were figured out' },
  { path: '/exhibition', n: '05', label: 'The Exhibition', line: 'Three projects, three installations' },
  { path: '/elsewhere', n: '06', label: 'Elsewhere', line: 'Music, photography, reading, sport' },
  { path: '/contact', n: '07', label: 'The Exit', line: 'Email, profiles and the resume' },
] as const;

/** Short, readable addresses for the three exhibits. */
export const exhibitSlugs: Record<string, string> = {
  triscan: 'triscan-ai',
  naadai: 'naad-ai',
  'api-sentinel': 'api-sentinel',
};
export const exhibitPath = (projectSlug: string) =>
  `/exhibition/${Object.keys(exhibitSlugs).find((k) => exhibitSlugs[k] === projectSlug) ?? projectSlug}`;

export const exhibitRooms: Record<string, { room: string; line: string }> = {
  'triscan-ai': { room: 'The Signal Room', line: 'Medical images, read privately in the browser' },
  'naad-ai': { room: 'The Frequency Room', line: 'A practice companion that listens to the voice' },
  'api-sentinel': { room: 'The Control Room', line: 'Breaking API changes, caught before release' },
};
