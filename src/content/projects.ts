/**
 * Project content for "A Little About Me".
 *
 * Order on the site = order of this array:
 *   1 TriScan AI (flagship) · 2 Naad AI · 3 API Sentinel · 4 NeuroScan AI · 5 ReturnLens
 * All five are individual projects by Anindita (confirmed by her, 23 Nov 2026).
 *
 * Every claim comes from Anindita's resume (Nov 2026) or the project's own public
 * repository: README, docs/ (DECISIONS.md, case-study.md, architecture.md,
 * model-card.md, DEPLOYMENT.md), render.yaml and build files. Metrics carry
 * `measuredOn`. "Why" reasons are only given where the repository states or
 * shows them; otherwise the table says what the technology is used for.
 *
 * Edit this file to update projects. Empty arrays are hidden on the page.
 */

export type Role = 'backend' | 'frontend' | 'fullstack' | 'ml' | 'data' | 'qa' | 'devops' | 'product';

export interface Metric {
  value: string;
  label: string;
  measuredOn: string;
  /** Optional plain-language meaning of the measure, for non-specialist readers. */
  explain?: string;
}

export interface Shot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** One column of the architecture diagram; several boxes = things side by side. */
export interface FlowStage {
  /** Where this runs, shown above the boxes (e.g. "Browser", "Cloud GPU"). */
  where?: string;
  boxes: { label: string; detail?: string }[];
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  /** flagship = largest; featured = large; prominent = standard layout with more detail; more = standard. */
  tier: 'flagship' | 'featured' | 'prominent' | 'more';
  tint: 'coral' | 'lavender' | 'plum' | 'celadon' | 'gold';
  kind: string;
  summary: string;
  problem: string;
  /** Why the problem is worth solving. */
  whyItMatters: string;
  contribution: string;
  /** What I built: the main features. */
  highlights: string[];
  /** Diagram (left to right) and the same flow as numbered steps. */
  diagram: FlowStage[];
  architecture: string[];
  /** Technologies and what they are used for / why, as documented in the repo. */
  stack: string[];
  stackNotes: { tech: string; why: string }[];
  decisions: { title: string; text: string }[];
  /** The most challenging problem first; the rest are shown as other problems solved. */
  challenges: { title: string; text: string }[];
  testing: { summary: string; suites: { name: string; detail: string }[] };
  metrics: Metric[];
  roles: Role[];
  limitations: string[];
  future: string[];
  links: { live?: string; liveNote?: string; github: string; android?: string };
  /** Shown next to the repository link when its name differs from the project name. */
  repoNote?: string;
  /** Documentation in the repository. */
  docs: { label: string; url: string }[];
  /** Optional short demo recorded from the real app. */
  demo?: { src: string; poster: string; width: number; height: number; caption: string };
  /** First screenshot is the cover. */
  screenshots: Shot[];
  /** Reminders for Anindita. Never rendered. */
  todo?: string[];
}

const GH = 'https://github.com/aninditamondal303';
const img = (slug: string, n: number, alt: string, width: number, height: number): Shot => ({
  src: `${import.meta.env.BASE_URL}images/projects/${slug}/${String(n).padStart(2, '0')}.webp`,
  alt,
  width,
  height,
});
const TRISCAN_REPO = `${GH}/QIHGNN-MSCA-Quantum-Inspired-Hypergraph-Neural-Network-for-Multi-Organ-Segmentation-Prognosis`;

export const projects: Project[] = [
  {
    slug: 'triscan-ai',
    title: 'TriScan AI',
    tagline: 'Private medical scan analysis that runs entirely in the browser.',
    tier: 'flagship',
    tint: 'lavender',
    kind: 'AI / ML · Research · Frontend',
    summary:
      'An installable web app that analyses brain MRI, liver CT and cervical cell images on the device, so scans never leave the computer. Behind it is QIHGNN-MSCA, a 3D hypergraph neural network with multi-scale cross-attention for partially supervised multi-organ segmentation and prognosis, and a set of screening models that run in the browser.',
    problem:
      'Public medical datasets each label a single organ, so a naive model is punished for recognising a liver in a brain scan. Most images people can actually share are single 2D slices, not registered 3D volumes. And most scan-analysis demos upload sensitive images to a server.',
    whyItMatters:
      'Medical scans are private, so analysis that never leaves the device removes the need to trust a server with them. Reported accuracy also needs to be honest: in the public brain MRI dataset, 935 of the 1,600 official test images have a near-identical copy in the training folder, which inflates any score measured on that split.',
    contribution:
      'Individual project. I designed the network, wrote the data inspection and training pipeline, trained the models on cloud GPUs, exported them to ONNX, built the in-browser app and wrote the test suites.',
    highlights: [
      'QIHGNN-MSCA: an 8-stage 3D PyTorch network with 8,347,071 parameters, each stage matched exactly to the project report.',
      'Seven models running in the browser with ONNX Runtime Web inside a Web Worker, so the page never freezes and works offline after the first visit.',
      'Brain MRI tumour check with calibrated confidence, outline, 3D volume, heat map and a glioma survival curve; liver and tumour outlines on CT; cell and nucleus outlines with N:C ratio.',
      'Before/after comparison slider and a printable report for every result.',
    ],
    diagram: [
      { where: 'Data', boxes: [{ label: 'Public datasets', detail: 'BraTS 2020, LiTS, brain MRI, cervical cells' }] },
      {
        where: 'Python',
        boxes: [{ label: 'Inspection & splits', detail: 'admission rules, patient-level, duplicate-aware' }],
      },
      {
        where: 'Cloud GPU',
        boxes: [
          { label: 'QIHGNN-MSCA', detail: '3D research network' },
          { label: 'Screening models', detail: 'classifier, U-Net, Cox' },
        ],
      },
      { where: 'Export', boxes: [{ label: 'ONNX', detail: 'parity-checked against PyTorch' }] },
      {
        where: 'Browser',
        boxes: [
          { label: 'Web Worker', detail: 'ONNX Runtime Web' },
          { label: 'React interface', detail: 'outlines, heat map, report' },
        ],
      },
    ],
    architecture: [
      'An inspection step reads every dataset, records its format and labels, and decides which organ each dataset may supervise.',
      'Volumes are preprocessed once to 128 × 128 × 64 with patient-level splits; 2D images are grouped into duplicate clusters before splitting.',
      'Models are trained in PyTorch on hosted cloud GPU notebooks driven from VS Code tasks, resumable and time-budgeted.',
      'The screening models are exported to ONNX, and each export is compared with PyTorch on the same input.',
      'Preprocessing, a NIfTI reader and the survival maths are rewritten in TypeScript and unit-tested against fixtures produced by the Python code.',
      'In the browser, a Web Worker runs the models with ONNX Runtime Web while the React interface shows outlines, heat maps, volumes and reports.',
    ],
    stack: [
      'PyTorch',
      'ONNX Runtime Web',
      'Web Workers',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Starlette',
      'esbuild',
      'GitHub Actions',
    ],
    stackNotes: [
      { tech: 'PyTorch', why: 'The 3D research network, the screening models and their training loops.' },
      {
        tech: 'ONNX Runtime Web + Web Workers',
        why: 'Runs all seven models inside the browser so no scan leaves the device, on a background thread so the page never freezes.',
      },
      {
        tech: 'TypeScript re-implementation of preprocessing',
        why: 'The browser must prepare images exactly as training did; tests hold it to the Python results within 1e-5 (normalisation) and 1e-9 (survival curves).',
      },
      {
        tech: 'Starlette instead of FastAPI',
        why: 'FastAPI is a layer over Starlette; using Starlette routes with pydantic models is the same stack with less magic, and was fully testable in the build environment.',
      },
      {
        tech: 'esbuild instead of Vite',
        why: 'One small build script bundles the site and compiles Tailwind v4: fewer moving parts and the same output on Windows, macOS and Linux.',
      },
      {
        tech: 'Hosted cloud GPU notebooks',
        why: 'Free GPUs with the datasets attached; a notebook runs the whole pipeline without a local GPU.',
      },
    ],
    decisions: [
      {
        title: 'Report what the data supports',
        text: 'Predicting BraTS survival classes was no better than the majority class (37.9% vs 37.9%), so the tool shows a risk ranking and a survival curve with its bootstrap band instead of a class.',
      },
      {
        title: 'A class for "not a brain MRI"',
        text: 'The classifier is trained on abdominal CT, colposcopy photographs and synthetic non-medical images as a fifth class, so it rejects inputs it was never meant to read instead of forcing them into a tumour class.',
      },
      {
        title: 'Calibration and abstention',
        text: 'A temperature is fitted on validation data, and the tool abstains below the confidence at which validation predictions reach 98% accuracy.',
      },
    ],
    challenges: [
      {
        title: 'Leakage hidden in a public test split',
        text: '935 of the brain dataset’s 1,600 official test images had a near-identical copy in its training folder. Images are grouped by a difference hash taken over all flips and 90-degree rotations, near matches are clustered, and whole clusters go to train, validation or test. The count is published with the results.',
      },
      {
        title: 'Datasets that each label one organ',
        text: 'A naive loss treats every unlabelled organ as background. The marginal loss folds unlabelled channels into background first; when probability moves from background to an organ the dataset never annotated, the naive loss rises by 0.68 and the marginal loss by 0.00.',
      },
      {
        title: 'A survival record off by one patient',
        text: 'The per-slice BraTS mirror numbers volumes from 1, and an earlier version assumed 0, shifting every survival record by one patient. IDs are now derived from the data and the case is covered by a test.',
      },
    ],
    testing: {
      summary: 'Python and browser test suites run in GitHub Actions on every push, including a smoke training run.',
      suites: [
        {
          name: 'Model and data (pytest)',
          detail:
            'Parameter count of every stage against an independent counter; the marginal and Cox losses behave as specified; Dice, HD95, C-index and AUC match closed forms; no patient appears in two splits.',
        },
        { name: 'Browser maths', detail: 'TypeScript formulas checked against Python fixtures; strict type checking.' },
        {
          name: 'End to end (Playwright, Chromium)',
          detail:
            'Every interactive section in a real browser, at desktop width and at 360 px with no horizontal scroll.',
        },
      ],
    },
    metrics: [
      {
        value: '0.877 vs 0.419',
        label: 'Brain lesion Dice vs ablation baseline',
        measuredOn: 'Held-out patients',
        explain:
          'Overlap between the predicted outline and the expert\u2019s outline; 1.0 is a perfect match. The baseline is the same network with its key components removed.',
      },
      {
        value: '0.791 vs 0.037',
        label: 'Liver Dice vs ablation baseline',
        measuredOn: 'Held-out patients',
        explain: 'Overlap between the predicted outline and the expert\u2019s outline; 1.0 is a perfect match.',
      },
      {
        value: '98.4%',
        label: 'Brain-tumour sensitivity (specificity 98.8%)',
        measuredOn: '1,596 held-out brain MRI images',
      },
      {
        value: '0.947',
        label: 'Liver Dice, deployed model',
        measuredOn: 'Held-out CT volumes',
        explain: 'Overlap between the predicted outline and the expert\u2019s outline; 1.0 is a perfect match.',
      },
      { value: '95.5%', label: 'Cervical cell-grading accuracy', measuredOn: 'Held-out data' },
      { value: '42', label: 'Automated tests (15 unit, 27 end-to-end)', measuredOn: 'GitHub Actions CI/CD' },
    ],
    roles: ['ml', 'frontend', 'fullstack', 'qa'],
    limitations: [
      'Research and education only. Not a medical device and not for diagnosis or treatment.',
      'On an independent brain MRI dataset, sensitivity drops to 75.9%; its specificity cannot be measured because only 2 tumour-free images remain after de-duplication.',
    ],
    future: [],
    links: {
      live: 'https://aninditamondal303.github.io/QIHGNN-MSCA-Quantum-Inspired-Hypergraph-Neural-Network-for-Multi-Organ-Segmentation-Prognosis/',
      github: TRISCAN_REPO,
    },
    repoNote:
      'The GitHub repository is named after the research network behind the app: QIHGNN-MSCA, Quantum-Inspired Hypergraph Neural Network for Multi-Organ Segmentation and Prognosis.',
    docs: [
      { label: 'Decisions log', url: `${TRISCAN_REPO}/blob/main/docs/DECISIONS.md` },
      { label: 'Model card', url: `${TRISCAN_REPO}/blob/main/docs/MODEL_CARD.md` },
      { label: 'README: results and tests', url: `${TRISCAN_REPO}#readme` },
    ],
    screenshots: [
      img('triscan-ai', 1, 'TriScan AI home page with a brain MRI outline and measured results', 1440, 900),
      img('triscan-ai', 2, 'Analysis workbench showing a segmented scan', 1440, 900),
      img('triscan-ai', 3, 'Upload page for a brain MRI', 1440, 900),
      img('triscan-ai', 4, 'TriScan AI on a phone', 780, 1688),
    ],
  },
  {
    slug: 'naad-ai',
    title: 'Naad AI',
    tagline: 'A riyaz companion for Hindustani classical vocalists.',
    tier: 'featured',
    tint: 'coral',
    kind: 'Frontend · Audio signal processing · Product',
    summary:
      'A web and Android practice app that plays a tanpura and tabla tuned to the singer’s Sa, listens while they sing, and measures every swara: how close it sat to its place, how steadily it was held, and whether it belonged to the raag. Everything runs on the device; nothing is uploaded. It has no trained machine-learning model of its own: pitch is measured with signal processing and raag recognition is a rule-based ranking.',
    problem:
      'A vocalist’s daily riyaz rests on things a teacher cannot always be present for: holding each swara in its place against the tanpura, and moving between swaras the way the raag allows.',
    whyItMatters:
      'Practice tools for Western music measure notes against a keyboard and know nothing of Sa, raag grammar, meend or andolan. Naad AI measures singing in the terms a guru uses, relative to the singer’s own Sa, and only reports what it has actually measured.',
    contribution:
      'Individual project, built on my training in Hindustani classical vocals since childhood (15+ years). I wrote the pitch analysis, the raag data and its checks, the practice flows, the interface, the Android packaging and the tests.',
    highlights: [
      'Live tuner, Sa detection and analysis of a whole take: held-note accuracy, each swara’s position and wobble, range, breath per phrase, and a pitch line on a sargam grid.',
      'Raag rule checker that flags clearly held swaras outside the raag with their time, while short touches are allowed as in performance.',
      'Offline library of 125 raags and 23 taals, with sing-along bandish in swaralipi and side-by-side comparison of close raags.',
      'Guru-shishya mode: a guru records a phrase once, and the guide follows the guru’s own pitch line, meends included.',
      'English, Hindi and Bengali; a website, an installable offline web app and an Android app from one codebase.',
      'Optional written feedback: a small Node.js / Express server passes only the measured numbers to an external language model, which comments on them without inventing new numbers.',
    ],
    diagram: [
      { where: 'Phone or laptop', boxes: [{ label: 'Microphone', detail: 'AudioWorklet' }] },
      { where: 'Web Worker', boxes: [{ label: 'Pitch every 10 ms', detail: 'McLeod pitch method' }] },
      { boxes: [{ label: 'Held notes & phrases', detail: '½ semitone for 0.25 s; 0.3 s silence' }] },
      {
        boxes: [
          { label: 'Relative to Sa', detail: 'saved or detected' },
          { label: 'Raag checks', detail: 'rules, ornaments, ranking' },
        ],
      },
      { where: 'React', boxes: [{ label: 'Pitch line & scores', detail: 'saved on the device' }] },
    ],
    architecture: [
      'The microphone is read through an AudioWorklet, and analysis runs in a Web Worker so the interface stays responsive.',
      'Pitch is measured every 10 ms between 60 and 1100 Hz with the McLeod pitch method; frames below −45 dB or jumps over 150 cents are treated as breaks.',
      'Stretches within half a semitone for at least 0.25 s become held notes; a silence of 0.3 s or more ends a phrase.',
      'Each held note is placed relative to the singer’s Sa, checked against the raag’s swaras, and oscillations are measured as andolan or gamak.',
      'Results are drawn as a pitch line on a sargam grid and kept on the device; share links carry measurements and the pitch line, never audio.',
      'The same React app is published as a website, an offline web app and, through Capacitor, an Android app.',
    ],
    stack: [
      'React',
      'TypeScript',
      'Vite',
      'Web Audio API',
      'AudioWorklet',
      'Web Workers',
      'Node.js / Express',
      'Capacitor (Android)',
      'Vitest',
      'Puppeteer',
      'GitHub Actions',
    ],
    stackNotes: [
      {
        tech: 'McLeod pitch method (MPM)',
        why: 'On the same 40-singer dataset, MPM put 92.0% of frames within 20 cents against 84.3% for the common YIN method.',
      },
      {
        tech: 'Web Audio API + AudioWorklet',
        why: 'Reads the microphone and plays the tanpura and tabla with tight timing.',
      },
      { tech: 'Web Worker', why: 'Runs the analysis off the main thread so the interface never stalls while singing.' },
      { tech: 'Capacitor', why: 'Publishes the same app as an Android app, with native daily riyaz notifications.' },
      { tech: 'Recorded tanpura and tabla', why: 'Real recordings retuned to the singer’s Sa, not synthesis.' },
      {
        tech: 'Node.js / Express',
        why: 'A small server for the optional written feedback, which forwards only measured numbers to a configurable language-model service.',
      },
    ],
    decisions: [
      {
        title: 'Measured, not guessed',
        text: 'Every number on screen comes from the recording. When something cannot be measured reliably, the app shows “–” instead.',
      },
      {
        title: 'Authority stays with the guru',
        text: 'Raag facts follow established references and are marked for a guru’s review; compositions written for the app are labelled as such.',
      },
      {
        title: 'Private by default',
        text: 'Analysis runs on the device. A guru’s phrase travels as a pitch line, so no recording leaves the guru’s device.',
      },
    ],
    challenges: [
      {
        title: 'Timing that survives a locked phone',
        text: 'While the app is visible, sound goes straight to the speakers for tight timing. When the screen locks, the same sound is routed through a media element, so the phone keeps playing it and shows lock-screen controls.',
      },
      {
        title: 'Raags that share the same notes',
        text: 'Some raags use identical swaras and differ only in phrasing, so the recogniser names them together instead of guessing between them.',
      },
      {
        title: 'Deciding when a note is really sung',
        text: 'A frame counts as voiced at a clarity of 0.85, or 0.6 when it continues a voiced line; an out-of-raag swara is flagged only if held for 0.4 s, so short touches allowed in performance are not punished.',
      },
    ],
    testing: {
      summary:
        'Unit tests and end-to-end flows run in GitHub Actions on every push; accuracy is measured with separate, reproducible benchmarks.',
      suites: [
        {
          name: 'Unit tests (Vitest)',
          detail:
            'Pitch detection and voicing; held notes, phrases and the rule check; raag data consistency (every composition’s swaras belong to its raag); scoring, sharing, the weekly report, raag comparison and guru phrases.',
        },
        {
          name: 'End to end (Puppeteer, Chrome)',
          detail: 'Drives the real site at desktop and phone sizes and fails on any page error.',
        },
        {
          name: 'Accuracy benchmarks',
          detail:
            'Synthetic pitch and Sa benchmarks in CI; a real-voice workflow scores pitch against a public dataset with pitch marked by musicians; raag recognition on labelled recordings.',
        },
      ],
    },
    metrics: [
      {
        value: '92.0%',
        label: 'Sung frames within ±20 cents (median error 2.8 cents)',
        measuredOn: 'Public dataset: 40 solo singers, 13.6 min, pitch marked by musicians',
      },
      {
        value: '22 / 27',
        label: 'Raags recognised first (26 of 27 in the top three)',
        measuredOn: '27 short recordings, matched against all 125 raags',
      },
      { value: '100', label: 'Lighthouse accessibility score', measuredOn: 'Lighthouse, mobile' },
      {
        value: '860+',
        label: 'Unit tests (Vitest), all passing, plus end-to-end flows in Chrome',
        measuredOn: 'Full test suite in GitHub Actions',
      },
    ],
    roles: ['frontend', 'fullstack', 'product', 'qa'],
    limitations: [
      'The public real-voice dataset is not Hindustani singing; evaluation on Hindustani riyaz recordings is still being collected.',
      'Raag recognition is much weaker on concert recordings with accompaniment (16 of 96 first).',
    ],
    future: [
      'A review of the raag notes by a guru, and of the Hindi and Bengali text by native speakers.',
      'Evaluation on riyaz recordings of Hindustani vocalists.',
      'Tanpura recordings tuned to Ma and Ni for raags without Pa.',
    ],
    links: {
      live: 'https://aninditamondal303.github.io/NaadAI/',
      github: `${GH}/NaadAI`,
      android: `${GH}/NaadAI/releases/latest/download/naad-ai.apk`,
    },
    docs: [
      { label: 'Case study: method and accuracy', url: `${GH}/NaadAI/blob/main/docs/case-study.md` },
      { label: 'How it works (in the app)', url: 'https://aninditamondal303.github.io/NaadAI/#how-it-works' },
    ],
    demo: {
      src: `${import.meta.env.BASE_URL}images/projects/naad-ai/demo.mp4`,
      poster: `${import.meta.env.BASE_URL}images/projects/naad-ai/demo-poster.webp`,
      width: 300,
      height: 650,
      caption:
        'Screen recording from the repository: running the demo analysis on a phone, from the record screen to the take summary.',
    },
    screenshots: [
      img('naad-ai', 2, 'Naad AI Today screen: the riyaz plan and the raags for this hour', 1440, 900),
      img(
        'naad-ai',
        1,
        'Analysis of a sung take on a phone, with the in-tune gauge and the pitch line on the swaras',
        780,
        1688,
      ),
      img('naad-ai', 3, 'Comparing two close raags, Marwa and Puriya', 1440, 900),
      img('naad-ai', 4, 'Raag library on a phone', 780, 1688),
      img('naad-ai', 5, 'Riyaz with tanpura and taal on a phone', 780, 1688),
    ],
    todo: [
      'Shown as 860+ to match the resume (861). Latest full run counted 886 (commit 010b9e9, 20 Nov 2026); docs/case-study.md still says 440+.',
    ],
  },
  {
    slug: 'api-sentinel',
    title: 'API Sentinel',
    tagline: 'Catch breaking API changes before they reach production.',
    tier: 'prominent',
    tint: 'plum',
    kind: 'Full-stack · Backend · APIs',
    summary:
      'A full-stack platform that compares two versions of an OpenAPI specification and reports which changes would break existing clients. It also reviews a single specification for security hygiene and generates a runnable pytest contract-test suite. Results are stored per project, so a team has a history of what changed between versions and why a release passed or failed.',
    problem:
      'Renaming a path parameter, making a query parameter required or narrowing a response type all look harmless in a pull request, but each can break clients that already depend on the API. These problems are usually found by the consumers, after the release.',
    whyItMatters:
      'OpenAPI specifications already describe the contract precisely, so the comparison can be automated. API Sentinel does it deterministically, explains every finding, and turns the result into a pass/fail release decision against a severity threshold the team chooses.',
    contribution:
      'Individual project. I designed and built all three services, the database schema and migrations, the Docker and Render deployment, and the test suites.',
    highlights: [
      '73 deterministic rules: 55 compatibility, 4 security-regression and 14 hygiene rules. Every finding has a severity, the affected endpoint, a JSON-pointer location, before and after values, impact and remediation.',
      'A pass/fail release decision against each project’s policy: a severity threshold and an optional rule to fail on findings that need manual review.',
      'Spring Boot REST API with JWT authentication, per-user data isolation (another user’s resources return 404) and Flyway migrations.',
      'Contract-test generation: the UI shows which operations are covered and why others are skipped, previews each file, and downloads the exact ZIP the analyzer produced.',
      'Scan history, filters, JSON report download and a dashboard computed from the database.',
    ],
    diagram: [
      { where: 'Browser', boxes: [{ label: 'React app', detail: 'TypeScript, TanStack Query' }] },
      { where: 'Same origin', boxes: [{ label: 'nginx', detail: 'serves the app, proxies /api' }] },
      { where: 'Java 21', boxes: [{ label: 'Spring Boot API', detail: 'JWT, validation, orchestration' }] },
      {
        where: 'Internal only',
        boxes: [
          { label: 'PostgreSQL', detail: 'JPA, Flyway migrations' },
          { label: 'FastAPI analyzer', detail: 'Python, 73 rules' },
        ],
      },
    ],
    architecture: [
      'The browser loads the React app from nginx, which also reverse-proxies /api/* to the backend, so the browser talks to one origin and no CORS configuration is needed.',
      'The Spring Boot backend authenticates the user (JWT), checks each upload (5 MB limit, UTF-8, duplicate labels, duplicate content by SHA-256) and stores it in PostgreSQL.',
      'The backend asks the Python FastAPI analyzer, over an internal network with a shared token, to validate the specification and run the rules. The analyzer is never exposed to the browser.',
      'A scan is committed as RUNNING before the analyzer is called, then completed with the decision, summary counts and every finding, or marked FAILED.',
      'Locally, everything starts with one Docker Compose command. The hosted demo runs on Render (a static site, and one container with the backend and the analyzer) with a Neon PostgreSQL database.',
    ],
    stack: [
      'Java 21',
      'Spring Boot',
      'Spring Security',
      'Spring Data JPA',
      'Python',
      'FastAPI',
      'React',
      'TypeScript',
      'PostgreSQL',
      'Flyway',
      'Docker Compose',
      'nginx',
      'Testcontainers',
      'pytest',
    ],
    stackNotes: [
      {
        tech: 'Spring Boot (Web MVC, Security, OAuth2 resource server, Data JPA, Validation, Actuator)',
        why: 'Authentication with HS256 JWTs, persistence, validation, health checks and orchestration of the analyzer.',
      },
      {
        tech: 'Python FastAPI analyzer',
        why: 'All analysis lives in one place; it validates specifications with openapi-spec-validator, and its own API is a committed OpenAPI contract.',
      },
      {
        tech: 'PostgreSQL + Flyway',
        why: 'Projects, specifications, scans and findings in versioned, migrated tables.',
      },
      {
        tech: 'nginx as a same-origin proxy',
        why: 'Avoids CORS and keeps the analyzer and database off the browser’s network path.',
      },
      {
        tech: 'Testcontainers',
        why: 'Backend tests run against real PostgreSQL and the real analyzer image instead of mocks.',
      },
      {
        tech: 'Docker Compose / Render',
        why: 'Four services start with one command locally; render.yaml deploys the hosted demo.',
      },
    ],
    decisions: [
      {
        title: 'Rules live in one place',
        text: 'All analysis is in the Python analyzer; the Java backend orchestrates, persists and authorizes. Even the dashboard’s breaking-change total is the analyzer’s own count.',
      },
      {
        title: 'A committed contract between services',
        text: 'The analyzer’s internal API is described in an OpenAPI file in the repository, and a test fails if the code and the contract drift apart.',
      },
      {
        title: 'Deterministic output',
        text: 'The same two specifications always produce the same findings, in the same order, with stable fingerprints, so results can be compared over time.',
      },
    ],
    challenges: [
      {
        title: 'Judging changes from the client’s side',
        text: 'The same schema change means different things in a request and a response. A request property that becomes required breaks existing callers; in a response the risky change is a property that is no longer guaranteed. The comparison is direction-aware for this reason.',
      },
      {
        title: 'A slow service must not block the database',
        text: 'A scan is committed as RUNNING before the analyzer is called and completed or marked FAILED afterwards, so a slow analyzer never holds a database connection. Timeouts return 504, 502 or 503 without leaking internal details.',
      },
    ],
    testing: {
      summary: 'Each component has a script that runs its full suite inside Docker and writes a log.',
      suites: [
        {
          name: 'Analyzer: 372 tests (pytest, Hypothesis)',
          detail:
            'Rule-by-rule unit tests, property-based tests, real-world fixture specifications, the internal HTTP API, and a drift test against the committed contract; ruff and mypy clean.',
        },
        {
          name: 'Backend: 54 tests (JUnit 5, Testcontainers)',
          detail:
            'Integration tests against a real PostgreSQL 18 container and the real analyzer image: authentication and token tampering, per-user isolation, uploads, scans, dashboard figures checked against SQL, and analyzer timeouts and errors.',
        },
        {
          name: 'Frontend: 43 tests (Vitest, Testing Library, MSW)',
          detail:
            'API client and error handling, session expiry, login, dashboard data, empty and error states, uploads, contract-test downloads.',
        },
        {
          name: 'Full stack: 47 checks',
          detail: 'End-to-end checks against the running stack, including cross-user isolation and proxy restrictions.',
        },
      ],
    },
    metrics: [
      {
        value: '469',
        label: 'Automated tests across Python, Java and React',
        measuredOn: '372 analyzer, 54 backend, 43 frontend',
      },
      {
        value: '73',
        label: 'Deterministic analysis rules',
        measuredOn: '55 compatibility, 4 security-regression, 14 hygiene',
      },
      {
        value: '47 / 47',
        label: 'End-to-end checks passed against the running stack',
        measuredOn: 'scripts/demo-backend.ps1',
      },
    ],
    roles: ['backend', 'fullstack', 'qa', 'devops'],
    limitations: [
      'Security checks are specification-level only: it reads what the OpenAPI document declares and is not a penetration test.',
      'No refresh tokens, password reset or account management yet; scans run synchronously.',
      'Login rate limiting is in memory, so it resets on restart.',
    ],
    future: [
      'A reusable GitHub Action that comments compatibility results on pull requests.',
      'Asynchronous scans with a job queue and progress updates.',
      'httpOnly cookie sessions with CSRF protection and refresh tokens.',
      'Comparing specifications directly from a Git repository or URL.',
      'Automated end-to-end browser tests.',
    ],
    links: {
      live: 'https://api-sentinel-app.onrender.com/',
      liveNote: 'Hosted demo on Render.',
      github: `${GH}/API-Sentinel`,
    },
    docs: [
      { label: 'Deployment guide', url: `${GH}/API-Sentinel/blob/main/docs/DEPLOYMENT.md` },
      { label: 'Analyzer API contract', url: `${GH}/API-Sentinel/blob/main/contracts/analyzer-api.openapi.json` },
      { label: 'README: design decisions and tests', url: `${GH}/API-Sentinel#readme` },
    ],
    screenshots: [
      img(
        'api-sentinel',
        1,
        'API Sentinel compatibility scan: a failed release decision with findings grouped by severity',
        800,
        600,
      ),
      img('api-sentinel', 2, 'A single finding with before and after values, impact and remediation', 800, 600),
      img('api-sentinel', 3, 'Security review of a single specification', 800, 600),
      img('api-sentinel', 4, 'Generated pytest contract tests, previewed before download', 800, 600),
      img('api-sentinel', 5, 'API Sentinel landing page', 800, 606),
    ],
    todo: ['README update drafted (api-sentinel-readme.diff); awaiting approval.'],
  },
];

export const largeFeatures = projects.filter((p) => p.tier === 'flagship' || p.tier === 'featured');
export const otherProjects = projects.filter((p) => p.tier === 'prominent' || p.tier === 'more');
export const projectNumber = (slug: string) => String(projects.findIndex((p) => p.slug === slug) + 1).padStart(2, '0');
