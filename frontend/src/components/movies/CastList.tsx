import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { tmdbImage } from '@/utils/tmdb';
import { buildRoute } from '@/lib/routes';
import { CastCardSkeleton } from '@/components/ui/Skeleton';
import type { CastMember } from '@/types/movie';

interface CastListProps {
  cast: CastMember[];
  loading?: boolean;
  limit?: number;
}

function CastCard({ member }: { member: CastMember }) {
  const [imgError, setImgError] = useState(false);
  const profileUrl = tmdbImage.profile(member.profile_path, 'w185');

  return (
    <Link to={buildRoute.people(member.id)} className="flex flex-col items-center gap-2 text-center group shrink-0 w-20">
      <div className="w-20 h-20 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--bg-elevated)] group-hover:border-[var(--accent)] transition-colors">
        {profileUrl && !imgError ? (
          <img src={profileUrl} alt={member.name} className="w-full h-full object-cover" loading="lazy" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User size={22} className="text-[var(--text-muted)]" />
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-medium text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--accent)] transition-colors">{member.name}</p>
        <p className="text-[10px] text-[var(--text-muted)] line-clamp-1">{member.character}</p>
      </div>
    </Link>
  );
}

export function CastList({ cast, loading = false, limit = 12 }: CastListProps) {
  if (loading) {
    return (
      <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="shrink-0 w-20"><CastCardSkeleton /></div>
        ))}
      </div>
    );
  }

  if (cast.length === 0) return null;

  return (
    <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-2">
      {cast.slice(0, limit).map((member) => (
        <CastCard key={`${member.id}-${member.character}`} member={member} />
      ))}
    </div>
  );
}
