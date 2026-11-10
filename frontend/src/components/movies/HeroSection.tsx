import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Info, Star, Bookmark, BookmarkCheck } from 'lucide-react';
import { tmdbImage, formatYear } from '@/utils/tmdb';
import { buildRoute } from '@/lib/routes';
import { Button } from '@/components/ui/Button';

import { HeroSkeleton } from '@/components/ui/Skeleton';
import type { Movie } from '@/types/movie';

interface HeroSectionProps {
  movie: Movie | null;
  loading?: boolean;
  isInWatchlist?: boolean;
  onWatchlistToggle?: (movie: Movie) => void;
}

export function HeroSection({ movie, loading = false, isInWatchlist = false, onWatchlistToggle }: HeroSectionProps) {
  const [imgError, setImgError] = useState(false);

  if (loading) return <HeroSkeleton />;
  if (!movie)   return null;

  const backdropUrl = tmdbImage.backdrop(movie.backdrop_path, 'w1280');
  const year        = formatYear(movie.release_date);

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '75vh' }}>
      {/* Backdrop */}
      {backdropUrl && !imgError && (
        <>
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-main)] via-[var(--bg-main)]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-transparent to-transparent" />
        </>
      )}
      {(!backdropUrl || imgError) && (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-main)]" />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-6 flex items-end" style={{ minHeight: '75vh', paddingBottom: '5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-xl"
        >
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {movie.vote_average > 0 && (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--rating-gold)]">
                <Star size={13} fill="var(--rating-gold)" stroke="none" />
                {movie.vote_average.toFixed(1)}
              </span>
            )}
            {year && <span className="text-sm text-[var(--text-secondary)]">{year}</span>}
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[var(--text-primary)] leading-tight mb-4">
            {movie.title}
          </h1>

          {/* Overview */}
          {movie.overview && (
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed line-clamp-3 mb-6 max-w-md">
              {movie.overview}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Link to={buildRoute.watch(movie.id)}>
              <Button size="lg" icon={<Play size={18} fill="currentColor" strokeWidth={0} />}>
                Watch Now
              </Button>
            </Link>
            <Link to={buildRoute.movie(movie.id)}>
              <Button size="lg" variant="secondary" icon={<Info size={17} />}>
                Details
              </Button>
            </Link>
            {onWatchlistToggle && (
              <Button
                size="lg"
                variant="ghost"
                icon={isInWatchlist ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
                onClick={() => onWatchlistToggle(movie)}
                aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                {isInWatchlist ? 'Saved' : 'Save'}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
