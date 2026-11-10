import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Film, Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/utils/authValidation';
import { ROUTES } from '@/lib/routes';

export default function ForgotPasswordPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const { requestPasswordReset, isConfigured } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setFormError(null);
    const { error } = await requestPasswordReset(values.email);
    if (error) { setFormError(error); return; }
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-main)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl border border-[var(--accent)] flex items-center justify-center bg-[var(--accent-muted)]">
              <Film size={18} className="text-[var(--accent)]" />
            </div>
            <span className="font-display text-2xl font-semibold text-[var(--text-primary)]">FRAME</span>
          </Link>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Reset password</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1.5">We'll send you a reset link.</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-7">
          {sent ? (
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={22} className="text-[var(--success)]" />
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)] mb-1">Check your inbox</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                If an account exists for that email, a reset link is on its way.
              </p>
            </div>
          ) : (
            <>
              {!isConfigured && (
                <div className="rounded-xl border border-[var(--accent)]/20 bg-[var(--accent-muted)] p-3.5 mb-5">
                  <p className="text-xs font-medium text-[var(--accent)]">Supabase not configured</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">Password reset requires Supabase to be set up.</p>
                </div>
              )}
              {formError && (
                <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-3.5 mb-5 flex items-start gap-2.5">
                  <AlertCircle size={14} className="text-[var(--danger)] mt-0.5 shrink-0" />
                  <p className="text-xs text-[var(--danger)]">{formError}</p>
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-medium text-[var(--text-secondary)]">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      disabled={!isConfigured || isSubmitting}
                      className={[
                        'w-full pl-9 pr-3 py-2.5 h-10 rounded-lg border bg-[var(--input-bg)] text-sm text-[var(--text-primary)]',
                        'placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/30',
                        errors.email ? 'border-[var(--danger)]' : 'border-[var(--border)] focus:border-[var(--accent)]',
                        (!isConfigured || isSubmitting) ? 'opacity-50 cursor-not-allowed' : '',
                      ].join(' ')}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-[var(--danger)]">{errors.email.message}</p>}
                </div>
                <Button type="submit" fullWidth loading={isSubmitting} disabled={!isConfigured}>Send reset link</Button>
              </form>
            </>
          )}

          <Link to={ROUTES.LOGIN} className="mt-5 flex items-center justify-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
            <ArrowLeft size={12} /> Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
