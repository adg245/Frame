import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] mt-auto">
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex flex-col gap-3 max-w-xs">
            <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded border border-[var(--accent)] flex items-center justify-center">
                <Film size={12} className="text-[var(--accent)]" />
              </div>
              <span className="font-display text-lg font-semibold text-[var(--text-primary)]">FRAME</span>
            </Link>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              A cinematic movie discovery and watching experience.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-1">Discover</span>
              {[{ label: 'Explore', to: ROUTES.EXPLORE }, { label: 'Watchlist', to: ROUTES.WATCHLIST }, { label: 'Collections', to: ROUTES.COLLECTIONS }].map(l => (
                <Link key={l.to} to={l.to} className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">{l.label}</Link>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-1">Account</span>
              {[{ label: 'Profile', to: ROUTES.PROFILE }, { label: 'Settings', to: ROUTES.SETTINGS }, { label: 'Sign In', to: ROUTES.LOGIN }].map(l => (
                <Link key={l.to} to={l.to} className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-xs text-[var(--text-muted)]">&copy; {new Date().getFullYear()} FRAME. All rights reserved.</p>
          <p className="text-xs text-[var(--text-muted)]">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div>
      </div>
    </footer>
  );
}
