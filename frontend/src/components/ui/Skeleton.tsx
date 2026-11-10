import React from 'react';

interface SkeletonProps { className?: string; rounded?: boolean; }

export function Skeleton({ className = '', rounded = false }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={['skeleton', rounded ? 'rounded-full' : 'rounded', className].join(' ')}
    />
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      <Skeleton className="aspect-poster w-full rounded-xl" />
      <Skeleton className="h-3.5 w-4/5" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full" style={{ minHeight: '75vh' }}>
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute bottom-20 left-10 md:left-16 flex flex-col gap-4 max-w-xl">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-12 w-80" />
        <Skeleton className="h-4 w-96 max-w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
        <div className="flex gap-3 mt-2">
          <Skeleton className="h-11 w-36 rounded-lg" />
          <Skeleton className="h-11 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <Skeleton className="h-6 w-32 mb-8" />
      <div className="flex flex-col md:flex-row gap-8">
        <Skeleton className="w-56 aspect-poster rounded-xl shrink-0" />
        <div className="flex flex-col gap-4 flex-1 pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-2 mt-1">
            {[1,2,3].map(i => <Skeleton key={i} className="h-6 w-20 rounded-full" />)}
          </div>
          <Skeleton className="h-20 w-full mt-2" />
          <div className="flex gap-3 mt-2">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-36 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CastCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Skeleton className="w-20 h-20 rounded-full" rounded />
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-2.5 w-14" />
    </div>
  );
}
