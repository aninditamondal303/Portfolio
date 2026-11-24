/**
 * Personal details. Everything here comes from Anindita's resume (Nov 2026)
 * or from her own words in chat. Edit this file to update the site.
 */

export const profile = {
  name: 'Anindita Mondal',
  firstName: 'Anindita',
  greeting: 'Hello, I’m Anindita.',
  /** Anindita's own wording. */
  identity:
    'I am a Computer Science undergraduate interested in exploring technology, building practical projects and learning through hands-on experience.',
  study: 'B.Tech, Computer Science and Engineering (AI & ML)',
  school: 'SRM Institute of Science and Technology, Kattankulathur',
  schoolShort: 'SRMIST, Kattankulathur',
  graduating: 'May 2027',
  location: 'Kolkata, West Bengal, India',
  /** Kept factual: what she has built, from the projects on this site. */
  // DRAFT wording: Anindita to check.
  about:
    'I study Computer Science with a specialisation in AI & ML at SRM Institute of Science and Technology, Kattankulathur. Alongside my coursework I have built complete projects: a Spring Boot and FastAPI platform for checking API changes, machine-learning models for medical scans, and a practice app for Hindustani classical singers.',
  /** Anindita's approved availability statement (23 Nov 2026). */
  /** Location preference, shown on the recruiter view. */
  relocation: 'Open to relocating anywhere in India; prefers opportunities outside Chennai.',
  openTo:
    'Final-year B.Tech Computer Science student at SRMIST, graduating May 2027. Open to campus placements, off-campus opportunities and relocation across India. Interested in internships and entry-level roles across software engineering, application development, AI, data and other technology domains.',
  /** The same, in three short parts for the creative homepage. */
  availability: [
    'Final year, graduating May 2027',
    'Campus placements and off-campus roles',
    'Open to relocating anywhere in India',
  ],

  contact: {
    email: 'aninditamondal303@gmail.com',
    linkedin: 'https://www.linkedin.com/in/anindita-mondal-931b61355',
    linkedinLabel: 'linkedin.com/in/anindita-mondal-931b61355',
    github: 'https://github.com/aninditamondal303',
    githubLabel: 'github.com/aninditamondal303',
    resume: `${import.meta.env.BASE_URL}Anindita_Mondal_Resume.pdf`,
  },

  /**
   * Portrait. Leave null for now: the About section shows an empty, designed
   * frame of the same size. To add one later, put a 4:5 image in
   * public/images/portrait.webp and set:
   *   portrait: { src: '/images/portrait.webp', alt: 'Anindita Mondal' }
   */
  portrait: null as null | { src: string; alt: string },
};

export const education: { school: string; place: string; award: string; detail?: string; dates: string }[] = [
  {
    school: 'SRM Institute of Science and Technology (SRMIST)',
    place: 'Kattankulathur, Chennai',
    award: 'B.Tech in Computer Science and Engineering (AI & ML)',
    dates: 'May 2023 – May 2027 (expected)',
  },
  {
    school: 'DAV Model School',
    place: 'Durgapur, West Bengal',
    award: 'Class XII, CBSE (PCM + Biology)',
    dates: 'Completed May 2023',
  },
  {
    school: 'Carmel School, Steel Township',
    place: 'Durgapur, West Bengal',
    award: 'Class X, ICSE',
    dates: 'Completed May 2021',
  },
];

export const experience = [
  {
    org: 'Bharat Coking Coal Limited',
    role: 'Vocational Trainee, Coal Mining Operations',
    dates: 'May 2025 – Jul 2025',
    text: 'Observed heavy machinery operations, material handling, and sensor-based hazard monitoring systems for gas and ventilation safety.',
  },
  {
    org: 'Udbartan Social Welfare Organisation',
    role: 'Volunteer, Community Development',
    dates: 'Jun 2025',
    text: 'Supported elderly residents at Udbartan Old Age Home through daily assistance and community engagement activities.',
  },
  {
    org: 'Hindustani classical music',
    role: 'Vocalist; college music club',
    dates: 'Trained since childhood (15+ years), ongoing',
    text: 'Trained in Hindustani classical vocals since childhood and a vocalist in my college music club; applied this domain knowledge to conceive and build Naad AI.',
  },
];

export const certifications = [
  'Oracle Cloud Infrastructure 2024 Certified Foundations Associate',
  'NPTEL: Introduction to Industry 4.0 and Industrial Internet of Things',
  'MATLAB Onramp and MATLAB Image Processing Onramp',
  'Artificial Intelligence and Deep Learning (Udemy)',
];

/**
 * Interests. `note` is shown under the title. Only the music note is known
 * from the resume; the others are left empty for Anindita to write.
 * Empty notes are simply not shown.
 */
export const interests: { id: Motif; title: string; note: string; link?: { to: string; label: string } }[] = [
  {
    id: 'music',
    title: 'Hindustani classical music',
    note: 'Trained since childhood, more than fifteen years, and still learning.',
    link: { to: '/work/naad-ai', label: 'It led to Naad AI' },
  },
  { id: 'voice', title: 'Vocal performance', note: 'Vocalist in my college music club.' },
  { id: 'photo', title: 'Photography', note: '' },
  { id: 'reading', title: 'Reading', note: '' },
  { id: 'badminton', title: 'Badminton', note: '' },
  { id: 'swimming', title: 'Swimming', note: '' },
];

export type Motif = 'music' | 'voice' | 'photo' | 'reading' | 'badminton' | 'swimming';

/**
 * Photography. The gallery always shows these frames; a frame with no `src`
 * is drawn as an empty slot in the contact sheet. Add photos by filling `src`
 * (put WebP files in public/images/photography/) and `alt`. Each frame keeps
 * its shape, so adding a photo never moves the layout.
 */
export const photographs: {
  src?: string;
  alt?: string;
  caption?: string;
  shape: 'portrait' | 'landscape' | 'square';
}[] = [
  { shape: 'portrait' },
  { shape: 'landscape' },
  { shape: 'square' },
  { shape: 'landscape' },
  { shape: 'portrait' },
  { shape: 'square' },
];

/** Hidden until Anindita adds her own photographs (decision, 23 Nov 2026). Set to true to show it. */
export const showPhotography = false;
