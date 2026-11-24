import type { Project } from '../content/projects';

/**
 * Each project has its own world: a mood (colours) and a motif drawn in CSS/SVG.
 * These are visual directions only; no content lives here.
 */
export interface Theme {
  motif: 'scan' | 'staff' | 'schema';
  /** Background, text and accent for the project's opening and features. */
  bg: string;
  fg: string;
  muted: string;
  accent: string;
  rule: string;
  dark: boolean;
}

export const themes: Record<string, Theme> = {
  'triscan-ai': {
    motif: 'scan',
    bg: 'bg-[#0e0c14]',
    fg: 'text-[#efeaf6]',
    muted: 'text-[#efeaf6]/70',
    accent: 'text-[#c3b4ff]',
    rule: 'border-[#efeaf6]/20',
    dark: true,
  },
  'naad-ai': {
    motif: 'staff',
    bg: 'bg-[#eedfc9]',
    fg: 'text-plum',
    muted: 'text-ink-muted',
    accent: 'text-coral-deep',
    rule: 'border-plum/20',
    dark: false,
  },
  'api-sentinel': {
    motif: 'schema',
    bg: 'bg-[#10304d]',
    fg: 'text-[#e6eef7]',
    muted: 'text-[#e6eef7]/75',
    accent: 'text-[#8fc1ee]',
    rule: 'border-[#e6eef7]/20',
    dark: true,
  },
};

export const themeOf = (p: Project) => themes[p.slug];
