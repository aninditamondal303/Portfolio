import { Link } from 'react-router-dom';
import { useTitle } from '../hooks/useTitle';

export default function NotFound() {
  useTitle('Page not found');
  return (
    <section className="grain bg-ivory">
      <div className="mx-auto max-w-[90rem] px-5 py-24 md:px-10 md:py-40">
        <p className="label text-ink-muted">404</p>
        <h1 className="display mt-4 text-[clamp(3.5rem,10vw,9rem)]">
          This page <em className="text-coral-deep">isn’t here.</em>
        </h1>
        <p className="mt-6 max-w-xl text-xl">The link may be old, or the address may have a typo.</p>
        <div className="mt-10 flex flex-wrap gap-6">
          <Link to="/universe" className="label link-underline">
            Back to the start
          </Link>
          <Link to="/exhibition" className="label link-underline">
            See the work
          </Link>
          <Link to="/brief" className="label link-underline">
            Quick view
          </Link>
        </div>
      </div>
    </section>
  );
}
