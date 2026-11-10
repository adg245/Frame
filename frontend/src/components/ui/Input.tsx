import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onIconClick?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, iconPosition = 'left', onIconClick, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-[var(--text-secondary)]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <button
              type="button"
              onClick={onIconClick}
              className={[
                'absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]',
                onIconClick ? 'cursor-pointer hover:text-[var(--text-primary)] transition-colors' : 'pointer-events-none',
              ].join(' ')}
              tabIndex={onIconClick ? 0 : -1}
              aria-hidden={!onIconClick}
            >
              {icon}
            </button>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full rounded-lg border bg-[var(--input-bg)] text-[var(--text-primary)]',
              'placeholder:text-[var(--text-muted)] text-sm transition-colors duration-150',
              'focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30',
              error ? 'border-[var(--danger)]' : 'border-[var(--border)]',
              icon && iconPosition === 'left'  ? 'pl-10'  : 'pl-3',
              icon && iconPosition === 'right' ? 'pr-10' : 'pr-3',
              'py-2.5 h-10',
              className,
            ].join(' ')}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <button
              type="button"
              onClick={onIconClick}
              className={[
                'absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]',
                onIconClick ? 'cursor-pointer hover:text-[var(--text-primary)] transition-colors' : 'pointer-events-none',
              ].join(' ')}
              tabIndex={onIconClick ? 0 : -1}
            >
              {icon}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
        {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// Textarea variant
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-[var(--text-secondary)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={[
            'w-full rounded-lg border bg-[var(--input-bg)] text-[var(--text-primary)]',
            'placeholder:text-[var(--text-muted)] text-sm transition-colors duration-150 resize-none',
            'focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30',
            'px-3 py-2.5',
            error ? 'border-[var(--danger)]' : 'border-[var(--border)]',
            className,
          ].join(' ')}
          {...props}
        />
        {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
        {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
