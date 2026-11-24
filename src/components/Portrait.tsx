import { profile } from '../content/profile';

/**
 * A fixed 4:5 frame. Empty for now; when profile.portrait is set the image
 * fills the same box, so nothing around it moves.
 */
export default function Portrait({ className = '' }: { className?: string }) {
  const p = profile.portrait;
  const tick = 'absolute size-4 border-plum/60';
  return (
    <figure className={className}>
      <figcaption className="label mb-4 flex justify-between text-ink-muted">
        <span>Fig. 01</span>
        <span>{p ? profile.name : 'Photograph to come'}</span>
      </figcaption>
      <div className="relative aspect-[4/5] w-full">
        {p ? (
          <img
            src={p.src}
            alt={p.alt}
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className="absolute inset-0 bg-gold-pale"
            style={{
              backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 14px, rgba(41,35,47,.05) 14px 15px)',
            }}
            aria-hidden
          >
            <div className="absolute inset-5 border border-plum/15" />
            <p className="label absolute top-8 left-8 text-ink-muted">
              Portrait
              <br />
              <span className="opacity-70">Reserved</span>
            </p>
            <p className="serif absolute top-5 right-8 text-7xl text-plum/15 italic">am</p>
          </div>
        )}
        {/* Crop marks, kept with or without a photo */}
        <span aria-hidden className={`${tick} -top-2 -left-2 border-t border-l`} />
        <span aria-hidden className={`${tick} -top-2 -right-2 border-t border-r`} />
        <span aria-hidden className={`${tick} -bottom-2 -left-2 border-b border-l`} />
        <span aria-hidden className={`${tick} -right-2 -bottom-2 border-r border-b`} />
      </div>
    </figure>
  );
}
