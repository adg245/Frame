import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Film } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md"
      >
        {/* Film-frame graphic */}
        <div className="relative mx-auto mb-8 w-24 h-24">
          <div className="w-24 h-24 rounded-2xl border-2 border-[var(--border)] flex items-center justify-center bg-[var(--bg-secondary)]">
            <Film size={36} className="text-[var(--text-muted)]" />
          </div>
          <div className="absolute -top-1 -left-1 w-4 h-4 rounded-sm border border-[var(--accent)] bg-[var(--bg-main)]" />
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-sm border border-[var(--accent)] bg-[var(--bg-main)]" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-sm border border-[var(--accent)] bg-[var(--bg-main)]" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-sm border border-[var(--accent)] bg-[var(--bg-main)]" />
        </div>

        <p className="font-display text-6xl font-semibold mb-3" style={{ color: 'var(--accent)' }}>404</p>
        <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-3">Scene not found</h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
          This page doesn't exist or may have been removed. Let's get you back to the main feature.
        </p>
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
        >
          <ArrowLeft size={15} />
          Back to home
        </Link>
      </motion.div>
    </div>
  );
}
