import React, { useState } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useSearchMovies } from '@/hooks/useMovies';
import { useDebounce } from '@/hooks/useDebounce';
import { tmdbImage, formatYear } from '@/utils/tmdb';

interface AddMovieSearchModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (tmdbMovieId: number) => void;
  existingIds: Set<number>;
  pendingId?: number | null;
}

export function AddMovieSearchModal({ open, onClose, onAdd, existingIds, pendingId }: AddMovieSearchModalProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const { data, isLoading } = useSearchMovies(debouncedQuery, 1);
  const results = data?.results ?? [];

  return (
    <Modal open={open} onClose={onClose} title="Add movies" size="lg">
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies by title…"
          className="w-full pl-9 pr-3 py-2.5 h-10 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
        />
      </div>

      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto -mx-1 px-1">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 skeleton rounded-lg" />)
        ) : query.trim().length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-8">Start typing to search for movies.</p>
        ) : results.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-8">No results for "{debouncedQuery}".</p>
        ) : (
          results.slice(0, 12).map((movie) => {
            const already = existingIds.has(movie.id);
            const isPending = pendingId === movie.id;
            const posterUrl = tmdbImage.poster(movie.poster_path, 'w92');
            return (
              <div key={movie.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors">
                <div className="w-10 aspect-poster rounded-md overflow-hidden bg-[var(--bg-elevated)] shrink-0">
                  {posterUrl && <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text-primary)] truncate">{movie.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{formatYear(movie.release_date)}</p>
                </div>
                <button
                  onClick={() => !already && onAdd(movie.id)}
                  disabled={already || isPending}
                  className={[
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                    already
                      ? 'text-[var(--success)] cursor-default'
                      : 'text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-muted)]',
                  ].join(' ')}
                  aria-label={already ? 'Already added' : 'Add to collection'}
                >
                  {already ? <Check size={15} /> : <Plus size={15} />}
                </button>
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
}
