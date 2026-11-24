import type { Role } from '../content/projects';

export const roleLabels: Record<Role, string> = {
  fullstack: 'Full-stack',
  frontend: 'Frontend',
  backend: 'Backend',
  ml: 'AI / ML',
  data: 'Data & analytics',
  qa: 'Testing & QA',
  devops: 'DevOps',
  product: 'Product & UI',
};

const order: Role[] = ['fullstack', 'frontend', 'backend', 'ml', 'data', 'qa', 'devops', 'product'];

interface Props {
  value: Role | null;
  onChange: (role: Role | null) => void;
  tone?: 'light' | 'dark';
  label?: string;
}

/** Buttons that bring the projects relevant to a role to the top. */
export default function RoleFilter({ value, onChange, tone = 'light', label = 'Looking for' }: Props) {
  const idle =
    tone === 'dark' ? 'border-ivory/40 text-ivory hover:border-ivory' : 'border-plum/30 text-plum hover:border-plum';
  const active = tone === 'dark' ? 'border-coral bg-coral text-plum' : 'border-plum bg-plum text-ivory';
  return (
    <div
      className="no-print"
      role="group"
      aria-label={`${label}: choose a role to bring the most relevant projects first`}
    >
      <p className="label mb-3 opacity-75">{label}</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={value === null}
          onClick={() => onChange(null)}
          className={`label min-h-10 border px-3 py-2 transition-colors ${value === null ? active : idle}`}
        >
          Everything
        </button>
        {order.map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={value === r}
            onClick={() => onChange(value === r ? null : r)}
            className={`label min-h-10 border px-3 py-2 transition-colors ${value === r ? active : idle}`}
          >
            {roleLabels[r]}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Stable sort: projects tagged with the role first, the rest after. */
export function sortByRole<T extends { roles: Role[] }>(items: T[], role: Role | null): T[] {
  if (!role) return items;
  return [...items].sort((a, b) => Number(b.roles.includes(role)) - Number(a.roles.includes(role)));
}
