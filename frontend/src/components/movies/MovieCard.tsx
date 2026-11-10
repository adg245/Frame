import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, Play, Star } from 'lucide-react';
import { tmdbImage, formatYear } from '@/utils/tmdb';
import { buildRoute } from '@/lib/routes';
import type { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
  onWatchlistToggle?: (movie: Movie) => void;
  isInWatchlist?: boolean;
  priority?: boolean;
}

function PosterFallback({ title }: { title: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 bg-[var(--bg-elevated)]">
      <div className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center">
        <span className="font-display text-lg text-[var(--accent)]">{title.charAt(0)}</span>
      </div>
      <span className="text-xs text-[var(--text-muted)] text-center line-clamp-3 leading-relaxed">{title}</span>
    </div>
  );
}

export function MovieCard({ movie, onWatchlistToggle, isInWatchlist = false, priority = false }: MovieCardProps) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const posterUrl = tmdbImage.poster(movie.poster_path, 'w342');
  const year = formatYear(movie.release_date);
  const rating = movie.vote_average?.toFixed(1) ?? '—';

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative flex flex-col"
    >
      <Link to={buildRoute.movie(movie.id)} className="block">
        <div className="relative aspect-poster rounded-xl overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border)] mb-3">
          {posterUrl && !imgError ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading={priority ? 'eager' : 'lazy'}
              onError={() => setImgError(true)}
            />
          ) : (
            <PosterFallback title={movie.title} />
          )}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-theme-md">
              <Play size={18} fill="var(--bg-main)" stroke="none" />
            </div>
          </motion.div>
          {movie.vote_average > 0 && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm">
              <Star size={9} fill="var(--rating-gold)" stroke="none" />
              <span className="text-[10px] font-bold text-white tabular-nums">{rating}</span>
            </div>
          )}
          {onWatchlistToggle && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onWatchlistToggle(movie); }}
              aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
              className={[
                'absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center',
                'transition-all duration-150 opacity-0 group-hover:opacity-100',
                isInWatchlist
                  ? 'bg-[var(--accent)] text-[var(--bg-main)]'
                  : 'bg-black/70 backdrop-blur-sm text-white hover:bg-[var(--accent)] hover:text-[var(--bg-main)]',
              ].join(' ')}
            >
              {isInWatchlist ? <BookmarkCheck size={12} strokeWidth={2.5} /> : <Bookmark size={12} strokeWidth={2.5} />}
            </button>
          )}
        </div>
      </Link>
      <div className="flex flex-col gap-0.5 px-0.5">
        <Link
          to={buildRoute.movie(movie.id)}
          className="text-sm font-medium text-[var(--text-primary)] line-clamp-1 hover:text-[var(--accent)] transition-colors"
        >
          {movie.title}
        </Link>
        <span className="text-xs text-[var(--text-muted)]">{year}</span>
      </div>
    </motion.div>
  );
}

export function MovieCardHorizontal({ movie, onWatchlistToggle, isInWatchlist = false }: MovieCardProps) {
  const [imgError, setImgError] = useState(false);
  const posterUrl = tmdbImage.poster(movie.poster_path, 'w185');
  const year = formatYear(movie.release_date);

  return (
    <div className="flex gap-3 items-center p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)]/40 transition-colors group">
      <Link to={buildRoute.movie(movie.id)} className="shrink-0">
        <div className="w-12 aspect-poster rounded-lg overflow-hidden bg-[var(--bg-elevated)]">
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
          <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1 hover:text-[var(--accent)] transition-colors">{movie.title}</p>
        </Link>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-[var(--text-muted)]">{year}</span>
          {movie.vote_average > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-[var(--text-secondary)]">
              <Star size={9} fill="var(--rating-gold)" stroke="none" />
              {movie.vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>
      {onWatchlistToggle && (
        <button onClick={() => onWatchlistToggle(movie)} aria-label="Toggle watchlist" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors p-1">
          {isInWatchlist ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
        </button>
      )}
    </div>
  );
}
