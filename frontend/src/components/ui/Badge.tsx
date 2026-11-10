import React from 'react';

type BadgeVariant = 'default' | 'accent' | 'success' | 'danger' | 'outline' | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default:  'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]',
  accent:   'bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)]/30',
  success:  'bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/30',
  danger:   'bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/30',
  outline:  'bg-transparent border border-[var(--border)] text-[var(--text-secondary)]',
  muted:    'bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-transparent',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs rounded-md',
  md: 'px-2.5 py-1 text-xs rounded-md',
};

export function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  return (
    <span className={[
      'inline-flex items-center gap-1 font-medium',
      badgeVariants[variant],
      badgeSizes[size],
      className,
    ].join(' ')}>
      {children}
    </span>
  );
}
