import { projects } from '../content/projects';

/**
 * Presentation choice, not data: the homepage exhibition and the index show
 * three works. The other case studies stay published and are listed on the
 * recruiter view (/brief).
 */
export const exhibitedSlugs = ['triscan-ai', 'naad-ai', 'api-sentinel'] as const;
export const exhibited = exhibitedSlugs.map((s) => projects.find((p) => p.slug === s)!);
