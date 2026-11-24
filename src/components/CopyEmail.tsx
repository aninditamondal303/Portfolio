import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { profile } from '../content/profile';

export function CopyEmail({ className = '' }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.contact.email}`;
    }
  };
  return (
    <button type="button" onClick={copy} className={`label inline-flex min-h-10 items-center gap-2 ${className}`}>
      {copied ? <Check aria-hidden size={14} /> : <Copy aria-hidden size={14} />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
    </button>
  );
}
