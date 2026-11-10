import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Globe, Trash2, Moon, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { notify } from '@/components/ui/Toast';
import { ROUTES } from '@/lib/routes';

const SETTINGS_SECTIONS = [
  { icon: <Bell size={16} />,   title: 'Notifications',       description: 'Email and in-app notification preferences.', phase: 'Phase 5' },
  { icon: <Globe size={16} />,  title: 'Language & Region',   description: 'Set your preferred language and regional content.', phase: 'Phase 5' },
  { icon: <Trash2 size={16} />, title: 'Data & Deletion',     description: 'Export your data or delete your account.', phase: 'Phase 5' },
];

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    notify.success('Signed out');
    navigate(ROUTES.HOME);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-semibold text-[var(--text-primary)] mb-1">Settings</h1>
        <p className="text-[var(--text-secondary)] text-sm">Manage application and account settings.</p>
      </div>

      {/* Account summary */}
      {user && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Signed in as</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{user.email}</p>
          </div>
          <Button variant="danger" size="sm" icon={<LogOut size={13} />} onClick={handleSignOut}>Sign out</Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {SETTINGS_SECTIONS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 flex items-start gap-4 opacity-60"
          >
            <div className="w-9 h-9 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--text-secondary)]">
              {s.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{s.title}</p>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-muted)] px-1.5 py-0.5 rounded">
                  {s.phase}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{s.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick access to themes */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] shrink-0">
          <Moon size={18} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Appearance &amp; Themes</p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">Switch between all six cinematic themes.</p>
        </div>
        <Link to={ROUTES.PROFILE}>
          <Button size="sm" variant="accent-outline">Change Theme</Button>
        </Link>
      </div>
    </div>
  );
}
