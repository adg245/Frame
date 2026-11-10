import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { tmdbImage, formatYear } from '@/utils/tmdb';
import { buildRoute } from '@/lib/routes';
import { Select } from '@/components/ui/Select';
import type { Movie } from '@/types/movie';
import type { WatchlistStatus } from '@/types/user';

const STATUS_OPTIONS: { value: WatchlistStatus; label: string }[] = [
  { value: 'planning', label: 'Planning to Watch' },
  { value: 'watching', label: 'Watching' },
  { value: 'watched',  label: 'Watched' },
  { value: 'on_hold',  label: 'On Hold' },
  { value: 'dropped',  label: 'Dropped' },
];

interface WatchlistItemCardProps {
  movie: Movie;
  status: WatchlistStatus;
  onStatusChange: (status: WatchlistStatus) => void;
  onRemove: () => void;
}

export function WatchlistItemCard({ movie, status, onStatusChange, onRemove }: WatchlistItemCardProps) {
  const [imgError, setImgError] = useState(false);
  const posterUrl = tmdbImage.poster(movie.poster_path, 'w185');

  return (
    <div className="flex gap-4 items-center p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)]/30 transition-colors">
      <Link to={buildRoute.movie(movie.id)} className="shrink-0">
        <div className="w-14 aspect-poster rounded-lg overflow-hidden bg-[var(--bg-elevated)]">
          {posterUrl && !imgError ? (
            <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" loading="lazy" onError={() => setImgError(true)} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-sm text-[var(--accent)]">{movie.title.charAt(0)}</span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={buildRoute.movie(movie.id)}>
          <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1 hover:text-[var(--accent)] transition-colors">
            {movie.title}
          </p>
        </Link>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{formatYear(movie.release_date)}</p>
      </div>

      <div className="w-40 shrink-0 hidden sm:block">
        <Select
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => onStatusChange(e.target.value as WatchlistStatus)}
          className="h-9 text-xs"
        />
      </div>

      <button
        onClick={onRemove}
        aria-label="Remove from watchlist"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors shrink-0"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
