/**
 * Skills, grouped by how much evidence exists.
 *
 *  - worked:    used in a project on this site (each lists the projects).
 *  - familiar:  on the resume through coursework or certification, but not a
 *               main tool in a published project yet.
 *  - exploring: currently learning. Empty until Anindita adds items; the
 *               section is hidden while empty.
 *
 * DRAFT: built from the resume and GitHub. Anindita should confirm the groups.
 */

import type { Role } from './projects';

export interface Skill {
  name: string;
  /** Project slugs that show this skill. */
  projects?: string[];
  note?: string;
  roles?: Role[];
}

export interface SkillGroup {
  title: string;
  skills: Skill[];
}

export const worked: SkillGroup[] = [
  {
    title: 'Languages',
    skills: [
      {
        name: 'Python',
        projects: ['triscan-ai', 'api-sentinel'],
        roles: ['backend', 'ml', 'data'],
      },
      {
        name: 'TypeScript',
        projects: ['triscan-ai', 'naad-ai', 'api-sentinel'],
        roles: ['frontend', 'fullstack'],
      },
      { name: 'Java', projects: ['api-sentinel'], roles: ['backend'] },
      { name: 'JavaScript', projects: ['naad-ai'], roles: ['frontend'] },
      { name: 'SQL', projects: ['api-sentinel'], roles: ['backend', 'data'] },
    ],
  },
  {
    title: 'Frontend',
    skills: [
      {
        name: 'React',
        projects: ['triscan-ai', 'naad-ai', 'api-sentinel'],
        roles: ['frontend', 'fullstack'],
      },
      { name: 'Vite', projects: ['naad-ai'], roles: ['frontend'] },
      { name: 'Tailwind CSS', projects: ['triscan-ai'], roles: ['frontend'] },
      { name: 'Web Audio API', projects: ['naad-ai'], roles: ['frontend'] },
      { name: 'Web Workers', projects: ['triscan-ai'], roles: ['frontend'] },
      {
        name: 'Accessibility',
        projects: ['naad-ai'],
        note: 'Lighthouse accessibility 100',
        roles: ['frontend', 'product'],
      },
    ],
  },
  {
    title: 'Backend & APIs',
    skills: [
      { name: 'Spring Boot', projects: ['api-sentinel'], roles: ['backend'] },
      { name: 'Spring Security (JWT)', projects: ['api-sentinel'], roles: ['backend'] },
      { name: 'Spring Data JPA / Hibernate', projects: ['api-sentinel'], roles: ['backend'] },
      { name: 'FastAPI', projects: ['api-sentinel'], roles: ['backend'] },
      { name: 'Node.js / Express', projects: ['naad-ai'], note: 'Small feedback server', roles: ['backend'] },
      { name: 'REST APIs', projects: ['api-sentinel'], roles: ['backend', 'fullstack'] },
      { name: 'JWT authentication', projects: ['api-sentinel'], roles: ['backend'] },
    ],
  },
  {
    title: 'Machine learning',
    skills: [
      { name: 'PyTorch', projects: ['triscan-ai'], roles: ['ml'] },
      { name: 'TensorFlow / Keras', projects: [], roles: ['ml'] },
      { name: 'ONNX Runtime', projects: ['triscan-ai'], roles: ['ml', 'frontend'] },
      { name: 'scikit-learn', projects: [], roles: ['ml'] },
      { name: 'Model evaluation & calibration', projects: ['triscan-ai'], roles: ['ml'] },
      { name: 'Cloud GPU training', projects: ['triscan-ai'], roles: ['ml'] },
    ],
  },
  {
    title: 'Data & databases',
    skills: [
      { name: 'PostgreSQL', projects: ['api-sentinel'], roles: ['backend', 'data'] },
      { name: 'SQLite', projects: [], roles: ['backend'] },
      { name: 'pandas & NumPy', projects: [], roles: ['data'] },
      { name: 'Power BI', projects: [], note: 'Star-schema export', roles: ['data'] },
      { name: 'Flyway migrations', projects: ['api-sentinel'], roles: ['backend'] },
    ],
  },
  {
    title: 'Testing & delivery',
    skills: [
      { name: 'pytest', projects: ['api-sentinel'], roles: ['qa'] },
      { name: 'Testcontainers', projects: ['api-sentinel'], roles: ['qa', 'backend'] },
      { name: 'Playwright', projects: ['triscan-ai'], roles: ['qa'] },
      { name: 'Puppeteer', projects: ['naad-ai'], roles: ['qa'] },
      { name: 'Vitest', projects: ['naad-ai', 'api-sentinel'], roles: ['qa'] },
      { name: 'Docker & Docker Compose', projects: ['api-sentinel'], roles: ['devops'] },
      { name: 'GitHub Actions CI/CD', projects: ['triscan-ai', 'naad-ai'], roles: ['devops', 'qa'] },
      {
        name: 'Git',
        projects: ['triscan-ai', 'naad-ai', 'api-sentinel'],
        roles: ['devops'],
      },
    ],
  },
];

export const familiar: Skill[] = [
  { name: 'C', note: 'Coursework' },
  { name: 'Oracle Cloud Infrastructure', note: 'OCI 2024 Foundations Associate' },
  { name: 'MATLAB', note: 'Onramp and Image Processing Onramp' },
  { name: 'Industry 4.0 & IIoT', note: 'NPTEL course' },
];

/** Add what you are currently learning here. The group is hidden while empty. */
export const exploring: Skill[] = [];

export type Level = 'worked' | 'familiar' | 'exploring';

/**
 * Technology areas recruiters search for, each with how much evidence exists.
 * DRAFT: Anindita to confirm the levels.
 */
export const areas: { name: string; level: Level; evidence: string; projects?: string[] }[] = [
  {
    name: 'Java & application development',
    level: 'worked',
    evidence: 'Java 21, Spring Boot REST API, Spring Security (JWT), Spring Data JPA, Flyway',
    projects: ['api-sentinel'],
  },
  {
    name: 'Backend systems & APIs',
    level: 'worked',
    evidence: 'Spring Boot, FastAPI, REST, service-to-service contracts',
    projects: ['api-sentinel'],
  },
  {
    name: 'Frontend development',
    level: 'worked',
    evidence: 'React, TypeScript, Vite, Tailwind, Web Audio',
    projects: ['api-sentinel', 'naad-ai', 'triscan-ai'],
  },
  {
    name: 'Full-stack development',
    level: 'worked',
    evidence: 'Frontend, API, database and deployment in one project',
    projects: ['api-sentinel'],
  },
  {
    name: 'AI & machine learning',
    level: 'worked',
    evidence: 'PyTorch, TensorFlow/Keras, ONNX, calibration, evaluation',
    projects: ['triscan-ai'],
  },
  {
    name: 'Data science & analytics',
    level: 'worked',
    evidence: 'pandas, NumPy, financial modelling, Power BI export',
    projects: [],
  },
  {
    name: 'Databases',
    level: 'worked',
    evidence: 'PostgreSQL with Flyway migrations, SQLite',
    projects: ['api-sentinel'],
  },
  {
    name: 'Testing & quality engineering',
    level: 'worked',
    evidence: 'pytest, Testcontainers, Vitest, Playwright, Puppeteer, contract tests',
    projects: ['api-sentinel', 'naad-ai', 'triscan-ai'],
  },
  {
    name: 'DevOps & CI/CD',
    level: 'worked',
    evidence: 'Docker Compose, nginx, GitHub Actions',
    projects: ['api-sentinel', 'naad-ai', 'triscan-ai'],
  },
  {
    name: 'UI/UX & product',
    level: 'worked',
    evidence: 'Designed the interfaces of my projects and this website; accessibility, three languages',
    projects: ['naad-ai'],
  },
  {
    name: 'Audio & signal processing',
    level: 'worked',
    evidence: 'Real-time pitch detection, AudioWorklet',
    projects: ['naad-ai'],
  },
  {
    name: 'Cloud',
    level: 'familiar',
    evidence: 'OCI Foundations Associate certification; demos hosted on Render and GitHub Pages',
  },
  { name: 'Mobile', level: 'familiar', evidence: 'Android build of Naad AI with Capacitor', projects: ['naad-ai'] },
  { name: 'Industry 4.0 & IIoT', level: 'familiar', evidence: 'NPTEL course' },
];

/**
 * Technical snapshot for the recruiter view. Each row is an area; `used` are
 * technologies used in the projects on this site, `familiar` come from the
 * resume (coursework, certification) without a published project, and
 * `exploring` is only what Anindita confirms she is currently learning.
 */
export const snapshot: { area: string; used: string[]; familiar?: string[]; exploring?: string[]; evidence: string }[] =
  [
    {
      area: 'Programming & problem-solving',
      used: ['Python', 'Java', 'TypeScript', 'JavaScript', 'SQL'],
      familiar: ['C'],
      evidence: 'TriScan AI, Naad AI, API Sentinel',
    },
    {
      area: 'Software & application development',
      used: ['Web apps', 'Offline web app (PWA)', 'Android via Capacitor', 'Git', 'OpenAPI contracts'],
      evidence: 'TriScan AI, Naad AI, API Sentinel',
    },
    {
      area: 'Backend & API development',
      used: ['Spring Boot', 'Spring Security (JWT)', 'Spring Data JPA', 'FastAPI', 'Node.js / Express', 'REST APIs'],
      evidence: 'API Sentinel',
    },
    {
      area: 'Frontend development',
      used: ['React', 'Vite', 'Tailwind CSS', 'Web Audio API', 'Web Workers', 'Accessibility'],
      evidence: 'TriScan AI, Naad AI, API Sentinel',
    },
    {
      area: 'Databases & data handling',
      used: ['PostgreSQL', 'Flyway', 'SQLite', 'pandas', 'NumPy'],
      evidence: 'API Sentinel',
    },
    {
      area: 'AI & machine learning',
      used: ['PyTorch', 'TensorFlow / Keras', 'ONNX Runtime', 'scikit-learn', 'Calibration & evaluation'],
      evidence: 'TriScan AI',
    },
    {
      area: 'Analytics & testing',
      used: ['Power BI export', 'Data-quality checks', 'pytest', 'Testcontainers', 'Vitest', 'Playwright', 'Puppeteer'],
      evidence: 'API Sentinel; testing across all three projects',
    },
    {
      area: 'Development tools & deployment',
      used: ['Docker', 'Docker Compose', 'nginx', 'GitHub Actions', 'Render', 'GitHub Pages', 'Cloud GPU notebooks'],
      familiar: ['Oracle Cloud Infrastructure', 'MATLAB'],
      evidence: 'API Sentinel, TriScan AI, Naad AI',
    },
  ];
