import { Link } from 'react-router-dom';
import { profile } from '../content/profile';

export default function Footer() {
  return (
    <footer className="no-print bg-plum text-ivory on-dark">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-4 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-10">
        <p className="serif text-3xl italic">A little about me.</p>
        <div className="label flex flex-wrap gap-x-6 gap-y-2 text-ivory/75">
          <span>Designed and built by {profile.name}</span>
          <span>React · TypeScript · Vite</span>
          <Link to="/brief" className="link-underline text-ivory">
            Recruiter brief
          </Link>
        </div>
      </div>
    </footer>
  );
}
