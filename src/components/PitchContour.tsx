import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Mic, MicOff, Pause, Play } from 'lucide-react';
import { pitch, type PhraseNote } from '../content/pitch';
import { prefersReducedMotion } from '../hooks/motion';

type Point = { t: number; c: number; a: number } | null; // null = a break (breath); a = loudness 0..1
interface Held {
  t0: number;
  t1: number;
  swara: string;
  cents: number;
}

/** Small deterministic wobble so held notes look sung, not drawn with a ruler. */
function drift(t: number) {
  return 5 * Math.sin(t * 5.3) + 3 * Math.sin(t * 11.1 + 1.7) + 1.6 * Math.sin(t * 23.7 + 0.4);
}

/** Loudness swells at the start of a breath and tapers towards its end. */
function swell(k: number) {
  return Math.min(1, k / 0.12) * (0.55 + 0.45 * Math.cos(Math.PI * Math.max(0, k - 0.15) * 0.9));
}

const STEP = 0.015;

function build(phrase: PhraseNote[]): { points: Point[]; held: Held[]; total: number } {
  const raw: (Point & object)[][] = [[]];
  const held: Held[] = [];
  let t = 0;
  phrase.forEach((n, i) => {
    const next = phrase[i + 1];
    const start = t;
    const afterGlide = i > 0 && !!phrase[i - 1].glide;
    for (let s = 0; s < n.hold; s += STEP) {
      // A small scoop into a note that starts a breath, and a slight sag as it is held.
      const scoop = !afterGlide && s < 0.09 ? -38 * Math.pow(1 - s / 0.09, 2) : 0;
      const sag = -6 * Math.sin((Math.PI * s) / n.hold);
      const and = n.andolan ? n.andolan * Math.sin((s / 0.5) * Math.PI * 2) * Math.min(1, s / 0.35) : 0;
      raw[raw.length - 1].push({ t: t + s, c: n.cents + scoop + sag + and + drift(t + s), a: 0 });
    }
    held.push({ t0: start, t1: t + n.hold, swara: n.swara, cents: n.cents });
    t += n.hold;
    if (next && n.glide) {
      // Meend: eased glide with a little overshoot that settles into the next note.
      for (let s = 0; s < n.glide; s += STEP) {
        const k = s / n.glide;
        const e = 0.5 - 0.5 * Math.cos(Math.PI * k);
        const over = Math.sin(Math.PI * k) * Math.sign(next.cents - n.cents) * 10 * k;
        raw[raw.length - 1].push({
          t: t + s,
          c: n.cents + (next.cents - n.cents) * e + over + drift(t + s) * 0.4,
          a: 0,
        });
      }
      t += n.glide;
    }
    if (n.rest) {
      raw.push([]);
      t += n.rest;
    }
  });
  const points: Point[] = [];
  raw.forEach((seg, si) => {
    const t0 = seg[0]?.t ?? 0;
    const t1 = seg[seg.length - 1]?.t ?? 1;
    seg.forEach((p) => points.push({ ...p, a: swell((p.t - t0) / Math.max(0.01, t1 - t0)) }));
    if (si < raw.length - 1) points.push(null);
  });
  return { points, held, total: t };
}

function fromRecording(rec: [number, number][]) {
  const points: Point[] = [];
  rec.forEach(([t, c], i) => {
    if (i > 0 && t - rec[i - 1][0] > 0.1) points.push(null);
    points.push({ t, c, a: 0.7 });
  });
  return { points, held: [] as Held[], total: rec.length ? rec[rec.length - 1][0] : 1 };
}

const C_MIN = -620;

const NAMES = ['Sa', 're', 'Re', 'ga', 'Ga', 'Ma', 'Ma\u2032', 'Pa', 'dha', 'Dha', 'ni', 'Ni'];

/** Pitch of a short buffer by normalised autocorrelation, or null if unvoiced. */
function detectPitch(buf: Float32Array, rate: number): number | null {
  let rms = 0;
  for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
  if (Math.sqrt(rms / buf.length) < 0.012) return null;
  const minLag = Math.floor(rate / 1100);
  const maxLag = Math.min(Math.floor(rate / 70), buf.length - 1);
  let best = -1;
  let bestLag = -1;
  const corr = new Float32Array(maxLag + 2);
  for (let lag = minLag; lag <= maxLag + 1; lag++) {
    let c = 0,
      e1 = 0,
      e2 = 0;
    for (let i = 0; i + lag < buf.length; i++) {
      c += buf[i] * buf[i + lag];
      e1 += buf[i] * buf[i];
      e2 += buf[i + lag] * buf[i + lag];
    }
    corr[lag] = c / Math.sqrt(e1 * e2 || 1);
  }
  // First strong peak (avoids octave errors from later peaks).
  for (let lag = minLag + 1; lag <= maxLag; lag++) {
    if (corr[lag] > 0.82 && corr[lag] >= corr[lag - 1] && corr[lag] >= corr[lag + 1]) {
      best = corr[lag];
      bestLag = lag;
      break;
    }
  }
  if (bestLag < 0 || best < 0.82) return null;
  const a = corr[bestLag - 1],
    b = corr[bestLag],
    c = corr[bestLag + 1];
  const shift = (a - c) / (2 * (a - 2 * b + c) || 1);
  return rate / (bestLag + shift);
}

/** Cents from Sa, folded into the grid's range so any octave lands on it. */
function foldCents(c: number) {
  while (c < -650) c += 1200;
  while (c > 850) c -= 1200;
  return c;
}

function noteName(c: number) {
  const semis = Math.round(c / 100);
  const off = Math.round(c - semis * 100);
  const name = NAMES[((semis % 12) + 12) % 12];
  return `${name} ${off >= 0 ? '+' : '\u2212'}${Math.abs(off)}\u00a2`;
}
const C_MAX = 820;

interface Props {
  /** Width of the readable caption column. */
  className?: string;
  id?: string;
}

/**
 * A sung phrase drawn as a pitch contour on a sargam grid, in the style of
 * Naad AI's analysis view. The play button synthesises the phrase on request;
 * nothing plays on its own.
 */
export default function PitchContour({ className = '', id = 'pitch-contour' }: Props) {
  const data = useMemo(() => (pitch.recorded.length ? fromRecording(pitch.recorded) : build(pitch.phrase)), []);

  // Lay the graph out at its real on-screen width, so text stays a readable
  // size on phones. Measured before paint, so nothing shifts.
  const wrapRef = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(1200);
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setW(Math.max(280, Math.round(el.clientWidth)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const narrow = W < 640;
  const H = narrow ? 250 : W < 1000 ? 310 : 360;
  const PAD_L = narrow ? 42 : 64;
  const PAD_R = narrow ? 8 : 24;
  const PAD_T = 36;
  const PAD_B = 40;
  const band = narrow ? 6 : 9;
  const x = (t: number) => PAD_L + (t / data.total) * (W - PAD_L - PAD_R);
  const y = (c: number) => PAD_T + ((C_MAX - c) / (C_MAX - C_MIN)) * (H - PAD_T - PAD_B);

  const d = useMemo(() => {
    let out = '';
    let pen = false;
    for (const p of data.points) {
      if (!p) {
        pen = false;
        continue;
      }
      out += `${pen ? 'L' : 'M'}${x(p.t).toFixed(1)} ${y(p.c).toFixed(1)}`;
      pen = true;
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, W, H]);

  // The breath ribbon: thickness follows loudness.
  const ribbons = useMemo(() => {
    const segs: { t: number; c: number; a: number }[][] = [[]];
    data.points.forEach((p) => (p ? segs[segs.length - 1].push(p) : segs.push([])));
    return segs
      .filter((sg) => sg.length > 1)
      .map((sg) => {
        const top = sg.map((p) => `${x(p.t).toFixed(1)},${(y(p.c) - 2 - p.a * band).toFixed(1)}`);
        const bot = sg
          .slice()
          .reverse()
          .map((p) => `${x(p.t).toFixed(1)},${(y(p.c) + 2 + p.a * band).toFixed(1)}`);
        return [...top, ...bot].join(' ');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, W, H]);

  // Draw-in when scrolled into view.
  const svgRef = useRef<SVGSVGElement>(null);
  // With reduced motion (or no IntersectionObserver) the line is simply drawn.
  const [drawn, setDrawn] = useState(() => prefersReducedMotion() || typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    const el = svgRef.current;
    if (!el || drawn) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Hover readout.
  const [hover, setHover] = useState<number | null>(null);
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const vx = ((e.clientX - r.left) / r.width) * W;
    const t = ((vx - PAD_L) / (W - PAD_L - PAD_R)) * data.total;
    setHover(t >= 0 && t <= data.total ? t : null);
  };
  const heldAt = (t: number) => data.held.find((h) => t >= h.t0 && t <= h.t1);

  // Playback.
  const [playhead, setPlayhead] = useState<number | null>(null);
  const audio = useRef<{ ctx: AudioContext; raf: number } | null>(null);
  const stop = () => {
    if (!audio.current) return;
    cancelAnimationFrame(audio.current.raf);
    audio.current.ctx.close().catch(() => {});
    audio.current = null;
    setPlayhead(null);
  };
  useEffect(() => stop, []);

  // Live singing: microphone \u2192 pitch \u2192 a live line on the same grid.
  // Runs only after a click; audio stays in the browser and is never stored.
  const [live, setLive] = useState<{ d: string; note: string; t: number } | null>(null);
  const [micError, setMicError] = useState('');
  const mic = useRef<{ ctx: AudioContext; stream: MediaStream; raf: number } | null>(null);
  const stopMic = () => {
    if (!mic.current) return;
    cancelAnimationFrame(mic.current.raf);
    mic.current.stream.getTracks().forEach((t) => t.stop());
    mic.current.ctx.close().catch(() => {});
    mic.current = null;
    setLive(null);
  };
  useEffect(() => stopMic, []);
  const sing = async () => {
    if (mic.current) return stopMic();
    stop();
    setMicError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      src.connect(analyser);
      const buf = new Float32Array(analyser.fftSize);
      const start = performance.now();
      let pts: { t: number; c: number | null }[] = [];
      let lastSweep = 0;
      let note = '\u2013';
      let frame = 0;
      const tick = () => {
        if (!mic.current) return;
        const t = ((performance.now() - start) / 1000) % data.total;
        const sweep = Math.floor((performance.now() - start) / 1000 / data.total);
        if (sweep !== lastSweep) {
          pts = [];
          lastSweep = sweep;
        }
        frame += 1;
        if (frame % 2) {
          mic.current.raf = requestAnimationFrame(tick);
          return;
        }
        analyser.getFloatTimeDomainData(buf);
        const f = detectPitch(buf, ctx.sampleRate);
        const c = f ? foldCents(1200 * Math.log2(f / pitch.saHz)) : null;
        if (c !== null) note = noteName(c);
        pts.push({ t, c });
        let path = '';
        let pen = false;
        for (const p of pts) {
          if (p.c === null) {
            pen = false;
            continue;
          }
          path += `${pen ? 'L' : 'M'}${x(p.t).toFixed(1)} ${y(p.c).toFixed(1)}`;
          pen = true;
        }
        setLive({ d: path, note: c === null ? '\u2013' : note, t });
        mic.current.raf = requestAnimationFrame(tick);
      };
      mic.current = { ctx, stream, raf: requestAnimationFrame(tick) };
    } catch {
      setMicError('Microphone not available or permission declined.');
    }
  };

  // The command palette can ask for the phrase to play.
  useEffect(() => {
    const h = () => {
      if (!audio.current) play();
    };
    window.addEventListener('pitch:play', h);
    return () => window.removeEventListener('pitch:play', h);
  });

  const play = () => {
    if (audio.current) return stop();
    const Ctx =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const t0 = ctx.currentTime + 0.12;
    const end = t0 + data.total;

    const master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);

    // A quiet drone on Sa and Pa, like a tanpura in the background.
    [pitch.saHz / 2, (pitch.saHz / 2) * Math.pow(2, 7 / 12)].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0, t0 - 0.1);
      g.gain.linearRampToValueAtTime(i ? 0.025 : 0.04, t0 + 0.6);
      g.gain.setValueAtTime(i ? 0.025 : 0.04, end);
      g.gain.linearRampToValueAtTime(0, end + 0.8);
      o.connect(g).connect(master);
      o.start(t0 - 0.1);
      o.stop(end + 0.9);
    });

    // The voice: a soft triangle wave following the contour.
    const voice = ctx.createOscillator();
    voice.type = 'triangle';
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1400;
    const vg = ctx.createGain();
    vg.gain.setValueAtTime(0, t0);
    let prevVoiced = false;
    for (const p of data.points) {
      if (!p) {
        prevVoiced = false;
        continue;
      }
      const at = t0 + p.t;
      voice.frequency.setValueAtTime(pitch.saHz * Math.pow(2, p.c / 1200), at);
      if (!prevVoiced) {
        vg.gain.setValueAtTime(0, at);
        vg.gain.linearRampToValueAtTime(0.16, at + 0.05);
      }
      prevVoiced = true;
    }
    // Fade at each breath and at the end.
    let tPrev: number | null = null;
    for (const p of data.points) {
      if (!p && tPrev !== null) {
        vg.gain.setValueAtTime(0.16, t0 + tPrev - 0.06);
        vg.gain.linearRampToValueAtTime(0, t0 + tPrev);
      }
      tPrev = p ? p.t : tPrev;
    }
    vg.gain.setValueAtTime(0.16, end - 0.25);
    vg.gain.linearRampToValueAtTime(0, end + 0.1);
    voice.connect(filter).connect(vg).connect(master);
    voice.start(t0);
    voice.stop(end + 0.2);

    const tick = () => {
      if (!audio.current) return;
      const t = ctx.currentTime - t0;
      if (t > data.total + 0.6) return stop();
      setPlayhead(Math.max(0, Math.min(t, data.total)));
      audio.current.raf = requestAnimationFrame(tick);
    };
    audio.current = { ctx, raf: requestAnimationFrame(tick) };
  };

  const marker = playhead ?? hover;
  const markerHeld = marker !== null ? heldAt(marker) : undefined;
  const seconds = Math.round(data.total);

  return (
    <figure className={className} aria-labelledby={`${id}-cap`}>
      <div ref={wrapRef}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          className="block h-auto w-full overflow-visible"
          role="img"
          aria-labelledby={`${id}-title`}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          <title id={`${id}-title`}>
            {`${pitch.title}, drawn as a vocal pitch contour on a sargam grid: ${pitch.phrase.map((n) => n.swara).join(' ')}.`}
          </title>

          {/* Sargam grid */}
          <g aria-hidden>
            {pitch.grid
              // On narrow screens, show only the swaras this phrase uses.
              .filter((g) => !narrow || g.cents === 0 || pitch.phrase.some((n) => n.cents === g.cents))
              .map((g) => (
                <g key={g.swara + g.cents}>
                  <line
                    x1={PAD_L - 8}
                    x2={W - PAD_R}
                    y1={y(g.cents)}
                    y2={y(g.cents)}
                    stroke="currentColor"
                    strokeOpacity={g.cents === 0 ? 0.42 : 0.13}
                    strokeWidth={g.cents === 0 ? 1.2 : 1}
                    strokeDasharray={g.cents === 0 ? undefined : '2 6'}
                  />
                  <text
                    x={PAD_L - (narrow ? 10 : 16)}
                    y={y(g.cents) + 4}
                    textAnchor="end"
                    className="fill-current font-mono"
                    fontSize={narrow ? 11 : 13}
                    opacity={g.cents === 0 ? 0.9 : 0.6}
                  >
                    {g.swara}
                  </text>
                  {g.mandra && (
                    <circle
                      cx={PAD_L - 16 - (g.swara.length * 7.8) / 2}
                      cy={y(g.cents) + 10}
                      r={1.6}
                      className="fill-current"
                      opacity={0.55}
                    />
                  )}
                </g>
              ))}
            {/* Time ticks */}
            {Array.from({ length: seconds + 1 }, (_, s) => s)
              .filter((s) => !narrow || s % 2 === 0)
              .map((s) => (
                <text
                  key={s}
                  x={x(s)}
                  y={H - 10}
                  textAnchor="middle"
                  className="fill-current font-mono"
                  fontSize={11}
                  opacity={0.45}
                >
                  {s}s
                </text>
              ))}
          </g>

          {/* Contour: breath ribbon, a paper-coloured halo (keeps it legible over a
            photograph) and the sung line itself. Revealed left to right. */}
          <g
            style={{
              clipPath: drawn ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
              transition: 'clip-path 3s cubic-bezier(.65,0,.35,1)',
            }}
          >
            {ribbons.map((pts, i) => (
              <polygon key={i} points={pts} fill="var(--color-lavender)" opacity={0.42} />
            ))}
            <path
              d={d}
              fill="none"
              stroke="var(--color-paper)"
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.8}
            />
            <path
              d={d}
              fill="none"
              stroke="var(--color-coral-deep)"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Swara names above held notes */}
          <g aria-hidden style={{ opacity: drawn ? 1 : 0, transition: 'opacity .8s 1.6s' }}>
            {data.held.map((h, i) => (
              <text
                key={i}
                x={x((h.t0 + h.t1) / 2)}
                y={y(h.cents) - 16}
                textAnchor="middle"
                fontSize={narrow ? 12 : 14}
                className="fill-current font-serif italic"
                opacity={markerHeld === h ? 1 : 0.75}
              >
                {h.swara}
              </text>
            ))}
          </g>

          {marker !== null && (
            <g aria-hidden>
              <line
                x1={x(marker)}
                x2={x(marker)}
                y1={PAD_T - 10}
                y2={H - PAD_B + 6}
                stroke="var(--color-plum)"
                strokeOpacity={0.5}
              />
              {markerHeld && (
                <text x={x(marker) + 8} y={PAD_T - 14} fontSize={12} className="fill-current font-mono">
                  {markerHeld.swara} · {markerHeld.cents >= 0 ? '+' : ''}
                  {markerHeld.cents}¢ from Sa
                </text>
              )}
            </g>
          )}
          {live && (
            <g aria-hidden>
              <line
                x1={x(live.t)}
                x2={x(live.t)}
                y1={PAD_T - 10}
                y2={H - PAD_B + 6}
                stroke="var(--color-plum)"
                strokeOpacity={0.35}
              />
              <path
                d={live.d}
                fill="none"
                stroke="var(--color-plum)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}
        </svg>
      </div>

      <figcaption id={`${id}-cap`} className="mt-4 flex flex-wrap items-start justify-between gap-x-8 gap-y-3">
        <span className="label max-w-xl leading-relaxed text-ink-muted">
          Fig. 02 · {pitch.title}, drawn as a vocal pitch contour on a sargam grid, the way Naad AI shows a sung take.
          Swaras: {pitch.phrase.map((n) => n.swara).join(' ')}.
        </span>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {live && (
            <span className="label min-w-28 text-plum" aria-live="off">
              You: {live.note}
            </span>
          )}
          <button
            type="button"
            onClick={sing}
            data-cursor={live ? 'Stop listening' : 'Use your microphone'}
            aria-pressed={!!live}
            className={`label inline-flex min-h-10 items-center gap-2 border px-4 transition-colors ${live ? 'border-plum bg-plum text-ivory' : 'border-plum hover:bg-plum hover:text-ivory'}`}
          >
            {live ? <MicOff aria-hidden size={14} /> : <Mic aria-hidden size={14} />}
            {live ? 'Stop listening' : 'Sing into it'}
          </button>
          <button
            type="button"
            onClick={play}
            data-cursor={playhead !== null ? 'Stop' : 'Play'}
            className="label inline-flex min-h-10 shrink-0 items-center gap-2 border border-plum px-4 transition-colors hover:bg-plum hover:text-ivory"
            aria-label={
              playhead !== null ? 'Stop the phrase' : `Play the phrase, a synthesised tone of about ${seconds} seconds`
            }
          >
            {playhead !== null ? <Pause aria-hidden size={14} /> : <Play aria-hidden size={14} />}
            {playhead !== null ? 'Stop' : 'Play the phrase'}
          </button>
        </div>
        <p className="w-full text-sm text-ink-muted" aria-live="polite">
          {micError ||
            (live
              ? 'Listening. Your voice is drawn on the grid against Sa = C\u266f; any octave lands on the grid. Nothing is recorded or uploaded.'
              : '')}
        </p>
      </figcaption>
    </figure>
  );
}
