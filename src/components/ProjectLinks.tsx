import { exhibitPath } from '../content/sections';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Code, Smartphone } from 'lucide-react';
import type { Project } from '../content/projects';

export default function ProjectLinks({ project, showCaseStudy = true }: { project: Project; showCaseStudy?: boolean }) {
  const item = 'label inline-flex min-h-10 items-center gap-1.5 link-underline';
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-1">
      {showCaseStudy && (
        <li>
          <Link to={exhibitPath(project.slug)} viewTransition data-cursor="Open case study" className={item}>
            Case study <ArrowRight aria-hidden size={14} />
          </Link>
        </li>
      )}
      {project.links.live && (
        <li>
          <a href={project.links.live} className={item} target="_blank" rel="noreferrer">
            Try it live <ArrowUpRight aria-hidden size={14} />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      )}
      {project.links.android && (
        <li>
          <a href={project.links.android} className={item}>
            <Smartphone aria-hidden size={14} /> Android app
          </a>
        </li>
      )}
      <li>
        <a href={project.links.github} className={item} target="_blank" rel="noreferrer">
          <Code aria-hidden size={14} /> Code <span className="sr-only">on GitHub (opens in a new tab)</span>
        </a>
      </li>
    </ul>
  );
}
