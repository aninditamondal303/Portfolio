import { useEffect, useState } from 'react';

/**
 * Tactile sound. Muted by default; the visitor turns it on with one tap
 * (which also satisfies the browser's rule that audio starts from a gesture).
 * Every sound is synthesised on the spot: plucks are tuned to the notes of
 * Raag Yaman above a Sa of C♯ (277.18 Hz), so a run of plucks is always in
 * the raag. Nothing is downloaded.
 */
const EVT = 'sound:change';
const KEY = 'aam-sound';
const SA = 277.18;
/** Yaman: Sa Re Ga Ma♯ Pa Dha Ni, in semitones above Sa. */
const YAMAN = [0, 2, 4, 6, 7, 9, 11];

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function audio() {
  if (!ctx) {
    const AC =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export const soundOn = () => document.documentElement.classList.contains('sound');

export function setSound(on: boolean) {
  document.documentElement.classList.toggle('sound', on);
  if (on) audio();
  try {
    sessionStorage.setItem(KEY, on ? '1' : '0');
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVT, { detail: on }));
  if (on) play('pluck', 0.6, 4);
}
export const toggleSound = () => setSound(!soundOn());

export function useSound() {
  const [on, setOn] = useState(() => typeof document !== 'undefined' && soundOn());
  useEffect(() => {
    const h = (e: Event) => setOn((e as CustomEvent<boolean>).detail);
    window.addEventListener(EVT, h);
    return () => window.removeEventListener(EVT, h);
  }, []);
  return on;
}

const freq = (degree: number) => {
  const oct = Math.floor(degree / 7);
  const d = ((degree % 7) + 7) % 7;
  return SA * Math.pow(2, oct + YAMAN[d] / 12);
};

/**
 * Play a sound if sound is on. `strength` 0..1 scales loudness; `degree` picks
 * a note of the raag (0 = Sa; negative goes down an octave).
 */
export function play(kind: 'pluck' | 'thud' | 'swell' | 'gliss' | 'tick', strength = 0.5, degree = 0) {
  if (!soundOn()) return;
  const c = audio();
  if (!c || !master) return;
  const t = c.currentTime;
  const g = c.createGain();
  g.connect(master);
  const s = Math.max(0.05, Math.min(1, strength));
  if (kind === 'pluck' || kind === 'tick') {
    const o = c.createOscillator();
    o.type = kind === 'tick' ? 'square' : 'triangle';
    o.frequency.value = freq(degree);
    const dur = kind === 'tick' ? 0.05 : 0.9;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime((kind === 'tick' ? 0.15 : 0.6) * s, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    o.start(t);
    o.stop(t + dur + 0.05);
  } else if (kind === 'thud') {
    const o = c.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(SA / 2, t);
    o.frequency.exponentialRampToValueAtTime(SA / 6, t + 0.25);
    g.gain.setValueAtTime(0.9 * s, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    o.connect(g);
    o.start(t);
    o.stop(t + 0.35);
  } else if (kind === 'swell') {
    // A short tanpura-like swell: Pa and Sa together.
    [SA / 2, (SA / 2) * 1.5, SA].forEach((f, i) => {
      const o = c.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = f;
      const gg = c.createGain();
      gg.gain.setValueAtTime(0.0001, t);
      gg.gain.exponentialRampToValueAtTime(0.12 * s, t + 0.25 + i * 0.05);
      gg.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
      const lp = c.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 900;
      o.connect(lp).connect(gg).connect(master!);
      o.start(t);
      o.stop(t + 1.9);
    });
  } else if (kind === 'gliss') {
    // A meend: a glide from Sa up to Pa.
    const o = c.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(SA, t);
    o.frequency.exponentialRampToValueAtTime(SA * 1.5, t + 0.45);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.4 * s, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    o.connect(g);
    o.start(t);
    o.stop(t + 0.75);
  }
}

export function restoreSound() {
  // Sound always starts muted on a fresh load: browsers need a gesture first.
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
