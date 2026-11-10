import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0–10 from TMDB
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  showCount?: number;
}

export function StarRating({ rating, size = 'sm', showNumber = true, showCount }: StarRatingProps) {
  const pct = (rating / 10) * 100;
  const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 18;
  const textClass = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';

  return (
    <span className={['inline-flex items-center gap-1.5', textClass].join(' ')}>
      <Star
        size={iconSize}
        fill="var(--rating-gold)"
        stroke="none"
        style={{ color: 'var(--rating-gold)' }}
      />
      {showNumber && (
        <span className="font-semibold tabular-nums text-[var(--text-primary)]">
          {rating.toFixed(1)}
        </span>
      )}
      {showCount != null && (
        <span className="text-[var(--text-muted)]">
          ({showCount.toLocaleString()})
        </span>
      )}
    </span>
  );
}

// Circular progress-ring variant for cards
export function RatingRing({ rating, size = 48 }: { rating: number; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const pct = rating / 10;
  const dash = pct * circ;

  const color = rating >= 7 ? 'var(--success)' : rating >= 5 ? 'var(--rating-gold)' : 'var(--danger)';

  return (
    <div
      className="relative inline-flex items-center justify-center rounded-full bg-[var(--bg-main)] border border-[var(--border)]"
      style={{ width: size, height: size }}
    >
      <svg
        width={size} height={size}
        className="absolute inset-0 -rotate-90"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={3} />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="relative text-[10px] font-bold text-[var(--text-primary)] tabular-nums">
        {Math.round(pct * 100)}%
      </span>
    </div>
  );
}
