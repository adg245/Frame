import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from '@/components/ui/Skeleton';
import type { Movie } from '@/types/movie';

interface MovieCarouselProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  loading?: boolean;
  error?: string;
  onWatchlistToggle?: (movie: Movie) => void;
  watchlistIds?: Set<number>;
  viewAllHref?: string;
}

const SCROLL_AMOUNT = 320;

export function MovieCarousel({
  title, subtitle, movies, loading = false, error,
  onWatchlistToggle, watchlistIds = new Set(), viewAllHref,
}: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT, behavior: 'smooth' });
  };

  return (
    <section className="relative">
      {/* Header */}
      <div className="flex items-end justify-between mb-5 px-0">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">{title}</h2>
          {subtitle && <p className="text-sm text-[var(--text-secondary)] mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <a href={viewAllHref} className="text-xs font-medium text-[var(--accent)] hover:underline mr-2">
              View all
            </a>
          )}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-6 text-center">
          <p className="text-sm text-[var(--danger)]">{error}</p>
        </div>
      )}

      {/* Scroll container */}
      {!error && (
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="shrink-0" style={{ width: 148, scrollSnapAlign: 'start' }}>
                  <MovieCardSkeleton />
                </div>
              ))
            : movies.map((movie, i) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  className="shrink-0"
                  style={{ width: 148, scrollSnapAlign: 'start' }}
                >
                  <MovieCard
                    movie={movie}
                    onWatchlistToggle={onWatchlistToggle}
                    isInWatchlist={watchlistIds.has(movie.id)}
                    priority={i < 4}
                  />
                </motion.div>
              ))
          }
        </div>
      )}
    </section>
  );
}
