'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { Theme } from '@/types/user.types';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'planets',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [theme, setThemeState] = useState<Theme>('planets');

  useEffect(() => {
    // Load from session preferences or localStorage
    const saved = (session?.user as any)?.preferences?.theme ||
      localStorage.getItem('orbyn-theme') as Theme || 'planets';
    setThemeState(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, [session]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('orbyn-theme', t);
    document.documentElement.setAttribute('data-theme', t);
    // Persist to DB if logged in
    if (session?.user) {
      fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: t }),
      }).catch(() => {});
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
