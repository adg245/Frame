import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookmarkCheck, Search, Plus, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { WatchlistItemCard } from '@/components/movies/WatchlistItemCard';
import { useWatchlist, type WatchlistResult } from '@/hooks/useWatchlist';
import { useMoviesByIds } from '@/hooks/useMovies';
import { detailToMovie } from '@/utils/tmdb';
import { ROUTES } from '@/lib/routes';
import type { WatchlistStatus } from '@/types/user';
import type { Movie } from '@/types/movie';

const STATUS_TABS: { value: WatchlistStatus | 'all'; label: string }[] = [
  { value: 'all',      label: 'All' },
  { value: 'planning', label: 'Planning' },
  { value: 'watching', label: 'Watching' },
  { value: 'watched',  label: 'Watched' },
  { value: 'on_hold',  label: 'On Hold' },
  { value: 'dropped',  label: 'Dropped' },
];

function GuestWatchlistView({ watchlist }: { watchlist: Extract<WatchlistResult, { isGuest: true }> }) {
  return (
    <>
      <div className="mb-6 p-4 rounded-xl border border-[var(--accent)]/20 bg-[var(--accent-muted)] flex items-start gap-3">
        <Lock size={15} className="text-[var(--accent)] mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">You're browsing as a guest</p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Your watchlist is saved on this device only.{' '}
            <Link to={ROUTES.LOGIN} className="text-[var(--accent)] hover:underline">Sign in</Link>{' '}
            to track status (Planning/Watching/Watched) and sync across devices.
          </p>
        </div>
      </div>

      {watchlist.entries.length === 0 ? (
        <EmptyState
          icon={<BookmarkCheck size={24} />}
          title="Your watchlist is empty"
          description="Start adding movies while browsing."
          action={<Link to={ROUTES.EXPLORE}><Button size="sm" variant="accent-outline" icon={<Plus size={14} />}>Explore Films</Button></Link>}
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {watchlist.entries.map((e) => {
            const movie: Movie = {
              id: e.id, title: e.title, poster_path: e.poster_path, release_date: e.release_date,
              vote_average: e.vote_average, overview: '', backdrop_path: null, vote_count: 0,
              genre_ids: [], original_language: 'en', popularity: 0, adult: false,
            };
            return (
              <WatchlistItemCard
                key={e.id}
                movie={movie}
                status="planning"
                onStatusChange={() => {}}
                onRemove={() => watchlist.remove(e.id)}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

function AuthedWatchlistView({ watchlist }: { watchlist: Extract<WatchlistResult, { isGuest: false }> }) {
  const [search, setSearch] = useState('');
  const tmdbIds = useMemo(() => watchlist.entries.map((e) => e.tmdbMovieId), [watchlist.entries]);
  const { movies: hydratedMovies, isLoading: moviesLoading } = useMoviesByIds(tmdbIds);

  const movieById = useMemo(() => {
    const map = new Map<number, Movie>();
    hydratedMovies.forEach((m) => map.set(m.id, detailToMovie(m)));
    return map;
  }, [hydratedMovies]);

  const filteredEntries = useMemo(() => {
    return watchlist.entries.filter((e) => {
      const movie = movieById.get(e.tmdbMovieId);
      if (!movie) return false;
      if (search && !movie.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [watchlist.entries, movieById, search]);

  const countByStatus = useMemo(() => {
    const counts: Record<WatchlistStatus, number> = { planning: 0, watching: 0, watched: 0, on_hold: 0, dropped: 0 };
    watchlist.entries.forEach((e) => { counts[e.status]++; });
    return counts;
  }, [watchlist.entries]);

  const renderEntriesForStatus = (statusFilter: WatchlistStatus | 'all') => {
    const list = statusFilter === 'all' ? filteredEntries : filteredEntries.filter((e) => e.status === statusFilter);

    if (watchlist.isLoading || moviesLoading) {
      return (
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 skeleton rounded-xl" />)}
        </div>
      );
    }

    if (list.length === 0) {
      return (
        <EmptyState
          icon={<BookmarkCheck size={24} />}
          title="Nothing here yet"
          description={statusFilter === 'all' ? 'Start adding movies to your watchlist while browsing.' : `No movies marked "${STATUS_TABS.find((t) => t.value === statusFilter)?.label}".`}
          action={<Link to={ROUTES.EXPLORE}><Button size="sm" variant="accent-outline" icon={<Plus size={14} />}>Explore Films</Button></Link>}
        />
      );
    }

    return (
      <div className="flex flex-col gap-2.5">
        {list.map((entry) => {
          const movie = movieById.get(entry.tmdbMovieId);
          if (!movie) return null;
          return (
            <WatchlistItemCard
              key={entry.id}
              movie={movie}
              status={entry.status}
              onStatusChange={(status) => watchlist.updateStatus(entry.id, status)}
              onRemove={() => watchlist.remove(entry.id)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="mb-6">
        <Input icon={<Search size={14} />} placeholder="Search your watchlist…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {STATUS_TABS.slice(1).map((tab) => (
          <div key={tab.value} className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-center">
            <p className="text-2xl font-bold text-[var(--text-primary)] font-display">{countByStatus[tab.value as WatchlistStatus]}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">{tab.label}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          {STATUS_TABS.map((tab) => <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>)}
        </TabsList>
        {STATUS_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {renderEntriesForStatus(tab.value)}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}

export default function WatchlistPage() {
  const watchlist = useWatchlist();

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold text-[var(--text-primary)] mb-1">Watchlist</h1>
          <p className="text-[var(--text-secondary)] text-sm">Track what you plan to watch, are watching, and have seen.</p>
        </div>
        <Link to={ROUTES.EXPLORE}><Button size="sm" icon={<Plus size={14} />}>Add Films</Button></Link>
      </div>

      {watchlist.isGuest
        ? <GuestWatchlistView watchlist={watchlist} />
        : <AuthedWatchlistView watchlist={watchlist} />
      }
    </div>
  );
}
