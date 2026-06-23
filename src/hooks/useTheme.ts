import { useState, useCallback } from 'react';
import type { Theme } from '../types/theme';

const STORAGE_KEY = 'sb-theme';

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'stackbrix' || stored === 'stackbrix-dark') return stored;
  } catch {
    // localStorage unavailable
  }
  return 'stackbrix';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next: Theme = t === 'stackbrix' ? 'stackbrix-dark' : 'stackbrix';
      try { localStorage.setItem(STORAGE_KEY, next); } catch { /* noop */ }
      return next;
    });
  }, []);

  return { theme, toggleTheme, isDark: theme === 'stackbrix-dark' };
}
