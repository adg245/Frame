import React from 'react';
import { tmdbImage } from '@/utils/tmdb';
import type { WatchProviderResult, WatchProvider } from '@/types/movie';

interface WatchProvidersProps {
  providers: WatchProviderResult | null;
  loading?: boolean;
}

function ProviderRow({ title, items }: { title: string; items: WatchProvider[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((p) => {
          const logo = tmdbImage.logo(p.logo_path, 'w92');
          return (
            <div
              key={p.provider_id}
              title={p.provider_name}
              className="w-10 h-10 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg-elevated)]"
            >
              {logo && <img src={logo} alt={p.provider_name} className="w-full h-full object-cover" loading="lazy" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WatchProviders({ providers, loading = false }: WatchProvidersProps) {
  if (loading) {
    return (
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-10 h-10 rounded-lg skeleton" />
        ))}
      </div>
    );
  }

  if (!providers || (!providers.flatrate?.length && !providers.rent?.length && !providers.buy?.length)) {
    return (
      <p className="text-xs text-[var(--text-muted)]">
        No regional availability information from TMDB for your region.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ProviderRow title="Stream" items={providers.flatrate ?? []} />
      <ProviderRow title="Rent"   items={providers.rent ?? []} />
      <ProviderRow title="Buy"    items={providers.buy ?? []} />
    </div>
  );
}
