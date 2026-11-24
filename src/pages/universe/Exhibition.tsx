import { Link } from 'react-router-dom';
import { projects } from '../../content/projects';
import { exhibitPath, exhibitRooms } from '../../content/sections';
import { useTitle } from '../../hooks/useTitle';
import { Lab, Sonic, System } from './Installations';

const anchors: Record<string, string> = { 'triscan-ai': 'lab', 'naad-ai': 'sonic', 'api-sentinel': 'system' };

/**
 * 05 · The Exhibition. A gallery hall in raw concrete: three wall labels
 * (the plain facts, for anyone in a hurry), then the three installations,
 * each in its own world with its own instrument. Each installation leads to
 * its full room.
 */
export default function Exhibition() {
  useTitle('The Exhibition');
  return (
    <div className="exhibition-hall">
      <section aria-labelledby="hall-title" className="grain relative overflow-hidden bg-[#d8d5ce] text-[#141414]">
        <div className="mx-auto max-w-[90rem] px-5 pt-12 pb-16 md:px-10 md:pt-16 md:pb-24">
          <p className="label text-[0.62rem]">05 · The Exhibition · three installations</p>
          <h1 id="hall-title" className="display mt-4 text-[clamp(3.4rem,11vw,11rem)] leading-[0.78] tracking-[-0.075em] uppercase">
            Every<span className="serif tracking-[-0.02em] normal-case italic">thing,</span>
            <br />
            at once
          </h1>
          <ol className="mt-14 grid gap-px bg-[#141414] md:grid-cols-3">
            {projects.map((p, i) => (
              <li key={p.slug} className="bg-[#e7e4dd] p-5">
                <p className="label text-[0.58rem]">
                  {String(i + 1).padStart(2, '0')} · {exhibitRooms[p.slug].room}
                </p>
                <h2 className="mt-2 text-[1.6rem] leading-tight font-semibold tracking-[-0.03em]">{p.title}</h2>
                <p className="mt-2 leading-snug">{p.tagline}</p>
                <p className="label mt-3 text-[0.58rem] leading-relaxed text-[#4a4741]">{p.stack.slice(0, 5).join(' · ')}</p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
                  <a href={`#${anchors[p.slug]}`} className="label link-underline min-h-10 content-center">
                    See the installation ↓
                  </a>
                  <Link to={exhibitPath(p.slug)} viewTransition className="label link-underline min-h-10 content-center">
                    Enter the room →
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <Lab />
      <Sonic />
      <System />
    </div>
  );
}
