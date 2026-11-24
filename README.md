# A Little About Me

Personal portfolio of Anindita Mondal. React + TypeScript + Vite, Tailwind CSS v4, React Router, GSAP (loaded only on the creative pages), Lucide icons.

## Run it in VS Code

```powershell
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check and production build into dist/
npm run preview    # serve the production build
```

## Pages

Live at **https://aninditamondal303.github.io/Portfolio/**

| Route | What it is |
|---|---|
| `/` | The Threshold: the opening |
| `/universe` | The Infinite Room: every destination from one map |
| `/identity` | The Human Landscape: education, skills, experience |
| `/process` | The Thinking Room: architecture, decisions, tests |
| `/exhibition` | The Exhibition: three project installations |
| `/exhibition/triscan`, `/exhibition/naadai`, `/exhibition/api-sentinel` | One room per project |
| `/elsewhere` | Music, photography, reading, sport |
| `/contact` | The Exit: email, profiles, resume |
| `/brief` | Quick view for recruiters. Plain, fast, printable. |

Ctrl/Cmd+K opens the map on every page.

## Deployment

Every push to `main` builds the site with `--base=/Portfolio/` and publishes it to GitHub Pages (`.github/workflows/deploy.yml`). The workflow copies `index.html` to `404.html` so direct links and refreshes on nested routes load the app.

## Updating content

All text lives in `src/content/`. You should never need to edit a component to change what the site says.

| File | Contents |
|---|---|
| `profile.ts` | Name, intro, contact links, education, experience, certifications, music. Lines marked `DRAFT` need your own wording. |
| `projects.ts` | Every project: summary, highlights, metrics (each with what it was measured on), stack, roles, limitations, links. |
| `skills.ts` | Technology areas (worked with / familiar / exploring) and every tool, linked to the projects that use it. `exploring` is hidden while empty. |
| `pitch.ts` | The sung phrase drawn in the About section. Replace `phrase`, or paste a real pitch line exported from Naad AI into `recorded`. |
| `sections.ts` | Order and names of the homepage sections (header menu and side index). |

Project screenshots live in `public/images/projects/<slug>/` as WebP files.

To add a project, copy an entry in `projects.ts` and give it a new `slug`. It appears in the work list, the hero index, the quick view and gets its own case-study page automatically.

**Portrait:** save a 4:5 image as `public/images/portrait.webp` and set `portrait` in `profile.ts`. The frame has a fixed shape, so nothing else on the page moves.

**Photography:** put WebP files in `public/images/photography/` and fill `src` and `alt` for each frame in `photographs` (`profile.ts`). Each frame keeps its shape (portrait, landscape or square). The section is currently hidden (`showPhotography = false`); set it to `true` once you have added photos.

**Interests:** each interest has an empty `note` you can fill with a line in your own words.

Design tokens (colours, fonts) are at the top of `src/styles/global.css`.

## Accessibility and motion

- Skip link, visible focus styles, semantic headings and landmarks, keyboard-usable controls.
- With *reduce motion* turned on in the OS, GSAP never loads and transitions are switched off.
- Colour pairs used for text meet WCAG AA contrast.

## Deploying

Both options below are configured. Vercel is recommended for this site.

### Vercel (recommended)

1. Push this folder to a GitHub repository.
2. On vercel.com, choose **Add New → Project**, import the repository and press **Deploy**. `vercel.json` sets the build and the page routing.
3. In `index.html`, change `og:image` to the full address of your site's `/og.png`, so link previews in LinkedIn and email show the image.

Why Vercel: links such as `/brief` or `/work/api-sentinel` are served with a normal "200 OK" response. On GitHub Pages they only work through a 404 fallback page, so they return a "404" status. Browsers still show the page, but link previews (LinkedIn, Slack, email) and search engines may treat the link as broken. That matters here because `/brief` is the link you will paste into applications. Vercel also gives every branch its own preview link.

### GitHub Pages

1. Create a repository named `aninditamondal303.github.io` and push this folder to its `main` branch.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**. `.github/workflows/deploy.yml` builds and publishes on every push.
3. If you use a different repository name, the site lives at `github.io/<repo>/`; set `base: '/<repo>/'` in `vite.config.ts`.

Note: `public/Anindita_Mondal_Resume.pdf` is public once deployed, and it includes your phone number.
