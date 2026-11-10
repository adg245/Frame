import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={['flex flex-col items-center justify-center text-center py-20 px-6', className].join(' ')}>
      {icon && (
        <div className="w-14 h-14 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] flex items-center justify-center mb-5 text-[var(--text-muted)]">
          {icon}
        </div>
      )}
      <h3 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
      {description && <p className="text-sm text-[var(--text-secondary)] max-w-xs leading-relaxed mb-6">{description}</p>}
      {action}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function ErrorState({ title = 'Something went wrong', description, action }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-12 h-12 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 flex items-center justify-center mb-4">
        <span className="text-[var(--danger)] text-xl">!</span>
      </div>
      <h3 className="font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
      {description && <p className="text-sm text-[var(--text-secondary)] max-w-xs mb-5">{description}</p>}
      {action}
    </div>
  );
}
