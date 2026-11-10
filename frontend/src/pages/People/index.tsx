import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Film, AlertCircle, Calendar, MapPin } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { MovieCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { MovieCard } from '@/components/movies/MovieCard';
import { usePersonDetails, usePersonMovieCredits } from '@/hooks/usePeople';
import { useWatchlist } from '@/hooks/useWatchlist';
import { tmdbImage, formatDate } from '@/utils/tmdb';

export default function PeoplePage() {
  const { id } = useParams<{ id: string }>();
  const [imgError, setImgError] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);

  const { data: person, isLoading, error } = usePersonDetails(id);
  const { data: credits, isLoading: creditsLoading } = usePersonMovieCredits(id);
  const { watchlistIds, toggle } = useWatchlist();

  const tmdbUnconfigured = (error as Error | null)?.message?.includes('TMDB');

  const filmography = (credits?.cast ?? [])
    .slice()
    .sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));

  if (tmdbUnconfigured) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <Link to={ROUTES.EXPLORE} className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] mb-8">
          <ArrowLeft size={15} /> Back
        </Link>
        <EmptyState icon={<AlertCircle size={22} />} title="TMDB not configured" description="Set TMDB_API_READ_ACCESS_TOKEN in backend/.env to load this page." />
      </div>
    );
  }

  if (error || (!isLoading && !person)) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <Link to={ROUTES.EXPLORE} className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] mb-8">
          <ArrowLeft size={15} /> Back
        </Link>
        <EmptyState icon={<User size={22} />} title="Person not found" description="This profile may have been removed or the ID is invalid." />
      </div>
    );
  }

  const profileUrl = person ? tmdbImage.profile(person.profile_path, 'h632') : null;
  const bio = person?.biography || '';
  const bioTruncated = bio.length > 500 && !bioExpanded;

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <Link to={ROUTES.EXPLORE} className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors mb-8">
        <ArrowLeft size={15} /> Back
      </Link>

      <div className="flex flex-col sm:flex-row gap-8 mb-12">
        {/* Profile image */}
        <div className="w-40 h-52 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] shrink-0 overflow-hidden">
          {isLoading ? (
            <div className="w-full h-full skeleton" />
          ) : profileUrl && !imgError ? (
            <img src={profileUrl} alt={person?.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User size={40} className="text-[var(--text-muted)]" />
            </div>
          )}
        </div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-3 flex-1">
          {isLoading ? (
            <>
              <div className="h-9 w-64 skeleton" />
              <div className="h-4 w-32 skeleton" />
              <div className="h-20 w-full max-w-2xl skeleton mt-2" />
            </>
          ) : person ? (
            <>
              <h1 className="font-display text-4xl font-semibold text-[var(--text-primary)]">{person.name}</h1>
              <p className="text-sm text-[var(--text-secondary)]">{person.known_for_department}</p>

              <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)] mt-1">
                {person.birthday && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    Born {formatDate(person.birthday)}
                    {person.deathday && ` — Died ${formatDate(person.deathday)}`}
                  </span>
                )}
                {person.place_of_birth && (
                  <span className="flex items-center gap-1.5"><MapPin size={12} />{person.place_of_birth}</span>
                )}
              </div>

              {bio ? (
                <div className="max-w-2xl">
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {bioTruncated ? `${bio.slice(0, 500)}…` : bio}
                  </p>
                  {bio.length > 500 && (
                    <button
                      onClick={() => setBioExpanded((v) => !v)}
                      className="text-xs text-[var(--accent)] hover:underline mt-2"
                    >
                      {bioExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-muted)] italic">No biography available.</p>
              )}
            </>
          ) : null}
        </motion.div>
      </div>

      {/* Filmography */}
      <div>
        <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2">
          <Film size={18} className="text-[var(--text-muted)]" />
          Filmography
        </h2>

        {creditsLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <MovieCardSkeleton key={i} />)}
          </div>
        ) : filmography.length === 0 ? (
          <EmptyState icon={<Film size={20} />} title="No known credits" description="TMDB has no movie credits on file for this person." />
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 gap-4">
            {filmography.slice(0, 24).map((movie) => (
              <MovieCard key={movie.id} movie={movie} onWatchlistToggle={toggle} isInWatchlist={watchlistIds.has(movie.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
