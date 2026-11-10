import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Film, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/utils/authValidation';
import { ROUTES } from '@/lib/routes';

export default function ResetPasswordPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { updatePassword, isConfigured } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setFormError(null);
    const { error } = await updatePassword(values.password);
    if (error) { setFormError(error); return; }
    setSuccess(true);
    setTimeout(() => navigate(ROUTES.LOGIN, { replace: true }), 2000);
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
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Set new password</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1.5">Choose a strong new password.</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-7">
          {success ? (
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={22} className="text-[var(--success)]" />
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)] mb-1">Password updated</p>
              <p className="text-xs text-[var(--text-secondary)]">Redirecting you to sign in…</p>
            </div>
          ) : (
            <>
              {!isConfigured && (
                <div className="rounded-xl border border-[var(--accent)]/20 bg-[var(--accent-muted)] p-3.5 mb-5">
                  <p className="text-xs font-medium text-[var(--accent)]">Supabase not configured</p>
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
                  <label htmlFor="password" className="text-xs font-medium text-[var(--text-secondary)]">New password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      id="password"
                      type="password"
                      placeholder="At least 8 characters"
                      disabled={!isConfigured || isSubmitting}
                      className={[
                        'w-full pl-9 pr-3 py-2.5 h-10 rounded-lg border bg-[var(--input-bg)] text-sm text-[var(--text-primary)]',
                        'placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/30',
                        errors.password ? 'border-[var(--danger)]' : 'border-[var(--border)] focus:border-[var(--accent)]',
                      ].join(' ')}
                      {...register('password')}
                    />
                  </div>
                  {errors.password && <p className="text-xs text-[var(--danger)]">{errors.password.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="confirmPassword" className="text-xs font-medium text-[var(--text-secondary)]">Confirm password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter new password"
                      disabled={!isConfigured || isSubmitting}
                      className={[
                        'w-full pl-9 pr-3 py-2.5 h-10 rounded-lg border bg-[var(--input-bg)] text-sm text-[var(--text-primary)]',
                        'placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/30',
                        errors.confirmPassword ? 'border-[var(--danger)]' : 'border-[var(--border)] focus:border-[var(--accent)]',
                      ].join(' ')}
                      {...register('confirmPassword')}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-[var(--danger)]">{errors.confirmPassword.message}</p>}
                </div>

                <Button type="submit" fullWidth loading={isSubmitting} disabled={!isConfigured} icon={<ArrowRight size={15} />} iconPosition="right" className="mt-1">
                  Update password
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
