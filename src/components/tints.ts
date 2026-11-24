import type { Project } from '../content/projects';

/** Colour classes for each project's tint. */
export const tint: Record<Project['tint'], { bg: string; pale: string; text: string; border: string }> = {
  coral: { bg: 'bg-coral', pale: 'bg-[#f3d9d2]', text: 'text-coral', border: 'border-coral' },
  lavender: { bg: 'bg-lavender', pale: 'bg-lavender-pale', text: 'text-lavender', border: 'border-lavender' },
  plum: { bg: 'bg-plum-soft', pale: 'bg-[#ddd6e3]', text: 'text-[#cbbfd6]', border: 'border-[#8d7f9a]' },
  celadon: { bg: 'bg-celadon', pale: 'bg-celadon-pale', text: 'text-celadon', border: 'border-celadon' },
  gold: { bg: 'bg-gold', pale: 'bg-gold-pale', text: 'text-gold', border: 'border-gold' },
};
