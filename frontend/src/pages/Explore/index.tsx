import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Film, AlertCircle } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { MovieCard } from '@/components/movies/MovieCard';
import { MovieCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useDiscoverMovies, useSearchMovies, useGenres } from '@/hooks/useMovies';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useDebounce } from '@/hooks/useDebounce';

const SORT_OPTIONS = [
  { value: 'popularity.desc',   label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc',  label: 'Oldest First' },
  { value: 'revenue.desc',      label: 'Highest Grossing' },
];

const YEARS = Array.from({ length: 35 }, (_, i) => {
  const y = 2024 - i;
  return { value: String(y), label: String(y) };
});

const RATING_OPTIONS = [
  { value: '',  label: 'Any rating' },
  { value: '9', label: '9+ Exceptional' },
  { value: '8', label: '8+ Excellent' },
  { value: '7', label: '7+ Great' },
  { value: '6', label: '6+ Good' },
];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query,  setQuery]  = useState(searchParams.get('q') ?? '');
  const [genre,  setGenre]  = useState(searchParams.get('genre') ?? '');
  const [year,   setYear]   = useState(searchParams.get('year') ?? '');
  const [rating, setRating] = useState(searchParams.get('rating') ?? '');
  const [sort,   setSort]   = useState(searchParams.get('sort') ?? 'popularity.desc');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 400);
  const isSearchMode   = debouncedQuery.trim().length > 0;
  const hasFilters      = !!(genre || year || rating || (sort && sort !== 'popularity.desc'));

  const { data: genresData } = useGenres();
  const genreOptions = useMemo(
    () => (genresData ?? []).map((g) => ({ value: String(g.id), label: g.name })),
    [genresData]
  );

  // Sync to URL
  useEffect(() => {
    const p: Record<string, string> = {};
    if (query)  p.q = query;
    if (genre)  p.genre = genre;
    if (year)   p.year  = year;
    if (rating) p.rating = rating;
    if (sort !== 'popularity.desc') p.sort = sort;
    setSearchParams(p, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, genre, year, rating, sort]);

  const searchResult = useSearchMovies(debouncedQuery, 1);
  const discoverResult = useDiscoverMovies({
    genre: genre || undefined,
    year: year || undefined,
    minRating: rating || undefined,
    sortBy: sort,
  });

  const { data, isLoading, error } = isSearchMode ? searchResult : discoverResult;
  const movies = data?.results ?? [];

  const { watchlistIds, toggle } = useWatchlist();

  const tmdbUnconfigured = (error as Error | null)?.message?.includes('TMDB');

  const clearFilters = () => { setGenre(''); setYear(''); setRating(''); setSort('popularity.desc'); };
  const activeGenreLabel = genreOptions.find((g) => g.value === genre)?.label;

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-semibold text-[var(--text-primary)] mb-1">Explore</h1>
        <p className="text-[var(--text-secondary)] text-sm">Search and discover films across every genre and era.</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies by title…"
          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 text-sm transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          disabled={isSearchMode}
          className={[
            'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors',
            isSearchMode ? 'opacity-40 cursor-not-allowed border-[var(--border)] text-[var(--text-secondary)]' :
            filtersOpen
              ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)]'
              : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] bg-[var(--bg-elevated)]',
          ].join(' ')}
        >
          <SlidersHorizontal size={14} />
          Filters
          {hasFilters && (
            <span className="w-4 h-4 rounded-full bg-[var(--accent)] text-[var(--bg-main)] text-[9px] font-bold flex items-center justify-center">!</span>
          )}
        </button>

        {isSearchMode && (
          <Badge variant="accent">
            Searching: "{debouncedQuery}"
            <button onClick={() => setQuery('')} aria-label="Clear search"><X size={10} /></button>
          </Badge>
        )}
        {!isSearchMode && activeGenreLabel && (
          <Badge variant="accent">{activeGenreLabel}<button onClick={() => setGenre('')} aria-label="Remove genre filter"><X size={10} /></button></Badge>
        )}
        {!isSearchMode && year && (
          <Badge variant="accent">{year}<button onClick={() => setYear('')} aria-label="Remove year filter"><X size={10} /></button></Badge>
        )}
        {!isSearchMode && rating && (
          <Badge variant="accent">{rating}+<button onClick={() => setRating('')} aria-label="Remove rating filter"><X size={10} /></button></Badge>
        )}
        {!isSearchMode && hasFilters && (
          <button onClick={clearFilters} className="text-xs text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors">Clear all</button>
        )}

        <div className="ml-auto hidden sm:block">
          <Select
            options={SORT_OPTIONS}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            disabled={isSearchMode}
            className="text-xs h-9 min-w-[160px]"
          />
        </div>
      </div>

      {/* Expanded filters */}
      <AnimatePresence>
        {filtersOpen && !isSearchMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] grid grid-cols-2 md:grid-cols-4 gap-4 overflow-hidden"
          >
            <Select label="Genre"     options={genreOptions} placeholder="All genres" value={genre}  onChange={(e) => setGenre(e.target.value)} />
            <Select label="Year"      options={YEARS}        placeholder="Any year"    value={year}   onChange={(e) => setYear(e.target.value)} />
            <Select label="Min Rating" options={RATING_OPTIONS} value={rating} onChange={(e) => setRating(e.target.value)} />
            <Select label="Sort By"   options={SORT_OPTIONS} value={sort}    onChange={(e) => setSort(e.target.value)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* TMDB not configured */}
      {tmdbUnconfigured && (
        <div className="mb-8 p-4 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-muted)] flex items-center gap-3">
          <AlertCircle size={16} className="text-[var(--accent)] shrink-0" />
          <p className="text-xs text-[var(--text-secondary)]">
            <span className="text-[var(--accent)] font-medium">TMDB not configured.</span>{' '}
            Set <code className="font-mono bg-[var(--bg-main)] px-1 py-0.5 rounded">TMDB_API_READ_ACCESS_TOKEN</code> in{' '}
            <code className="font-mono bg-[var(--bg-main)] px-1 py-0.5 rounded">backend/.env</code> to see real results.
          </p>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
          {Array.from({ length: 21 }).map((_, i) => <MovieCardSkeleton key={i} />)}
        </div>
      ) : error && !tmdbUnconfigured ? (
        <EmptyState
          icon={<AlertCircle size={22} />}
          title="Something went wrong"
          description="We couldn't load movies right now. Please try again."
        />
      ) : movies.length === 0 ? (
        <EmptyState
          icon={<Film size={22} />}
          title={isSearchMode ? 'No movies found' : 'No results'}
          description={isSearchMode ? `No results for "${debouncedQuery}". Try a different title.` : 'Try adjusting your filters.'}
        />
      ) : (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
          {movies.map((movie, i) => (
            <motion.div key={movie.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}>
              <MovieCard movie={movie} onWatchlistToggle={toggle} isInWatchlist={watchlistIds.has(movie.id)} priority={i < 7} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
