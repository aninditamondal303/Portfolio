import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Download } from 'lucide-react';
import { profile } from '../../content/profile';
import { CopyEmail } from '../../components/CopyEmail';
import { useMagnetic } from '../../hooks/pointer';
import { useTitle } from '../../hooks/useTitle';

/** The time where I am (India Standard Time), so a message can be timed well. */
function useKolkataTime() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const i = window.setInterval(() => setT(fmt()), 15000);
    return () => clearInterval(i);
  }, []);
  return t;
}

/**
 * 07 · The Exit (that isn't an ending). Visual silence after everything else:
 * white space, one address, three ways to reach me, the resume, and a door
 * back into the Infinite Room. The universe keeps going; so does the clock.
 */
export default function Contact() {
  useTitle('Contact');
  const time = useKolkataTime();
  const door = useMagnetic<HTMLAnchorElement>(18);
  return (
    <section aria-labelledby="exit-title" className="exit min-h-[calc(100svh-3.5rem)] bg-[#fbfaf7] text-[#111]">
      <div className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-[90rem] flex-col px-5 pt-16 pb-24 md:px-10 md:pt-28 md:pb-12">
        <p className="label text-[0.62rem] text-[#55534e]">07 · The Exit · it is {time} in Kolkata</p>
        <h1 id="exit-title" className="serif mt-6 max-w-3xl text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.02] italic">
          This is not the end of the universe. It is where you write to me.
        </h1>
        <a
          href={`mailto:${profile.contact.email}`}
          data-cursor="Write an email"
          className="mt-10 inline-block w-fit max-w-full text-[clamp(1.6rem,5.6vw,5.4rem)] leading-[0.95] font-semibold tracking-[-0.05em] break-all hover:underline sm:break-normal"
        >
          {profile.contact.email.split('@')[0]}
          <wbr />@{profile.contact.email.split('@')[1]}
        </a>
        <div className="mt-5">
          <CopyEmail />
        </div>
        <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-2">
          <li>
            <a href={profile.contact.linkedin} target="_blank" rel="noreferrer" className="label link-underline inline-flex min-h-11 items-center gap-1.5">
              LinkedIn <ArrowUpRight aria-hidden size={13} />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={profile.contact.github} target="_blank" rel="noreferrer" className="label link-underline inline-flex min-h-11 items-center gap-1.5">
              GitHub <ArrowUpRight aria-hidden size={13} />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={profile.contact.resume} download className="label link-underline inline-flex min-h-11 items-center gap-1.5">
              <Download aria-hidden size={13} /> Resume (PDF)
            </a>
          </li>
          <li>
            <Link to="/brief" className="label link-underline inline-flex min-h-11 items-center">
              Recruiter brief
            </Link>
          </li>
        </ul>
        <p className="mt-12 max-w-2xl leading-relaxed text-[#55534e]">{profile.openTo}</p>

        <div className="mt-auto flex items-end justify-between gap-6 pt-24">
          <p className="label max-w-xs text-[0.6rem] text-[#55534e]">
            Designed and built by {profile.name}. React, TypeScript, Canvas and SVG. Nothing here is finished.
          </p>
          <Link
            ref={door}
            to="/universe"
            viewTransition
            data-cursor="Back inside"
            className="group grid size-36 shrink-0 place-items-center rounded-full bg-[#0b0d1a] text-center text-[#dcdff5] transition-transform duration-700 hover:scale-105 md:size-44"
          >
            <span className="label px-4 text-[0.62rem] leading-relaxed">
              Return to the
              <br />
              Infinite Room
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
