import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { ThemeId } from '@/types/theme';
import { useAuth } from './AuthContext';
import { profileService } from '@/services/profile.service';

const STORAGE_KEY = 'frame-theme';
const DEFAULT_THEME: ThemeId = 'cinema-night';

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  resetTheme: () => void;
  syncing: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readLocalTheme(): ThemeId {
  try {
    return (localStorage.getItem(STORAGE_KEY) as ThemeId | null) ?? DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(readLocalTheme);
  const [syncing, setSyncing] = useState(false);
  const { user, loading: authLoading } = useAuth();

  // Track whether we've already restored the server theme for this sign-in,
  // so we don't re-fetch and overwrite local switches on every render.
  const restoredForUser = useRef<string | null>(null);

  const applyTheme = useCallback((t: ThemeId) => {
    document.documentElement.setAttribute('data-theme', t);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // On sign-in: restore the user's saved theme from their profile (Phase 4+).
  // On sign-out: fall back to whatever is in localStorage (guest mode).
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      restoredForUser.current = null;
      return;
    }

    if (restoredForUser.current === user.id) return;
    restoredForUser.current = user.id;

    setSyncing(true);
    profileService
      .get()
      .then((profile) => {
        if (profile.preferredTheme) {
          setThemeState(profile.preferredTheme as ThemeId);
          applyTheme(profile.preferredTheme as ThemeId);
          try { localStorage.setItem(STORAGE_KEY, profile.preferredTheme); } catch { /* noop */ }
        }
      })
      .catch(() => {
        // Backend/DB not configured yet, or request failed — keep local theme.
      })
      .finally(() => setSyncing(false));
  }, [user, authLoading, applyTheme]);

  const setTheme = useCallback((t: ThemeId) => {
    setThemeState(t);
    applyTheme(t);
    try { localStorage.setItem(STORAGE_KEY, t); } catch { /* noop */ }

    // Best-effort sync to the authenticated user's profile. Failures are
    // silent here (e.g. DB not yet configured) — localStorage remains the
    // source of truth either way, so the UI never breaks.
    if (user) {
      profileService.updateTheme(t).catch(() => { /* handled via toast in useUpdateProfileTheme elsewhere */ });
    }
  }, [applyTheme, user]);

  const resetTheme = useCallback(() => setTheme(DEFAULT_THEME), [setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resetTheme, syncing }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
