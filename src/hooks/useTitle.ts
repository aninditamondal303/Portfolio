import { useEffect } from 'react';

export function useTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · Anindita Mondal` : 'A Little About Me · Anindita Mondal';
  }, [title]);
}
