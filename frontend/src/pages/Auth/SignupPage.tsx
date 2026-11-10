import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Film, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { signupSchema, type SignupFormValues } from '@/utils/authValidation';
import { ROUTES } from '@/lib/routes';

export default function SignupPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { signUp, isConfigured } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values: SignupFormValues) => {
    setFormError(null);
    const { error } = await signUp(values.email, values.password, values.displayName);
    if (error) {
      setFormError(error);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-main)' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--success)]/10 border border-[var(--success)]/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={26} className="text-[var(--success)]" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-2">Check your inbox</h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
            We've sent a confirmation link to your email. Click it to activate your account, then sign in.
          </p>
          <Link to={ROUTES.LOGIN}>
            <Button variant="accent-outline">Go to Sign In</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: 'var(--bg-main)' }}>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{ background: 'var(--accent)' }}
      />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl border border-[var(--accent)] flex items-center justify-center bg-[var(--accent-muted)]">
              <Film size={18} className="text-[var(--accent)]" />
            </div>
            <span className="font-display text-2xl font-semibold text-[var(--text-primary)]">FRAME</span>
          </Link>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Create account</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1.5">Begin your cinematic journey.</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-7">
          {!isConfigured && (
            <div className="rounded-xl border border-[var(--accent)]/20 bg-[var(--accent-muted)] p-3.5 mb-5">
              <p className="text-xs font-medium text-[var(--accent)]">Supabase not configured</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable sign-up.</p>
            </div>
          )}

          {formError && (
            <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-3.5 mb-5 flex items-start gap-2.5">
              <AlertCircle size={14} className="text-[var(--danger)] mt-0.5 shrink-0" />
              <p className="text-xs text-[var(--danger)]">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Field id="displayName" label="Display name" type="text" placeholder="Your name" icon={<User size={14} />}
              disabled={!isConfigured || isSubmitting} error={errors.displayName?.message} register={register('displayName')} />
            <Field id="email" label="Email" type="email" placeholder="you@example.com" icon={<Mail size={14} />}
              disabled={!isConfigured || isSubmitting} error={errors.email?.message} register={register('email')} />
            <Field id="password" label="Password" type="password" placeholder="At least 8 characters" icon={<Lock size={14} />}
              disabled={!isConfigured || isSubmitting} error={errors.password?.message} register={register('password')} />
            <Field id="confirmPassword" label="Confirm password" type="password" placeholder="Re-enter your password" icon={<Lock size={14} />}
              disabled={!isConfigured || isSubmitting} error={errors.confirmPassword?.message} register={register('confirmPassword')} />

            <Button type="submit" fullWidth loading={isSubmitting} disabled={!isConfigured} icon={<ArrowRight size={15} />} iconPosition="right" className="mt-1">
              Create account
            </Button>
          </form>

          <p className="text-center text-xs text-[var(--text-secondary)] mt-5">
            Have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-[var(--accent)] hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Small local field helper to keep the form body readable
function Field({
  id, label, type, placeholder, icon, disabled, error, register,
}: {
  id: string; label: string; type: string; placeholder: string; icon: React.ReactNode;
  disabled: boolean; error?: string; register: UseFormRegisterReturn;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-[var(--text-secondary)]">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">{icon}</span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={[
            'w-full pl-9 pr-3 py-2.5 h-10 rounded-lg border bg-[var(--input-bg)] text-sm text-[var(--text-primary)]',
            'placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/30',
            error ? 'border-[var(--danger)]' : 'border-[var(--border)] focus:border-[var(--accent)]',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
          ].join(' ')}
          {...register}
        />
      </div>
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
    </div>
  );
}
